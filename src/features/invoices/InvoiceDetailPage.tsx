import { useParams } from "react-router";
import { useDesign } from "@/features/design-lab";
import { ErrorState, PageHeader, Skeleton } from "@/shared/ui";
import { DocumentList } from "./DocumentList";
import { InvoiceHeader } from "./InvoiceHeader";
import { InvoiceTotals } from "./InvoiceTotals";
import { LineItemsTable } from "./LineItemsTable";
import { useInvoice } from "./useInvoices";
import { VendorPanel } from "./VendorPanel";
import styles from "./InvoiceDetailPage.module.css";

export function InvoiceDetailPage() {
    const { invoiceId = "" } = useParams();
    const { design } = useDesign();
    const query = useInvoice(invoiceId);
    const back = {
        to: "/invoices",
        label: "Invoices",
        viewTransition: design.motion === "fluid",
    };

    if (query.isPending) {
        return (
            <>
                <PageHeader title="Invoice" back={back} />
                <Skeleton lines={10} height="1.5rem" />
            </>
        );
    }
    if (query.isError) {
        return (
            <>
                <PageHeader title="Invoice" back={back} />
                <ErrorState
                    error={query.error}
                    onRetry={() => void query.refetch()}
                />
            </>
        );
    }

    const invoice = query.data;
    return (
        <>
            <PageHeader title="Invoice" back={back} />
            <article className={styles.sheet} aria-labelledby="invoice-title">
                <InvoiceHeader invoice={invoice} />
                <div className={styles.columns}>
                    <section
                        aria-labelledby="lines-title"
                        className={styles.lines}
                    >
                        <h2 id="lines-title" className={styles.sectionTitle}>
                            Products
                        </h2>
                        <LineItemsTable
                            lines={invoice.lines}
                            currency={invoice.currency}
                        />
                        <InvoiceTotals invoice={invoice} />
                    </section>
                    <aside className={styles.side}>
                        <VendorPanel vendor={invoice.vendor} />
                        <DocumentList
                            invoiceId={invoice.id}
                            documents={invoice.documents}
                        />
                        {invoice.notes && (
                            <section aria-labelledby="notes-title">
                                <h2
                                    id="notes-title"
                                    className={styles.sectionTitle}
                                >
                                    Notes
                                </h2>
                                <p className={styles.notes}>{invoice.notes}</p>
                            </section>
                        )}
                    </aside>
                </div>
            </article>
        </>
    );
}
