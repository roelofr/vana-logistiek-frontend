import {TicketPageUrlParams} from "@/app/(dashboard)/tickets/[id]/page";
import {auth} from "@/auth";
import {ApiStore} from "@/app/stores/apiStore";
import {Ticket, User} from "@/app/domain";
import {EntityType} from "@/app/lib/resolver";
import {PageContainer} from "@toolpad/core/PageContainer";
import AssignTicket from "@/app/actions/AssignTicket";
import Typography from '@mui/material/Typography'
import {redirect} from 'next/navigation'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

interface AssignPageProps {
    params: Promise<TicketPageUrlParams>
}

async function handleFormSubmit(ticket: Ticket, users: User[], event: SubmitEvent) {
    'use client';

    const data = new FormData(event.target as HTMLFormElement);
    const userIdValue = data.get('user')
    if (!userIdValue)
        return;

    const userId = Number.parseInt(userIdValue as string, 10)

    const user = users.find(user => user.id === userId);
    if (!user)
        return

    const comment = data.get('comment')

    try {
        await AssignTicket(ticket, user.id, comment ? comment as string : null);
    } catch (error) {
        alert(`Fout bij toewijzen: ${error instanceof Error ? (error as Error).message : error}`)
    } finally {
        redirect(`/tickets/${ticket.id}`);
    }
}

export default async function AssignPage({params}: AssignPageProps) {
    const {id: ticketId} = await params

    const session = await auth();
    const api = new ApiStore(session);

    const ticketPromise = api.getData<Ticket>(`/ticket/${ticketId}`);
    const usersPromise = api.getResolved<User>(EntityType.User, '/users');

    const [ticket, users] = await Promise.all([ticketPromise, usersPromise]);

    return (
        <PageContainer title={`Ticket #${ticketId} toewijzen`}>
            <Typography variant="body1">
                Kies hieronder aan wie je ticket #{ticketId} wil toewijzen.
            </Typography>

            <form onsubmit={event => handleFormSubmit(ticket, users, event)}>
                <FormControl fullWidth>
                    <InputLabel id="assign-user-label">Verantwoordelijke</InputLabel>
                    <Select
                        labelId="assign-user-label"
                        id="assign-user"
                        name="user"
                        label="Verantwoordelijke"
                    >
                        {users.map(user => {
                            const displayName = user.district ? `${user.name} (${user.district.name})` : user.name
                            return <MenuItem key={user.id} value={user.id}>{displayName}</MenuItem>
                        })}
                    </Select>
                </FormControl>
            </form>
        </PageContainer>
    )
}
