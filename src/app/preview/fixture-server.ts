import type {
    AnalysisSchedule,
    RunDetail,
    RunListItem,
    ScheduleUpdate,
} from "@/features/analysis";
import type { DashboardSummary, SpendSeries } from "@/features/dashboard";
import type {
    InvoiceDetail,
    InvoicePage,
    InvoiceSummary,
} from "@/features/invoices";
import type {
    ProductDetail,
    ProductPage,
    ProductSummary,
} from "@/features/products";
import type { FixtureInvoice } from "@/app/types";
import type { ApiRequest } from "@/shared/types";
import { INVOICES, PREVIEW_RUN_ID, PRODUCTS, VENDORS } from "./fixture-data";

/**
 * In-memory stand-in for the FinSift API, used only in preview mode. It answers the same
 * paths with the same shapes, and simulates a background analysis that finishes in ~20 s.
 */
const LATENCY_MS = 350;
const RUN_DURATION_MS = 20_000;
const runStarts = new Map<string, number>([
    [PREVIEW_RUN_ID, Date.now() - 3_600_000],
]);
/** Preview imports: run id → names of the PDFs the person picked. */
const importedRuns = new Map<string, string[]>();
let isGmailConnected = true;
let schedule: ScheduleUpdate = {
    enabled: false,
    weekday: "monday",
    hour: 9,
    timeZone: "UTC",
};

export async function answerFromFixtures(
    request: ApiRequest,
): Promise<unknown> {
    await new Promise((resolve) => setTimeout(resolve, LATENCY_MS));
    const url = new URL(request.path, "http://preview.local");
    const result = route(request.method, url, request.body);
    if (result === undefined)
        throw new Error(
            `Preview mode has no fixture for ${request.method} ${url.pathname}`,
        );
    return result;
}

type Handler = (url: URL, id: string, body: unknown) => unknown;

/** First matching [method, path pattern] wins; ":id" captures the second path segment. */
const ROUTES: ReadonlyArray<[string, RegExp, Handler]> = [
    [
        "GET",
        /^\/insights\/spend$/,
        (url) =>
            spend(
                (url.searchParams.get("range") ?? "7d") as SpendSeries["range"],
            ),
    ],
    ["GET", /^\/insights\/summary$/, () => summary()],
    ["GET", /^\/invoices$/, (url) => invoicePage(url)],
    ["GET", /^\/invoices\/[^/]+$/, (_url, id) => invoiceDetail(id)],
    ["GET", /^\/products$/, (url) => productPage(url)],
    ["GET", /^\/products\/[^/]+$/, (_url, id) => productDetail(id)],
    ["GET", /^\/gmail\/connection$/, () => gmailConnection()],
    ["DELETE", /^\/gmail\/connection$/, () => disconnect()],
    [
        "POST",
        /^\/gmail\/oauth\/url$/,
        () => ({ url: `/analyses/${startRun()}` }),
    ],
    ["POST", /^\/analyses$/, () => ({ runId: startRun() })],
    [
        "POST",
        /^\/analyses\/imports$/,
        (_url, _id, body) => ({ runId: startImport(body) }),
    ],
    ["GET", /^\/analyses$/, () => runList()],
    ["POST", /^\/analyses\/[^/]+\/continue$/, (_url, id) => continueRun(id)],
    ["GET", /^\/analyses\/[^/]+$/, (_url, id) => runDetail(id)],
    [
        "GET",
        /^\/documents\/[^/]+\/download-url$/,
        () => ({
            url: "data:text/plain,Preview document",
            expiresInSeconds: 300,
        }),
    ],
    ["GET", /^\/analysis-schedule$/, () => analysisSchedule()],
    ["PUT", /^\/analysis-schedule$/, (_url, _id, body) => saveSchedule(body)],
    ["DELETE", /^\/me$/, () => null],
];

