import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { useDesign } from "@/features/design-lab";
import { formatShortDate } from "@/shared/lib/dates";
import { formatMoney, formatMoneyCompact } from "@/shared/lib/money";
import type { ChartTooltipProps, SpendChartProps } from "./types";
import styles from "./SpendChart.module.css";

const ANIMATION_MS = {
    calm: 450,
    soft: 700,
    fluid: 1100,
    expressive: 1300,
} as const;

/** Daily spend for the selected range; one series, so the section title names it and no legend is shown. */
export function SpendChart({ days, currency, range }: SpendChartProps) {
    const { design } = useDesign();
    const gradientId = `spend-fill-${design.id}`;
    return (
        <figure className={styles.figure}>
            <ResponsiveContainer width="100%" height={260}>
                <AreaChart
                    data={days}
                    margin={{ top: 12, right: 8, bottom: 0, left: 0 }}
                >
                    <defs>
                        <linearGradient
                            id={gradientId}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="0%"
                                stopColor="var(--chart-1)"
                                stopOpacity={0.28}
                            />
                            <stop
                                offset="100%"
                                stopColor="var(--chart-1)"
                                stopOpacity={0}
                            />
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        vertical={false}
                        stroke="var(--chart-grid)"
                        strokeDasharray="0"
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
                        tick={{ fill: "var(--color-ink-3)", fontSize: 12 }}
                    />
                    <Tooltip
                        content={<SpendTooltip currency={currency} />}
                        cursor={{
                            stroke: "var(--color-ink-3)",
                            strokeDasharray: "3 3",
                        }}
                    />
                    <Area
                        key={range}
                        type="monotone"
                        dataKey="totalCents"
                        stroke="var(--chart-1)"
                        strokeWidth={2}
                        fill={`url(#${gradientId})`}
                        activeDot={{
                            r: 5,
                            stroke: "var(--color-surface)",
                            strokeWidth: 2,
                            fill: "var(--chart-1)",
                        }}
                        animationDuration={ANIMATION_MS[design.motion]}
                        animationEasing="ease-out"
                    />
                </AreaChart>
            </ResponsiveContainer>
            <figcaption className="visually-hidden">
                Daily spend in {currency} for the selected period
            </figcaption>
        </figure>
    );
}

function SpendTooltip({ active, payload, currency }: ChartTooltipProps) {
    const point = payload?.[0];
    if (!active || !point?.payload?.date) return null;
    return (
        <div className={styles.tooltip}>
            <span>{formatShortDate(point.payload.date)}</span>
            <strong className="numeric">
                {formatMoney(Number(point.value ?? 0), currency)}
            </strong>
        </div>
    );
}
