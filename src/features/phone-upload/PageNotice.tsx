import { Button, Icon } from "@/shared/ui";
import type { PageNoticeProps } from "./types";
import styles from "./PhoneUploadPage.module.css";

/** The page's end states: invoices sent, or a link that can't take invoices. */
export function PageNotice({ tone, copy, onRetry }: PageNoticeProps) {
    return (
        <section
            className={styles.notice}
            data-tone={tone}
            role={tone === "problem" ? "alert" : "status"}
        >
            <span className={styles.noticeIcon} aria-hidden="true">
                <Icon name={tone === "success" ? "check" : "close"} size={28} />
            </span>
            <h1 className={styles.title}>{copy.title}</h1>
            <p className={styles.lead}>{copy.detail}</p>
            {onRetry && (
                <Button variant="secondary" onClick={onRetry}>
                    Try again
                </Button>
            )}
        </section>
    );
}
