# Growth Projections (Months 1-6)

This sheet provides three forecast scenarios (`base`, `best`, `aggressive`) for 43 Industries and ties each month to delivery phases.

## Assumptions

- Month 1 starts when the core community loop (auth + thread/comment create/read) is stable in production.
- Product and content cadence is at least one visible improvement per week.
- Marketing traffic is predominantly organic in the first 90 days.
- The weekly challenge loop begins in Month 5 as part of Phase D.
- Library-to-community cross-linking begins in Month 3 (Phase C).
- Metrics are computed using definitions in `docs/kpi-glossary.md`.

## Phase Mapping

- Month 1: Phase A/B stabilization
- Month 2: Phase B hardening
- Month 3: Phase C rollout
- Month 4: Phase C optimization
- Month 5: Phase D launch
- Month 6: Phase D tuning and Phase E prep

## Base Scenario Targets

| Metric | M1 | M2 | M3 | M4 | M5 | M6 |
|---|---:|---:|---:|---:|---:|---:|
| `newMembers` | 50 | 90 | 140 | 190 | 260 | 340 |
| `activationRate` | 35% | 38% | 40% | 42% | 45% | 48% |
| `week1Retention` | 22% | 24% | 26% | 28% | 31% | 34% |
| `MAU` | 40 | 75 | 120 | 175 | 250 | 350 |
| `WAUtoMAURatio` | 45% | 47% | 50% | 53% | 58% | 62% |
| `postsPerWeek` | 8 | 15 | 24 | 34 | 48 | 66 |
| `commentsPerWeek` | 20 | 36 | 58 | 84 | 122 | 170 |
| `libraryEntriesPublished` | 0 | 2 | 6 | 10 | 14 | 18 |

## Scenario Conversion Rules

Use the base targets as a source of truth, then derive `best` and `aggressive` values with the formulas below.

### Best

- `newMembers_best = ROUND(newMembers_base * 1.35)`
- `MAU_best = ROUND(MAU_base * 1.30)`
- `postsPerWeek_best = ROUND(postsPerWeek_base * 1.40)`
- `commentsPerWeek_best = ROUND(commentsPerWeek_base * 1.40)`
- `week1Retention_best = week1Retention_base + 4 to 7 percentage points`

### Aggressive

- `newMembers_aggressive = ROUND(newMembers_base * 1.65)`
- `MAU_aggressive = ROUND(MAU_base * 1.60)`
- `postsPerWeek_aggressive = ROUND(postsPerWeek_base * 1.75)`
- `commentsPerWeek_aggressive = ROUND(commentsPerWeek_base * 1.75)`
- `week1Retention_aggressive = week1Retention_base + 8 to 12 percentage points`

## Best and Aggressive Snapshot (Reference)

Retention is shown as a range because uplift is defined as a band.

| Metric | M1 | M2 | M3 | M4 | M5 | M6 |
|---|---:|---:|---:|---:|---:|---:|
| `newMembers_best` | 68 | 122 | 189 | 257 | 351 | 459 |
| `newMembers_aggressive` | 83 | 149 | 231 | 314 | 429 | 561 |
| `MAU_best` | 52 | 98 | 156 | 228 | 325 | 455 |
| `MAU_aggressive` | 64 | 120 | 192 | 280 | 400 | 560 |
| `postsPerWeek_best` | 11 | 21 | 34 | 48 | 67 | 92 |
| `postsPerWeek_aggressive` | 14 | 26 | 42 | 60 | 84 | 116 |
| `commentsPerWeek_best` | 28 | 50 | 81 | 118 | 171 | 238 |
| `commentsPerWeek_aggressive` | 35 | 63 | 102 | 147 | 214 | 298 |
| `week1Retention_best` | 26%-29% | 28%-31% | 30%-33% | 32%-35% | 35%-38% | 38%-41% |
| `week1Retention_aggressive` | 30%-34% | 32%-36% | 34%-38% | 36%-40% | 39%-43% | 42%-46% |

## Instrumentation Map

| Event | Description | Primary metrics fed |
|---|---|---|
| `signup_complete` | Account creation successfully completed | `newMembers`, `signupRate` |
| `thread_created` | Member creates a new thread | `activationRate`, `postsPerWeek`, `weeklyPostAuthors`, `MAU`, `WAU` |
| `comment_created` | Member posts a comment | `activationRate`, `commentsPerWeek`, `weeklyCommentAuthors`, `MAU`, `WAU` |
| `challenge_completed` | Weekly challenge marked complete server-side | `activationRate`, `MAU`, `WAU`, retention metrics |
| `library_entry_viewed` | Member opens a library entry page | content funnel diagnostics |
| `discuss_click` | Member clicks discuss entry point from a library entry | `entryToDiscussionRate`, cross-surface conversion |
| `library_reflection_submitted` | Member submits read-and-reflect prompt | `activationRate`, retention, quality participation |

## Variance Tracking Template

Track this monthly for each scenario and KPI:

| Month | Metric | Scenario | Plan | Actual | Delta | DeltaPercent |
|---|---|---|---:|---:|---:|---:|
| M1 | `newMembers` | base | 50 | 0 | -50 | -100% |

Formulas:

- `Delta = Actual - Plan`
- `DeltaPercent = (Actual - Plan) / Plan`

## Review Cadence and Re-baseline Triggers

- Weekly:
  - Compare trailing 7-day values for `activationRate`, `week1Retention`, `postsPerWeek`, and `commentsPerWeek` against plan.
  - Identify one product action and one growth action for the next week.
- Monthly:
  - Use trailing 4-week averages to refresh months `N+1` to `N+3`.
  - Recompute `best` and `aggressive` from updated base rather than editing multipliers.
- Re-baseline rule:
  - Re-baseline if any two core KPIs miss target by more than 20% for two consecutive weeks.
  - Core KPIs: `newMembers`, `activationRate`, `week1Retention`, `postsPerWeek`, `commentsPerWeek`.
