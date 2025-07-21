const tinyCache: Map<RelationType, Map<number, RelationRef>> = new Map();

interface RelationRef {
    id: number;
}

export enum RelationType {
    District,
    Ticket,
    Vendor,
}

export default function resolveRelation(name: RelationType, property: RelationRef | number | null): RelationRef | null {
    if (property === null)
        return null;

    if (! tinyCache.has(name))
        tinyCache.set(name, new Map());

    const values = tinyCache.get(name)!;

    if (typeof property == 'number')
        return values.get(property) ?? null;

    values.set(property.id, property);

    return property;
}
