# MARQ Supabase Database Setup

This folder contains the Phase 1 database foundation for MARQ (complete: org/RBAC/domain tables, RLS, repeatable seed).

## Included

- `migrations/202603260001_extensions_helpers.sql`
  - shared extensions, trigger helpers, JWT claim helpers
- `migrations/202603260002_identity_people.sql`
  - organizations, users, memberships, RBAC, departments, employees
- `migrations/202603260003_domains_core.sql`
  - core time, communication, notifications, finance, work, analytics tables
- `migrations/202603260004_rls_baseline.sql`
  - baseline tenant isolation policies via RLS
- `migrations/202603270005_rls_identity_catalog.sql`
  - RLS on `permissions`, `users`, `role_permissions` (catalog + self-row access)
- `seed.sql` (configured in `config.toml` → `[db.seed] sql_paths`)
  - demo org `11111111-1111-1111-1111-111111111111`, permission catalog, demo **Organization Admin** role with grants, two departments, three employees (`user_id` null until linked to `auth.users`)

## Apply migrations

### Hosted Supabase (no Docker)

You do **not** need Docker if you only use a **hosted** Supabase project. Docker is for local `supabase start` and `supabase db reset` (local Postgres).

If the shell says `supabase` is not recognized (common on Windows without a global install), prefix commands with **`npx`** — for example `npx supabase db push` — or install the CLI globally: `npm install -g supabase`.

1. Install the [Supabase CLI](https://supabase.com/docs/guides/cli). If you are not already authenticated, run `supabase login` once.
2. Link this repo to your cloud project (project ref is in the Supabase dashboard URL: `https://supabase.com/dashboard/project/<project-ref>`):

   `supabase link --project-ref <your-project-ref>`

3. Push migration files from `supabase/migrations/` to the remote database:

   `supabase db push`

   That applies any **pending** migrations in order. It does **not** run `seed.sql` on the remote project (seed is wired for local `db reset` in `config.toml`).

4. **Seed (optional, remote):** open the **SQL Editor** in the Supabase dashboard, paste the contents of `seed.sql`, and run it. The script is idempotent (`ON CONFLICT` / safe replays). Skip or edit rows if you already have production-like data you want to keep.

5. If your remote DB **already had tables created manually**, compare them to what the migrations define. `db push` only runs migration files Supabase has not recorded yet; if the live schema drifted from the repo, fix drift in a **new migration** or align the dashboard schema before adding new migrations.

### Local Supabase (Docker)

`supabase db reset` — recreates the local DB from migrations + `seed.sql` (requires Docker for local stack).

### Verify

After migrations (and seed if you ran it), in SQL Editor:

`select count(*) from public.employees where organization_id = '11111111-1111-1111-1111-111111111111';`

Expected: `3` only if you applied the default `seed.sql` for that org.

## Coverage vs app domains

- Auth/Org/RBAC: Yes
- People: Yes
- Time: Yes (`time_sessions`, `time_corrections`, `leave_requests`, `workday_rules`, `break_rules`, `fines`)
- Finance: Yes (`accounts`, `transactions`, `reimbursements`, `expense_reports`, `payroll_runs`, `payroll_postings`, `billing_invoices`, `loans`, `cost_centers`, `finance_reports`)
- Work (Execution OS): Yes (`projects`, `tasks`, `sprints`, `milestones`, `issues`, `task_dependencies`, `time_logs`)
- Communication: Yes (`channels`, `channel_members`, `messages`, `message_reactions`)
- Analytics: Yes (`activity_log`)
- Notifications: Yes (`notifications`, `notification_reads`)

## Next recommended migration set

1. Add stricter per-role write policies for finance and payroll tables (defense in depth on top of org isolation).
2. Add database functions/views for dashboard aggregates.
3. Add domain-specific seed records for local QA scenarios.
4. Add integration tests that verify cross-org access is denied for each protected table.
