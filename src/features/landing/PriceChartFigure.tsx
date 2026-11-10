import { m } from "motion/react";
import { type KeyboardEvent, type PointerEvent, useState } from "react";
import { formatMoney } from "@/shared/lib/money";
import { PAPER_PRICES, PAPER_VAT_RATE } from "./landing.content";
import { nearestPointIndex, priceChart } from "./landing.model";
import styles from "./PriceChartFigure.module.css";

const chart = priceChart(PAPER_PRICES, PAPER_VAT_RATE);
const xs = chart.points.map((point) => point.x);
const euros = (cents: number) => formatMoney(cents, "EUR", "es-ES");

export function PriceChartFigure() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const active = activeIndex === null ? null : chart.points[activeIndex];
    const first = chart.points[0];
    const last = chart.points.at(-1);
    const summary =
        first && last
            ? `Price per box went from ${euros(first.netCents)} in ${first.monthName} to ${euros(last.netCents)} in ${last.monthName}. Use the arrow keys to read each month.`
            : "Price per box by month.";

    const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * chart.width;
        setActiveIndex(nearestPointIndex(xs, x));
    };

    const handleKeyDown = (event: KeyboardEvent<SVGSVGElement>) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        const step = event.key === "ArrowRight" ? 1 : -1;
        setActiveIndex((index) =>
            Math.min(
                Math.max((index ?? chart.points.length - 1) + step, 0),
                chart.points.length - 1,
            ),
        );
    };

    return (
        <figure className={styles.figure}>
            <figcaption className={styles.caption}>
                Papel A4 80 g (caja), price per box before VAT
            </figcaption>
            <div className={styles.plot}>
                <svg
                    viewBox={`0 0 ${chart.width} ${chart.height}`}
                    className={styles.svg}
                    role="img"
                    aria-label={summary}
                    tabIndex={0}
                    onPointerMove={handlePointerMove}
                    onPointerLeave={() => setActiveIndex(null)}
                    onFocus={() => setActiveIndex(chart.points.length - 1)}
                    onBlur={() => setActiveIndex(null)}
                    onKeyDown={handleKeyDown}
                >
                    {chart.ticks.map((tick) => (
                        <g key={tick.cents}>
                            <line
                                className={styles.grid}
                                x1={chart.plot.left}
                                x2={chart.plot.right}
                                y1={tick.y}
                                y2={tick.y}
                            />
                            <text
                                className={styles.axis}
                                x={chart.plot.left - 8}
                                y={tick.y}
                                textAnchor="end"
                                dominantBaseline="middle"
                            >
                                {euros(tick.cents)}
                            </text>
                        </g>
                    ))}
                    {chart.points.map((point) => (
                        <text
                            key={point.month}
                            className={styles.axis}
                            x={point.x}
                            y={chart.height - 10}
                            textAnchor="middle"
                        >
                            {point.month}
                        </text>
                    ))}
                    {active && (
                        <line
                            className={styles.crosshair}
                            x1={active.x}
                            x2={active.x}
                            y1={chart.plot.top}
                            y2={chart.plot.bottom}
                        />
                    )}
                    <m.path
                        className={styles.line}
                        d={chart.path}
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true, amount: 0.6 }}
                        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                    />
                    {chart.points.map((point, index) => (
                        <circle
                            key={point.month}
                            className={styles.marker}
                            data-active={index === activeIndex}
                            cx={point.x}
                            cy={point.y}
                            r={index === activeIndex ? 6 : 4.5}
                        />
                    ))}
                    {first && (
                        <text
                            className={styles.valueLabel}
                            x={first.x}
                            y={first.y - 14}
                            textAnchor="start"
                        >
                            {euros(first.netCents)}
                        </text>
                    )}
                    {last && (
                        <text
                            className={styles.valueLabel}
                            x={last.x + 12}
                            y={last.y}
                            dominantBaseline="middle"
                        >
                            {euros(last.netCents)}
                        </text>
                    )}
                </svg>
                {active && (
                    <div
                        className={styles.tooltip}
                        style={{
                            left: `${(active.x / chart.width) * 100}%`,
                            top: `${(active.y / chart.height) * 100}%`,
                        }}
                        aria-live="polite"
                    >
                        <strong>{active.monthName} 2026</strong>
                        <span>
                            Before VAT{" "}
                            <span className="numeric">
                                {euros(active.netCents)}
                            </span>
                        </span>
                        <span>
                            With VAT{" "}
                            <span className="numeric">
                                {euros(active.grossCents)}
                            </span>
                        </span>
                    </div>
                )}
            </div>
            <table className="visually-hidden">
                <caption>Price per box by month</caption>
                <thead>
                    <tr>
                        <th scope="col">Month</th>
                        <th scope="col">Before VAT</th>
                        <th scope="col">With VAT</th>
                    </tr>
                </thead>
                <tbody>
                    {chart.points.map((point) => (
                        <tr key={point.month}>
                            <th scope="row">{point.month}</th>
                            <td>{euros(point.netCents)}</td>
                            <td>{euros(point.grossCents)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </figure>
    );
}
