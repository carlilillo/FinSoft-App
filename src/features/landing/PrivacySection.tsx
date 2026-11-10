import { Icon } from "@/shared/ui";
import { PRIVACY_FACTS } from "./landing.content";
import type { LandingSectionProps } from "./types";
import styles from "./PrivacySection.module.css";

export function PrivacySection({ id }: LandingSectionProps) {
    return (
        <section
            id={id}
            className={styles.section}
            aria-labelledby={`${id}-title`}
        >
            <h2 id={`${id}-title`} className={styles.title}>
                Your inbox stays yours
            </h2>
            <ul className={styles.facts}>
                {PRIVACY_FACTS.map((fact) => (
                    <li key={fact} className={styles.fact}>
                        <span className={styles.check} aria-hidden="true">
                            <Icon name="check" size={16} />
                        </span>
                        {fact}
                    </li>
                ))}
            </ul>
        </section>
    );
}
