// Types used by two or more features. A feature's own types live in its own types.d.ts.

export type Page<T> = {
    items: T[];
    page: number;
    pageSize: number;
    total: number;
};

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export type ApiRequest = {
    method: HttpMethod;
    path: string;
    body?: unknown;
};

export type Currency = string;

export type TokenGetter = () => Promise<string | null>;

export type RequestInterceptor = (request: ApiRequest) => Promise<unknown>;
