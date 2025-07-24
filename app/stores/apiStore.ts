import {Session} from "next-auth";
import {EntityType, resolveEntity} from "@/app/lib/resolver";

const DEFAULT_HOST = new URL('https://example.com/api')

export class ApiStore {
    public static apiUrl(path: string, searchParams: null | URLSearchParams = null) {
        const asUrl = new URL(path, DEFAULT_HOST)
        if (asUrl.origin !== DEFAULT_HOST.origin)
            throw new Error("Not a proper API route")

        const cleanPath = path.replace(/^\/+/, '')
        const apiUrl = new URL(cleanPath, process.env.SERVER_URL)
        if (searchParams != null)
            searchParams.forEach((value, key) => apiUrl.searchParams.append(key, value));
        return apiUrl
    }

    constructor(private readonly session: Pick<Session, 'user'> | null) {
        //
    }

    private get nonce(): string {
        if (!this.session?.user)
            throw new Error("User is not authenticated")

        return this.session.user.jwt
    }

    private async fetch<T>(path: string, params: RequestInit): Promise<ApiResponse<T>> {
        const requestHeaders = new Headers({
            ...(params.headers ?? {}),
            'Accept': 'application/json',
            'Authorization': `Bearer ${this.nonce}`,
        });

        const requestUrl = ApiStore.apiUrl(path)

        const requestParams: RequestInit = {
            ...params,
            headers: requestHeaders,
        };

        const response = await fetch(requestUrl, requestParams);

        // Run some default response codes
        if (response.status === 401) {
            return {ok: false, error: 401}
        }

        const contentType = response.headers.get('Content-Type');
        if (!contentType?.startsWith('application/json')) {
            console.warn('Recieved HTTP Content-Type %s from %s, which does not JSON-decode', contentType, response.url)
            return {ok: false, error: response.status}
        }

        const responseBody = await response.json();
        if (!response.ok)
            return {ok: false, error: response.status, message: responseBody as string}

        return {ok: true, data: responseBody as T};
    }

    async head<T>(url: string): Promise<ApiResponse<T>> {
        return this.fetch<T>(url, {method: 'HEAD'})
    }

    async get<T>(url: string): Promise<ApiResponse<T>> {
        return this.fetch<T>(url, {method: 'GET'})
    }

    async post<T>(url: string, body: unknown = null): Promise<ApiResponse<T>> {
        return this.fetch<T>(url, {
            method: 'POST',
            body: body ? JSON.stringify(body) : null,
            headers: {
                'Content-Type': 'application/json',
            }
        })
    }

    async getData<T>(url: string): Promise<T> {
        return this.get<T>(url)
            .then(response => {
                if (!response.ok)
                    throw new Error(`HTTP call failed: ${response.error}`)
                return response.data
            });
    }

    async getResolved<T>(type: EntityType, url: string): Promise<T[]> {
        return this.getData<T[]>(url)
            .then(data => data.map(row => resolveEntity(type, row)));
    }
}

export interface ApiSuccessResponse<T> {
    ok: true;
    data: T;
}

export interface ApiErrorResponse {
    ok: false;
    error: number;
    message?: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse
