import { createNativeAdminSkillGroup, fetchNativeAdminSkillGroups } from "@/lib/native/admin-content";
import { resolveNativeAdminFromRequest } from "@/lib/native/admin-auth";

export async function GET(request: Request) {
  try {
    resolveNativeAdminFromRequest(request);
    const result = await fetchNativeAdminSkillGroups();

    if (!result) {
      return Response.json({ success: false, message: "Skill groups not available" }, { status: 500 });
    }

    return Response.json({ success: true, data: result.data }, { status: 200 });
  } catch {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    resolveNativeAdminFromRequest(request);
    const result = await createNativeAdminSkillGroup(await request.json());

    if (!result) {
      return Response.json({ success: false, message: "Skill group creation failed" }, { status: 500 });
    }

    if (!result.success) {
      return Response.json(
        {
          success: false,
          message: "message" in result ? String(result.message) : "Skill group creation failed",
        },
        { status: result.statusCode },
      );
    }

    return Response.json({ success: true, data: result.data }, { status: result.statusCode });
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid skill group payload") {
      return Response.json({ success: false, message: error.message }, { status: 400 });
    }

    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
}
