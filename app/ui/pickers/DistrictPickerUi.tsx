import {ChangeEvent, use, useEffect, useMemo, useState} from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {District, ModelPicker} from "@/app/domain";
import {ApiResponse} from "@/app/stores/apiStore";

export function DistrictPickerUi({values, value, setValue}: ModelPicker<District>) {
    const apiResponse = use(values) as ApiResponse<District[]>;
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

        console.log('Picked district %o', vendor);

        setValue(vendor ?? null);
    }, [setValue, inputValue, allVendors]);

    return (
        <Box sx={{minWidth: 120}}>
            <FormControl fullWidth>
                <InputLabel id="vendor-select-label">Wijk</InputLabel>
                <Select
                    labelId="district-select-label"
                    id="district-select"
                    label="Standhouder"
                    value={inputValue}
                    onChange={event => handleChange(event as ChangeEvent)}
                >
                    {allVendors.map((district) => (
                        <MenuItem key={String(district.id)} value={district.id}>{district.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    )
}
