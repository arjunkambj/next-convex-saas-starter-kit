import { convexAuth } from "@convex-dev/auth/server";
import Google from "@auth/core/providers/google";
import Resend from "@auth/core/providers/resend";
import { Password } from "@convex-dev/auth/providers/Password";
import {
  findExistingUser,
  handleInvitedUser,
  handleExistingUser,
  createNewUserData,
  updateLoginTracking,
} from "./helpers/auth";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Google({ allowDangerousEmailAccountLinking: true }),
    Resend,
    Password,
  ],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx, { userId }) {
      const authUser = await ctx.db.get(userId);

      if (!authUser) return;

      // Check for existing user with same email
      const existingUser = await findExistingUser(ctx, authUser.email, userId);

      if (existingUser) {
        // Handle invited user activation
        if (existingUser.status === "invited") {
          await handleInvitedUser(ctx, userId, existingUser);
          return;
        }

        // Handle existing user with connections
        await handleExistingUser(ctx, userId, existingUser);
        return;
      }

      // Create initial data for new users
      if (!authUser.organizationId) {
        await createNewUserData(ctx, userId, authUser);
      } else {
        // Update login tracking for existing users
        await updateLoginTracking(ctx, userId);
      }
    },
  },
});
