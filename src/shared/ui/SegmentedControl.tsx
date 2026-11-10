import { m } from "motion/react";
import { useId } from "react";
import type { SegmentedControlProps } from "./types";
import styles from "./SegmentedControl.module.css";

const SPRING = {
    type: "spring",
    stiffness: 420,
    damping: 22,
    mass: 0.9,
} as const;

export function SegmentedControl<T extends string>({
    label,
    options,
    value,
    onChange,
}: SegmentedControlProps<T>) {
    const layoutId = useId();
    return (
        <div className={styles.control} role="radiogroup" aria-label={label}>
            {options.map((option) => {
                const isSelected = option.value === value;
                return (
                    <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        className={styles.option}
                        onClick={() => onChange(option.value)}
                    >
                        {isSelected && (
                            <m.span
                                layoutId={layoutId}
                                className={styles.highlight}
                                transition={SPRING}
                            />
                        )}
                        <span className={styles.text}>{option.label}</span>
                    </button>
                );
            })}
        </div>
    );
}
