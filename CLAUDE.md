# CLAUDE.md — Job Tracker Project Context

> This file gives Claude Code full context about the project so it can work effectively.
> Place this file in the project root directory. Claude Code reads it automatically.

## Project Overview

**Job Tracker** is a personal job application tracking dashboard built by Josh (Cheng-En Tsai), a front-end engineer with 7+ years of experience, as a portfolio project to demonstrate modern React skills for the Australian job market.

**Purpose:** Track job applications through a Kanban-style board, with analytics, real-time sync, and full CRUD. This project exists to showcase production-quality React engineering — not just a pretty UI, but solid architecture, testing, and system design thinking.

**Live at:** Will be deployed to Vercel when complete.

---

## Tech Stack

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Framework | React | 19 | Using hooks, no class components |
| Language | TypeScript | 6.x | Strict mode enabled |
| Build | Vite | 8.x | With @vitejs/plugin-react |
| Styling | Tailwind CSS | 4.x | Via @tailwindcss/vite plugin |
| UI Components | shadcn/ui | radix-nova style | Components in src/components/ui/ |
| State (client) | Zustand | 5.x | For UI state only (sidebar, view, filters) |
| State (server) | TanStack Query | 5.x | For all Supabase data fetching |
| Database | Supabase | 2.x | PostgreSQL with RLS, auth, realtime |
| Routing | react-router-dom | 7.x | File-based routes in App.tsx |
| Drag & Drop | @dnd-kit | core 6.x, sortable 10.x | NOT react-beautiful-dnd (deprecated) |
| Charts | Recharts | 3.x | For analytics dashboard |
| Forms | react-hook-form + zod | 7.x + 4.x | With @hookform/resolvers |
| Dates | date-fns | 4.x | For formatting, no moment.js |
| Toasts | sonner | 2.x | Via shadcn Toaster wrapper |
| Icons | lucide-react | 1.x | Included with shadcn |
| Package Manager | pnpm | — | Do NOT use npm or yarn |

---

## Project Structure

