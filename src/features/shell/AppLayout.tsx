import { m } from "motion/react";
import { Link, useOutlet } from "react-router";
import { useRunWatcher } from "@/features/analysis";
import { useToast } from "@/shared/ui";
import { MainNav } from "./MainNav";
import { useIsScrolled } from "./useIsScrolled";
import { UserMenu } from "./UserMenu";
import styles from "./AppLayout.module.css";

export function AppLayout() {
    const outlet = useOutlet();
    const { showToast } = useToast();
    const isScrolled = useIsScrolled();

    const { hasActiveRun } = useRunWatcher((runId, status) =>
        showToast({
            message:
                status === "failed"
                    ? "An analysis stopped before finishing."
                    : "Your analysis is ready.",
            action: { label: "Open", to: `/analyses/${runId}` },
        }),
    );

    return (
        <div className={styles.layout}>
            {/* A fixed bar marked layoutScroll: Motion measures the nav highlight against the bar,
                not the page, so a scroll change during navigation can't throw it off. */}
            <m.header
                layoutScroll
                className={styles.navArea}
                data-compact={isScrolled}
            >
                <Link
                    to="/overview"
                    className={styles.brand}
                    aria-label="FinSift overview"
                >
                    <span className={styles.mark} aria-hidden="true">
                        F
                    </span>
                    <span className={styles.wordmark}>
                        <span className={styles.wordmarkText}>FinSift</span>
                    </span>
                </Link>
                <MainNav hasActiveRun={hasActiveRun} />
                <div className={styles.account}>
                    <UserMenu />
                </div>
            </m.header>
            {/* Pages slide in and out through the browser's View Transitions (see global.css). */}
            <main className={styles.main}>{outlet}</main>
        </div>
    );
}
