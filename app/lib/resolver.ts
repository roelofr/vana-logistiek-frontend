import {DataModel} from "@toolpad/core/Crud";
import {Ticket, TicketAttachment, User} from "@/app/domain";

const tinyCache: Map<RelationType, Map<number, DataModel>> = new Map();

export enum RelationType {
    District,
    Ticket,
    Vendor,
    User,
}

export enum EntityType {
    User,
    TicketAttachment,
    Ticket,
    Vendor,
}

export default function resolveRelation<T extends DataModel>(name: RelationType, property: T | number | null): T | null {
    if (property === null)
        return null;

    if (!tinyCache.has(name))
        tinyCache.set(name, new Map());

    const values = tinyCache.get(name)!;

    if (typeof property == 'number')
        return (values.get(property) ?? null) as T | null;

    values.set(property.id as number, property);

    return property;
}

export function resolveEntity<T>(type: EntityType, entity: T): T {
    switch (type) {
        case EntityType.Ticket:
            return {
                ...entity,
                vendor: resolveRelation(RelationType.Vendor, (entity as Ticket).vendor ?? null),
                creator: resolveRelation(RelationType.User, (entity as Ticket).creator ?? null),
                assignee: resolveRelation(RelationType.User, (entity as Ticket).assignee ?? null),
            } as T;

        case EntityType.TicketAttachment:
            return {
                ...entity,
                user: resolveRelation(RelationType.User, (entity as TicketAttachment).user ?? null)
            } as T;

        case EntityType.User:
        case EntityType.Vendor:
            return {
                ...entity,
                district: resolveRelation(RelationType.District, (entity as User).district ?? null)
            } as T;
    }
}
