'use client'

import * as React from 'react';
import {Vendor} from "@/app/domain";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import {ApiResponse} from "@/app/stores/apiStore";

export default function VendorPickerUi({vendors}: { vendors: Promise<ApiResponse<Vendor[]>> }) {
    const apiResponse = React.use(vendors)
    const allVendors = apiResponse.ok ? apiResponse.data : [];
    const [vendor, setVendor] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setVendor(event.target.value as string);
    };
    return (
        <Box sx={{minWidth: 120}}>
            <FormControl fullWidth>
                <InputLabel id="vendor-select-label">Standhouder</InputLabel>
                <Select
                    labelId="vendor-select-label"
                    id="vendor-select"
                    value={vendor}
                    label="Standhouder"
                    onChange={handleChange}
                >
                    {allVendors.map((vendor) => (
                        <MenuItem key={vendor.id} value={vendor.id}>{vendor.number} - {vendor.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}
