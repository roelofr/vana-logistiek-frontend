export type SaleStatus = 'paid' | 'failed' | 'refunded'

export type LoadingType = 'full' | 'partial' | null

export interface Team {
  id: number
  name: string
  system: boolean
}

export interface User {
  id: number
  name: string
  email: string
  team?: Team
  roles?: string[]
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
  subject: string
  read: boolean
  createdAt: Date
  updatedAt: Date
  resolvedAt: null | Date
  vendor: Vendor
  user: User
  team: Team
  assignedUser: null | User
  assignedTeam: null | Team
}

export type ThreadUpdateType = 'System' | 'Chat' | 'Resolved'

export interface ThreadUpdate {
  id: number
  message: string
  type: ThreadUpdateType
  date: Date
  me: boolean
  user: null | Only<'id' | 'name', User>
  team: null | Only<'id' | 'name', Team>
}
