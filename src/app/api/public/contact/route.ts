import { createNativeContactMessage } from "@/lib/native/public-contact";

export async function POST(request: Request) {
  if (!process.env.NEON_DATABASE_URL) {
    return Response.json({ success: false, message: "Database connection is not configured" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const nativeResult = await createNativeContactMessage(body);

    if (nativeResult) {
      return Response.json(nativeResult, { status: 201 });
    }

    return Response.json({ success: false, message: "Unable to create contact message" }, { status: 503 });
  } catch {
    return Response.json({ success: false, message: "Invalid contact payload" }, { status: 400 });
  }
}
