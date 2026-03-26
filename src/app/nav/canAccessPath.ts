/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CAN ACCESS PATH - Role-Based Path Authorization
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Single source of truth for path access control.
 * Uses NAV_MANIFEST as the authority - no duplication.
 */

import { NAV_MANIFEST } from './navManifest';
import type { Role, NavItem } from './navManifest';
import { ROUTE_REGISTRY } from '../navigation/navRegistry';

/**
 * Public routes that don't require role checking
 */
const PUBLIC_ROUTES = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
];

/**
 * Check if a path exists in NAV_MANIFEST or ROUTE_REGISTRY and is accessible by the role
 */
export function canAccessPath(role: Role, path: string): boolean {
  // Allow public routes
  if (PUBLIC_ROUTES.includes(path)) {
    return true;
  }
  
  // Check NAV_MANIFEST first
  function findPath(items: NavItem[]): boolean {
    for (const item of items) {
      if (item.path === path) {
        return item.roles.includes(role);
      }
      if (item.children) {
        if (findPath(item.children)) {
          return true;
        }
      }
    }
    return false;
  }
  
  if (findPath(NAV_MANIFEST)) {
    return true;
  }
  
  // Fallback: check ROUTE_REGISTRY for routes not in manifest
  const routeEntry = ROUTE_REGISTRY.find(r => r.path === path);
  if (routeEntry) {
    return routeEntry.roles.includes(role);
  }
  
  return false;
}

/**
 * Get the default safe route for a role
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
 * Get all accessible paths for a role
 * Useful for debugging and route generation
 */
export function getAllAccessiblePaths(role: Role): string[] {
  const paths: string[] = [];
  
  function collectPaths(items: NavItem[]): void {
    for (const item of items) {
      if (item.roles.includes(role) && item.path) {
        paths.push(item.path);
      }
      
      if (item.children) {
        collectPaths(item.children);
      }
    }
  }
  
  collectPaths(NAV_MANIFEST);
  return paths;
}