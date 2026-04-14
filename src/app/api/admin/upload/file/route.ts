import { uploadNativeAdminFile } from "@/lib/native/admin-upload";
import { resolveNativeAdminFromRequest } from "@/lib/native/admin-auth";

export async function POST(request: Request) {
  try {
    resolveNativeAdminFromRequest(request);
    const formData = await request.formData();
    const uploaded = await uploadNativeAdminFile(formData);

    if (!uploaded) {
      return Response.json({ success: false, message: "Upload service unavailable" }, { status: 500 });
    }

    return Response.json(
      {
        success: true,
        data: uploaded.data,
      },
      { status: uploaded.statusCode },
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "No file uploaded" || error.message === "File too large") {
        return Response.json({ success: false, message: error.message }, { status: 400 });
      }
    }

    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
}
