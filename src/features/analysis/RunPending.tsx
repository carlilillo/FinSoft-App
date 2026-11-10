import { m } from "motion/react";
import { ButtonLink } from "@/shared/ui";
import { describeStage } from "./analysis.model";
import type { RunPendingProps } from "./types";
import styles from "./RunPending.module.css";

/** Calm progress only: the agent's reasoning and tool calls stay in the server logs. */
export function RunPending({ run }: RunPendingProps) {
    const stage = describeStage(run);
    return (
        <section className={styles.pending} aria-live="polite" aria-busy="true">
            <h2 className={styles.title}>{stage.title}</h2>
            <p className={styles.detail}>{stage.detail}</p>
            <div
                className={styles.track}
                role="progressbar"
                aria-label="Analysis progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={stage.percent}
            >
                <m.span
                    className={styles.bar}
                    initial={false}
                    animate={{ width: `${stage.percent}%` }}
                    transition={{ type: "spring", stiffness: 60, damping: 20 }}
                />
            </div>
            <p className={styles.leave}>
                This runs in the background. You can leave this page; we&apos;ll
                let you know when it&apos;s ready.
            </p>
            <ButtonLink to="/overview" variant="secondary">
                Back to overview
            </ButtonLink>
        </section>
    );
}
