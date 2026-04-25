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
│   │   ├── Header.tsx       # Top bar (stub)
│   │   └── MobileNav.tsx    # Mobile hamburger menu (stub)
│   ├── kanban/
│   │   ├── KanbanBoard.tsx  # Renders columns from KANBAN_COLUMN_ORDER
│   │   ├── KanbanColumn.tsx # Single status column (stub — no cards yet)
│   │   └── KanbanCard.tsx   # Application card (basic — needs DnD)
│   ├── applications/
│   │   ├── ApplicationForm.tsx   # ⚠️ STUB — needs full form implementation
│   │   ├── ApplicationDetail.tsx # ⚠️ STUB — slide-out detail panel
│   │   ├── ApplicationTable.tsx  # ⚠️ STUB — table/list view
│   │   └── StatusBadge.tsx       # ✅ Working — colour-coded status badge
│   ├── analytics/
│   │   ├── StatCard.tsx     # ✅ Working — single metric card
│   │   ├── StatusChart.tsx  # ⚠️ STUB
│   │   ├── TimelineChart.tsx # ⚠️ STUB
│   │   └── FunnelChart.tsx  # ⚠️ STUB
│   ├── activity/
│   │   ├── ActivityTimeline.tsx # ⚠️ STUB
│   │   └── ActivityForm.tsx     # ⚠️ STUB
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
│   └── useRealtimeSubscription.ts # ✅ Working — invalidates queries on DB changes
├── stores/
│   └── uiStore.ts             # ✅ Working — Zustand store for sidebar, view, filters, sort
├── lib/
│   ├── supabase.ts            # ✅ Working — singleton Supabase client
│   └── utils.ts               # ✅ Working — cn(), formatDate(), STATUS_LABEL, STATUS_COLOR, KANBAN_COLUMN_ORDER
├── types/
│   ├── database.ts            # ✅ Hand-written types: Application, Contact, Activity, enums
│   └── supabase.ts            # ✅ Auto-generated from Supabase CLI
├── pages/
│   ├── ApplicationsPage.tsx   # ✅ Working — shows Kanban or Table view based on uiStore
│   ├── DashboardPage.tsx      # Partially working — has StatCards but charts are stubs
│   ├── LoginPage.tsx          # ✅ Working — tabs for Sign In / Sign Up
│   ├── SettingsPage.tsx       # ⚠️ STUB
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

### Security
- Row Level Security (RLS) enabled on all tables
- All policies: users can only CRUD their own data (WHERE auth.uid() = user_id)

### Realtime
- Enabled on `applications` and `activities` tables
- Handled by `useRealtimeSubscription` hook which invalidates TanStack Query cache

---

## Current Progress & What Needs To Be Done

### ✅ Completed (Days 1-3)
- Project scaffolded with all dependencies
- Supabase database created with full schema, RLS, indexes, triggers
- Auth flow working (sign up, sign in, sign out, session persistence, protected routes)
- All data-fetching hooks implemented with TanStack Query
- All mutation hooks implemented with optimistic updates
- Zustand UI store working
- Realtime subscription hook working
- Basic page routing with lazy-loaded Dashboard

### 🔧 Day 4: ApplicationForm + CRUD (CURRENT TASK)
**ApplicationForm.tsx needs to be implemented as a Dialog form:**
- Fields: company (required), role (required), url, status (Select dropdown), salary_min, salary_max, location, applied_date (default today), notes (textarea)
- Use shadcn/ui Dialog, Input, Label, Select, Button components
- Form validation: company and role required
- Two modes: "create" (empty form) and "edit" (pre-filled with existing data)
- On create: call `useCreateApplication` mutation
- On edit: call `useUpdateApplication` mutation
- Show success/error toasts via sonner
- Close dialog on success

**ApplicationsPage.tsx needs:**
- An "Add Application" button that opens the ApplicationForm dialog
- Display the list of applications (currently only renders KanbanBoard/ApplicationTable stubs)
- Edit and delete buttons on each application card

### 📋 Upcoming Days
- Day 5: Kanban board with @dnd-kit drag-and-drop between status columns
- Day 6: ApplicationDetail slide-out panel + ActivityTimeline
- Day 7: Analytics dashboard with Recharts (StatCards, StatusChart, TimelineChart, FunnelChart)
- Day 8: Realtime sync verification + caching strategy documentation
- Day 9: Search, filters, pagination, table view
- Day 10: Error boundaries, loading states, skeleton loaders, toast notifications
- Day 11: Testing with Vitest + React Testing Library
- Day 12: Accessibility (axe audit, keyboard navigation, ARIA) + responsive design
- Day 13: Performance (React.lazy, Lighthouse audit) + deploy to Vercel
- Day 14: README, system design doc, portfolio update

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

## The Developer

Josh is a front-end engineer with 7 years of React/Vue experience from Taiwan, recently completed a Master of IT at UTS in Sydney. He's comfortable with React but has been away from production code for 2 years. He's learning by building this project — when implementing features, explain architectural decisions so he can discuss them in interviews. He wants to understand WHY, not just see working code.
