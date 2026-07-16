type KeyLike = {
  id: number;
};

type ExpansionMapping = Map<string, Map<number, KeyLike>>;

interface ExpansionSelector<T extends object> {
  key: keyof T;
  index: string;
}

function expandEntry<T extends object>(
  value: T,
  selectors: ExpansionSelector<T>[],
  cache: ExpansionMapping,
): T {
  if (!value) return value;

  const newValue = { ...value };

  for (const { key, index } of selectors) {
    // Skip if row is not present
    if (!Object.hasOwn(value, key)) continue;

    // Ensure cache exists
    if (!cache.has(index)) cache.set(index, new Map<number, KeyLike>());

    const localCache = cache.get(index)!;

    const isArray = Array.isArray(value[key]);
    const keyValue = (isArray ? value[key] : [value[key]]) as T[keyof T][];

    keyValue.forEach((rowValue, rowIndex) => {
      if (rowValue && typeof rowValue === "number") {
        // @ts-expect-error TS2322 Key is a trusted cache
        keyValue[rowIndex] = localCache.get(rowValue as number)!;
        return;
      }

      if (rowValue) {
        const cacheable = rowValue as unknown as KeyLike;
        localCache.set(cacheable.id, cacheable);
      }
    });

    // Update value, unpack array if required
    newValue[key] = (isArray ? keyValue : keyValue[0]) as T[keyof T];
  }

  return newValue;
}

function mapSelectors<T extends object>(
  selectors: (keyof T | (keyof T)[])[],
): ExpansionSelector<T>[] {
  return selectors.flatMap((selector, index) => {
    if (typeof selector === "string") return { key: selector, index: selector };

    if (
      Array.isArray(selector) &&
      selector.length > 0 &&
      selector.every((s) => typeof s === "string")
    ) {
      const index = selector[0] as string;
      return selector.map((key): ExpansionSelector<T> => ({ key, index }));
    }

    throw new Error(
      `Illegal expansion at index ${index}, expected string or [string, string]`,
    );
  });
}

export function expandMap<T extends object>(
  selectors: (keyof T | (keyof T)[])[],
): (value: T) => T {
  const mappedSelectors = mapSelectors<T>(selectors);
  const indexCache = new Map<string, Map<number, KeyLike>>();

  return (value: T): T => expandEntry(value, mappedSelectors, indexCache);
}

export function expand<T extends object>(
  input: T[] | undefined,
  selectors: (keyof T | (keyof T)[])[],
): T[] {
  if (!input || typeof input?.map !== "function") return [];

  return input.map(expandMap(selectors));
}
