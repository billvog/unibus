import { jwtDecode } from "jwt-decode";

/**
 * Decodes a JWT token and checks if it is valid: not expired and well-formed.
 * @param token JWT token
 * @returns Whether the token is valid
 */
export const VerifyJwt = (token: string) => {
  if (!token) return false;

  try {
    const decoded: { exp: number } = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch {
    return false;
  }
};
