'use server';
import {AuthError} from 'next-auth';
import {signIn} from '@/auth';
import {REDIRECT_ERROR_CODE} from "next/dist/client/components/redirect-error";

export default async function signInAction(token: string, callbackUrl?: string) {
    try {
        return await signIn("credentials", {
            token,
            redirectTo: callbackUrl ?? '/',
        });
    } catch (error) {
        // The desired flow for successful sign in in all cases
        // and unsuccessful sign in for OAuth providers will cause a `redirect`,
        // and `redirect` is a throwing function, so we need to re-throw
        // to allow the redirect to happen
        // Source: https://github.com/vercel/next.js/issues/49298#issuecomment-1542055642
        // Detect a `NEXT_REDIRECT` error and re-throw it
        if (error instanceof Error && error.message === REDIRECT_ERROR_CODE) {
            console.log('Caught redirect error %o', error);
            throw error;
        }

        // Handle Auth.js errors
        if (error instanceof AuthError) {
            return {
                error:
                    error.type === 'CredentialsSignin'
                        ? 'Ongeldige inloggegevens.'
                        : 'Er is iets fout gegaan met de authenticatiebibliotheek.',
                type: error.type,
            };
        }

        // Log this, we're out-of-bounds
        console.error('Caught out-of-bounds error %o: %s', typeof error, (error as Error).message, error);

        // An error boundary must exist to handle unknown errors
        return {
            error: 'Er is iets fout gegaan.',
            type: 'UnknownError',
        };
    }
}
