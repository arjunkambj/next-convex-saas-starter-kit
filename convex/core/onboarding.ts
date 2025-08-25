import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { query, mutation, QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

// Get Current User's Onboarding Status
export const getOnboardingStatus = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    if (!user?.organizationId) return null;

    const onboarding = await ctx.db
      .query("onboarding")
      .withIndex("byUserOrganization", (q) =>
        q.eq("userId", userId).eq("organizationId", user.organizationId!)
      )
      .first();

    if (!onboarding) return null;

    const totalSteps = 5;
    const currentStep = onboarding.onboardingStep || 1;

    return {
      ...onboarding,
      progress: {
        currentStep,
        totalSteps,
        percentComplete: Math.round((currentStep / totalSteps) * 100),
      },
    };
  },
});

// Update Onboarding Step
export const updateOnboardingStep = mutation({
  args: {
    step: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user?.organizationId) throw new Error("Organization not found");

    const onboarding = await getOnboardingRecord(
      ctx,
      userId,
      user.organizationId
    );
    const totalSteps = 5;
    const isCompleted = args.step >= totalSteps;
    const now = Date.now();

    if (!onboarding) {
      await createOnboardingRecord(ctx, userId, user.organizationId, args.step);
      return {
        success: true,
        message: "Onboarding started",
        isCompleted: false,
      };
    }

    await ctx.db.patch(onboarding._id, {
      onboardingStep: args.step,
      isCompleted,
      completedAt: isCompleted ? now : undefined,
      updatedAt: now,
    });

    if (isCompleted) {
      await ctx.db.patch(userId, {
        isOnboarded: true,
        updatedAt: now,
      });
    }

    return {
      success: true,
      message: isCompleted
        ? "Onboarding completed!"
        : `Step ${args.step} completed`,
      isCompleted,
    };
  },
});

// Complete Onboarding
export const completeOnboarding = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user?.organizationId) throw new Error("Organization not found");

    await setOnboardingComplete(ctx, userId, user.organizationId);

    return {
      success: true,
      message: "Onboarding completed!",
    };
  },
});

// Skip Onboarding
export const skipOnboarding = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    if (user.status === "invited" || user.isOnboarded) {
      return {
        success: true,
        message: "Onboarding already skipped",
      };
    }

    if (user.organizationId) {
      await setOnboardingComplete(ctx, userId, user.organizationId);
    } else {
      await ctx.db.patch(userId, {
        isOnboarded: true,
        updatedAt: Date.now(),
      });
    }

    return {
      success: true,
      message: "Onboarding skipped",
    };
  },
});

// Reset Onboarding
export const resetOnboarding = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user?.organizationId) throw new Error("Organization not found");

    const now = Date.now();
    const onboarding = await getOnboardingRecord(
      ctx,
      userId,
      user.organizationId
    );

    if (onboarding) {
      await ctx.db.patch(onboarding._id, {
        onboardingStep: 1,
        isCompleted: false,
        startedAt: now,
        completedAt: undefined,
        updatedAt: now,
      });
    } else {
      await createOnboardingRecord(ctx, userId, user.organizationId, 1);
    }

    await ctx.db.patch(userId, {
      isOnboarded: false,
      updatedAt: now,
    });

    return {
      success: true,
      message: "Onboarding reset",
    };
  },
});

// Helper to set onboarding as complete
async function setOnboardingComplete(
  ctx: MutationCtx,
  userId: Id<"users">,
  organizationId: Id<"organizations">
) {
  const now = Date.now();
  const onboarding = await getOnboardingRecord(ctx, userId, organizationId);

  if (!onboarding) {
    await ctx.db.insert("onboarding", {
      userId,
      organizationId,
      onboardingStep: 5,
      isCompleted: true,
      startedAt: now,
      completedAt: now,
      createdAt: now,
      updatedAt: now,
    });
  } else {
    await ctx.db.patch(onboarding._id, {
      isCompleted: true,
      onboardingStep: 5,
      completedAt: now,
      updatedAt: now,
    });
  }

  await ctx.db.patch(userId, {
    isOnboarded: true,
    updatedAt: now,
  });
}

// Helper to get onboarding record
async function getOnboardingRecord(ctx: QueryCtx | MutationCtx, userId: Id<"users">, organizationId: Id<"organizations">) {
  return ctx.db
    .query("onboarding")
    .withIndex("byUserOrganization", (q) =>
      q.eq("userId", userId).eq("organizationId", organizationId)
    )
    .first();
}

// Helper to create onboarding record
async function createOnboardingRecord(
  ctx: MutationCtx,
  userId: Id<"users">,
  organizationId: Id<"organizations">,
  step: number
) {
  const now = Date.now();
  return ctx.db.insert("onboarding", {
    userId,
    organizationId,
    onboardingStep: step,
    isCompleted: false,
    startedAt: now,
    createdAt: now,
    updatedAt: now,
  });
}
