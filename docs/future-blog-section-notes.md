# Future Work: Blog Section

Status: parked for later implementation.

## Decision

- Keep `Stories` and `Blog` as separate sections.
- `Stories` will stay for personal/professional journey and project narratives.
- `Blog` will be for technical writing (tutorials, engineering notes, architecture insights).

## Content Strategy

- Publish full posts on portfolio first (owned content + SEO).
- Publish short teaser posts on X/Twitter and LinkedIn.
- Link social posts back to the portfolio blog article.

## Suggested Implementation Scope (Later)

1. Add a new `/blog` list page.
2. Add `/blog/[slug]` detail page with SEO metadata.
3. Add admin CRUD for blog posts (title, slug, summary, contentMarkdown, tags, isPublished, cover image).
4. Keep blog schema separate from stories schema.
5. Add social share links on blog detail page.

## Why Separate from Stories

- Clearer IA for visitors.
- Better SEO targeting for technical keywords.
- Cleaner analytics split between storytelling and technical content.
