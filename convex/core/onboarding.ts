import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query, MutationCtx } from "../_generated/server";
import { Doc, Id } from "../_generated/dataModel";

async function updateExistingOrganization(
  ctx: MutationCtx,
  user: Doc<"users">,
  args: { name: string; image?: string }
) {
  const organizationId = user.organizationId!;
  const organization = await ctx.db.get(organizationId);
  
  if (!organization) {
    throw new Error("Organization not found");
  }

  // Check if user is the owner or has admin role
  if (organization.ownerId !== user._id && user.role !== "clientAdmin") {
    throw new Error("You don't have permission to update this organization");
  }

  const now = Date.now();
  
  // Update the organization
  await ctx.db.patch(organizationId, {
    name: args.name,
    image: args.image,
    updatedAt: now,
  });

  // Find or create onboarding record
  const onboarding = await ctx.db
    .query("onboarding")
    .withIndex("byUserOrganization", (q) =>
      q.eq("userId", user._id).eq("organizationId", organizationId)
    )
    .first();

  if (!onboarding) {
    const onboardingId = await ctx.db.insert("onboarding", {
      userId: user._id,
      organizationId,
      onboardingStep: 1, // Start at step 1 for consistency
      isCompleted: false,
      startedAt: now,
      createdAt: now,
      updatedAt: now,
    });
    
    return {
      success: true,
      organizationId,
      onboardingId,
    };
  }

  // Don't auto-advance steps when updating organization

  return {
    success: true,
    organizationId,
    onboardingId: onboarding._id,
  };
}

export const createOrganization = mutation({
  args: {
    name: v.string(),
    image: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    organizationId: v.id("organizations"),
    onboardingId: v.id("onboarding"),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    // If user already has an organization, check if it exists and update it
    if (user.organizationId) {
      const existingOrg = await ctx.db.get(user.organizationId);
      
      // If organization exists, update it
      if (existingOrg) {
        return await updateExistingOrganization(ctx, user, args);
      }
      
      // Organization doesn't exist despite user having organizationId
      // Clean up the stale reference and create a new organization
      console.warn(`User ${userId} had stale organizationId ${user.organizationId}. Creating new organization.`);
      const now = Date.now();
      await ctx.db.patch(userId, {
        organizationId: undefined,
        updatedAt: now,
      });
      
      // Refresh user object without organizationId
      const updatedUser = await ctx.db.get(userId);
      if (!updatedUser) throw new Error("User not found after update");
      
      // Continue with normal creation flow below
    }

    const now = Date.now();

    const organizationId = await ctx.db.insert("organizations", {
      ownerId: userId,
      name: args.name,
      image: args.image,
      members: [userId],
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.patch(userId, {
      organizationId,
      role: "clientAdmin",
      status: "active",
      updatedAt: now,
    });

    // Check if onboarding record already exists for this user and organization
    const existingOnboarding = await ctx.db
      .query("onboarding")
      .withIndex("byUserOrganization", (q) =>
        q.eq("userId", userId).eq("organizationId", organizationId)
      )
      .first();

    let onboardingId: Id<"onboarding">;
    
    if (existingOnboarding) {
      // Use existing onboarding record
      onboardingId = existingOnboarding._id;
      // Update step to 2 since organization creation is complete
      await ctx.db.patch(onboardingId, {
        onboardingStep: 2,
        updatedAt: now,
      });
    } else {
      // Create new onboarding record starting at step 2
      onboardingId = await ctx.db.insert("onboarding", {
        userId,
        organizationId,
        onboardingStep: 2, // Start at step 2 since org creation is done
        isCompleted: false,
        startedAt: now,
        createdAt: now,
        updatedAt: now,
      });
    }

    return {
      success: true,
      organizationId,
      onboardingId,
    };
  },
});

export const updateOrganization = mutation({
  args: {
    name: v.string(),
    image: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    organizationId: v.id("organizations"),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const user = await ctx.db.get(userId);
    if (!user || !user.organizationId) {
      throw new Error("User or organization not found");
    }

    const organization = await ctx.db.get(user.organizationId);
    if (!organization) {
      throw new Error("Organization not found");
    }

    // Check if user is the owner or has admin role
    if (organization.ownerId !== userId && user.role !== "clientAdmin") {
      throw new Error("You don't have permission to update this organization");
    }

    const now = Date.now();
    
    // Update the organization
    await ctx.db.patch(user.organizationId, {
      name: args.name,
      image: args.image,
      updatedAt: now,
    });

    return {
      success: true,
      organizationId: user.organizationId,
    };
  },
});

export const updateOnboardingStep = mutation({
  args: {
    step: v.number(),
  },
  returns: v.object({
    success: v.boolean(),
    nextStep: v.optional(v.number()),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const user = await ctx.db.get(userId);
    if (!user || !user.organizationId) {
      throw new Error("User or organization not found");
    }

    const onboarding = await ctx.db
      .query("onboarding")
      .withIndex("byUserOrganization", (q) => 
        q.eq("userId", userId).eq("organizationId", user.organizationId!)
      )
      .first();

    if (!onboarding) {
      throw new Error("Onboarding record not found");
    }

    const now = Date.now();
    await ctx.db.patch(onboarding._id, {
      onboardingStep: args.step,
      updatedAt: now,
    });

    return {
      success: true,
      nextStep: args.step < 3 ? args.step + 1 : undefined,
    };
  },
});

export const completeOnboarding = mutation({
  args: {},
  returns: v.object({
    success: v.boolean(),
  }),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const user = await ctx.db.get(userId);
    if (!user || !user.organizationId) {
      throw new Error("User or organization not found");
    }

    const onboarding = await ctx.db
      .query("onboarding")
      .withIndex("byUserOrganization", (q) => 
        q.eq("userId", userId).eq("organizationId", user.organizationId!)
      )
      .first();

    if (!onboarding) {
      throw new Error("Onboarding record not found");
    }

    const now = Date.now();
    
    await ctx.db.patch(onboarding._id, {
      isCompleted: true,
      completedAt: now,
      updatedAt: now,
    });

    await ctx.db.patch(userId, {
      isOnboarded: true,
      updatedAt: now,
    });

    return { success: true };
  },
});

export const getOnboardingStatus = query({
  args: {},
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("onboarding"),
      userId: v.id("users"),
      organizationId: v.id("organizations"),
      onboardingStep: v.optional(v.number()),
      isCompleted: v.optional(v.boolean()),
      startedAt: v.optional(v.number()),
      completedAt: v.optional(v.number()),
      organization: v.object({
        name: v.string(),
        image: v.optional(v.string()),
      }),
    })
  ),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    if (!user || !user.organizationId) return null;

    const onboarding = await ctx.db
      .query("onboarding")
      .withIndex("byUserOrganization", (q) => 
        q.eq("userId", userId).eq("organizationId", user.organizationId!)
      )
      .first();

    if (!onboarding) return null;

    const organization = await ctx.db.get(onboarding.organizationId);
    if (!organization) return null;

    return {
      _id: onboarding._id,
      userId: onboarding.userId,
      organizationId: onboarding.organizationId,
      onboardingStep: onboarding.onboardingStep,
      isCompleted: onboarding.isCompleted,
      startedAt: onboarding.startedAt,
      completedAt: onboarding.completedAt,
      organization: {
        name: organization.name,
        image: organization.image,
      },
    };
  },
});

