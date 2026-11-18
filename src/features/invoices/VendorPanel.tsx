import { counterpartyRole, vendorFields } from "./invoices.model";
import type { VendorPanelProps } from "./types";
import styles from "./SidePanel.module.css";

export function VendorPanel({ vendor, direction }: VendorPanelProps) {
    const fields = vendorFields(vendor);
    return (
        <section aria-labelledby="vendor-title" className={styles.panel}>
            <hgroup className={styles.heading}>
                <h2 id="vendor-title" className={styles.title}>
                    {vendor.name}
                </h2>
                <p className={styles.muted}>{counterpartyRole(direction)}</p>
            </hgroup>
            {fields.length === 0 ? (
                <p className={styles.muted}>
                    No contact details are printed on this invoice.
                </p>
            ) : (
                <dl className={styles.fields}>
                    {fields.map((field) => (
                        <div key={field.label}>
                            <dt>{field.label}</dt>
                            <dd>{field.value}</dd>
                        </div>
                    ))}
                </dl>
            )}
        </section>
    );
}
