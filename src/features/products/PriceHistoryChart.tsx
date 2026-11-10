import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { useDesign } from "@/features/design-lab";
import { formatShortDate } from "@/shared/lib/dates";
import { formatMoney, formatMoneyCompact } from "@/shared/lib/money";
import type { PriceHistoryChartProps, PriceTooltipProps } from "./types";
import styles from "./PriceHistoryChart.module.css";

const ANIMATION_MS = {
    calm: 450,
    soft: 700,
    fluid: 1200,
    expressive: 1400,
} as const;
const SERIES_COLOR = {
    net: "var(--chart-1)",
    gross: "var(--chart-2)",
} as const;

/** Unit price over time; a stepped line because a price holds until the next purchase. */
export function PriceHistoryChart({
    points,
    currency,
    series,
}: PriceHistoryChartProps) {
    const { design } = useDesign();
    return (
        <figure className={styles.figure}>
            <ResponsiveContainer width="100%" height={280}>
                <LineChart
                    data={points}
                    margin={{ top: 16, right: 16, bottom: 0, left: 0 }}
                >
                    <CartesianGrid
                        vertical={false}
                        stroke="var(--chart-grid)"
                    />
                    <XAxis
                        dataKey="date"
                        tickFormatter={(date: string) => formatShortDate(date)}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "var(--color-ink-3)", fontSize: 12 }}
                        minTickGap={24}
                    />
                    <YAxis
                        tickFormatter={(cents: number) =>
                            formatMoneyCompact(cents, currency)
                        }
                        tickLine={false}
                        axisLine={false}
                        width={56}
                        domain={["auto", "auto"]}
                        tick={{ fill: "var(--color-ink-3)", fontSize: 12 }}
                    />
                    <Tooltip
                        content={<PriceTooltip currency={currency} />}
                        cursor={{
                            stroke: "var(--color-ink-3)",
                            strokeDasharray: "3 3",
                        }}
                    />
                    <Line
                        key={series}
                        type="stepAfter"
                        dataKey={series}
                        stroke={SERIES_COLOR[series]}
                        strokeWidth={2}
                        connectNulls
                        dot={{
                            r: 4,
                            strokeWidth: 2,
                            stroke: "var(--color-surface)",
                            fill: SERIES_COLOR[series],
                        }}
                        activeDot={{
                            r: 6,
                            strokeWidth: 2,
                            stroke: "var(--color-surface)",
                        }}
                        animationDuration={ANIMATION_MS[design.motion]}
                        animationEasing="ease-out"
                    />
                </LineChart>
            </ResponsiveContainer>
            <figcaption className="visually-hidden">
                Unit price per purchase in {currency}
            </figcaption>
        </figure>
    );
}

function PriceTooltip({ active, payload, currency }: PriceTooltipProps) {
    const point = payload?.[0];
    if (!active || !point?.payload) return null;
    return (
        <div className={styles.tooltip}>
            <span>
                {formatShortDate(point.payload.date)}
                {point.payload.invoiceNumber
                    ? ` · ${point.payload.invoiceNumber}`
                    : ""}
            </span>
            <strong className="numeric">
                {formatMoney(Number(point.value ?? 0), currency)}
            </strong>
        </div>
    );
}
