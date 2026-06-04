# Fincent — Personal Finance Tracker

A production-ready expense tracker built with Next.js 15, Supabase, and Tailwind CSS.

## Tech Stack
- **Next.js 15** App Router + TypeScript
- **Supabase** — Auth + Postgres + RLS
- **Tailwind CSS** + shadcn/ui components
- **Recharts** — Analytics charts
- **Framer Motion** — Animations
- **next-themes** — Dark / light mode

## Local Setup

### 1. Clone & install
```bash
git clone <your-repo>
cd expense-tracker
npm install
```

### 2. Create a Supabase project
1. Go to https://supabase.com → New project
2. Open **SQL Editor** and run everything in `supabase/schema.sql`
3. Go to **Project Settings → API** and copy the Project URL and anon key

### 3. Configure environment
```bash
cp .env.local.example .env.local
# Edit .env.local with your Supabase URL and anon key
```

### 4. Run dev server
```bash
npm run dev
# Open http://localhost:3000
```

## Supabase Auth Setup
In your Supabase dashboard:
1. **Authentication → Providers** — Email is enabled by default
2. **Authentication → URL Configuration**:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: add `http://localhost:3000/**`

## Vercel Deployment
1. Push to GitHub
2. Import repo at vercel.com → Add New Project
3. Add env vars: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy
5. Update Supabase redirect URLs with your production domain

## Project Structure
```
app/              # Next.js pages (auth, dashboard, transactions, analytics)
components/
  ui/             # Base UI components (Button, Input, Card, etc.)
  layout/         # Sidebar, Navbar, AppLayout
  dashboard/      # Stats cards, recent transactions, quick actions
  charts/         # Recharts wrappers
  transactions/   # Table, form, edit dialog
hooks/            # useAuth, useTransactions, useToast
lib/supabase/     # client, server, middleware helpers
services/         # Transaction CRUD + analytics queries
types/            # TypeScript types and constants
supabase/         # schema.sql with RLS policies
```
