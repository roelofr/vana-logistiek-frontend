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
  flags?: string[];
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

export interface Chat {
  id: number;
  title: string;
  type: string;
  state: string;
  users: Pick<User, "id" | "providerId" | "name" | "avatar">[];
  groups: Pick<Group, "id" | "name" | "icon" | "colour">[];
  createdAt: Date;
  updatedAt: Date;
  subject: Issue | null;
  unread: boolean;
}

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
  filename: string;
  mimetype: string;
  fileStatus: "new" | "ready" | "corrupted";
  fileType: "image" | "binary" | "unknown";
  url: string;
}

export interface ChatLocation extends ChatEntryBase {
  type: "location";
  latitude: number;
  longitude: number;
}

export interface ChatSystemMessage extends ChatEntryBase {
  type: "system";
  messageType: string;
  message: string;
  user: null | Pick<User, "id" | "providerId" | "name" | "avatar">;
  group: null | Pick<Group, "id" | "name" | "icon" | "colour">;
}

export type ChatEntry =
  ChatMessage | ChatFile | ChatLocation | ChatSystemMessage;

export type ChatEntryWithPossibleStringDates = ChatEntry & {
  createdAt: string | Date;
  updatedAt: string | Date | null;
};

export type ChatEntryGroup = {
  id: string;
  role: "user" | "system";
  isMe: boolean;
  user?: Pick<User, "id" | "providerId" | "name" | "avatar"> | null;
  group?: Pick<Group, "id" | "name" | "colour" | "icon"> | null;
  entries: ChatEntry[];
};

export interface ChatSubject {
  id: number;
}

export interface Issue extends ChatSubject {
  id: number;
  chat: Pick<Chat, "id" | "title" | "type" | "state" | "users" | "groups">;
  vendor: null | Vendor;
  location: null | Location;
  createdAt: Date;
  resolvedAt: Date | null;
}

export { type ConfettiVariant } from "~/plugins/confetti.client";

export interface Location {
  lat: number;
  lng: number;
}

export enum LoadingState {
  Initial,
  Update,
  Idle,
}
