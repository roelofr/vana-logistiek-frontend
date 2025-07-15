"use client";

import {useEffect, useState} from "react";
import {Hanko} from "@teamhanko/hanko-elements";
import {createHanko, registerHanko} from "@/app/lib/hanko";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

interface HankoAuthProps {
    onLoginAction: (token: string) => void;
}

export default function HankoAuth({onLoginAction}: HankoAuthProps) {
    const [hanko, setHanko] = useState<Hanko>();
    const [loading, setLoading] = useState<Boolean>(false);

    useEffect(() => setHanko(createHanko()), []);

    useEffect(
        () => {
            hanko?.onSessionCreated(() => {
                setLoading(true);
                onLoginAction(hanko.getSessionToken())
            })
        },
        [hanko, onLoginAction]);

    useEffect(() => {
        registerHanko().catch((error) => {
            // handle error
            console.log(error);
        });
    }, []);

    if (!loading)
        return <hanko-auth/>;

    return (
        <Box sx={{ display: 'flex' }}>
            <CircularProgress />
        </Box>
    );
}
