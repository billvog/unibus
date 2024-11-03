import { t } from "@api/lib/trpc";
import { logout } from "@api/modules/user-router/logout";
import { me } from "@api/modules/user-router/me";

export const userRouter = t.router({
  me,
  logout,
});