function route(method: string, url: URL, body: unknown): unknown {
    const match = ROUTES.find(
        ([routeMethod, pattern]) =>
            routeMethod === method && pattern.test(url.pathname),
    );
    return match?.[2](url, url.pathname.split("/")[2] ?? "", body);
}

function isoDaysAgo(days: number): string {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - days);
    return date.toISOString().slice(0, 10);
}

function totalsOf(invoice: FixtureInvoice) {
    const net = invoice.lines.reduce(
        (sum, line) => sum + line.quantity * line.unitNetCents,
        0,
    );
    const vat = invoice.lines.reduce(
        (sum, line) =>
            sum +
            Math.round(
                (line.quantity * line.unitNetCents * line.vatRate) / 100,
            ),
        0,
    );
    const withholding = invoice.withholdingRate
        ? Math.round((net * invoice.withholdingRate) / 100)
        : null;
    return { net, vat, withholding, total: net + vat - (withholding ?? 0) };
}

function toSummary(invoice: FixtureInvoice): InvoiceSummary {
    const vendor = VENDORS.find(
        (candidate) => candidate.id === invoice.vendorId,
    );
    const totals = totalsOf(invoice);
    return {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        issueDate: isoDaysAgo(invoice.daysAgo),
        dueDate: null,
        currency: invoice.currency,
        subtotalCents: totals.net,
        vatCents: totals.vat,
        withholdingCents: totals.withholding,
        totalCents: totals.total,
        language: invoice.language,
        runId: invoice.daysAgo < 8 ? PREVIEW_RUN_ID : null,
        vendor: vendor ? { id: vendor.id, name: vendor.name } : null,
        lineCount: invoice.lines.length,
    };
}

function sortedInvoices(): FixtureInvoice[] {
    return INVOICES.toSorted((a, b) => a.daysAgo - b.daysAgo);
}

function invoicePage(url: URL): InvoicePage {
    const search = (url.searchParams.get("search") ?? "").toLowerCase();
    const items = sortedInvoices()
        .map(toSummary)
        .filter(
            (invoice) =>
                !search ||
                `${invoice.vendor?.name} ${invoice.invoiceNumber ?? ""}`
                    .toLowerCase()
                    .includes(search),
        );
    return { items, page: 1, pageSize: 20, total: items.length };
}

function invoiceDetail(id: string): InvoiceDetail | undefined {
    const invoice = INVOICES.find((candidate) => candidate.id === id);
    const vendor = VENDORS.find(
        (candidate) => candidate.id === invoice?.vendorId,
    );
    if (!invoice || !vendor) return undefined;
    const { vendor: _ref, ...summary } = toSummary(invoice);
    return {
        ...summary,
        paymentMethod: invoice.paymentMethod,
        notes: null,
        emailId: null,
        createdAt: new Date().toISOString(),
        vendor,
        lines: invoice.lines.map((line, index) =>
            toLine(invoice.id, line, index),
        ),
        documents: [
            {
                id: `${invoice.id}-doc`,
                fileName: `${invoice.invoiceNumber ?? "ticket"}.pdf`,
                mimeType: "application/pdf",
                sizeBytes: 84_211,
                source: "email",
                createdAt: new Date().toISOString(),
            },
        ],
    };
}

function toLine(
    invoiceId: string,
    line: FixtureInvoice["lines"][number],
    index: number,
): InvoiceDetail["lines"][number] {
    const product = PRODUCTS.find(
        (candidate) => candidate.key === line.productKey,
    );
    const name = product ? product.name : line.productKey;
    const lineNet = line.quantity * line.unitNetCents;
    const lineVat = Math.round((lineNet * line.vatRate) / 100);
    return {
        id: `${invoiceId}-${index}`,
        productId: product ? product.id : "",
        productName: name,
        sku: product ? product.sku : null,
        unit: product ? product.unit : null,
        description: name,
        quantity: line.quantity,
        unitPriceNetCents: line.unitNetCents,
        unitPriceGrossCents: Math.round(
            line.unitNetCents * (1 + line.vatRate / 100),
        ),
        vatRate: line.vatRate,
        discountCents: null,
        lineNetCents: lineNet,
        lineVatCents: lineVat,
        lineGrossCents: lineNet + lineVat,
    };
}

