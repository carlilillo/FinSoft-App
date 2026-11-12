import { apiGet, apiPostForm } from "@/shared/lib/http";
import type { UploadLinkInfo } from "./types";

/** No sign-in on the phone: the token in the link is the only credential. */
export function fetchUploadLink(token: string): Promise<UploadLinkInfo> {
    return apiGet<UploadLinkInfo>(
        `/phone-upload-links/${encodeURIComponent(token)}`,
    );
}

/** Sends the attached PDFs and photos; the link's owner gets a new extraction session and the link closes. */
export function sendInvoices(
    token: string,
    files: File[],
): Promise<{ runId: string }> {
    const form = new FormData();
    for (const file of files) form.append("files", file, file.name);
    return apiPostForm<{ runId: string }>(
        `/phone-upload-links/${encodeURIComponent(token)}/files`,
        form,
    );
}
