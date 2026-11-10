import { InvoiceTable } from "@/features/invoices";
import { ProductList } from "@/features/products";
import { EmptyState } from "@/shared/ui";
import { EmailReview } from "./EmailReview";
import { SessionTotals } from "./SessionTotals";
import type { RunSessionProps } from "./types";
import styles from "./RunSessionView.module.css";

export function RunSessionView({ run }: RunSessionProps) {
    const session = run.session;
    if (!session) return null;
    return (
        <div className={styles.session}>
            {run.status === "failed" && (
                <p className={styles.failed} role="alert">
                    {run.error ?? "The analysis stopped before finishing."}{" "}
                    Everything found so far is shown below.
                </p>
            )}
            <SessionTotals totals={session.totals} run={run} />
            <section aria-labelledby="session-invoices">
                <h2 id="session-invoices" className={styles.sectionTitle}>
                    Extracted invoices
                </h2>
                {session.invoices.length > 0 ? (
                    <InvoiceTable invoices={session.invoices} />
                ) : (
                    <EmptyState title="No invoices were found in this session">
                        If an email does contain an invoice, select it below and
                        re-run the analysis.
                    </EmptyState>
                )}
            </section>
            {session.products.length > 0 && (
                <section aria-labelledby="session-products">
                    <h2 id="session-products" className={styles.sectionTitle}>
                        Products
                    </h2>
                    <ProductList products={session.products} />
                </section>
            )}
            <EmailReview runId={run.id} emails={session.emails} />
        </div>
    );
}
