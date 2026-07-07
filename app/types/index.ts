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
  providerId: string;
  name: string;
  email: string;
  avatar: string | null;
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
  icon: string;
  colour: string;
  district?: Pick<District, "id" | "name">;
}

export type ChatType = "regular" | "group" | "issue";

export type ChatState = "active" | "permanent" | "closed";

export interface ChatSubject {
  id: number;
  vendor: null | Pick<Vendor, "id" | "name" | "number" | "icon" | "colour">;
  location: null | Location;
}

export interface Chat {
  id: number;
  title: string;
  type: string;
  state: string;
  users: Pick<User, "id" | "providerId" | "name" | "avatar">[];
  groups: Pick<Group, "id" | "name" | "icon" | "colour">[];
  createdAt: Date;
  updatedAt: Date;
  subject: ChatSubject | null;
  unread: boolean;
}

export type ListChat = Omit<Chat, "users" | "groups">;

export type IssueUpdateType = "message" | "file" | "location" | "system";

interface ChatEntryBase {
  id: number;
  chat: Pick<Chat, "id">;
  createdAt: Date;
  updatedAt: Date;
  groupingKey: null | string;
  user: null | Pick<User, "id" | "providerId" | "name" | "avatar">;
  group: null | Pick<Group, "id" | "name" | "icon" | "colour">;
  type: IssueUpdateType;
}

export interface ChatMessage extends ChatEntryBase {
  type: "message";
  message: string;
}

export interface ChatFile extends ChatEntryBase {
  type: "file";
  file: File;
}

export type ChatEntry = ChatMessage | ChatFile;

export type ChatIssueType = "system" | "user";

export interface ChatIssue {
  id: number;
  groups: Group[];
  participants: User[];
  subject: string;
  closed: boolean;
  type: ChatIssueType;
}

export { type ConfettiVariant } from "~/plugins/confetti.client";

export interface Location {
  lat: number;
  lng: number;
}
