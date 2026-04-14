import { z } from "zod";

import type { HomePayload } from "@/types/content";

const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const settingsSchema = z
  .object({
    fullName: z.preprocess((value) => (value === "" ? undefined : value), z.string().trim().min(1).optional()),
    title: z.preprocess((value) => (value === "" ? undefined : value), z.string().trim().min(1).optional()),
    bio: z.preprocess((value) => (value === "" ? undefined : value), z.string().trim().min(1).optional()),
    location: z.preprocess((value) => (value === "" ? null : value), z.string().trim().nullable().optional()),
    email: z.preprocess((value) => (value === "" ? null : value), z.string().trim().email().nullable().optional()),
    githubUrl: z.preprocess((value) => (value === "" ? null : value), z.string().trim().url().nullable().optional()),
    linkedinUrl: z.preprocess((value) => (value === "" ? null : value), z.string().trim().url().nullable().optional()),
    twitterUrl: z.preprocess((value) => (value === "" ? null : value), z.string().trim().url().nullable().optional()),
    instagramUrl: z.preprocess((value) => (value === "" ? null : value), z.string().trim().url().nullable().optional()),
    resumeUrl: z.preprocess((value) => (value === "" ? null : value), z.string().trim().url().nullable().optional()),
    profileImageUrl: z.preprocess((value) => (value === "" ? null : value), z.string().trim().nullable().optional()),
    profileImagePublicId: z.preprocess(
      (value) => (value === "" ? null : value),
      z.string().trim().nullable().optional(),
    ),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });

const projectSchema = z.object({
  title: z.string().trim().min(1),
  slug: z.string().trim().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().min(1),
  liveUrl: z.string().trim().url().nullable().optional(),
  githubUrl: z.string().trim().url().nullable().optional(),
  imageUrl: z.string().trim().min(1).nullable().optional(),
  imagePublicId: z.string().trim().min(1).nullable().optional(),
  techStack: z.array(z.string().trim().min(1)).default([]),
  featured: z.boolean().default(false),
  orderIndex: z.number().int().min(0).default(0),
  isPublished: z.boolean().default(true),
});

const skillGroupSchema = z.object({
  name: z.string().trim().min(1),
  orderIndex: z.number().int().min(0).default(0),
  isPublished: z.boolean().default(true),
});

const skillSchema = z.object({
  skillGroupId: z.number().int().positive(),
  name: z.string().trim().min(1),
  iconKey: z.string().trim().min(1).nullable().optional(),
  orderIndex: z.number().int().min(0).default(0),
  isPublished: z.boolean().default(true),
});

const storySchema = z.object({
  title: z.string().trim().min(1),
  slug: z.string().trim().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  dateText: z.string().trim().nullable().optional(),
  location: z.string().trim().nullable().optional(),
  status: z.string().trim().nullable().optional(),
  cardImageUrl: z.string().trim().min(1).nullable().optional(),
  cardImagePublicId: z.string().trim().min(1).nullable().optional(),
  images: z.array(z.string().trim().min(1)).default([]),
  imagePublicIds: z.array(z.string().trim().min(1)).default([]),
  contentMarkdown: z.string().default(""),
  project: z.record(z.string(), z.any()).nullable().optional(),
  outcomes: z.array(z.string().trim().min(1)).default([]),
  team: z.record(z.string(), z.any()).nullable().optional(),
  orderIndex: z.number().int().min(0).default(0),
  isPublished: z.boolean().default(true),
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

const parseJsonObject = (value: string | null): Record<string, unknown> | null => {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : null;
  } catch (error) {
    return {
      success: false,
      ...mapDatabaseError(error, "Project"),
    };
  }
};

export const parseAdminId = (id: string) => {
  const parsed = idParamSchema.safeParse({ id });
  if (!parsed.success) {
    throw new Error("Invalid id");
  }
  return parsed.data.id;
};

export const parseSettingsPatchPayload = (payload: unknown) => {
  const parsed = settingsSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error("Invalid settings payload");
  }
  return parsed.data;
};

