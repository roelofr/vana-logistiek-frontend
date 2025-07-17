'use server';

import {auth} from "@/auth";
import {ApiStore} from "@/app/stores/apiStore";
import {District} from "@/app/domain";

export default async function LoadDistricts() {
    const session = await auth()

    if (!session)
        throw new Error('Failed to load session');

    const api = new ApiStore(session);

    return await api.get<District[]>('/districts');

}
