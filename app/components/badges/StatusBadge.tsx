import Chip, {ChipProps} from "@mui/material/Chip";
import {TicketStatus} from "@/app/domain";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from '@mui/icons-material/Edit';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import CheckIcon from '@mui/icons-material/Check';
import ArchiveIcon from '@mui/icons-material/Archive';
import WarningIcon from '@mui/icons-material/Warning';

const statusProperties = (status: TicketStatus): Partial<ChipProps> => {
    switch (status) {
        case TicketStatus.Created:
            return {
                color: 'primary',
                icon: <AddIcon/>
            }
        case TicketStatus.Updated:
            return {
                color: 'secondary',
                icon: <EditIcon/>
            }
        case TicketStatus.Assigned:
            return {
                color: 'success',
                icon: <AssignmentIndIcon/>
            }
        case TicketStatus.Resolved:
            return {
                icon: <CheckIcon/>
            }
        case TicketStatus.Completed:
            return {
                icon: <ArchiveIcon/>
            }
        default:
            return {
                color: 'error',
                icon: <WarningIcon/>
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
