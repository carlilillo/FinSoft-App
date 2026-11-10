import { m } from "motion/react";
import { formatMoney } from "@/shared/lib/money";
import { stackPose } from "@/features/landing/landing.model";
import type { InvoiceCardProps } from "./types";
import styles from "./InvoiceStack.module.css";

/** A newly found invoice slides in from the inbox side and settles onto the stack. */
const ARRIVAL = {
    from: { opacity: 0, x: -72, scale: 0.94 },
    transition: { type: "spring", stiffness: 190, damping: 26 },
} as const;

export function InvoiceCard({ invoice, depth }: InvoiceCardProps) {
    const pose = stackPose(depth);
    const money = (cents: number) =>
        formatMoney(cents, invoice.currency, invoice.locale);
    const isSpanish = invoice.locale.startsWith("es");

    return (
        <m.article
            className={styles.card}
            data-depth={depth}
            initial={ARRIVAL.from}
            animate={{ opacity: 1, x: 0, ...pose }}
            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.18 } }}
            transition={ARRIVAL.transition}
            aria-hidden={depth > 0}
        >
            <header className={styles.cardHeader}>
                <div>
                    <h3 className={styles.vendor}>{invoice.vendor}</h3>
                    <p className={styles.reference}>
                        {invoice.number ?? "Receipt"}, {invoice.issuedOn}
                    </p>
                </div>
                <p className={`numeric ${styles.total}`}>
                    {money(invoice.totalCents)}
                </p>
            </header>
            <table className={styles.lines}>
                <caption className="visually-hidden">Line items</caption>
                <tbody>
                    {invoice.lines.map((line) => (
                        <tr key={line.description}>
                            <th scope="row">{line.description}</th>
                            <td className="numeric">
                                {line.quantity} × {money(line.unitCents)}
                            </td>
                            <td className="numeric">
                                {money(line.totalCents)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <dl className={styles.totals}>
                <div>
                    <dt>
                        Subtotal
                        {isSpanish && <span lang="es">Base imponible</span>}
                    </dt>
                    <dd className="numeric">{money(invoice.subtotalCents)}</dd>
                </div>
                <div>
                    <dt>
                        VAT {invoice.vatRate}%
                        {isSpanish && <span lang="es">IVA</span>}
                    </dt>
                    <dd className="numeric">{money(invoice.vatCents)}</dd>
                </div>
                {invoice.withholdingCents !== null && (
                    <div>
                        <dt>
                            Withheld {invoice.withholdingRate}%
                            {isSpanish && <span lang="es">IRPF</span>}
                        </dt>
                        <dd className="numeric">
                            {money(-invoice.withholdingCents)}
                        </dd>
                    </div>
                )}
            </dl>
            <span className={styles.stamp} aria-hidden="true">
                Recorded
            </span>
        </m.article>
    );
}
