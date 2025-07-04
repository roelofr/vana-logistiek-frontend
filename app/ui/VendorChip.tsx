import Chip from "@mui/material/Chip";
import {Vendor} from '@/app/domain';

export default function VendorChip({vendor}: { vendor: Vendor }) {
    return <Chip icon={<p>{vendor.number}</p>} label={vendor.name}/>
}
