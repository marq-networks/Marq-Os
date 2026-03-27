# MARQ Development Roadmap (Execution Steps)

This is the implementation order to finish development with low rework.

## Status (living)

| Phase | Status | Notes |
|-------|--------|--------|
| **Phase 1 — Database foundation** | **Complete (2026-03-27)** | Migrations `202603260001`–`202603260004` + `202603270005_rls_identity_catalog.sql`. Single seed: `supabase/seed.sql` (org, permissions, demo role + grants, departments, employees). Run `supabase db reset` locally. Further schema changes: new migration + review. |
| Phase 2 — Backend core infrastructure | In progress | Typed config, unified errors, correlation logging, route → service → repo layering. |

## Phase 0 - Freeze architecture baseline (1 day)

- Confirm this architecture with your team.
- Freeze protected behavior: auth, billing, redirects, dashboard access.
- Decide source of truth for roles and permissions.
- Create issue board by domains (People, Time, Finance, Work, etc.).

## Phase 1 - Database foundation (3-5 days)

- Set up Supabase project (local + staging + production).
- Create initial migrations:
  - organizations, users, memberships, roles, permissions.
  - core domain tables (people/time/finance/work minimal shape).
- Add indexes, FK constraints, and enum/check constraints.
- Enable RLS and apply baseline tenant policies.
- Add seed scripts for local development data.

Definition of done:

- Local DB bootstraps from migrations + seed.
- You can query all base entities per organization.

## Phase 2 - Backend core infrastructure (3-4 days)

- Add config loader and env validation.
- Add shared response/error format.
- Add request logging with correlation ID.
- Refactor API into layers:
  - routes -> services -> repositories.
- Keep endpoint paths stable under `/v1`.

Definition of done:

- API starts with typed config.
- Error handling is consistent across routes.

## Phase 3 - Auth + RBAC hardening (4-6 days)

- Replace demo login logic with real auth flow.
- Use secure token flow (short-lived access + refresh cookie).
- Enforce `organization_id` + `role` in middleware and service layer.
- Add permissions matrix for high-risk finance and admin actions.
- Add audit events for login, role switch, payroll posting, billing actions.

Definition of done:

- Unauthorized cross-org access is blocked.
- Role-based restricted actions are enforced server-side.

## Phase 4 - Domain APIs in priority order (2-4 weeks)

Recommended order:

1. People
2. Time
3. Finance
4. Work (Execution OS)
5. Communication
6. Analytics/Notifications

For each domain:

- Implement repository methods against Postgres.
- Implement service-layer business rules.
- Keep DTOs aligned with `src/app/services/contracts.ts`.
- Add pagination and search support.
- Add integration tests for critical endpoints.

Definition of done (per domain):

- CRUD and key workflows available via `/v1`.
- Endpoint responses match frontend contracts.

## Phase 5 - Frontend API cutover (1-2 weeks, parallelizable)

- Implement domain API adapters in `src/app/services/api`.
- Add runtime switch in service provider:
  - mock mode for fallback.
  - API mode for real backend.
- Start cutover by domain in same order as backend.
- Keep UI screens unchanged; only swap service implementations.

Definition of done:

- `USE_MOCK_SERVICES=false` works for migrated domains.
- No route or role regression.

## Phase 6 - End-to-end validation and regression hardening (1 week)

- Create regression suite for protected behavior:
  - login/logout
  - role switching
  - default redirects
  - route guard denial paths
  - billing/payroll actions
- Run smoke test for each role: employee, org_admin, platform_admin.
- Verify navigation parity:
  - all nav paths map to valid registered routes.

Definition of done:

- Critical user journeys pass in staging.
- No unauthorized route access.

## Phase 7 - Performance and security pass (3-5 days)

- Add API rate limiting for auth and sensitive writes.
- Add response caching where safe for read-heavy analytics.
- Audit N+1 queries and missing indexes.
- Harden CORS and origin allowlist by environment.
- Rotate secrets and enforce strict env separation.

Definition of done:

- Acceptable response times on core dashboards.
- Security checklist complete.

## Phase 8 - Release and operational readiness (2-3 days)

- Prepare deployment pipelines for web + API + migrations.
- Add rollback plan:
  - schema rollback strategy
  - feature toggles for domain cutover
- Add runbooks for common incidents.
- Enable monitoring dashboards and alerts.

Definition of done:

- Production deployment completed with monitored health.

---

## Weekly execution template

- Monday: architecture/issues grooming + migration planning.
- Tuesday-Thursday: feature implementation and tests.
- Friday: integration testing, bug fixes, and release prep.

## Daily workflow checklist

1. Pull latest and run local stack.
2. Pick one bounded ticket in one domain.
3. Implement backend change + test.
4. Implement/verify frontend adapter or screen behavior.
5. Run regression checks for affected protected zones.
6. Update architecture docs when flow changes.

## Suggested first 10 implementation tickets

1. Create Supabase migrations for auth + organizations + memberships.
2. Add RLS base policy template and org scoping helper.
3. Introduce backend config/env validation module.
4. Standardize API error and success response helpers.
5. Replace auth route demo fallback with strict credential/user checks.
6. Implement People repository and service using DB.
7. Implement People API adapter in frontend and switch People domain to real API.
8. Add integration tests for People endpoints and role constraints.
9. Implement Time sessions + corrections repository/service with org scoping.
10. Build regression script for login, route guard, and role redirects.

