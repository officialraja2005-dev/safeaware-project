# System Architecture

```
Browser (React + Vite SPA)
        │
        ├── React Router (client-side routing)
        ├── AuthContext (Supabase Auth session, or local demo auth)
        ├── Services layer (lib/services.ts) — Supabase-or-demo-data fallback
        │
        ▼
Supabase (PostgreSQL + Auth + Row Level Security)
        │
        ▼
Vercel (static hosting + build pipeline)
```

## Layers

- **Presentation** — React components under `src/pages` and `src/components`.
- **State/Context** — `AuthContext` for session and role; local component
  state for forms and UI state.
- **Data access** — `src/lib/services.ts` centralises all reads/writes and
  transparently falls back to local demo data (`src/lib/demoData.ts`) when
  Supabase isn't configured, so the same component code works either way.
- **Backend** — Supabase Postgres tables, guarded by RLS policies defined in
  `supabase/migrations/002_rls_policies.sql`.
