import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { query, mutation, QueryCtx, MutationCtx } from "../_generated/server";
import { Doc, Id } from "../_generated/dataModel";

// Helper function to check if user is admin
async function isUserAdmin(ctx: QueryCtx | MutationCtx, userId: Id<"users">) {
  const user = await ctx.db.get(userId);
  return user?.role === "clientAdmin" || user?.role === "superAdmin";
}

// Helper function to normalize email
function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

// Invite user to organization
export const inviteUserToOrganization = mutation({
  args: {
    email: v.string(),
    role: v.union(
      v.literal("manager"),
      v.literal("member")
    ),
    expiresInDays: v.optional(v.number()), // Default 30 days if not specified
  },
  async handler(ctx, args) {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const inviter = await ctx.db.get(userId);
    if (!inviter || !inviter.organizationId) {
      throw new Error("User not associated with an organization");
    }

    // Check if inviter is admin
    if (!await isUserAdmin(ctx, userId)) {
      throw new Error("Only admins can invite users");
    }

    const normalizedEmail = normalizeEmail(args.email);
    const now = Date.now();
    const expiresInDays = args.expiresInDays || 30;
    const expiresAt = now + (expiresInDays * 24 * 60 * 60 * 1000);

    // Check if user already exists
    const existingUsers = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), normalizedEmail))
      .collect();
    
    const existingUser = existingUsers[0];

    if (existingUser) {
      if (existingUser.status === "active") {
        throw new Error("User already exists and is active");
      }
      if (existingUser.status === "invited" && existingUser.organizationId === inviter.organizationId) {
        // Update existing invite
        await ctx.db.patch(existingUser._id, {
          invitedBy: userId,
          invitedAt: now,
          inviteExpiresAt: expiresAt,
          role: args.role,
          updatedAt: now,
        });
        return { success: true, message: "Invite updated", userId: existingUser._id };
      }
    }

    // Create new invited user
    const newUserId = await ctx.db.insert("users", {
      email: normalizedEmail,
      status: "invited",
      role: args.role,
      organizationId: inviter.organizationId,
      invitedBy: userId,
      invitedAt: now,
      inviteExpiresAt: expiresAt,
      isOnboarded: false,
      createdAt: now,
      updatedAt: now,
    });

    // Add user to organization members
    const organization = await ctx.db.get(inviter.organizationId);
    if (organization) {
      const updatedMembers = [...organization.members, newUserId];
      await ctx.db.patch(inviter.organizationId, {
        members: updatedMembers,
        updatedAt: now,
      });
    }

    return { success: true, message: "User invited successfully", userId: newUserId };
  },
});

// Cancel an invite
export const cancelInvite = mutation({
  args: {
    invitedUserId: v.id("users"),
  },
  async handler(ctx, args) {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const admin = await ctx.db.get(userId);
    if (!admin || !admin.organizationId) {
      throw new Error("User not associated with an organization");
    }

    // Check if user is admin
    if (!await isUserAdmin(ctx, userId)) {
      throw new Error("Only admins can cancel invites");
    }

    const invitedUser = await ctx.db.get(args.invitedUserId);
    if (!invitedUser) {
      throw new Error("Invited user not found");
    }

    if (invitedUser.status !== "invited") {
      throw new Error("User is not in invited status");
    }

    if (invitedUser.organizationId !== admin.organizationId) {
      throw new Error("User not in your organization");
    }

    // Update user status to expired
    await ctx.db.patch(args.invitedUserId, {
      status: "expired",
      updatedAt: Date.now(),
    });

    // Remove from organization members
    const organization = await ctx.db.get(admin.organizationId);
    if (organization) {
      const updatedMembers = organization.members.filter(id => id !== args.invitedUserId);
      await ctx.db.patch(admin.organizationId, {
        members: updatedMembers,
        updatedAt: Date.now(),
      });
    }

    return { success: true, message: "Invite cancelled" };
  },
});

// Resend invite (update timestamp)
export const resendInvite = mutation({
  args: {
    invitedUserId: v.id("users"),
  },
  async handler(ctx, args) {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const admin = await ctx.db.get(userId);
    if (!admin || !admin.organizationId) {
      throw new Error("User not associated with an organization");
    }

    // Check if user is admin
    if (!await isUserAdmin(ctx, userId)) {
      throw new Error("Only admins can resend invites");
    }

    const invitedUser = await ctx.db.get(args.invitedUserId);
    if (!invitedUser) {
      throw new Error("Invited user not found");
    }

    if (invitedUser.status !== "invited") {
      throw new Error("User is not in invited status");
    }

    if (invitedUser.organizationId !== admin.organizationId) {
      throw new Error("User not in your organization");
    }

    const now = Date.now();
    const expiresAt = now + (30 * 24 * 60 * 60 * 1000); // 30 days from now

    // Update invite timestamps
    await ctx.db.patch(args.invitedUserId, {
      invitedAt: now,
      inviteExpiresAt: expiresAt,
      updatedAt: now,
    });

    return { success: true, message: "Invite resent" };
  },
});

