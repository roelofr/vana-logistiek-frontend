'use client';

import Box from "@mui/material/Box";

interface GenericDataProps {
    data: Record<string, unknown>;
    setData: (data: Record<string, unknown>) => void;
    back: () => void;
}

export default function TicketGenericDataStep({data, setData, back}: GenericDataProps) {


    return (
        <Box>
            <h1>Generic Data Step</h1>

            <pre><code>${JSON.stringify(data, undefined, 2)}</code></pre>

            <button onClick={() => setData({})}>Continue</button>
            <button onClick={() => back()}>Back</button>
        </Box>
    )
}