export const parseProjectPayload = (payload: unknown) => {
  const parsed = projectSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error("Invalid project payload");
  }
  return parsed.data;
};

export const parseSkillGroupPayload = (payload: unknown) => {
  const parsed = skillGroupSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error("Invalid skill group payload");
  }
  return parsed.data;
};

export const parseSkillPayload = (payload: unknown) => {
  const parsed = skillSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error("Invalid skill payload");
  }
  return parsed.data;
};

export const parseStoryPayload = (payload: unknown) => {
  const parsed = storySchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error("Invalid story payload");
  }
  return parsed.data;
};

export const markdownToParagraphs = (markdown: string): string[] => {
  return markdown
    .split(/\n\n+/)
    .map((part) => part.trim())
    .filter(Boolean);
};

export const paragraphsToMarkdown = (paragraphs: string[]): string => {
  return paragraphs
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .join("\n\n");
};

export const fetchNativeAdminSettings = async () => {
  const databaseUrl = process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    return null;
  }

  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(databaseUrl);

    const rows = await sql`
      SELECT
        full_name,
        title,
        bio,
        location,
        email,
        github_url,
        linkedin_url,
        twitter_url,
        instagram_url,
        resume_url,
        profile_image_url,
        profile_image_public_id,
        updated_at
      FROM site_settings
      WHERE id = 1
      LIMIT 1
    `;

    if (rows.length === 0) {
      return {
        success: false,
        message: "Settings not found",
        statusCode: 404,
      };
    }

    const row = rows[0] as {
      full_name: string;
      title: string;
      bio: string;
      location: string | null;
      email: string | null;
      github_url: string | null;
      linkedin_url: string | null;
      twitter_url: string | null;
      instagram_url: string | null;
      resume_url: string | null;
      profile_image_url: string | null;
      profile_image_public_id: string | null;
      updated_at: string;
    };

    return {
      success: true,
      statusCode: 200,
      data: {
        fullName: row.full_name,
        title: row.title,
        bio: row.bio,
        location: row.location,
        email: row.email,
        githubUrl: row.github_url,
        linkedinUrl: row.linkedin_url,
        twitterUrl: row.twitter_url,
        instagramUrl: row.instagram_url,
        resumeUrl: row.resume_url,
        profileImageUrl: row.profile_image_url,
        profileImagePublicId: row.profile_image_public_id,
        updatedAt: row.updated_at,
      },
    };
  } catch (error) {
    return {
      success: false,
      ...mapDatabaseError(error, "Project"),
    };
  }
};

export const patchNativeAdminSettings = async (payload: unknown) => {
  const databaseUrl = process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    return null;
  }

  const parsed = parseSettingsPatchPayload(payload);

  const columnMap: Record<string, string> = {
    fullName: "full_name",
    title: "title",
    bio: "bio",
    location: "location",
    email: "email",
    githubUrl: "github_url",
    linkedinUrl: "linkedin_url",
    twitterUrl: "twitter_url",
    instagramUrl: "instagram_url",
    resumeUrl: "resume_url",
    profileImageUrl: "profile_image_url",
    profileImagePublicId: "profile_image_public_id",
  };

  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(databaseUrl);

    const updates: string[] = [];
    const values: unknown[] = [];

    for (const [key, value] of Object.entries(parsed)) {
      if (value === undefined) {
        continue;
      }
      const column = columnMap[key];
      if (!column) {
        continue;
      }
      updates.push(`${column} = $${values.length + 1}`);
      values.push(value);
    }

    if (updates.length === 0) {
      return {
        success: false,
        message: "No valid fields to update",
        statusCode: 400,
      };
    }

    values.push(1);
    const idParamIndex = values.length;

    const queryText = `
      UPDATE site_settings
      SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${idParamIndex}
      RETURNING id
    `;

    const rows = await sql.query(queryText, values);

    if (rows.length === 0) {
      return {
        success: false,
        message: "Settings not found",
        statusCode: 404,
      };
    }

    return {
      success: true,
      message: "Settings updated",
      statusCode: 200,
    };
  } catch (error) {
    return {
      success: false,
      ...mapDatabaseError(error, "Project"),
    };
  }
};

