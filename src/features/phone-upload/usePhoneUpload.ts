import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { addPicked, removePicked } from "./phone-upload.model";
import { fetchUploadLink, sendInvoices } from "./phone-upload.api";
import type { PickedFile, PickKind } from "./types";

export function useUploadLink(token: string) {
    return useQuery({
        queryKey: ["upload-link", token],
        queryFn: () => fetchUploadLink(token),
    });
}

export function useSendInvoices(token: string) {
    return useMutation({
        mutationFn: (files: File[]) => sendInvoices(token, files),
    });
}

/** The files attached so far, and why the last pick was refused (cleared by the next accepted one). */
export function usePickedFiles() {
    const [picked, setPicked] = useState<PickedFile[]>([]);
    const [pickError, setPickError] = useState<string | null>(null);

    const add = (files: File[], kind: PickKind) => {
        const result = addPicked(picked, files, kind);
        if (result.kind === "rejected") {
            setPickError(result.message);
            return;
        }
        setPickError(null);
        setPicked(result.picked);
    };

    const remove = (id: string) => {
        setPickError(null);
        setPicked((current) => removePicked(current, id));
    };

    return { picked, pickError, add, remove };
}
