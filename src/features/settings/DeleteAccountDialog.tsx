import { useState } from "react";
import { useDesign } from "@/features/design-lab";
import { Button, Dialog, ErrorState } from "@/shared/ui";
import { DELETE_CONFIRMATION, isDeleteConfirmed } from "./settings.model";
import type { DeleteAccountDialogProps } from "./types";
import { useDeleteAccount } from "./useSettings";
import styles from "./SettingsPage.module.css";

export function DeleteAccountDialog({
    isOpen,
    onClose,
}: DeleteAccountDialogProps) {
    const { design } = useDesign();
    const [confirmation, setConfirmation] = useState("");
    const deletion = useDeleteAccount();

    const handleClose = () => {
        setConfirmation("");
        onClose();
    };

    return (
        <Dialog
            isOpen={isOpen}
            title="Delete your account"
            onClose={handleClose}
            isDraggable={design.motion === "expressive"}
        >
            <p>
                This permanently deletes your invoices, products, stored
                documents and analysis history, and removes your sign-in. It
                can&apos;t be undone.
            </p>
            <label className={styles.field}>
                Type “{DELETE_CONFIRMATION}” to confirm
                <input
                    value={confirmation}
                    onChange={(event) => setConfirmation(event.target.value)}
                    autoComplete="off"
                />
            </label>
            {deletion.isError && <ErrorState error={deletion.error} />}
            <div className={styles.formActions}>
                <Button
                    variant="danger"
                    disabled={!isDeleteConfirmed(confirmation)}
                    isBusy={deletion.isPending}
                    onClick={() => deletion.mutate()}
                >
                    Delete account
                </Button>
                <Button variant="ghost" onClick={handleClose}>
                    Keep my account
                </Button>
            </div>
        </Dialog>
    );
}
