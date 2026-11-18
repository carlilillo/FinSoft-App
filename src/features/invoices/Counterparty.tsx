import type { CounterpartyProps } from "./types";
import styles from "./Counterparty.module.css";

/**
 * "To Acme S.L." for a customer the person billed, the provider's name alone for a bill they received; the signed
 * total next to it (+ issued, − received) says the rest.
 */
export function Counterparty({ direction, name }: CounterpartyProps) {
    return (
        <span>
            {direction === "issued" ? (
                <span className={styles.to}>To </span>
            ) : (
                <span className="visually-hidden">From </span>
            )}
            {name}
        </span>
    );
}
