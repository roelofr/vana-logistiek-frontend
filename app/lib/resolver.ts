const tinyCache: Map<RelationType, Map<number, RelationRef>> = new Map();

interface RelationRef {
    id: number;
}

export enum RelationType {
    District,
    Ticket,
    Vendor,
}

export default function resolveRelation<T extends RelationRef>(name: RelationType, property: T | number | null): T | null {
    if (property === null)
        return null;

    if (!tinyCache.has(name))
        tinyCache.set(name, new Map());

    const values = tinyCache.get(name)!;

    if (typeof property == 'number')
        return (values.get(property) ?? null) as T | null;

    values.set(property.id, property);

    return property;
}
