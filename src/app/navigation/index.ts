/**
 * ═══════════════════════════════════════════════════════════════════════════
 * NAVIGATION MODULE - PUBLIC API
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Clean exports for the navigation system.
 */

// Navigation manifest and types
export { NAV_MANIFEST, getAllPaths, getPathsForRole, findNavItemByPath } from '../nav/navManifest';
export type { NavItem, Role, DomainKey } from '../nav/navManifest';

// Route registry and helpers
export { 
  ROUTE_REGISTRY,
  getRouteByPath,
  getRoutesForRole,
  getDefaultHomeForRole,
  canAccessPath 
} from './navRegistry';
export type { RouteDefinition } from './navRegistry';

// Route generation
export { generateRoutes, validateRouteRegistry } from './RouteGenerator';

// Role filtering
export { getNavForRole, getDefaultRouteForRole, isPathAllowedForRole } from '../nav/getNavForRole';