export const skipOnboardingStep = mutation({
  args: {
    currentStep: v.number(),
  },
  returns: v.object({
    success: v.boolean(),
    nextStep: v.optional(v.number()),
    completed: v.boolean(),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const user = await ctx.db.get(userId);
    if (!user || !user.organizationId) {
      throw new Error("User or organization not found");
    }

    const onboarding = await ctx.db
      .query("onboarding")
      .withIndex("byUserOrganization", (q) => 
        q.eq("userId", userId).eq("organizationId", user.organizationId!)
      )
      .first();

    if (!onboarding) {
      throw new Error("Onboarding record not found");
    }

    const now = Date.now();
    const nextStep = args.currentStep + 1;
    const isLastStep = args.currentStep >= 3;

    if (isLastStep) {
      await ctx.db.patch(onboarding._id, {
        isCompleted: true,
        completedAt: now,
        updatedAt: now,
      });

      await ctx.db.patch(userId, {
        isOnboarded: true,
        updatedAt: now,
      });

      return {
        success: true,
        completed: true,
        nextStep: undefined,
      };
    } else {
      await ctx.db.patch(onboarding._id, {
        onboardingStep: nextStep,
        updatedAt: now,
      });

      return {
        success: true,
        completed: false,
        nextStep,
      };
    }
  },
});

export const resetOnboarding = mutation({
  args: {},
  returns: v.object({
    success: v.boolean(),
  }),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const user = await ctx.db.get(userId);
    if (!user || !user.organizationId) {
      throw new Error("User or organization not found");
    }

    const onboarding = await ctx.db
      .query("onboarding")
      .withIndex("byUserOrganization", (q) => 
        q.eq("userId", userId).eq("organizationId", user.organizationId!)
      )
      .first();

    if (!onboarding) {
      throw new Error("Onboarding record not found");
    }

    const now = Date.now();
    
    // Reset onboarding record
    await ctx.db.patch(onboarding._id, {
      onboardingStep: 1,
      isCompleted: false,
      completedAt: undefined,
      updatedAt: now,
    });

    // Reset user onboarded status
    await ctx.db.patch(userId, {
      isOnboarded: false,
      updatedAt: now,
    });

    return { success: true };
  },
});

