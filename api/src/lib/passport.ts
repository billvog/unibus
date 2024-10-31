import { Express } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import { env } from "@api/env";

export function addPassport(app: Express) {
  /**
   *
   * Google OAuth Strategy
   *
   */

  passport.use(
    new GoogleStrategy(
      {
        clientID: env.OAUTH_GOOGLE_CLIENT_ID,
        clientSecret: env.OAUTH_GOOGLE_CLIENT_SECRET,
        callbackURL: `${env.BACKEND_URL}/auth/google/callback`,
      },
      function (_, __, profile, done) {
        // // 1. grab id
        // const googleId = profile._json.sub as string;
        //
        // // 2. db lookup
        // let user = await db.query.users.findFirst({
        //   where: eq(usersTable.discordId, discordId),
        // });
        //
        // // 3. create user if not exists
        // if (!user) {
        //   [user] = await db
        //     .insert(usersTable)
        //     .values({
        //       discordId,
        //     })
        //     .returning();
        // }
        //
        // // 4. return user
        // done(null, user);
      }
    )
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  app.get("/auth/google", passport.authenticate("google", { session: false }));

  app.get(
    "/auth/google/callback",
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    passport.authenticate("google", { session: false }),
    function (req, res) {
      // // 1. set cookies
      // sendAuthCookies(res, req.user as DbUser);

      res.redirect(env.FRONTEND_URL);
    }
  );
}
