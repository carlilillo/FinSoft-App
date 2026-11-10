import { Link } from "react-router";
import type { ButtonLinkProps, ButtonProps } from "./types";
import styles from "./Button.module.css";

export function Button({
    variant = "primary",
    isBusy = false,
    className,
    children,
    disabled,
    ...rest
}: ButtonProps) {
    return (
        <button
            type="button"
            {...rest}
            disabled={disabled || isBusy}
            aria-busy={isBusy}
            className={[styles.button, styles[variant], className]
                .filter(Boolean)
                .join(" ")}
        >
            <span className={styles.label}>{children}</span>
        </button>
    );
}

export function ButtonLink({
    to,
    variant = "primary",
    children,
    viewTransition = false,
}: ButtonLinkProps) {
    return (
        <Link
            to={to}
            viewTransition={viewTransition}
            className={[styles.button, styles[variant]].join(" ")}
        >
            <span className={styles.label}>{children}</span>
        </Link>
    );
}
