import {
  deleteNativeAdminSkillGroup,
  parseAdminId,
  updateNativeAdminSkillGroup,
} from "@/lib/native/admin-content";
import { resolveNativeAdminFromRequest } from "@/lib/native/admin-auth";

type SkillGroupRouteProps = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: SkillGroupRouteProps) {
  const { id } = await params;

  try {
    resolveNativeAdminFromRequest(request);
    const parsedId = parseAdminId(id);
    const result = await updateNativeAdminSkillGroup(parsedId, await request.json());

    if (!result) {
      return Response.json({ success: false, message: "Skill group update failed" }, { status: 500 });
    }

    if (!result.success) {
      return Response.json(
        {
          success: false,
          message: "message" in result ? String(result.message) : "Skill group update failed",
        },
        { status: result.statusCode },
      );
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
    if (error instanceof Error) {
      if (error.message === "Invalid id") {
        return Response.json({ success: false, message: "Invalid skill group id" }, { status: 400 });
      }
      if (error.message === "Invalid skill group payload") {
        return Response.json({ success: false, message: error.message }, { status: 400 });
      }
    }

    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(request: Request, { params }: SkillGroupRouteProps) {
  const { id } = await params;

  try {
    resolveNativeAdminFromRequest(request);
    const parsedId = parseAdminId(id);
    const result = await deleteNativeAdminSkillGroup(parsedId);

    if (!result) {
      return Response.json({ success: false, message: "Skill group delete failed" }, { status: 500 });
    }

    if (!result.success) {
      return Response.json(
        {
          success: false,
          message: "message" in result ? String(result.message) : "Skill group delete failed",
        },
        { status: result.statusCode },
      );
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
    if (error instanceof Error && error.message === "Invalid id") {
      return Response.json({ success: false, message: "Invalid skill group id" }, { status: 400 });
    }

    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
}
