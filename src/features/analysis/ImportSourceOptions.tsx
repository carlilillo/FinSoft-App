import { Icon } from "@/shared/ui";
import type { ImportSourceOptionsProps } from "./types";
import styles from "./ImportSourceDialog.module.css";

/** The two ways in; each opens its own step in the dialog. */
export function ImportSourceOptions({
    onChooseComputer,
    onChoosePhone,
}: ImportSourceOptionsProps) {
    return (
        <ul className={styles.options}>
            <li>
                <button
                    type="button"
                    className={styles.option}
                    onClick={onChooseComputer}
                >
                    <span className={styles.optionIcon}>
                        <Icon name="laptop" size={20} />
                    </span>
                    <span className={styles.optionText}>
                        <span className={styles.optionTitle}>
                            From this computer
                        </span>
                        <span className={styles.optionDetail}>
                            Drag files in or pick them from a folder
                        </span>
                    </span>
                    <span className={styles.chevron}>
                        <Icon name="chevron" size={16} />
                    </span>
                </button>
            </li>
            <li>
                <button
                    type="button"
                    className={styles.option}
                    onClick={onChoosePhone}
                >
                    <span className={styles.optionIcon}>
                        <Icon name="phone" size={20} />
                    </span>
                    <span className={styles.optionText}>
                        <span className={styles.optionTitle}>
                            From your phone
                        </span>
                        <span className={styles.optionDetail}>
                            Scan a QR code, attach from your gallery
                        </span>
                    </span>
                    <span className={styles.chevron}>
                        <Icon name="chevron" size={16} />
                    </span>
                </button>
            </li>
        </ul>
    );
}
