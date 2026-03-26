/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DEV ROLE SWITCHER - Development Only
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Provides a UI to switch between roles during development.
 * Uses roleStore as single source of truth for role state.
 */

import type { Role } from '../nav/navManifest';
import { useRoleState } from '../state/roleStore';

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * EXPORTS FOR BACKWARD COMPATIBILITY
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

export { getActiveRole as getCurrentRole, setActiveRole as setCurrentRole } from '../state/roleStore';
export { useRoleState as useCurrentRole } from '../state/roleStore';

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * DEV ROLE SWITCHER COMPONENT
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

const ROLE_LABELS: Record<Role, string> = {
  employee: 'Employee',
  org_admin: 'Org Admin',
  platform_admin: 'Platform Admin',
};

export function DevRoleSwitcher() {
  const [currentRole, setRole] = useRoleState();
  
  // Only render if env var is set
  const shouldShow = import.meta.env.NEXT_PUBLIC_SHOW_ROLE_SWITCHER === 'true';
  
  if (!shouldShow) {
    return null;
  }
  
  const roles: Role[] = ['employee', 'org_admin', 'platform_admin'];
  
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-background border-2 border-primary rounded-lg shadow-lg p-3">
      <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
        Dev: Switch Role
      </div>
      <div className="flex gap-2">
        {roles.map(role => (
          <button
            key={role}
            onClick={() => setRole(role)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              currentRole === role
                ? 'bg-primary text-primary-foreground'
                : 'bg-accent text-accent-foreground hover:bg-accent/80'
            }`}
          >
            {ROLE_LABELS[role]}
          </button>
        ))}
      </div>
      <div className="text-[10px] text-muted-foreground mt-2 text-center">
        Current: <span className="font-semibold">{ROLE_LABELS[currentRole]}</span>
      </div>
    </div>
  );
}
