import { Icon } from "@/shared/ui";
import { displayUrl } from "./analysis.model";
import type { CopyableLinkProps } from "./types";
import { useCopyToClipboard } from "./usePhoneImport";
import styles from "./PhoneImportPanel.module.css";

/** The link behind the QR code: opens in a new tab when pressed, copy button on its right. */
export function CopyableLink({ url }: CopyableLinkProps) {
    const { status, copy } = useCopyToClipboard();
    return (
        <div className={styles.linkBox}>
            <div className={styles.linkRow}>
                <Icon name="external" size={15} />
                <a
                    className={styles.url}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    title="Open the upload page in a new tab"
                >
                    {displayUrl(url)}
                </a>
                <button
                    type="button"
                    className={styles.copy}
                    data-status={status}
                    aria-label={
                        status === "copied" ? "Link copied" : "Copy link"
                    }
                    title="Copy link"
                    onClick={() => void copy(url)}
                >
                    <Icon
                        name={status === "copied" ? "check" : "copy"}
                        size={16}
                    />
                </button>
            </div>
            <p className="visually-hidden" role="status">
                {status === "copied" ? "Link copied" : ""}
            </p>
            {status === "failed" && (
                <p className={styles.copyFailed} role="alert">
                    The link couldn&apos;t be copied. Select it and copy it by
                    hand.
                </p>
            )}
        </div>
    );
}
