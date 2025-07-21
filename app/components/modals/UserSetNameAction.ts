'use server';

import {auth} from "@/auth";
import {ApiStore} from "@/app/stores/apiStore";
import {User} from "@/app/domain";

export default async function UserSetNameAction(user: User, name: string) {
    const session = await auth()

    if (!session)
        throw new Error('Failed to load session');

    const api = new ApiStore(session);

    return await api.post(`/admin/users/${user.id}/set-name`, {name});
}
