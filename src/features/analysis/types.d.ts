import type { ReactNode } from "react";
import type { InvoiceSummary } from "@/features/invoices";
import type { ProductSummary } from "@/features/products";

export type RunStatus =
    "pending" | "ingesting" | "extracting" | "awaiting_review" | "failed";

/** Where a session's documents come from: the Gmail inbox, or invoices (PDFs or images) imported by hand. */
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
    /** The connected Gmail account whose inbox the email was found in. */
    gmailAccount: string | null;
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

/** One Gmail account the person linked; an analysis reads the inbox of every one of them. */
export type GmailAccount = {
    id: string;
    googleEmail: string;
    connectedAt: string;
};

/** Why the person is sent to Google: to start an analysis, or only to link another account. */
export type GmailConsentIntent = "analyze" | "connect";

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
    /** Shown only when the session mixes several inboxes; otherwise it is the same on every row. */
    showsAccount: boolean;
    isSelected: boolean;
    onToggle: (id: string) => void;
};
export type RunFailedProps = { run: RunDetail };
export type ImportedDocumentListProps = { documents: ImportedDocument[] };
export type RunHistoryProps = { runs: RunListItem[] };
export type StartButtonProps = {
    accounts: GmailAccount[];
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

/** An invoice attached in the import dialog, waiting for "Import". The id is derived from the file. */
export type StagedImportFile = {
    id: string;
    file: File;
    format: "pdf" | "image";
};

/** Each drop or pick is attached whole, or refused with a reason the person can act on. */
export type StageImportResult =
    | { kind: "added"; staged: StagedImportFile[] }
    | { kind: "rejected"; message: string };

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

/** The import dialog first asks where the invoices come from; "computer" shows the drop tray, "phone" the QR code. */
export type ImportStep = "choose" | "computer" | "phone";

/** A single-use link the computer shows as a QR code; it expires 30 minutes after it is created. */
export type PhoneUploadLink = { id: string; url: string; expiresAt: string };

export type PhoneUploadLinkStatus = "open" | "expired" | "used";

/** What the computer learns while it waits: once used, `runId` is the session the phone's invoices started. */
export type PhoneUploadLinkState = {
    id: string;
    status: PhoneUploadLinkStatus;
    runId: string | null;
    expiresAt: string;
};

export type ImportSourceDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    /** Files dropped or picked on this computer, already checked: the dialog closes and they import. */
    onFilesChosen: (files: File[]) => void;
};
export type ImportSourceOptionsProps = {
    onChooseComputer: () => void;
    onChoosePhone: () => void;
};
export type ComputerImportStepProps = {
    onFilesChosen: (files: File[]) => void;
    onBack: () => void;
};
export type StagedFileListProps = {
    staged: StagedImportFile[];
    /** Hands each row's remove button to the step, which moves focus between them. */
    registerRemoveButton: (
        id: string,
        button: HTMLButtonElement | null,
    ) => void;
    onRemove: (id: string) => void;
};
export type StagedFileRowProps = {
    item: StagedImportFile;
    onRemove: (id: string) => void;
    removeRef: (button: HTMLButtonElement | null) => void;
};
export type StagedThumbProps = { item: StagedImportFile };
export type PhoneLinkStepProps = {
    link: PhoneUploadLink | undefined;
    error: Error | null;
    onRenew: () => void;
    onBack: () => void;
};
export type PhoneImportPanelProps = {
    link: PhoneUploadLink;
    onRenew: () => void;
    onBack: () => void;
};
/** The phone step's layout, shared by the real panel and its loading placeholder. */
export type PhoneImportFrameProps = {
    code: ReactNode;
    status: ReactNode;
    link: ReactNode;
    note: ReactNode;
    onBack: () => void;
};
export type LinkStatusProps = { status: PhoneUploadLinkStatus };
export type BackButtonProps = { onBack: () => void };
export type LinkNoteProps = {
    status: PhoneUploadLinkStatus;
    expiresAt: string;
};
export type LinkCountdownProps = { expiresAt: string };
export type QrCodeProps = { value: string; label: string };
export type CopyableLinkProps = { url: string };
/** Copying to the clipboard can fail (permissions, insecure context): the person is told either way. */
export type CopyStatus = "idle" | "copied" | "failed";
