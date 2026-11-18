import { useId, useState } from "react";
import type { InvoiceDirection } from "@/features/invoices";
import { ApiError } from "@/shared/lib/http";
import { Button, Icon } from "@/shared/ui";
import { IMPORT_COPY, RUN_LIMIT_MESSAGE } from "./analysis.model";
import { ImportSourceDialog } from "./ImportSourceDialog";
import { useImportInvoices, useRunCapacity } from "./useAnalysis";
import styles from "./ImportActions.module.css";

/** Secondary first, so the primary action ends the row. */
const DIRECTIONS: readonly InvoiceDirection[] = ["issued", "received"];

/**
 * "Import your invoices" (the ones the person sent to customers) and "Import invoices" (from providers). Both ask where
 * the files come from in the same dialog; files from this computer start a new extraction session, followed on its run
 * page, and the phone route does the same once the phone sends its files.
 */
export function ImportActions() {
    const noteId = useId();
    const [isChoosingSource, setIsChoosingSource] = useState(false);
    const [direction, setDirection] = useState<InvoiceDirection>("received");
    const importing = useImportInvoices();
    const capacity = useRunCapacity();

    const handleOpen = (next: InvoiceDirection) => {
        setDirection(next);
        setIsChoosingSource(true);
    };

    // The dialog has already checked the files and explained any it refused.
    const handleFilesChosen = (files: File[]) => {
        setIsChoosingSource(false);
        importing.mutate({ files, direction });
    };

    const note = capacity.isAtLimit
        ? RUN_LIMIT_MESSAGE
        : importErrorMessage(importing.error);
    const importingDirection = importing.isPending
        ? importing.variables.direction
        : null;

    return (
        <div className={styles.import}>
            <div className={styles.buttons}>
                {DIRECTIONS.map((option) => (
                    <Button
                        key={option}
                        variant={option === "issued" ? "secondary" : "primary"}
                        isBusy={importingDirection === option}
                        disabled={capacity.isAtLimit || importing.isPending}
                        aria-describedby={note ? noteId : undefined}
                        aria-haspopup="dialog"
                        title={IMPORT_COPY[option].buttonHint}
                        onClick={() => handleOpen(option)}
                    >
                        <Icon name="upload" size={16} />
                        {importingDirection === option
                            ? "Importing"
                            : IMPORT_COPY[option].button}
                    </Button>
                ))}
            </div>
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
                direction={direction}
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
