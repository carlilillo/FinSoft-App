import { useLocation } from "react-router";
import { NAV_ITEMS, sectionIndex } from "./navigation";
import { NavItemLink } from "./NavItemLink";
import type { MainNavProps } from "./types";
import styles from "./MainNav.module.css";

export function MainNav({ hasActiveRun }: MainNavProps) {
    // Detail pages keep their section highlighted (an analysis run stays under Analyze).
    const activeIndex = sectionIndex(useLocation().pathname);
    return (
        <nav aria-label="Main" className={styles.nav}>
            <ul className={styles.list}>
                {NAV_ITEMS.map((item, index) => (
                    <li key={item.to}>
                        <NavItemLink
                            item={item}
                            isActive={index === activeIndex}
                            hasActiveRun={hasActiveRun}
                        />
                    </li>
                ))}
            </ul>
        </nav>
    );
}
