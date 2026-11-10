import { OverviewLink } from "./OverviewLink";
import styles from "./ClosingCta.module.css";

export function ClosingCta() {
    return (
        <section className={styles.band} aria-labelledby="closing-title">
            <h2 id="closing-title" className={styles.title}>
                See what last week cost you
            </h2>
            <p className={styles.body}>
                The overview shows your spending over 7, 14 or 30 days, every
                invoice FinSift found and what each product cost.
            </p>
            <OverviewLink>Open overview</OverviewLink>
        </section>
    );
}
