# MARQ System Architecture (Frontend, Backend, Database)

## 1) Architecture goals

- Keep the existing role-based navigation and guarded access behavior stable.
- Move from in-memory mock persistence to a real API + database without rewriting screens.
- Preserve service contracts so UI and backend can evolve independently.
- Introduce production-safe auth, tenancy, and auditing for finance/security flows.

## 2) High-level topology

```text
React App (Vite)
  -> Service Layer (contracts + API adapters)
  -> Express API (/v1)
  -> Supabase Postgres (RLS + migrations)
  -> Object storage (receipts, screenshots, exports)
  -> Background workers (emails, reports, scheduled jobs)
```

## 3) Frontend architecture

### 3.1 Core structure

- Entry/root: `src/main.tsx` -> `src/app/App.tsx`.
- Navigation truth:
  - `src/app/nav/navManifest.ts` (menu and role visibility)
  - `src/app/navigation/navRegistry.ts` (path -> screen mapping)
- Access control:
  - `src/app/components/RouteGuard.tsx`
  - `src/app/nav/canAccessPath.ts`
- Service boundary:
  - Contracts: `src/app/services/contracts.ts`
  - Current provider: `src/app/services/ServiceProvider.tsx` (in-memory)

### 3.2 Target frontend layers

1. `components/screens/*`: presentation and interaction only.
2. `services/contracts.ts`: stable API shape shared across mock and real adapters.
3. `services/api/*`: HTTP adapters that implement contracts per domain.
4. `state/*` and context: UI state, optimistic state, filter/sort/session state.
5. `navigation/*`: route generation and guard logic.

### 3.3 Frontend standards

- No screen should call `fetch()` directly.
- All data operations go through service contracts.
- Domain folders remain aligned with current domains:
  - work, people, time, finance, communication, analytics, security, platform, integrations.
- Keep protected surfaces strict: login, signup, billing, redirects, dashboard defaults.

## 4) Backend architecture (Express)

### 4.1 Current implementation baseline

- API app bootstrapping:
  - `apps/api/src/app.ts`
  - `apps/api/src/server.ts`
- Route modules exist for auth, people, time, communication, analytics, notifications, finance, work.
- JWT and auth middleware exist:
  - `apps/api/src/auth.ts`
  - `apps/api/src/middleware/authRequired.ts`

### 4.2 Target backend layers

1. `routes/` (transport): parse/validate request and map to use-cases.
2. `controllers/` or route handlers: orchestration and response mapping.
3. `services/` (domain use-cases): business rules, role checks, workflow transitions.
4. `repositories/` (data access): SQL/query logic only.
5. `lib/` (cross-cutting): auth, logger, errors, pagination, telemetry.

### 4.3 API standards

- Prefix all endpoints with `/v1`.
- DTO parity with frontend contract interfaces.
- Input validation with `zod` for all write endpoints.
- Error envelope standard:
  - `{"error": {"code": "...", "message": "...", "details": ...}}`
- Require auth for non-public endpoints.
- Enforce organization scoping for every query.

## 5) Database architecture (Supabase/Postgres)

## 5.1 Tenancy model

- Multi-tenant by `organization_id` on almost all business tables.
- `users` can belong to one or more organizations via membership table.
- Every protected table includes:
  - `id`, `organization_id`, `created_at`, `updated_at`, `created_by`, `updated_by`.

### 5.2 Core schema by domain

- Identity/RBAC:
  - `users`, `organizations`, `organization_memberships`, `roles`, `permissions`, `role_permissions`
- People:
  - `employees`, `departments`, `employee_roles`
- Time:
  - `time_sessions`, `time_corrections`, `leave_requests`, `workday_rules`, `break_rules`, `fines`
- Communication:
  - `channels`, `channel_members`, `messages`, `message_reactions`
- Analytics:
  - `activity_log`, materialized/reporting tables
- Finance:
  - `accounts`, `transactions`, `reimbursements`, `expense_reports`, `payroll_runs`, `payroll_postings`, `billing_invoices`, `loans`
- Work / Execution OS:
  - `projects`, `tasks`, `sprints`, `milestones`, `issues`, `task_dependencies`, `time_logs`
- Notifications:
  - `notifications`, `notification_reads`

### 5.3 Database constraints

- Unique constraints:
  - organization + slug/code uniqueness where applicable.
- FK constraints across all domain relations.
- Check constraints for status enums and money/quantity non-negative values.
- Indexes:
  - `(organization_id, created_at)` pattern on high-traffic tables
  - foreign keys
  - searchable fields used by list pages

### 5.4 Row-level security (RLS)

- Enable RLS on tenant tables.
- Policy baseline:
  - read/write only where `organization_id` matches claim.
  - role-specific policies for admin-only actions.
- Keep audit logs append-only for non-platform roles.

## 6) Auth and authorization model

- Auth provider: Supabase Auth (or existing JWT issuer while migrating).
- Access token carries:
  - `sub`, `organization_id`, `role`, `permissions_version`.
- Frontend stores only short-lived access token in memory/session strategy.
- Refresh token via secure HttpOnly cookie (production).
- Backend middleware validates token and injects auth context.
- Route-level role checks plus business-rule checks (defense in depth).

## 7) Data flow and integration pattern

1. Screen triggers action.
2. Service contract method called (`useServices()`).
3. API adapter sends request to Express `/v1`.
4. Backend validates, authorizes, writes/reads DB.
5. API returns DTO aligned to contract.
6. UI updates state and renders.

## 8) Non-functional architecture

### 8.1 Observability

- Structured logs with request ID and `organization_id`.
- Error tracking (Sentry or equivalent) for web + API.
- Basic metrics:
  - request latency, error rate, DB query latency.

### 8.2 Performance

- Backend pagination and filtering mandatory for list endpoints.
- Avoid over-fetching; add lightweight summary endpoints where needed.
- Use background jobs for report generation and heavy exports.

### 8.3 Security

- Input validation on every write endpoint.
- Enforce RBAC and tenant filters in services/repositories.
- Secrets only in environment variables.
- Audit high-risk actions: auth, billing, role changes, payroll posting.

## 9) Environment and deployment architecture

### 9.1 Environments

- local: Vite + Express + local Supabase.
- staging: mirror prod with test data.
- production: locked configs, monitoring, backups enabled.

### 9.2 Config variables

- Frontend: `VITE_API_BASE_URL`.
- API: `API_JWT_SECRET`, DB URL/keys, CORS origin allowlist.

### 9.3 Deployment units

- Web app: static build served via CDN/static host.
- API: container/service running Express.
- DB: Supabase managed Postgres + migrations.
- Worker: optional process for email/reports/scheduled tasks.

## 10) Migration strategy (mock -> real)

1. Keep service contracts unchanged.
2. Implement API adapters per domain in `src/app/services/api/*`.
3. Wire `ServiceProvider` to switch mock/api using `USE_MOCK_SERVICES`.
4. Replace in-memory API store with repository + Postgres data.
5. Migrate one domain at a time (People -> Time -> Finance -> Work).
6. Validate each phase with regression checklist before next cutover.

## 11) Protected zones checklist (must not regress)

- Login and logout behavior.
- Role persistence and default route redirection.
- Route guard and denied-route fallback.
- Billing and payroll posting workflows.
- Package assignment and dashboard access by role.

