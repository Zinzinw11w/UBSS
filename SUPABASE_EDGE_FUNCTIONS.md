# Supabase Edge Function: Process Completed Trading Plans

This moves the automated plan-completion backend off Firebase and onto Supabase.

## Files added

- `supabase/functions/process-completed-plans/index.ts` – Edge Function that:
  - Finds expired active `trading_plans`
  - Calls Postgres RPC `complete_trading_plan` per plan for atomic update
- `supabase/sql/complete_trading_plan.sql` – Postgres function implementing the transactional completion

## One-time setup

1) Install the Supabase CLI (if not already):

```bash
npm i -g supabase
```

2) Login and link project:

```bash
supabase login
supabase link --project-ref iyjvblxyefhbnzounucv
```

3) Apply SQL (creates the RPC):

```bash
supabase db push --file supabase/sql/complete_trading_plan.sql
```

## Deploy the Edge Function

```bash
supabase functions deploy process-completed-plans --project-ref iyjvblxyefhbnzounucv
```

Set required environment variables (Service Role is required server-side):

```bash
supabase secrets set \
  SUPABASE_URL=https://iyjvblxyefhbnzounucv.supabase.co \
  SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY \
  --project-ref iyjvblxyefhbnzounucv
```

## Schedule (cron)

Create a schedule to run every 5 minutes:

```bash
supabase functions schedule create process-completed-plans-cron \
  --project-ref iyjvblxyefhbnzounucv \
  --cron "*/5 * * * *" \
  --endpoint process-completed-plans
```

List/verify schedules:

```bash
supabase functions schedule list --project-ref iyjvblxyefhbnzounucv
```

## RLS notes

The Edge Function uses the Service Role key; it bypasses RLS. Client reads and inserts still honor your table RLS policies.

## Local testing

```bash
supabase functions serve process-completed-plans --env-file .env
# In another terminal, call it:
curl -i http://localhost:54321/functions/v1/process-completed-plans
```

Ensure your `.env` used by `serve` contains `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.



