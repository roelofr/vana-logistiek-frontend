import {Session} from "next-auth";

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


    constructor(private readonly session: Session | null) {
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
        })

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

    async get<T>(url: string): Promise<ApiResponse<T>> {
        return this.fetch<T>(url, {method: 'GET'})
    }

    async post<T>(url: string, body: unknown): Promise<ApiResponse<T>> {
        return this.fetch<T>(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            }
        })
    }
}

export type ApiResponse<T> = {
    ok: true;
    data: T;
} | {
    ok: false;
    error: number;
    message?: string;
}
