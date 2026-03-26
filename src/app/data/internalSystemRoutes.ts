/**
 * ═══════════════════════════════════════════════════════════════════════════
 * INTERNAL SYSTEM ZONE - BACKEND-ONLY ROUTES
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ⚠️ CRITICAL: These routes are SEALED from product UI
 * 
 * PURPOSE:
 * - Diagnostic tools for development
 * - Gap analysis and coverage reports
 * - Engine monitoring dashboards
 * - Propagation system analysis
 * - Data wiring verification
 * 
 * UI WORLD SEPARATION:
 * ✅ PRODUCT UI (Visible to users):
 *    - Employee screens (/employee/*)
 *    - Admin screens (/admin/*)
 *    - Finance screens (/org/finance/*)
 *    - Super Admin operational screens (/super/*)
 * 
 * 🚫 INTERNAL SYSTEM (Backend-only, NOT in sidebar):
 *    - Diagnostics (/diagnostics/*)
 *    - Analysis tools (/analysis/*)
 *    - Engine monitors (/engines/*)
 *    - Propagation dashboards (/propagation/*)
 * 
 * ACCESS:
 * - These routes are NOT linked in any navigation
 * - Direct URL access only (for developers)
 * - Not indexed by UI components
 * - Never appear in sidebar or menus
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Activity, AlertTriangle, BarChart3, Database, FileText, Zap, Activity as ActivityIcon, Cpu, GitBranch, Layers } from 'lucide-react';

export interface InternalRoute {
  id: string;
  label: string;
  icon: any;
  path: string;
  category: 'diagnostic' | 'analysis' | 'engine' | 'propagation' | 'gap';
  description: string;
  devOnly: boolean;
}

/**
 * CATEGORY: DIAGNOSTICS
 * Development tools for verifying UI bindings and route coverage
 */
export const diagnosticRoutes: InternalRoute[] = [
  {
    id: 'diag-ui-binding',
    label: 'UI Binding Diagnostic',
    icon: Zap,
    path: '/diagnostics/ui-binding',
    category: 'diagnostic',
    description: 'Verifies all screens are bound to routes and accessible',
    devOnly: true
  },
  {
    id: 'diag-finance-routes',
    label: 'Finance Route Coverage Audit',
    icon: FileText,
    path: '/diagnostics/finance-route-coverage',
    category: 'diagnostic',
    description: '100% coverage check of F-01 to F-13 Finance screens',
    devOnly: true
  },
  {
    id: 'diag-finance-reality',
    label: 'Finance Screen Reality Check',
    icon: BarChart3,
    path: '/diagnostics/finance-screen-reality',
    category: 'diagnostic',
    description: 'UI implementation % for all Finance screens (77% avg)',
    devOnly: true
  },
  {
    id: 'diag-finance-wiring',
    label: 'Finance Data Wiring Check',
    icon: Database,
    path: '/diagnostics/finance-data-wiring',
    category: 'diagnostic',
    description: 'Data source wiring status (69% fully wired)',
    devOnly: true
  },
  {
    id: 'diag-finance-interactions',
    label: 'Finance Interaction Audit',
    icon: Activity,
    path: '/diagnostics/finance-interactions',
    category: 'diagnostic',
    description: 'Interaction coverage: 92% working, 16 dead interactions',
    devOnly: true
  }
];

/**
 * CATEGORY: ANALYSIS
 * Gap analysis and progress tracking tools
 */
export const analysisRoutes: InternalRoute[] = [
  {
    id: 'analysis-module-progress',
    label: 'Module Progress Dashboard',
    icon: BarChart3,
    path: '/analysis/module-progress',
    category: 'analysis',
    description: 'WORK (5), COMMUNICATE (7), FINANCE (13) completion tracking',
    devOnly: true
  }
];

/**
 * CATEGORY: ENGINES
 * Finance Intelligence Engine monitoring dashboards
 */
