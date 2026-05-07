import { neon } from "@neondatabase/serverless";
import * as fs from "fs";

async function seedBlogPost() {
  const databaseUrl = process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    console.error("NEON_DATABASE_URL is not set");
    process.exit(1);
  }

  const sql = neon(databaseUrl);

  const content = fs.readFileSync("/home/yugal1107/WebD/Movie-Recommendation-System/docker-blog.md", "utf-8");

  const title = "Shrinking a Python ML Docker Image by 60% with uv and Multi-Stage Builds";
  const slug = "shrinking-python-ml-docker-image-uv-multi-stage";
  const summary = "How I overhauled my FastAPI containerization strategy, migrated to Astral's uv, and reduced a 1.56 GB Docker image down to 656 MB using multi-stage builds and cache mounts.";
  const tags = ["Docker", "Python", "FastAPI", "Machine Learning", "DevOps", "uv"];

  try {
    const rows = await sql`
      INSERT INTO blog_posts (
        title,
        slug,
        summary,
        content_markdown,
        tags_json,
        is_published,
        order_index,
        updated_at
      )
      VALUES (
        ${title},
        ${slug},
        ${summary},
        ${content},
        ${JSON.stringify(tags)},
        1,
        0,
        CURRENT_TIMESTAMP
      )
      RETURNING id
    `;

    console.log(`Blog post inserted successfully with id: ${(rows[0] as Record<string, unknown>).id}`);
  } catch (error) {
    console.error("Failed to insert blog post:", error);
    process.exit(1);
  }
}

seedBlogPost();
