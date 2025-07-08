import NextAuth, {type DefaultSession, Session} from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import type {Provider} from 'next-auth/providers';
import {DateTime} from 'luxon'
import {JWT} from "@auth/core/jwt";
import {ApiStore} from "@/app/stores/apiStore";

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
        user: {
            roles: string[];
            jwt: string;
        } & DefaultSession["user"]
    }
}

const providers: Provider[] = [
    Credentials({
        credentials: {
            email: {label: 'E-mailadres', type: 'email'},
            password: {label: 'Wachtwoord', type: 'password'},
        },
        async authorize(credentials) {
            const response = await fetch(ApiStore.apiUrl(loginPath), {
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
                token.exp = DateTime.fromISO(quarkusUser.expiration).toSeconds()
                token.nonce = quarkusUser.jwt;
                token.roles = quarkusUser.roles;
            }

            return token;
        },
        session({session, token}: { session: Session, token: JWT }) {
            // @ts-ignore
            session.user.roles = token.roles
            // @ts-ignore
            session.user.jwt = token.nonce
            return session
        },
        async authorized({auth: session, request: {nextUrl}}) {
            const isPublicPage = nextUrl.pathname.startsWith('/public');
            if (isPublicPage)
                return true;

            if (!session?.user?.jwt)
                return false;

            try {
                return (await fetch(ApiStore.apiUrl('/auth'), {
                    method: 'HEAD',
                    cache: 'no-cache',
                    headers: {
                        'Authorization': `Bearer ${session.user.jwt}`
                    }
                })).ok
            } catch (error) {
                console.error("Fetch failed %o", error);
                return false;
            }
        },

    },
});
