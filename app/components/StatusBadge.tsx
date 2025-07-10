import Chip, {ChipProps} from "@mui/material/Chip";
import {TicketStatus} from "@/app/domain";

import NewReleasesRoundedIcon from '@mui/icons-material/NewReleasesRounded';
import FlagCircleRoundedIcon from '@mui/icons-material/FlagCircleRounded';
import Person4RoundedIcon from '@mui/icons-material/Person4Rounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';


const statusProperties = (status: TicketStatus): Partial<ChipProps> => {
    switch (status) {
        case TicketStatus.Created:
            return {
                color: 'primary',
                icon: <NewReleasesRoundedIcon/>
            }
        case TicketStatus.Updated:
            return {
                color: 'secondary',
                icon: <FlagCircleRoundedIcon/>
            }
        case TicketStatus.Assigned:
            return {
                color: 'success',
                icon: <Person4RoundedIcon/>
            }
        case TicketStatus.Resolved:
            return {
                icon: <CheckCircleRoundedIcon/>
            }
        default:
            return {
                color: 'error',
                icon: <NewReleasesRoundedIcon/>
            }
    }
}

interface StatusBadgeArgs {
    status: TicketStatus;
}

export default function StatusBadge({status}: StatusBadgeArgs) {
    return (
        <Chip
            label={status}
            variant="outlined"
            {...statusProperties(status)}
        />
    );
}
