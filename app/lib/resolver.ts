import {DataModel} from "@toolpad/core/Crud";

const tinyCache: Map<RelationType, Map<number, DataModel>> = new Map();

export enum RelationType {
    District,
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
