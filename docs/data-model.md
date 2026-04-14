# Data Model

This document describes the current Neon/PostgreSQL data model used by `portfolio-next`.

Authoritative schema source: `portfolio-backend/src/migration/neon-schema.sql`.

## Tables

### `migrations`

- `id` text primary key
- `executed_at` text timestamp

### `site_settings` (singleton)

- `id` integer primary key with check `id = 1`
- profile fields: `full_name`, `title`, `bio`, `location`, `email`
- social fields: `github_url`, `linkedin_url`, `twitter_url`, `instagram_url`
- assets: `resume_url`, `profile_image_url`, `profile_image_public_id`
- `updated_at`

### `projects`

- `id` serial primary key
- `title`, `slug` (unique), `description`
- links/assets: `live_url`, `github_url`, `image_url`, `image_public_id`
- `tech_stack_json` (JSON string array)
- flags/sorting: `featured`, `order_index`, `is_published`
- `created_at`, `updated_at`

Index: `idx_projects_order(order_index, id)`.

### `skill_groups`

- `id` serial primary key
- `name` unique
- `order_index`, `is_published`
- `created_at`, `updated_at`

### `skills`

- `id` serial primary key
- `skill_group_id` foreign key -> `skill_groups(id)` with cascade delete
- `name`, `icon_key`
- `order_index`, `is_published`
- `created_at`, `updated_at`

Index: `idx_skills_group_order(skill_group_id, order_index, id)`.

### `stories`

- `id` serial primary key
- `title`, `slug` (unique)
- metadata: `date_text`, `location`, `status`
- assets: `card_image_url`, `card_image_public_id`
- JSON text columns:
  - `images_json`
  - `images_public_ids_json`
  - `description_json`
  - `project_json`
  - `outcomes_json`
  - `team_json`
- `order_index`, `is_published`
- `created_at`, `updated_at`

Index: `idx_stories_order(order_index, id)`.

### `contact_messages`

- `id` serial primary key
- `name`, `email`, `message`
- `status` (`new`, `read`, `archived` in app validation)
- `created_at`

Indexes:

- `idx_contact_messages_created_at(created_at desc, id desc)`
- `idx_contact_messages_status(status)`

## Application Conventions

## Publish Control

- Public API only returns rows where `is_published = 1` for projects/skills/stories.
- Admin API reads/writes both published and unpublished rows.

## Slug Rules

- `projects.slug` and `stories.slug` follow lowercase kebab-case.
- Enforced in app validation by regex: `^[a-z0-9]+(?:-[a-z0-9]+)*$`.

## JSON-in-Text Fields

The app stores complex arrays/objects as JSON strings in text columns.

- Projects: `tech_stack_json`
- Stories: `images_json`, `images_public_ids_json`, `description_json`, `project_json`, `outcomes_json`, `team_json`

Notes:

- Story markdown is converted to paragraph array and stored in `description_json`.
- On read, paragraph arrays are joined into `contentMarkdown`.

## Boolean Representation

- Database stores boolean-like flags as integers (`0`/`1`).
- App maps to true/false in API responses.

## Cloudinary Fields

Each content type can hold both a direct URL and Cloudinary public ID.

- `site_settings.profile_image_url` + `profile_image_public_id`
- `projects.image_url` + `image_public_id`
- `stories.card_image_url` + `card_image_public_id`
- `stories.images_public_ids_json` for gallery images

## Key Validation Rules (App Layer)

- IDs must be positive integers.
- Contact message status must be one of `new | read | archived`.
- Contact payload requires valid email and minimum message length.
- Admin auth routes require env configuration for username/hash/JWT secret.
