import type {
    EmailRowState,
    PriceChart,
    PricePoint,
    SampleEmail,
    SampleInvoice,
    SiftProgress,
    StackPose,
} from "./types";

/** Milliseconds FinSift "spends" on each sample email. */
export const REVIEW_INTERVAL_MS = 580;

export function siftProgress(
    emails: readonly SampleEmail[],
    invoices: readonly SampleInvoice[],
    reviewed: number,
): SiftProgress {
    const done = Math.min(Math.max(reviewed, 0), emails.length);
    const found = emails
        .slice(0, done)
        .flatMap((email) =>
            invoices.filter((invoice) => invoice.id === email.invoiceId),
        );
    return {
        reviewed: done,
        total: emails.length,
        isDone: done === emails.length,
        found,
    };
}

export function emailRowState(
    email: SampleEmail,
    index: number,
    reviewed: number,
): EmailRowState {
    if (index < reviewed) return email.verdict;
    if (index === reviewed) return "scanning";
    return "waiting";
}

export function siftStatus(progress: SiftProgress): string {
    if (!progress.isDone)
        return `Reviewing ${progress.reviewed + 1} of ${progress.total} emails`;
    const count = progress.found.length;
    return `${count} ${count === 1 ? "invoice" : "invoices"} in ${progress.total} emails`;
}

/** Pose of a card in the found-invoices stack; depth 0 is the card on top, the rest peek out above. */
export function stackPose(depth: number): StackPose {
    return {
        // `|| 0` keeps the top card at 0 rather than -0.
        y: depth * -14 || 0,
        scale: 1 - depth * 0.05,
    };
}

export function grossCents(netCents: number, vatRate: number): number {
    return Math.round((netCents * (100 + vatRate)) / 100);
}

export function percentChangeBetween(points: readonly PricePoint[]): number {
    const first = points[0];
    const last = points.at(-1);
    if (!first || !last || first.netCents === 0) return 0;
    return ((last.netCents - first.netCents) / first.netCents) * 100;
}

const CHART_PADDING = { top: 28, right: 96, bottom: 34, left: 78 };

/**
 * Lays out a stepped price line in an SVG box. The y range is padded by a step either side so a
 * flat price never sits on the frame.
 */
export function priceChart(
    prices: readonly PricePoint[],
    vatRate: number,
    width = 560,
    height = 240,
): PriceChart {
    const values = prices.map((price) => price.netCents);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const step = niceStep(max - min || max * 0.1);
    const low = Math.floor(min / step) * step - step;
    const high = Math.ceil(max / step) * step + step;
    const plotWidth = width - CHART_PADDING.left - CHART_PADDING.right;
    const plotHeight = height - CHART_PADDING.top - CHART_PADDING.bottom;
    const toY = (cents: number) =>
        CHART_PADDING.top + (1 - (cents - low) / (high - low)) * plotHeight;

    const points = prices.map((price, index) => ({
        ...price,
        grossCents: grossCents(price.netCents, vatRate),
        x:
            CHART_PADDING.left +
            (prices.length === 1
                ? plotWidth / 2
                : (index / (prices.length - 1)) * plotWidth),
        y: toY(price.netCents),
    }));

    const path = points
        .map((point, index) => {
            if (index === 0) return `M ${point.x} ${point.y}`;
            return `H ${point.x} V ${point.y}`;
        })
        .join(" ");

    const ticks = [];
    for (let cents = low; cents <= high; cents += step)
        ticks.push({ y: toY(cents), cents });

    const plot = {
        left: CHART_PADDING.left,
        right: width - CHART_PADDING.right,
        top: CHART_PADDING.top,
        bottom: height - CHART_PADDING.bottom,
    };
    return { width, height, points, path, plot, ticks };
}

/** Index of the point closest to an x position, for hover. */
export function nearestPointIndex(
    xs: readonly number[],
    pointerX: number,
): number {
    let best = 0;
    xs.forEach((x, index) => {
        if (Math.abs(x - pointerX) < Math.abs((xs[best] ?? 0) - pointerX))
            best = index;
    });
    return best;
}

function niceStep(range: number): number {
    const rough = range / 3;
    const magnitude = 10 ** Math.floor(Math.log10(rough));
    const residual = rough / magnitude;
    if (residual > 5) return 10 * magnitude;
    if (residual > 2) return 5 * magnitude;
    if (residual > 1) return 2 * magnitude;
    return magnitude;
}