export const engineRoutes: InternalRoute[] = [
  {
    id: 'engine-payroll-router',
    label: 'ENGINE-02: Payroll Propagation Router',
    icon: Cpu,
    path: '/engines/payroll-propagation',
    category: 'engine',
    description: 'Monitors payroll → cost/hour injection into departments',
    devOnly: true
  },
  {
    id: 'engine-overhead',
    label: 'ENGINE-03: Overhead Allocator',
    icon: Cpu,
    path: '/engines/overhead-allocator',
    category: 'engine',
    description: 'Tracks overhead allocation across departments',
    devOnly: true
  },
  {
    id: 'engine-burn-risk',
    label: 'ENGINE-04: Project Burn Risk Core',
    icon: Cpu,
    path: '/engines/project-burn-risk',
    category: 'engine',
    description: 'Project burn rate and budget risk monitoring',
    devOnly: true
  },
  {
    id: 'engine-profit-velocity',
    label: 'ENGINE-08: Profit Velocity Engine',
    icon: Cpu,
    path: '/engines/profit-velocity',
    category: 'engine',
    description: 'Real-time profit/hr, profit/day velocity tracking',
    devOnly: true
  },
  {
    id: 'engine-work-finance',
    label: 'ENGINE-09: Work ↔ Finance Wiring',
    icon: Cpu,
    path: '/engines/work-finance-wiring',
    category: 'engine',
    description: 'Expense → Project linking and propagation status',
    devOnly: true
  },
  {
    id: 'engine-status-monitor',
    label: 'All Engines Status Monitor',
    icon: Layers,
    path: '/engines/status-monitor',
    category: 'engine',
    description: 'Consolidated view of all 11 Finance Intelligence Engines',
    devOnly: true
  }
];

/**
 * CATEGORY: PROPAGATION
 * Financial propagation system dashboards
 */
export const propagationRoutes: InternalRoute[] = [
  {
    id: 'propagation-flow',
    label: 'Propagation Flow Visualizer',
    icon: GitBranch,
    path: '/propagation/flow-visualizer',
    category: 'propagation',
    description: 'Visual map of expense → F03 → burn → velocity flow',
    devOnly: true
  },
  {
    id: 'propagation-audit',
    label: 'Propagation Audit Log',
    icon: FileText,
    path: '/propagation/audit-log',
    category: 'propagation',
    description: 'Complete log of all automatic propagations',
    devOnly: true
  }
];

/**
 * ALL INTERNAL ROUTES (Combined)
 */
export const allInternalRoutes: InternalRoute[] = [
  ...diagnosticRoutes,
  ...analysisRoutes,
  ...engineRoutes,
  ...propagationRoutes
];

/**
 * Helper: Check if a path is an internal system route
 */
export function isInternalSystemRoute(path: string): boolean {
  return allInternalRoutes.some(route => route.path === path);
}

/**
 * Helper: Get internal route by path
 */
export function getInternalRoute(path: string): InternalRoute | undefined {
  return allInternalRoutes.find(route => route.path === path);
}

/**
 * ROUTE ACCESSIBILITY RULES
 * 
 * PRODUCT UI ROUTES (Visible in sidebar):
 * ✅ /employee/*        - Employee role screens
 * ✅ /admin/*           - Admin role screens  
 * ✅ /org/finance/*     - Finance module (ORG-F-01 to ORG-F-13)
 * ✅ /super/*           - Super Admin operational screens
 * ✅ /platform/*        - Platform Finance Console (PF)
 * 
 * INTERNAL SYSTEM ROUTES (Hidden from sidebar):
 * 🚫 /diagnostics/*     - Development diagnostics
 * 🚫 /analysis/*        - Gap analysis tools
 * 🚫 /engines/*         - Engine monitoring dashboards
 * 🚫 /propagation/*     - Propagation system analysis
 * 
 * UI WORLD SEPARATION CONFIRMED ✅
 */