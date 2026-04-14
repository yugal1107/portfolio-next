import { clearNativeAdminSession } from "@/lib/native/admin-session";

export async function POST() {
  try {
    const sessionResult = clearNativeAdminSession();

    const headers = new Headers({
      "Content-Type": "application/json",
    });

    if (sessionResult.cookie) {
      headers.set("set-cookie", sessionResult.cookie);
    }

    return new Response(
      JSON.stringify({
        success: sessionResult.success,
        message: sessionResult.message,
      }),
      {
        status: sessionResult.statusCode,
        headers,
      },
    );
  } catch {
    return Response.json({ success: false, message: "Unable to clear admin session" }, { status: 500 });
  }
}
