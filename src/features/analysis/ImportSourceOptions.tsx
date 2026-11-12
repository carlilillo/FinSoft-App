import { type ChangeEvent, useRef } from "react";
import { Icon } from "@/shared/ui";
import { IMPORT_ACCEPT } from "./analysis.model";
import type { ImportSourceOptionsProps } from "./types";
import styles from "./ImportSourceDialog.module.css";

/**
 * The two ways in. The file input lives inside the dialog: everything outside a modal dialog is
 * inert, so a picker opened from there might not open at all.
 */
export function ImportSourceOptions({
    onFilesChosen,
    onChoosePhone,
}: ImportSourceOptionsProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
        const files = [...(event.target.files ?? [])];
        event.target.value = "";
        if (files.length > 0) onFilesChosen(files);
    };

    return (
        <ul className={styles.options}>
            <li>
                <button
                    type="button"
                    className={styles.option}
                    onClick={() => inputRef.current?.click()}
                >
                    <span className={styles.optionIcon}>
                        <Icon name="laptop" size={20} />
                    </span>
                    <span className={styles.optionText}>
                        <span className={styles.optionTitle}>
                            From this computer
                        </span>
                        <span className={styles.optionDetail}>
                            Pick files from a folder
                        </span>
                    </span>
                    <span className={styles.chevron}>
                        <Icon name="chevron" size={16} />
                    </span>
                </button>
                <input
                    ref={inputRef}
                    type="file"
                    accept={IMPORT_ACCEPT}
                    multiple
                    hidden
                    onChange={handleFiles}
                />
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
