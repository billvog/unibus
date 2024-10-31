import { TRPCError } from "@trpc/server";
import { Response } from "express";
import jwt from "jsonwebtoken";

import { db } from "@api/db";
import { env } from "@api/env";
import { Cookies, IsProd } from "@api/lib/constants";
import { DbUser } from "@api/types/models";

/* 
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Authentication Token Payload Types                                      │
  └─────────────────────────────────────────────────────────────────────────┘
 */

export type AccessTokenPayload = {
  userId: string;
};

export type RefreshTokenPayload = {
  userId: string;
  tokenVersion?: number;
};

/* 
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Authentication Cookies                                                  │
  └─────────────────────────────────────────────────────────────────────────┘
 */

const CookieOpts = {
  httpOnly: true,
  secure: IsProd,
  sameSite: "lax",
  path: "/",
  domain: typeof env.DOMAIN === "string" ? `.${env.DOMAIN}` : "",
  maxAge: 1000 * 60 * 60 * 24 * 365 * 1, // 1 year
} as const;

export const sendAuthCookies = (res: Response, user: DbUser) => {
  // Create auth tokens.
  const { accessToken, refreshToken } = createAuthTokens(user);

  // Send auth cookies.
  res.cookie(Cookies.Auth.AccessToken, accessToken, CookieOpts);
  res.cookie(Cookies.Auth.RefreshToken, refreshToken, CookieOpts);
};

export const clearAuthCookies = (res: Response) => {
  res.clearCookie(Cookies.Auth.AccessToken, CookieOpts);
  res.clearCookie(Cookies.Auth.RefreshToken, CookieOpts);
};

/* 
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Authentication Tokens                                                   │
  └─────────────────────────────────────────────────────────────────────────┘
 */

const createAuthTokens = (
  user: DbUser
): { accessToken: string; refreshToken: string } => {
  const accessToken = jwt.sign({ userId: user.id }, env.ACCESS_TOKEN_SECRET, {
    expiresIn: "7min",
  });

  const refreshToken = jwt.sign(
    {
      userId: user.id,
      tokenVersion: user.refreshTokenVersion,
    } satisfies RefreshTokenPayload,
    env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "30d",
    }
  );

  return { accessToken, refreshToken };
};

export const checkTokens = async (
  accessToken: string,
  refreshToken: string
) => {
  try {
    // Verify token.
    const payload = jwt.verify(
      accessToken,
      env.ACCESS_TOKEN_SECRET
    ) as AccessTokenPayload;

    // Get userId from token data.
    return {
      userId: payload.userId,
    };
  } catch {
    // Token is expired or signed with a different
    // secret so now check refresh token.
  }

  if (!refreshToken) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  // Verify refresh token.
  let payload;
  try {
    payload = jwt.verify(
      refreshToken,
      env.REFRESH_TOKEN_SECRET
    ) as RefreshTokenPayload;
  } catch {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  // Get user.
  const user = await db.query.user.findFirst({
    where: ({ id }, { eq }) => eq(id, payload.userId),
  });

  // Check refresh token version.
  if (!user || user.refreshTokenVersion !== payload.tokenVersion) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return {
    userId: payload.userId,
    user,
  };
};
