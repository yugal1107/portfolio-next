# API Reference

This document describes the current HTTP API exposed by `portfolio-next` under `app/api`.

Base URL in local dev: `http://localhost:3000`

## Response Envelope

Most routes return JSON in one of these shapes:

```json
{ "success": true, "data": { } }
```

```json
{ "success": true, "message": "..." }
```

```json
{ "success": false, "message": "..." }
```

## Auth Model

- Admin auth uses a signed JWT in an HTTP-only cookie.
- Cookie name comes from `AUTH_COOKIE_NAME` (default `portfolio_admin_token`).
- Login issues cookie; logout clears cookie.
- Protected admin routes return `401` if cookie is missing/invalid.

## Public Endpoints

### `GET /api/public/home`

- Purpose: return complete homepage payload.
- Success: `200`
- Failure: `503` with `"Public home data unavailable"`

Success data:

- `settings`: nullable site profile object
- `projects`: published projects
- `skillGroups`: published groups with published skills

### `GET /api/public/stories`

- Purpose: list published story cards.
- Success: `200`
- Failure: `503` with `"Public stories data unavailable"`

### `GET /api/public/stories/:slug`

- Purpose: fetch one published story detail.
- Success: `200`
- Not found: `404` with `"Story not found"`

### `POST /api/public/contact`

- Purpose: create contact message.
- Body:
  - `name` string, min 2, max 120
  - `email` valid email, max 254
  - `message` string, min 10, max 4000
  - `website` optional honeypot; must be empty if present
- Success: `201` with `"Message sent successfully"`
- Validation error: `400` with `"Invalid contact payload"`
- DB unavailable/error: `503`

## Admin Auth Endpoints

### `POST /api/admin/login`

- Purpose: authenticate admin and set session cookie.
- Body: `{ "username": string, "password": string }`
- Success: `200` with cookie + `"Login successful"`
- Invalid credentials: `401`
- Invalid payload: `400`
- Missing auth env config: `503`

### `POST /api/admin/logout`

- Purpose: clear session cookie.
- Success: `200` with `"Logout successful"`
- Unexpected error: `500`

### `GET /api/admin/me`

- Purpose: verify current admin session.
- Success: `200`

```json
{
  "success": true,
  "data": { "username": "admin", "role": "admin" }
}
```

- Unauthorized: `401`
- Missing auth env config: `503`

## Admin Content Endpoints

All routes below require valid admin cookie.

### Settings

- `GET /api/admin/content/settings`
- `PATCH /api/admin/content/settings`

PATCH accepts partial settings fields (`fullName`, `title`, `bio`, social links, image fields).

Common statuses: `200`, `400`, `401`, `404`, `500`.

### Projects

- `GET /api/admin/content/projects`
- `POST /api/admin/content/projects`
- `PUT /api/admin/content/projects/:id`
- `DELETE /api/admin/content/projects/:id`

Project payload fields:

- `title`, `slug`, `description`
- `liveUrl`, `githubUrl`, `imageUrl`, `imagePublicId` (nullable)
- `techStack` (string[])
- `featured` (boolean)
- `orderIndex` (number >= 0)
- `isPublished` (boolean)

Common statuses: `200`, `201`, `400`, `401`, `404`, `409`, `500`.

### Skill Groups

- `GET /api/admin/content/skill-groups`
- `POST /api/admin/content/skill-groups`
- `PUT /api/admin/content/skill-groups/:id`
- `DELETE /api/admin/content/skill-groups/:id`

Skill group payload:

- `name`
- `orderIndex`
- `isPublished`

Common statuses: `200`, `201`, `400`, `401`, `404`, `409`, `500`.

### Skills

- `POST /api/admin/content/skills`
- `PUT /api/admin/content/skills/:id`
- `DELETE /api/admin/content/skills/:id`

Skill payload:

- `skillGroupId`
- `name`
- `iconKey` (nullable)
- `orderIndex`
- `isPublished`

Common statuses: `200`, `201`, `400`, `401`, `404`, `500`.

### Stories

- `GET /api/admin/content/stories`
- `POST /api/admin/content/stories`
- `GET /api/admin/content/stories/:id`
- `PUT /api/admin/content/stories/:id`
- `DELETE /api/admin/content/stories/:id`

Story payload:

- `title`, `slug`
- `dateText`, `location`, `status` (nullable)
- `cardImageUrl`, `cardImagePublicId` (nullable)
- `images` (string[])
- `imagePublicIds` (string[])
- `contentMarkdown` (string)
- `project` (object or null)
- `outcomes` (string[])
- `team` (object or null)
- `orderIndex`
- `isPublished`

Common statuses: `200`, `201`, `400`, `401`, `404`, `500`.

### Contact Messages (Admin Inbox)

- `GET /api/admin/content/contact-messages`
- `PUT /api/admin/content/contact-messages/:id/status`
- `DELETE /api/admin/content/contact-messages/:id`

Status update payload:

- `status`: one of `new`, `read`, `archived`

Common statuses: `200`, `400`, `401`, `404`, `503`.

## Upload Endpoint

### `POST /api/admin/upload/file`

- Purpose: upload file to Cloudinary.
- Auth: admin cookie required.
- Content type: `multipart/form-data`
- Form fields:
  - `file` (required)
  - `folder` (optional, defaults `portfolio`)
  - `publicIdPrefix` (optional, defaults `asset`)
  - `format` (optional)

Success (`201`) data:

- `url`
- `optimizedUrl`
- `publicId`
- `resourceType`
- `format`
- `bytes`
- `originalFilename`

Errors:

- `400`: no file / file too large (> 8 MB)
- `401`: unauthorized
- `500`: upload service unavailable