function purchasesOf(productId: string) {
    const product = PRODUCTS.find((candidate) => candidate.id === productId);
    if (!product) return [];
    return sortedInvoices()
        .toReversed()
        .flatMap((invoice) =>
            invoice.lines
                .filter((line) => line.productKey === product.key)
                .map((line) => ({
                    invoiceId: invoice.id,
                    invoiceNumber: invoice.invoiceNumber,
                    issueDate: isoDaysAgo(invoice.daysAgo),
                    currency: invoice.currency,
                    quantity: line.quantity,
                    unitPriceNetCents: line.unitNetCents,
                    unitPriceGrossCents: Math.round(
                        line.unitNetCents * (1 + line.vatRate / 100),
                    ),
                    vatRate: line.vatRate,
                })),
        );
}

function toProductSummary(product: (typeof PRODUCTS)[number]): ProductSummary {
    const purchases = purchasesOf(product.id);
    const last = purchases.at(-1);
    const base = {
        id: product.id,
        displayName: product.name,
        sku: product.sku,
        unit: product.unit,
        vendorId: product.vendorId,
        vendorName:
            VENDORS.find((vendor) => vendor.id === product.vendorId)?.name ??
            "",
        purchaseCount: purchases.length,
    };
    if (!last) {
        return {
            ...base,
            lastUnitPriceNetCents: null,
            lastUnitPriceGrossCents: null,
            lastCurrency: null,
            lastPurchasedAt: null,
        };
    }
    return {
        ...base,
        lastUnitPriceNetCents: last.unitPriceNetCents,
        lastUnitPriceGrossCents: last.unitPriceGrossCents,
        lastCurrency: last.currency,
        lastPurchasedAt: last.issueDate,
    };
}

function productPage(url: URL): ProductPage {
    const search = (url.searchParams.get("search") ?? "").toLowerCase();
    const items = PRODUCTS.map(toProductSummary).filter(
        (product) =>
            !search ||
            `${product.displayName} ${product.vendorName}`
                .toLowerCase()
                .includes(search),
    );
    return { items, page: 1, pageSize: 30, total: items.length };
}

function productDetail(id: string): ProductDetail | undefined {
    const product = PRODUCTS.find((candidate) => candidate.id === id);
    return product
        ? { ...toProductSummary(product), priceHistory: purchasesOf(id) }
        : undefined;
}

function spend(range: SpendSeries["range"]): SpendSeries {
    const days = { "7d": 7, "14d": 14, "30d": 30 }[range];
    const dates = Array.from({ length: days }, (_, index) =>
        isoDaysAgo(days - 1 - index),
    );
    const byCurrency = new Map<string, SpendSeries["currencies"][number]>();
    for (const invoice of INVOICES.map(toSummary)) {
        const entry = byCurrency.get(invoice.currency) ?? {
            currency: invoice.currency,
            totalCents: 0,
            previousTotalCents: 0,
            invoiceCount: 0,
            days: dates.map((date) => ({ date, totalCents: 0 })),
        };
        byCurrency.set(invoice.currency, entry);
        const day = entry.days.find(
            (bucket) => bucket.date === invoice.issueDate,
        );
        if (day) {
            day.totalCents += invoice.totalCents;
            entry.totalCents += invoice.totalCents;
            entry.invoiceCount += 1;
        } else if (invoice.issueDate >= isoDaysAgo(2 * days - 1)) {
            entry.previousTotalCents += invoice.totalCents;
        }
    }
    return {
        range,
        from: dates[0] ?? "",
        to: dates.at(-1) ?? "",
        currencies: [...byCurrency.values()].sort(
            (a, b) => b.totalCents - a.totalCents,
        ),
    };
}

