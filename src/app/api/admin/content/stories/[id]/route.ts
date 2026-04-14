import {
  deleteNativeAdminStory,
  fetchNativeAdminStoryById,
  parseAdminId,
  updateNativeAdminStory,
} from "@/lib/native/admin-content";
import { resolveNativeAdminFromRequest } from "@/lib/native/admin-auth";

type StoryRouteProps = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: StoryRouteProps) {
  const { id } = await params;

  try {
    resolveNativeAdminFromRequest(request);
    const parsedId = parseAdminId(id);
    const result = await fetchNativeAdminStoryById(parsedId);

    if (!result) {
      return Response.json({ success: false, message: "Story not available" }, { status: 500 });
    }

    if (!result.success) {
      return Response.json({ success: false, message: result.message }, { status: result.statusCode });
    }

    return Response.json({ success: true, data: result.data }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid id") {
      return Response.json({ success: false, message: "Invalid story id" }, { status: 400 });
    }

    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(request: Request, { params }: StoryRouteProps) {
  const { id } = await params;

  try {
    resolveNativeAdminFromRequest(request);
    const parsedId = parseAdminId(id);
    const result = await updateNativeAdminStory(parsedId, await request.json());

    if (!result) {
      return Response.json({ success: false, message: "Story update failed" }, { status: 500 });
    }

    if (!result.success) {
      return Response.json({ success: false, message: result.message }, { status: result.statusCode });
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
        return Response.json({ success: false, message: "Invalid story id" }, { status: 400 });
      }
      if (error.message === "Invalid story payload") {
        return Response.json({ success: false, message: error.message }, { status: 400 });
      }
    }

    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(request: Request, { params }: StoryRouteProps) {
  const { id } = await params;

  try {
    resolveNativeAdminFromRequest(request);
    const parsedId = parseAdminId(id);
    const result = await deleteNativeAdminStory(parsedId);

    if (!result) {
      return Response.json({ success: false, message: "Story delete failed" }, { status: 500 });
    }

    if (!result.success) {
      return Response.json({ success: false, message: result.message }, { status: result.statusCode });
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
      return Response.json({ success: false, message: "Invalid story id" }, { status: 400 });
    }

    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
}
