import { format, isToday } from 'date-fns'
import type { ListThread, Thread, User } from '~/types'

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomFrom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]!
}

type KeyLike = {
  id: number
}

function toDate(value: Date | string | undefined): Date | null {
  if (!value)
    return null

  if (value instanceof Date)
    return value

  try {
    return new Date(value)
  } catch (err) {
    console.warn('Failed to parse %o into a valid date: %o', value, err)
    return null
  }
}

export function formattedLocalTime(time: Date | string | undefined, wantedFormat: string) {
  const actualTime = toDate(time)
  if (!actualTime)
    return undefined

  return format(actualTime, wantedFormat)
}

export function localTime(time: Date | string | undefined): string | undefined {
  const actualTime = toDate(time)
  if (!actualTime)
    return undefined

  if (isToday(actualTime))
    return format(actualTime, 'HH:mm')
  return format(actualTime, 'dd MMM, HH:mm')
}

export function expand<T extends object>(input: T[] | undefined, selectors: (keyof T)[]): T[] {
  if (!input || typeof input?.map !== 'function')
    return []

  let outData = Array.from(input)

  for (const key of selectors) {
    const localCache = new Map<number, KeyLike>()
    outData = outData.map((row) => {
      if (!Object.hasOwn(row, key))
        return row

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

export function unreadForUser(thread: Thread, user: User): boolean {
  if (!user)
    return true

  if (user?.id && thread.assignedUser?.id === user.id)
    return thread.read

  if (user?.team?.id && thread.assignedTeam?.id === user.team?.id)
    return thread.read

  return true
}

declare type ThreadMapper = (thread: ListThread) => ListThread

export function unreadForUserMap(user: User): ThreadMapper {
  return (thread: Thread) => {
    thread.read = unreadForUser(thread, user)
    return thread
  }
}
