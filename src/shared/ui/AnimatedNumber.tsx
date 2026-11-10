import { animate, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { Odometer } from "./Odometer";
import type { AnimatedNumberProps } from "./types";

/**
 * Renders a formatted number. "tween" counts toward new values; "odometer" rolls each digit.
 * Both fall back to the plain value when the person prefers reduced motion.
 */
export function AnimatedNumber({
    value,
    format,
    numberStyle = "plain",
}: AnimatedNumberProps) {
    const prefersReducedMotion = useReducedMotion();
    const style = prefersReducedMotion ? "plain" : numberStyle;

    if (style === "odometer") return <Odometer text={format(value)} />;
    if (style === "tween") return <TweenNumber value={value} format={format} />;
    return <span className="numeric">{format(value)}</span>;
}

function TweenNumber({
    value,
    format,
}: Omit<AnimatedNumberProps, "numberStyle">) {
    const ref = useRef<HTMLSpanElement>(null);
    const previous = useRef(value);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;
        const controls = animate(previous.current, value, {
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
            onUpdate: (latest) => {
                node.textContent = format(Math.round(latest));
            },
        });
        previous.current = value;
        return () => controls.stop();
    }, [value, format]);

    return (
        <span ref={ref} className="numeric">
            {format(value)}
        </span>
    );
}