export const fetchNativeAdminProjects = async () => {
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
        description,
        live_url,
        github_url,
        image_url,
        image_public_id,
        tech_stack_json,
        featured,
        order_index,
        is_published,
        created_at,
        updated_at
      FROM projects
      ORDER BY order_index ASC, updated_at DESC
    `;

    return {
      success: true,
      statusCode: 200,
      data: (rows as Array<Record<string, unknown>>).map((row) => ({
        id: row.id as number,
        title: row.title as string,
        slug: row.slug as string,
        description: row.description as string,
        liveUrl: row.live_url as string | null,
        githubUrl: row.github_url as string | null,
        imageUrl: row.image_url as string | null,
        imagePublicId: row.image_public_id as string | null,
        techStack: parseJsonArray<string>((row.tech_stack_json as string) || "[]"),
        featured: Boolean(row.featured),
        orderIndex: row.order_index as number,
        isPublished: Boolean(row.is_published),
        createdAt: row.created_at as string,
        updatedAt: row.updated_at as string,
      })),
    };
  } catch (error) {
    return {
      success: false,
      ...mapDatabaseError(error, "Skill group"),
    };
  }
};

export const createNativeAdminProject = async (payload: unknown) => {
  const databaseUrl = process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    return null;
  }

  const parsed = parseProjectPayload(payload);

  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(databaseUrl);

    const rows = await sql`
      INSERT INTO projects (
        title,
        slug,
        description,
        live_url,
        github_url,
        image_url,
        image_public_id,
        tech_stack_json,
        featured,
        order_index,
        is_published,
        updated_at
      )
      VALUES (
        ${parsed.title},
        ${parsed.slug},
        ${parsed.description},
        ${parsed.liveUrl ?? null},
        ${parsed.githubUrl ?? null},
        ${parsed.imageUrl ?? null},
        ${parsed.imagePublicId ?? null},
        ${JSON.stringify(parsed.techStack)},
        ${toDbBool(parsed.featured)},
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
      ...mapDatabaseError(error, "Skill group"),
    };
  }
};

export const updateNativeAdminProject = async (id: number, payload: unknown) => {
  const databaseUrl = process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    return null;
  }

  const parsed = parseProjectPayload(payload);

  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(databaseUrl);

    const rows = await sql`
      UPDATE projects
      SET
        title = ${parsed.title},
        slug = ${parsed.slug},
        description = ${parsed.description},
        live_url = ${parsed.liveUrl ?? null},
        github_url = ${parsed.githubUrl ?? null},
        image_url = ${parsed.imageUrl ?? null},
        image_public_id = ${parsed.imagePublicId ?? null},
        tech_stack_json = ${JSON.stringify(parsed.techStack)},
        featured = ${toDbBool(parsed.featured)},
        order_index = ${parsed.orderIndex},
        is_published = ${toDbBool(parsed.isPublished)},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id
    `;

    if (rows.length === 0) {
      return {
        success: false,
        message: "Project not found",
        statusCode: 404,
      };
    }

    return {
      success: true,
      message: "Project updated",
      statusCode: 200,
    };
  } catch (error) {
    return {
      success: false,
      ...mapDatabaseError(error, "Skill group"),
    };
  }
};

export const deleteNativeAdminProject = async (id: number) => {
  const databaseUrl = process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    return null;
  }

  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(databaseUrl);

    const rows = await sql`
      DELETE FROM projects WHERE id = ${id} RETURNING id
    `;

    if (rows.length === 0) {
      return {
        success: false,
        message: "Project not found",
        statusCode: 404,
      };
    }

    return {
      success: true,
      message: "Project deleted",
      statusCode: 200,
    };
  } catch (error) {
    return {
      success: false,
      ...mapDatabaseError(error, "Skill"),
    };
  }
};

