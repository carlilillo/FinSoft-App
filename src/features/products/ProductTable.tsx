import { Link } from "react-router";
import { formatDate } from "@/shared/lib/dates";
import { Counterparty } from "@/features/invoices";
import { formatMoney } from "@/shared/lib/money";
import { productColumnLabels } from "./products.model";
import type { ProductRowProps, ProductTableProps } from "./types";
import styles from "./ProductTable.module.css";

export function ProductTable({ products, filter }: ProductTableProps) {
    const labels = productColumnLabels(filter);
    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th scope="col">Product</th>
                    <th scope="col">Company</th>
                    <th scope="col">SKU</th>
                    <th scope="col" className={styles.numeric}>
                        {labels.count}
                    </th>
                    <th scope="col">{labels.last}</th>
                    <th scope="col" className={styles.numeric}>
                        Last price
                    </th>
                </tr>
            </thead>
            <tbody>
                {products.map((product) => (
                    <ProductRow key={product.id} product={product} />
                ))}
            </tbody>
        </table>
    );
}

function ProductRow({ product }: ProductRowProps) {
    return (
        <tr className={styles.row}>
            <th scope="row" className={styles.name}>
                <Link
                    to={`/products/${product.id}`}
                    viewTransition
                    className={styles.link}
                    style={{ viewTransitionName: `product-${product.id}` }}
                >
                    {product.displayName}
                </Link>
            </th>
            <td className={styles.secondary}>
                <Counterparty
                    direction={product.direction}
                    name={product.vendorName}
                />
            </td>
            <td className={styles.secondary}>{product.sku ?? "—"}</td>
            <td className={`numeric ${styles.numeric} ${styles.secondary}`}>
                {product.purchaseCount}
            </td>
            <td className={styles.secondary}>
                {product.lastPurchasedAt ? (
                    <time dateTime={product.lastPurchasedAt}>
                        {formatDate(product.lastPurchasedAt)}
                    </time>
                ) : (
                    "—"
                )}
            </td>
            <td className={`numeric ${styles.numeric} ${styles.price}`}>
                {product.lastUnitPriceNet !== null && product.lastCurrency ? (
                    <>
                        {formatMoney(
                            product.lastUnitPriceNet,
                            product.lastCurrency,
                        )}
                        {product.unit ? (
                            <span className={styles.unit}>
                                {" "}
                                / {product.unit}
                            </span>
                        ) : null}
                    </>
                ) : (
                    "—"
                )}
            </td>
        </tr>
    );
}
