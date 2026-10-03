# Supabase Setup

SafeAware works out of the box in **demo mode** (data stored in your browser's
localStorage) so you can explore it immediately. Follow this guide when you're
ready to connect a real Supabase project.

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **New project**, choose an organization, name it (e.g. `safeaware`),
   set a database password, and pick a region.
3. Wait for provisioning to finish (a minute or two).

## 2. Get your project URL and anon key

1. In your project, go to **Project Settings → API**.
2. Copy the **Project URL** and the **anon public** key.

## 3. Configure environment variables

1. Copy `.env.example` to `.env` in the project root.
2. Fill in:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Restart `npm run dev` if it's already running.

## 4. Run the migrations

Open the **SQL Editor** in your Supabase dashboard and run, in order:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_rls_policies.sql`
3. `supabase/migrations/003_seed_data.sql`

Or, if you use the Supabase CLI:

```bash
supabase link --project-ref your-project-ref
supabase db push
```

## 5. Configure authentication

1. Go to **Authentication → Providers** and make sure **Email** is enabled.
2. Go to **Authentication → URL Configuration** and set:
   - **Site URL**: `http://localhost:5173` for local dev (add your Vercel
     domain later — see `VERCEL_DEPLOYMENT.md`).
   - **Redirect URLs**: add the same URL(s).

## 6. Create your first admin account

Admin access is never granted by the app itself (no self-assignment). To
create an admin:

1. Sign up normally through the app (`/register`), or create a user directly
   under **Authentication → Users** in the dashboard.
2. In the **SQL Editor**, run:
   ```sql
   update profiles set role = 'admin' where email = 'you@example.com';
   ```
3. Log out and back in — you'll be redirected to `/admin` from the navbar.

## 7. Test Row Level Security

With `is_admin()` and the policies in `002_rls_policies.sql` applied:

- A logged-out visitor should be able to read published campaigns/resources
  but not insert/update anything.
- A regular user should be able to submit survey responses and reports, but
  not read other users' non-anonymous reports.
- An admin account should be able to read everything and manage records.

You can sanity-check this from the SQL editor with `set role authenticated;`
and `select auth.uid()` scoped queries, or simply by testing through the app
with different accounts.

## Notes

- Never commit your `.env` file — it's already in `.gitignore`.
- Never put the `service_role` key in frontend code; this project only ever
  uses the `anon` key, protected by RLS.
