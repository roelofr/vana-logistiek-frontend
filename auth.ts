import NextAuth, {Session} from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import type {Provider} from 'next-auth/providers';
import {JWT} from "@auth/core/jwt";
import {ApiStore} from "@/app/stores/apiStore";

const loginPath = "/auth/consume";

interface QuarkusSession {
    name: string;
    email: string;
    roles: string[];
    jwt: string;
    expiration: string;
}

const providers: Provider[] = [
    Credentials({
        credentials: {
            token: {},
        },
        async authorize(credentials) {
            console.log('Credential login started, credentials = %o', credentials);
            const response = await fetch(ApiStore.apiUrl(loginPath), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({token: credentials.token})
            })

            if (!response.ok) {
                console.warn('Login response was %o', response);
                return null
            }

            console.log('Got OK response from API');

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
                token.jwt = quarkusUser.jwt;
                token.roles = quarkusUser.roles;
                token.email = quarkusUser.email;
                token.given_name = quarkusUser.name;
            }

            return token;
        },
        session({session, token}: { session: Session, token: JWT }) {
            session.user.jwt = token.jwt as string
            session.user.roles = token.roles as string[]
            session.user.email = token.email as string
            session.user.name = token.given_name as string

            return session
        },
        async authorized({auth: session, request: {nextUrl}}) {
            const isPublicPage = nextUrl.pathname.startsWith('/public');
            if (isPublicPage)
                return true;

            if (!session?.user?.jwt)
                return false;

            console.log('Got session user %o', {
                ...session.user,
                jwt: 'jwt',
            });

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
