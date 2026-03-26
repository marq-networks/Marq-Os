# MARQ project — agent roster

Use **one primary agent per task**. Rules live in `.cursor/rules/` (`.mdc`). Enable the matching rule in Cursor when you start a session, or rely on auto-attach via globs.

| Agent | Rule file | When to use |
|-------|-----------|-------------|
| **Architect / Brainkeeper** | `marq-agent-architect.mdc` | `architecture/`, `brain.json`, flow docs, cross-cutting decisions |
| **Frontend UI** | `marq-agent-ui.mdc` | Screens, layout, MUI/Radix/Tailwind, `components/` |
| **Navigation & RBAC** | `marq-agent-nav-rbac.mdc` | `nav/`, `navigation/`, `RouteGuard`, `router`, redirects |
| **Services & data** | `marq-agent-services.mdc` | `services/`, mock ↔ API swap, contracts, types |
| **QA / flow verification** | `marq-agent-qa.mdc` | Checklists, regressions, `flow_verification.md` |
| **Performance & stability** | `marq-agent-performance.mdc` | Bundle, render cost, errors, Vite config |
| **Security** | `marq-agent-security.mdc` | Auth, session storage, tokens, billing-sensitive surfaces |
| **Backend API (Express)** | `marq-agent-backend-api.mdc` | `apps/api/`, API routes, middleware, RBAC |
| **Database (Supabase)** | `marq-agent-database-supabase.mdc` | `supabase/` migrations, schema, RLS, seed |
| **API Contracts & DTOs** | `marq-agent-api-contracts.mdc` | Endpoint parity, shared types, response shapes |
| **DevOps / Deploy** | `marq-agent-devops-deploy.mdc` | env, scripts, local dev, deployment plumbing |

**Protected behavior** (do not change casually): signup, login, trial/paid flows, auth, billing, package assignment, redirects, dashboard access.

**Repo facts**: Vite + React; custom in-memory router; routes from `navRegistry` + `NAV_MANIFEST`; `RouteGuard` + `canAccessPath`.
