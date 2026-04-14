import { fetchNativeAdminContactMessages } from "@/lib/native/admin-contact-messages";
import { resolveNativeAdminFromRequest } from "@/lib/native/admin-auth";

export async function GET(request: Request) {
  if (!process.env.NEON_DATABASE_URL) {
    return Response.json({ success: false, message: "Database connection is not configured" }, { status: 503 });
  }

  try {
    const admin = resolveNativeAdminFromRequest(request);

    if (!admin) {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const nativeRows = await fetchNativeAdminContactMessages();
    if (nativeRows) {
      return Response.json({
        success: true,
        data: nativeRows,
      });
    }

    return Response.json({ success: false, message: "Unable to fetch contact messages" }, { status: 503 });
  } catch {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
}
