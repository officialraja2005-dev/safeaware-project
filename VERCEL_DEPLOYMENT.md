# Vercel Deployment

## 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: SafeAware BCA minor project"
git branch -M main
git remote add origin https://github.com/<your-username>/safeaware-bca-minor-project.git
git push -u origin main
```

## 2. Import into Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repo.
2. Framework preset: **Vite** (auto-detected).
3. Build command: `npm run build`
4. Output directory: `dist`

## 3. Add environment variables

In the Vercel project's **Settings → Environment Variables**, add:

| Key | Value |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon public key |

Add them for **Production**, **Preview**, and **Development** as needed.

## 4. Deploy

Click **Deploy**. Vercel will build and give you a `https://<project>.vercel.app` URL.

## 5. Update Supabase auth settings for production

Back in Supabase, under **Authentication → URL Configuration**:

- Add your Vercel domain to **Site URL** and **Redirect URLs**, e.g.
  `https://safeaware.vercel.app`.

## 6. Test the deployed app

- [ ] Registration works and creates a `profiles` row.
- [ ] Login/logout work.
- [ ] Survey submission persists to `survey_responses` / `survey_answers`.
- [ ] Campaigns/resources load from the database.
- [ ] `/admin` is blocked for non-admins and reachable for the admin account.

Local development (`npm run dev`) and the deployed Vercel app can point at the
same Supabase project — just keep both URLs in the Supabase redirect list.
