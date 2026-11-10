import { m } from "motion/react";
import type { OdometerProps } from "./types";
import styles from "./Odometer.module.css";

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

/** Each digit is a vertical strip 0–9 that springs to its value; other characters render as-is. */
export function Odometer({ text }: OdometerProps) {
    const characters = [...text];
    return (
        <span
            className={`numeric ${styles.odometer}`}
            aria-label={text}
            role="img"
        >
            {characters.map((character, index) => {
                const position = characters.length - index;
                if (!DIGITS.includes(character)) {
                    return (
                        <span key={`s-${position}`} aria-hidden="true">
                            {character}
                        </span>
                    );
                }
                return (
                    <span
                        key={`d-${position}`}
                        className={styles.window}
                        aria-hidden="true"
                    >
                        <m.span
                            className={styles.strip}
                            initial={false}
                            animate={{ y: `${-Number(character) * 10}%` }}
                            transition={{
                                type: "spring",
                                stiffness: 140,
                                damping: 18,
                                delay: index * 0.03,
                            }}
                        >
                            {DIGITS.map((digit) => (
                                <span key={digit}>{digit}</span>
                            ))}
                        </m.span>
                    </span>
                );
            })}
        </span>
    );
}
