import { Link } from "react-router";
import { formatShortDate } from "@/shared/lib/dates";
import { formatMoney } from "@/shared/lib/money";
import type { RecentInvoicesProps } from "./types";
import styles from "./RecentInvoices.module.css";

export function RecentInvoices({ invoices }: RecentInvoicesProps) {
    return (
        <ol className={styles.list}>
            {invoices.map((invoice) => (
                <li key={invoice.id}>
                    <Link to={`/invoices/${invoice.id}`} className={styles.row}>
                        <span className={styles.vendor}>
                            {invoice.vendor?.name ?? "Unknown vendor"}
                        </span>
                        <time
                            className={styles.date}
                            dateTime={invoice.issueDate}
                        >
                            {formatShortDate(invoice.issueDate)}
                        </time>
                        <span className={`numeric ${styles.amount}`}>
                            {formatMoney(invoice.totalCents, invoice.currency)}
                        </span>
                    </Link>
                </li>
            ))}
        </ol>
    );
}
