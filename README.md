# Portfolio Next

`portfolio-next` is the unified Next.js full-stack version of the portfolio project.

It includes:

- public portfolio pages
- admin auth and content management APIs
- Neon PostgreSQL integration
- Cloudinary uploads

This app is now independent from the old Express backend runtime.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Neon Postgres (`@neondatabase/serverless`)
- JWT + HTTP-only cookie auth
- Cloudinary for media uploads
- Vitest + Testing Library

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Create env file from `.env.example` and fill required values.

3. Run dev server:

```bash
npm run dev
```

4. Open:

- `http://localhost:3000/`
- admin UI at `http://localhost:3000/admin`

## Required Environment Variables

From `.env.example`:

- `NEON_DATABASE_URL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD_HASH`
- `JWT_SECRET`
- `AUTH_COOKIE_NAME`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`

## Scripts

- `npm run dev` - start local dev server
- `npm run build` - production build
- `npm run start` - run built app
- `npm run lint` - lint checks
- `npm test` - run test suite

## Documentation

- API reference: `docs/api-reference.md`
- Data model: `docs/data-model.md`
- Admin workflows: `docs/admin-workflows.md`

## Notes

- Public visibility is controlled by `is_published` fields in DB.
- Slugs are lowercase kebab-case.
- Story markdown is stored in DB as paragraph JSON and reconstructed on read.
- Cloudinary public IDs are stored alongside URLs where available.
