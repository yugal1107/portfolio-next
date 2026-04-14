import { resolveNativeAdminFromRequest } from "@/lib/native/admin-auth";
import {
  updateNativeContactMessageStatus,
  validateContactMessageId,
} from "@/lib/native/admin-contact-messages";

type ContactMessageStatusRouteProps = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: ContactMessageStatusRouteProps) {
  const { id } = await params;

  if (!process.env.NEON_DATABASE_URL) {
    return Response.json({ success: false, message: "Database connection is not configured" }, { status: 503 });
  }

  try {
    const admin = resolveNativeAdminFromRequest(request);

    if (!admin) {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validId = validateContactMessageId(id);
    const result = await updateNativeContactMessageStatus(validId, body);

    if (result) {
      return Response.json(
        {
          success: result.success,
          message: result.message,
        },
        { status: result.statusCode },
      );
    }

    return Response.json({ success: false, message: "Unable to update contact message status" }, { status: 503 });
  } catch (error) {
    if (error instanceof Error) {
      const isValidationError =
        error.message === "Invalid contact message id" ||
        error.message === "Invalid contact message status payload";

      if (isValidationError) {
        return Response.json({ success: false, message: error.message }, { status: 400 });
      }

      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
  }

  return Response.json({ success: false, message: "Unable to update contact message status" }, { status: 500 });
}
