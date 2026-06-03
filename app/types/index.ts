/**
 * A model, or a reference if this reference has already been filled.
 */
export type QuarkusRef<T> = number | T

export type LoadingType = 'full' | 'partial' | null

export type IssueFilter = 'open' | 'unread' | 'all'

export interface Group {
  id: number
  name: string
  system: boolean
  icon: string
  colour: string
}

export interface User {
  id: number
  name: string
  email: string
  group?: Group
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
  type: string
  district?: Only<'id' | 'name', District>
}

export interface Issue {
  id: number
  subject: string
  read: boolean
  createdAt: Date
  updatedAt: Date
  resolvedAt: null | Date
  vendor: Vendor | null
  user: User
  group: Group
  assignedUser: null | User
  assignedGroup: null | Group
}

export type ListIssue = Only<
  'id' | 'subject' | 'createdAt' | 'updatedAt' | 'resolvedAt' | 'vendor' | 'user' | 'group',
  Issue
>

export type IssueUpdateType = 'System' | 'Chat' | 'Image' | 'Resolved'

export interface IssueUpdate {
  id: number
  message: string
  type: IssueUpdateType
  updateType: string
  date: Date
  me: boolean
  user: null | Only<'id' | 'name', User>
  group: null | Only<'id' | 'name', Group>
  thread: Only<'id', Issue>
  update: {
    id: number
    groupKey: string
    createdAt: Date
    type: string
    message: string
    filename?: string
    fileStatus?: 'New' | 'Ready' | 'Corrupted'
    fileReady?: boolean
  }
}

export type ChatIssueType = 'system' | 'user'

export interface ChatIssue {
  id: number
  groups: Group[]
  participants: User[]
  subject: string
  closed: boolean
  type: ChatIssueType
}

export type ConfettiVariant = 'normal' | 'dino'
