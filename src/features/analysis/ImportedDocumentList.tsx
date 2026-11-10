import { Link } from "react-router";
import { formatFileSize } from "@/features/invoices";
import { Badge } from "@/shared/ui";
import { documentStatusLabel } from "./analysis.model";
import type { ImportedDocumentListProps } from "./types";
import styles from "./ImportedDocumentList.module.css";

const TONE_TO_BADGE = {
    invoice: "success",
    warning: "warning",
    neutral: "neutral",
} as const;

/** What happened to each PDF of a manual import, with a way into the invoices read from it. */
export function ImportedDocumentList({ documents }: ImportedDocumentListProps) {
    return (
        <section aria-labelledby="documents-title" className={styles.documents}>
            <h2 id="documents-title" className={styles.title}>
                Imported documents
            </h2>
            <ul className={styles.list}>
                {documents.map((document) => {
                    const status = documentStatusLabel(document.status);
                    return (
                        <li key={document.id} className={styles.row}>
                            <div className={styles.text}>
                                <span className={styles.fileName}>
                                    {document.fileName}
                                </span>
                                <span className={styles.meta}>
                                    {formatFileSize(document.sizeBytes)}
                                    {document.invoiceIds.map((id, index) => (
                                        <span key={id}>
                                            {" · "}
                                            <Link to={`/invoices/${id}`}>
                                                {document.invoiceIds.length ===
                                                1
                                                    ? "Open invoice"
                                                    : `Invoice ${index + 1}`}
                                            </Link>
                                        </span>
                                    ))}
                                </span>
                                {document.reason && (
                                    <span className={styles.reason}>
                                        {document.reason}
                                    </span>
                                )}
                            </div>
                            <Badge tone={TONE_TO_BADGE[status.tone]}>
                                {status.label}
                            </Badge>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
