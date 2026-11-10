import { type ChangeEvent, useRef } from "react";
import { Button, Icon } from "@/shared/ui";
import { formatFileSize } from "./invoices.model";
import type { DocumentListProps } from "./types";
import { useDocumentDownload, useDocumentUpload } from "./useInvoices";
import styles from "./SidePanel.module.css";

const ACCEPTED =
    "application/pdf,image/png,image/jpeg,image/webp,application/xml,text/xml";

export function DocumentList({ invoiceId, documents }: DocumentListProps) {
    const download = useDocumentDownload();
    const upload = useDocumentUpload(invoiceId);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) upload.mutate(file);
        event.target.value = "";
    };

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
            <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED}
                hidden
                onChange={handleFile}
            />
            <Button
                variant="secondary"
                isBusy={upload.isPending}
                onClick={() => inputRef.current?.click()}
            >
                <Icon name="upload" size={16} />
                {upload.isPending ? "Uploading" : "Upload a document"}
            </Button>
            {upload.isError && (
                <p className={styles.error} role="alert">
                    {upload.error.message}
                </p>
            )}
            {download.isError && (
                <p className={styles.error} role="alert">
                    The download link couldn&apos;t be created. Try again.
                </p>
            )}
        </section>
    );
}
