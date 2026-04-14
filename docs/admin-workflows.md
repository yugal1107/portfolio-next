# Admin Workflows

This file documents day-to-day admin workflows for `portfolio-next`.

## 1) Login and Session

### Login

1. Client submits `POST /api/admin/login` with `username` and `password`.
2. API validates payload.
3. Credentials are checked against env config:
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD_HASH` (bcrypt)
4. On success, API sets JWT cookie (`AUTH_COOKIE_NAME`) and returns `200`.

Failure paths:

- `400` invalid payload
- `401` invalid credentials
- `503` auth env missing

### Session Check

Client calls `GET /api/admin/me` to verify auth state.

- `200` -> authenticated admin info
- `401` -> cookie missing/invalid
- `503` -> auth env missing

### Logout

Client calls `POST /api/admin/logout`.

- API clears cookie with `Max-Age=0`
- returns `200` on success

## 2) Settings Management

Endpoints:

- `GET /api/admin/content/settings`
- `PATCH /api/admin/content/settings`

Workflow:

1. Fetch current settings.
2. Submit partial patch payload with only fields to update.
3. Backend validates payload (at least one field required).
4. Returns success message on update.

Common failures: `400` invalid payload, `401` unauthorized.

## 3) Project Management

Endpoints:

- `GET /api/admin/content/projects`
- `POST /api/admin/content/projects`
- `PUT /api/admin/content/projects/:id`
- `DELETE /api/admin/content/projects/:id`

Typical create/update flow:

1. (Optional) upload image via admin upload endpoint.
2. Save `imageUrl` and/or `imagePublicId` with project payload.
3. Set `isPublished` to control public visibility.
4. Set `orderIndex` for display order.

Common failures:

- `400` invalid payload/id
- `404` record not found
- `409` duplicate slug/unique conflict
- `401` unauthorized

## 4) Skill Group and Skill Management

### Skill Groups

- `GET /api/admin/content/skill-groups`
- `POST /api/admin/content/skill-groups`
- `PUT /api/admin/content/skill-groups/:id`
- `DELETE /api/admin/content/skill-groups/:id`

### Skills

- `POST /api/admin/content/skills`
- `PUT /api/admin/content/skills/:id`
- `DELETE /api/admin/content/skills/:id`

Workflow notes:

1. Create group first.
2. Create skills with `skillGroupId`.
3. Use `orderIndex` and `isPublished` for ordering and visibility.
4. Deleting a skill group cascades and deletes child skills.

## 5) Story Management

Endpoints:

- `GET /api/admin/content/stories`
- `POST /api/admin/content/stories`
- `GET /api/admin/content/stories/:id`
- `PUT /api/admin/content/stories/:id`
- `DELETE /api/admin/content/stories/:id`

Workflow:

1. Upload card/gallery images as needed.
2. Prepare story payload including:
   - `title`, `slug`, metadata
   - `images`, `imagePublicIds`
   - `contentMarkdown`
   - optional `project` and `team` objects
3. Save story.

Storage behavior:

- Markdown is converted to paragraph JSON for DB storage.
- On retrieval, paragraph JSON is converted back to markdown string.

## 6) Admin File Upload

Endpoint: `POST /api/admin/upload/file`

Request: `multipart/form-data`

- required `file`
- optional `folder`, `publicIdPrefix`, `format`

Rules:

- max file size: 8 MB
- requires admin auth
- requires Cloudinary env variables

Success response includes:

- `url`, `optimizedUrl`, `publicId`, `resourceType`, `format`, `bytes`

## 7) Contact Inbox Workflow

Endpoints:

- `GET /api/admin/content/contact-messages`
- `PUT /api/admin/content/contact-messages/:id/status`
- `DELETE /api/admin/content/contact-messages/:id`

Typical handling:

1. Fetch newest messages first.
2. Move message status `new -> read -> archived`.
3. Delete spam/irrelevant messages.

Validation:

- ID must be positive integer.
- Status must be one of `new`, `read`, `archived`.
