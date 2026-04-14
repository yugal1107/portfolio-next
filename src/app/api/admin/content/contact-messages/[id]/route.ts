import { resolveNativeAdminFromRequest } from "@/lib/native/admin-auth";
import {
  deleteNativeContactMessage,
  validateContactMessageId,
} from "@/lib/native/admin-contact-messages";

type ContactMessageRouteProps = {
  params: Promise<{ id: string }>;
};

export async function DELETE(request: Request, { params }: ContactMessageRouteProps) {
  const { id } = await params;

  if (!process.env.NEON_DATABASE_URL) {
    return Response.json({ success: false, message: "Database connection is not configured" }, { status: 503 });
  }

  try {
    const admin = resolveNativeAdminFromRequest(request);

    if (!admin) {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const validId = validateContactMessageId(id);
    const result = await deleteNativeContactMessage(validId);

    if (result) {
      return Response.json(
        {
          success: result.success,
          message: result.message,
        },
        { status: result.statusCode },
      );
    }

    return Response.json({ success: false, message: "Unable to delete contact message" }, { status: 503 });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Invalid contact message id") {
        return Response.json({ success: false, message: error.message }, { status: 400 });
      }

      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
  }

  return Response.json({ success: false, message: "Unable to delete contact message" }, { status: 500 });
}
