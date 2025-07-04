import NextAuth, {type DefaultSession} from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import type {Provider} from 'next-auth/providers';
import {DateTime} from 'luxon'

const loginPath = "/auth/login";

interface QuarkusSession {
    name: string;
    email: string;
    roles: string[];
    jwt: string;
    expiration: string;
}

declare module "next-auth" {
    interface Session {
        user: QuarkusSession & DefaultSession["user"]
    }
}

const providers: Provider[] = [
    Credentials({
        credentials: {
            email: {label: 'E-mailadres', type: 'email'},
            password: {label: 'Wachtwoord', type: 'password'},
        },
        async authorize(credentials) {
            const loginUrl = new URL(loginPath, process.env.SERVER_URL);
            console.log('Login URL = %s', loginUrl);

            const response = await fetch(loginUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: credentials.email,
                    password: credentials.password,
                })
            })

            if (!response.ok)
                return null

            return await response.json() as QuarkusSession;
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
        jwt({token, user}) {
            if (user) {
                const quarkusUser = user as QuarkusSession;
                token.jwt = quarkusUser.jwt
                token.exp = DateTime.fromISO(quarkusUser.expiration).toSeconds()
                token.
                token.roles = quarkusUser.roles;
            }

            return token;
        },
        authorized({auth: session, request: {nextUrl}}) {
            const isPublicPage = nextUrl.pathname.startsWith('/public');
            if (isPublicPage)
                return true;

            return Boolean(session?.user);
        },

    },
});
