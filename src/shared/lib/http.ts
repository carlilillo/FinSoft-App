import type {
    ApiRequest,
    HttpMethod,
    RequestInterceptor,
    TokenGetter,
} from "@/shared/types";
import { API_URL } from "./env";

/** Error returned by the API, with its stable domain `code` when there is one. */
export class ApiError extends Error {
    readonly status: number;
    readonly code: string | null;

    constructor(status: number, message: string, code: string | null) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.code = code;
    }
}

let getToken: TokenGetter = () => Promise.resolve(null);
let interceptor: RequestInterceptor | null = null;

/** Registered by the auth feature so every request carries the Clerk session token. */
export function setTokenGetter(getter: TokenGetter): void {
    getToken = getter;
}

/** Preview mode answers every request locally (see app/preview). */
export function setRequestInterceptor(next: RequestInterceptor | null): void {
    interceptor = next;
}

export function apiGet<T>(path: string): Promise<T> {
    return request<T>({ method: "GET", path });
}

export function apiPost<T>(path: string, body?: unknown): Promise<T> {
    return request<T>({ method: "POST", path, body });
}

export function apiDelete<T = void>(path: string): Promise<T> {
    return request<T>({ method: "DELETE", path });
}

async function request<T>(apiRequest: ApiRequest): Promise<T> {
    if (interceptor) return (await interceptor(apiRequest)) as T;

    const token = await getToken();
    const response = await fetch(`${API_URL}${apiRequest.path}`, {
        method: apiRequest.method,
        headers: buildHeaders(token, apiRequest.method),
        body:
            apiRequest.body === undefined
                ? undefined
                : JSON.stringify(apiRequest.body),
    });

    if (!response.ok) throw await toApiError(response);
    if (response.status === 204) return undefined as T;
    return (await response.json()) as T;
}

function buildHeaders(token: string | null, method: HttpMethod): HeadersInit {
    const headers: Record<string, string> = { Accept: "application/json" };
    if (method !== "GET") headers["Content-Type"] = "application/json";
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
}

async function toApiError(response: Response): Promise<ApiError> {
    try {
        const body = (await response.json()) as {
            message?: string | string[];
            code?: string;
        };
        const message = Array.isArray(body.message)
            ? body.message.join(". ")
            : body.message;
        return new ApiError(
            response.status,
            message ?? response.statusText,
            body.code ?? null,
        );
    } catch {
        return new ApiError(response.status, response.statusText, null);
    }
}

/** Uploads a file straight to S3 with a presigned URL (no auth header: the URL is the credential). */
export async function uploadToPresignedUrl(
    url: string,
    file: File,
    headers: Record<string, string>,
): Promise<void> {
    if (interceptor) return;
    const response = await fetch(url, { method: "PUT", body: file, headers });
    if (!response.ok)
        throw new ApiError(
            response.status,
            "The upload was rejected by storage",
            null,
        );
}
