import { useEffect } from "react";

/** Calls `onStep` on ←/→ unless the person is typing in a field. */
export function useArrowKeys(onStep: (step: 1 | -1) => void): void {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement | null;
            if (
                target?.closest(
                    "input, textarea, select, [contenteditable='true']",
                )
            )
                return;
            if (!event.altKey) return;
            if (event.key === "ArrowRight") onStep(1);
            if (event.key === "ArrowLeft") onStep(-1);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onStep]);
}
