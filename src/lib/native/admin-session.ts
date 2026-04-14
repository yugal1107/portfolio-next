import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

const loginBodySchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(1),
});

const ADMIN_TOKEN_TTL_SECONDS = 60 * 60 * 8;

export const parseLoginPayload = (payload: unknown) => {
  const parsed = loginBodySchema.safeParse(payload);

  if (!parsed.success) {
    throw new Error("Invalid login payload");
  }

  return parsed.data;
};

export const buildAdminCookieHeader = (cookieName: string, token: string, isProduction: boolean) => {
  const securePart = isProduction ? "; Secure" : "";
  return `${cookieName}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${ADMIN_TOKEN_TTL_SECONDS}${securePart}`;
};

export const buildClearAdminCookieHeader = (cookieName: string, isProduction: boolean) => {
  const securePart = isProduction ? "; Secure" : "";
  return `${cookieName}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${securePart}`;
};

export const createNativeAdminSession = async (payload: unknown) => {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  const jwtSecret = process.env.JWT_SECRET;
  const authCookieName = process.env.AUTH_COOKIE_NAME || "portfolio_admin_token";
  const nodeEnv = process.env.NODE_ENV || "development";

  if (!adminUsername || !adminPasswordHash || !jwtSecret) {
    return null;
  }

  const parsed = parseLoginPayload(payload);

  const isUsernameMatch = parsed.username === adminUsername;
  const isPasswordMatch = await bcrypt.compare(parsed.password, adminPasswordHash);

  if (!isUsernameMatch || !isPasswordMatch) {
    return {
      success: false,
      message: "Invalid credentials",
      statusCode: 401,
      cookie: "",
    };
  }

  const token = jwt.sign({ role: "admin" }, jwtSecret, {
    subject: adminUsername,
    expiresIn: ADMIN_TOKEN_TTL_SECONDS,
  });

  return {
    success: true,
    message: "Login successful",
    statusCode: 200,
    cookie: buildAdminCookieHeader(authCookieName, token, nodeEnv === "production"),
  };
};

export const clearNativeAdminSession = () => {
  const authCookieName = process.env.AUTH_COOKIE_NAME || "portfolio_admin_token";
  const nodeEnv = process.env.NODE_ENV || "development";

  return {
    success: true,
    message: "Logout successful",
    statusCode: 200,
    cookie: buildClearAdminCookieHeader(authCookieName, nodeEnv === "production"),
  };
};
