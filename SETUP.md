# Alpha Tutor — GitHub + Vercel + Supabase

## 1. Environment variables

Already set on Vercel (Production + Preview):

| Variable | Where used |
|----------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Browser + server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser + server (RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only (`createAdminClient`) |
| `OPENROUTER_API_KEY` | Server only (AI routes) |

**Local:** pull from Vercel:

```powershell
cd alpha-tutor
npx vercel link
npx vercel env pull .env.local
```

Or copy `.env.example` → `.env.local` and paste values from Supabase Dashboard → Settings → API.

## 2. Database migration (one-time)

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your **alpha-tutor** project.
2. Go to **SQL Editor** → **New query**.
3. Paste the full contents of `supabase/migrations/20260526000000_init_schema.sql`.
4. Click **Run**.

Or with CLI (after `supabase login` and `supabase link --project-ref <ref>`):

```powershell
supabase db push
```

## 3. Verify deployment

After pushing code to GitHub (Vercel auto-deploys):

- App: `https://<your-project>.vercel.app`
- Health: `https://<your-project>.vercel.app/api/health`

Expected when DB is ready:

```json
{ "ok": true, "supabase": "connected", "openrouter": true }
```

If migration is missing:

```json
{ "ok": false, "supabase": "needs_migration", ... }
```

## 4. Push code to GitHub

```powershell
cd alpha-tutor
git add .
git commit -m "Add Supabase integration and initial schema"
git push origin main
```

Vercel will rebuild automatically.

## 5. Next steps (app features)

- [ ] Supabase Auth (email magic link / OAuth) + role in `profiles`
- [ ] Replace mock student data with `learning_sessions` / `question_attempts`
- [ ] Guide dashboard reads `enrollments` + realtime focus events
- [ ] `POST /api/ai/explain` using `src/lib/openrouter.ts`
