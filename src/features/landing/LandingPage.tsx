import { Link } from "react-router";
import { useAccount } from "@/features/auth";
import { ClosingCta } from "./ClosingCta";
import { Hero } from "./Hero";
import { HowItWorks } from "./HowItWorks";
import { LandingHeader } from "./LandingHeader";
import { LanguageSection } from "./LanguageSection";
import { PriceSection } from "./PriceSection";
import { PrivacySection } from "./PrivacySection";
import styles from "./LandingPage.module.css";

/** Public home page. Every call to action leads to the overview. */
export function LandingPage() {
    const account = useAccount();
    const isSignedIn = account.status === "signed-in";

    return (
        <div className={styles.page}>
            <LandingHeader isSignedIn={isSignedIn} />
            <main className={styles.main}>
                <Hero />
                <HowItWorks id="how-it-works" />
                <LanguageSection id="languages" />
                <PriceSection id="prices" />
                <PrivacySection id="privacy" />
                <ClosingCta />
            </main>
            <footer className={styles.footer}>
                <p>© 2026 FinSift</p>
                <nav aria-label="Footer" className={styles.footerLinks}>
                    <Link to="/overview">Overview</Link>
                    {!isSignedIn && <Link to="/sign-in">Sign in</Link>}
                </nav>
            </footer>
        </div>
    );
}
