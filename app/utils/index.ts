import { format, isToday } from 'date-fns'

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomFrom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]!
}

type KeyLike = {
  id: number
}

export function localTime(time: Date | string | undefined): string | undefined {
  if (!time)
    return undefined

  const actualTime = time instanceof Date ? time : new Date(time)
  if (isToday(actualTime))
    return format(actualTime, 'dd MMM, HH:mm')
  return format(actualTime, 'dd MMM')
}

export function expand<T extends object>(input: T[] | undefined, selectors: (keyof T)[]): T[] {
  if (!input)
    return []

  let outData = input

  for (const key of selectors) {
    const localCache = new Map<number, KeyLike>()
    outData = outData.map((row, index) => {
      if (!Object.hasOwn(row, key)) {
        console.log('Row #%d skipped', index)
        return row
      }

      const rowValue = row[key]
      if (rowValue && typeof rowValue === 'number') {
        // @ts-expect-error TS2322 Key is a trusted cache
        row[key] = localCache.get(rowValue as number)!
        return row
      }

      if (rowValue) {
        const cacheable = rowValue as unknown as KeyLike
        localCache.set((cacheable).id, cacheable)
      }

      return row
    })
  }

  return outData
}
