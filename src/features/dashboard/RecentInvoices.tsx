import { Link } from "react-router";
import { Counterparty, signedTotal } from "@/features/invoices";
import { formatShortDate } from "@/shared/lib/dates";
import { formatSignedMoney } from "@/shared/lib/money";
import type { RecentInvoicesProps } from "./types";
import styles from "./RecentInvoices.module.css";

/** Newest invoices first: what the person issued adds (+), what providers billed them subtracts (−). */
export function RecentInvoices({ invoices }: RecentInvoicesProps) {
    return (
        <ol className={styles.list}>
            {invoices.map((invoice) => (
                <li key={invoice.id}>
                    <Link to={`/invoices/${invoice.id}`} className={styles.row}>
                        <span className={styles.vendor}>
                            <Counterparty
                                direction={invoice.direction}
                                name={invoice.vendor?.name ?? "Unknown company"}
                            />
                        </span>
                        <time
                            className={styles.date}
                            dateTime={invoice.issueDate}
                        >
                            {formatShortDate(invoice.issueDate)}
                        </time>
                        <span className={`numeric ${styles.amount}`}>
                            {formatSignedMoney(
                                signedTotal(invoice),
                                invoice.currency,
                            )}
                        </span>
                    </Link>
                </li>
            ))}
        </ol>
    );
}
