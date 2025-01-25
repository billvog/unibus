import crypto from "crypto";

export const generateRandomId = (length = 16): string => {
  return crypto.randomBytes(length).toString("hex");
};
