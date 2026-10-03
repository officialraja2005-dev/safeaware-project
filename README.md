# SafeAware

Community Safety Awareness & Emergency Support Platform

A BCA Minor Project designed to promote safety awareness, collect community
safety concerns through structured surveys, provide educational resources,
and support responsible reporting.

**Know. Prepare. Respond.**

> SafeAware is an awareness and information platform. It is **not** a
> replacement for police, ambulance, fire, hospitals, lawyers, or
> professional counsellors. In an emergency, contact official emergency
> services directly. Legal information in this project is general
> educational content, not legal advice.

## Features

- **Safety concern survey** — multi-question, database-driven, with an
  anonymous option and a progress indicator.
- **Awareness campaigns** — Campus Safety Week, Cyber Safety Awareness, Road
  Safety, and more, each with a set of focused topics.
- **Educational resources** — searchable, categorised, short practical guides.
- **Legal awareness** — general information about reporting mechanisms, with
  a clear non-legal-advice disclaimer and official source links.
- **Emergency help directory** — categorised emergency contacts with call and
  website buttons, clearly labelled by jurisdiction.
- **Anonymous reporting** — report a non-emergency concern with or without an
  account.
- **Admin dashboard** — overview stats, survey analytics (charts), and safety
  report review/status management.
- **Authentication & onboarding** — Supabase Auth-backed sign-up/login, a
  five-step onboarding flow, and role-based access control (user/admin).
- **Demo mode** — the entire app runs immediately with local demo data before
  Supabase is even configured, so you can explore or grade it with zero setup.

## Technology stack

**Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, React Router,
Lucide icons, Recharts.

**Backend:** Supabase (PostgreSQL, Auth, Row Level Security).

**Deployment:** GitHub + Vercel.

## Screenshots

*(Add screenshots here after running the app locally)*

### Home
[Add screenshot]

### Safety Survey
[Add screenshot]

### Campaigns
[Add screenshot]

### Resources
[Add screenshot]

### Admin Dashboard
[Add screenshot]

### Survey Analytics
[Add screenshot]

## System architecture

```
                    ┌──────────────────────┐
                    │      SafeAware       │
                    │    React + Vite      │
                    └──────────┬───────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
        Authentication      Application       Admin
             │                 │                 │
             └─────────────────┼─────────────────┘
                               │
                        ┌──────▼──────┐
                        │  Supabase   │
                        │ PostgreSQL  │
                        │ Auth + RLS  │
                        └──────┬──────┘
                               │
                        ┌──────▼──────┐
                        │   Vercel    │
                        │ Production  │
                        └─────────────┘
```

See `docs/database-design.md` for the table-level schema and relationships.

## Local development

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173` and works immediately in **demo
mode** — no Supabase project required. Data (accounts, survey responses,
reports) is stored in your browser's localStorage until you connect Supabase.

Production build:

```bash
npm run build
npm run preview
```

## Environment variables

See `.env.example`. Copy it to `.env` and fill in your Supabase project
values — see `SUPABASE_SETUP.md` for the full walkthrough.

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Supabase setup

Full instructions: [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md)

Migrations live in `supabase/migrations/` and should be run in order:
`001_initial_schema.sql` → `002_rls_policies.sql` → `003_seed_data.sql`.

## Admin setup

No admin password is hard-coded anywhere. To grant admin access, sign up
normally and then promote the account via SQL — see the "Create your first
admin account" section of `SUPABASE_SETUP.md`. (In demo mode without
Supabase, any email starting with `admin@` is treated as an admin for
demonstration purposes only.)

## Deployment

Full instructions: [`VERCEL_DEPLOYMENT.md`](./VERCEL_DEPLOYMENT.md)

## Security notes

- Row Level Security is enabled on every table; see
  `supabase/migrations/002_rls_policies.sql`.
- The `service_role` key is never used in frontend code — only the `anon` key,
  scoped by RLS policies.
- Users cannot self-assign the `admin` role (enforced by an RLS `with check`
  clause on `profiles`).
- No secrets are committed; `.env` is gitignored, `.env.example` documents
  required variables.
- See `docs/security.md` for the full rundown.

## Documentation

- [`docs/project-overview.md`](./docs/project-overview.md)
- [`docs/requirements.md`](./docs/requirements.md)
- [`docs/system-architecture.md`](./docs/system-architecture.md)
- [`docs/database-design.md`](./docs/database-design.md)
- [`docs/security.md`](./docs/security.md)
- [`docs/testing.md`](./docs/testing.md)
- [`docs/deployment.md`](./docs/deployment.md)
- [`docs/viva-questions.md`](./docs/viva-questions.md)
- [`PROJECT_REPORT.md`](./PROJECT_REPORT.md) — full BCA project report

## Future enhancements

- Mobile app companion
- Push notifications for new campaigns
- Multilingual support
- Location-aware resource suggestions
- Advanced analytics and trend reporting
- Partnerships with campus/community safety offices

## Author

```
Student Name:
Roll Number:
College Name:
Department:
Academic Year:
Project Guide:
```

## License

Educational project — no license restrictions on reuse for coursework.
