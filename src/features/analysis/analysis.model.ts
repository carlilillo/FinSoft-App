import type {
    EmailVerdict,
    EvaluatedEmail,
    GmailAccount,
    ImportedDocumentStatus,
    ImportSelection,
    RunCapacity,
    RunDetail,
    RunListItem,
    RunStage,
    RunStatus,
    VerdictLabel,
} from "./types";

/** Same limits the server enforces; checked here so the person hears about them before uploading. */
export const MAX_ACTIVE_RUNS = 3;
export const MAX_IMPORT_FILES = 10;
export const MAX_IMPORT_FILE_BYTES = 20 * 1024 * 1024;

const ACTIVE: ReadonlySet<RunStatus> = new Set([
    "pending",
    "ingesting",
    "extracting",
]);

export function isRunActive(status: RunStatus): boolean {
    return ACTIVE.has(status);
}

export function runCapacity(runs: RunListItem[]): RunCapacity {
    const active = runs.filter((run) => isRunActive(run.status));
    return {
        activeCount: active.length,
        limit: MAX_ACTIVE_RUNS,
        isAtLimit: active.length >= MAX_ACTIVE_RUNS,
        isGmailRunActive: active.some((run) => run.source === "gmail"),
    };
}

export const RUN_LIMIT_MESSAGE = `${MAX_ACTIVE_RUNS} analyses are already running. Start another one when one of them finishes.`;
export const GMAIL_RUN_ACTIVE_MESSAGE =
    "Your inbox is already being analyzed. You can start another analysis when it finishes.";

/** Why a Gmail analysis can't start right now (one inbox extraction at a time, 3 analyses in total), or null. */
export function gmailStartBlockedReason(capacity: RunCapacity): string | null {
    if (capacity.isGmailRunActive) return GMAIL_RUN_ACTIVE_MESSAGE;
    if (capacity.isAtLimit) return RUN_LIMIT_MESSAGE;
    return null;
}

/** Invoices can be imported as PDFs or as images: photos, scans and screenshots. */
export const IMPORT_FORMATS_LABEL =
    "PDF, JPEG, PNG, WebP, GIF, HEIC/HEIF, AVIF, TIFF or BMP";

const IMPORT_MIME_TYPES = new Set([
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/heic",
    "image/heif",
    "image/avif",
    "image/tiff",
    "image/bmp",
]);

const IMPORT_EXTENSIONS = [
    ".pdf",
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".gif",
    ".heic",
    ".heif",
    ".avif",
    ".tif",
    ".tiff",
    ".bmp",
];

/** For the file picker: phones open their photo library, desktops filter by extension. */
export const IMPORT_ACCEPT = [...IMPORT_MIME_TYPES, ...IMPORT_EXTENSIONS].join(
    ",",
);

/**
 * Browsers often report HEIC photos and some scans with an empty or generic type, so the
 * extension is checked too. The server has the final word: it reads each file's real format.
 */
function isImportable(file: File): boolean {
    if (IMPORT_MIME_TYPES.has(file.type.toLowerCase())) return true;
    const name = file.name.toLowerCase();
    return IMPORT_EXTENSIONS.some((extension) => name.endsWith(extension));
}

/** The picked files must be 1 to 10 invoices (PDFs or images) of at most 20 MB each. */
export function checkImportSelection(files: File[]): ImportSelection {
    if (files.length === 0)
        return {
            kind: "invalid",
            message: "Choose at least one invoice (PDF or image).",
        };
    if (files.length > MAX_IMPORT_FILES) {
        return {
            kind: "invalid",
            message: `You can import up to ${MAX_IMPORT_FILES} invoices at once; you chose ${files.length}.`,
        };
    }
    const unsupported = files.find((file) => !isImportable(file));
    if (unsupported) {
        return {
            kind: "invalid",
            message: `${unsupported.name} is not a PDF or a supported image. Invoices can be imported as ${IMPORT_FORMATS_LABEL}.`,
        };
    }
    const tooLarge = files.find(
        (file) => file.size === 0 || file.size > MAX_IMPORT_FILE_BYTES,
    );
    if (tooLarge) {
        return {
            kind: "invalid",
            message: `${tooLarge.name} is empty or larger than 20 MB.`,
        };
    }
    return { kind: "valid", files };
}

