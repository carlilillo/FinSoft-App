import { m, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { NavLink } from "react-router";
import { Icon } from "@/shared/ui";
import { NAV_ITEMS } from "./navigation";
import type { DockItemProps, MainNavProps } from "./types";
import styles from "./Dock.module.css";

/** Tangerine's bottom dock: icons swell as the pointer approaches. */
export function Dock({ hasActiveRun }: MainNavProps) {
    const mouseX = useMotionValue(Number.POSITIVE_INFINITY);
    return (
        <nav aria-label="Main" className={styles.dockArea}>
            <m.ul
                className={styles.dock}
                onPointerMove={(event) => mouseX.set(event.clientX)}
                onPointerLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
            >
                {NAV_ITEMS.map((item) => (
                    <li key={item.to}>
                        <DockItem
                            item={item}
                            mouseX={mouseX}
                            hasActiveRun={hasActiveRun}
                        />
                    </li>
                ))}
            </m.ul>
        </nav>
    );
}

function DockItem({ item, mouseX, hasActiveRun }: DockItemProps) {
    const ref = useRef<HTMLAnchorElement>(null);
    const distance = useTransform(mouseX, (x) => {
        const rect = ref.current?.getBoundingClientRect();
        return rect
            ? x - (rect.left + rect.width / 2)
            : Number.POSITIVE_INFINITY;
    });
    const size = useSpring(
        useTransform(distance, [-140, 0, 140], [46, 68, 46]),
        { stiffness: 380, damping: 26 },
    );

    return (
        <NavLink
            ref={ref}
            to={item.to}
            end={item.end}
            className={styles.item}
            aria-label={item.label}
        >
            {({ isActive }) => (
                <>
                    <m.span
                        className={styles.bubble}
                        style={{ width: size, height: size }}
                        data-active={isActive}
                    >
                        <Icon name={item.icon} size={22} />
                    </m.span>
                    <span className={styles.tooltip}>{item.label}</span>
                    {item.to === "/analyze" && hasActiveRun && (
                        <span className={styles.pending} aria-hidden="true" />
                    )}
                </>
            )}
        </NavLink>
    );
}
