export class AuthenticationError extends Error {}

export class HttpError extends Error {
    constructor(
        public readonly statusCode: number,
        public readonly statusText: string,
        public readonly body: unknown,
    ) {
        super(`Got HTTP ${statusCode} ${statusText} from server`);
    }
}
