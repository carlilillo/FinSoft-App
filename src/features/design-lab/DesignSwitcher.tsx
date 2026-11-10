import { useState } from "react";
import { useDesign } from "./DesignContext";
import { DESIGNS, designPosition, neighbourDesign } from "./designs";
import { useArrowKeys } from "./useArrowKeys";
import styles from "./DesignSwitcher.module.css";

/** TEMPORARY: floating panel to compare the seven directions on the real screens. */
export function DesignSwitcher() {
    const { design, selectDesign } = useDesign();
    const [isOpen, setIsOpen] = useState(false);

    useArrowKeys((step) => selectDesign(neighbourDesign(design.id, step)));

    return (
        <aside className={styles.switcher} aria-label="Design options">
            <div className={styles.bar}>
                <button
                    type="button"
                    className={styles.step}
                    onClick={() => selectDesign(neighbourDesign(design.id, -1))}
                    aria-label="Previous design"
                >
                    ‹
                </button>
                <button
                    type="button"
                    className={styles.current}
                    onClick={() => setIsOpen((open) => !open)}
                    aria-expanded={isOpen}
                >
                    <span className={styles.position}>
                        {designPosition(design.id)}/{DESIGNS.length}
                    </span>
                    {design.name}
                </button>
                <button
                    type="button"
                    className={styles.step}
                    onClick={() => selectDesign(neighbourDesign(design.id, 1))}
                    aria-label="Next design"
                >
                    ›
                </button>
            </div>
            {isOpen && (
                <ol className={styles.list}>
                    {DESIGNS.map((option) => (
                        <li key={option.id}>
                            <button
                                type="button"
                                className={styles.option}
                                aria-current={option.id === design.id}
                                onClick={() => selectDesign(option.id)}
                            >
                                <strong>{option.name}</strong>
                                <span>{option.idea}</span>
                            </button>
                        </li>
                    ))}
                    <li className={styles.hint}>Alt + ← / → to switch</li>
                </ol>
            )}
        </aside>
    );
}
