import { formatShortDate } from "@/shared/lib/dates";
import { Badge } from "@/shared/ui";
import { senderLabel, verdictLabel } from "./analysis.model";
import type { EmailReviewRowProps } from "./types";
import styles from "./EmailReview.module.css";

const TONE_TO_BADGE = {
    invoice: "success",
    warning: "warning",
    neutral: "neutral",
} as const;

export function EmailReviewRow({
    email,
    isSelected,
    onToggle,
}: EmailReviewRowProps) {
    const verdict = verdictLabel(email.verdict);
    return (
        <li className={styles.row} data-selected={isSelected}>
            <label className={styles.rowLabel}>
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggle(email.id)}
                />
                <span className={styles.subject}>
                    {email.subject ?? "(no subject)"}
                </span>
                <span className={styles.sender}>
                    {senderLabel(email)} · {formatShortDate(email.receivedAt)}
                    {email.attachmentCount > 0
                        ? ` · ${email.attachmentCount} attachment${email.attachmentCount > 1 ? "s" : ""}`
                        : ""}
                </span>
                {email.reason && (
                    <span className={styles.reason}>{email.reason}</span>
                )}
            </label>
            <Badge tone={TONE_TO_BADGE[verdict.tone]}>{verdict.label}</Badge>
        </li>
    );
}
