import { vendorFields } from "./invoices.model";
import type { VendorPanelProps } from "./types";
import styles from "./SidePanel.module.css";

export function VendorPanel({ vendor }: VendorPanelProps) {
    const fields = vendorFields(vendor);
    return (
        <section aria-labelledby="vendor-title" className={styles.panel}>
            <h2 id="vendor-title" className={styles.title}>
                {vendor.name}
            </h2>
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
