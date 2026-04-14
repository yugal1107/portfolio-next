import { fetchNativePublicStories } from "@/lib/native/public-stories";

export async function GET() {
  const nativePayload = await fetchNativePublicStories();

  if (nativePayload) {
    return Response.json({
      success: true,
      data: nativePayload,
    });
  }

  return Response.json({ success: false, message: "Public stories data unavailable" }, { status: 503 });
}
