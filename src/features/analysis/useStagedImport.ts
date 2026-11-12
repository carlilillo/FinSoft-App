import { useState } from "react";
import { stageImportFiles } from "./analysis.model";
import type { StagedImportFile } from "./types";

/** The invoices attached in the import dialog, and why the last drop or pick was refused (cleared by the next change). */
export function useStagedImport() {
    const [staged, setStaged] = useState<StagedImportFile[]>([]);
    const [error, setError] = useState<string | null>(null);

    const add = (files: File[]) => {
        const result = stageImportFiles(staged, files);
        if (result.kind === "rejected") {
            setError(result.message);
            return;
        }
        setError(null);
        setStaged(result.staged);
    };

    const remove = (id: string) => {
        setError(null);
        setStaged((current) => current.filter((item) => item.id !== id));
    };

    return { staged, error, add, remove };
}
