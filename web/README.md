# 43 Industries Web

Phase A scaffold for the 43 Industries community platform:

- Next.js App Router + TypeScript
- Tailwind CSS v4
- Prisma + PostgreSQL baseline
- Marketing landing page with sign-up CTAs and data-ready teaser hooks

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Create your local environment file:

```bash
cp .env.example .env
```

3. Generate Prisma client:

```bash
npm run prisma:generate
```

4. Run the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` - start development server
- `npm run build` - production build
- `npm run start` - run production server
- `npm run lint` - run ESLint
- `npm run lint:fix` - fix lint issues
- `npm run format` - write Prettier formatting
- `npm run format:check` - verify formatting only
- `npm run prisma:generate` - generate Prisma client
- `npm run prisma:migrate` - create/apply development migration
- `npm run prisma:studio` - launch Prisma Studio

## Environment

Required:

- `DATABASE_URL` - Postgres connection string used by Prisma.

See `.env.example` for local defaults.

## Notes

The current game layer is intentionally a meta-progression concept (challenges/points),
not a standalone game engine.
# 43 Industries — community platform (Phase A)

Greenfield scaffold for the four-layer community described in the product plan:
marketing surface, authenticated participation, lightweight progression, and a
research hub. The “game” layer is intentionally a **meta-game** (badges, seasons,
challenges) validated on the server—not a standalone engine.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- PostgreSQL + Prisma (schema committed; client generation happens when you add `DATABASE_URL`)

## Run locally

```bash
npm install
npm run dev
```

If you use pnpm:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

Target [Vercel](https://vercel.com) with managed Postgres (Neon or Supabase) when the
data layer is connected.

## Layout

- `app/(marketing)` — public landing, legal placeholders, join/login stubs
- `app/(app)` — reserved member surfaces: `/dashboard`, `/community`, `/library`
- `components/live-signals.tsx` — homepage hooks for featured thread, library item, challenge
- `content/library/` — MDX or MD will land here in Phase C
- `prisma/schema.prisma` — minimal relational model for users, posts, library, progress

## Roadmap gates

1. **Phase A** — Skeleton (this commit): routes, placeholders, README
2. **Phase B** — Auth + community core
3. **Phase C** — Library MDX + search
4. **Phase D** — Weekly challenge loop + server validation
5. **Phase E** — Moderation polish, analytics, performance

## Note on OneDrive

If `npm install` warns with `TAR_ENTRY_ERROR`, pause OneDrive sync for the repo or move
the project to a non-synced path, then reinstall dependencies.
