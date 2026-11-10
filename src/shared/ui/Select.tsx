import { useId } from "react";
import type { SelectProps } from "./types";
import styles from "./Select.module.css";

export function Select<T extends string>({
    label,
    options,
    value,
    onChange,
    className,
    ...rest
}: SelectProps<T>) {
    const id = useId();
    return (
        <div className={[styles.field, className].filter(Boolean).join(" ")}>
            <label htmlFor={id} className={styles.label}>
                {label}
            </label>
            <span className={styles.control}>
                <select
                    id={id}
                    {...rest}
                    value={value}
                    className={styles.select}
                    onChange={(event) => onChange(event.target.value as T)}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <svg
                    className={styles.chevron}
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.7}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </span>
        </div>
    );
}
