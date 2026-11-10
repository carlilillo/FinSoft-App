import { Icon } from "@/shared/ui";
import type { EmailRowProps } from "./types";
import styles from "./InboxSift.module.css";

const VERDICT_LABEL = {
    waiting: null,
    scanning: "Reading",
    invoice: "Invoice",
    skipped: "Skipped",
} as const;

export function EmailRow({ email, state }: EmailRowProps) {
    const label = VERDICT_LABEL[state];
    return (
        <li className={styles.email} data-state={state}>
            <span className={styles.sender}>{email.sender}</span>
            <span className={styles.subject}>{email.subject}</span>
            {email.attachment && (
                <span className={styles.attachment}>
                    <Icon name="invoices" size={13} />
                    <span>{email.attachment}</span>
                </span>
            )}
            <span className={styles.verdict}>{label}</span>
        </li>
    );
}
