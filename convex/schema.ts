import { defineSchema } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { users, organizations, invites, onboarding } from "./schema/core";

const schema = defineSchema({
  ...authTables,
  users,
  organizations,
  invites,
  onboarding,
});

export default schema;
