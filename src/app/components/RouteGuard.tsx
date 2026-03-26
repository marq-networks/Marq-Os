/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ROUTE GUARD - Client-Side Access Control
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Enforces role-based access control using the navigation registry.
 * Redirects unauthorized users to their role's default home.
 */

import { useEffect } from 'react';
import { useRouter } from './router';
import { useCurrentRole } from './DevRoleSwitcher';
import { canAccessPath, getDefaultRouteForRole } from '../nav/canAccessPath';

/**
 * Route guard that checks access on every navigation
 */
export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { currentPath, navigate } = useRouter();
  const [currentRole] = useCurrentRole();
  
  useEffect(() => {
    // Allow diagnostic and analysis routes for all roles (dev tools)
    if (currentPath.startsWith('/diagnostics/') || currentPath.startsWith('/analysis/')) {
      return;
    }
    
    // Check if current role can access current path via navigation manifest
    const hasAccess = canAccessPath(currentRole, currentPath);
    
    if (!hasAccess) {
      console.warn(`[RouteGuard] Access denied: ${currentRole} cannot access ${currentPath}`);
      
      // Redirect to safe default route for this role
      const defaultRoute = getDefaultRouteForRole(currentRole);
      console.log(`[RouteGuard] Redirecting to: ${defaultRoute}`);
      navigate(defaultRoute);
    }
  }, [currentPath, currentRole, navigate]);
  
  // Always render children - the useEffect will handle redirection
  return <>{children}</>;
}