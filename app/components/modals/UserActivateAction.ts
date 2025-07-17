import {auth} from "@/auth";
import {ApiStore} from "@/app/stores/apiStore";
import {District, User} from "@/app/domain";

export default async function ActivateUser(user: User, roles: string[], district: District | null) {
    const session = await auth()

    if (!session)
        throw new Error('Failed to load session');

    const api = new ApiStore(session);

    return await api.post(`/admin/users/${user.id}/activate`, {
        roles,
        districtId: district?.id ?? null
    });
}
