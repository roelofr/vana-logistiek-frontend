import {ChangeEvent, use, useEffect, useMemo, useState} from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {ModelPicker, Vendor} from "@/app/domain";
import {ApiResponse} from "@/app/stores/apiStore";

export function VendorPickerUi({values, value, setValue}: ModelPicker<Vendor>) {
    const apiResponse = use(values) as ApiResponse<Vendor[]>;
    const allVendors = useMemo(() => apiResponse.ok ? apiResponse.data : [], [apiResponse]);

    const [inputValue, setInputValue] = useState<string | number>(value?.id ?? '');

    function handleChange(event: ChangeEvent) {
        const vendorId = Number.parseInt((event.target as HTMLInputElement).value, 10);

        if (inputValue == vendorId)
            return;

        setInputValue(vendorId);
    }

    useEffect(() => {
        if (!setValue)
            return;

        const vendor = allVendors.find(row => row.id === inputValue);

        console.log('Picked vendor %o', vendor);

        setValue(vendor ?? null);
    }, [setValue, inputValue, allVendors]);

    return (
        <Box sx={{minWidth: 120}}>
            <FormControl fullWidth>
                <InputLabel id="vendor-select-label">Standhouder</InputLabel>
                <Select
                    labelId="vendor-select-label"
                    id="vendor-select"
                    label="Standhouder"
                    value={inputValue}
                    onChange={event => handleChange(event as ChangeEvent)}
                >
                    {allVendors.map((vendor) => (
                        <MenuItem key={String(vendor.id)} value={vendor.id}>{vendor.number} - {vendor.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    )
}
