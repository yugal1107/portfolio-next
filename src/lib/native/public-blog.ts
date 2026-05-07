import type { BlogPostCard, BlogPostDetail } from "@/types/content";

type BlogPostCardRow = {
  id: number;
  title: string;
  slug: string;
  summary: string | null;
  cover_image_url: string | null;
  cover_image_public_id: string | null;
  tags_json: string;
  order_index: number;
  is_published: number;
  created_at: string;
  updated_at: string;
};

type BlogPostDetailRow = {
  id: number;
  title: string;
  slug: string;
  summary: string | null;
  content_markdown: string;
  cover_image_url: string | null;
  cover_image_public_id: string | null;
  tags_json: string;
  order_index: number;
  is_published: number;
  created_at: string;
  updated_at: string;
};

const parseJsonArray = <T>(value: string): T[] => {
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
};

export const mapBlogPostCardRows = (rows: BlogPostCardRow[]): BlogPostCard[] => {
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    coverImageUrl: row.cover_image_url,
    coverImagePublicId: row.cover_image_public_id,
    tags: parseJsonArray<string>(row.tags_json),
    isPublished: Boolean(row.is_published),
    orderIndex: row.order_index,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
};

export const mapBlogPostDetailRow = (row: BlogPostDetailRow | null): BlogPostDetail | null => {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    contentMarkdown: row.content_markdown,
    coverImageUrl: row.cover_image_url,
    coverImagePublicId: row.cover_image_public_id,
    tags: parseJsonArray<string>(row.tags_json),
    isPublished: Boolean(row.is_published),
    orderIndex: row.order_index,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

export const fetchNativePublicBlogPosts = async (): Promise<BlogPostCard[] | null> => {
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
      WHERE is_published = 1
      ORDER BY order_index ASC, updated_at DESC
    `;

    return mapBlogPostCardRows(rows as BlogPostCardRow[]);
  } catch {
    return null;
  }
};

export const fetchNativePublicBlogPostBySlug = async (slug: string): Promise<BlogPostDetail | null> => {
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
      WHERE slug = ${slug} AND is_published = 1
      LIMIT 1
    `;

    return mapBlogPostDetailRow((rows[0] as BlogPostDetailRow | undefined) || null);
  } catch {
    return null;
  }
};
