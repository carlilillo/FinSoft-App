import type { FormEvent } from "react";
import { formatDateTime } from "@/shared/lib/dates";
import { Button, Icon } from "@/shared/ui";
import { AttachButton } from "./AttachButton";
import { PickedFileList } from "./PickedFileList";
import { attachedLabel, remainingSlots, sendLabel } from "./phone-upload.model";
import type { UploadFormProps } from "./types";
import { usePickedFiles } from "./usePhoneUpload";
import styles from "./PhoneUploadPage.module.css";

export function UploadForm({
    expiresAt,
    isSending,
    sendError,
    onSend,
}: UploadFormProps) {
    const { picked, pickError, add, remove } = usePickedFiles();
    const remaining = remainingSlots(picked);
    const error = pickError ?? sendError;

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (picked.length > 0) onSend(picked.map((item) => item.file));
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.intro}>
                <h1 className={styles.title}>Send invoices</h1>
                <p className={styles.lead}>
                    Attach PDFs or photos of your invoices, up to 10 in total.
                    They&apos;ll be read on your computer.
                </p>
            </div>

            <fieldset className={styles.attach} disabled={isSending}>
                <legend className={styles.legend}>
                    {attachedLabel(picked.length)}
                </legend>
                <AttachButton
                    kind="document"
                    remaining={remaining}
                    isDisabled={isSending}
                    onPick={(files) => add(files, "document")}
                />
                <AttachButton
                    kind="photo"
                    remaining={remaining}
                    isDisabled={isSending}
                    onPick={(files) => add(files, "photo")}
                />
            </fieldset>

            {error && (
                <p className={styles.error} role="alert">
                    {error}
                </p>
            )}

            <PickedFileList
                picked={picked}
                isDisabled={isSending}
                onRemove={remove}
            />

            <div className={styles.sendBar}>
                <Button
                    type="submit"
                    className={styles.send}
                    isBusy={isSending}
                    disabled={picked.length === 0}
                >
                    <Icon name="upload" size={16} />
                    {isSending ? "Sending…" : sendLabel(picked.length)}
                </Button>
                <p className={styles.expiry}>
                    This link works once, until{" "}
                    <time dateTime={expiresAt}>
                        {formatDateTime(expiresAt)}
                    </time>
                </p>
            </div>
        </form>
    );
}
