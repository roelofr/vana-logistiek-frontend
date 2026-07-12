type KeyLike = {
  id: number;
};

export function expand<T extends object>(
  input: T[] | undefined,
  selectors: (keyof T | Record<keyof T, string>)[],
): T[] {
  if (!input || typeof input?.map !== "function") return [];

  const mappedSelectors = selectors.map((selector, index) => {
    if (typeof selector === "string") return { key: selector, index: selector };
    if (typeof selector === "object" && Object.entries(selector).length == 1)
      return {
        key: Object.keys(selector)[0] as keyof T,
        index: Object.values(selector)[0] as string,
      };
    throw new Error(
      `Illegal expansion at index ${index}, expected string or {property: index}`,
    );
  });

  let outData = Array.from(input);

  const indexCache = new Map<string, Map<number, KeyLike>>();
  for (const { key, index } of mappedSelectors) {
    if (!indexCache.has(index))
      indexCache.set(index, new Map<number, KeyLike>());
    const localCache = indexCache.get(index)!;

    outData = outData.map((row) => {
      if (!Object.hasOwn(row, key)) return row;

      const rowValue = row[key];
      if (rowValue && typeof rowValue === "number") {
        // @ts-expect-error TS2322 Key is a trusted cache
        row[key] = localCache.get(rowValue as number)!;
        return row;
      }

      if (rowValue) {
        const cacheable = rowValue as unknown as KeyLike;
        localCache.set(cacheable.id, cacheable);
      }

      return row;
    });
  }

  return outData;
}
