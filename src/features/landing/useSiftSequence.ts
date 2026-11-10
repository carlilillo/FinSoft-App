import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const START_DELAY_MS = 900;

/**
 * Advances the hero's inbox review one email at a time. People who prefer reduced motion see
 * the finished review straight away.
 */
export function useSiftSequence(total: number, intervalMs: number) {
    const prefersReducedMotion = useReducedMotion();
    const [reviewed, setReviewed] = useState(() =>
        prefersReducedMotion ? total : 0,
    );

    useEffect(() => {
        if (reviewed >= total) return;
        const timer = window.setTimeout(
            () => setReviewed((count) => count + 1),
            reviewed === 0 ? START_DELAY_MS : intervalMs,
        );
        return () => window.clearTimeout(timer);
    }, [reviewed, total, intervalMs]);

    const replay = () => setReviewed(0);
    return { reviewed, replay };
}
