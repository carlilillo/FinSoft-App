import { Link } from "react-router";
import { formatDate } from "@/shared/lib/dates";
import { formatMoney } from "@/shared/lib/money";
import type { ProductRowProps, ProductTableProps } from "./types";
import styles from "./ProductTable.module.css";

export function ProductTable({ products }: ProductTableProps) {
    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th scope="col">Product</th>
                    <th scope="col">Vendor</th>
                    <th scope="col">SKU</th>
                    <th scope="col" className={styles.numeric}>
                        Purchases
                    </th>
                    <th scope="col">Last bought</th>
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
            <td className={styles.secondary}>{product.vendorName}</td>
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
