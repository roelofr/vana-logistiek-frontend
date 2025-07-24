import {DateTime} from "luxon"
import {DataModel} from "@toolpad/core/Crud";
import {ElementType} from "react";
import AssignmentIcon from '@mui/icons-material/Assignment';
import {ApiResponse} from "@/app/stores/apiStore";

/*
 * ENUMS
 */
export enum AttachmentType {
    Created = 'Created',
    Comment = 'Comment',
    StatusChange = 'StatusChange',
    Assignment = 'Assignment'
}

export enum TicketStatus {
    Created = 'Created',
    Assigned = 'Assigned',
    Updated = 'Updated',
    Resolved = 'Resolved',
    Completed = 'Completed',
}

export enum TicketType {
    Generic = 'Generic'
}

/*
 * MODELS
 */
export interface District extends DataModel {
    id: number
    name: string
    mobileName: string
    colour: string
    users?: User
    vendors?: Vendor
}

export interface Ticket extends DataModel {
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
    data?: Record<string, unknown>;
}

export interface TicketAttachment extends DataModel {
    id: number
    createdAt: DateTime
    ticket?: Ticket
    user?: User
    type: AttachmentType
    summary: string
    description: string
}

export interface User extends DataModel {
    id: number
    name: string
    email?: string
    active?: boolean
    roles?: string[]
    district?: District
}

export interface Vendor extends DataModel {
    id: number
    name: string
    number: string
    numberNumeric: number
    district?: District
}

class TicketTypeDetail {
    constructor(public readonly type: TicketType,
                public readonly label: string,
                public readonly icon: ElementType) {
        //
    }
}

export const TicketTypeDetails = new Map([
    [TicketType.Generic, new TicketTypeDetail(
        TicketType.Generic,
        'Generiek',
        AssignmentIcon,
    )]
])

export interface ModelPicker<T> {
    values: Promise<ApiResponse<T[]>>;
    value: T | null;
    setValue: (value: T | null) => void;
    disabled?: boolean;
}


export interface DownloadingModelPicker<T> extends Omit<ModelPicker<T>, "values"> {
    values?: Promise<ApiResponse<T[]>>;
}
