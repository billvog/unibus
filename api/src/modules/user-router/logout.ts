import { clearAuthCookies } from "@api/lib/auth-tokens";
import { protectedProcedure } from "@api/lib/trpc";

export const logout = protectedProcedure.mutation(({ ctx }) => {
  clearAuthCookies(ctx.res);
  return null;
});
