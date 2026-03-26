# Route Audit Report - Navigation System
**Date**: Current Session
**Status**: ✅ Complete

## Executive Summary

This audit identifies all route mismatches between `navManifest.ts` (navigation sidebar source of truth) and `navRegistry.ts` (route-to-component mapping). The system has **57 sidebar navigation items** defined in navManifest, but several are NOT properly mapped in navRegistry.

---

## Critical Issues Found

### 🔴 MISSING ROUTES (Not in navRegistry at all)

These routes exist in navManifest but have NO entry in navRegistry:

1. **Communication Domain**
   - `/comm/channels` - Channel management (org_admin only)
   - `/comm/bots` - Bots & Integrations (org_admin only)

2. **Time Domain**
   - `/time/workday-rules` - Workday Rules configuration (org_admin only)
   - `/time/offline-sync` - Offline synchronization management (org_admin only)

### 🟡 MISCONFIGURED ROUTES (Incorrect path mapping)

3. **Platform Domain**
   - navManifest defines: `/platform/settings`
   - navRegistry has: `/platform/org-settings` with placeholder: true
   - **Impact**: Clicking "Platform Settings" in sidebar results in 404 or wrong route

---

## Route-by-Route Analysis

### ✅ ADMIN Domain (2 routes)
- `/org/admin/dashboard` → ✓ A01AdminDashboard
- `/admin/live-activity` → ✓ A02LiveActivity

### ✅ WORK Domain (6 routes)
- `/work/my-work` → ✓ W01MyWork
- `/work/projects` → ✓ Placeholder (intentional)
- `/work/tasks` → ✓ Placeholder (intentional)
- `/work/milestones` → ✓ Placeholder (intentional)
- `/work/assignments` → ✓ Placeholder (intentional)
- `/work/reports` → ✓ Placeholder (intentional)

### ✅ PEOPLE Domain (4 routes)
- `/people/employees` → ✓ Placeholder (intentional)
- `/people/members` → ✓ A04Members
- `/people/departments` → ✓ A05Departments
- `/people/roles-access` → ✓ A06RolesAccess

### 🟡 TIME Domain (12 routes - 2 MISSING)
- `/time/my-day` → ✓ E02MyDay
- `/time/time-logs` → ✓ Placeholder (intentional)
- `/time/leave` → ✓ E05Leave
- `/time/my-fines` → ✓ ET01MyFines
- `/time/corrections` → ✓ A10Corrections
- `/time/sessions` → ✓ A07Sessions
- `/time/break-rules` → ✓ A09BreakRules
- `/time/workday-rules` → ❌ **MISSING FROM navRegistry**
- `/time/leave-management` → ✓ A11LeaveManagement
- `/time/leave-approvals` → ✓ A12LeaveApprovals
- `/time/fines-management` → ✓ AT01Fines
- `/time/offline-sync` → ❌ **MISSING FROM navRegistry**

### ✅ FINANCE Domain (15 routes - All present but many placeholders)
- `/finance/cockpit` → ✓ FC01FinanceCockpit
- `/finance/inbox` → ✓ FC02FinanceInbox
- `/finance/quick-add` → ✓ Placeholder (intentional)
- `/finance/ledger` → ✓ FinanceLedger
- `/finance/intelligence` → ✓ FinanceIntelligence
- `/finance/accounts-wallets` → ✓ Placeholder (intentional)
- `/finance/import-center` → ✓ Placeholder (intentional)
- `/finance/review-decide` → ✓ Placeholder (intentional)
- `/finance/reimbursements` → ✓ Placeholder (intentional)
- `/finance/payroll-posting` → ✓ Placeholder (intentional)
- `/finance/costing-profit` → ✓ Placeholder (intentional)
- `/finance/reports` → ✓ Placeholder (intentional)
- `/finance/loans-liabilities` → ✓ Placeholder (intentional)
- `/finance/team-permissions` → ✓ Placeholder (intentional)
- `/finance/settings` → ✓ Placeholder (intentional)

