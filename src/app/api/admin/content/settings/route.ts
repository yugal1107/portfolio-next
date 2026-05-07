import { fetchNativeAdminSettings, parseSettingsPatchPayload, patchNativeAdminSettings } from "@/lib/native/admin-content";
import { resolveNativeAdminFromRequest } from "@/lib/native/admin-auth";

export async function GET(request: Request) {
  try {
    resolveNativeAdminFromRequest(request);
    const result = await fetchNativeAdminSettings();

    if (!result) {
      return Response.json({ success: false, message: "Settings not available" }, { status: 500 });
    }

    if (!result.success) {
      return Response.json({ success: false, message: result.message }, { status: result.statusCode });
    }

    return Response.json({ success: true, data: result.data }, { status: 200 });
  } catch {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(request: Request) {
  try {
    resolveNativeAdminFromRequest(request);
    const payload = parseSettingsPatchPayload(await request.json());
    const result = await patchNativeAdminSettings(payload);

    if (!result) {
      return Response.json({ success: false, message: "Settings update failed" }, { status: 500 });
    }

    return Response.json(
      {
        success: result.success,
        message: result.message,
        data: { success: true },
      },
      { status: result.statusCode },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid settings payload") {
      return Response.json({ success: false, message: error.message }, { status: 400 });
    }

    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
}
