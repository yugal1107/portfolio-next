import jwt from "jsonwebtoken";

type AdminJwtPayload = {
  sub: string;
  role: "admin";
};

export const extractAdminFromCookies = (cookieHeader: string | null, cookieName: string) => {
  if (!cookieHeader || !cookieName) {
    return "";
  }

  const cookieParts = cookieHeader.split(";").map((part) => part.trim());
  const match = cookieParts.find((part) => part.startsWith(`${cookieName}=`));

  if (!match) {
    return "";
  }

  return decodeURIComponent(match.slice(cookieName.length + 1));
};

export const verifyAdminTokenPayload = (decoded: unknown, adminUsername: string) => {
  if (typeof decoded !== "object" || decoded === null) {
    throw new Error("Unauthorized");
  }

  const payload = decoded as Partial<AdminJwtPayload>;
  if (payload.role !== "admin" || payload.sub !== adminUsername) {
    throw new Error("Unauthorized");
  }

  return {
    username: payload.sub,
    role: payload.role,
  };
};

export const resolveNativeAdminFromRequest = (request: Request) => {
  const authCookieName = process.env.AUTH_COOKIE_NAME;
  const jwtSecret = process.env.JWT_SECRET;
  const adminUsername = process.env.ADMIN_USERNAME;

  if (!authCookieName || !jwtSecret || !adminUsername) {
    return null;
  }

  const token = extractAdminFromCookies(request.headers.get("cookie"), authCookieName);
  if (!token) {
    throw new Error("Unauthorized");
  }

  const decoded = jwt.verify(token, jwtSecret);
  return verifyAdminTokenPayload(decoded, adminUsername);
};
