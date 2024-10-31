import { Express } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import { db } from "@api/db";
import { user, userAccount } from "@api/db/schema";
import { env } from "@api/env";
import { sendAuthCookies } from "@api/lib/auth-tokens";
import { DbUser } from "@api/types/models";

export function addPassport(app: Express) {
  /* 
    ┌─────────────────────────────────────────────────────────────────────────────┐
    │   Google OAuth Strategy                                                     │
    └─────────────────────────────────────────────────────────────────────────────┘
  */

  passport.use(
    new GoogleStrategy(
      {
        clientID: env.OAUTH_GOOGLE_CLIENT_ID,
        clientSecret: env.OAUTH_GOOGLE_CLIENT_SECRET,
        callbackURL: `${env.BACKEND_URL}/oauth/google/callback`,
        scope: env.OAUTH_GOOGLE_SCOPES.split(","),
      },
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async function (_, __, profile, done) {
        // Check if user exists.
        const foundUserAccount = await db.query.userAccount.findFirst({
          where: ({ providerAccountId }, { eq }) =>
            eq(providerAccountId, profile.id),
          with: {
            user: true,
          },
        });

        // If user exists, return user.
        if (foundUserAccount) {
          done(null, foundUserAccount.user);
          return;
        }

        // If user does not exist, create user:
        // Find first verified email.
        const firstVerifiedEmail = profile.emails?.find(
          (email) => email.verified
        );

        // If no verified email found, return error.
        if (!firstVerifiedEmail) {
          done(new Error("No verified email found"));
          return;
        }

        // Create and return the user, or in case the user already exists, do nothing.
        const [createdUser] = await db
          .insert(user)
          .values({
            name: profile.displayName,
            email: firstVerifiedEmail.value,
          })
          .onConflictDoNothing({ target: user.email })
          .returning();

        // Create user account.
        await db.insert(userAccount).values({
          userId: createdUser.id,
          providerId: "google",
          providerAccountId: profile.id,
        });

        // Return created user.
        done(null, createdUser);
      }
    )
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  app.get("/oauth/google", passport.authenticate("google", { session: false }));

  app.get(
    "/oauth/google/callback",
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    passport.authenticate("google", { session: false }),
    function (req, res) {
      // Send auth cookies and redirect to frontend.
      sendAuthCookies(res, req.user as DbUser);
      res.redirect(env.FRONTEND_URL);
    }
  );
}
