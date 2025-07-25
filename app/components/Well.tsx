import {PropsWithChildren} from "react";

import Box from '@mui/material/Box';

export default function Well({children}: PropsWithChildren) {
    return (
        <Box
            sx={{
                padding: 1,
                borderRadius: 1,
                bgcolor: 'background.paper'
            }}>
            {children}
        </Box>
    )
}
