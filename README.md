<div align="center">

# Bookmarker 🏷️

**A modern, real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS.**

![Next.js](https://img.shields.io/badge/Next.js-15.1.11-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

#### Live at: [bookmarker](https://bookmarker-sage.vercel.app/) 

## Challenges Faced

1. The app uses a public Supabase anon key in the client. Since requests hit the database directly, data isolation cannot rely on client-side filtering.

__Solution__:
Enabled Row Level Security (RLS) and implemented policy-level enforcement:

```
SELECT → auth.uid() = user_id

INSERT → enforce user_id = auth.uid()

DELETE → restrict to row owner
```
Instead of handling filtering at application level, I handle it at database level.

---

2. Authentication is Google OAuth only (no credentials), requiring correct session handling across redirects and server/client boundaries.

__Solution__:

Configured Supabase OAuth with Google provider.
Implemented signInWithOAuth redirect flow.
Used Supabase session helpers for App Router (server + client components).

Validated session before protected queries.

---

3. Bookmark list must update instantly across multiple open tabs without polling.

__Solution__:

Subscribed to Supabase Realtime postgres_changes on the bookmarks table.
Scoped events by user_id

---

### Instructions to Run Locally

__To Run in Development Mode__

Install dependencies:
`npm install`

Run the app:
`npm run dev`

---

__To Build and Serve__

Build the app:
`npm run build`

Serve the built files:
`npm run start`