export const fetchNativeAdminSkillGroups = async () => {
  const databaseUrl = process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    return null;
  }

  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(databaseUrl);

    const groups = await sql`
      SELECT id, name, order_index, is_published, created_at, updated_at
      FROM skill_groups
      ORDER BY order_index ASC, updated_at DESC
    `;

    const skills = await sql`
      SELECT id, skill_group_id, name, icon_key, order_index, is_published, created_at, updated_at
      FROM skills
      ORDER BY order_index ASC, updated_at DESC
    `;

    const skillRows = skills as Array<Record<string, unknown>>;
    const skillsByGroup = new Map<number, Array<Record<string, unknown>>>();
    for (const skill of skillRows) {
      const groupId = skill.skill_group_id as number;
      const existing = skillsByGroup.get(groupId) || [];
      existing.push(skill);
      skillsByGroup.set(groupId, existing);
    }

    return {
      success: true,
      statusCode: 200,
      data: (groups as Array<Record<string, unknown>>).map((group) => ({
        id: group.id as number,
        name: group.name as string,
        orderIndex: group.order_index as number,
        isPublished: Boolean(group.is_published),
        createdAt: group.created_at as string,
        updatedAt: group.updated_at as string,
        skills: (skillsByGroup.get(group.id as number) || []).map((skill) => ({
          id: skill.id as number,
          skillGroupId: skill.skill_group_id as number,
          name: skill.name as string,
          iconKey: (skill.icon_key as string | null) || null,
          orderIndex: skill.order_index as number,
          isPublished: Boolean(skill.is_published),
          createdAt: skill.created_at as string,
          updatedAt: skill.updated_at as string,
        })),
      })),
    };
  } catch (error) {
    return {
      success: false,
      ...mapDatabaseError(error, "Skill"),
    };
  }
};

export const createNativeAdminSkillGroup = async (payload: unknown) => {
  const databaseUrl = process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    return null;
  }

  const parsed = parseSkillGroupPayload(payload);

  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(databaseUrl);

    const rows = await sql`
      INSERT INTO skill_groups (name, order_index, is_published, updated_at)
      VALUES (${parsed.name}, ${parsed.orderIndex}, ${toDbBool(parsed.isPublished)}, CURRENT_TIMESTAMP)
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
      ...mapDatabaseError(error, "Skill"),
    };
  }
};

export const updateNativeAdminSkillGroup = async (id: number, payload: unknown) => {
  const databaseUrl = process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    return null;
  }

  const parsed = parseSkillGroupPayload(payload);

  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(databaseUrl);

    const rows = await sql`
      UPDATE skill_groups
      SET
        name = ${parsed.name},
        order_index = ${parsed.orderIndex},
        is_published = ${toDbBool(parsed.isPublished)},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id
    `;

    if (rows.length === 0) {
      return {
        success: false,
        message: "Skill group not found",
        statusCode: 404,
      };
    }

    return {
      success: true,
      message: "Skill group updated",
      statusCode: 200,
    };
  } catch (error) {
    return {
      success: false,
      ...mapDatabaseError(error, "Story"),
    };
  }
};

export const deleteNativeAdminSkillGroup = async (id: number) => {
  const databaseUrl = process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    return null;
  }

  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(databaseUrl);

    const rows = await sql`
      DELETE FROM skill_groups WHERE id = ${id} RETURNING id
    `;

    if (rows.length === 0) {
      return {
        success: false,
        message: "Skill group not found",
        statusCode: 404,
      };
    }

    return {
      success: true,
      message: "Skill group deleted",
      statusCode: 200,
    };
  } catch (error) {
    return {
      success: false,
      ...mapDatabaseError(error, "Story"),
    };
  }
};

export const createNativeAdminSkill = async (payload: unknown) => {
  const databaseUrl = process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    return null;
  }

  const parsed = parseSkillPayload(payload);

  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(databaseUrl);

    const groupExists = await sql`
      SELECT id FROM skill_groups WHERE id = ${parsed.skillGroupId} LIMIT 1
    `;

    if (groupExists.length === 0) {
      return {
        success: false,
        message: "Skill group not found",
        statusCode: 404,
      };
    }

    const rows = await sql`
      INSERT INTO skills (skill_group_id, name, icon_key, order_index, is_published, updated_at)
      VALUES (
        ${parsed.skillGroupId},
        ${parsed.name},
        ${parsed.iconKey ?? null},
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
      ...mapDatabaseError(error, "Story"),
    };
  }
};

