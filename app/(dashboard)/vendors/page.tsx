import {Suspense} from 'react'
import {Ticket} from "@/app/domain";
import Tickets from '@/app/ui/tickets/tickets';

export default function VendorPage() {
    // Lazy-load the ticket
    const tickets = new Promise(resolve => resolve([])) as Promise<Ticket[]>;

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Tickets tickets={tickets}/>
        </Suspense>
    )
}
