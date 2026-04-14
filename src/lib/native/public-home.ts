import type { HomePayload } from "@/types/content";

type SettingsRow = {
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
};

type ProjectRow = {
  id: number;
  title: string;
  slug: string;
  description: string;
  live_url: string | null;
  github_url: string | null;
  image_url: string | null;
  image_public_id: string | null;
  tech_stack_json: string;
  featured: number;
  order_index: number;
};

type SkillGroupRow = {
  id: number;
  name: string;
  order_index: number;
};

type SkillRow = {
  id: number;
  skill_group_id: number;
  name: string;
  icon_key: string | null;
  order_index: number;
};

const parseJsonArray = <T>(value: string): T[] => {
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
};

export const mapHomePayload = ({
  settingsRow,
  projectRows,
  skillGroupRows,
  skillRows,
}: {
  settingsRow: SettingsRow | null;
  projectRows: ProjectRow[];
  skillGroupRows: SkillGroupRow[];
  skillRows: SkillRow[];
}): HomePayload => {
  const skillsByGroup = new Map<number, SkillRow[]>();

  for (const skill of skillRows) {
    const existing = skillsByGroup.get(skill.skill_group_id) || [];
    existing.push(skill);
    skillsByGroup.set(skill.skill_group_id, existing);
  }

  return {
    settings: settingsRow
      ? {
          fullName: settingsRow.full_name,
          title: settingsRow.title,
          bio: settingsRow.bio,
          location: settingsRow.location,
          email: settingsRow.email,
          githubUrl: settingsRow.github_url,
          linkedinUrl: settingsRow.linkedin_url,
          twitterUrl: settingsRow.twitter_url,
          instagramUrl: settingsRow.instagram_url,
          resumeUrl: settingsRow.resume_url,
          profileImageUrl: settingsRow.profile_image_url,
          profileImagePublicId: settingsRow.profile_image_public_id,
        }
      : null,
    projects: projectRows.map((project) => ({
      id: project.id,
      title: project.title,
      slug: project.slug,
      description: project.description,
      liveUrl: project.live_url,
      githubUrl: project.github_url,
      imageUrl: project.image_url,
      imagePublicId: project.image_public_id,
      techStack: parseJsonArray<string>(project.tech_stack_json),
      featured: Boolean(project.featured),
      orderIndex: project.order_index,
    })),
    skillGroups: skillGroupRows.map((group) => ({
      id: group.id,
      name: group.name,
      orderIndex: group.order_index,
      skills: (skillsByGroup.get(group.id) || []).map((skill) => ({
        id: skill.id,
        name: skill.name,
        iconKey: skill.icon_key,
        orderIndex: skill.order_index,
      })),
    })),
  };
};

export const fetchNativePublicHome = async (): Promise<HomePayload | null> => {
  const databaseUrl = process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    return null;
  }

  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(databaseUrl);

    const settingsRows = await sql`
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
        profile_image_public_id
      FROM site_settings
      WHERE id = 1
      LIMIT 1
    `;

    const projectRows = await sql`
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
        order_index
      FROM projects
      WHERE is_published = 1
      ORDER BY order_index ASC, updated_at DESC
    `;

    const skillGroupRows = await sql`
      SELECT id, name, order_index
      FROM skill_groups
      WHERE is_published = 1
      ORDER BY order_index ASC, updated_at DESC
    `;

    const skillRows = await sql`
      SELECT id, skill_group_id, name, icon_key, order_index
      FROM skills
      WHERE is_published = 1
      ORDER BY order_index ASC, updated_at DESC
    `;

    return mapHomePayload({
      settingsRow: (settingsRows[0] as SettingsRow | undefined) || null,
      projectRows: projectRows as ProjectRow[],
      skillGroupRows: skillGroupRows as SkillGroupRow[],
      skillRows: skillRows as SkillRow[],
    });
  } catch {
    return null;
  }
};
