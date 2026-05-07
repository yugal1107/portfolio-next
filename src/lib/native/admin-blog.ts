import { z } from "zod";

import type { BlogPostCard, BlogPostDetail } from "@/types/content";

const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const blogPostSchema = z.object({
  title: z.string().trim().min(1),
  slug: z.string().trim().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  summary: z.string().trim().nullable().optional(),
  contentMarkdown: z.string().trim().default(""),
  tags: z.array(z.string().trim().min(1)).default([]),
  coverImageUrl: z.string().trim().min(1).nullable().optional(),
  coverImagePublicId: z.string().trim().min(1).nullable().optional(),
  orderIndex: z.number().int().min(0).default(0),
  isPublished: z.boolean().default(false),
});

const toDbBool = (value: boolean) => (value ? 1 : 0);

export const mapDatabaseError = (error: unknown, entityName: string) => {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code?: unknown }).code || "")
      : "";

  if (code === "23505") {
    return {
      statusCode: 409,
      message: `${entityName} with same unique value already exists`,
    };
  }

  if (code === "23503") {
    return {
      statusCode: 400,
      message: `Invalid ${entityName} relation`,
    };
  }

  return {
    statusCode: 500,
    message: `${entityName} operation failed`,
  };
};

const parseJsonArray = <T>(value: string): T[] => {
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
};

export const parseAdminId = (id: string) => {
  const parsed = idParamSchema.safeParse({ id });
  if (!parsed.success) {
    throw new Error("Invalid id");
  }
  return parsed.data.id;
};

export const parseBlogPostPayload = (payload: unknown) => {
  const parsed = blogPostSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error("Invalid blog post payload");
  }
  return parsed.data;
};

export const fetchNativeAdminBlogPosts = async () => {
  const databaseUrl = process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    return null;
  }

  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(databaseUrl);

    const rows = await sql`
      SELECT
        id,
        title,
        slug,
        summary,
        cover_image_url,
        cover_image_public_id,
        tags_json,
        order_index,
        is_published,
        created_at,
        updated_at
      FROM blog_posts
      ORDER BY order_index ASC, updated_at DESC
    `;

    return {
      success: true,
      statusCode: 200,
      data: (rows as Array<Record<string, unknown>>).map((row) => ({
        id: row.id as number,
        title: row.title as string,
        slug: row.slug as string,
        summary: (row.summary as string | null) || null,
        coverImageUrl: (row.cover_image_url as string | null) || null,
        coverImagePublicId: (row.cover_image_public_id as string | null) || null,
        tags: parseJsonArray<string>((row.tags_json as string) || "[]"),
        orderIndex: row.order_index as number,
        isPublished: Boolean(row.is_published),
        createdAt: row.created_at as string,
        updatedAt: row.updated_at as string,
      })) as BlogPostCard[],
    };
  } catch (error) {
    return {
      success: false,
      ...mapDatabaseError(error, "Blog post"),
    };
  }
};

export const fetchNativeAdminBlogPostById = async (id: number) => {
  const databaseUrl = process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    return null;
  }

  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(databaseUrl);

    const rows = await sql`
      SELECT
        id,
        title,
        slug,
        summary,
        content_markdown,
        cover_image_url,
        cover_image_public_id,
        tags_json,
        order_index,
        is_published,
        created_at,
        updated_at
      FROM blog_posts
      WHERE id = ${id}
      LIMIT 1
    `;

    if (rows.length === 0) {
      return {
        success: false,
        message: "Blog post not found",
        statusCode: 404,
      };
    }

    const row = rows[0] as Record<string, unknown>;

    return {
      success: true,
      statusCode: 200,
      data: {
        id: row.id as number,
        title: row.title as string,
        slug: row.slug as string,
        summary: (row.summary as string | null) || null,
        contentMarkdown: (row.content_markdown as string) || "",
        coverImageUrl: (row.cover_image_url as string | null) || null,
        coverImagePublicId: (row.cover_image_public_id as string | null) || null,
        tags: parseJsonArray<string>((row.tags_json as string) || "[]"),
        orderIndex: row.order_index as number,
        isPublished: Boolean(row.is_published),
        createdAt: row.created_at as string,
        updatedAt: row.updated_at as string,
      } as BlogPostDetail,
    };
  } catch (error) {
    return {
      success: false,
      ...mapDatabaseError(error, "Blog post"),
    };
  }
};

export const createNativeAdminBlogPost = async (payload: unknown) => {
  const databaseUrl = process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    return null;
  }

  const parsed = parseBlogPostPayload(payload);

  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(databaseUrl);

    const rows = await sql`
      INSERT INTO blog_posts (
        title,
        slug,
        summary,
        content_markdown,
        tags_json,
        cover_image_url,
        cover_image_public_id,
        order_index,
        is_published,
        updated_at
      )
      VALUES (
        ${parsed.title},
        ${parsed.slug},
        ${parsed.summary ?? null},
        ${parsed.contentMarkdown},
        ${JSON.stringify(parsed.tags)},
        ${parsed.coverImageUrl ?? null},
        ${parsed.coverImagePublicId ?? null},
        ${parsed.orderIndex},
        ${toDbBool(parsed.isPublished)},
        CURRENT_TIMESTAMP
      )
      RETURNING id
    `;

    return {
      success: true,
      statusCode: 201,
      data: { id: Number((rows[0] as Record<string, unknown>).id) },
    };
  } catch (error) {
    return {
      success: false,
      ...mapDatabaseError(error, "Blog post"),
    };
  }
};

export const updateNativeAdminBlogPost = async (id: number, payload: unknown) => {
  const databaseUrl = process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    return null;
  }

  const parsed = parseBlogPostPayload(payload);

  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(databaseUrl);

    const rows = await sql`
      UPDATE blog_posts
      SET
        title = ${parsed.title},
        slug = ${parsed.slug},
        summary = ${parsed.summary ?? null},
        content_markdown = ${parsed.contentMarkdown},
        tags_json = ${JSON.stringify(parsed.tags)},
        cover_image_url = ${parsed.coverImageUrl ?? null},
        cover_image_public_id = ${parsed.coverImagePublicId ?? null},
        order_index = ${parsed.orderIndex},
        is_published = ${toDbBool(parsed.isPublished)},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id
    `;

    if (rows.length === 0) {
      return {
        success: false,
        message: "Blog post not found",
        statusCode: 404,
      };
    }

    return {
      success: true,
      message: "Blog post updated",
      statusCode: 200,
    };
  } catch (error) {
    return {
      success: false,
      ...mapDatabaseError(error, "Blog post"),
    };
  }
};

export const deleteNativeAdminBlogPost = async (id: number) => {
  const databaseUrl = process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    return null;
  }

  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(databaseUrl);

    const rows = await sql`
      DELETE FROM blog_posts WHERE id = ${id} RETURNING id
    `;

    if (rows.length === 0) {
      return {
        success: false,
        message: "Blog post not found",
        statusCode: 404,
      };
    }

    return {
      success: true,
      message: "Blog post deleted",
      statusCode: 200,
    };
  } catch (error) {
    return {
      success: false,
      ...mapDatabaseError(error, "Blog post"),
    };
  }
};
