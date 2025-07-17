import Chip from "@mui/material/Chip";
import {Vendor} from "@/app/domain";

interface VendorBadgeArgs {
    vendor: Vendor;
}

export default function VendorBadge({vendor}: VendorBadgeArgs) {
    if (vendor == null)
        return "";

    return (
        <Chip
            label={vendor.name}
            variant="outlined"
        />
    );
}