function summary(): DashboardSummary {
    return {
        invoiceCount: INVOICES.length,
        recentInvoices: sortedInvoices().slice(0, 5).map(toSummary),
    };
}

function gmailConnection() {
    return {
        connected: isGmailConnected,
        googleEmail: isGmailConnected ? "lucia.moreno@gmail.com" : null,
        connectedAt: isGmailConnected ? isoDaysAgo(12) : null,
    };
}

function disconnect(): null {
    isGmailConnected = false;
    return null;
}

function startRun(): string {
    isGmailConnected = true;
    const id = `01JR${String(Date.now()).padStart(22, "0")}`.slice(0, 26);
    runStarts.set(id, Date.now());
    return id;
}

function startImport(body: unknown): string {
    const files =
        body instanceof FormData
            ? body
                  .getAll("files")
                  .flatMap((file) => (file instanceof File ? [file.name] : []))
            : [];
    const id = startRun();
    importedRuns.set(id, files);
    return id;
}

function continueRun(id: string) {
    runStarts.set(id, Date.now() - 8_000);
    return { runId: id };
}

function runStatus(elapsed: number, isImport: boolean): RunDetail["status"] {
    if (elapsed < 3_000) return "pending";
    if (elapsed < 8_000) return isImport ? "extracting" : "ingesting";
    if (elapsed < RUN_DURATION_MS) return "extracting";
    return "awaiting_review";
}

function runDetail(id: string): RunDetail {
    const startedAt = runStarts.get(id) ?? Date.now() - 3_600_000;
    const elapsed = Date.now() - startedAt;
    const importedFiles = importedRuns.get(id);
    const status = runStatus(elapsed, importedFiles !== undefined);
    const share = Math.min(
        1,
        Math.max(0, (elapsed - 8_000) / (RUN_DURATION_MS - 8_000)),
    );
    const sessionInvoices = sortedInvoices()
        .filter((invoice) => invoice.daysAgo < 8)
        .map(toSummary)
        .slice(0, importedFiles?.length);
    const emailsTotal = importedFiles ? 0 : 34;
    const documentsTotal = importedFiles?.length ?? 0;
    const base = {
        id,
        source: importedFiles ? ("upload" as const) : ("gmail" as const),
        status,
        stageDetail: null,
        error: null,
        invocationCount: 1,
        createdAt: new Date(startedAt).toISOString(),
        finishedAt:
            status === "awaiting_review"
                ? new Date(startedAt + RUN_DURATION_MS).toISOString()
                : null,
        progress: {
            emailsTotal,
            emailsReviewed: Math.round(emailsTotal * share),
            documentsTotal,
            documentsProcessed: Math.round(documentsTotal * share),
            invoicesFound: Math.round(sessionInvoices.length * share),
        },
    };
    if (status !== "awaiting_review") return { ...base, session: null };
    const session = previewSession(sessionInvoices);
    return importedFiles
        ? {
              ...base,
              session: {
                  ...session,
                  emails: [],
                  documents: previewDocuments(importedFiles, sessionInvoices),
              },
          }
        : { ...base, session };
}

function previewDocuments(
    fileNames: string[],
    invoices: InvoiceSummary[],
): NonNullable<RunDetail["session"]>["documents"] {
    return fileNames.map((fileName, index) => {
        const invoice = invoices[index];
        return {
            id: `01JI${String(index).padStart(22, "0")}`,
            fileName,
            sizeBytes: 84_211,
            status: invoice ? "extracted" : "not_invoice",
            reason: invoice ? null : "This document is not an invoice.",
            invoiceIds: invoice ? [invoice.id] : [],
        };
    });
}

