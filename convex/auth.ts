import { convexAuth } from "@convex-dev/auth/server";
import Google from "@auth/core/providers/google";
import { ResendOTP } from "./helpers/ResendOTP";
import {
  handleExistingUser,
  shouldCreateOrganization,
  createOrganizationForUser,
} from "./helpers/auth";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Google,
    ResendOTP,
  ],
  callbacks: {
    async createOrUpdateUser(ctx, args) {
      return await handleExistingUser(ctx, args.existingUserId, args.profile);
    },
    async afterUserCreatedOrUpdated(ctx, { userId }) {
      if (await shouldCreateOrganization(ctx, userId)) {
        const user = await ctx.db.get(userId);
        if (user) {
          await createOrganizationForUser(ctx, userId, user);
        }
      }
    },
  },
});
