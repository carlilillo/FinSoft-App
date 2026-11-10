import { HOW_STEPS } from "./landing.content";
import type { LandingSectionProps } from "./types";
import styles from "./HowItWorks.module.css";

export function HowItWorks({ id }: LandingSectionProps) {
    return (
        <section
            id={id}
            className={styles.section}
            aria-labelledby={`${id}-title`}
        >
            <h2 id={`${id}-title`} className={styles.title}>
                How it works
            </h2>
            <ol className={styles.steps}>
                {HOW_STEPS.map((step) => (
                    <li key={step.title} className={styles.step}>
                        <h3 className={styles.stepTitle}>{step.title}</h3>
                        <p className={styles.stepBody}>{step.body}</p>
                    </li>
                ))}
            </ol>
        </section>
    );
}
