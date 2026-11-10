import { Link } from "react-router";
import { formatMoney } from "@/shared/lib/money";
import { formatQuantity, formatVatRate } from "./invoices.model";
import type { LineItemsTableProps } from "./types";
import styles from "./LineItemsTable.module.css";

export function LineItemsTable({ lines, currency }: LineItemsTableProps) {
    if (lines.length === 0)
        return (
            <p className={styles.empty}>
                No line items were extracted for this invoice.
            </p>
        );
    return (
        <div className={styles.scroll}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th scope="col">Product</th>
                        <th scope="col" className={styles.numeric}>
                            Qty
                        </th>
                        <th scope="col" className={styles.numeric}>
                            Unit (excl. VAT)
                        </th>
                        <th scope="col" className={styles.numeric}>
                            VAT
                        </th>
                        <th scope="col" className={styles.numeric}>
                            Amount
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {lines.map((line) => (
                        <tr key={line.id}>
                            <th scope="row" className={styles.product}>
                                <Link to={`/products/${line.productId}`}>
                                    {line.description}
                                </Link>
                                {line.sku && (
                                    <span className={styles.sku}>
                                        {line.sku}
                                    </span>
                                )}
                            </th>
                            <td className={`numeric ${styles.numeric}`}>
                                {formatQuantity(line)}
                            </td>
                            <td className={`numeric ${styles.numeric}`}>
                                {formatMoney(line.unitPriceNetCents, currency)}
                            </td>
                            <td className={`numeric ${styles.numeric}`}>
                                {formatVatRate(line.vatRate)}
                            </td>
                            <td
                                className={`numeric ${styles.numeric} ${styles.amount}`}
                            >
                                {formatMoney(line.lineGrossCents, currency)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
