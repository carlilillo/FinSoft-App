import { Link } from "react-router";
import { formatShortDate } from "@/shared/lib/dates";
import { formatMoney } from "@/shared/lib/money";
import type { ProductListProps } from "./types";
import styles from "./ProductList.module.css";

export function ProductList({ products }: ProductListProps) {
    return (
        <ul className={styles.list}>
            {products.map((product) => (
                <li key={product.id}>
                    <Link
                        to={`/products/${product.id}`}
                        viewTransition
                        className={styles.item}
                    >
                        <span
                            className={styles.name}
                            style={{
                                viewTransitionName: `product-${product.id}`,
                            }}
                        >
                            {product.displayName}
                        </span>
                        <span className={styles.meta}>
                            {product.vendorName}
                            {product.sku ? ` · ${product.sku}` : ""}
                        </span>
                        <span className={styles.price}>
                            {product.lastUnitPriceNetCents !== null &&
                            product.lastCurrency ? (
                                <span className="numeric">
                                    {formatMoney(
                                        product.lastUnitPriceNetCents,
                                        product.lastCurrency,
                                    )}
                                    {product.unit ? (
                                        <span className={styles.unit}>
                                            {" "}
                                            / {product.unit}
                                        </span>
                                    ) : null}
                                </span>
                            ) : (
                                "—"
                            )}
                        </span>
                        <span className={styles.meta}>
                            {product.purchaseCount === 1
                                ? "Bought once"
                                : `Bought ${product.purchaseCount} times`}
                            {product.lastPurchasedAt
                                ? `, last on ${formatShortDate(product.lastPurchasedAt)}`
                                : ""}
                        </span>
                    </Link>
                </li>
            ))}
        </ul>
    );
}
