import { Doc, Id } from "../_generated/dataModel";
import { MutationCtx } from "../_generated/server";

export async function findExistingUser(
  ctx: MutationCtx,
  email: string | null | undefined,
  excludeUserId?: Id<"users">
): Promise<Doc<"users"> | null> {
  if (!email) return null;

  const users = await ctx.db
    .query("users")
    .withIndex("email", (q) => q.eq("email", email))
    .collect();

  if (users.length === 0) return null;

  if (excludeUserId) {
    for (const user of users) {
      if (user._id !== excludeUserId) {
        return user;
      }
    }
    return null;
  }

  return users[0];
}

export async function handleInvitedUser(
  ctx: MutationCtx,
  authUserId: Id<"users">,
  invitedUser: Doc<"users">
): Promise<boolean> {
  const now = Date.now();
  
  await ctx.db.patch(authUserId, {
    organizationId: invitedUser.organizationId,
    role: invitedUser.role,
    status: "active",
    isOnboarded: true,
    loginCount: 1,
    lastLoginAt: now,
    createdAt: invitedUser.createdAt,
    updatedAt: now,
  });

  if (invitedUser.organizationId) {
    const existingOnboarding = await ctx.db
      .query("onboarding")
      .withIndex("byUserOrganization", (q) =>
        q
          .eq("userId", authUserId)
          .eq("organizationId", invitedUser.organizationId!)
      )
      .first();

    if (!existingOnboarding) {
      await ctx.db.insert("onboarding", {
        userId: authUserId,
        organizationId: invitedUser.organizationId,
        onboardingStep: 1,
        isCompleted: true,
        startedAt: now,
        completedAt: now,
        createdAt: now,
        updatedAt: now,
      });
    }

    await addUserToOrganization(ctx, invitedUser.organizationId, authUserId);
  }

  await ctx.db.delete(invitedUser._id);

  return true;
}

export async function handleExistingUser(
  ctx: MutationCtx,
  authUserId: Id<"users">,
  existingUser: Doc<"users">
): Promise<boolean> {
  const now = Date.now();
  
  await ctx.db.patch(authUserId, {
    organizationId: existingUser.organizationId,
    role: existingUser.role || "member",
    status: "active",
    isOnboarded: existingUser.isOnboarded,
    loginCount: (existingUser.loginCount || 0) + 1,
    lastLoginAt: now,
    createdAt: existingUser.createdAt,
    updatedAt: now,
  });

  if (existingUser.organizationId) {
    const existingOnboarding = await ctx.db
      .query("onboarding")
      .withIndex("byUserOrganization", (q) =>
        q
          .eq("userId", existingUser._id)
          .eq("organizationId", existingUser.organizationId!)
      )
      .first();

    if (existingOnboarding) {
      await ctx.db.patch(existingOnboarding._id, {
        userId: authUserId,
        updatedAt: now,
      });
    }

    await addUserToOrganization(ctx, existingUser.organizationId, authUserId);
  }

  await ctx.db.delete(existingUser._id);

  return true;
}

export async function createNewUserData(
  ctx: MutationCtx,
  userId: Id<"users">,
  authUser: Doc<"users">
): Promise<void> {
  const now = Date.now();

  // Generate unique slug first to catch any errors early
  const slug = await generateUniqueSlug(ctx, authUser.name || "org");
  
  // Create organization with validation
  const orgId = await ctx.db.insert("organizations", {
    name: authUser.name ? `${authUser.name}'s Organization` : "My Organization",
    ownerId: userId,
    slug: slug,
    members: [userId],
    createdAt: now,
    updatedAt: now,
  });

  // Validate organization was created
  if (!orgId) {
    throw new Error("[AUTH] Failed to create organization for new user");
  }

  // Verify organization exists before proceeding
  const org = await ctx.db.get(orgId);
  if (!org) {
    throw new Error("[AUTH] Organization created but not found in database");
  }

  await ctx.db.patch(userId, {
    organizationId: orgId,
    role: "clientAdmin",
    status: "active",
    isOnboarded: false,
    loginCount: 1,
    lastLoginAt: now,
    createdAt: now,
    updatedAt: now,
  });

  await ctx.db.insert("onboarding", {
    userId: userId,
    organizationId: orgId,
    onboardingStep: 1,
    isCompleted: false,
    startedAt: now,
    createdAt: now,
    updatedAt: now,
  });
  
  console.log(`[AUTH] Successfully created organization ${orgId} for user ${authUser.email}`);
}

export async function updateLoginTracking(
  ctx: MutationCtx,
  userId: Id<"users">
): Promise<void> {
  const user = await ctx.db.get(userId);

  if (!user) return;

  await ctx.db.patch(userId, {
    lastLoginAt: Date.now(),
    loginCount: (user.loginCount || 0) + 1,
    updatedAt: Date.now(),
  });
}

async function addUserToOrganization(
  ctx: MutationCtx,
  organizationId: Id<"organizations">,
  userId: Id<"users">
): Promise<void> {
  const org = await ctx.db.get(organizationId);
  if (!org) return;

  if (!org.members.includes(userId)) {
    await ctx.db.patch(org._id, {
      members: [...org.members, userId],
      updatedAt: Date.now(),
    });
  }
}

async function generateUniqueSlug(
  ctx: MutationCtx,
  baseName: string
): Promise<string> {
  // Ensure we have a valid base name
  if (!baseName || baseName.trim().length === 0) {
    baseName = "org";
  }
  
  const baseSlug = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 40);

  // If after cleaning, the slug is empty, use a default
  const cleanSlug = baseSlug || "org";
  
  let slug = cleanSlug;
  let counter = 1;
  const maxAttempts = 100;

  while (counter <= maxAttempts) {
    try {
      const existing = await ctx.db
        .query("organizations")
        .withIndex("bySlug", (q) => q.eq("slug", slug))
        .first();

      if (!existing) {
        return slug;
      }

      slug = `${cleanSlug}-${counter}`;
      counter++;
    } catch (error) {
      console.error(`[AUTH] Error checking slug uniqueness: ${error}`);
      // Generate a random suffix as fallback
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      return `${cleanSlug}-${randomSuffix}`;
    }
  }
  
  // Final fallback with timestamp to guarantee uniqueness
  const timestamp = Date.now().toString(36);
  return `${cleanSlug}-${timestamp}`;
}

export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}
