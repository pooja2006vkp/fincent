# TODO - Fix localhost/auth issues

## Step 1: Confirm server behavior
- [x] Read `package.json` scripts (dev/start/build)
- [x] Confirm Next server runs and redirect from `/` goes to `/auth/login`

## Step 2: Identify auth/session issue
- [x] Found `middleware.ts` calls `updateSession()`
- [x] Found `lib/supabase/middleware.ts` is a no-op (`NextResponse.next({ request })`)
- [x] Found Supabase client/server code uses `process.env.NEXT_PUBLIC_SUPABASE_*` with non-null assertions

## Step 3: Implement proper Supabase SSR middleware session handling
- [ ] Update `expense-tracker/lib/supabase/middleware.ts` to correctly create a Supabase server client, call `auth.getUser()`/`getSession()` early, and set cookies using `NextResponse`.

## Step 4: Validate
- [ ] Run `npm run dev`
- [ ] Open `http://localhost:3000/` and confirm redirect works
- [ ] Log in and confirm `/dashboard` + `/transactions` load properly

