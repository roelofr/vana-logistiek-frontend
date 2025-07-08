import {Suspense} from 'react'
import {ApiStore} from "@/app/stores/apiStore";
import {auth} from "@/auth";
import {User} from "@/app/domain";
import UserPickerUi from "@/app/ui/pickers/UserPickerUi";

export default function UserPicker() {
    // Don't await the data fetching function
    const users = auth()
        .then(session => new ApiStore(session))
        .then(store => new Promise(resolve => setTimeout(() => resolve(store), 500)) as Promise<ApiStore>)
        .then(api => api.get<User[]>('/users'))
        .then(users => {
            console.log('Users fetch = %o', users)
            return users;
        });

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <UserPickerUi users={users}/>
        </Suspense>
    )
}