/** "29:41": minutes and seconds left before a phone upload link expires; never negative. */
export function formatCountdown(msLeft: number): string {
    const totalSeconds = Math.max(0, Math.ceil(msLeft / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

/** The link as people read it: "app.finsift.com/upload/…", without the protocol. */
export function displayUrl(url: string): string {
    return url.replace(/^https?:\/\//, "");
}

function invoicesFoundText(count: number): string {
    return count === 1 ? "1 invoice found" : `${count} invoices found`;
}

/** What the person sees while the analysis runs in the background; no agent internals. */
export function describeStage(run: RunDetail): RunStage {
    return run.source === "upload"
        ? describeImportStage(run)
        : describeInboxStage(run);
}

function describeImportStage(run: RunDetail): RunStage {
    const { documentsTotal, documentsProcessed, invoicesFound } = run.progress;
    if (run.status === "pending") {
        return {
            title: "Getting ready",
            detail: "Your documents are queued and will be read in a moment.",
            percent: 4,
        };
    }
    const share =
        documentsTotal === 0 ? 1 : documentsProcessed / documentsTotal;
    return {
        title: `Reading ${documentsTotal === 1 ? "1 document" : `${documentsTotal} documents`}`,
        detail: `${documentsProcessed} of ${documentsTotal} done · ${invoicesFoundText(invoicesFound)}`,
        percent: Math.min(96, Math.round(10 + share * 85)),
    };
}

function describeInboxStage(run: RunDetail): RunStage {
    const { emailsTotal, emailsReviewed, invoicesFound } = run.progress;
    if (run.status === "pending") {
        return {
            title: "Getting ready",
            detail: "Your analysis is queued and will start in a moment.",
            percent: 4,
        };
    }
    if (run.status === "ingesting") {
        return {
            title: "Fetching your emails",
            detail: "Reading last week's inbox from Gmail.",
            percent: 12,
        };
    }
    const reviewedShare = emailsTotal === 0 ? 1 : emailsReviewed / emailsTotal;
    const invoiceText = invoicesFoundText(invoicesFound);
    return {
        title:
            emailsReviewed < emailsTotal
                ? `Reviewing ${emailsTotal} emails`
                : "Extracting invoices",
        detail: `${emailsReviewed} of ${emailsTotal} reviewed · ${invoiceText}`,
        percent: Math.min(96, Math.round(15 + reviewedShare * 80)),
    };
}

const VERDICT_LABELS: Record<EmailVerdict, VerdictLabel> = {
    extracted: { label: "Invoice extracted", tone: "invoice" },
    likely_invoice: { label: "Looked like an invoice", tone: "warning" },
    user_selected: { label: "Queued by you", tone: "warning" },
    failed: { label: "Couldn't be read", tone: "warning" },
    not_invoice: { label: "Not an invoice", tone: "neutral" },
    pending: { label: "Not reviewed", tone: "neutral" },
};

export function verdictLabel(verdict: EmailVerdict): VerdictLabel {
    return VERDICT_LABELS[verdict];
}

const DOCUMENT_STATUS_LABELS: Record<ImportedDocumentStatus, VerdictLabel> = {
    extracted: { label: "Invoice extracted", tone: "invoice" },
    failed: { label: "Couldn't be read", tone: "warning" },
    not_invoice: { label: "Not an invoice", tone: "neutral" },
    pending: { label: "Not processed", tone: "neutral" },
};

export function documentStatusLabel(
    status: ImportedDocumentStatus,
): VerdictLabel {
    return DOCUMENT_STATUS_LABELS[status];
}

/** "34 emails" for an inbox analysis, "3 documents imported" for a manual import. */
export function runSizeLabel(run: RunListItem): string {
    if (run.source === "upload") {
        return run.documentsTotal === 1
            ? "1 document imported"
            : `${run.documentsTotal} documents imported`;
    }
    return run.emailsTotal === 1 ? "1 email" : `${run.emailsTotal} emails`;
}

/** Invoices first, then emails worth a second look, then the rest. */
export function sortEmailsForReview(
    emails: EvaluatedEmail[],
): EvaluatedEmail[] {
    const rank: Record<EmailVerdict, number> = {
        extracted: 0,
        likely_invoice: 1,
        failed: 1,
        user_selected: 1,
        pending: 2,
        not_invoice: 3,
    };
    return emails.toSorted(
        (a, b) =>
            rank[a.verdict] - rank[b.verdict] ||
            b.receivedAt.localeCompare(a.receivedAt),
    );
}

/** Pre-selects what the agent extracted, so the person only corrects the mistakes. */
export function initialSelection(emails: EvaluatedEmail[]): Set<string> {
    return new Set(
        emails
            .filter((email) => email.verdict === "extracted")
            .map((email) => email.id),
    );
}

export function toggleSelection(
    selection: ReadonlySet<string>,
    id: string,
): Set<string> {
    const next = new Set(selection);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
}

export function selectionChanged(
    emails: EvaluatedEmail[],
    selection: ReadonlySet<string>,
): boolean {
    const initial = initialSelection(emails);
    return (
        initial.size !== selection.size ||
        [...selection].some((id) => !initial.has(id))
    );
}

export function senderLabel(email: EvaluatedEmail): string {
    return email.senderName ?? email.senderEmail;
}

/** "a@x", "a@x and b@y", or "a@x, b@y and 2 more": long lists name the first two only. */
export function listAddresses(addresses: string[]): string {
    const [first = "", second = "", ...rest] = addresses;
    if (addresses.length <= 1) return first;
    if (addresses.length === 2) return `${first} and ${second}`;
    if (addresses.length === 3) return `${first}, ${second} and ${rest[0]}`;
    return `${first}, ${second} and ${rest.length} more`;
}

/** The note under the start button: every Gmail account the analysis will read. */
export function connectedAccountsText(accounts: GmailAccount[]): string {
    if (accounts.length === 0) return "Gmail is not connected yet";
    return `Connected as ${listAddresses(accounts.map((account) => account.googleEmail))}`;
}

/** The Gmail accounts whose inboxes fed a session, in alphabetical order. */
export function sessionAccounts(emails: EvaluatedEmail[]): string[] {
    const accounts = new Set(
        emails.flatMap((email) =>
            email.gmailAccount ? [email.gmailAccount] : [],
        ),
    );
    return [...accounts].toSorted((a, b) => a.localeCompare(b));
}

const CONNECTION_ERRORS: Record<string, string> = {
    access_denied:
        "Gmail access wasn't granted. FinSift needs read access to find your invoices.",
    INVALID_OAUTH_STATE:
        "The Google sign-in link expired. Connect Gmail again.",
    RUN_LIMIT_REACHED: RUN_LIMIT_MESSAGE,
    GMAIL_RUN_ALREADY_ACTIVE: GMAIL_RUN_ACTIVE_MESSAGE,
};

export function connectionErrorMessage(code: string | null): string | null {
    if (!code) return null;
    return CONNECTION_ERRORS[code] ?? "Gmail couldn't be connected. Try again.";
}

export function runTone(status: RunStatus): "accent" | "warning" | "neutral" {
    if (isRunActive(status)) return "accent";
    return status === "failed" ? "warning" : "neutral";
}
