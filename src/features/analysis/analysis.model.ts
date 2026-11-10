import type {
    EmailVerdict,
    EvaluatedEmail,
    RunDetail,
    RunStage,
    RunStatus,
    VerdictLabel,
} from "./types";

const ACTIVE: ReadonlySet<RunStatus> = new Set([
    "pending",
    "ingesting",
    "extracting",
]);

export function isRunActive(status: RunStatus): boolean {
    return ACTIVE.has(status);
}

/** What the person sees while the analysis runs in the background; no agent internals. */
export function describeStage(run: RunDetail): RunStage {
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
    const invoiceText =
        invoicesFound === 1
            ? "1 invoice found"
            : `${invoicesFound} invoices found`;
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

const CONNECTION_ERRORS: Record<string, string> = {
    access_denied:
        "Gmail access wasn't granted. FinSift needs read access to find your invoices.",
    INVALID_OAUTH_STATE:
        "The Google sign-in link expired. Connect Gmail again.",
    RUN_ALREADY_ACTIVE:
        "An analysis is already running. Open it from the list below.",
};

export function connectionErrorMessage(code: string | null): string | null {
    if (!code) return null;
    return CONNECTION_ERRORS[code] ?? "Gmail couldn't be connected. Try again.";
}

export function runTone(status: RunStatus): "accent" | "warning" | "neutral" {
    if (isRunActive(status)) return "accent";
    return status === "failed" ? "warning" : "neutral";
}
