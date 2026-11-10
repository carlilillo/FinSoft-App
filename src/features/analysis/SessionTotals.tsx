import { formatDateTime } from "@/shared/lib/dates";
import { formatMoney } from "@/shared/lib/money";
import type { SessionTotalsProps } from "./types";
import styles from "./SessionTotals.module.css";

export function SessionTotals({ totals, run }: SessionTotalsProps) {
    return (
        <section aria-labelledby="session-totals" className={styles.totals}>
            <h2 id="session-totals" className={styles.title}>
                Expenses found
            </h2>
            <p className={styles.meta}>
                {run.progress.emailsTotal} emails reviewed
                {run.finishedAt
                    ? `, finished ${formatDateTime(run.finishedAt)}`
                    : ""}
            </p>
            {totals.length === 0 && (
                <p className={styles.meta}>No expenses in this session.</p>
            )}
            {totals.map((total) => (
                <dl key={total.currency} className={styles.currency}>
                    <div className={styles.gross}>
                        <dt>
                            Total (
                            {total.invoiceCount === 1
                                ? "1 invoice"
                                : `${total.invoiceCount} invoices`}
                            )
                        </dt>
                        <dd className="numeric">
                            {formatMoney(total.grossCents, total.currency)}
                        </dd>
                    </div>
                    <div>
                        <dt>Excl. VAT</dt>
                        <dd className="numeric">
                            {formatMoney(total.netCents, total.currency)}
                        </dd>
                    </div>
                    <div>
                        <dt>VAT</dt>
                        <dd className="numeric">
                            {formatMoney(total.vatCents, total.currency)}
                        </dd>
                    </div>
                    {total.withholdingCents > 0 && (
                        <div>
                            <dt>Withheld</dt>
                            <dd className="numeric">
                                {formatMoney(
                                    total.withholdingCents,
                                    total.currency,
                                )}
                            </dd>
                        </div>
                    )}
                </dl>
            ))}
        </section>
    );
}
