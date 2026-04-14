import {
  deleteNativeAdminProject,
  parseAdminId,
  updateNativeAdminProject,
} from "@/lib/native/admin-content";
import { resolveNativeAdminFromRequest } from "@/lib/native/admin-auth";

type ProjectRouteProps = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: ProjectRouteProps) {
  const { id } = await params;

  try {
    resolveNativeAdminFromRequest(request);
    const parsedId = parseAdminId(id);
    const result = await updateNativeAdminProject(parsedId, await request.json());

    if (!result) {
      return Response.json({ success: false, message: "Project update failed" }, { status: 500 });
    }

    if (!result.success) {
      return Response.json(
        { success: false, message: "message" in result ? String(result.message) : "Project update failed" },
        { status: result.statusCode },
      );
    }

    return Response.json(
      {
        success: result.success,
        message: result.message,
      },
      { status: result.statusCode },
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Invalid id") {
        return Response.json({ success: false, message: "Invalid project id" }, { status: 400 });
      }
      if (error.message === "Invalid project payload") {
        return Response.json({ success: false, message: error.message }, { status: 400 });
      }
    }

    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(request: Request, { params }: ProjectRouteProps) {
  const { id } = await params;

  try {
    resolveNativeAdminFromRequest(request);
    const parsedId = parseAdminId(id);
    const result = await deleteNativeAdminProject(parsedId);

    if (!result) {
      return Response.json({ success: false, message: "Project delete failed" }, { status: 500 });
    }

    if (!result.success) {
      return Response.json(
        { success: false, message: "message" in result ? String(result.message) : "Project delete failed" },
        { status: result.statusCode },
      );
    }

    return Response.json(
      {
        success: result.success,
        message: result.message,
      },
      { status: result.statusCode },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid id") {
      return Response.json({ success: false, message: "Invalid project id" }, { status: 400 });
    }

    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
}
