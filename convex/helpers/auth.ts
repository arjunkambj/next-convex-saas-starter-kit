import { Doc, Id } from "../_generated/dataModel";
import { MutationCtx } from "../_generated/server";

export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export async function handleExistingUser(
  ctx: MutationCtx,
  userId: Id<"users"> | null,
  profile: {
    email?: string;
    name?: string;
    image?: string;
    emailVerified?: boolean;
  }
): Promise<Id<"users">> {
  const email = profile.email;

  if (!email) {
    throw new Error("Email is required for authentication");
  }

  const normalizedEmail = normalizeEmail(email);
  const now = Date.now();

  // If we have an existing userId, update profile and login tracking
  if (userId) {
    const user = await ctx.db.get(userId);
    if (user) {
      const updates: Partial<Doc<"users">> = {
        lastLoginAt: now,
        loginCount: (user.loginCount || 0) + 1,
        updatedAt: now,
      };

      // If user is invited, activate them on first login
      if (user.status === "invited") {
        updates.status = "active";
        console.log(`[AUTH] User ${user.email} activated from invited status with role ${user.role}`);
      }

      // Update profile fields if provided by OAuth provider
      if (profile.name && (!user.name || user.name !== profile.name)) {
        updates.name = profile.name;
      }
      
      if (profile.image && profile.image !== user.image) {
        updates.image = profile.image;
      }
      
      // Set email verification time if not already set and OAuth confirms it
      if (profile.emailVerified && !user.emailVerificationTime) {
        updates.emailVerificationTime = now;
      }

      await ctx.db.patch(userId, updates);
    }
    return userId;
  }

  // Check if user exists by email
  const existingUsers = await ctx.db
    .query("users")
    .filter((q) => q.eq(q.field("email"), normalizedEmail))
    .collect();
  
  const existingUser = existingUsers[0];

  if (existingUser) {
    // Check if user is invited and needs activation
    const isInvited = existingUser.status === "invited";
    
    // Check if invite is expired
    if (isInvited && existingUser.inviteExpiresAt && existingUser.inviteExpiresAt < now) {
      throw new Error("Your invitation has expired. Please contact your administrator for a new invite.");
    }

    // Update existing user's profile and login tracking
    const updates: Partial<Doc<"users">> = {
      lastLoginAt: now,
      loginCount: (existingUser.loginCount || 0) + 1,
      updatedAt: now,
    };

    // If user is invited, activate them on first login (preserve assigned role)
    if (isInvited) {
      updates.status = "active";
      // Role is preserved from invite, not changed
      console.log(`[AUTH] Invited user ${existingUser.email} activated with role ${existingUser.role}`);
    }

    // Update profile fields if provided by OAuth provider
    if (profile.name && (!existingUser.name || existingUser.name !== profile.name)) {
      updates.name = profile.name;
    }
    
    if (profile.image && profile.image !== existingUser.image) {
      updates.image = profile.image;
    }
    
    // Set email verification time if not already set and OAuth confirms it
    if (profile.emailVerified && !existingUser.emailVerificationTime) {
      updates.emailVerificationTime = now;
    }

    await ctx.db.patch(existingUser._id, updates);
    
    // If user was invited and has an organization, create onboarding record if needed
    if (isInvited && existingUser.organizationId) {
      const onboarding = await ctx.db
        .query("onboarding")
        .withIndex("byUserOrganization", (q) => 
          q.eq("userId", existingUser._id).eq("organizationId", existingUser.organizationId!)
        )
        .first();
      
      if (!onboarding) {
        await ctx.db.insert("onboarding", {
          userId: existingUser._id,
          organizationId: existingUser.organizationId,
          onboardingStep: 1,
          isCompleted: false,
          startedAt: now,
          createdAt: now,
          updatedAt: now,
        });
        console.log(`[AUTH] Created onboarding for invited user ${existingUser.email}`);
      }
    }

    return existingUser._id;
  }

  // Create new user (not invited, self-signup)
  return await ctx.db.insert("users", {
    email: normalizedEmail,
    name: profile.name,
    image: profile.image,
    emailVerificationTime: profile.emailVerified ? now : undefined,
    status: "active",
    isOnboarded: false,
    loginCount: 1,
    lastLoginAt: now,
    createdAt: now,
    updatedAt: now,
  });
}

export async function shouldCreateOrganization(
  ctx: MutationCtx,
  userId: Id<"users">
): Promise<boolean> {
  const user = await ctx.db.get(userId);
  return !!(user && !user.organizationId);
}

export async function createOrganizationForUser(
  ctx: MutationCtx,
  userId: Id<"users">,
  user: Doc<"users">
): Promise<void> {
  const now = Date.now();

  const slug = await generateUniqueSlug(ctx, user.name || "org");

  const orgId = await ctx.db.insert("organizations", {
    name: user.name ? `${user.name}'s Organization` : "My Organization",
    ownerId: userId,
    slug: slug,
    members: [userId],
    createdAt: now,
    updatedAt: now,
  });

  await ctx.db.patch(userId, {
    organizationId: orgId,
    role: "clientAdmin",
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

  console.log(`[AUTH] Created organization ${orgId} for user ${user.email}`);
}

async function generateUniqueSlug(
  ctx: MutationCtx,
  baseName: string
): Promise<string> {
  if (!baseName || baseName.trim().length === 0) {
    baseName = "org";
  }

  const baseSlug = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 40);

  const cleanSlug = baseSlug || "org";

  let slug = cleanSlug;
  let counter = 1;
  const maxAttempts = 100;

  while (counter <= maxAttempts) {
    const existing = await ctx.db
      .query("organizations")
      .withIndex("bySlug", (q) => q.eq("slug", slug))
      .first();

    if (!existing) {
      return slug;
    }

    slug = `${cleanSlug}-${counter}`;
    counter++;
  }

  const timestamp = Date.now().toString(36);
  return `${cleanSlug}-${timestamp}`;
}