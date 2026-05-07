import {
  deleteNativeAdminBlogPost,
  fetchNativeAdminBlogPostById,
  parseAdminId,
  updateNativeAdminBlogPost,
} from "@/lib/native/admin-blog";
import { resolveNativeAdminFromRequest } from "@/lib/native/admin-auth";

type BlogRouteProps = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: BlogRouteProps) {
  const { id } = await params;

  try {
    resolveNativeAdminFromRequest(request);
    const parsedId = parseAdminId(id);
    const result = await fetchNativeAdminBlogPostById(parsedId);

    if (!result) {
      return Response.json({ success: false, message: "Blog post not available" }, { status: 500 });
    }

    if (!result.success) {
      return Response.json({ success: false, message: result.message }, { status: result.statusCode });
    }

    return Response.json({ success: true, data: result.data }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid id") {
      return Response.json({ success: false, message: "Invalid blog post id" }, { status: 400 });
    }

    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(request: Request, { params }: BlogRouteProps) {
  const { id } = await params;

  try {
    resolveNativeAdminFromRequest(request);
    const parsedId = parseAdminId(id);
    const result = await updateNativeAdminBlogPost(parsedId, await request.json());

    if (!result) {
      return Response.json({ success: false, message: "Blog post update failed" }, { status: 500 });
    }

    if (!result.success) {
      return Response.json({ success: false, message: result.message }, { status: result.statusCode });
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
        return Response.json({ success: false, message: "Invalid blog post id" }, { status: 400 });
      }
      if (error.message === "Invalid blog post payload") {
        return Response.json({ success: false, message: error.message }, { status: 400 });
      }
    }

    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(request: Request, { params }: BlogRouteProps) {
  const { id } = await params;

  try {
    resolveNativeAdminFromRequest(request);
    const parsedId = parseAdminId(id);
    const result = await deleteNativeAdminBlogPost(parsedId);

    if (!result) {
      return Response.json({ success: false, message: "Blog post delete failed" }, { status: 500 });
    }

    if (!result.success) {
      return Response.json({ success: false, message: result.message }, { status: result.statusCode });
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
      return Response.json({ success: false, message: "Invalid blog post id" }, { status: 400 });
    }

    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
}
