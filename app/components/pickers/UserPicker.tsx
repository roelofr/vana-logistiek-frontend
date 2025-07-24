import {Suspense} from 'react'
import {ApiStore} from "@/app/stores/apiStore";
import {auth} from "@/auth";
import {User} from "@/app/domain";
import UserPickerUi from "@/app/ui/pickers/UserPickerUi";
import {EntityType} from "@/app/lib/resolver";

export interface UserPickerProps {
    value?: User | number | null;
    onChange: (value: number | null) => void;
}

export default function UserPicker(props: UserPickerProps) {
    // Don't await the data fetching function
    const users = auth()
        .then(session => new ApiStore(session))
        .then(api => api.getResolved<User>(EntityType.User, '/users'));

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <UserPickerUi users={users} {...props}/>
        </Suspense>
    )
}
