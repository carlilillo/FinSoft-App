import { formatFileSize } from "@/features/invoices";
import { Icon } from "@/shared/ui";
import type {
    PhotoPreviewProps,
    PickedFileListProps,
    PickedFileRowProps,
} from "./types";
import { useFilePreview } from "./usePhoneUpload";
import styles from "./PhoneUploadPage.module.css";

export function PickedFileList({
    picked,
    isDisabled,
    onRemove,
}: PickedFileListProps) {
    if (picked.length === 0) return null;
    return (
        <ul className={styles.files} aria-label="Attached files">
            {picked.map((item) => (
                <PickedFileRow
                    key={item.id}
                    item={item}
                    isDisabled={isDisabled}
                    onRemove={onRemove}
                />
            ))}
        </ul>
    );
}

function PickedFileRow({ item, isDisabled, onRemove }: PickedFileRowProps) {
    return (
        <li className={styles.file}>
            <span className={styles.thumb}>
                {item.kind === "photo" ? (
                    <PhotoPreview file={item.file} />
                ) : (
                    <Icon name="document" size={22} />
                )}
            </span>
            <span className={styles.fileText}>
                <span className={styles.fileName}>{item.file.name}</span>
                <span className={styles.fileMeta}>
                    {item.kind === "photo" ? "Photo" : "PDF"},{" "}
                    {formatFileSize(item.file.size)}
                </span>
            </span>
            <button
                type="button"
                className={styles.remove}
                disabled={isDisabled}
                aria-label={`Remove ${item.file.name}`}
                onClick={() => onRemove(item.id)}
            >
                <Icon name="close" size={18} />
            </button>
        </li>
    );
}

/** Formats the browser can't draw (HEIC on most Androids) fall back to the icon underneath. */
function PhotoPreview({ file }: PhotoPreviewProps) {
    const previewRef = useFilePreview(file);
    return (
        <>
            <Icon name="image" size={22} />
            <img
                ref={previewRef}
                className={styles.thumbImage}
                alt=""
                onError={(event) => {
                    event.currentTarget.hidden = true;
                }}
            />
        </>
    );
}
