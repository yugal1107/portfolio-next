import { neon } from "@neondatabase/serverless";

async function createBlogTable() {
  const databaseUrl = process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    console.error("NEON_DATABASE_URL is not set");
    process.exit(1);
  }

  const sql = neon(databaseUrl);

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        summary TEXT,
        content_markdown TEXT,
        tags_json JSONB DEFAULT '[]',
        cover_image_url VARCHAR(255),
        cover_image_public_id VARCHAR(255),
        is_published SMALLINT DEFAULT 0,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("Table 'blog_posts' created successfully");
  } catch (error) {
    console.error("Failed to create table:", error);
    process.exit(1);
  }
}

createBlogTable();
