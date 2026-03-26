/**
 * ═══════════════════════════════════════════════════════════════════════════
 * API SWAP GUIDE — How to Connect a Real Backend in ~2-4 Hours
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * This file is DOCUMENTATION ONLY. It doesn't run. It explains exactly how
 * to replace the in-memory mock data with a real API or database.
 *
 * ARCHITECTURE OVERVIEW:
 * ─────────────────────
 *   UI Components  →  React Hooks  →  Service Contracts  →  Implementations
 *   (56+ screens)     (hooks.ts)      (contracts.ts)         ↙         ↘
 *                                                     MockProvider   ApiService
 *                                                    (current)      (ready to use)
 *
 * ZERO UI changes needed. Every screen calls hooks → hooks call services
 * → services are interchangeable.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * STEP-BY-STEP SWAP INSTRUCTIONS
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │ STEP 1: Configure your API endpoint (5 minutes)                      │
 * ├───────────────────────────────────────────────────────────────────────┤
 * │                                                                       │
 * │ File: /src/app/services/config.ts                                     │
 * │                                                                       │
 * │ 1. Set USE_MOCK_SERVICES = false                                      │
 * │ 2. Set API_BASE_URL = 'https://your-api.com/v1'                      │
 * │    (or use VITE_API_BASE_URL env var)                                 │
 * │ 3. Verify ENDPOINTS match your API route structure                    │
 * │    (rename if your backend uses different paths)                      │
 * │                                                                       │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │ STEP 2: Choose your swap strategy (pick ONE)                          │
 * ├───────────────────────────────────────────────────────────────────────┤
 * │                                                                       │
 * │ OPTION A: Use the pre-built API classes (FASTEST — 30 min)            │
 * │ ─────────────────────────────────────────────────────                  │
 * │ All 7 API service classes already exist in /src/app/services/api/:    │
 * │                                                                       │
 * │   AuthApiService.ts          → IAuthService                           │
 * │   PeopleApiService.ts        → IPeopleService                         │
 * │   TimeApiService.ts          → ITimeService                           │
 * │   CommunicationApiService.ts → ICommunicationService                  │
 * │   AnalyticsApiService.ts     → IAnalyticsService                      │
 * │   NotificationApiService.ts  → INotificationService                   │
 * │   FinanceApiService.ts       → IFinanceService                        │
 * │                                                                       │
 * │ They extend ApiService.ts (fetch wrapper with auth headers,           │
 * │ timeout, and error handling) and implement the exact same             │
 * │ interfaces the mock does.                                              │
 * │                                                                       │
 * │ Just update ServiceProvider.tsx (see Step 3).                          │
 * │                                                                       │
 * │                                                                       │
 * │ OPTION B: Use Supabase (1-2 hours)                                    │
 * │ ──────────────────────────────────                                     │
 * │ Create a Supabase project, then implement each service interface      │
 * │ using @supabase/supabase-js:                                          │
 * │                                                                       │
 * │   import { createClient } from '@supabase/supabase-js';              │
 * │   const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);    │
 * │                                                                       │
 * │   class SupabasePeopleService implements IPeopleService {             │
 * │     async getEmployees(params) {                                       │
 * │       const { data, count } = await supabase                          │
 * │         .from('employees')                                             │
 * │         .select('*', { count: 'exact' })                              │
 * │         .range(offset, offset + pageSize - 1);                        │
 * │       return { data, total: count, page, pageSize, hasMore };         │
 * │     }                                                                  │
 * │   }                                                                    │
 * │                                                                       │
 * │                                                                       │
 * │ OPTION C: Use any REST/GraphQL API (2-4 hours)                        │
 * │ ─────────────────────────────────────────────                          │
 * │ Create your own service classes implementing the contracts.           │
 * │ See PeopleApiService.ts as the template.                              │
 * │                                                                       │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │ STEP 3: Wire up ServiceProvider.tsx (15 minutes)                      │
 * ├───────────────────────────────────────────────────────────────────────┤
 * │                                                                       │
 * │ File: /src/app/services/ServiceProvider.tsx                           │
 * │                                                                       │
 * │ Replace the inline mock objects with real service instances:           │
 * │                                                                       │
 * │   // BEFORE (mock):                                                    │
 * │   const peopleService = { getEmployees: async (params) => ... };      │
 * │                                                                       │
 * │   // AFTER (real):                                                     │
 * │   import { PeopleApiService } from './api';                           │
 * │   const peopleService = new PeopleApiService();                       │
 * │                                                                       │
 * │ Do this for all 7 services. The registry shape stays the same:        │
 * │                                                                       │
 * │   const registry: ServiceRegistry = {                                 │
 * │     auth:           new AuthApiService(),                             │
 * │     people:         new PeopleApiService(),                           │
 * │     time:           new TimeApiService(),                             │
 * │     communication:  new CommunicationApiService(),                    │
 * │     analytics:      new AnalyticsApiService(),                        │
 * │     notifications:  new NotificationApiService(),                     │
 * │     finance:        new FinanceApiService(),                          │
 * │   };                                                                   │
 * │                                                                       │
 * │ Remove all useState() mock stores and mockData imports.               │
 * │                                                                       │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │ STEP 4: Wire up ExecutionOS (Work domain) — 30 minutes                │
 * ├───────────────────────────────────────────────────────────────────────┤
 * │                                                                       │
 * │ File: /src/app/contexts/ExecutionOSContext.tsx                         │
 * │                                                                       │
 * │ This domain uses its own React context (not the ServiceProvider).     │
 * │ To swap:                                                               │
 * │                                                                       │
 * │ 1. Create ExecutionOSApiService.ts implementing IExecutionOSService   │
 * │ 2. In ExecutionOSContext.tsx, replace useState + mock imports with:    │
 * │    - API calls on mount (useEffect + fetch)                           │
 * │    - Mutations that POST/PATCH then refetch                           │
 * │ 3. Or merge it into the main ServiceRegistry:                         │
 * │    - Add executionOS to ServiceRegistry                               │
 * │    - Create useExecutionOSData() hook in hooks.ts                     │
 * │    - Update all imports from useExecutionOS → useExecutionOSData      │
 * │                                                                       │
 * │ The IExecutionOSService contract is already defined in contracts.ts.  │
 * │ API endpoints are already defined in config.ts.                       │
 * │                                                                       │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │ STEP 5: Set up auth (15 minutes)                                      │
 * ├───────────────────────────────────────────────────────────────────────┤
 * │                                                                       │
 * │ The ApiService.ts base class already reads a JWT from localStorage:   │
 * │                                                                       │
 * │   localStorage.getItem('workos_auth_token')                           │
 * │                                                                       │
 * │ It attaches it as: Authorization: Bearer <token>                      │
 * │                                                                       │
 * │ After your login API returns a token, store it:                       │
 * │   localStorage.setItem('workos_auth_token', response.token);          │
 * │                                                                       │
 * │ The LoginScreen.tsx already calls authService.login(). Just make      │
 * │ your AuthApiService POST to your real login endpoint.                 │
 * │                                                                       │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * DATABASE SCHEMA REFERENCE
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Your database tables should match the TypeScript interfaces in types.ts.
 * Here's a quick summary of the 29 tables you'll need (20 core + 8 Phase 13 + 1 Phase 14):
 *
 * CORE:
 *   users            → AuthUser
 *   organizations    → Organization
 *
 * PEOPLE:
 *   employees        → Employee
 *   departments      → Department
 *   roles            → RoleDefinition
 *
 * TIME:
 *   time_sessions    → TimeSession
 *   time_corrections → TimeCorrection
 *   leave_requests   → LeaveRequest
 *   leave_balances   → LeaveBalance
 *   workday_rules    → WorkdayRule
 *   break_rules      → BreakRule
 *   fines            → Fine
 *
 * COMMUNICATION:
 *   channels         → Channel
 *   messages         → Message
 *
 * ANALYTICS:
 *   activity_log     → ActivityLogEntry
 *   productivity     → ProductivityMetric
 *   app_usage        → AppUsageReport
 *
 * NOTIFICATIONS:
 *   notifications    → Notification
 *
 * FINANCE (Phase 8):
 *   payroll_runs     → PayrollRun
 *   payslips         → Payslip
 *   billing_invoices → BillingInvoice
 *   offline_sync     → OfflineSyncRecord
 *   screenshots      → ScreenshotRecord
 *
 * FINANCE EXTENDED (Phase 13) — 8 new tables:
 *   finance_transactions → FinanceTransaction
 *   finance_accounts     → FinanceAccount
 *   reimbursements       → Reimbursement
 *   loans_liabilities    → LoanLiability
 *   finance_inbox        → FinanceInboxItem
 *   cost_centers         → CostCenter
 *   expense_reports      → ExpenseReport
 *   expense_line_items   → ExpenseLineItem (child of expense_reports)
 *   finance_reports      → FinanceReport
 *
 * FINANCE EXTENDED (Phase 14 — gap closure) — 1 new table:
 *   payroll_postings     → PayrollPosting  (+ payroll_posting_depts for line items)
 *
 * WORK / EXECUTION OS (Phase 12):
 *   projects         → Project
 *   tasks            → Task
 *   sprints          → Sprint
 *   milestones       → Milestone
 *   issues           → Issue
 *   team_members     → TeamMember
 *   time_logs        → TimeLog (work domain)
 *   task_lists       → TaskList
 *   task_dependencies→ TaskDependency
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * PHASE 13 — FINANCE EXTENDED PROGRESSIVE SWAP
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * The 8 new finance sub-domains (Transactions, Accounts, Reimbursements,
 * Loans, Inbox, CostCenters, ExpenseReports, FinanceReports) can be swapped
 * independently. Each one follows the same pattern:
 *
 *   1. Create a Supabase table (or REST endpoint) matching the TypeScript type
 *   2. In FinanceApiService.ts, the method already exists — just verify
 *      the endpoint path in ENDPOINTS matches your backend
 *   3. The mock in ServiceProvider.tsx handles all mutations in-memory;
 *      replace with FinanceApiService once your backend is ready
 *
 * ─── Recommended Phase 13 swap order ──────────────────────────────────
 *   A. Finance Accounts (stateless read, good first test)
 *   B. Transactions     (core ledger — high value)
 *   C. Reimbursements   (employee-facing, easy to validate)
 *   D. Expense Reports  (admin workflow)
 *   E. Cost Centers     (analytics, read-mostly)
 *   F. Finance Inbox    (action queue)
 *   G. Loans            (low-frequency, admin only)
 *   H. Finance Reports  (generated server-side, async)
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * FILES YOU'LL TOUCH (and files you WON'T)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * MODIFY (~20% of codebase):
 *   /src/app/services/config.ts           — API URL, USE_MOCK_SERVICES flag
 *   /src/app/services/ServiceProvider.tsx  — Swap mock → real instances
 *   /src/app/services/api/*.ts            — Adjust endpoints if needed
 *   /src/app/contexts/ExecutionOSContext.tsx — Swap mock → real for Work
 *
 * NEVER TOUCH (stays exactly the same):
 *   /src/app/services/contracts.ts        — Interface definitions (read-only)
 *   /src/app/services/types.ts            — Type definitions (read-only)
 *   /src/app/services/hooks.ts            — React hooks (read-only)
 *   /src/app/components/screens/**        — ALL 56+ screen components
 *   /src/app/components/shared/**         — Shared building blocks
 *   /src/app/components/shell/**          — AppShell, navigation
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * PROGRESSIVE SWAP (recommended)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * You don't have to swap everything at once. Swap one domain at a time:
 *
 * 1. Start with Auth  (login flow, token storage)
 * 2. Then People      (employees, departments — most screens depend on this)
 * 3. Then Time        (sessions, leave, fines — standalone domain)
 * 4. Then Finance     (payroll, billing — standalone domain)
 * 5. Then Work/ExOS   (projects, tasks — standalone context)
 * 6. Then remaining   (analytics, comms, notifications)
 *
 * Each domain can be swapped independently. The mock and real can coexist
 * because they implement the same interfaces.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * ENVIRONMENT VARIABLES
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Create a .env file at the project root:
 *
 *   VITE_API_BASE_URL=https://api.yourworkos.com/v1
 *   VITE_SUPABASE_URL=https://xxx.supabase.co       (if using Supabase)
 *   VITE_SUPABASE_ANON_KEY=eyJ...                    (if using Supabase)
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

// This file is documentation only — no exports needed.
export {};