```
src/
├── components/
│   ├── ui/                  # shadcn/ui components (DO NOT EDIT manually)
│   ├── layout/
│   │   ├── AppLayout.tsx    # Main layout: sidebar + header + content
│   │   ├── Sidebar.tsx      # Collapsible sidebar with nav + sign out
│   │   ├── Header.tsx       # ✅ Working — top bar + mobile nav (Sheet hamburger)
│   │   └── MobileNav.tsx    # ⚠️ STUB / unused — mobile nav lives in Header.tsx
│   ├── kanban/
│   │   ├── KanbanBoard.tsx  # ✅ Working — DnD board, columns from KANBAN_COLUMN_ORDER
│   │   ├── KanbanColumn.tsx # ✅ Working — droppable status column (@dnd-kit)
│   │   └── KanbanCard.tsx   # ✅ Working — draggable application card (@dnd-kit)
│   ├── applications/
│   │   ├── ApplicationForm.tsx   # ✅ Working — Dialog form, create + edit modes
│   │   ├── ApplicationDetail.tsx # ✅ Working — slide-out detail panel (Sheet)
│   │   ├── ApplicationTable.tsx  # ✅ Working — table/list view + pagination
│   │   └── StatusBadge.tsx       # ✅ Working — colour-coded status badge
│   ├── analytics/
│   │   ├── StatCard.tsx     # ✅ Working — single metric card
│   │   ├── StatusChart.tsx  # ✅ Working — Recharts status breakdown
│   │   ├── TimelineChart.tsx # ✅ Working — Recharts applications over time
│   │   └── FunnelChart.tsx  # ✅ Working — Recharts pipeline funnel
│   ├── activity/
│   │   ├── ActivityTimeline.tsx # ✅ Working — activity history list
│   │   └── ActivityForm.tsx     # ✅ Working — add activity to an application
│   ├── settings/
│   │   ├── ProfileSection.tsx       # ✅ Working — email (read-only) + display name + avatar upload
│   │   ├── AppearanceSection.tsx    # ✅ Working — wraps ThemeSwitcher
│   │   ├── PreferencesSection.tsx   # ✅ Working — default location + salary range
│   │   ├── DataAccountSection.tsx   # ✅ Working — logout + Danger Zone (delete account)
│   │   ├── AvatarUpload.tsx         # ✅ Working — Supabase Storage upload with preview + validation
│   │   ├── ThemeSwitcher.tsx        # ✅ Working — 3-way toggle via next-themes (light/dark/system)
│   │   ├── StatusLabelEditor.tsx    # ✅ Working — editable status label mapping → user_preferences
│   │   ├── ExportDataButton.tsx     # ✅ Working — download applications as CSV/JSON (Blob)
│   │   └── DeleteAccountDialog.tsx  # ✅ Working — type-email-to-confirm modal for account deletion
│   ├── common/
│   │   └── ErrorBoundary.tsx    # ✅ Working — top-level error boundary
│   └── auth/
│       ├── LoginForm.tsx     # ✅ Working — email/password sign in
│       ├── SignupForm.tsx    # ✅ Working — registration with validation
│       └── ProtectedRoute.tsx # ✅ Working — redirects to /login if no session
├── hooks/
│   ├── useAuth.ts              # ✅ Working — Supabase auth state + signIn/signUp/signOut
│   ├── useApplications.ts     # ✅ Working — fetches all applications, ordered by date
│   ├── useApplication.ts      # ✅ Working — fetches single application by ID
│   ├── useCreateApplication.ts # ✅ Working — mutation with optimistic update
│   ├── useUpdateApplication.ts # ✅ Working — mutation with optimistic update
│   ├── useDeleteApplication.ts # ✅ Working — mutation with optimistic update
│   ├── useActivities.ts       # ✅ Working — fetches activities for an application
│   ├── useContacts.ts         # ✅ Working — fetches contacts
│   ├── useRealtimeSubscription.ts # ✅ Working — invalidates queries on DB changes
│   ├── useUserPreferences.ts  # ✅ Working — TanStack Query read + upsert (optimistic) for user_preferences
│   ├── useAvatarUpload.ts     # ✅ Working — Supabase Storage upload hook (validate + return public URL)
│   ├── useStatusLabel.ts      # ✅ Working — resolver hook applying custom status labels over defaults
│   └── useDeleteAccount.ts    # ✅ Working — clears storage → rpc('delete_user') → signOut → redirect
├── stores/
│   ├── uiStore.ts             # ✅ Working — Zustand store for sidebar, view, filters, sort
│   └── themeStore.ts          # ❌ Not built — chose next-themes instead (already wired to sonner; handles FOUC + system pref). See decision note below.
├── lib/
│   ├── supabase.ts            # ✅ Working — singleton Supabase client
│   ├── utils.ts               # ✅ Working — cn(), formatDate(), STATUS_LABEL, STATUS_COLOR, KANBAN_COLUMN_ORDER
│   └── export.ts              # ✅ Working — CSV (RFC-4180 escaping) / JSON export via Blob + getStatusLabel() also lives in utils.ts
├── types/
│   ├── database.ts            # ✅ Hand-written types: Application, Contact, Activity, enums
│   ├── supabase.ts            # ✅ Auto-generated from Supabase CLI
│   └── (preferences.ts)       # ❌ Not built — UserPreferences interface lives in database.ts instead (matches existing convention)
├── pages/
│   ├── ApplicationsPage.tsx   # ✅ Working — Kanban/Table view, search, filters, pagination
│   ├── DashboardPage.tsx      # ✅ Working — StatCards + all analytics charts
│   ├── LoginPage.tsx          # ✅ Working — tabs for Sign In / Sign Up
│   ├── SettingsPage.tsx       # ✅ Working — 4-section settings page (Profile, Appearance, Preferences, Data & Account)
│   └── NotFoundPage.tsx       # ✅ Working — 404 page
├── App.tsx                    # ✅ Working — routes with ProtectedRoute, lazy-loaded Dashboard
└── main.tsx                   # ✅ Working — QueryClient, BrowserRouter, Toaster providers
```

