import type { PointerEvent } from "react";
import { Link } from "react-router";
import type { ButtonLinkProps, ButtonProps } from "./types";
import styles from "./Button.module.css";

/**
 * Pointer offset is exposed as --mx/--my; designs that want "magnetic" buttons use it in CSS,
 * the rest ignore it.
 */
function trackPointer(event: PointerEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
        "--mx",
        `${(event.clientX - rect.left - rect.width / 2) / rect.width}`,
    );
    event.currentTarget.style.setProperty(
        "--my",
        `${(event.clientY - rect.top - rect.height / 2) / rect.height}`,
    );
}

function resetPointer(event: PointerEvent<HTMLElement>) {
    event.currentTarget.style.setProperty("--mx", "0");
    event.currentTarget.style.setProperty("--my", "0");
}

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
            onPointerMove={trackPointer}
            onPointerLeave={resetPointer}
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
            onPointerMove={trackPointer}
            onPointerLeave={resetPointer}
        >
            <span className={styles.label}>{children}</span>
        </Link>
    );
}
