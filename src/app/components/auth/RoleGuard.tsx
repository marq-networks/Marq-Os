/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ROLE GUARD COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Protects routes based on role permissions.
 * Automatically redirects to appropriate landing page if role doesn't match.
 */

import { useEffect } from 'react';
import { useRouter } from '../router';
import { getActiveRole } from '../../state/roleStore';
import { getDefaultRouteForRole } from '../../nav/getNavForRole';
import { toast } from '../ui/toast';
import type { RoleKey } from '../../state/roleStore';

interface RoleGuardProps {
  role: RoleKey;
  children: React.ReactNode;
}

export function RoleGuard({ role, children }: RoleGuardProps) {
  const { navigate } = useRouter();
  const activeRole = getActiveRole();
  
  useEffect(() => {
    // Check if current role matches required role
    if (activeRole !== role) {
      const defaultRoute = getDefaultRouteForRole(activeRole);
      
      // Show toast notification
      toast.error(`Access denied. This page is only available to ${getRoleLabel(role)}.`);
      
      // Redirect to default route for current role
      navigate(defaultRoute);
    }
  }, [activeRole, role, navigate]);
  
  // Only render children if role matches
  if (activeRole !== role) {
    return null;
  }
  
  return <>{children}</>;
}

/**
 * Get human-readable role label
 */
function getRoleLabel(role: RoleKey): string {
  switch (role) {
    case 'employee':
      return 'Employees';
    case 'org_admin':
      return 'Org Admins';
    case 'platform_admin':
      return 'Platform Admins';
  }
}