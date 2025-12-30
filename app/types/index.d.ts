import type { AvatarProps } from '@nuxt/ui'

export type SaleStatus = 'paid' | 'failed' | 'refunded'

export type LoadingType = 'full' | 'partial' | null

export interface User {
  id: number
  name: string
  email: string
  avatar?: AvatarProps
  location: string
}

export interface District {
  id: number
  name: string
  colour?: string
}

export interface Vendor {
  id: number
  name: string
  number: string
  district?: Only<'id' | 'name', District>
}

export interface Thread {
  id: number
  unread?: boolean
  from: Only<'id' | 'name', User>
  vendor: Only<'id' | 'name', Vendor>
  subject: string
}

export interface Mail {
  id: number
  unread?: boolean
  from: User
  subject: string
  body: string
  date: string
}

export interface Member {
  name: string
  username: string
  role: 'member' | 'owner'
  avatar: AvatarProps
}

export interface Stat {
  title: string
  icon: string
  value: number | string
  variation: number
  formatter?: (value: number) => string
}

export interface Sale {
  id: string
  date: string
  status: SaleStatus
  email: string
  amount: number
}

export interface Notification {
  id: number
  unread?: boolean
  sender: User
  body: string
  date: string
}

export type Period = 'daily' | 'weekly' | 'monthly'

export interface Range {
  start: Date
  end: Date
}
