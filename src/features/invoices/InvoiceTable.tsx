import { Link } from "react-router";
import { formatDate } from "@/shared/lib/dates";
import { formatMoney } from "@/shared/lib/money";
import { invoiceTitle } from "./invoices.model";
import type { InvoiceRowProps, InvoiceTableProps } from "./types";
import styles from "./InvoiceTable.module.css";

export function InvoiceTable({ invoices }: InvoiceTableProps) {
    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th scope="col">Vendor</th>
                    <th scope="col">Invoice</th>
                    <th scope="col">Issued</th>
                    <th scope="col" className={styles.numeric}>
                        VAT
                    </th>
                    <th scope="col" className={styles.numeric}>
                        Total
                    </th>
                </tr>
            </thead>
            <tbody>
                {invoices.map((invoice) => (
                    <InvoiceRow key={invoice.id} invoice={invoice} />
                ))}
            </tbody>
        </table>
    );
}

function InvoiceRow({ invoice }: InvoiceRowProps) {
    return (
        <tr className={styles.row}>
            <th scope="row" className={styles.vendor}>
                <Link
                    to={`/invoices/${invoice.id}`}
                    viewTransition
                    className={styles.link}
                    style={{ viewTransitionName: `invoice-${invoice.id}` }}
                >
                    {invoice.vendor?.name ?? "Unknown vendor"}
                </Link>
            </th>
            <td className={styles.secondary}>{invoiceTitle(invoice)}</td>
            <td className={styles.secondary}>
                <time dateTime={invoice.issueDate}>
                    {formatDate(invoice.issueDate)}
                </time>
            </td>
            <td className={`numeric ${styles.numeric} ${styles.secondary}`}>
                {formatMoney(invoice.vatCents, invoice.currency)}
            </td>
            <td className={`numeric ${styles.numeric} ${styles.total}`}>
                {formatMoney(invoice.totalCents, invoice.currency)}
            </td>
        </tr>
    );
}
