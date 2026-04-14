import type { ContactMessage } from "@/types/content";

import { z } from "zod";

type ContactMessageRow = {
  id: number;
  name: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
};

const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const contactMessageStatusSchema = z.object({
  status: z.enum(["new", "read", "archived"]),
});

export const mapAdminContactMessageRows = (rows: ContactMessageRow[]): ContactMessage[] => {
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    message: row.message,
    status: row.status as ContactMessage["status"],
    createdAt: row.created_at,
  }));
};

export const fetchNativeAdminContactMessages = async (): Promise<ContactMessage[] | null> => {
  const databaseUrl = process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    return null;
  }

  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(databaseUrl);

    const rows = await sql`
      SELECT id, name, email, message, status, created_at
      FROM contact_messages
      ORDER BY created_at DESC, id DESC
    `;

    return mapAdminContactMessageRows(rows as ContactMessageRow[]);
  } catch {
    return null;
  }
};

export const validateContactMessageId = (id: string) => {
  const parsed = idParamSchema.safeParse({ id });

  if (!parsed.success) {
    throw new Error("Invalid contact message id");
  }

  return parsed.data.id;
};

export const validateContactMessageStatusPayload = (payload: unknown) => {
  const parsed = contactMessageStatusSchema.safeParse(payload);

  if (!parsed.success) {
    throw new Error("Invalid contact message status payload");
  }

  return parsed.data;
};

export const updateNativeContactMessageStatus = async (id: number, payload: unknown) => {
  const databaseUrl = process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    return null;
  }

  const parsedStatus = validateContactMessageStatusPayload(payload);

  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(databaseUrl);

    const rows = await sql`
      UPDATE contact_messages
      SET status = ${parsedStatus.status}
      WHERE id = ${id}
      RETURNING id
    `;

    if (rows.length === 0) {
      return {
        success: false,
        message: "Contact message not found",
        statusCode: 404,
      };
    }

    return {
      success: true,
      message: `Message marked as ${parsedStatus.status}`,
      statusCode: 200,
    };
  } catch {
    return null;
  }
};

export const deleteNativeContactMessage = async (id: number) => {
  const databaseUrl = process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    return null;
  }

  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(databaseUrl);

    const rows = await sql`
      DELETE FROM contact_messages
      WHERE id = ${id}
      RETURNING id
    `;

    if (rows.length === 0) {
      return {
        success: false,
        message: "Contact message not found",
        statusCode: 404,
      };
    }

    return {
      success: true,
      message: "Contact message deleted",
      statusCode: 200,
    };
  } catch {
    return null;
  }
};
