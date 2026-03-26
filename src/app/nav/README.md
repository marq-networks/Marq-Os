# Navigation Manifest System

This directory contains the **single source of truth** for all navigation in the WorkOS application.

## Files

### `navManifest.ts`
The complete navigation skeleton for the entire system. Contains:
- All 9 OS layer domains (WORK, PEOPLE, TIME, FINANCE, COMMUNICATION, ANALYTICS, SECURITY, PLATFORM, INTEGRATIONS)
- All routes across all user roles
- Role-based access control for each navigation item
- Badge counts for items requiring attention

**Never add navigation items anywhere else.** This is the skeleton.

### `getNavForRole.ts`
Functions for filtering the navigation manifest by role:
- `getNavForRole(role)` - Returns filtered navigation tree for a specific role
- `getDefaultRouteForRole(role)` - Returns default landing route for a role
- `isPathAllowedForRole(path, role)` - Checks if a path is accessible to a role

### `index.ts`
Clean exports for the navigation system.

## Usage

### In Components

```tsx
import { useCurrentRole } from '../DevRoleSwitcher';
import { getNavForRole } from '../nav/getNavForRole';

function MyComponent() {
  const [currentRole] = useCurrentRole();
  const navItems = getNavForRole(currentRole);
  
  // Use navItems to render navigation
}
```

### Adding New Routes

1. **Add to navManifest.ts** - This is the ONLY place to add routes
2. **Add corresponding Route in App.tsx** - Wire up the component
3. **Create the screen component** - Build the UI

### Role Types

- `employee` - Employee view (personal workspace)
- `org_admin` - Organization admin (full org control)
- `platform_admin` - Platform admin (multi-org platform)

## Dev Role Switcher

The `DevRoleSwitcher` component provides development-time role switching:

```tsx
import { useCurrentRole } from './components/DevRoleSwitcher';

const [currentRole, setCurrentRole] = useCurrentRole();
```

**Environment Variable:** Set `NEXT_PUBLIC_SHOW_ROLE_SWITCHER=true` to show the role switcher UI.

## Navigation Coverage

Total routes in manifest: **49+** routes across 9 domains

All routes are role-filtered and the sidebar automatically shows only what's accessible to the current user.
