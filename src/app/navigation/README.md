# Navigation System - Single Source of Truth

## 📋 Overview

This directory contains the **ONLY** files that define navigation and routing in the WorkOS system. All sidebar menus, routes, and role-based access control flow from these files.

**CRITICAL RULE:** Never add navigation items, routes, or sidebar items anywhere else. This is the skeleton.

## 🗂️ File Structure

### `/src/app/nav/navManifest.ts`
**Purpose:** Defines the navigation tree structure and role-based visibility

**Contains:**
- `NAV_MANIFEST`: Complete navigation tree with OS layers
- Domain labels (e.g., "EXECUTION OS", "BUSINESS OS (FINANCE)")
- Child menu items with paths
- Role assignments (`employee`, `org_admin`, `platform_admin`)
- Badge counts
- Helper functions for path extraction

**DO NOT:**
- Add navigation items anywhere else
- Create duplicate navigation structures
- Hardcode sidebar items in components

### `/src/app/navigation/navRegistry.ts`
**Purpose:** Maps navigation paths to React components

**Contains:**
- `ROUTE_REGISTRY`: Path-to-component mappings
- Component imports (ONLY place to import screen components for routing)
- Placeholder definitions for unimplemented features
- Helper functions for route lookup
- Default home routes per role

**DO NOT:**
- Import screen components in App.tsx directly
- Create routes that don't exist in navManifest.ts
- Skip the ComingSoon placeholder for unimplemented features

### `/src/app/nav/getNavForRole.ts`
**Purpose:** Filters navigation by role

**Contains:**
- `getNavForRole()`: Filters NAV_MANIFEST by role
- `getDefaultRouteForRole()`: Returns home route per role
- `isPathAllowedForRole()`: Checks path access

## 🎯 WorkOS Navigation Structure

The navigation follows this OS layer structure:

### For **ORG ADMIN**:
```
EXECUTION OS
  ├─ My Work
  ├─ Projects
  ├─ Tasks
  ├─ Milestones
  ├─ Assignments
  └─ Work Reports

ORGANIZATION OS
  ├─ Employees
  ├─ Members
  ├─ Departments
  └─ Roles & Access

TIME TRACKING
  ├─ Time Logs
  ├─ Leave
  ├─ Corrections (badge: 3)
  ├─ Sessions
  ├─ Break Rules
  ├─ Leave Management
  ├─ Leave Approvals (badge: 7)
  └─ Fines Management

BUSINESS OS (FINANCE)
  ├─ Finance Cockpit
  ├─ Inbox & Approvals (badge: 3)
  ├─ Quick Add
  ├─ Ledger
  ├─ Intelligence
  ├─ Accounts & Wallets
  ├─ Import Center
  ├─ Review & Decide
  ├─ Reimbursements
  ├─ Payroll Posting
  ├─ Costing & Profit
  ├─ Reports
  ├─ Loans & Liabilities
  ├─ Team Permissions
  └─ Finance Settings

COMMUNICATION
  ├─ Inbox (badge: 12)
  └─ Chat

INTELLIGENCE OS
  ├─ Activity
  └─ Reports

SECURITY & COMPLIANCE
  ├─ Consent & Privacy
  ├─ Data Retention
  ├─ Audit Logs
  └─ Security Settings

PLATFORM OS
  ├─ Platform Settings
  └─ Billing

INTEGRATIONS
  ├─ Integrations
  └─ API Documentation
```

### For **EMPLOYEE**:
```
EXECUTION OS
  └─ My Work

TIME TRACKING
  ├─ My Day
  ├─ Time Logs
  ├─ Leave
  └─ My Fines

COMMUNICATION
  ├─ Inbox (badge: 12)
  └─ Chat

INTELLIGENCE OS
  ├─ Activity
  └─ Reports (if org_admin)
```

### For **PLATFORM ADMIN**:
```
PLATFORM OS
  ├─ Billing
  └─ Billing Plans

INTEGRATIONS
  ├─ Integrations
  └─ API Documentation
```

## 🔒 Role-Based Access

| Role | Home Route | Sidebar Domains |
|------|-----------|----------------|
| `employee` | `/work/my-work` | EXECUTION OS, TIME TRACKING, COMMUNICATION, INTELLIGENCE OS |
| `org_admin` | `/finance/cockpit` | All domains (full access) |
| `platform_admin` | `/platform/billing` | PLATFORM OS, INTEGRATIONS |

## ✅ Adding a New Screen

### Step 1: Add to navManifest.ts
```typescript
// Inside appropriate domain's children array
{
  key: 'finance-new-feature',
  label: 'New Feature',
  path: '/finance/new-feature',
  roles: ['org_admin'],
  badge: 5, // optional
},
```

### Step 2: Add to navRegistry.ts

