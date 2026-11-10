import {
    SAMPLE_EMAILS,
    SAMPLE_INVOICES,
} from "@/features/landing/landing.content";
import {
    emailRowState,
    REVIEW_INTERVAL_MS,
    siftProgress,
    siftStatus,
} from "@/features/landing/landing.model";
import { useSiftSequence } from "@/features/landing/useSiftSequence";
import { EmailRow } from "./EmailRow";
import { InvoiceStack } from "./InvoiceStack";
import styles from "./InboxSift.module.css";

/** The hero's one orchestrated moment: a week of email is read, and the invoices drop into a stack. */
export function InboxSift() {
    const { reviewed, replay } = useSiftSequence(
        SAMPLE_EMAILS.length,
        REVIEW_INTERVAL_MS,
    );
    const progress = siftProgress(SAMPLE_EMAILS, SAMPLE_INVOICES, reviewed);

    return (
        <figure className={styles.sift} aria-label="A sample week of email">
            <div className={styles.inbox}>
                <div className={styles.inboxHeader}>
                    <p className={styles.inboxTitle}>Inbox, last 7 days</p>
                    <p className={styles.status} aria-live="polite">
                        {siftStatus(progress)}
                    </p>
                </div>
                <ol className={styles.emails}>
                    {SAMPLE_EMAILS.map((email, index) => (
                        <EmailRow
                            key={email.id}
                            email={email}
                            state={emailRowState(email, index, reviewed)}
                        />
                    ))}
                </ol>
                <div className={styles.progress} aria-hidden="true">
                    <span
                        style={{
                            transform: `scaleX(${progress.reviewed / progress.total})`,
                        }}
                    />
                </div>
            </div>
            <div className={styles.found}>
                <InvoiceStack invoices={progress.found} />
                {progress.isDone && (
                    <button
                        type="button"
                        className={styles.replay}
                        onClick={replay}
                    >
                        Replay
                    </button>
                )}
            </div>
        </figure>
    );
}
