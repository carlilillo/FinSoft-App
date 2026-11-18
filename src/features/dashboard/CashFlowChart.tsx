import { useReducedMotion } from "motion/react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { DirectionMark } from "@/features/invoices";
import { formatShortDate } from "@/shared/lib/dates";
import { formatMoneyCompact, formatSignedMoney } from "@/shared/lib/money";
import {
    chartCaption,
    DIRECTION_SERIES_LABELS,
    visibleDirections,
} from "./insights.model";
import type {
    CashFlowChartProps,
    ChartLegendProps,
    ChartTooltipProps,
} from "./types";
import styles from "./CashFlowChart.module.css";

const ANIMATION_MS = 900;
const BAR_RADIUS = 4;

/** Each series keeps its colour whatever the filter: money in is always blue, money out always orange. */
const SERIES = {
    issued: {
        fill: "var(--chart-income)",
        radius: [BAR_RADIUS, BAR_RADIUS, 0, 0],
    },
    received: {
        fill: "var(--chart-spend)",
        radius: [0, 0, BAR_RADIUS, BAR_RADIUS],
    },
} as const;

/**
 * Daily cash flow for the selected range: what the person invoiced rises above zero, what providers billed them
 * falls below it. Each day's two bars share one column, so the gap between them reads as that day's balance.
 */
export function CashFlowChart({
    points,
    currency,
    range,
    filter,
}: CashFlowChartProps) {
    const directions = visibleDirections(filter);
    const isAnimated = !useReducedMotion();

    return (
        <figure className={styles.figure}>
            {directions.length > 1 && <ChartLegend directions={directions} />}
            <ResponsiveContainer width="100%" height={260}>
                <BarChart
                    data={points}
                    stackOffset="sign"
                    barCategoryGap="22%"
                    margin={{ top: 12, right: 8, bottom: 0, left: 0 }}
                >
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
                        tickFormatter={(amount: number) =>
                            formatMoneyCompact(amount, currency)
                        }
                        tickLine={false}
                        axisLine={false}
                        width={60}
                        tick={{ fill: "var(--color-ink-3)", fontSize: 12 }}
                    />
                    <ReferenceLine y={0} stroke="var(--color-ink-3)" />
                    <Tooltip
                        content={
                            <CashFlowTooltip
                                currency={currency}
                                filter={filter}
                            />
                        }
                        cursor={{ fill: "var(--color-surface-2)" }}
                    />
                    {directions.map((direction) => (
                        <Bar
                            key={`${direction}-${range}-${filter}`}
                            dataKey={direction}
                            name={DIRECTION_SERIES_LABELS[direction]}
                            stackId="cash-flow"
                            fill={SERIES[direction].fill}
                            radius={[...SERIES[direction].radius]}
                            maxBarSize={28}
                            isAnimationActive={isAnimated}
                            animationDuration={ANIMATION_MS}
                            animationEasing="ease-out"
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
            <figcaption className="visually-hidden">
                {chartCaption(filter, currency)}
            </figcaption>
        </figure>
    );
}

function ChartLegend({ directions }: ChartLegendProps) {
    return (
        <ul className={styles.legend}>
            {directions.map((direction) => (
                <li key={direction}>
                    <DirectionMark direction={direction} />
                    {DIRECTION_SERIES_LABELS[direction]}
                </li>
            ))}
        </ul>
    );
}

function CashFlowTooltip({
    active,
    payload,
    currency,
    filter,
}: ChartTooltipProps) {
    const point = payload?.[0]?.payload;
    if (!active || !point?.date) return null;
    const issued = point.issued ?? 0;
    const received = point.received ?? 0;
    const values = { issued, received };

    return (
        <div className={styles.tooltip}>
            <span className={styles.tooltipDate}>
                {formatShortDate(point.date)}
            </span>
            <dl className={styles.tooltipRows}>
                {visibleDirections(filter).map((direction) => (
                    <div key={direction}>
                        <dt>
                            <DirectionMark direction={direction} />
                            {DIRECTION_SERIES_LABELS[direction]}
                        </dt>
                        <dd className="numeric">
                            {formatSignedMoney(values[direction], currency)}
                        </dd>
                    </div>
                ))}
                {filter === "all" && (
                    <div className={styles.tooltipNet}>
                        <dt>Balance</dt>
                        <dd className="numeric">
                            {formatSignedMoney(issued + received, currency)}
                        </dd>
                    </div>
                )}
            </dl>
        </div>
    );
}
