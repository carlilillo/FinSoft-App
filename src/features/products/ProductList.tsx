import { Link } from "react-router";
import { useDesign } from "@/features/design-lab";
import { formatShortDate } from "@/shared/lib/dates";
import { formatMoney } from "@/shared/lib/money";
import { PointerGlow } from "@/shared/ui";
import type { ProductListProps } from "./types";
import styles from "./ProductList.module.css";

export function ProductList({ products }: ProductListProps) {
    const { design } = useDesign();
    const isFluid = design.motion === "fluid";
    return (
        <PointerGlow>
            <ul className={styles.list}>
                {products.map((product) => (
                    <li key={product.id}>
                        <Link
                            to={`/products/${product.id}`}
                            viewTransition={isFluid}
                            className={styles.item}
                        >
                            <span
                                className={styles.name}
                                style={
                                    isFluid
                                        ? {
                                              viewTransitionName: `product-${product.id}`,
                                          }
                                        : undefined
                                }
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
        </PointerGlow>
    );
}