// Get all invited users for an organization
export const getInvitedUsers = query({
  async handler(ctx) {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const user = await ctx.db.get(userId);
    if (!user || !user.organizationId) return [];

    // Get all invited users for the organization
    const invitedUsers = await ctx.db
      .query("users")
      .withIndex("byOrganization", (q) => q.eq("organizationId", user.organizationId!))
      .filter((q) => q.eq(q.field("status"), "invited"))
      .collect();

    // Add inviter details
    const invitedUsersWithDetails = await Promise.all(
      invitedUsers.map(async (invitedUser) => {
        const inviter = invitedUser.invitedBy ? await ctx.db.get(invitedUser.invitedBy) : null;
        return {
          ...invitedUser,
          inviterName: inviter?.name || "Unknown",
          inviterEmail: inviter?.email || "Unknown",
        };
      })
    );

    return invitedUsersWithDetails;
  },
});

// Check if an email has a pending invite
export const checkInviteStatus = query({
  args: {
    email: v.string(),
  },
  async handler(ctx, args) {
    const normalizedEmail = normalizeEmail(args.email);
    
    const users = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), normalizedEmail))
      .collect();
    
    const user = users[0];
    
    if (!user) {
      return { hasInvite: false };
    }

    if (user.status === "invited") {
      const now = Date.now();
      const isExpired = user.inviteExpiresAt && user.inviteExpiresAt < now;
      
      return {
        hasInvite: true,
        status: user.status,
        isExpired,
        organizationId: user.organizationId,
        role: user.role,
        invitedAt: user.invitedAt,
        expiresAt: user.inviteExpiresAt,
      };
    }

    return { 
      hasInvite: false,
      status: user.status,
    };
  },
});

// Get organization details with members
export const getOrganizationWithMembers = query({
  async handler(ctx) {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    if (!user || !user.organizationId) return null;

    const organization = await ctx.db.get(user.organizationId);
    if (!organization) return null;

    // Get all members
    const members = await Promise.all(
      organization.members.map(async (memberId) => {
        const member = await ctx.db.get(memberId);
        return member;
      })
    );

    // Filter out null members and categorize by status
    const validMembers = members.filter(m => m !== null) as Doc<"users">[];
    
    return {
      ...organization,
      activeMembers: validMembers.filter(m => m.status === "active"),
      invitedMembers: validMembers.filter(m => m.status === "invited"),
      totalMembers: validMembers.length,
    };
  },
});

// Batch invite team members
export const inviteTeamMembers = mutation({
  args: {
    members: v.array(v.object({
      email: v.string(),
      role: v.union(v.literal("manager"), v.literal("member")),
    })),
    expiresInDays: v.optional(v.number()),
  },
  returns: v.object({
    success: v.boolean(),
    invited: v.number(),
    failed: v.array(v.object({
      email: v.string(),
      reason: v.string(),
    })),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const inviter = await ctx.db.get(userId);
    if (!inviter || !inviter.organizationId) {
      throw new Error("User not associated with an organization");
    }

    if (!await isUserAdmin(ctx, userId)) {
      throw new Error("Only admins can invite users");
    }

    const organization = await ctx.db.get(inviter.organizationId);
    if (!organization) {
      throw new Error("Organization not found");
    }

    const now = Date.now();
    const expiresInDays = args.expiresInDays || 30;
    const expiresAt = now + (expiresInDays * 24 * 60 * 60 * 1000);

    let invited = 0;
    const failed: { email: string; reason: string }[] = [];
    const newMemberIds: Id<"users">[] = [];

    for (const member of args.members) {
      const normalizedEmail = normalizeEmail(member.email);

      try {
        const existingUsers = await ctx.db
          .query("users")
          .filter((q) => q.eq(q.field("email"), normalizedEmail))
          .collect();
        
        const existingUser = existingUsers[0];

        if (existingUser) {
          if (existingUser.status === "active") {
            failed.push({ email: member.email, reason: "User already exists and is active" });
            continue;
          }
          if (existingUser.status === "invited" && existingUser.organizationId === inviter.organizationId) {
            await ctx.db.patch(existingUser._id, {
              invitedBy: userId,
              invitedAt: now,
              inviteExpiresAt: expiresAt,
              role: member.role,
              updatedAt: now,
            });
            invited++;
            continue;
          }
        }

        const newUserId = await ctx.db.insert("users", {
          email: normalizedEmail,
          status: "invited",
          role: member.role,
          organizationId: inviter.organizationId,
          invitedBy: userId,
          invitedAt: now,
          inviteExpiresAt: expiresAt,
          isOnboarded: false,
          createdAt: now,
          updatedAt: now,
        });

        newMemberIds.push(newUserId);
        invited++;
      } catch (error) {
        failed.push({ 
          email: member.email, 
          reason: error instanceof Error ? error.message : "Failed to invite user" 
        });
      }
    }

    if (newMemberIds.length > 0) {
      const updatedMembers = [...organization.members, ...newMemberIds];
      await ctx.db.patch(inviter.organizationId, {
        members: updatedMembers,
        updatedAt: now,
      });
    }

    return {
      success: invited > 0,
      invited,
      failed,
    };
  },
});