export const updateNativeAdminSkill = async (id: number, payload: unknown) => {
  const databaseUrl = process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    return null;
  }

  const parsed = parseSkillPayload(payload);

  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(databaseUrl);

    const groupExists = await sql`
      SELECT id FROM skill_groups WHERE id = ${parsed.skillGroupId} LIMIT 1
    `;

    if (groupExists.length === 0) {
      return {
        success: false,
        message: "Skill group not found",
        statusCode: 404,
      };
    }

    const rows = await sql`
      UPDATE skills
      SET
        skill_group_id = ${parsed.skillGroupId},
        name = ${parsed.name},
        icon_key = ${parsed.iconKey ?? null},
        order_index = ${parsed.orderIndex},
        is_published = ${toDbBool(parsed.isPublished)},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id
    `;

    if (rows.length === 0) {
      return {
        success: false,
        message: "Skill not found",
        statusCode: 404,
      };
    }

    return {
      success: true,
      message: "Skill updated",
      statusCode: 200,
    };
  } catch {
    return null;
  }
};

export const deleteNativeAdminSkill = async (id: number) => {
  const databaseUrl = process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    return null;
  }

  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(databaseUrl);

    const rows = await sql`
      DELETE FROM skills WHERE id = ${id} RETURNING id
    `;

    if (rows.length === 0) {
      return {
        success: false,
        message: "Skill not found",
        statusCode: 404,
      };
    }

    return {
      success: true,
      message: "Skill deleted",
      statusCode: 200,
    };
  } catch {
    return null;
  }
};

export const fetchNativeAdminStories = async () => {
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
        date_text,
        location,
        status,
        card_image_url,
        card_image_public_id,
        order_index,
        is_published,
        created_at,
        updated_at
      FROM stories
      ORDER BY order_index ASC, updated_at DESC
    `;

    return {
      success: true,
      statusCode: 200,
      data: (rows as Array<Record<string, unknown>>).map((row) => ({
        id: row.id as number,
        title: row.title as string,
        slug: row.slug as string,
        dateText: (row.date_text as string | null) || null,
        location: (row.location as string | null) || null,
        status: (row.status as string | null) || null,
        cardImageUrl: (row.card_image_url as string | null) || null,
        cardImagePublicId: (row.card_image_public_id as string | null) || null,
        orderIndex: row.order_index as number,
        isPublished: Boolean(row.is_published),
        createdAt: row.created_at as string,
        updatedAt: row.updated_at as string,
      })),
    };
  } catch {
    return null;
  }
};

export const fetchNativeAdminStoryById = async (id: number) => {
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
        team_json,
        order_index,
        is_published,
        created_at,
        updated_at
      FROM stories
      WHERE id = ${id}
      LIMIT 1
    `;

    if (rows.length === 0) {
      return {
        success: false,
        message: "Story not found",
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
        dateText: (row.date_text as string | null) || null,
        location: (row.location as string | null) || null,
        status: (row.status as string | null) || null,
        cardImageUrl: (row.card_image_url as string | null) || null,
        cardImagePublicId: (row.card_image_public_id as string | null) || null,
        images: parseJsonArray<string>((row.images_json as string) || "[]"),
        imagePublicIds: parseJsonArray<string>((row.images_public_ids_json as string) || "[]"),
        contentMarkdown: paragraphsToMarkdown(parseJsonArray<string>((row.description_json as string) || "[]")),
        project: parseJsonObject((row.project_json as string | null) || null),
        outcomes: parseJsonArray<string>((row.outcomes_json as string) || "[]"),
        team: parseJsonObject((row.team_json as string | null) || null),
        orderIndex: row.order_index as number,
        isPublished: Boolean(row.is_published),
        createdAt: row.created_at as string,
        updatedAt: row.updated_at as string,
      },
    };
  } catch {
    return null;
  }
};

