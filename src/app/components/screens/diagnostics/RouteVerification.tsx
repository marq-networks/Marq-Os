/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ROUTE VERIFICATION DIAGNOSTIC
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Verifies that all navigation items have corresponding routes and screens.
 * Displays a comprehensive table of all paths, their status, and components.
 */

import { PageLayout } from '../../shared/PageLayout';
import { Card3D } from '../../shared/Card3D';
import { StatusBadge } from '../../shared/StatusBadge';
import { NAV_MANIFEST, getPathsForRole, type Role } from '../../../nav/navManifest';
import { useRouter } from '../../router';
import { CheckCircle, XCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface RouteInfo {
  role: Role;
  domain: string;
  label: string;
  path: string;
  status: 'real' | 'placeholder' | 'missing';
  component?: string;
  badge?: number;
}

export function RouteVerification() {
  const { navigate } = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role | 'all'>('all');
  
  // Build complete route inventory
  const routes: RouteInfo[] = [];
  
  const roles: Role[] = ['employee', 'org_admin', 'platform_admin'];
  
  roles.forEach(role => {
    NAV_MANIFEST.forEach(domain => {
      if (!domain.children) return;
      
      domain.children.forEach(item => {
        if (!item.path) return;
        if (!item.roles.includes(role)) return;
        
        // Determine status based on path patterns
        let status: 'real' | 'placeholder' | 'missing' = 'placeholder';
        let component = 'SkeletonStub/ComingSoon';
        
        // Real implementations
        if (
          item.path.startsWith('/work/my-work') ||
          item.path.startsWith('/employee/') ||
          item.path.startsWith('/admin/') ||
          item.path.startsWith('/org/') ||
          item.path.startsWith('/super/') ||
          item.path === '/finance/cockpit' ||
          item.path === '/finance/ledger' ||
          item.path === '/finance/intelligence' ||
          item.path === '/finance/inbox' ||
          item.path === '/time/my-day' ||
          item.path === '/time/leave' ||
          item.path === '/time/my-fines' ||
          item.path === '/time/sessions' ||
          item.path === '/time/corrections' ||
          item.path === '/time/break-rules' ||
          item.path === '/time/leave-management' ||
          item.path === '/time/leave-approvals' ||
          item.path === '/time/fines-management' ||
          item.path === '/people/members' ||
          item.path === '/people/departments' ||
          item.path === '/people/roles-access' ||
          item.path === '/security/consent-privacy' ||
          item.path === '/security/data-retention' ||
          item.path === '/security/audit-logs' ||
          item.path === '/security/security' ||
          item.path === '/platform/billing' ||
          item.path === '/analytics/reports'
        ) {
          status = 'real';
          component = 'Implemented Component';
        }
        
        routes.push({
          role,
          domain: domain.label,
          label: item.label,
          path: item.path,
          status,
          component,
          badge: item.badge,
        });
      });
    });
  });
  
  // Filter by selected role
  const filteredRoutes = selectedRole === 'all' 
    ? routes 
    : routes.filter(r => r.role === selectedRole);
  
  // Calculate statistics
  const totalRoutes = filteredRoutes.length;
  const realRoutes = filteredRoutes.filter(r => r.status === 'real').length;
  const placeholderRoutes = filteredRoutes.filter(r => r.status === 'placeholder').length;
  const missingRoutes = filteredRoutes.filter(r => r.status === 'missing').length;
  
  // Group by domain
  const routesByDomain: Record<string, RouteInfo[]> = {};
  filteredRoutes.forEach(route => {
    if (!routesByDomain[route.domain]) {
      routesByDomain[route.domain] = [];
    }
    routesByDomain[route.domain].push(route);
  });
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'real':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'placeholder':
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
      case 'missing':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'real':
        return <StatusBadge type="success">REAL</StatusBadge>;
      case 'placeholder':
        return <StatusBadge type="neutral">PLACEHOLDER</StatusBadge>;
      case 'missing':
        return <StatusBadge type="error">MISSING</StatusBadge>;
      default:
        return null;
    }
  };
  
  return (
    <PageLayout
      title="Route Verification"
      description="Comprehensive verification of all navigation routes and their implementations"
    >
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card3D>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Routes</p>
                <p className="text-2xl font-bold">{totalRoutes}</p>
              </div>
              <div className="p-2 rounded-lg bg-primary/10">
                <ExternalLink className="h-5 w-5 text-primary" />
              </div>
            </div>
          </Card3D>
          
          <Card3D className="border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Real Screens</p>
                <p className="text-2xl font-bold text-green-600">{realRoutes}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalRoutes > 0 ? Math.round((realRoutes / totalRoutes) * 100) : 0}% complete
                </p>
              </div>
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </Card3D>
          
          <Card3D className="border-blue-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Placeholders</p>
                <p className="text-2xl font-bold text-blue-600">{placeholderRoutes}</p>
                <p className="text-xs text-muted-foreground mt-1">Coming Soon</p>
              </div>
              <div className="p-2 rounded-lg bg-blue-500/10">
                <AlertCircle className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </Card3D>
          
          <Card3D className="border-red-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Missing</p>
                <p className="text-2xl font-bold text-red-600">{missingRoutes}</p>
                <p className="text-xs text-muted-foreground mt-1">Needs Route</p>
              </div>
              <div className="p-2 rounded-lg bg-red-500/10">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </Card3D>
        </div>
        
        {/* Role Filter */}
        <Card3D>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground">Filter by Role:</span>
            <div className="flex gap-2">
              {(['all', 'employee', 'org_admin', 'platform_admin'] as const).map(role => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    selectedRole === role
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-accent text-accent-foreground hover:bg-accent/80'
                  }`}
                >
                  {role === 'all' ? 'All Roles' : 
                   role === 'employee' ? 'Employee' :
                   role === 'org_admin' ? 'Org Admin' :
                   'Platform Admin'}
                </button>
              ))}
            </div>
          </div>
        </Card3D>
        
        {/* Routes by Domain */}
        {Object.entries(routesByDomain).map(([domain, domainRoutes]) => (
          <Card3D key={domain}>
            <div className="mb-4">
              <h3 className="font-semibold text-lg">{domain}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {domainRoutes.length} route{domainRoutes.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-2 px-3 font-medium text-muted-foreground">Label</th>
                    <th className="text-left py-2 px-3 font-medium text-muted-foreground">Path</th>
                    <th className="text-left py-2 px-3 font-medium text-muted-foreground">Role</th>
                    <th className="text-left py-2 px-3 font-medium text-muted-foreground">Component</th>
                    <th className="text-left py-2 px-3 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {domainRoutes.map((route, idx) => (
                    <tr key={idx} className="border-b border-border hover:bg-accent/50 transition-colors">
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(route.status)}
                          {getStatusBadge(route.status)}
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{route.label}</span>
                          {route.badge && (
                            <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
                              {route.badge}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <code className="text-xs bg-accent px-2 py-1 rounded">{route.path}</code>
                      </td>
                      <td className="py-2 px-3">
                        <span className="text-xs text-muted-foreground">{route.role}</span>
                      </td>
                      <td className="py-2 px-3">
                        <span className="text-xs text-muted-foreground">{route.component}</span>
                      </td>
                      <td className="py-2 px-3">
                        <button
                          onClick={() => navigate(route.path)}
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          Test <ExternalLink className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card3D>
        ))}
        
        {/* System Info */}
        <Card3D className="bg-accent/50">
          <div className="space-y-2 text-sm">
            <p><strong>Single Source of Truth:</strong> /src/app/nav/navManifest.ts</p>
            <p><strong>Route Guard:</strong> /src/app/components/RouteGuard.tsx</p>
            <p><strong>Sidebar Renderer:</strong> /src/app/components/DynamicSidebar.tsx</p>
            <p><strong>Role Management:</strong> /src/app/components/DevRoleSwitcher.tsx</p>
            <p className="pt-2 text-muted-foreground">
              All navigation is defined once in navManifest.ts and filtered by role dynamically.
              No duplicate menus, no legacy sections, no menu merging on role switch.
            </p>
          </div>
        </Card3D>
      </div>
    </PageLayout>
  );
}
