import type { InvoiceSummary } from "@/features/invoices";
import type { ProductSummary } from "@/features/products";

export type RunStatus =
    "pending" | "ingesting" | "extracting" | "awaiting_review" | "failed";

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

export type RunSession = {
    totals: CurrencyTotals[];
    invoices: InvoiceSummary[];
    products: ProductSummary[];
    emails: EvaluatedEmail[];
};

export type RunDetail = {
    id: string;
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
    status: RunStatus;
    emailsTotal: number;
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
export type RunHistoryProps = { runs: RunListItem[] };
export type StartButtonProps = {
    isConnected: boolean;
    googleEmail: string | null;
    isBusy: boolean;
    onStart: (isConnected: boolean) => void;
};
