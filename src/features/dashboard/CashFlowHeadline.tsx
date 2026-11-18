import {
    formatMoney,
    formatPercent,
    formatSignedMoney,
    toNumber,
} from "@/shared/lib/money";
import { AnimatedNumber } from "@/shared/ui";
import { previousPeriodLabel } from "./insights.model";
import type {
    CashFlowHeadlineProps,
    KpiProps,
    OtherCurrenciesProps,
} from "./types";
import styles from "./CashFlowHeadline.module.css";

const TOTAL_LABELS = {
    balance: "balance",
    issued: "invoiced",
    received: "spent",
} as const;

/**
 * With every invoice shown, the big number is the balance (what the person invoiced minus what providers billed);
 * with one direction, that direction's total compared with the period before.
 */
export function CashFlowHeadline({ overview }: CashFlowHeadlineProps) {
    const { headline, currency } = overview;
    const format = (amount: number) => formatMoney(amount, currency);
    const formatSigned = (amount: number) =>
        formatSignedMoney(amount, currency);

    if (headline.kind === "balance") {
        return (
            <div className={styles.headline}>
                <p className={styles.total}>
                    <AnimatedNumber
                        value={headline.net}
                        format={formatSigned}
                    />
                    <span className={styles.totalLabel}>
                        {TOTAL_LABELS.balance}
                    </span>
                </p>
                <dl className={styles.kpis}>
                    <Kpi label="Invoiced">
                        {formatSignedMoney(headline.invoiced, currency)}
                    </Kpi>
                    <Kpi label="Billed by providers">
                        {formatSignedMoney(-toNumber(headline.spent), currency)}
                    </Kpi>
                    <Kpi label="Invoices">{headline.invoiceCount}</Kpi>
                </dl>
                <OtherCurrencies currencies={overview.otherCurrencies} />
            </div>
        );
    }

    const change = headline.changePercent;
    return (
        <div className={styles.headline}>
            <p className={styles.total}>
                <AnimatedNumber
                    value={toNumber(headline.total)}
                    format={format}
                />
                <span className={styles.totalLabel}>
                    {TOTAL_LABELS[headline.direction]}
                </span>
            </p>
            <dl className={styles.kpis}>
                <Kpi label="Invoices">{headline.invoiceCount}</Kpi>
                <Kpi label="Average invoice">{format(headline.average)}</Kpi>
                <Kpi
                    label={`Compared with ${previousPeriodLabel(overview.range)}`}
                >
                    {change === null
                        ? "No earlier data"
                        : formatPercent(change)}
                </Kpi>
            </dl>
            <OtherCurrencies currencies={overview.otherCurrencies} />
        </div>
    );
}

function OtherCurrencies({ currencies }: OtherCurrenciesProps) {
    if (currencies.length === 0) return null;
    return (
        <p className={styles.note}>
            Also invoices in {currencies.join(", ")}; totals are never mixed
            across currencies.
        </p>
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
