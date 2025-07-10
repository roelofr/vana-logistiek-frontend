'use client'

import {createContext, ReactNode, useCallback, useEffect, useState} from 'react'
import {DateTime} from "luxon";
import {Hanko} from "@teamhanko/hanko-elements";
import {createHanko} from "@/app/lib/hanko";

export const SessionContext = createContext<HankoSession | null>(null)

export default function SessionProvider({children}: { children: ReactNode }) {
    const [hanko, setHanko] = useState<Hanko | null>(null);
    const [session, setSession] = useState<HankoSession | null>(null)

    const validateSession = useCallback(() => {
        if (!hanko)
            return;

        hanko.validateSession().then(response => {
            if (!response.is_valid || !response.expiration_time)
                throw new Error("Session is invalid")

            if (DateTime.fromISO(response.expiration_time) < DateTime.now())
                throw new Error("Session has expired")

            return hanko.getUser();
        })
            .then(user => {
                if (!user)
                    throw new Error("Failed to load user")

                const firstEmail = user.emails!.pop()!.address;

                setSession({
                    sessionId: user.user_id,
                    email: firstEmail,
                    username: user.username?.username ?? firstEmail,
                    roles: [],
                    token: hanko.getSessionToken(),
                });
            })
            .catch(() => {
                setSession(null)
            })
    }, [hanko]);

    useEffect(() => setHanko(createHanko()), [])

    useEffect(() => {
        if (!hanko)
            return;

        validateSession()
        hanko.onSessionExpired(() => validateSession());
        hanko.onUserLoggedOut(() => validateSession());
    }, [hanko, validateSession])


    return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>
}
