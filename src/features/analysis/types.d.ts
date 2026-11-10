import type { InvoiceSummary } from "@/features/invoices";
import type { ProductSummary } from "@/features/products";

export type RunStatus =
    "pending" | "ingesting" | "extracting" | "awaiting_review" | "failed";

/** Where a session's documents come from: the Gmail inbox, or PDFs imported by hand. */
export type RunSource = "gmail" | "upload";

export type ImportedDocumentStatus =
    "pending" | "extracted" | "not_invoice" | "failed";

export type EmailVerdict =
    | "pending"
    | "likely_invoice"
    | "not_invoice"
    | "user_selected"
    | "extracted"
    | "failed";

export type RunProgress = {
    emailsTotal: number;
    emailsReviewed: number;
    documentsTotal: number;
    documentsProcessed: number;
    invoicesFound: number;
};

export type CurrencyTotals = {
    currency: string;
    invoiceCount: number;
    netCents: number;
    vatCents: number;
    withholdingCents: number;
    grossCents: number;
};

export type EvaluatedEmail = {
    id: string;
    subject: string | null;
    senderName: string | null;
    senderEmail: string;
    receivedAt: string;
    attachmentCount: number;
    verdict: EmailVerdict;
    reason: string | null;
    invoiceIds: string[];
};

export type ImportedDocument = {
    id: string;
    fileName: string;
    sizeBytes: number;
    status: ImportedDocumentStatus;
    reason: string | null;
    invoiceIds: string[];
};

export type RunSession = {
    totals: CurrencyTotals[];
    invoices: InvoiceSummary[];
    products: ProductSummary[];
    emails: EvaluatedEmail[];
    documents: ImportedDocument[];
};

export type RunDetail = {
    id: string;
    source: RunSource;
    status: RunStatus;
    stageDetail: string | null;
    error: string | null;
    invocationCount: number;
    createdAt: string;
    finishedAt: string | null;
    progress: RunProgress;
    session: RunSession | null;
};

export type RunListItem = {
    id: string;
    source: RunSource;
    status: RunStatus;
    emailsTotal: number;
    documentsTotal: number;
    createdAt: string;
    finishedAt: string | null;
};

export type GmailConnection = {
    connected: boolean;
    googleEmail: string | null;
    connectedAt: string | null;
};

export type ContinueRequest = { emailIds: string[]; note?: string };

export type RunStage = { title: string; detail: string; percent: number };

export type VerdictTone = "invoice" | "neutral" | "warning";

export type VerdictLabel = { label: string; tone: VerdictTone };

export type RunPendingProps = { run: RunDetail };
export type RunSessionProps = { run: RunDetail };
export type SessionTotalsProps = { totals: CurrencyTotals[]; run: RunDetail };
export type EmailReviewProps = { runId: string; emails: EvaluatedEmail[] };
export type EmailReviewRowProps = {
    email: EvaluatedEmail;
    isSelected: boolean;
    onToggle: (id: string) => void;
};
export type RunFailedProps = { run: RunDetail };
export type ImportedDocumentListProps = { documents: ImportedDocument[] };
export type RunHistoryProps = { runs: RunListItem[] };
export type StartButtonProps = {
    isConnected: boolean;
    googleEmail: string | null;
    isBusy: boolean;
    /** Why the analysis can't start right now, or null when it can. */
    blockedReason: string | null;
    onStart: (isConnected: boolean) => void;
};

/** How many analyses may still start right now (the server allows a few in progress at once). */
export type RunCapacity = {
    activeCount: number;
    limit: number;
    isAtLimit: boolean;
    /** The inbox is being extracted right now; a second Gmail analysis can't start until it ends. */
    isGmailRunActive: boolean;
};

/** A picked set of files is either importable as-is or rejected with a reason the person can act on. */
export type ImportSelection =
    { kind: "valid"; files: File[] } | { kind: "invalid"; message: string };

export type Weekday =
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";

/** The weekly analysis the server starts on its own, on `weekday` at `hour`:00 in `timeZone`. */
export type AnalysisSchedule = {
    enabled: boolean;
    weekday: Weekday;
    hour: number;
    timeZone: string;
    /** When the next scheduled analysis starts; null while the schedule is off. */
    nextRunAt: string | null;
};

export type ScheduleUpdate = Omit<AnalysisSchedule, "nextRunAt">;

export type ScheduleTimeProps = {
    schedule: AnalysisSchedule;
    /** Gmail is disconnected: the schedule can be turned off but not moved. */
    isPaused: boolean;
    onChange: (patch: Partial<ScheduleUpdate>) => void;
};
