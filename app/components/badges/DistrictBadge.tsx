import {District} from "@/app/domain";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import {useMemo} from "react";

function getDistrictColor(district: District): string | null {
    const districtColor = String(district.colour).toLowerCase();

    switch (districtColor) {
        case 'amber':
            return '#e54e07'
        case 'stone':
            return '#b24c00'
        case 'red':
            return '#bc2015'
        case 'blue':
            return '#0096ff'
        case 'yellow':
            return '#f1e900'
        case 'lime':
            return '#5ebc15'
        case 'pink':
            return '#bc15a4'
        default:
            return null
    }
}

interface DistrictBadgeProps {
    district: District | null
}

export default function DistrictBadge({district}: DistrictBadgeProps) {
    const mobileName = useMemo(() => district ? String(district.mobileName ?? district.name)[0].toUpperCase() : '??', [district]);
    const color = useMemo(() => district ? getDistrictColor(district) : null, [district]);

    if (district == null)
        return <Chip label="onbekend"/>

    return (
        <Chip
            label={`${district.name}`}
            avatar={<Avatar sx={{bgcolor: color}}>{mobileName}</Avatar>}
        />
    )


}
