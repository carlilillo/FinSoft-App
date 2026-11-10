import { m } from "motion/react";
import { NavLink, useLocation } from "react-router";
import { Icon } from "@/shared/ui";
import { markNavDirection, navDirection } from "./navigation";
import type { NavItemLinkProps } from "./types";
import styles from "./MainNav.module.css";

export function NavItemLink({
    item,
    hasActiveRun,
    isFluid,
    layoutGroup,
}: NavItemLinkProps) {
    const location = useLocation();
    return (
        <NavLink
            to={item.to}
            end={item.end}
            viewTransition={isFluid}
            className={styles.link}
            onClick={() =>
                markNavDirection(navDirection(location.pathname, item.to))
            }
        >
            {({ isActive }) => (
                <>
                    {isActive && (
                        <m.span
                            layoutId={layoutGroup}
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
                    <span className={styles.label}>{item.label}</span>
                    {item.to === "/analyze" && hasActiveRun && (
                        <span
                            className={styles.pending}
                            role="status"
                            aria-label="An analysis is running"
                        />
                    )}
                </>
            )}
        </NavLink>
    );
}
