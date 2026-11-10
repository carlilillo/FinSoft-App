import { formatPercent } from "@/shared/lib/money";
import { PAPER_PRICES } from "./landing.content";
import { percentChangeBetween } from "./landing.model";
import { PriceChartFigure } from "./PriceChartFigure";
import type { LandingSectionProps } from "./types";
import styles from "./PriceSection.module.css";

export function PriceSection({ id }: LandingSectionProps) {
    const change = formatPercent(percentChangeBetween(PAPER_PRICES));
    const since = PAPER_PRICES[0]?.monthName ?? "";

    return (
        <section
            id={id}
            className={styles.section}
            aria-labelledby={`${id}-title`}
        >
            <div className={styles.copy}>
                <h2 id={`${id}-title`} className={styles.title}>
                    Notice when a price creeps up
                </h2>
                <p>
                    Every product keeps its price history across invoices, with
                    and without VAT. A box of paper that costs a little more
                    each month shows up as a line going up, not a surprise at
                    the end of the quarter.
                </p>
                <p className={styles.stat}>
                    <span className="numeric">{change}</span>
                    <span>since {since}</span>
                </p>
            </div>
            <div className={styles.chart}>
                <PriceChartFigure />
            </div>
        </section>
    );
}