---

## Database Schema (Supabase PostgreSQL)

### Tables

**applications**
- `id` uuid PK (auto-generated)
- `user_id` uuid FK → auth.users (required, used for RLS)
- `company` text NOT NULL
- `role` text NOT NULL
- `url` text (nullable)
- `status` enum: applied | phone_screen | interview | offer | rejected | withdrawn (default: applied)
- `salary_min` integer (nullable)
- `salary_max` integer (nullable)
- `location` text (nullable)
- `notes` text (nullable)
- `applied_date` date (default: today)
- `created_at` timestamptz (auto)
- `updated_at` timestamptz (auto, trigger-updated)

**contacts**
- `id` uuid PK
- `user_id` uuid FK → auth.users
- `application_id` uuid FK → applications (CASCADE delete)
- `name` text NOT NULL
- `email`, `role`, `company`, `linkedin_url` — all nullable text
- `created_at` timestamptz

**activities**
- `id` uuid PK
- `user_id` uuid FK → auth.users
- `application_id` uuid FK → applications (CASCADE delete)
- `type` enum: applied | email | call | interview | offer | rejection | follow_up | note
- `description` text (nullable)
- `date` date (default: today)
- `created_at` timestamptz

**user_preferences** *(✅ created — migration `20260618094112_add_user_preferences`; RLS + reuses `update_updated_at` trigger)*
- `id` uuid PK (auto-generated)
- `user_id` uuid FK → auth.users (unique — one row per user)
- `display_name` text (nullable)
- `avatar_url` text (nullable)
- `default_location` text (nullable)
- `default_salary_min` integer (nullable)
- `default_salary_max` integer (nullable)
- `custom_status_labels` jsonb (nullable — e.g. `{"phone_screen": "Initial Call"}`)
- `theme` text (default: 'system' — light | dark | system)
- `created_at` timestamptz (auto)
- `updated_at` timestamptz (auto, trigger-updated)

### Storage Buckets *(✅ created — migration `20260618094114_add_avatars_storage`)*
- **avatars** — public read, authenticated upload, max 2MB (`file_size_limit`), jpg/png/webp only (`allowed_mime_types`). RLS on `storage.objects` scopes writes to the user's own `<user_id>/` folder.

### Database Functions *(✅)*
- `public.delete_user()` — `SECURITY DEFINER` RPC (migration `20260620083343_add_delete_user_function`). Deletes `auth.users WHERE id = auth.uid()`; cascading FKs wipe all the caller's rows. `search_path = ''`, execute granted to `authenticated` only. Called by `useDeleteAccount`.

### Security
- Row Level Security (RLS) enabled on all tables
- All policies: users can only CRUD their own data (WHERE auth.uid() = user_id)

### Realtime
- Enabled on `applications` and `activities` tables
- Handled by `useRealtimeSubscription` hook which invalidates TanStack Query cache

---

## Current Progress & What Needs To Be Done

### ✅ Completed (Days 1-14)
- **Foundation:** Project scaffolded, Supabase DB with full schema/RLS/indexes/triggers, auth flow (sign up/in/out, session persistence, protected routes)
- **Data layer:** All data-fetching + mutation hooks with TanStack Query and optimistic updates, Zustand UI store, realtime subscription hook
- **Day 4 — CRUD:** ApplicationForm Dialog (create + edit modes, validation, toasts), Add/Edit/Delete wired into ApplicationsPage
- **Day 5 — Kanban:** @dnd-kit drag-and-drop between status columns
- **Day 6 — Detail:** ApplicationDetail slide-out (Sheet) + ActivityTimeline + ActivityForm
- **Day 7 — Analytics:** Dashboard with Recharts (StatCards, StatusChart, TimelineChart, FunnelChart)
- **Day 8 — Realtime/caching:** realtime sync + caching strategy
- **Day 9 — List UX:** search, filters, pagination, table view
- **Day 10 — Resilience:** ErrorBoundary, loading/skeleton states, toast notifications
- **Day 11 — Testing:** Vitest + RTL unit/integration tests — ✅ 8 test files / 18 tests passing (see "Resolved" note about the Node runtime fix)
- **Day 12 — A11y:** axe audit, keyboard nav, ARIA, responsive (mobile nav via Header Sheet)
- **Day 13 — Perf/deploy:** React.lazy code-splitting, Lighthouse audit, deployed to Vercel
- **Day 14 — Docs:** README + docs/SYSTEM_DESIGN.md

