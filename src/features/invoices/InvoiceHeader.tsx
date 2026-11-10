import { formatMoney } from "@/shared/lib/money";
import { invoiceFields, invoiceTitle } from "./invoices.model";
import type { InvoiceHeaderProps } from "./types";
import styles from "./InvoiceHeader.module.css";

export function InvoiceHeader({ invoice }: InvoiceHeaderProps) {
    return (
        <header className={styles.header}>
            <div className={styles.identity}>
                <p
                    className={styles.vendor}
                    style={{ viewTransitionName: `invoice-${invoice.id}` }}
                >
                    {invoice.vendor.name}
                </p>
                <h2 id="invoice-title" className={styles.title}>
                    {invoiceTitle(invoice)}
                </h2>
                <dl className={styles.fields}>
                    {invoiceFields(invoice).map((field) => (
                        <div key={field.label}>
                            <dt>{field.label}</dt>
                            <dd>{field.value}</dd>
                        </div>
                    ))}
                </dl>
            </div>
            <p className={styles.total}>
                <span className={styles.totalLabel}>Total</span>
                <span className="numeric">
                    {formatMoney(invoice.totalCents, invoice.currency)}
                </span>
            </p>
        </header>
    );
}
