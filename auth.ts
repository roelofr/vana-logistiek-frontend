import NextAuth, {CredentialsSignin, type DefaultSession} from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import type {Provider} from 'next-auth/providers';
import {DateTime} from 'luxon'

const LOGIN_PATH = "/auth/login";

interface LoginResponse {
    name: string;
    jwt: string;
    expiration: string;
}

interface SessionUser {
    name: string;
    jwt: string;
    expiration: DateTime;
}

declare module "next-auth" {
    interface Session {
        user: SessionUser & DefaultSession["user"]
    }
}

enum AuthErrorCode {
    AuthFailed = 'AuthFailed',
    AccountLocked = 'AccountLocked',
    ServerError = 'ServerError',
    Unknown = 'Unknown'
}

class AuthError extends CredentialsSignin {
    constructor(public readonly code: AuthErrorCode, message: string) {
        super(message);
    }
}

const loginWithCredentials = async (username: string, password: string): Promise<SessionUser> => {
    const response = await fetch(new URL(LOGIN_PATH, process.env.SERVER_URL), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            password,
        })
    });

    if (response.status === 401)
        throw new AuthError(AuthErrorCode.AuthFailed, "Invalid credentials")
    if (response.status === 403)
        throw new AuthError(AuthErrorCode.AccountLocked, "Account locked")
    if (response.status >= 500)
        throw new AuthError(AuthErrorCode.ServerError, "Server error")

    if (response.status !== 200)
        throw new AuthError(AuthErrorCode.Unknown, `Unknown response ${response.status} ${response.statusText}`)

    const loginResponse = await response.json() as LoginResponse;

    return {
        ...loginResponse,
        expiration: DateTime.fromISO(loginResponse.expiration),
    }
}

const providers: Provider[] = [
    Credentials({
        credentials: {
            email: {label: 'E-mailadres', type: 'email'},
            password: {label: 'Wachtwoord', type: 'password'},
        },
        async authorize(credentials) {
            try {
                const res = await loginWithCredentials(credentials.email as string, credentials.password as string);
                console.log("Login to %o OK!", res.name);
                return res;
            } catch (error) {
                if (error instanceof AuthError) {
                    console.warn("Failed to login to %o: %o", credentials.email, error.code);
                }
            }

            return null;
        },
    }),
];

export const providerMap = providers.map((provider) => {
    if (typeof provider === 'function') {
        const providerData = provider();
        return {id: providerData.id, name: providerData.name};
    }
    return {id: provider.id, name: provider.name};
});

export const {handlers, auth, signIn, signOut} = NextAuth({
    providers,
    secret: process.env.AUTH_SECRET,
    pages: {
        signIn: '/auth/signin',
    },
    callbacks: {
        authorized({auth: session, request: {nextUrl}}) {
            const isPublicPage = nextUrl.pathname.startsWith('/public');
            if (isPublicPage)
                return true;

            const user = session?.user as SessionUser;
            console.log('AUth check, %o, %o', Boolean(user), Boolean(user && user.expiration > DateTime.now()));
            if (user)
                console.log('U = %o, Exp = %o, now = %o', user, user.expiration, DateTime.now().toISO());

            return user && user.expiration > DateTime.now();
        },
    },
});
