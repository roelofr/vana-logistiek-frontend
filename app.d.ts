/**
 * Gebruikers van de applicatie.
 */
interface User {
  id: number
  provider_id: number
  name: string
  email: string
}

interface District {
  name: string
  colour: string
  team: TeamRef
}

interface Vendor {
  id: number
  number: string
  name: string
  district: DistrctRef
}

/**
 * Vangt gebruikers samen onder één team. Dit zijn wijken, maar soms ook teams als CP en Gator.
 */
interface Team {
  id: number
  name: string
  color: string
  icon: string
  users?: Array<UserRef>
}

/**
 * Een thread, wat voorheen een Ticket was.
 */
interface Thread {
  id: number
  vendor: VendorRef
  user: UserRef
  team: TeamRef
  assigned_team: TeamRef | null
  assigned_user: UserRef | null
  subject: string
  read: boolean
  created_at: Date | null
  updated_at: Date | null
  resolved_at: Date | null
}

/**
 * Een update, dit kan een bericht zijn of een wijziging (assignment naar een team of gebruiker, en status verandering)
 */
interface ThreadUpdate {
  id: number
  thread: ThreadRef
  user: UserRef
  team: TeamRef
  type: string
  data: unknown
  created_at: Date | null
}

//
// REFERENCES
//

type ObjectRef = { id: number }

type UserRef = User | ObjectRef
type TeamRef = Team | ObjectRef
type ThreadRef = Thread | ObjectRef
type DistrctRef = District | ObjectRef
