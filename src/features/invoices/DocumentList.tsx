import { Icon } from "@/shared/ui";
import { formatFileSize } from "./invoices.model";
import type { DocumentListProps } from "./types";
import { useDocumentDownload } from "./useInvoices";
import styles from "./SidePanel.module.css";

export function DocumentList({ documents }: DocumentListProps) {
    const download = useDocumentDownload();

    return (
        <section aria-labelledby="documents-title" className={styles.panel}>
            <h2 id="documents-title" className={styles.title}>
                Documents
            </h2>
            {documents.length === 0 && (
                <p className={styles.muted}>
                    No documents stored for this invoice.
                </p>
            )}
            <ul className={styles.documents}>
                {documents.map((document) => (
                    <li key={document.id} className={styles.document}>
                        <span className={styles.fileName}>
                            {document.fileName}
                        </span>
                        <span className={styles.muted}>
                            {formatFileSize(document.sizeBytes)}
                        </span>
                        <button
                            type="button"
                            className={styles.iconButton}
                            onClick={() => download.mutate(document.id)}
                            aria-label={`Download ${document.fileName}`}
                        >
                            <Icon name="download" />
                        </button>
                    </li>
                ))}
            </ul>
            {download.isError && (
                <p className={styles.error} role="alert">
                    The download link couldn&apos;t be created. Try again.
                </p>
            )}
        </section>
    );
}
