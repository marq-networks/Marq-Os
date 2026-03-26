# MARQ Regression Cases
# WorkOS UI — Phase 13 Post-Hardening Audit
# Generated: 2026-03-07

---

## RC-001: Finance Hook Loads All 13 Sub-Domains on Mount
**Test:** Navigate to any finance screen → check network (when real API wired) for 13 parallel requests
**Expected:** 13 concurrent calls succeed, all finance state populated
**Regression trigger:** Adding a 14th finance sub-domain without adding its fetch to `useFinanceData()` refresh()
**Source:** `hooks.ts` lines 385–426
**Guard:** After any IFinanceService expansion, verify `refresh()` in `useFinanceData()` calls the new method.

---

## RC-002: Role Switch Clears All Service State
**Test:** Switch from org_admin → employee via DevRoleSwitcher → verify finance data does not leak to employee view
**Expected:** Role change triggers re-render, employee does not see admin finance data
**Regression trigger:** ServiceProvider state persists across role switches (it's a single React context instance)
**Source:** `App.tsx` (DevRoleSwitcher), `ServiceProvider.tsx` (state initialization)
**Guard:** Confirm RouteGuard blocks admin paths for employee role.

---

## RC-003: Leave Request Status Update Propagates to Approvals Screen
**Test:** Employee submits leave → admin navigates to A12LeaveApprovals → new request appears
**Expected:** In-memory state shared via useTimeData() — both screens read the same data array
**Regression trigger:** If LeaveApprovals uses a local useState copy instead of the shared hook
**Source:** `hooks.ts` lines 130–213, `admin/A12LeaveApprovals.tsx`, `employee/E05Leave.tsx`

---

## RC-004: Notification Unread Count Sync
**Test:** Mark one notification read → verify bell badge count decrements by exactly 1
**Expected:** `unreadCount` decrements correctly, cannot go below 0
**Regression trigger:** `markAllAsRead()` and individual `markAsRead()` use separate decrement paths
**Source:** `hooks.ts` lines 309–326 — confirmed Math.max(0, prev-1) guard in place

---

## RC-005: ExecutionOS Task Status Change Isolated from Service Layer
**Test:** Change a task status in WorkTasksOS → verify it does NOT appear in any ServiceProvider-based screen
**Expected:** ExecutionOS UI state is fully isolated — no cross-contamination
**Regression trigger:** If ExecutionOSContext is ever merged into ServiceProvider without updating all consumer imports
**Source:** `contexts/ExecutionOSContext.tsx` — fully isolated React context (UI layer)
**Phase 14 note:** `ExecutionOSMockService.ts` NOW maintains a parallel in-memory copy of work data for the service contract layer. The two stores are intentionally separate. Merging them is SWAP_GUIDE Step 5.

---

## RC-006: Payroll Run Processing Updates Status Badge
**Test:** Process a payroll run → verify status changes from 'Draft' to 'Processed' in the list
**Expected:** `processPayrollRun()` returns updated run, `setPayrollRuns(prev => prev.map(...))` applied
**Source:** `hooks.ts` lines 430–434, `admin/A24Payroll.tsx`

---

## RC-007: navRegistry canAccessPath Blocks Cross-Role Navigation
**Test:** As employee, manually navigate to `/org/finance/cockpit` → should be blocked
**Expected:** RouteGuard intercepts, redirects to employee default route
**Regression trigger:** New routes added to ROUTE_REGISTRY without correct `roles` array
**Source:** `navigation/navRegistry.ts` line 554 `canAccessPath()`, `components/RouteGuard.tsx`

---

## RC-008: Finance Inbox Unread Count Badge on Nav
**Test:** Navigate to Finance Inbox → badge shows count of unread items
**Expected:** `getUnreadInboxCount()` returns correct count matching unread FinanceInboxItems
**Source:** `contracts.ts` line 255 `getUnreadInboxCount()`, `hooks.ts` (note: no financeInboxUnreadCount state in useFinanceData — screen must call manually)
**Risk:** If hook doesn't expose unread count as state, nav badge cannot auto-update.

---

## RC-009: ExecutionOSService Registered in ServiceRegistry
**Test:** `useServices().executionOS` returns a non-null `IExecutionOSService` instance
**Expected:** `executionOS` is required in ServiceRegistry — TypeScript compiler enforces it
**Regression trigger:** Removing `executionOS: executionOSService` from ServiceProvider registry
**Source:** `services/contracts.ts` — `ServiceRegistry.executionOS: IExecutionOSService` (required)
**Guard:** TypeScript compile error if `executionOS` is removed from the registry object.

---

## RC-010: Auth Session Cleared on Tab Close
**Test:** Log in → close the browser tab → open a new tab → navigate to app URL
**Expected:** Login screen shown (sessionStorage was cleared when tab closed)
**Regression trigger:** If storage adapter in `AuthSession.ts` is changed back to `localStorage`
**Source:** `services/AuthSession.ts` — `const store = window.sessionStorage`
**Guard:** After any change to AuthSession.ts, verify `isAuthenticated()` returns false in a fresh tab.

---

## RC-011: goToPage() Re-fetches Correct Slice
**Test:** Call `goToPage(2)` in `usePeopleData` → verify `employees` contains records 201–400 (when mock has 200+ employees)
**Expected:** `page` state updates → `refresh()` re-runs with `{ page: 2, pageSize: MOCK_PAGE_SIZE }` → paginate() returns correct slice
**Regression trigger:** If `page` is removed from `refresh` useCallback dependency array
**Source:** `services/hooks.ts` — `refresh` depends on `[people, page]`