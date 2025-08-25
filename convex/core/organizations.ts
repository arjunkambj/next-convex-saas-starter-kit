import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { query, mutation, QueryCtx, MutationCtx } from "../_generated/server";
import { Doc, Id } from "../_generated/dataModel";

// Get Current User's Organization
export const getCurrentUserOrganization = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    if (!user?.organizationId) return null;

    const org = await ctx.db.get(user.organizationId);
    if (!org) return null;

    return {
      ...org,
      memberCount: org.members.length,
    };
  },
});

// Update Organization Details
export const updateOrganization = mutation({
  args: {
    name: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user?.organizationId) throw new Error("Organization not found");

    const adminRoles = ["clientAdmin", "superAdmin", "oppsDev"];
    if (!user.role || !adminRoles.includes(user.role)) {
      throw new Error("Only admins can update organization");
    }

    const org = await ctx.db.get(user.organizationId);
    if (!org) throw new Error("Organization not found");

    const updates: Partial<Doc<"organizations">> = {
      updatedAt: Date.now(),
    };

    if (args.name !== undefined) {
      updates.name = args.name;
      updates.slug = await generateOrgSlug(ctx, args.name, org._id);
    }

    if (args.image !== undefined) {
      updates.image = args.image;
    }

    await ctx.db.patch(org._id, updates);

    return {
      success: true,
      message: "Organization updated successfully",
    };
  },
});

// Helper function to generate unique slug
async function generateOrgSlug(
  ctx: MutationCtx,
  name: string,
  currentOrgId?: Id<"organizations">
): Promise<string> {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 40);

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await ctx.db
      .query("organizations")
      .withIndex("bySlug", (q) => q.eq("slug", slug))
      .first();

    if (!existing || existing._id === currentOrgId) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

export const getAllOrganizationMembers = query({
  args: {
    organizationId: v.optional(v.id("organizations")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const currentUser = await ctx.db.get(userId);
    if (!currentUser) return [];

    // Determine which users to fetch based on permissions
    const users = await getUsersByPermission(ctx, currentUser, args.organizationId);

    // Add organization names to users
    return Promise.all(
      users.map(async (user) => {
        const organizationName = user.organizationId
          ? (await ctx.db.get(user.organizationId))?.name
          : undefined;

        return {
          ...user,
          organizationName,
        };
      })
    );
  },
});

// Helper to get users based on permissions
async function getUsersByPermission(
  ctx: QueryCtx | MutationCtx,
  currentUser: Doc<"users">,
  targetOrgId?: Id<"organizations">
): Promise<Doc<"users">[]> {
  const isSuperAdmin = ["superAdmin", "oppsDev"].includes(currentUser.role || "");
  const isOrgAdmin = currentUser.role === "clientAdmin";

  if (targetOrgId) {
    return ctx.db
      .query("users")
      .withIndex("byOrganization", (q) => q.eq("organizationId", targetOrgId))
      .collect();
  }

  if (isSuperAdmin) {
    return ctx.db.query("users").collect();
  }

  if (isOrgAdmin && currentUser.organizationId) {
    return ctx.db
      .query("users")
      .withIndex("byOrganization", (q) =>
        q.eq("organizationId", currentUser.organizationId)
      )
      .collect();
  }

  return [];
}

// Invite Team Member
export const inviteTeamMemberToOrg = mutation({
  args: {
    email: v.string(),
    role: v.union(v.literal("manager"), v.literal("member")),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const inviter = await ctx.db.get(userId);
    if (!inviter?.organizationId) throw new Error("Organization not found");

    // Check admin permissions
    const adminRoles = ["clientAdmin", "superAdmin", "oppsDev"];
    if (!inviter.role || !adminRoles.includes(inviter.role)) {
      throw new Error("Only admins can invite team members");
    }

    const email = args.email.toLowerCase();
    const existingUser = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .first();

    if (existingUser) {
      return handleExistingUserInvite(ctx, existingUser, inviter, args.role);
    }

    return createNewUserInvite(ctx, inviter, email, args.role, args.name);
  },
});

// Handle inviting an existing user
async function handleExistingUserInvite(
  ctx: MutationCtx,
  existingUser: Doc<"users">,
  inviter: Doc<"users">,
  role: "manager" | "member"
) {
  if (existingUser.organizationId === inviter.organizationId) {
    return {
      success: false,
      message: "User already in your organization",
    };
  }

  if (existingUser.organizationId) {
    return {
      success: false,
      message: "User belongs to another organization",
    };
  }

  await ctx.db.patch(existingUser._id, {
    organizationId: inviter.organizationId,
    role,
    status: "invited",
    updatedAt: Date.now(),
  });

  return {
    success: true,
    message: "User added to your team",
    userId: existingUser._id,
  };
}

// Create a new user invitation
async function createNewUserInvite(
  ctx: MutationCtx,
  inviter: Doc<"users">,
  email: string,
  role: "manager" | "member",
  name?: string
) {
  const now = Date.now();
  const newUserId = await ctx.db.insert("users", {
    email,
    name: name || email.split("@")[0],
    organizationId: inviter.organizationId,
    role,
    status: "invited",
    isOnboarded: false,
    loginCount: 0,
    createdAt: now,
    updatedAt: now,
  });

  // Add to organization members
  const org = await ctx.db.get(inviter.organizationId!);
  if (org) {
    await ctx.db.patch(org._id, {
      members: [...org.members, newUserId],
      updatedAt: now,
    });
  }

  return {
    success: true,
    message: "Invitation sent",
    userId: newUserId,
  };
}

// Remove Team Member
export const removeTeamMemberFromOrg = mutation({
  args: {
    memberId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user?.organizationId) throw new Error("Organization not found");

    // Check permissions
    const adminRoles = ["clientAdmin", "superAdmin", "oppsDev"];
    if (!user.role || !adminRoles.includes(user.role)) {
      throw new Error("Only admins can remove team members");
    }

    const member = await ctx.db.get(args.memberId);
    if (!member) throw new Error("Member not found");

    // Validate removal permissions
    validateRemovalPermissions(user, member);

    // Remove from organization
    await ctx.db.patch(args.memberId, {
      organizationId: undefined,
      status: "inactive",
      updatedAt: Date.now(),
    });

    // Update organization members list
    if (member.organizationId) {
      await removeFromOrgMembers(ctx, member.organizationId, args.memberId);
    }

    return {
      success: true,
      message: "Member removed",
    };
  },
});