### 🔴 COMMUNICATION Domain (4 routes - 2 MISSING)
- `/comm/inbox` → ✓ Placeholder (intentional)
- `/comm/chat` → ✓ Placeholder (intentional)
- `/comm/channels` → ❌ **MISSING FROM navRegistry**
- `/comm/bots` → ❌ **MISSING FROM navRegistry**

### ✅ ANALYTICS Domain (7 routes)
- `/analytics/activity` → ✓ Placeholder (intentional)
- `/analytics/reports` → ✓ A19Reports
- `/analytics/analytics` → ✓ AnalyticsAnalytics
- `/analytics/activity-overview` → ✓ Placeholder (intentional)
- `/analytics/input-counters` → ✓ AnalyticsInputCounters
- `/analytics/screenshot-review` → ✓ AnalyticsScreenshotReview
- `/analytics/app-reports` → ✓ AnalyticsAppReports

### ✅ SECURITY & COMPLIANCE Domain (4 routes)
- `/security/consent-privacy` → ✓ A20Consent
- `/security/data-retention` → ✓ A21DataRetention
- `/security/audit-logs` → ✓ A22AuditLogs
- `/security/security` → ✓ A23Security

### 🟡 PLATFORM Domain (3 routes - 1 MISCONFIGURED)
- `/platform/settings` → ❌ **WRONG PATH** (navRegistry has `/platform/org-settings`)
- `/platform/billing` → ✓ S04PlatformBilling
- `/platform/billing-plans` → ✓ A26BillingPlans

### ✅ INTEGRATIONS Domain (2 routes)
- `/integrations/list` → ✓ IntegrationsIntegrations
- `/integrations/api-docs` → ✓ IntegrationsAPIDocs

---

## Impact Analysis

### User Experience Issues

1. **"Go back to dashboard" errors**
   - Caused by clicking sidebar items that route to MISSING routes
   - Affects: Communication (Channels, Bots), Time (Workday Rules, Offline Sync)

2. **404 or Wrong Page**
   - Caused by path mismatch between navManifest and navRegistry
   - Affects: Platform Settings

### Missing Components vs Missing Routes

**Missing Routes** (Routes not in navRegistry at all):
- `/comm/channels`
- `/comm/bots`
- `/time/workday-rules`
- `/time/offline-sync`

**Existing Components That Could Be Used**:
- `A08WorkdayRules` component exists → can be mapped to `/time/workday-rules`
- `A17OfflineSync` component exists → can be mapped to `/time/offline-sync`
- Need to check if Channel/Bot components exist

---

## Recommended Actions

### Phase 1: Fix Missing Route Mappings (Critical - fixes crashes)
1. Add `/comm/channels` to navRegistry
2. Add `/comm/bots` to navRegistry
3. Add `/time/workday-rules` to navRegistry (map to A08WorkdayRules)
4. Add `/time/offline-sync` to navRegistry (map to A17OfflineSync)

### Phase 2: Fix Path Misconfigurations
5. Fix `/platform/settings` path mismatch in navRegistry

### Phase 3: Validate Finance Placeholders
6. Verify all 10 placeholder finance routes show proper ComingSoon pages

### Phase 4: Build Missing Communication Screens
7. Create Channel Management screen for `/comm/channels`
8. Create Bots & Integrations screen for `/comm/bots`

---

## Component Availability Check

Components that EXIST and can be mapped immediately:
- ✅ `A08WorkdayRules` → `/time/workday-rules`
- ✅ `A17OfflineSync` → `/time/offline-sync`

Components that MAY exist (need verification):
- ❓ Channel management component
- ❓ Bot integration component

---

## Success Criteria

After fixes are complete:
- [ ] All 57 navManifest routes have entries in navRegistry
- [ ] No route path mismatches between the two files
- [ ] Clicking any sidebar item either shows real screen OR proper ComingSoon page
- [ ] Zero "Go back to dashboard" errors
- [ ] Zero 404 errors from sidebar navigation

---

## Files Modified

- `/src/app/navigation/navRegistry.ts` - Add missing routes, fix paths
- Potentially create new components in `/src/app/components/screens/`
