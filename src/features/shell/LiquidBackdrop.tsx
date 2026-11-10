import { m, useReducedMotion } from "motion/react";
import { useLocation } from "react-router";
import { sectionIndex } from "./navigation";
import styles from "./LiquidBackdrop.module.css";

/** Two soft orange shapes that drift and morph to a new pose for every section (Tangerine). */
const POSES = [
    {
        x: "-8%",
        y: "-10%",
        radius: "42% 58% 63% 37% / 41% 44% 56% 59%",
        scale: 1,
    },
    {
        x: "62%",
        y: "-14%",
        radius: "58% 42% 38% 62% / 52% 61% 39% 48%",
        scale: 1.1,
    },
    {
        x: "70%",
        y: "48%",
        radius: "35% 65% 52% 48% / 62% 38% 62% 38%",
        scale: 0.9,
    },
    {
        x: "-12%",
        y: "55%",
        radius: "63% 37% 45% 55% / 38% 52% 48% 62%",
        scale: 1.05,
    },
    {
        x: "30%",
        y: "-20%",
        radius: "50% 50% 34% 66% / 56% 44% 56% 44%",
        scale: 0.95,
    },
] as const;

export function LiquidBackdrop() {
    const { pathname } = useLocation();
    const prefersReducedMotion = useReducedMotion();
    const index = sectionIndex(pathname);
    const first = POSES[index % POSES.length] ?? POSES[0];
    const second = POSES[(index + 2) % POSES.length] ?? POSES[0];
    const transition = prefersReducedMotion
        ? { duration: 0 }
        : { type: "spring" as const, stiffness: 30, damping: 14 };

    return (
        <div className={styles.backdrop} aria-hidden="true">
            <m.span
                className={styles.blob}
                animate={{
                    left: first.x,
                    top: first.y,
                    borderRadius: first.radius,
                    scale: first.scale,
                }}
                transition={transition}
            />
            <m.span
                className={`${styles.blob} ${styles.peach}`}
                animate={{
                    left: second.x,
                    top: second.y,
                    borderRadius: second.radius,
                    scale: second.scale,
                }}
                transition={transition}
            />
        </div>
    );
}
