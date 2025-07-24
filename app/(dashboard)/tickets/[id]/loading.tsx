import PageContainerWithToolbar from "@/app/components/PageContainerWithToolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';

function MenuActionSkeleton() {
    return (
        <Button
            disabled
            aria-haspopup="true"
            variant="outlined"
            disableElevation
            endIcon={<KeyboardArrowDownIcon/>}
        >
            Acties
        </Button>
    )
}

export default function Loading() {
    return (
        <PageContainerWithToolbar title={"Ticket wordt geladen..."} toolbar={<MenuActionSkeleton/>}>
            <Typography variant="body1" gutterBottom>
                Hieronder staan de details van het ticket.
            </Typography>

            <Stack direction="row" spacing={2}>
                <Skeleton variant="rectangular" width={210} height={60}/>
                <Skeleton variant="rectangular" width={210} height={60}/>
            </Stack>
        </PageContainerWithToolbar>
    )
}
