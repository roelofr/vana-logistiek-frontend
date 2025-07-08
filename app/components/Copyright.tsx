import * as React from 'react';
import Typography from '@mui/material/Typography';

export default function Copyright(props: any) {
    const sx = Array.isArray(props.sx) ? props.sx : [props.sx];

    return (
        <Typography
            variant="body2"
            align="center"
            {...props}
            sx={[
                {
                    color: 'text.secondary',
                },
                ...sx,
            ]}
        >
            {`© ${new Date().getFullYear()}. Alle rechten voorbehouden.`}<br/>
            {'Toegang tot dit systeem is alleen voor geautoriseerde medewerkers van Vana Events B.V.'}<br/>
            {'Misbruik is strafbaar en gebruik wordt gelogd.'}
        </Typography>
    );
}
