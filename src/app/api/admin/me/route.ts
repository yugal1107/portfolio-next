import { resolveNativeAdminFromRequest } from "@/lib/native/admin-auth";

export async function GET(request: Request) {
  if (!process.env.AUTH_COOKIE_NAME || !process.env.JWT_SECRET || !process.env.ADMIN_USERNAME) {
    return Response.json({ success: false, message: "Admin auth is not configured" }, { status: 503 });
  }

  try {
    const admin = resolveNativeAdminFromRequest(request);

    if (admin) {
      return Response.json({
        success: true,
        data: {
          username: admin.username,
          role: admin.role,
        },
      });
    }
  } catch {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
}
