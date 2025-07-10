"use client";

import {useEffect, useState} from "react";
import {Hanko} from "@teamhanko/hanko-elements";
import {createHanko, registerHanko} from "@/app/lib/hanko";

interface HankoAuthProps {
    onLoginAction: (token: string) => void;
}

export default function HankoAuth({onLoginAction}: HankoAuthProps) {
    const [hanko, setHanko] = useState<Hanko>();

    useEffect(() => setHanko(createHanko()), []);

    useEffect(
        () => {
            hanko?.onSessionCreated(() => onLoginAction(hanko.getSessionToken()))
        },
        [hanko, onLoginAction]);

    useEffect(() => {
        registerHanko().catch((error) => {
            // handle error
            console.log(error);
        });
    }, []);

    return <hanko-auth/>;
}
