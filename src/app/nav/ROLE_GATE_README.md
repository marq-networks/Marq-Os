# Role Gate System

## Overview

The role gate system enforces role-based access control using `NAV_MANIFEST` as the single source of truth. No duplication, no separate permission configs.

## Architecture

```
NAV_MANIFEST (navManifest.ts)
    ↓
canAccessPath (canAccessPath.ts) - Authorization Logic
    ↓
RouteGuard (RouteGuard.tsx) - Client-Side Enforcement
    ↓
Automatic Redirect to Safe Default
```

## Key Components

### 1. `/src/app/nav/canAccessPath.ts`
**Single source of authorization logic**

```typescript
canAccessPath(role: Role, path: string): boolean
```

- Traverses NAV_MANIFEST to check if path exists AND role is allowed
- Public routes (like `/login`) always return true
- Unknown paths return false (blocked by default)

```typescript
getDefaultRouteForRole(role: Role): string
```

- Returns safe default route for each role:
  - `employee` → `/work/my-work`
  - `org_admin` → `/finance/cockpit`
  - `platform_admin` → `/platform/billing`

```typescript
getAllAccessiblePaths(role: Role): string[]
```

- Returns all paths accessible by a role
- Useful for debugging and testing

### 2. `/src/app/components/RouteGuard.tsx`
**Client-side enforcement component**

- Wraps the entire application in App.tsx
- Listens to route changes via `useRouter()`
- Listens to role changes via `useCurrentRole()`
- On every navigation, checks `canAccessPath()`
- If blocked, redirects to safe default route
- Logs all blocked attempts to console

### 3. Cookie Synchronization
**Role synced to cookie for future middleware support**

The role is automatically synced to `workos_role` cookie in two places:

1. **On init** - `DevRoleSwitcher.tsx` `initRole()`
2. **On change** - `DevRoleSwitcher.tsx` `setCurrentRole()`

Cookie: `workos_role=${role}; path=/; max-age=31536000`

This enables future server-side middleware (if migrating to Next.js) to read the role and perform server-side redirects.

## How It Works

### When a user navigates:

1. User clicks a link or route changes
2. `RouteGuard` detects the change
3. `RouteGuard` calls `canAccessPath(currentRole, currentPath)`
4. `canAccessPath` traverses NAV_MANIFEST:
   - If path not found → return false
   - If path found but role not in `roles[]` → return false
   - If path found and role allowed → return true
5. If `canAccessPath` returns false:
   - Log warning to console
   - Call `getDefaultRouteForRole(currentRole)`
   - Navigate to safe default

### When a user switches role:

1. User clicks role switcher button
2. `setCurrentRole(newRole)` is called
3. Role is saved to localStorage
4. Role is saved to cookie
5. All listeners are notified (including `RouteGuard`)
6. `RouteGuard` re-checks current path with new role
7. If new role can't access current path, redirect to safe default

## Usage

### Check if a role can access a path:

```typescript
import { canAccessPath } from '@/app/nav/canAccessPath';

const hasAccess = canAccessPath('employee', '/finance/cockpit');
// Returns: false (employees can't access finance cockpit)

const hasAccess = canAccessPath('org_admin', '/finance/cockpit');
// Returns: true (org admins can access finance cockpit)
```

### Get all accessible paths for a role:

```typescript
import { getAllAccessiblePaths } from '@/app/nav/canAccessPath';

const employeePaths = getAllAccessiblePaths('employee');
// Returns: ['/work/my-work', '/time/my-day', '/time/leave', ...]
```

### Get default route for a role:

```typescript
import { getDefaultRouteForRole } from '@/app/nav/canAccessPath';

const defaultRoute = getDefaultRouteForRole('employee');
// Returns: '/work/my-work'
```

## Adding New Routes

**IMPORTANT**: When adding new routes, you must:

1. Add the route to `NAV_MANIFEST` with proper `roles: []` array
2. Add the route to `App.tsx` routing
3. **DO NOT** add anything to `canAccessPath.ts` - it automatically reads from NAV_MANIFEST

### Example:

```typescript
// In navManifest.ts
{
  key: 'finance-new-feature',
  label: 'New Feature',
  path: '/finance/new-feature',
  roles: ['org_admin'], // Only org admins can access
}
```

```tsx
// In App.tsx
<Route path="/finance/new-feature"><NewFeature /></Route>
```

Done! The role gate automatically enforces access based on NAV_MANIFEST.

## Public Routes

Public routes that don't require authentication or role checking:

- `/login`
- `/signup`
- `/forgot-password`
- `/reset-password`

These are defined in `PUBLIC_ROUTES` array in `canAccessPath.ts`.

## Testing

### Test role switching:

1. Set `NEXT_PUBLIC_SHOW_ROLE_SWITCHER=true` in `.env`
2. Open app, see role switcher in bottom-right
3. Switch between roles
4. Watch console for `[RouteGuard]` logs showing blocked/allowed access
5. Verify redirects to safe defaults when blocked

### Test blocked access:

1. As `employee`, try to navigate to `/finance/cockpit`
2. Should see console warning: `Access denied: employee cannot access /finance/cockpit`
3. Should see console log: `Redirecting to: /work/my-work`
4. Should auto-redirect to `/work/my-work`

## Future: Server-Side Middleware

When migrating to Next.js, you can add middleware at `/middleware.ts`:

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { canAccessPath } from '@/app/nav/canAccessPath';

export function middleware(request: NextRequest) {
  const role = request.cookies.get('workos_role')?.value || 'employee';
  const path = request.nextUrl.pathname;
  
  if (!canAccessPath(role, path)) {
    const defaultRoute = getDefaultRouteForRole(role);
    return NextResponse.redirect(new URL(defaultRoute, request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

This would enforce access control at the server level before the page even loads.

## Benefits

✅ **Single Source of Truth** - NAV_MANIFEST defines both navigation AND permissions
✅ **Zero Duplication** - No separate permission configs to maintain
✅ **Automatic Enforcement** - RouteGuard enforces globally
✅ **Safe Defaults** - Always redirects to role-appropriate pages
✅ **Developer Friendly** - Console logs show exactly what's blocked and why
✅ **Future Ready** - Cookie sync enables server-side middleware
✅ **Type Safe** - TypeScript ensures role/path correctness

## Debugging

### Check console logs:

All access checks are logged:

```
[RouteGuard] Access denied: employee cannot access /finance/cockpit
[RouteGuard] Redirecting to: /work/my-work
```

### Verify cookie:

Open DevTools → Application → Cookies → Check `workos_role` value

### Test a specific path:

```typescript
import { canAccessPath } from '@/app/nav/canAccessPath';

console.log(canAccessPath('employee', '/finance/cockpit')); // false
console.log(canAccessPath('org_admin', '/finance/cockpit')); // true
```
