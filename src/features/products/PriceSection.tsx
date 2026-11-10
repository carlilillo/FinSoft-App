import { useState } from "react";
import { useDesign } from "@/features/design-lab";
import { SegmentedControl } from "@/shared/ui";
import { PriceHistoryChart } from "./PriceHistoryChart";
import type { PriceSectionProps, PriceSeries } from "./types";
import styles from "./ProductDetailPage.module.css";

const SERIES_OPTIONS = [
    { value: "net", label: "Excl. VAT" },
    { value: "gross", label: "Incl. VAT" },
] as const;

export function PriceSection({ points, currency }: PriceSectionProps) {
    const { design } = useDesign();
    const [series, setSeries] = useState<PriceSeries>("net");
    return (
        <section className={styles.chart} aria-labelledby="price-title">
            <div className={styles.chartHeader}>
                <h2 id="price-title" className={styles.sectionTitle}>
                    Unit price over time
                </h2>
                <SegmentedControl
                    label="Price"
                    options={SERIES_OPTIONS}
                    value={series}
                    onChange={setSeries}
                    isSpringy={design.motion !== "calm"}
                />
            </div>
            {points.length > 1 ? (
                <PriceHistoryChart
                    points={points}
                    currency={currency}
                    series={series}
                />
            ) : (
                <p className={styles.muted}>
                    The price history starts after the second purchase of this
                    product.
                </p>
            )}
        </section>
    );
}