### ✅ Resolved
- **Test suite now runs (2026-06-17)** — `pnpm test:run` → 8 files / 18 tests passing.
  - **Symptom:** every test file failed at worker startup with `ERR_REQUIRE_ESM`.
  - **Root cause:** the runtime, not the code. `jsdom@29` → `html-encoding-sniffer@6` does `require()` on `@exodus/bytes`, which is ESM-only (`"type": "module"`). On **Node 22.11** `require()` of an ESM module is not enabled, so jsdom failed to load inside each vitest forks worker. The latest versions of all three packages still have this `require(ESM)` shape, so upgrading the npm packages does NOT help.
  - **Fix:** upgraded Node **22.11 → 22.12.0**, where `require(ESM)` is enabled by default (it was flag-gated behind `--experimental-require-module` before 22.12). No dependency or `vite.config.ts` changes — jsdom kept as-is.
  - **Locked the version** so it can't regress: added `.nvmrc` (`22.12.0`) for local dev and `engines.node >= 22.12.0` in `package.json` for install/CI enforcement.
  - **Interview talking points:** (1) debugging a failure that lived in the *runtime/dependency* layer, not app code — read the actual error chain instead of guessing; (2) the CJS-vs-ESM `require(ESM)` interop change in Node 22.12; (3) why "just upgrade the package" was the wrong instinct here (latest versions still broken); (4) `.nvmrc` vs `engines` — dev-experience hint vs install-time contract — for reproducibility across machines and CI.
  - **How I found it (the story to tell):** AI's first suggestions were workarounds — switch to happy-dom, downgrade jsdom, or inline the dep. They worked but didn't feel like the *best* solution (each swaps or weakens a dependency to dodge the symptom). Instead of accepting the first fix, I questioned it and asked "why can't we just upgrade the version and see if it's already fixed?" Investigating that question surfaced the real root cause — a Node runtime gap, not a library bug — and the cleanest fix: a one-minor-version Node upgrade with zero code changes. **Lesson: don't accept the first workaround; push to understand the root cause, and the least-invasive fix often falls out of it.**
- **Settings Page complete (2026-06-20)** — all 4 sections built on the `feature/settings` branch. Notable decisions / deviations from the original plan:
  - **Adopted Supabase CLI (Day 0)** — migrated from Dashboard-managed schema to migrations-as-code: `supabase/migrations/` baseline + `user_preferences`, `avatars`, and `delete_user()` migrations; types auto-generated via `supabase gen types`.
  - **Theme: used `next-themes`, not a custom Zustand `themeStore`** — it already powers the sonner wrapper and handles FOUC + system preference, so rolling our own would mean two sources of truth. ThemeSwitcher reads `useTheme()`.
  - **`UserPreferences` type lives in `database.ts`**, not a separate `preferences.ts` (matches existing convention).
  - **Custom status labels** resolve via `getStatusLabel()` (utils) + `useStatusLabel()` hook, wired into StatusBadge, KanbanColumn, ApplicationDetail, StatusChart, the ApplicationForm select, and the ApplicationsPage filter. KanbanBoardSkeleton intentionally left on defaults.
  - **Delete account** uses the `delete_user()` SECURITY DEFINER RPC (no service_role on the client, no Edge Function); `useDeleteAccount` clears avatar storage first, then calls the RPC, then signs out.
- **next-themes** now powers the theme switcher (previously only consumed by the sonner wrapper).

