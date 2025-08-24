import { defineSchema } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { users } from "./schema/core";

const schema = defineSchema({
  ...authTables,
  users,
});

export default schema;
