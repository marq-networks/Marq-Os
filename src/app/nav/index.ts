/**
 * Navigation System Exports
 */

export { NAV_MANIFEST, getAllPaths, getPathsForRole, findNavItemByPath } from './navManifest';
export { getNavForRole, getDefaultRouteForRole, isPathAllowedForRole } from './getNavForRole';
export { canAccessPath, getAllAccessiblePaths } from './canAccessPath';
export type { Role, DomainKey, NavItem } from './navManifest';