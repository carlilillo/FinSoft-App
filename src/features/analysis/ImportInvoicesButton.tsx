import { type ChangeEvent, useId, useRef, useState } from "react";
import { ApiError } from "@/shared/lib/http";
import { Button, Icon } from "@/shared/ui";
import {
    checkImportSelection,
    MAX_IMPORT_FILES,
    RUN_LIMIT_MESSAGE,
} from "./analysis.model";
import { useImportInvoices, useRunCapacity } from "./useAnalysis";
import styles from "./ImportInvoicesButton.module.css";

/** Opens the file picker; the chosen PDFs start a new extraction session, followed on its run page. */
export function ImportInvoicesButton() {
    const inputRef = useRef<HTMLInputElement>(null);
    const noteId = useId();
    const [selectionError, setSelectionError] = useState<string | null>(null);
    const importing = useImportInvoices();
    const capacity = useRunCapacity();

    const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
        const selection = checkImportSelection([...(event.target.files ?? [])]);
        event.target.value = "";
        if (selection.kind === "invalid") {
            setSelectionError(selection.message);
            return;
        }
        setSelectionError(null);
        importing.mutate(selection.files);
    };

    const note = capacity.isAtLimit
        ? RUN_LIMIT_MESSAGE
        : (selectionError ?? importErrorMessage(importing.error));

    return (
        <div className={styles.import}>
            <input
                ref={inputRef}
                type="file"
                accept="application/pdf,.pdf"
                multiple
                hidden
                onChange={handleFiles}
            />
            <Button
                isBusy={importing.isPending}
                disabled={capacity.isAtLimit}
                aria-describedby={note ? noteId : undefined}
                title={`Up to ${MAX_IMPORT_FILES} PDF invoices at once`}
                onClick={() => inputRef.current?.click()}
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
        </div>
    );
}

function importErrorMessage(error: Error | null): string | null {
    if (!error) return null;
    return error instanceof ApiError
        ? error.message
        : "The invoices couldn't be imported. Try again.";
}
