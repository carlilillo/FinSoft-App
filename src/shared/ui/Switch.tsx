import { m } from "motion/react";
import { useId } from "react";
import type { SwitchProps } from "./types";
import styles from "./Switch.module.css";

const SPRING = {
    type: "spring",
    stiffness: 520,
    damping: 30,
} as const;

/** An on/off setting: the whole row is the button, the thumb springs across like the segmented control. */
export function Switch({
    label,
    description,
    isOn,
    onChange,
    className,
    ...rest
}: SwitchProps) {
    const descriptionId = useId();
    return (
        <button
            type="button"
            role="switch"
            {...rest}
            aria-checked={isOn}
            aria-describedby={description ? descriptionId : undefined}
            className={[styles.switch, className].filter(Boolean).join(" ")}
            onClick={() => onChange(!isOn)}
        >
            <span className={styles.text}>
                <span className={styles.label}>{label}</span>
                {description && (
                    <span id={descriptionId} className={styles.description}>
                        {description}
                    </span>
                )}
            </span>
            <span className={styles.track} data-on={isOn} aria-hidden="true">
                <m.span className={styles.thumb} layout transition={SPRING} />
            </span>
        </button>
    );
}
