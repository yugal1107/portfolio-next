import { z } from "zod";

const contactMessageSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  message: z.string().trim().min(10).max(4000),
  website: z.string().trim().max(0).optional(),
});

export const validateContactPayload = (payload: unknown) => {
  const parsed = contactMessageSchema.safeParse(payload);

  if (!parsed.success || parsed.data.website) {
    throw new Error("Invalid contact payload");
  }

  return {
    name: parsed.data.name,
    email: parsed.data.email,
    message: parsed.data.message,
  };
};

export const createNativeContactMessage = async (payload: unknown) => {
  const databaseUrl = process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    return null;
  }

  const validated = validateContactPayload(payload);

  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(databaseUrl);

    await sql`
      INSERT INTO contact_messages (name, email, message, status)
      VALUES (${validated.name}, ${validated.email}, ${validated.message}, 'new')
    `;

    return {
      success: true,
      message: "Message sent successfully",
    };
  } catch {
    return null;
  }
};