### ⚠️ Known Gaps / Outstanding
- **MobileNav.tsx is an unused stub** — mobile navigation is actually implemented in Header.tsx via a Sheet; this file can be removed or implemented.
- **Settings polish (optional)** — no explicit error states on the settings queries; PreferencesSection salary grid is `grid-cols-2` (could be `grid-cols-1 sm:grid-cols-2` on narrow screens); no tests yet for `export.ts` / `getStatusLabel` (good pure-function candidates).

> **Status:** `pnpm build` green; tests pass (8 files / 18). Core features + full Settings page complete. Remaining: optional settings polish and MobileNav cleanup.

---

## Architecture Patterns

### State Management Split
- **Zustand (uiStore):** Client-only UI state — sidebar open/closed, kanban vs table view, active filters, sort order
- **TanStack Query:** All server data — applications, contacts, activities. Handles caching (30s staleTime), refetching, optimistic updates
- **Never put server data in Zustand.** If it comes from Supabase, it goes through TanStack Query.

### Query Keys
```typescript
['applications']                    // all applications
['application', id]                 // single application
['activities', applicationId]       // activities for one application
['contacts']                        // all contacts
['contacts', applicationId]         // contacts for one application
['user-preferences']                // current user's preferences (settings page)
```

### Optimistic Update Pattern (already implemented in hooks)
```
onMutate → cancel queries → save previous data → optimistically update cache
onError → rollback to previous data
onSettled → invalidate queries to sync with server
```

### Component Layout Pattern
- Pages wrap content in `<AppLayout>` which provides sidebar + header
- Pages import and compose feature components
- Feature components use hooks for data, never call Supabase directly

---

## Key Files to Know

| File | What it does | When to touch it |
|------|-------------|-----------------|
| `src/lib/utils.ts` | STATUS_LABEL, STATUS_COLOR, KANBAN_COLUMN_ORDER, cn(), date formatters | When adding new status or utility |
| `src/types/database.ts` | TypeScript interfaces for Application, Contact, Activity | When schema changes |
| `src/stores/uiStore.ts` | Zustand store for all UI state | When adding new UI controls |
| `src/main.tsx` | App providers (QueryClient, Router, Toaster) | Rarely |
| `src/App.tsx` | All routes | When adding new pages |

---

## Style & Code Conventions

- **Formatting:** Prettier with single quotes, no semicolons, trailing commas, 2-space indent
- **Imports:** Use `@/` path alias (maps to `src/`)
- **Components:** Functional components with hooks only, no class components
- **Naming:** PascalCase for components, camelCase for hooks/utils, kebab-case for files in ui/
- **CSS:** Tailwind classes only, no CSS modules, no styled-components
- **State:** Zustand for UI, TanStack Query for server data, useState for local form state
- **Forms:** react-hook-form with zod validation for complex forms; plain useState for simple forms
- **Exports:** Named exports for components, default exports for pages
- **Error handling:** Every data-rendering component should handle loading, empty, and error states

---

## Commands

```bash
pnpm dev          # Start dev server (localhost:5173)
pnpm build        # TypeScript check + production build
pnpm lint         # ESLint
pnpm preview      # Preview production build
```

---

## Important Constraints

