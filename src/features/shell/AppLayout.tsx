import { m } from "motion/react";
import { useCallback, useState } from "react";
import { Link, useOutlet } from "react-router";
import { useRunWatcher } from "@/features/analysis";
import { useDesign } from "@/features/design-lab";
import { Icon, useToast } from "@/shared/ui";
import { CommandPalette } from "./CommandPalette";
import { Dock } from "./Dock";
import { LiquidBackdrop } from "./LiquidBackdrop";
import { MainNav } from "./MainNav";
import { RouteTransition } from "./RouteTransition";
import { useCommandShortcut } from "./useCommandShortcut";
import { useIsScrolled } from "./useIsScrolled";
import { UserMenu } from "./UserMenu";
import styles from "./AppLayout.module.css";

export function AppLayout() {
    const { design } = useDesign();
    const outlet = useOutlet();
    const { showToast } = useToast();
    const isScrolled = useIsScrolled();
    const [isPaletteOpen, setIsPaletteOpen] = useState(false);
    const hasPalette = design.motion === "expressive";

    const { hasActiveRun } = useRunWatcher((runId, status) =>
        showToast({
            message:
                status === "failed"
                    ? "An analysis stopped before finishing."
                    : "Your analysis is ready.",
            action: { label: "Open", to: `/analyses/${runId}` },
        }),
    );

    const togglePalette = useCallback(() => {
        if (hasPalette) setIsPaletteOpen((open) => !open);
    }, [hasPalette]);
    useCommandShortcut(togglePalette);

    return (
        <div className={styles.layout} data-nav={design.nav}>
            <m.header
                layout={design.motion === "fluid"}
                className={styles.navArea}
                data-compact={design.motion === "fluid" && isScrolled}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <Link to="/" className={styles.brand} aria-label="FinSift home">
                    <span className={styles.mark} aria-hidden="true">
                        F
                    </span>
                    <span className={styles.wordmark}>FinSift</span>
                </Link>
                {design.nav !== "dock" && (
                    <MainNav hasActiveRun={hasActiveRun} />
                )}
                <div className={styles.account}>
                    {hasPalette && (
                        <button
                            type="button"
                            className={styles.paletteButton}
                            onClick={togglePalette}
                        >
                            <Icon name="search" size={16} />
                            <span>Search</span>
                            <kbd>⌘K</kbd>
                        </button>
                    )}
                    <UserMenu isCompact={design.nav !== "sidebar"} />
                </div>
            </m.header>
            <main className={styles.main}>
                <RouteTransition>{outlet}</RouteTransition>
            </main>
            {design.nav === "dock" && <Dock hasActiveRun={hasActiveRun} />}
            {design.motion === "expressive" && <LiquidBackdrop />}
            {hasPalette && (
                <CommandPalette
                    isOpen={isPaletteOpen}
                    onClose={() => setIsPaletteOpen(false)}
                />
            )}
        </div>
    );
}
