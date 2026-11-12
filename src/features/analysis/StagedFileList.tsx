import { AnimatePresence, m } from "motion/react";
import { useId } from "react";
import { formatFileSize } from "@/features/invoices";
import { useFilePreview } from "@/shared/lib/file-preview";
import { Icon } from "@/shared/ui";
import { MAX_IMPORT_FILES, stagedFileKind } from "./analysis.model";
import type {
    StagedFileListProps,
    StagedFileRowProps,
    StagedThumbProps,
} from "./types";
import styles from "./StagedFileList.module.css";

const SLOTS = Array.from({ length: MAX_IMPORT_FILES }, (_, index) => index);
const COLLAPSED = { opacity: 0, height: 0 };
const EXPANDED = { opacity: 1, height: "auto" };
const ROW_TRANSITION = { duration: 0.22, ease: [0.22, 1, 0.36, 1] } as const;

/**
 * What "Import" will send, one row per invoice. Removing a row moves focus to its neighbour (or,
 * for the last one, to the file picker), so keyboard users never lose their place.
 */
export function StagedFileList({
    staged,
    registerRemoveButton,
    onRemove,
}: StagedFileListProps) {
    const countId = useId();
    if (staged.length === 0) return null;

    return (
        <section className={styles.batch} aria-labelledby={countId}>
            <header className={styles.header}>
                <p id={countId} className={styles.count} role="status">
                    {staged.length} of {MAX_IMPORT_FILES} attached
                </p>
                <span className={styles.slots} aria-hidden="true">
                    {SLOTS.map((slot) => (
                        <span
                            key={slot}
                            className={styles.slot}
                            data-filled={slot < staged.length || undefined}
                        />
                    ))}
                </span>
            </header>
            <ul className={styles.files}>
                <AnimatePresence initial={false}>
                    {staged.map((item) => (
                        <m.li
                            key={item.id}
                            className={styles.row}
                            initial={COLLAPSED}
                            animate={EXPANDED}
                            exit={COLLAPSED}
                            transition={ROW_TRANSITION}
                        >
                            <StagedFileRow
                                item={item}
                                removeRef={(button) =>
                                    registerRemoveButton(item.id, button)
                                }
                                onRemove={onRemove}
                            />
                        </m.li>
                    ))}
                </AnimatePresence>
            </ul>
        </section>
    );
}

function StagedFileRow({ item, removeRef, onRemove }: StagedFileRowProps) {
    return (
        <div className={styles.file}>
            <span className={styles.thumb}>
                {item.format === "image" ? (
                    <ImageThumb item={item} />
                ) : (
                    <Icon name="document" size={18} />
                )}
            </span>
            <span className={styles.text}>
                <span className={styles.name} title={item.file.name}>
                    {item.file.name}
                </span>
                <span className={styles.meta}>
                    {stagedFileKind(item)}, {formatFileSize(item.file.size)}
                </span>
            </span>
            <button
                ref={removeRef}
                type="button"
                className={styles.remove}
                aria-label={`Remove ${item.file.name}`}
                onClick={() => onRemove(item.id)}
            >
                <Icon name="close" size={16} />
            </button>
        </div>
    );
}

/** Formats the browser can't draw (HEIC, TIFF in most browsers) fall back to the icon underneath. */
function ImageThumb({ item }: StagedThumbProps) {
    const previewRef = useFilePreview(item.file);
    return (
        <>
            <Icon name="image" size={18} />
            <img
                ref={previewRef}
                className={styles.preview}
                alt=""
                onError={(event) => {
                    event.currentTarget.hidden = true;
                }}
            />
        </>
    );
}
