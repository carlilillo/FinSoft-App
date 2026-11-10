import { useDesign } from "@/features/design-lab";
import { formatMoney, formatPercent } from "@/shared/lib/money";
import { AnimatedNumber, type NumberStyle } from "@/shared/ui";
import { previousPeriodLabel } from "./insights.model";
import type { KpiProps, SpendHeadlineProps } from "./types";
import styles from "./SpendHeadline.module.css";

const NUMBER_STYLE = {
    calm: "plain",
    soft: "tween",
    fluid: "tween",
    expressive: "odometer",
} as const satisfies Record<string, NumberStyle>;

export function SpendHeadline({ overview }: SpendHeadlineProps) {
    const { design } = useDesign();
    const format = (cents: number) => formatMoney(cents, overview.currency);
    const change = overview.changePercent;

    return (
        <div className={styles.headline}>
            <p className={styles.total}>
                <AnimatedNumber
                    value={overview.totalCents}
                    format={format}
                    numberStyle={NUMBER_STYLE[design.motion]}
                />
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
