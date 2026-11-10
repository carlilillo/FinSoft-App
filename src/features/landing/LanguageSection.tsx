import { GLOSSARY } from "./landing.content";
import type { LandingSectionProps } from "./types";
import styles from "./LanguageSection.module.css";

export function LanguageSection({ id }: LandingSectionProps) {
    return (
        <section
            id={id}
            className={styles.section}
            aria-labelledby={`${id}-title`}
        >
            <div className={styles.copy}>
                <h2 id={`${id}-title`} className={styles.title}>
                    Spanish and English invoices, read the same way
                </h2>
                <p>
                    A factura from Madrid and a receipt from London land in the
                    same list, with the same fields filled in.
                </p>
                <p>
                    <span className="numeric">1.234,56 €</span> and{" "}
                    <span className="numeric">£1,234.56</span> both become exact
                    amounts, stored to the cent. On a Spanish invoice{" "}
                    <span className="numeric">03/11/2026</span> is 3 November,
                    not 11 March.
                </p>
            </div>
            <dl className={styles.glossary}>
                {GLOSSARY.map((term) => (
                    <div key={term.spanish} className={styles.term}>
                        <dt lang="es">{term.spanish}</dt>
                        <dd>{term.english}</dd>
                    </div>
                ))}
            </dl>
        </section>
    );
}
