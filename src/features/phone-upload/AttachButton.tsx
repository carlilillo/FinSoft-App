import { type ChangeEvent, useRef } from "react";
import { Icon } from "@/shared/ui";
import { PICK_ACCEPT } from "./phone-upload.model";
import type { AttachButtonProps, PickKind } from "./types";
import styles from "./PhoneUploadPage.module.css";

const LABELS: Record<PickKind, { title: string; detail: string }> = {
    document: { title: "Documents", detail: "PDF files" },
    photo: { title: "Photos", detail: "From your gallery" },
};

/** Opens the phone's own picker; several files can be picked at once, as many as still fit. */
export function AttachButton({
    kind,
    remaining,
    isDisabled,
    onPick,
}: AttachButtonProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const label = LABELS[kind];

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = [...(event.target.files ?? [])];
        event.target.value = "";
        if (files.length > 0) onPick(files);
    };

    return (
        <>
            <button
                type="button"
                className={styles.attachButton}
                disabled={isDisabled || remaining === 0}
                onClick={() => inputRef.current?.click()}
            >
                <span className={styles.attachIcon}>
                    <Icon
                        name={kind === "document" ? "document" : "image"}
                        size={24}
                    />
                </span>
                <span className={styles.attachTitle}>{label.title}</span>
                <span className={styles.attachDetail}>{label.detail}</span>
            </button>
            <input
                ref={inputRef}
                type="file"
                accept={PICK_ACCEPT[kind]}
                multiple
                hidden
                onChange={handleChange}
            />
        </>
    );
}
