import { formatMoney } from "@/shared/lib/money";
import { invoiceTotals } from "./invoices.model";
import type { InvoiceTotalsProps } from "./types";
import styles from "./InvoiceTotals.module.css";

export function InvoiceTotals({ invoice }: InvoiceTotalsProps) {
    return (
        <dl className={styles.totals}>
            {invoiceTotals(invoice).map((row) => (
                <div
                    key={row.label}
                    className={row.isTotal ? styles.grand : styles.row}
                >
                    <dt>{row.label}</dt>
                    <dd className="numeric">
                        {formatMoney(row.cents, invoice.currency)}
                    </dd>
                </div>
            ))}
        </dl>
    );
}
