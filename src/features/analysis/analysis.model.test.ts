import { describe, expect, it } from "vitest";
import {
    checkImportSelection,
    connectedAccountsText,
    connectionErrorMessage,
    gmailStartBlockedReason,
    describeStage,
    initialSelection,
    isRunActive,
    listAddresses,
    MAX_IMPORT_FILE_BYTES,
    runCapacity,
    runSizeLabel,
    selectionChanged,
    sessionAccounts,
    sortEmailsForReview,
    toggleSelection,
} from "./analysis.model";
import type { EvaluatedEmail, RunDetail, RunListItem } from "./types";

const run = (overrides: Partial<RunDetail>): RunDetail => ({
    id: "R",
    source: "gmail",
    status: "extracting",
    stageDetail: null,
    error: null,
    invocationCount: 1,
    createdAt: "2026-11-09T10:00:00Z",
    finishedAt: null,
    progress: {
        emailsTotal: 20,
        emailsReviewed: 10,
        documentsTotal: 0,
        documentsProcessed: 0,
        invoicesFound: 3,
    },
    session: null,
    ...overrides,
});

const email = (
    id: string,
    verdict: EvaluatedEmail["verdict"],
    receivedAt = "2026-11-08T10:00:00Z",
): EvaluatedEmail => ({
    id,
    gmailAccount: null,
    subject: id,
    senderName: null,
    senderEmail: `${id}@example.com`,
    receivedAt,
    attachmentCount: 0,
    verdict,
    reason: null,
    invoiceIds: [],
});

describe("run progress", () => {
    it("treats pending, ingesting and extracting as active", () => {
        expect(isRunActive("ingesting")).toBe(true);
        expect(isRunActive("awaiting_review")).toBe(false);
    });

    it("describes the stage in the person's terms with a monotonic percentage", () => {
        expect(describeStage(run({ status: "pending" })).title).toBe(
            "Getting ready",
        );
        const halfway = describeStage(run({}));
        expect(halfway).toEqual({
            title: "Reviewing 20 emails",
            detail: "10 of 20 reviewed · 3 invoices found",
            percent: 55,
        });
        const done = describeStage(
            run({
                progress: {
                    emailsTotal: 20,
                    emailsReviewed: 20,
                    documentsTotal: 0,
                    documentsProcessed: 0,
                    invoicesFound: 1,
                },
            }),
        );
        expect(done.title).toBe("Extracting invoices");
        expect(done.detail).toContain("1 invoice found");
        expect(done.percent).toBeLessThan(100);
    });
});

describe("email review", () => {
    const emails = [
        email("news", "not_invoice"),
        email("inv", "extracted"),
        email("maybe", "likely_invoice"),
    ];

    it("lists invoices first and pre-selects what was extracted", () => {
        expect(sortEmailsForReview(emails).map((item) => item.id)).toEqual([
            "inv",
            "maybe",
            "news",
        ]);
        expect([...initialSelection(emails)]).toEqual(["inv"]);
    });

    it("detects when the person changed the selection", () => {
        const initial = initialSelection(emails);
        expect(selectionChanged(emails, initial)).toBe(false);
        expect(
            selectionChanged(emails, toggleSelection(initial, "maybe")),
        ).toBe(true);
    });

    it("names every connected Gmail account under the start button", () => {
        const account = (googleEmail: string) => ({
            id: googleEmail,
            googleEmail,
            connectedAt: "2026-11-01T00:00:00Z",
        });
        expect(connectedAccountsText([])).toBe("Gmail is not connected yet");
        expect(connectedAccountsText([account("a@x.com")])).toBe(
            "Connected as a@x.com",
        );
        expect(
            connectedAccountsText([account("a@x.com"), account("b@x.com")]),
        ).toBe("Connected as a@x.com and b@x.com");
        expect(listAddresses(["a", "b", "c"])).toBe("a, b and c");
        expect(listAddresses(["a", "b", "c", "d"])).toBe("a, b and 2 more");
    });

    it("finds the inboxes a session combined", () => {
        expect(sessionAccounts(emails)).toEqual([]);
        expect(
            sessionAccounts([
                { ...email("1", "extracted"), gmailAccount: "b@x.com" },
                { ...email("2", "not_invoice"), gmailAccount: "a@x.com" },
                { ...email("3", "not_invoice"), gmailAccount: "b@x.com" },
            ]),
        ).toEqual(["a@x.com", "b@x.com"]);
    });

    it("explains Gmail connection errors", () => {
        expect(connectionErrorMessage("access_denied")).toMatch(/read access/);
        expect(connectionErrorMessage("weird")).toMatch(/Try again/);
        expect(connectionErrorMessage(null)).toBeNull();
    });
});

