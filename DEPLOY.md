# Vercel Deployment Checklist

If the deployed site shows `MIDDLEWARE_INVOCATION_FAILED` or Clerk auth errors, verify these environment variables are set in Vercel for both Preview and Production:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_FRONTEND_API` (if your Clerk setup uses it)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Why this matters

Clerk middleware reads `CLERK_SECRET_KEY` on the server. If Vercel is missing that variable, middleware can fail before the page renders.

## After setting env vars

1. Redeploy the project in Vercel.
2. Confirm the latest deployment succeeds.
3. Visit `/` and `/dashboard`.
4. Check Vercel logs if any request still returns 500.

## Local verification

The project should pass:

```bash
npm run build
```
