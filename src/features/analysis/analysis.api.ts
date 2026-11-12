import {
    apiDelete,
    apiGet,
    apiPost,
    apiPostForm,
    apiPut,
} from "@/shared/lib/http";
import type {
    AnalysisSchedule,
    ContinueRequest,
    GmailAccount,
    GmailConsentIntent,
    PhoneUploadLink,
    PhoneUploadLinkState,
    RunDetail,
    RunListItem,
    ScheduleUpdate,
} from "./types";

export function fetchGmailAccounts(): Promise<GmailAccount[]> {
    return apiGet<GmailAccount[]>("/gmail/connections");
}

export function disconnectGmailAccount(accountId: string): Promise<void> {
    return apiDelete(`/gmail/connections/${accountId}`);
}

/** Google's consent page; it always offers the account picker, so a second account can be linked. */
export async function requestGmailConsentUrl(
    intent: GmailConsentIntent,
): Promise<string> {
    const { url } = await apiPost<{ url: string }>("/gmail/oauth/url", {
        intent,
    });
    return url;
}

export function startAnalysis(): Promise<{ runId: string }> {
    return apiPost<{ runId: string }>("/analyses");
}

/** Starts an extraction session from invoice files (PDFs or images) the person picked, instead of their inbox. */
export function importInvoices(files: File[]): Promise<{ runId: string }> {
    const form = new FormData();
    for (const file of files) form.append("files", file, file.name);
    return apiPostForm<{ runId: string }>("/analyses/imports", form);
}

/** A fresh single-use link (shown as a QR code) through which the person's phone imports invoices. */
export function createPhoneUploadLink(): Promise<PhoneUploadLink> {
    return apiPost<PhoneUploadLink>("/phone-uploads");
}

export function fetchPhoneUploadLink(
    linkId: string,
): Promise<PhoneUploadLinkState> {
    return apiGet<PhoneUploadLinkState>(`/phone-uploads/${linkId}`);
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

export function fetchAnalysisSchedule(): Promise<AnalysisSchedule> {
    return apiGet<AnalysisSchedule>("/analysis-schedule");
}

export function saveAnalysisSchedule(
    update: ScheduleUpdate,
): Promise<AnalysisSchedule> {
    return apiPut<AnalysisSchedule>("/analysis-schedule", update);
}
