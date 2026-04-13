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

### Auth setup (Phase B)

This project uses Clerk for the fastest MVP auth path.

1. Create a Clerk application.
2. Copy `.env.example` to `.env.local`.
3. Set `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, and `DATABASE_URL`.
4. (Optional AI drafting) set `ANTHROPIC_API_KEY` for Claude-powered draft assist in community posting.
5. Generate Prisma client:

```bash
npm run prisma:generate
```

6. Run migrations:

```bash
npm run prisma:migrate:deploy
```

7. (Optional local data) seed example content:

```bash
npm run prisma:seed
```

8. Restart `npm run dev`.

### 43 rewards integration

The XRPL rewards engine is integrated in-repo under `services/rewards-api` and exposed through Next API routes:

- `GET /api/rewards/actions`
- `POST /api/rewards/issue` (authenticated user required)
- `GET /api/rewards/wallet/:address/trustline`

Set these environment variables before enabling rewards calls:

- `XRPL_NODE`
- `DISTRIBUTOR_ADDRESS`
- `DISTRIBUTOR_SECRET`
- `ISSUER_ADDRESS`
- `ISSUER_SECRET`
- `CURRENCY_CODE` (use `43`)
- `API_SECRET` (used by standalone rewards server mode)
- `REWARDS_API_PORT` (optional; standalone rewards server mode)

Standalone scripts are available if you want to run the rewards service directly:

```bash
npm run rewards:api
npm run rewards:issue-token
npm run rewards:blackhole-issuer
```

### Claude integration

Claude is connected through a secure server endpoint at `app/api/ai/claude/route.ts`.

- Dependency: `@anthropic-ai/sdk`
- Env key: `ANTHROPIC_API_KEY` (server-side only; do not expose client-side)
- UI integration: `Draft with Claude` actions in `components/thread-composer.tsx`
  - Thread drafting from current thread body context
  - Comment drafting from current comment draft + thread context

### Seed the faction world (optional, recommended)

After schema push, seed starter world data:

```bash
npm run prisma:seed
```

This creates starter clans, sub-clans, leadership terms, an active season, clan challenges, and a sample open election.

## Deploy

Target [Vercel](https://vercel.com) with managed Postgres (Neon or Supabase) when the
data layer is connected.

### Deploy smoke test checklist

Run this before promoting a new deploy:

1. `npm run lint`
2. `npm run typecheck`
3. `npm run test`
4. `npm run build`
5. `npm run prisma:migrate:deploy` and `npm run prisma:seed`
6. Visit `/`, `/community`, `/library`, `/onboarding`, and `/moderation`
7. Publish a thread, like it, and add a comment
8. Open a library entry and click **Discuss this entry** to create or reuse its discussion thread
9. Confirm challenge/onboarding toggles still persist and refresh correctly
10. Verify `GET /api/rewards/actions` responds with actions and tiers
11. Verify `GET /api/rewards/wallet/:address/trustline` returns a boolean
12. Verify `GET /api/health` returns `status: ok`
13. Verify `GET /api/ready` returns `status: ready` in production env

## CI

GitHub Actions workflow: `.github/workflows/ci.yml`

- install deps
- prisma generate
- lint + typecheck + tests
- production build

## Layout

- `app/(marketing)` — public landing, legal placeholders, join/login stubs
- `app/(app)` — member surfaces: `/dashboard`, `/community`, `/library`, `/clans`, `/seasons`, `/leaderboard`
- `app/(marketing)/factions` — public clan world map and read-only faction profiles
- `app/(marketing)/plans` — public roadmap and projections pages
- `components/live-signals.tsx` — homepage hooks for featured thread, library item, challenge
- `content/library/` — MDX or MD will land here in Phase C
- `prisma/schema.prisma` — minimal relational model for users, posts, library, progress

## Roadmap gates

1. **Phase A** — Skeleton: routes, placeholders, README
2. **Phase B** — Clerk auth, protected member routes, Prisma-backed threads/comments, cursor pagination, and basic rate limits
3. **Phase C** — Library MDX + search
4. **Phase D** — Weekly challenge loop + server validation
5. **Phase E** — Moderation polish, analytics, performance

## Growth planning docs

- `docs/growth-projections.md` — base/best/aggressive monthly projections, scenario formulas, instrumentation map, and variance tracking template
- `docs/kpi-glossary.md` — KPI definitions and formulas used by the projection sheet

## Note on OneDrive

If `npm install` warns with `TAR_ENTRY_ERROR`, pause OneDrive sync for the repo or move
the project to a non-synced path, then reinstall dependencies.

If a leftover `web/node_modules` folder exists from the initial scaffold path, close any
running Node processes and delete `web/` manually—everything now lives at the repository
root.

## Launch Validation (Smoke Check)

Run baseline checks:

```bash
powershell -ExecutionPolicy Bypass -File scripts/smoke-check.ps1 -SkipDevServer
```

Then run the app:

```bash
npm run dev
```

To run smoke check and dev server together in one terminal:

```bash
powershell -ExecutionPolicy Bypass -File scripts/smoke-check.ps1
```

## Release command

Use the production release script:

```bash
npm run release
```

Optional flags:

```bash
powershell -ExecutionPolicy Bypass -File scripts/release.ps1 -SkipChecks
powershell -ExecutionPolicy Bypass -File scripts/release.ps1 -SkipDeploy
```
