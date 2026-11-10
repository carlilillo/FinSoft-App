import { Link } from "react-router";
import { useIsScrolled } from "@/features/shell";
import { OverviewLink } from "./OverviewLink";
import { SectionLink } from "./SectionLink";
import type { LandingHeaderProps } from "./types";
import styles from "./LandingHeader.module.css";

export function LandingHeader({ isSignedIn }: LandingHeaderProps) {
    const isScrolled = useIsScrolled(8);
    return (
        <header className={styles.header} data-scrolled={isScrolled}>
            <Link to="/" className={styles.brand}>
                <span className={styles.mark} aria-hidden="true">
                    F
                </span>
                FinSift
            </Link>
            <nav className={styles.links} aria-label="On this page">
                <SectionLink sectionId="how-it-works">How it works</SectionLink>
                <SectionLink sectionId="languages">
                    Spanish and English
                </SectionLink>
                <SectionLink sectionId="privacy">Privacy</SectionLink>
            </nav>
            <div className={styles.actions}>
                {!isSignedIn && (
                    <Link to="/sign-in" className={styles.signIn}>
                        Sign in
                    </Link>
                )}
                <OverviewLink>Open overview</OverviewLink>
            </div>
        </header>
    );
}
