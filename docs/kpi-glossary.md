# KPI Glossary

This glossary defines the metrics used in `docs/growth-projections.md`.

## Acquisition

- `siteVisitors`
  - **Definition:** Unique visitors to the public site in a calendar month.
  - **Formula:** Count of distinct anonymous/session IDs with at least one `page_view` on marketing routes.
- `signupRate`
  - **Definition:** Share of site visitors that complete sign-up in the same month.
  - **Formula:** `newMembers / siteVisitors`
- `newMembers`
  - **Definition:** New accounts created in the month.
  - **Formula:** Count of `signup_complete` events in month.

## Activation and Retention

- `activationRate`
  - **Definition:** Share of new members who perform at least one meaningful action within 7 days.
  - **Meaningful actions:** `thread_created`, `comment_created`, `challenge_completed`, `library_reflection_submitted`.
  - **Formula:** `activatedNewMembers / newMembers`
- `week1Retention`
  - **Definition:** Share of new members active again between day 7 and day 13 after sign-up.
  - **Formula:** `retainedWeek1Members / newMembers`
- `month1Retention`
  - **Definition:** Share of new members active again between day 30 and day 44 after sign-up.
  - **Formula:** `retainedMonth1Members / newMembers`

## Engagement

- `MAU`
  - **Definition:** Monthly active users (members with at least one meaningful action in month).
  - **Formula:** Distinct member IDs with >=1 qualifying activity event in month.
- `WAU`
  - **Definition:** Weekly active users (members with at least one meaningful action in week).
  - **Formula:** Distinct member IDs with >=1 qualifying activity event in ISO week.
- `WAUtoMAURatio`
  - **Definition:** Weekly stickiness proxy.
  - **Formula:** `WAU / MAU`
- `weeklyPostAuthors`
  - **Definition:** Distinct members creating at least one thread per week.
  - **Formula:** Distinct member IDs with `thread_created` in week.
- `weeklyCommentAuthors`
  - **Definition:** Distinct members creating at least one comment per week.
  - **Formula:** Distinct member IDs with `comment_created` in week.
- `postsPerWeek`
  - **Definition:** Number of new threads in the week.
  - **Formula:** Count of `thread_created` events in week.
- `commentsPerWeek`
  - **Definition:** Number of new comments in the week.
  - **Formula:** Count of `comment_created` events in week.

## Content Depth

- `libraryEntriesPublished`
  - **Definition:** New library entries published in month.
  - **Formula:** Count of entries with non-null publish timestamp in month.
- `entryToDiscussionRate`
  - **Definition:** Share of published entries that generate at least one discussion action.
  - **Discussion action:** `discuss_click` or first `thread_created` linked to the entry within 14 days.
  - **Formula:** `entriesWithDiscussion / libraryEntriesPublished`

## Standard Reporting Notes

- Timezone: UTC for all monthly and weekly rollups.
- Deduplication: member-level metrics dedupe by internal `user.id`.
- Backfills: if tracking definitions change, retain old definitions and start a new versioned metric label (for example, `activationRate_v2`) instead of rewriting history.
