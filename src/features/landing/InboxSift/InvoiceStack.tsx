import { AnimatePresence } from "motion/react";
import type { InvoiceStackProps } from "./types";
import { InvoiceCard } from "./InvoiceCard";
import styles from "./InvoiceStack.module.css";

export function InvoiceStack({ invoices }: InvoiceStackProps) {
    return (
        <div className={styles.stack}>
            {invoices.length === 0 && (
                <p className={styles.empty}>
                    Invoices land here as FinSift finds them.
                </p>
            )}
            <AnimatePresence>
                {invoices.map((invoice, index) => (
                    <InvoiceCard
                        key={invoice.id}
                        invoice={invoice}
                        depth={invoices.length - 1 - index}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}
