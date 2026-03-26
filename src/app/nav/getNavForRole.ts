/**
 * ═══════════════════════════════════════════════════════════════════════════
 * NAV ROLE UTILITIES
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { NAV_MANIFEST } from './navManifest';
import type { Role, NavItem } from './navManifest';
import { isPathAllowedForRole as isPathAllowed } from '../data/roleConfig';
import type { RoleKey } from '../state/roleStore';

/**
 * Get navigation items filtered by role
 */
export function getNavForRole(role: Role): NavItem[] {
  return NAV_MANIFEST.filter(item => item.roles.includes(role));
}

/**
 * Get default route for a role
 */
export function getDefaultRouteForRole(role: Role): string {
  const defaults: Record<Role, string> = {
    employee: '/work/my-work',
    org_admin: '/org/admin/dashboard',
    platform_admin: '/super/console',
  };
  
  return defaults[role];
}

/**
 * Re-export isPathAllowedForRole from roleConfig for convenience
 */
export function isPathAllowedForRole(path: string, role: RoleKey): boolean {
  return isPathAllowed(path, role);
}