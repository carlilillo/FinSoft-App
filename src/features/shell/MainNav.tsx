import { useDesign } from "@/features/design-lab";
import { NAV_ITEMS } from "./navigation";
import { NavItemLink } from "./NavItemLink";
import type { MainNavProps } from "./types";
import styles from "./MainNav.module.css";

export function MainNav({ hasActiveRun }: MainNavProps) {
    const { design } = useDesign();
    return (
        <nav aria-label="Main" className={styles.nav}>
            <ul className={styles.list}>
                {NAV_ITEMS.map((item) => (
                    <li key={item.to}>
                        <NavItemLink
                            item={item}
                            hasActiveRun={hasActiveRun}
                            isFluid={design.motion === "fluid"}
                            layoutGroup={`nav-${design.nav}`}
                        />
                    </li>
                ))}
            </ul>
        </nav>
    );
}
