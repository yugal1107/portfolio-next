import { fetchNativePublicHome } from "@/lib/native/public-home";

export async function GET() {
  const nativePayload = await fetchNativePublicHome();

  if (nativePayload) {
    return Response.json({
      success: true,
      data: nativePayload,
    });
  }

  return Response.json({ success: false, message: "Public home data unavailable" }, { status: 503 });
}
