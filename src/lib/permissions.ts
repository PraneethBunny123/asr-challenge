import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

export const statement = {
  ...defaultStatements,
  record: ["create", "update", "delete"], // <-- Permissions available for created roles
} as const;

export const ac = createAccessControl(statement);

export const admin = ac.newRole({
  ...adminAc.statements,
  record: ["create", "update", "delete"],
});

export const reviewer = ac.newRole({
  record: ["create", "update"],
});

export const viewer = ac.newRole({
  record: [],
});