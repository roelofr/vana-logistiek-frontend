import {DateTime} from "luxon"

/*
 * ENUMS
 */
export enum AttachmentType {
    Created,
    Comment,
    StatusChange,
    Assignment
}

export enum TicketStatus {
    Created,
    Assigned,
    Updated,
    Resolved
}

export enum TicketType {
    Generic
}

/*
 * MODELS
 */
export interface District {
    id: number
    name: string
    mobileName: string
    colour: string
    users?: User
    vendors?: Vendor
}

export interface Ticket {
    id: number
    createdAt: DateTime
    updatedAt: DateTime
    completedAt: DateTime
    description: string
    status: TicketStatus
    vendor?: Vendor
    creator?: User
    assignee?: User
    attachments?: TicketAttachment[]
}

export interface TicketAttachment {
    id: number
    createdAt: DateTime
    ticket?: Ticket
    user?: User
    type: AttachmentType
    summary: string
    description: string
}

export interface User {
    id: number
    name: string
    email?: string
    active?: boolean
    roles?: string[]
    district?: District
}

export interface Vendor {
    id: number
    name: string
    number: string
    numberNumeric: number
    district?: District
}
