import { useState } from "react";
import { Button, ErrorState } from "@/shared/ui";
import {
    initialSelection,
    listAddresses,
    selectionChanged,
    sessionAccounts,
    sortEmailsForReview,
    toggleSelection,
} from "./analysis.model";
import { EmailReviewRow } from "./EmailReviewRow";
import type { EmailReviewProps } from "./types";
import { useContinueAnalysis } from "./useAnalysis";
import styles from "./EmailReview.module.css";

/** The person marks which emails really contain invoices; the same agent thread re-runs with that selection. */
export function EmailReview({ runId, emails }: EmailReviewProps) {
    const [selection, setSelection] = useState(() => initialSelection(emails));
    const [note, setNote] = useState("");
    const rerun = useContinueAnalysis(runId);
    const sorted = sortEmailsForReview(emails);
    const accounts = sessionAccounts(emails);
    const canRerun =
        selection.size > 0 &&
        (selectionChanged(emails, selection) || note.trim().length > 0);

    return (
        <section aria-labelledby="review-title" className={styles.review}>
            <div className={styles.header}>
                <h2 id="review-title" className={styles.title}>
                    Emails reviewed
                </h2>
                <p className={styles.help}>
                    Selected emails are the ones that contain invoices. Fix the
                    selection if FinSift missed or misread one, then re-run.
                </p>
                {accounts.length > 0 && (
                    <p className={styles.accounts}>
                        {accounts.length === 1
                            ? "From the inbox of "
                            : `From ${accounts.length} inboxes combined: `}
                        {listAddresses(accounts)}
                    </p>
                )}
            </div>
            <ul className={styles.list}>
                {sorted.map((email) => (
                    <EmailReviewRow
                        key={email.id}
                        email={email}
                        showsAccount={accounts.length > 1}
                        isSelected={selection.has(email.id)}
                        onToggle={(id) =>
                            setSelection((current) =>
                                toggleSelection(current, id),
                            )
                        }
                    />
                ))}
            </ul>
            <label className={styles.note}>
                Anything the analysis should know? (optional)
                <textarea
                    rows={2}
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="e.g. The Amazon email has two invoices attached"
                    maxLength={1000}
                />
            </label>
            <div className={styles.actions}>
                <Button
                    disabled={!canRerun}
                    isBusy={rerun.isPending}
                    onClick={() =>
                        rerun.mutate({
                            emailIds: [...selection],
                            note: note.trim() || undefined,
                        })
                    }
                >
                    Re-run with selected emails
                </Button>
                <span className={styles.count}>
                    {selection.size} of {emails.length} selected
                </span>
            </div>
            {rerun.isError && <ErrorState error={rerun.error} />}
        </section>
    );
}
