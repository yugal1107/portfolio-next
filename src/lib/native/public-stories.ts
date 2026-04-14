import type { StoryCard, StoryDetail } from "@/types/content";

type StoryCardRow = {
  title: string;
  slug: string;
  date_text: string | null;
  location: string | null;
  status: string | null;
  card_image_url: string | null;
  card_image_public_id: string | null;
  order_index: number;
};

type StoryDetailRow = {
  title: string;
  slug: string;
  date_text: string | null;
  location: string | null;
  status: string | null;
  card_image_url: string | null;
  card_image_public_id: string | null;
  images_json: string;
  images_public_ids_json: string;
  description_json: string;
  project_json: string | null;
  outcomes_json: string;
  team_json: string | null;
};

const parseJsonArray = <T>(value: string, fallback: T[] = []): T[] => {
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
};

const parseJsonObject = <T>(value: string | null): T | null => {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") {
      return null;
    }

    return parsed as T;
  } catch {
    return null;
  }
};

export const paragraphsToMarkdown = (paragraphs: string[]) =>
  paragraphs
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .join("\n\n");

export const mapStoryCardRows = (rows: StoryCardRow[]): StoryCard[] => {
  return rows.map((story) => ({
    title: story.title,
    slug: story.slug,
    dateText: story.date_text,
    location: story.location,
    status: story.status,
    cardImageUrl: story.card_image_url,
    cardImagePublicId: story.card_image_public_id,
    orderIndex: story.order_index,
  }));
};

export const mapStoryDetailRow = (story: StoryDetailRow | null): StoryDetail | null => {
  if (!story) {
    return null;
  }

  const descriptionParagraphs = parseJsonArray<string>(story.description_json);

  return {
    title: story.title,
    slug: story.slug,
    dateText: story.date_text,
    location: story.location,
    status: story.status,
    cardImageUrl: story.card_image_url,
    cardImagePublicId: story.card_image_public_id,
    images: parseJsonArray<string>(story.images_json),
    imagePublicIds: parseJsonArray<string>(story.images_public_ids_json),
    contentMarkdown: paragraphsToMarkdown(descriptionParagraphs),
    project: parseJsonObject<Record<string, unknown>>(story.project_json),
    outcomes: parseJsonArray<string>(story.outcomes_json),
    team: parseJsonObject<Record<string, unknown>>(story.team_json),
  };
};

export const fetchNativePublicStories = async (): Promise<StoryCard[] | null> => {
  const databaseUrl = process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    return null;
  }

  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(databaseUrl);

    const rows = await sql`
      SELECT
        title,
        slug,
        date_text,
        location,
        status,
        card_image_url,
        card_image_public_id,
        order_index
      FROM stories
      WHERE is_published = 1
      ORDER BY order_index ASC, updated_at DESC
    `;

    return mapStoryCardRows(rows as StoryCardRow[]);
  } catch {
    return null;
  }
};

export const fetchNativePublicStoryBySlug = async (slug: string): Promise<StoryDetail | null> => {
  const databaseUrl = process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    return null;
  }

  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(databaseUrl);

    const rows = await sql`
      SELECT
        title,
        slug,
        date_text,
        location,
        status,
        card_image_url,
        card_image_public_id,
        images_json,
        images_public_ids_json,
        description_json,
        project_json,
        outcomes_json,
        team_json
      FROM stories
      WHERE slug = ${slug} AND is_published = 1
      LIMIT 1
    `;

    return mapStoryDetailRow((rows[0] as StoryDetailRow | undefined) || null);
  } catch {
    return null;
  }
};
