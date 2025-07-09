import Chip from "@mui/material/Chip";
import {User} from "@/app/domain";
import UserAvatar from "@/app/components/UserAvatar";

interface UserBadgeArgs {
    user: User;
}

export default function UserBadge({user}: UserBadgeArgs) {
    if (user == null)
        return "";

    return (
        <Chip
            avatar={<UserAvatar user={user}/>}
            label={user.name}
            variant="outlined"
        />
    );
}
