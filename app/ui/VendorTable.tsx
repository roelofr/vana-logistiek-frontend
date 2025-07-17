'use client';

import * as React from 'react';
import {use} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {Vendor} from "@/app/domain";
import {ApiResponse} from "@/app/stores/apiStore";
import DistrictBadge from "@/app/components/badges/DistrictBadge";

function Row({vendor}: { vendor: Vendor }) {
    return (
        <React.Fragment>
            <TableRow>
                <TableCell component="th" scope="row">
                    {vendor.number}
                </TableCell>
                <TableCell>
                    {vendor.name}
                </TableCell>
                <TableCell>
                    {vendor.district ? <DistrictBadge district={vendor.district}/> : <small><em>Onbekend</em></small>}
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

interface VendorTableArgs {
    vendors: Promise<ApiResponse<Vendor[]>>;
}

export default function VendorTable({vendors}: VendorTableArgs) {
    const data = use(vendors);

    return (
        <TableContainer component={Paper}>
            <Table aria-label="Tabel met standhouders">
                <TableHead>
                    <TableRow>
                        <TableCell>Nummer</TableCell>
                        <TableCell>Naam</TableCell>
                        <TableCell>Wijk</TableCell>
                    </TableRow>
                </TableHead>
                {data.ok ? (
                    <TableBody>
                        {data.data.map((vendor) => (
                            <Row key={vendor.id} vendor={vendor}/>
                        ))}
                    </TableBody>
                ) : (<h1>NO FAILED</h1>)}
            </Table>
        </TableContainer>
    );
}
