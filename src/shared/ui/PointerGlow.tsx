import type { PointerEvent } from "react";
import type { PointerGlowProps } from "./types";
import styles from "./PointerGlow.module.css";

/** Exposes the pointer position as --gx/--gy; designs that want a glow following the pointer draw it in CSS. */
export function PointerGlow({ children, className }: PointerGlowProps) {
    const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty(
            "--gx",
            `${event.clientX - rect.left}px`,
        );
        event.currentTarget.style.setProperty(
            "--gy",
            `${event.clientY - rect.top}px`,
        );
    };
    return (
        <div
            className={[styles.surface, className].filter(Boolean).join(" ")}
            onPointerMove={handlePointerMove}
        >
            {children}
        </div>
    );
}
