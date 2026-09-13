import { createAccessControl } from "better-auth/plugins/access";

export const statement = {
  chat: ["view"],
  issue: ["view", "create", "resolve", "reopen", "delete"],
  vendor: ["view", "create", "edit"],
} as const;

export const ac = createAccessControl(statement);

export const user = ac.newRole({
  chat: ["view"],
  issue: ["view", "create"],
  vendor: ["view"],
});

export const wijkhouder = ac.newRole({
  chat: ["view"],
  issue: ["view", "create", "reopen"],
  vendor: ["view"],
});

export const cp = ac.newRole({
  chat: ["view"],
  issue: ["view", "create", "resolve", "reopen", "delete"],
  vendor: ["view", "create", "edit"],
});

export const admin = ac.newRole({ ...statement });

export const acRoles = { user, wijkhouder, cp, admin };
