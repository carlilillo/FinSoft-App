import type { DirectionMarkProps } from "./types";
import styles from "./DirectionMark.module.css";

/** The colour of a direction's bars in the Overview chart, for its legend and tooltip; the text next to it carries the meaning. */
export function DirectionMark({ direction }: DirectionMarkProps) {
    return (
        <span
            className={styles.mark}
            data-direction={direction}
            aria-hidden="true"
        />
    );
}
