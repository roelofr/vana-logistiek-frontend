import {Session} from "next-auth";
import {HttpError} from "@/app/exceptions";

const DEFAULT_HOST = new URL('https://example.com/api')

export class ApiStore {
    public static apiUrl(path: string) {
        const asUrl = new URL(path, DEFAULT_HOST)
        if (asUrl.origin !== DEFAULT_HOST.origin)
            throw new Error("Not a proper API route")

        const cleanPath = path.replace(/^\/+/, '')
        return new URL(cleanPath, process.env.SERVER_URL)
    }


    constructor(private readonly session: Session | null) {
        //
    }

    private get nonce(): string {
        if (!this.session?.user)
            throw new Error("User is not authenticated")

        return this.session.user.jwt
    }

    private async fetch<T>(path: string, params: RequestInit): Promise<T> {
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

        if (!response.headers.get('Content-Type')?.startsWith('application/json'))
            throw new HttpError(response.status, response.statusText, await response.text())

        const responseBody = await response.json();
        if (!response.ok)
            throw new HttpError(response.status, response.statusText, responseBody);

        return responseBody as T;
    }

    async get<T>(url: string): Promise<T> {
        return this.fetch<T>(url, {method: 'GET'})
    }

    async post<T>(url: string, body: unknown): Promise<T> {
        return this.fetch<T>(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            }
        })
    }
}
