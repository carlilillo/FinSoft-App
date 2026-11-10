import { InboxSift } from "./InboxSift/InboxSift";
import { OverviewLink } from "./OverviewLink";
import { SectionLink } from "./SectionLink";
import styles from "./Hero.module.css";

export function Hero() {
    return (
        <section className={styles.hero} aria-labelledby="hero-title">
            <div className={styles.copy}>
                <h1 id="hero-title" className={styles.title}>
                    Find every invoice in last week&apos;s email.
                </h1>
                <p className={styles.lead}>
                    FinSift reads your Gmail inbox, picks out the invoices and
                    receipts, in Spanish or English, and records each vendor,
                    product and price with and without VAT.
                </p>
                <div className={styles.actions}>
                    <OverviewLink>Open overview</OverviewLink>
                    <SectionLink
                        sectionId="how-it-works"
                        className={styles.secondary}
                    >
                        How it works
                    </SectionLink>
                </div>
                <p className={styles.note}>
                    Works with Gmail. Reads only the last seven days.
                </p>
            </div>
            <div className={styles.visual}>
                <InboxSift />
            </div>
        </section>
    );
}