// Validate removal permissions
function validateRemovalPermissions(user: Doc<"users">, member: Doc<"users">) {
  const isSuperAdmin = ["superAdmin", "oppsDev"].includes(user.role || "");

  if (member._id === user._id) {
    throw new Error("Cannot remove yourself");
  }

  if (!isSuperAdmin && member.organizationId !== user.organizationId) {
    throw new Error("Member not in your organization");
  }

  if (member.role === "clientAdmin" && !isSuperAdmin) {
    throw new Error("Cannot remove organization admin");
  }
}

// Remove user from organization members array
async function removeFromOrgMembers(
  ctx: MutationCtx,
  orgId: Id<"organizations">,
  memberId: Id<"users">
) {
  const org = await ctx.db.get(orgId);
  if (!org) return;

  await ctx.db.patch(org._id, {
    members: org.members.filter((id) => id !== memberId),
    updatedAt: Date.now(),
  });
}

// Update Team Member Role
export const updateMemberRoleInOrg = mutation({
  args: {
    memberId: v.id("users"),
    newRole: v.union(
      v.literal("clientAdmin"),
      v.literal("manager"),
      v.literal("member")
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user?.organizationId) throw new Error("Organization not found");

    // Check admin permissions
    const adminRoles = ["clientAdmin", "superAdmin", "oppsDev"];
    if (!user.role || !adminRoles.includes(user.role)) {
      throw new Error("Only admins can update roles");
    }

    const member = await ctx.db.get(args.memberId);
    if (!member) throw new Error("Member not found");

    // Validate role update permissions
    validateRoleUpdatePermissions(user, member, args.newRole);

    await ctx.db.patch(args.memberId, {
      role: args.newRole,
      updatedAt: Date.now(),
    });

    return {
      success: true,
      message: "Role updated",
    };
  },
});

// Validate role update permissions
function validateRoleUpdatePermissions(
  user: Doc<"users">,
  member: Doc<"users">,
  newRole: string
) {
  const isSuperAdmin = ["superAdmin", "oppsDev"].includes(user.role || "");

  if (member._id === user._id) {
    throw new Error("Cannot update your own role");
  }

  if (!isSuperAdmin && member.organizationId !== user.organizationId) {
    throw new Error("Member not in your organization");
  }

  if (newRole === "clientAdmin" && !isSuperAdmin) {
    throw new Error("Only super admins can promote to admin");
  }
}
