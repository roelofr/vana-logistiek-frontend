import {ApiStore} from "@/app/stores/apiStore";
import {auth} from "@/auth";
import {PageContainer} from '@toolpad/core/PageContainer';
import {User} from "@/app/domain";
import SkeletonTable from "@/app/components/skeletons/SkeletonTable";
import {Suspense} from "react";
import UserTable from "@/app/ui/UserTable";

export default function UserPage() {
    // Lazy load the vendors, eventually.
    const users = auth()
        .then(session => new ApiStore(session))
        .then(api => api.get<User[]>('/users'));

    const skeletonCols = [{
        title: 'Naam',
        width: 300
    }, {
        title: 'Rol',
        width: 60
    }, {
        title: 'Wijk',
        width: 60
    }]

    return (
        <PageContainer>
            <Suspense fallback={<SkeletonTable columns={skeletonCols}/>}>
                <UserTable users={users}/>
            </Suspense>
        </PageContainer>
    )
}
