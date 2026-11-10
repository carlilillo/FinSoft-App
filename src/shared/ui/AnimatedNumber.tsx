import { animate, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import type { AnimatedNumberProps } from "./types";

/** Renders a formatted number that counts toward new values (plain when motion is reduced). */
export function AnimatedNumber({ value, format }: AnimatedNumberProps) {
    const prefersReducedMotion = useReducedMotion();
    if (prefersReducedMotion)
        return <span className="numeric">{format(value)}</span>;
    return <TweenNumber value={value} format={format} />;
}

function TweenNumber({ value, format }: AnimatedNumberProps) {
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
