/**
 * A model, or a reference if this reference has already been filled.
 */
export type QuarkusRef<T> = number | T;

export type LoadingType = "full" | "partial" | null;

export type IssueFilter = "open" | "unread" | "all";

export interface Group {
  id: number;
  name: string;
  system: boolean;
  icon: string;
  colour: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  group?: Group;
  roles?: string[];
}

export interface District {
  id: number;
  name: string;
  colour?: string;
}

export interface Vendor {
  id: number;
  name: string;
  number: string;
  type: string;
  district?: Pick<District, "id" | "name">;
}

export type ChatType = "regular" | "group" | "issue"

export type ChatState ="active" | "permanent" | "closed"

export interface Chat {
  id: number
  title: string
  type: string
  state: string
  users: Pick<User,"id" | "name">;
  groups: Pick<Group, "id" | "name">;
  createdAt: Date
  updatedAt: Date
}

export type ListChat = Omit<Chat, "users" | "groups">;

export type IssueUpdateType = "System" | "Chat" | "Image" | "Resolved";

export interface ChatEntry {
  id: number;
  chat: Pick<Chat, "id">;
  createdAt: Date;

  message: string;
  type: IssueUpdateType;
  updateType: string;
  date: Date;
  me: boolean;
  user: null | Pick<User, "id" | "name">;
  group: null | Pick<Group, "id" | "name">;
  thread: Pick<Issue, "id">;
  update: {
    id: number;
    groupKey: string;
    createdAt: Date;
    type: string;
    message: string;
    filename?: string;
    fileStatus?: "New" | "Ready" | "Corrupted";
    fileReady?: boolean;
  };
}

export type ChatIssueType = "system" | "user";

export interface ChatIssue {
  id: number;
  groups: Group[];
  participants: User[];
  subject: string;
  closed: boolean;
  type: ChatIssueType;
}

export type ConfettiVariant = "normal" | "dino";
