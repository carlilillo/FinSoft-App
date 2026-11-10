import { formatMoney, formatPercent } from "@/shared/lib/money";
import { AnimatedNumber } from "@/shared/ui";
import { previousPeriodLabel } from "./insights.model";
import type { KpiProps, SpendHeadlineProps } from "./types";
import styles from "./SpendHeadline.module.css";

export function SpendHeadline({ overview }: SpendHeadlineProps) {
    const format = (cents: number) => formatMoney(cents, overview.currency);
    const change = overview.changePercent;

    return (
        <div className={styles.headline}>
            <p className={styles.total}>
                <AnimatedNumber value={overview.totalCents} format={format} />
            </p>
            <dl className={styles.kpis}>
                <Kpi label="Invoices">{overview.invoiceCount}</Kpi>
                <Kpi label="Average invoice">
                    {format(overview.averageCents)}
                </Kpi>
                <Kpi
                    label={`Compared with ${previousPeriodLabel(overview.range)}`}
                >
                    {change === null
                        ? "No earlier data"
                        : formatPercent(change)}
                </Kpi>
            </dl>
            {overview.otherCurrencies.length > 0 && (
                <p className={styles.note}>
                    Also spent in {overview.otherCurrencies.join(", ")}; totals
                    are never mixed across currencies.
                </p>
            )}
        </div>
    );
}

function Kpi({ label, children }: KpiProps) {
    return (
        <div className={styles.kpi}>
            <dt>{label}</dt>
            <dd className="numeric">{children}</dd>
        </div>
    );
}
