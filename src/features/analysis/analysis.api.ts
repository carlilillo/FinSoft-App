import { apiDelete, apiGet, apiPost, apiPostForm } from "@/shared/lib/http";
import type {
    ContinueRequest,
    GmailConnection,
    RunDetail,
    RunListItem,
} from "./types";

export function fetchGmailConnection(): Promise<GmailConnection> {
    return apiGet<GmailConnection>("/gmail/connection");
}

export function disconnectGmail(): Promise<void> {
    return apiDelete("/gmail/connection");
}

export async function requestGmailConsentUrl(): Promise<string> {
    const { url } = await apiPost<{ url: string }>("/gmail/oauth/url");
    return url;
}

export function startAnalysis(): Promise<{ runId: string }> {
    return apiPost<{ runId: string }>("/analyses");
}

/** Starts an extraction session from PDFs the person picked, instead of their inbox. */
export function importInvoices(files: File[]): Promise<{ runId: string }> {
    const form = new FormData();
    for (const file of files) form.append("files", file, file.name);
    return apiPostForm<{ runId: string }>("/analyses/imports", form);
}

export function continueAnalysis(
    runId: string,
    request: ContinueRequest,
): Promise<{ runId: string }> {
    return apiPost<{ runId: string }>(`/analyses/${runId}/continue`, request);
}

export function fetchRun(runId: string): Promise<RunDetail> {
    return apiGet<RunDetail>(`/analyses/${runId}`);
}

export function fetchRuns(): Promise<RunListItem[]> {
    return apiGet<RunListItem[]>("/analyses");
}
