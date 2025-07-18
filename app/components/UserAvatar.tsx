import {User} from "@/app/domain";
import Avatar from "@mui/material/Avatar";

function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

interface UserAvatarArgs {
    user: User;
    sx?: unknown;
}

export default function UserAvatar(props: UserAvatarArgs) {
    const { user } = props;
    const userInitial = user.name.trim().toUpperCase()[0];

    const childProps = {
        ...props,
        sx: {
            ...(props.sx ?? {}),
            bgcolor: stringToColor(user.name)
        }
    }

    return (
        <Avatar {...childProps}>{userInitial}</Avatar>
    );
}
