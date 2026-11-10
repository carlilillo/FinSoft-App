import { m } from "motion/react";
import { Link } from "react-router";
import { Icon } from "@/shared/ui";
import type { NavItemLinkProps } from "./types";
import styles from "./MainNav.module.css";

export function NavItemLink({
    item,
    isActive,
    hasActiveRun,
}: NavItemLinkProps) {
    return (
        <Link
            to={item.to}
            viewTransition
            className={styles.link}
            aria-current={isActive ? "page" : undefined}
        >
            {isActive && (
                <m.span
                    layoutId="nav-highlight"
                    className={styles.activeBackground}
                    transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 38,
                    }}
                />
            )}
            <span className={styles.icon}>
                <Icon name={item.icon} />
            </span>
            <span className={styles.label}>
                <span className={styles.labelText}>{item.label}</span>
            </span>
            {item.to === "/analyze" && hasActiveRun && (
                <span
                    className={styles.pending}
                    role="status"
                    aria-label="An analysis is running"
                />
            )}
        </Link>
    );
}
