import { Link } from "react-router";
import { formatDate } from "@/shared/lib/dates";
import { formatMoney } from "@/shared/lib/money";
import type { PurchaseTableProps } from "./types";
import styles from "./PurchaseTable.module.css";

/** Table view of the chart's data (every purchase, newest first). */
export function PurchaseTable({ points }: PurchaseTableProps) {
    return (
        <table className={styles.table}>
            <caption className="visually-hidden">
                Purchases of this product
            </caption>
            <thead>
                <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Invoice</th>
                    <th scope="col" className={styles.numeric}>
                        Quantity
                    </th>
                    <th scope="col" className={styles.numeric}>
                        Excl. VAT
                    </th>
                    <th scope="col" className={styles.numeric}>
                        Incl. VAT
                    </th>
                </tr>
            </thead>
            <tbody>
                {points.toReversed().map((point) => (
                    <tr key={`${point.invoiceId}-${point.unitPriceNetCents}`}>
                        <td>
                            <time dateTime={point.issueDate}>
                                {formatDate(point.issueDate)}
                            </time>
                        </td>
                        <td>
                            <Link to={`/invoices/${point.invoiceId}`}>
                                {point.invoiceNumber ?? "Receipt"}
                            </Link>
                        </td>
                        <td className={`numeric ${styles.numeric}`}>
                            {point.quantity}
                        </td>
                        <td className={`numeric ${styles.numeric}`}>
                            {formatMoney(
                                point.unitPriceNetCents,
                                point.currency,
                            )}
                        </td>
                        <td className={`numeric ${styles.numeric}`}>
                            {point.unitPriceGrossCents === null
                                ? "—"
                                : formatMoney(
                                      point.unitPriceGrossCents,
                                      point.currency,
                                  )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
