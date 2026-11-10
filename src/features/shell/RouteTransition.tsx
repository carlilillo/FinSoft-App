import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useLocation } from "react-router";
import { useDesign } from "@/features/design-lab";
import type { MotionProfile } from "@/features/design-lab";
import type { PageVariant, RouteTransitionProps } from "./types";

const VARIANTS: Record<Exclude<MotionProfile, "fluid">, PageVariant> = {
    calm: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.14 },
    },
    soft: {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -6 },
        transition: { type: "spring", stiffness: 260, damping: 30 },
    },
    expressive: {
        initial: { opacity: 0, y: 40, scale: 0.96, rotateX: 6 },
        animate: { opacity: 1, y: 0, scale: 1, rotateX: 0 },
        exit: { opacity: 0, y: -16, scale: 0.94, filter: "blur(4px)" },
        transition: { type: "spring", stiffness: 240, damping: 24 },
    },
};

/**
 * Page enter/exit per design. Flow pages are animated by the browser's View Transitions instead
 * (horizontal slide + shared elements), so no JS animation runs for it.
 */
export function RouteTransition({ children }: RouteTransitionProps) {
    const { design } = useDesign();
    const location = useLocation();
    const prefersReducedMotion = useReducedMotion();

    if (design.motion === "fluid" || prefersReducedMotion)
        return <>{children}</>;
    const variant = VARIANTS[design.motion];

    return (
        <AnimatePresence mode="wait" initial={false}>
            <m.div
                key={location.pathname}
                initial={variant.initial}
                animate={variant.animate}
                exit={variant.exit}
                transition={variant.transition}
                style={{ transformPerspective: 1200 }}
            >
                {children}
            </m.div>
        </AnimatePresence>
    );
}
