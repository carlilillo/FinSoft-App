import { type Amount, formatMoney, formatPercent } from "@/shared/lib/money";
import type { PriceStatsProps } from "./types";
import styles from "./ProductDetailPage.module.css";

export function PriceStatsList({ stats }: PriceStatsProps) {
    const format = (amount: Amount) => formatMoney(amount, stats.currency);
    return (
        <dl className={styles.stats}>
            <div>
                <dt>Last price</dt>
                <dd className="numeric">{format(stats.last)}</dd>
            </div>
            <div>
                <dt>Since first purchase</dt>
                <dd className="numeric">
                    {stats.changePercent === null
                        ? "—"
                        : formatPercent(stats.changePercent)}
                </dd>
            </div>
            <div>
                <dt>Lowest</dt>
                <dd className="numeric">{format(stats.min)}</dd>
            </div>
            <div>
                <dt>Highest</dt>
                <dd className="numeric">{format(stats.max)}</dd>
            </div>
        </dl>
    );
}
