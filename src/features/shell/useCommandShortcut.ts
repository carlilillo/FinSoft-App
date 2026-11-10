import { useEffect } from "react";

/** ⌘K / Ctrl+K toggles the command palette. */
export function useCommandShortcut(onToggle: () => void): void {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (
                event.key.toLowerCase() === "k" &&
                (event.metaKey || event.ctrlKey)
            ) {
                event.preventDefault();
                onToggle();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onToggle]);
}
