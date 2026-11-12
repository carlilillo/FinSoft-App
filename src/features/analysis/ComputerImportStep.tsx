import {
    type ChangeEvent,
    type DragEvent,
    useId,
    useRef,
    useState,
} from "react";
import { Button, Icon } from "@/shared/ui";
import {
    IMPORT_ACCEPT,
    importButtonLabel,
    MAX_IMPORT_FILE_BYTES,
    MAX_IMPORT_FILES,
} from "./analysis.model";
import { BackButton } from "./BackButton";
import { StagedFileList } from "./StagedFileList";
import type { ComputerImportStepProps } from "./types";
import { useStagedImport } from "./useStagedImport";
import styles from "./ComputerImportStep.module.css";

/**
 * Invoices from this computer: dragged onto the tray or picked with the file browser, they wait
 * in a list (where each can be removed) until "Import". A refused drop is explained here and the
 * dialog stays open; a dismissed picker changes nothing. The file input lives inside the dialog:
 * everything outside a modal dialog is inert.
 */
export function ComputerImportStep({
    onFilesChosen,
    onBack,
}: ComputerImportStepProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const chooseRef = useRef<HTMLButtonElement>(null);
    const removeButtons = useRef(new Map<string, HTMLButtonElement>());
    const hintId = useId();
    const errorId = useId();
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const { staged, error, add, remove } = useStagedImport();
    const hasFiles = staged.length > 0;
    const isFull = staged.length >= MAX_IMPORT_FILES;

    const handlePicked = (event: ChangeEvent<HTMLInputElement>) => {
        const files = [...(event.target.files ?? [])];
        event.target.value = "";
        if (files.length > 0) add(files);
    };

    // Text or links dragged around the page are not ours: only a drag that carries files lights the tray.
    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        if (!event.dataTransfer.types.includes("Files")) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
        setIsDraggingOver(true);
    };

    // Moving between the tray's own children fires dragleave too; only leaving the tray counts.
    const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
        if (event.currentTarget.contains(event.relatedTarget as Node | null))
            return;
        setIsDraggingOver(false);
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDraggingOver(false);
        const files = [...event.dataTransfer.files];
        if (files.length > 0) add(files);
    };

    // The removed row's button disappears: focus goes to the next row, else the previous, else the picker.
    const handleRemove = (id: string) => {
        const index = staged.findIndex((item) => item.id === id);
        const neighbour = staged[index + 1] ?? staged[index - 1];
        const target = neighbour
            ? removeButtons.current.get(neighbour.id)
            : chooseRef.current;
        target?.focus();
        remove(id);
    };

    const registerRemoveButton = (
        id: string,
        button: HTMLButtonElement | null,
    ) => {
        if (button) removeButtons.current.set(id, button);
        else removeButtons.current.delete(id);
    };

    return (
        <div className={styles.step}>
            <div
                className={styles.tray}
                data-compact={hasFiles || undefined}
                data-dragging={isDraggingOver || undefined}
                data-invalid={error ? true : undefined}
                onDragEnter={handleDragOver}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className={styles.stack} aria-hidden="true">
                    <span className={styles.sheet} data-layer="back" />
                    <span className={styles.sheet} data-layer="middle" />
                    <span className={styles.sheet} data-layer="front">
                        <span className={styles.rule} data-length="short" />
                        <span className={styles.rule} />
                        <span className={styles.rule} />
                        <span className={styles.total} />
                    </span>
                </div>
                <div className={styles.copy}>
                    <p className={styles.prompt}>
                        {trayPrompt(isDraggingOver, hasFiles, isFull)}
                    </p>
                    <p id={hintId} className={styles.hint}>
                        Up to {MAX_IMPORT_FILE_BYTES / 1024 / 1024} MB per file
                    </p>
                </div>
                <Button
                    ref={chooseRef}
                    variant={hasFiles ? "secondary" : "primary"}
                    disabled={isFull}
                    aria-describedby={error ? `${hintId} ${errorId}` : hintId}
                    onClick={() => inputRef.current?.click()}
                >
                    <Icon name="upload" size={16} />
                    {hasFiles ? "Add files" : "Choose files"}
                </Button>
                <input
                    ref={inputRef}
                    type="file"
                    accept={IMPORT_ACCEPT}
                    multiple
                    hidden
                    onChange={handlePicked}
                />
            </div>
            {error && (
                <p id={errorId} className={styles.error} role="alert">
                    {error}
                </p>
            )}
            <StagedFileList
                staged={staged}
                registerRemoveButton={registerRemoveButton}
                onRemove={handleRemove}
            />
            <footer className={styles.footer}>
                <BackButton onBack={onBack} />
                {hasFiles && (
                    <Button
                        onClick={() =>
                            onFilesChosen(staged.map((item) => item.file))
                        }
                    >
                        {importButtonLabel(staged.length)}
                    </Button>
                )}
            </footer>
        </div>
    );
}

function trayPrompt(
    isDraggingOver: boolean,
    hasFiles: boolean,
    isFull: boolean,
): string {
    if (isDraggingOver) return "Drop to attach";
    if (isFull) return `${MAX_IMPORT_FILES} attached, the most for one import`;
    return hasFiles ? "Drag more invoices here" : "Drag your invoices here";
}