function previewSession(
    invoices: InvoiceSummary[],
): NonNullable<RunDetail["session"]> {
    const totals = new Map<
        string,
        NonNullable<RunDetail["session"]>["totals"][number]
    >();
    for (const invoice of invoices) {
        const entry = totals.get(invoice.currency) ?? {
            currency: invoice.currency,
            invoiceCount: 0,
            netCents: 0,
            vatCents: 0,
            withholdingCents: 0,
            grossCents: 0,
        };
        entry.invoiceCount += 1;
        entry.netCents += invoice.subtotalCents;
        entry.vatCents += invoice.vatCents;
        entry.withholdingCents += invoice.withholdingCents ?? 0;
        entry.grossCents += invoice.totalCents;
        totals.set(invoice.currency, entry);
    }
    const subjects = [
        [
            "Factura FV-2026/118 - Papelería Martínez",
            "Papelería Martínez S.L.",
            "extracted",
            "Mentions an attached invoice (factura) with a PDF.",
        ],
        [
            "Your receipt from Brew & Bean",
            "Brew & Bean Coffee",
            "extracted",
            "Purchase receipt with an image attachment.",
        ],
        [
            "Su ticket de compra",
            "Mercadona",
            "extracted",
            "Digital purchase ticket with amounts.",
        ],
        [
            "Tu factura de luz de octubre",
            "Iberdrola",
            "extracted",
            "Electricity bill attached as PDF.",
        ],
        [
            "Your Figma invoice",
            "Figma",
            "extracted",
            "Subscription renewal with amount charged.",
        ],
        [
            "Presupuesto reforma cocina",
            "Reformas Ruiz",
            "not_invoice",
            "A quote (presupuesto), not yet billed.",
        ],
        [
            "This week in design: 10 tools",
            "Design Weekly",
            "not_invoice",
            "Newsletter.",
        ],
        [
            "Tu pedido está en camino",
            "Envíos Rápidos",
            "not_invoice",
            "Shipping update without amounts.",
        ],
    ] as const;
    return {
        totals: [...totals.values()],
        documents: [],
        invoices,
        products: PRODUCTS.slice(0, 6).map(toProductSummary),
        emails: subjects.map(([subject, sender, verdict, reason], index) => ({
            id: `01JE${String(index).padStart(22, "0")}`,
            subject,
            senderName: sender,
            senderEmail: `hello@${sender.toLowerCase().replace(/[^a-z]+/g, "")}.example`,
            receivedAt: new Date(
                Date.now() - (index + 1) * 18 * 3_600_000,
            ).toISOString(),
            attachmentCount: verdict === "extracted" ? 1 : 0,
            verdict,
            reason,
            invoiceIds:
                verdict === "extracted" ? [invoices[index]?.id ?? ""] : [],
        })),
    };
}

function runList(): RunListItem[] {
    return [...runStarts.keys()]
        .map((id) => runDetail(id))
        .map((run) => ({
            id: run.id,
            source: run.source,
            status: run.status,
            emailsTotal: run.progress.emailsTotal,
            documentsTotal: run.progress.documentsTotal,
            createdAt: run.createdAt,
            finishedAt: run.finishedAt,
        }))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function analysisSchedule(): AnalysisSchedule {
    return { ...schedule, nextRunAt: nextWeeklyRun(schedule) };
}

function saveSchedule(body: unknown): AnalysisSchedule {
    schedule = body as ScheduleUpdate;
    return analysisSchedule();
}

/** Close enough for preview: the next matching day and hour in the browser's own zone. */
function nextWeeklyRun(update: ScheduleUpdate): string | null {
    if (!update.enabled) return null;
    const days = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
    ];
    const next = new Date();
    next.setHours(update.hour, 0, 0, 0);
    const ahead = (days.indexOf(update.weekday) - next.getDay() + 7) % 7;
    next.setDate(next.getDate() + ahead);
    if (next.getTime() <= Date.now()) next.setDate(next.getDate() + 7);
    return next.toISOString();
}
