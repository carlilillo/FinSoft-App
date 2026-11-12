import { useId, useState } from "react";
import { ApiError } from "@/shared/lib/http";
import { Button, Icon } from "@/shared/ui";
import { MAX_IMPORT_FILES, RUN_LIMIT_MESSAGE } from "./analysis.model";
import { ImportSourceDialog } from "./ImportSourceDialog";
import { useImportInvoices, useRunCapacity } from "./useAnalysis";
import styles from "./ImportInvoicesButton.module.css";

/**
 * Asks where the invoices come from. Files from this computer start a new extraction session,
 * followed on its run page; the phone route does the same once the phone sends its files.
 */
export function ImportInvoicesButton() {
    const noteId = useId();
    const [isChoosingSource, setIsChoosingSource] = useState(false);
    const importing = useImportInvoices();
    const capacity = useRunCapacity();

    // The dialog has already checked the files and explained any it refused.
    const handleFilesChosen = (files: File[]) => {
        setIsChoosingSource(false);
        importing.mutate(files);
    };

    const note = capacity.isAtLimit
        ? RUN_LIMIT_MESSAGE
        : importErrorMessage(importing.error);

    return (
        <div className={styles.import}>
            <Button
                isBusy={importing.isPending}
                disabled={capacity.isAtLimit}
                aria-describedby={note ? noteId : undefined}
                aria-haspopup="dialog"
                title={`Up to ${MAX_IMPORT_FILES} invoices at once, from this computer or your phone`}
                onClick={() => setIsChoosingSource(true)}
            >
                <Icon name="upload" size={16} />
                {importing.isPending ? "Importing" : "Import invoices"}
            </Button>
            {note && (
                <p
                    id={noteId}
                    className={styles.note}
                    data-tone={capacity.isAtLimit ? "neutral" : "error"}
                    role={capacity.isAtLimit ? undefined : "alert"}
                >
                    {note}
                </p>
            )}
            <ImportSourceDialog
                isOpen={isChoosingSource}
                onClose={() => setIsChoosingSource(false)}
                onFilesChosen={handleFilesChosen}
            />
        </div>
    );
}

function importErrorMessage(error: Error | null): string | null {
    if (!error) return null;
    return error instanceof ApiError
        ? error.message
        : "The invoices couldn't be imported. Try again.";
}
