import { initTRPC, TRPCError } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import superjson from "superjson";

import {
  checkTokens,
  clearAuthCookies,
  sendAuthCookies,
} from "@api/lib/auth-tokens";
import { Cookies } from "@api/lib/constants";
import { DbUser } from "@api/types/models";

export const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({ req, res, userId: "" });

type Context = Awaited<
  ReturnType<typeof createContext> & { userId: string; maybeUser?: DbUser }
>;

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async (opts) => {
  const { ctx } = opts;

  const accessToken = ctx.req.cookies[Cookies.Auth.AccessToken] as string;
  const refreshToken = ctx.req.cookies[Cookies.Auth.RefreshToken] as string;

  // If neither token is present, throw an error.
  if (!accessToken && !refreshToken) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  // Verify tokens.
  try {
    const { userId, user } = await checkTokens(accessToken, refreshToken);

    // Store user id in context.
    ctx.userId = userId;

    // If user is present, send new auth cookies,
    // and store to context.
    if (user) {
      sendAuthCookies(ctx.res, user);
      ctx.maybeUser = user;
    }
  } catch (err) {
    // On error, clear tokens and (re)throw error.
    clearAuthCookies(ctx.res);
    throw err;
  }

  return opts.next(opts);
});
