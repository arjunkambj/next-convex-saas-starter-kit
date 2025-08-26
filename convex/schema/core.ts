import { defineTable } from "convex/server";
import { v } from "convex/values";

export const users = defineTable({
  name: v.optional(v.string()),
  image: v.optional(v.string()),
  email: v.optional(v.string()),
  emailVerificationTime: v.optional(v.number()),
  phone: v.optional(v.string()),
  phoneVerificationTime: v.optional(v.number()),
  isAnonymous: v.optional(v.boolean()),

  // Auto Generated After Signup
  organizationId: v.optional(v.id("organizations")),

  isOnboarded: v.optional(v.boolean()),

  role: v.optional(
    v.union(
      v.literal("clientAdmin"),
      v.literal("manager"),
      v.literal("member"),
      v.literal("superAdmin"),
      v.literal("oppsDev")
    )
  ),

  status: v.optional(
    v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("invited"),
      v.literal("suspended"),
      v.literal("deleted"),
      v.literal("expired")
    )
  ),

  ///// Invitation fields
  invitedBy: v.optional(v.id("users")),
  invitedAt: v.optional(v.number()),
  inviteExpiresAt: v.optional(v.number()),

  ///// You can assign clients or specific permissions to users
  assignedClients: v.optional(v.array(v.id("organizations"))),

  loginCount: v.optional(v.number()),
  lastLoginAt: v.optional(v.number()),

  createdAt: v.optional(v.number()),
  updatedAt: v.optional(v.number()),
})
  .index("email", ["email"])
  .index("phone", ["phone"])
  .index("byEmailVerificationTime", ["emailVerificationTime"])
  .index("byOrganization", ["organizationId"])
  .index("byIsOnboarded", ["isOnboarded"])
  .index("byRole", ["role"])
  .index("byOrganizationAndRole", ["organizationId", "role"])
  .index("byStatus", ["status"]);

export const organizations = defineTable({
  ///// Owner of the organization
  ownerId: v.id("users"),

  /// Organization Details
  name: v.string(),
  image: v.optional(v.string()),

  ///// Members of the organization
  members: v.array(v.id("users")),
  
  createdAt: v.optional(v.number()),
  updatedAt: v.optional(v.number()),
})
  .index("byName", ["name"])
  .index("byOwner", ["ownerId"]);

///// Invitation
export const onboarding = defineTable({
  // User and organization context
  userId: v.id("users"),
  organizationId: v.id("organizations"),

  onboardingStep: v.optional(v.number()),

  ///// Onboarding status
  isCompleted: v.optional(v.boolean()),
  startedAt: v.optional(v.number()),
  completedAt: v.optional(v.number()),

  createdAt: v.optional(v.number()),
  updatedAt: v.optional(v.number()),
})
  .index("byUser", ["userId"])
  .index("byOrganization", ["organizationId"])
  .index("byUserOrganization", ["userId", "organizationId"])
  .index("byCompleted", ["isCompleted"])
  .index("byStep", ["onboardingStep"]);
