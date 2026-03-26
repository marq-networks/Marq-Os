# MARQ Failure Library
# WorkOS UI — Phase 13 Post-Hardening Audit
# Generated: 2026-03-07

---

## FL-001: Finance Screens in Three Directories ✅ CLOSED — Phase 14
**Severity:** MEDIUM → RESOLVED
**Fix applied:**
- `common/FinanceLedger.tsx` now re-exports `FC04LedgerControl as FinanceLedger` (was re-exporting legacy `screens/finance/FinanceLedger` using ledgerStore)
- `common/FinanceQuickAdd.tsx` now re-exports `F02QuickAddOperational as FinanceQuickAdd`
- `common/FinanceIntelligence.tsx` now re-exports `FC10FinanceIntelligence as FinanceIntelligence`
- All three legacy `screens/finance/*.tsx` screens marked DEPRECATED with removal notice for Phase 15
- `F04AccountsWallets` in `financeScreens.tsx` migrated from `mockAccounts` (legacy) to `useFinanceData().accounts` (service layer)

---

## FL-002: Dead Endpoints in config.ts ✅ CLOSED — Phase 14
**Severity:** LOW → RESOLVED
**Fix applied:** `FINANCE_BUDGETS` removed entirely (no screen, no service method). `FINANCE_INTELLIGENCE` retained with a `PENDING ENDPOINT` comment explaining it awaits a real AI backend. `WORK_REPORTS` retained with a `PENDING ENDPOINT` comment pointing to ExecutionOS migration path. `PAYROLL_POSTINGS` now fully wired (see FL-003).

---

## FL-003: PayrollPosting Endpoint Wired But No Service Method ✅ CLOSED — Phase 14
**Severity:** MEDIUM → RESOLVED
**Fix applied:** Added `PayrollPosting` + `PayrollPostingDept` types to `types.ts`. Added 5 methods to `IFinanceService` in `contracts.ts`. Added `mockPayrollPostings` (5 records) to `mockData.ts`. Added state + CRUD to `ServiceProvider.tsx`. Added HTTP methods to `FinanceApiService.ts`. Added `payrollPostings` state + 3 mutations to `hooks.ts`. Rewrote `FC06PayrollPosting.tsx` to consume `useFinanceData()` instead of hardcoded arrays.

---

## FL-004: ExecutionOS Domain Bypass of ServiceRegistry ✅ CLOSED — Phase 14
**Severity:** MEDIUM → RESOLVED
**Fix applied:**
- Created `services/ExecutionOSMockService.ts` — a TypeScript class implementing `IExecutionOSService` with its own in-memory state initialised from `workMockData`. Implements all 24 contract methods: getProjects, createProject, updateProject, deleteProject, getTasks, createTask, updateTask, deleteTask, changeTaskStatus, getSprints, createSprint, updateSprint, getMilestones, createMilestone, updateMilestone, deleteMilestone, getIssues, createIssue, updateIssue, getTeamMembers, getTimeLogs, createTimeLog, getDependencies, addDependency, removeDependency.
- Module-level singleton `executionOSService` instantiated once on app load.
- `ServiceProvider.tsx` imports and registers it as `executionOS` in the ServiceRegistry.
- `ServiceRegistry.executionOS` promoted from optional (`executionOS?`) to required (`executionOS`).
- `ExecutionOSContext.tsx` is intentionally retained as the UI-layer state manager (optimistic sync mutations, activityFeed, emails, skillRatings, burndown — richer state not needed in the API contract).
- **API swap path**: Replace `new ExecutionOSMockService()` with `new ExecutionOSApiService()` (HTTP). Then update `useExecutionOS()` to delegate persistence to the service. See SWAP_GUIDE.ts Step 5.

---

## FL-005: Duplicate "My Work" Navigation Items ✅ CLOSED — Phase 14
**Severity:** LOW → RESOLVED
**Fix applied:** Removed top-level `employee-my-work` entry from `navManifest.ts`. "My Work" now appears only once under the Execution OS group (`emp-work-my-work` → `/work/my-work`). Added inline comment explaining the removal.

---

## FL-006: No Input Validation in Service Layer ✅ CLOSED — Phase 14
**Severity:** MEDIUM → RESOLVED
**Fix applied:** Added `validatePayload()` runtime guard (no external dependency) to `ServiceProvider.tsx`. Applied to `createEmployee` (name, email, role), `createTransaction` (description, amount, accountId, type), `createReimbursement` (employeeId, description, amount), and `createPayrollPosting` (period, month, totalAmount, employeeCount). Errors throw with descriptive messages. SWAP NOTE: Replace with Zod schemas when wiring real backend.

---

## FL-007: Hooks Request pageSize:200 — Not Pagination-Ready ✅ CLOSED — Phase 14
**Severity:** MEDIUM → RESOLVED
**Fix applied:**
- Exported `MOCK_PAGE_SIZE = 200` constant from `hooks.ts` with a SWAP comment to reduce to 25 when connecting a real API.
- All `pageSize: 200` literals replaced with `MOCK_PAGE_SIZE`.
- Added pagination state (`page`, `totalCount`, `goToPage`) to 4 stateful domain hooks: `usePeopleData`, `useTimeData`, `useCommunicationData`, `useNotificationData`, `useFinanceData`.
- `page` state is a dependency of each `refresh()` callback — calling `goToPage(n)` triggers re-fetch automatically.
- `totalCount` populated from `PaginatedResponse.total` on every fetch.
- Mock behavior unchanged (pageSize:200 loads all records, page state defaults to 1).
- Real API behavior: lower MOCK_PAGE_SIZE, consumers call `goToPage(n)` for paging.

---

## FL-008: OrgAdminDashboard.tsx Possibly Orphaned ✅ CLOSED — Phase 14
**Severity:** LOW → RESOLVED
**Fix applied:** Confirmed OrgAdminDashboard.tsx was not referenced in navRegistry.ts ROUTE_REGISTRY. File deleted.

---

## FL-009: No Error Boundaries in Component Tree ✅ CLOSED — Phase 14
**Severity:** LOW → RESOLVED
**Fix applied:** Created `components/ErrorBoundary.tsx` class component with full recovery UI (try-again button, reload button, collapsible stack trace, destructive icon). Wraps `<Router>` in `App.tsx`. Includes comment for production error reporting (Sentry integration point).

---

## FL-010: Auth Stored in Unencrypted localStorage ✅ CLOSED — Phase 14
**Severity:** MEDIUM → IMPROVED (production swap documented)
**Fix applied:**
- Created `services/AuthSession.ts` — a dedicated auth session module with a storage adapter interface.
- Migrated from `localStorage` to `sessionStorage`: session cleared on tab/browser close, not shared between tabs, cannot be read cross-origin.
- All inline auth functions (`isAuthenticated`, `getAuthRole`, `setAuthenticated`, `clearAuth`) and constants (`AUTH_KEY`, `AUTH_ROLE_KEY`) removed from `App.tsx` and replaced with imports from `AuthSession.ts`.
- Full production swap documented in `AuthSession.ts`: POST to /api/auth/login → server sets HttpOnly cookie → no token readable by JS. CSRF Double-Submit pattern noted.
- **SWAP NOTE:** `AuthSession.ts` swap section documents the exact migration path to HttpOnly cookies + CSRF tokens. Storage adapter is isolated — no other file needs to change.