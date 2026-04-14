import { createNativeAdminSession } from "@/lib/native/admin-session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sessionResult = await createNativeAdminSession(body);

    if (sessionResult) {
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
    }

    return Response.json({ success: false, message: "Admin auth is not configured" }, { status: 503 });
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid login payload") {
      return Response.json({ success: false, message: error.message }, { status: 400 });
    }

    return Response.json({ success: false, message: "Unable to create admin session" }, { status: 500 });
  }
}
