'use server';

import {auth} from "@/auth";
import {ApiStore} from "@/app/stores/apiStore";
import {Vendor} from "@/app/domain";

export default async function fetchVendors() {
    const session = await auth();

    if (session == null)
        throw new Error("Session not found");

    const api = new ApiStore(session);

    return await api.get<Vendor[]>('/vendor');
}