const listItem = (overrides: Partial<RunListItem>): RunListItem => ({
    id: "R",
    source: "gmail",
    status: "awaiting_review",
    emailsTotal: 12,
    documentsTotal: 0,
    createdAt: "2026-11-09T10:00:00Z",
    finishedAt: null,
    ...overrides,
});

const pdf = (name: string, size = 1_000, type = "application/pdf") =>
    new File([new Uint8Array(size)], name, { type });

describe("imports", () => {
    it("describes an import session by documents, not emails", () => {
        const stage = describeStage(
            run({
                source: "upload",
                progress: {
                    emailsTotal: 0,
                    emailsReviewed: 0,
                    documentsTotal: 4,
                    documentsProcessed: 2,
                    invoicesFound: 2,
                },
            }),
        );
        expect(stage).toEqual({
            title: "Reading 4 documents",
            detail: "2 of 4 done · 2 invoices found",
            percent: 53,
        });
    });

    it("accepts 1 to 10 PDFs", () => {
        const files = [pdf("a.pdf"), pdf("b.pdf")];
        expect(checkImportSelection(files)).toEqual({ kind: "valid", files });
    });

    it("rejects empty, oversized, non-PDF and too-large selections", () => {
        expect(checkImportSelection([]).kind).toBe("invalid");
        expect(
            checkImportSelection(
                Array.from({ length: 11 }, (_, index) => pdf(`${index}.pdf`)),
            ),
        ).toMatchObject({ kind: "invalid", message: /up to 10/ });
        expect(
            checkImportSelection([pdf("photo.png", 10, "image/png")]),
        ).toMatchObject({
            kind: "invalid",
            message: /photo\.png is not a PDF/,
        });
        expect(
            checkImportSelection([pdf("big.pdf", MAX_IMPORT_FILE_BYTES + 1)]),
        ).toMatchObject({ kind: "invalid", message: /20 MB/ });
    });

    it("labels a run by where its documents came from", () => {
        expect(runSizeLabel(listItem({}))).toBe("12 emails");
        expect(
            runSizeLabel(listItem({ source: "upload", documentsTotal: 1 })),
        ).toBe("1 document imported");
    });
});

describe("run capacity", () => {
    it("is reached with 3 analyses in progress, whatever their source", () => {
        const active = [
            listItem({ id: "1", status: "pending" }),
            listItem({ id: "2", status: "extracting", source: "upload" }),
        ];
        expect(runCapacity(active).isAtLimit).toBe(false);
        expect(
            runCapacity([
                ...active,
                listItem({ id: "3", status: "ingesting" }),
                listItem({ id: "4", status: "failed" }),
            ]),
        ).toEqual({
            activeCount: 3,
            limit: 3,
            isAtLimit: true,
            isGmailRunActive: true,
        });
    });

    it("explains the limit when the server refuses a run", () => {
        expect(connectionErrorMessage("RUN_LIMIT_REACHED")).toMatch(
            /3 analyses are already running/,
        );
    });
});

describe("gmail start", () => {
    it("is blocked while the inbox is already being analyzed", () => {
        const capacity = runCapacity([
            listItem({ id: "1", status: "extracting", source: "gmail" }),
        ]);
        expect(capacity.isGmailRunActive).toBe(true);
        expect(gmailStartBlockedReason(capacity)).toMatch(
            /inbox is already being analyzed/,
        );
    });

    it("is not blocked by imports or by finished Gmail runs", () => {
        const capacity = runCapacity([
            listItem({ id: "1", status: "extracting", source: "upload" }),
            listItem({ id: "2", status: "awaiting_review", source: "gmail" }),
        ]);
        expect(gmailStartBlockedReason(capacity)).toBeNull();
    });

    it("explains the rule when the server refuses a second Gmail run", () => {
        expect(connectionErrorMessage("GMAIL_RUN_ALREADY_ACTIVE")).toMatch(
            /inbox is already being analyzed/,
        );
    });
});
