interface HankoSession {
    sessionId: string;
    email: string;
    username: string;
    roles: string[];
    token: string;
}

interface TicketDetails {
    title: string;
    details: string | null;
}