export const createNativeAdminStory = async (payload: unknown) => {
  const databaseUrl = process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    return null;
  }

  const parsed = parseStoryPayload(payload);

  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(databaseUrl);

    const rows = await sql`
      INSERT INTO stories (
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
        team_json,
        order_index,
        is_published,
        updated_at
      )
      VALUES (
        ${parsed.title},
        ${parsed.slug},
        ${parsed.dateText ?? null},
        ${parsed.location ?? null},
        ${parsed.status ?? null},
        ${parsed.cardImageUrl ?? null},
        ${parsed.cardImagePublicId ?? null},
        ${JSON.stringify(parsed.images)},
        ${JSON.stringify(parsed.imagePublicIds)},
        ${JSON.stringify(markdownToParagraphs(parsed.contentMarkdown))},
        ${parsed.project ? JSON.stringify(parsed.project) : null},
        ${JSON.stringify(parsed.outcomes)},
        ${parsed.team ? JSON.stringify(parsed.team) : null},
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
  } catch {
    return null;
  }
};

export const updateNativeAdminStory = async (id: number, payload: unknown) => {
  const databaseUrl = process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    return null;
  }

  const parsed = parseStoryPayload(payload);

  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(databaseUrl);

    const rows = await sql`
      UPDATE stories
      SET
        title = ${parsed.title},
        slug = ${parsed.slug},
        date_text = ${parsed.dateText ?? null},
        location = ${parsed.location ?? null},
        status = ${parsed.status ?? null},
        card_image_url = ${parsed.cardImageUrl ?? null},
        card_image_public_id = ${parsed.cardImagePublicId ?? null},
        images_json = ${JSON.stringify(parsed.images)},
        images_public_ids_json = ${JSON.stringify(parsed.imagePublicIds)},
        description_json = ${JSON.stringify(markdownToParagraphs(parsed.contentMarkdown))},
        project_json = ${parsed.project ? JSON.stringify(parsed.project) : null},
        outcomes_json = ${JSON.stringify(parsed.outcomes)},
        team_json = ${parsed.team ? JSON.stringify(parsed.team) : null},
        order_index = ${parsed.orderIndex},
        is_published = ${toDbBool(parsed.isPublished)},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id
    `;

    if (rows.length === 0) {
      return {
        success: false,
        message: "Story not found",
        statusCode: 404,
      };
    }

    return {
      success: true,
      message: "Story updated",
      statusCode: 200,
    };
  } catch {
    return null;
  }
};

export const deleteNativeAdminStory = async (id: number) => {
  const databaseUrl = process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    return null;
  }

  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(databaseUrl);

    const rows = await sql`
      DELETE FROM stories WHERE id = ${id} RETURNING id
    `;

    if (rows.length === 0) {
      return {
        success: false,
        message: "Story not found",
        statusCode: 404,
      };
    }

    return {
      success: true,
      message: "Story deleted",
      statusCode: 200,
    };
  } catch {
    return null;
  }
};

export const fetchNativeHomeSnapshot = async (): Promise<HomePayload | null> => {
  const databaseUrl = process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    return null;
  }

  try {
    const { fetchNativePublicHome } = await import("./public-home");
    return await fetchNativePublicHome();
  } catch {
    return null;
  }
};
