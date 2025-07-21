import * as React from 'react';
import {PageContainer} from '@toolpad/core/PageContainer';
import Typography from "@mui/material/Typography";
import Divider from '@mui/material/Divider';

export default function Dashboard() {
    return (
        <PageContainer title="LogistiekApp">
            <Typography variant="body1">
                <br/>
                Beste logistieker,<br/>
                <br/>
                Je bent fantastisch bezig, ik houd van jullie allemaal, ga zo Door en vergeet niet te eten.<br/>
                <br />
                Beste lezer, niet-logistieker,<br/>
                <br/>
                Dit is een app voor het <strong>beste</strong> team van de opbouw.<br/>
                Hoor je niet bij Logistiek? Dan zie je niet zo heel erg veel op deze site.<br/>
                Maar niet getreurd; wij wel!<br/>
                <br/>
                Rechtsbovenin zit de confetti-knop. Ik hoop dat je er blij van wordt.<br/>
                <br/>
                Kusjes,<br/>
                Tessa
            </Typography>

            <Divider variant="middle" sx={{my: 4}}/>

            <Typography>
                Heb je hier niets te zoeken, maar nu wel een account? Log dan uit.<br/>
                De gegevens achter deze applicatie, inclusief alle accounts, worden per 1 september gewist.<br/>
                <br/>
                Kusjes,<br/>
                Roelof
            </Typography>
        </PageContainer>
    );
}