1. **DO NOT use npm or yarn** — this project uses pnpm exclusively
2. **DO NOT use react-beautiful-dnd** — it's deprecated, use @dnd-kit
3. **DO NOT use Redux or Context API for state** — use Zustand for UI, TanStack Query for server
4. **DO NOT use Create React App** — this uses Vite
5. **DO NOT use CSS modules or styled-components** — use Tailwind
6. **DO NOT put API calls directly in components** — use hooks in src/hooks/
7. **DO NOT hardcode colours** — use Tailwind classes and shadcn CSS variables
8. **DO NOT edit files in src/components/ui/** — these are managed by shadcn
9. **DO use existing Supabase client from src/lib/supabase.ts** — don't create new clients
10. **DO use existing hooks** — useCreateApplication, useUpdateApplication, useDeleteApplication already have optimistic updates built in

---

## Settings Page Plan

> **Goal:** Both practical and technically impressive. Estimated 3 days of development.

### Section 1: Profile
- Display user email (read-only, from Supabase Auth)
- Editable display name field
- Avatar upload using Supabase Storage
  - Image preview before upload
  - File size validation (max 2MB), accepted formats: jpg, png, webp
  - Upload progress indicator
- Save with optimistic update via TanStack Query `useUserPreferences` hook

### Section 2: Appearance
- Theme switcher: Light / Dark / System (3 options, radio group or segmented control)
- ✅ Built with **next-themes** (`attribute="class"`, `defaultTheme="system"`, `enableSystem`); persists to localStorage automatically
- Applies via Tailwind `dark:` class strategy (next-themes toggles `dark` on `<html>`, matching `@custom-variant dark` in index.css)
- Respects `prefers-color-scheme` when "System" is selected
- Decision: kept **next-themes** rather than a custom Zustand store — it already drives the sonner wrapper and handles FOUC + system preference, so a custom store would mean two sources of truth

### Section 3: Application Preferences
- Default location for new applications (text input)
- Default salary range (min/max number inputs)
- Custom status labels (editable mapping, e.g. rename "Phone Screen" → "Initial Call")
- Data stored in `user_preferences` table in Supabase (see Database Schema section)
- ApplicationForm should read these defaults when opening in create mode

### Section 4: Data & Account
- **Export:** download all applications as CSV or JSON (frontend-only via Blob + URL.createObjectURL)
- **Danger Zone** (red-bordered section):
  - Delete account button → confirmation modal (user types email to confirm)
  - Deletes all user data via Supabase, then signs out
- Logout button

### Implementation Schedule
- **Day 0 (~half day): Adopt Supabase CLI — migrate from Dashboard-managed schema to migrations-as-code.** Prereq for the rest: from here on all schema/RLS/storage changes are version-controlled SQL migrations, not manual Dashboard clicks.
  - Install CLI via Homebrew (`brew install supabase/tap/supabase`), `supabase init`, `supabase login`, `supabase link --project-ref <ref>`.
  - `supabase db pull` → capture the existing remote schema (applications / contacts / activities + RLS) as a baseline migration in `supabase/migrations/`.
  - `supabase gen types typescript --linked > src/types/supabase.ts` → auto-generate types instead of hand-maintaining them.
  - Workflow: `supabase migration new <name>` → write SQL → `supabase db push`. (Remote-direct chosen over local-first/Docker for a solo project; local Docker DB can be added later if needed.)
  - **Interview story:** migrating a Dashboard-managed project to a migrations-based, schema-as-code workflow — reproducibility, schema changes visible in PR diffs, automated type generation.
- **Day 1: ✅ done** — Profile (avatar upload with Supabase Storage, display name) + Appearance (theme switcher via next-themes)
- **Day 2: ✅ done** — Application Preferences (defaults + "Use my defaults" button, custom status labels) + Data export (CSV/JSON)
- **Day 3: ✅ done** — Danger Zone (delete account via `delete_user()` RPC). Remaining polish (responsive tweaks, query error states, tests) tracked under Known Gaps.

### Interview Talking Points from Settings Page
- **Supabase Storage:** file upload flow — client-side validation, signed URLs, public bucket config
- **Zustand persist middleware:** trade-offs of localStorage sync vs server-side preference storage
- **CSV export:** frontend data transformation using Blob API without server dependency
- **Danger Zone UX:** destructive action patterns — why double confirmation matters, red visual cues
- **Optimistic updates:** settings changes feel instant while syncing to Supabase in the background

---

## The Developer

Josh is a front-end engineer with 7 years of React/Vue experience from Taiwan, recently completed a Master of IT at UTS in Sydney. He's comfortable with React but has been away from production code for 2 years. He's learning by building this project — when implementing features, explain architectural decisions so he can discuss them in interviews. He wants to understand WHY, not just see working code.
