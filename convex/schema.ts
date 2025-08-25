import { defineSchema } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { users, organizations, onboarding } from "./schema/core";

const schema = defineSchema({
  ...authTables,
  users,
  organizations,
  onboarding,
});

export default schema;