**Option A: Real Component**
```typescript
// Import at top
import { NewFeature } from '../components/screens/finance/NewFeature';

// Add to ROUTE_REGISTRY
{
  path: '/finance/new-feature',
  component: NewFeature,
  roles: ['org_admin'],
},
```

**Option B: Coming Soon Placeholder**
```typescript
{
  path: '/finance/new-feature',
  placeholder: true,
  placeholderTitle: 'New Feature',
  placeholderDescription: 'This feature will allow you to...',
  placeholderRelatedPath: '/finance/cockpit',
  placeholderRelatedLabel: 'Finance Cockpit',
  roles: ['org_admin'],
},
```

### Step 3: That's it!
The system automatically:
- ✅ Shows in sidebar (if user has role)
- ✅ Creates route
- ✅ Applies role guards
- ✅ Redirects unauthorized users

## 🚫 What NOT to Do

❌ **DON'T** add navigation items in:
- `SidebarNav.tsx`
- `DynamicSidebar.tsx`
- `App.tsx` (except reading from registry)
- `/src/app/data/navigation.ts` (legacy file)

❌ **DON'T** create hardcoded route blocks in App.tsx:
```typescript
// ❌ BAD - Don't do this
<Route path="/finance/new-thing"><NewThing /></Route>
```

✅ **DO** use the registry:
```typescript
// ✅ GOOD - Routes generated from registry
{ROUTE_REGISTRY.map(route => (
  <Route key={route.path} path={route.path}>
    {route.component ? <route.component /> : <ComingSoon {...placeholderProps} />}
  </Route>
))}
```

❌ **DON'T** create "Skeleton Stub" or blank pages:
```typescript
// ❌ BAD
export function SomeFeature() {
  return <div>Not implemented</div>;
}
```

✅ **DO** use ComingSoon placeholder:
```typescript
// ✅ GOOD - Define in navRegistry.ts with placeholder: true
```

## 🔄 Migration Checklist

If you're restoring the navigation structure:

- [ ] Verify navManifest.ts has correct domain labels
- [ ] Ensure all paths in navManifest exist in navRegistry
- [ ] Confirm no routes in App.tsx outside of registry
- [ ] Check DynamicSidebar reads from getNavForRole()
- [ ] Remove any hardcoded navigation arrays
- [ ] Delete legacy navigation.ts items not in manifest
- [ ] Test role switching (no duplicates, no menu merging)
- [ ] Verify unauthorized routes redirect properly
- [ ] Confirm all sidebar items route somewhere (real or ComingSoon)

## 🎨 Sidebar Rendering

The `DynamicSidebar` component:
1. Reads current role from role store
2. Calls `getNavForRole(role)` to filter NAV_MANIFEST
3. Renders domain headers (uppercase labels)
4. Shows children as menu items
5. Highlights active path
6. Displays badges

**The sidebar is FULLY DYNAMIC** - no hardcoded items.

## 🛡️ Route Guards

Route protection happens in two layers:

1. **Sidebar Visibility:** `getNavForRole()` filters menu items
2. **Route Access:** `RouteGuard` component checks `canAccessPath()`

Unauthorized access → Redirect to role's default home

## 📊 Route Verification

Diagnostic tool at `/diagnostics/route-verification` shows:
- All navigation items per role
- Which have real components
- Which use ComingSoon
- Any broken routes

## 🆘 Troubleshooting

### Problem: Duplicate menu items on role switch
**Cause:** Multiple navigation sources (old + new)
**Fix:** Remove legacy navigation arrays, use ONLY NAV_MANIFEST

### Problem: Blank/stub pages showing
**Cause:** Route exists but component not in navRegistry
**Fix:** Add placeholder definition to navRegistry.ts

### Problem: Menu item doesn't appear
**Cause:** Not in navManifest or role not assigned
**Fix:** Add to navManifest with correct roles array

### Problem: Can access routes not in sidebar
**Cause:** Routes defined outside registry
**Fix:** Remove rogue routes, use ONLY navRegistry.ts

## 🔐 Security Notes

- Never trust client-side role checks alone
- Backend must validate all role-based permissions
- Routes are for UX only, not security boundaries
- Sensitive data requires server-side authorization

## 📝 Maintenance

**When adding features:**
1. Update navManifest.ts first (design sidebar structure)
2. Update navRegistry.ts second (map to components)
3. Never touch App.tsx routing logic

**When refactoring:**
- Navigation structure changes ONLY in navManifest.ts
- Component imports ONLY in navRegistry.ts
- Keep the single source of truth

## 🎯 Summary

**One Rule:**
> All navigation flows from navManifest.ts → navRegistry.ts → DynamicSidebar

Follow this, and the navigation system will remain:
- ✅ Consistent
- ✅ Role-aware
- ✅ Maintainable
- ✅ Duplicate-free
- ✅ Placeholder-ready
