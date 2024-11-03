import { TRPCError } from "@trpc/server";

import { db } from "@api/db";
import { protectedProcedure } from "@api/lib/trpc";

export const me = protectedProcedure.query(async ({ ctx }) => {
  if (ctx.maybeUser) {
    return ctx.maybeUser;
  }

  const foundUser = await db.query.user.findFirst({
    where: ({ id }, { eq }) => eq(id, ctx.userId),
  });

  if (!foundUser) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return foundUser;
});
