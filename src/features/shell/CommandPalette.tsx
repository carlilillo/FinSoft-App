import { type KeyboardEvent, useState } from "react";
import { useNavigate } from "react-router";
import { Dialog } from "@/shared/ui";
import { filterCommands } from "./commands";
import type { CommandPaletteProps } from "./types";
import styles from "./CommandPalette.module.css";

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);
    const results = filterCommands(query);

    const close = () => {
        setQuery("");
        setActiveIndex(0);
        onClose();
    };

    const run = (to: string) => {
        close();
        void navigate(to);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "ArrowDown")
            setActiveIndex((index) => Math.min(index + 1, results.length - 1));
        if (event.key === "ArrowUp")
            setActiveIndex((index) => Math.max(index - 1, 0));
        const selected = results[activeIndex];
        if (event.key === "Enter" && selected) run(selected.to);
    };

    return (
        <Dialog isOpen={isOpen} title="Go to" onClose={close} isDraggable>
            <input
                className={styles.input}
                placeholder="Search pages and actions"
                value={query}
                onChange={(event) => {
                    setQuery(event.target.value);
                    setActiveIndex(0);
                }}
                onKeyDown={handleKeyDown}
                aria-label="Search pages and actions"
                aria-controls="command-results"
            />
            <ul id="command-results" className={styles.results}>
                {results.map((command, index) => (
                    <li key={command.id}>
                        <button
                            type="button"
                            className={styles.result}
                            data-active={index === activeIndex}
                            onClick={() => run(command.to)}
                            onPointerEnter={() => setActiveIndex(index)}
                        >
                            <strong>{command.label}</strong>
                            <span>{command.hint}</span>
                        </button>
                    </li>
                ))}
                {results.length === 0 && (
                    <li className={styles.none}>Nothing matches “{query}”.</li>
                )}
            </ul>
        </Dialog>
    );
}
