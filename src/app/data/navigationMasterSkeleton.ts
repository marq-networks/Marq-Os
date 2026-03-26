/**
 * ═══════════════════════════════════════════════════════════════════════════
 * UX NAVIGATION MASTER SKELETON - PHASE 4: SEMANTIC OS ARCHITECTURE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * SEMANTIC OS LAYERS:
 * 1. EXECUTION OS - Work execution, communication, time tracking
 * 2. ORGANIZATION OS - People, teams, HR management
 * 3. BUSINESS OS - Financial management and accounting
 * 4. INTELLIGENCE OS - Analytics, reports, insights
 * 5. PLATFORM OS - Security, billing, integrations, settings
 * 
 * ALL EXISTING ROUTES PRESERVED - Only navigation structure reorganized
 * ZERO FEATURE LOSS - All 43 items remain accessible
 * ═══════════════════════════════════════════════════════════════════════════
 */

import {
  Home,
  Calendar,
  Activity,
  Clock,
  Umbrella,
  BarChart3,
  DollarSign,
  Bell,
  User,
  Users,
  Settings,
  Shield,
  FileText,
  Building,
  Database,
  Key,
  GitBranch,
  Link,
  CreditCard,
  Layers,
  CheckSquare,
  Briefcase,
  UserCheck,
  PieChart,
  MessageSquare,
  Wallet,
  Inbox,
  Plus,
  List,
  Upload,
  GanttChart,
  Receipt,
  Send,
  TrendingUp,
  FileSpreadsheet,
  Banknote,
  UserCog,
  Target,
  Zap,
  Lock,
  AlertTriangle,
  Globe,
  Plug
} from 'lucide-react';

export interface NavDomain {
  id: string;
  label: string;
  icon: any;
  description: string;
  sections: NavSection[];
}

export interface NavSection {
  id: string;
  label: string;
  icon?: any;
  items: NavItem[];
}

export interface NavItem {
  id: string;
  label: string;
  icon: any;
  path: string;
  badge?: number;
  description?: string;
  disabled?: boolean;
}

// ============================================================================
// EMPLOYEE NAVIGATION - DOMAIN-BASED
// ============================================================================

export const employeeDomainNav: NavDomain[] = [
  {
    id: 'work',
    label: 'Work',
    icon: Briefcase,
    description: 'Your tasks, projects, and work execution',
    sections: [
      {
        id: 'work-main',
        label: 'Work Management',
        items: [
          {
            id: 'e-w01',
            label: 'My Work',
            icon: CheckSquare,
            path: '/employee/my-work',
            badge: 3,
            description: 'Your tasks and assignments'
          }
        ]
      }
    ]
  },
  {
    id: 'communication',
    label: 'Communication',
    icon: MessageSquare,
    description: 'Messages, channels, and team communication',
    sections: [
      {
        id: 'comm-main',
        label: 'Communication',
        items: [
          {
            id: 'e-c01',
            label: 'Communicate',
            icon: MessageSquare,
            path: '/employee/communicate',
            badge: 12,
            description: 'Team messages and channels'
          }
        ]
      }
    ]
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: Wallet,
    description: 'Your money, expenses, and earnings',
    sections: [
      {
        id: 'finance-main',
        label: 'My Money',
        items: [
          {
            id: 'e-m01',
            label: 'My Money Dashboard',
            icon: Wallet,
            path: '/employee/money/dashboard',
            badge: 3,
            description: 'Salary, expenses, reimbursements'
          },
          {
            id: 'e-08',
            label: 'My Earnings',
            icon: DollarSign,
            path: '/employee/earnings',
            description: 'Salary history and earnings'
          }
        ]
      }
    ]
  },
  {
    id: 'time',
    label: 'Time',
    icon: Clock,
    description: 'Time tracking, attendance, and leave',
    sections: [
      {
        id: 'time-main',
        label: 'Time & Attendance',
        items: [
          {
            id: 'e-02',
            label: 'My Day',
            icon: Calendar,
            path: '/employee/my-day',
            description: 'Today\'s schedule and tasks'
          },
          {
            id: 'e-04',
            label: 'Time Logs',
            icon: Clock,
            path: '/employee/time-logs',
            description: 'Your time tracking history'
          },
          {
            id: 'e-05',
            label: 'Leave',
            icon: Umbrella,
            path: '/employee/leave',
            description: 'Leave requests and balance'
          },
          {
            id: 'e-t01',
            label: 'My Fines',
            icon: AlertTriangle,
            path: '/employee/my-fines',
            description: 'Your time violations and fines'
          }
        ]
      }
    ]
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    description: 'Your performance and insights',
    sections: [
      {
        id: 'analytics-main',
        label: 'Performance',
        items: [
          {
            id: 'e-03',
            label: 'My Activity',
            icon: Activity,
            path: '/employee/my-activity',
            description: 'Activity tracking'
          },
          {
            id: 'e-06',
            label: 'Activity Overview',
            icon: BarChart3,
            path: '/employee/activity-overview',
            description: 'Activity summary'
          },
          {
            id: 'e-07',
            label: 'Analytics',
            icon: BarChart3,
            path: '/employee/analytics',
            description: 'Performance analytics'
          }
        ]
      }
    ]
  },
  {
    id: 'personal',
    label: 'Personal',
    icon: User,
    description: 'Your profile and preferences',
    sections: [
      {
        id: 'personal-main',
        label: 'Account',
        items: [
          {
            id: 'e-01',
            label: 'Dashboard',
            icon: Home,
            path: '/employee/dashboard',
            description: 'Your home dashboard'
          },
          {
            id: 'e-09',
            label: 'Notifications',
            icon: Bell,
            path: '/employee/notifications',
            badge: 5,
            description: 'Your notifications'
          },
          {
            id: 'e-10',
            label: 'Profile',
            icon: User,
            path: '/employee/profile',
            description: 'Your profile settings'
          }
        ]
      }
    ]
  }
];

// ============================================================================
// ADMIN NAVIGATION - SEMANTIC OS ARCHITECTURE
// ============================================================================

export const adminDomainNav: NavDomain[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // 1. EXECUTION OS - Work, Communication, Time
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'execution-os',
    label: 'Execution OS',
    icon: Zap,
    description: 'Work execution, communication, and time tracking',
    sections: [
      {
        id: 'execution-work',
        label: 'Work Management',
        items: [
          {
            id: 'e-w01',
            label: 'My Work',
            icon: CheckSquare,
            path: '/employee/my-work',
            badge: 3,
            description: 'Your tasks and assignments'
          },
          {
            id: 'a-w02',
            label: 'Projects',
            icon: Briefcase,
            path: '/admin/projects',
            description: 'Project management'
          },
          {
            id: 'a-w03',
            label: 'Tasks',
            icon: CheckSquare,
            path: '/admin/tasks',
            description: 'Task management'
          },
          {
            id: 'a-w06',
            label: 'Milestones',
            icon: Target,
            path: '/admin/milestones',
            description: 'Project milestones'
          },
          {
            id: 'a-w04',
            label: 'Assignments',
            icon: UserCheck,
            path: '/admin/assignments',
            description: 'Team assignments'
          },
          {
            id: 'a-w05',
            label: 'Work Reports',
            icon: PieChart,
            path: '/admin/work-reports',
            description: 'Work performance reports'
          }
        ]
      },
      {
        id: 'execution-communication',
        label: 'Communication',
        items: [
          {
            id: 'a-c01',
            label: 'Communicate',
            icon: MessageSquare,
            path: '/admin/communicate',
            badge: 18,
            description: 'Team communication hub'
          }
        ]
      },
      {
        id: 'execution-time',
        label: 'Time Tracking',
        items: [
          {
            id: 'a-t00',
            label: 'Time Tracking',
            icon: Clock,
            path: '/admin/time-logs',
            description: 'Time tracking overview'
          },
          {
            id: 'a-10',
            label: 'Corrections',
            icon: FileText,
            path: '/admin/corrections',
            badge: 3,
            description: 'Time corrections'
          },
          {
            id: 'a-07',
            label: 'Sessions',
            icon: Clock,
            path: '/admin/sessions',
            description: 'Work sessions'
          },
          {
            id: 'a-09',
            label: 'Break Rules',
            icon: Calendar,
            path: '/admin/break-rules',
            description: 'Break time rules'
          },
          {
            id: 'a-11',
            label: 'Leave Management',
            icon: Umbrella,
            path: '/admin/leave-management',
            description: 'Leave policies'
          },
          {
            id: 'a-12',
            label: 'Leave Approvals',
            icon: FileText,
            path: '/admin/leave-approvals',
            badge: 7,
            description: 'Pending leave requests'
          },
          {
            id: 'a-t01',
            label: 'Fines',
            icon: AlertTriangle,
            path: '/admin/fines',
            description: 'Time violations and fines'
          }
        ]
      }
    ]
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // 2. ORGANIZATION OS - People, Teams, HR
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'organization-os',
    label: 'Organization OS',
    icon: Users,
    description: 'People, teams, departments, and HR management',
    sections: [
      {
        id: 'org-people',
        label: 'Team Management',
        items: [
          {
            id: 'a-03',
            label: 'Employees',
            icon: Users,
            path: '/admin/users',
            description: 'Employee accounts'
          },
          {
            id: 'a-04',
            label: 'Members',
            icon: Users,
            path: '/admin/members',
            description: 'Team members'
          },
          {
            id: 'a-05',
            label: 'Departments',
            icon: Building,
            path: '/admin/departments',
            description: 'Department structure'
          },
          {
            id: 'a-06',
            label: 'Roles & Access',
            icon: Shield,
            path: '/admin/roles-access',
            description: 'Role-based access control'
          },
          {
            id: 'a-24',
            label: 'Payroll',
            icon: DollarSign,
            path: '/admin/payroll',
            description: 'Payroll management'
          }
        ]
      }
    ]
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // 3. BUSINESS OS - Finance
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'business-os',
    label: 'Finance Corporate',
    icon: Wallet,
    description: 'Financial management, accounting, and business operations',
    sections: [
      {
        id: 'business-finance',
        label: 'Finance Management',
        items: [
          {
            id: 'a-f01-cockpit',
            label: 'Cockpit',
            icon: BarChart3,
            path: '/org/finance/cockpit',
            description: 'Finance overview dashboard'
          },
          {
            id: 'a-f01-ledger',
            label: 'Ledger',
            icon: List,
            path: '/org/finance/ledger-control',
            description: 'Transaction ledger'
          },
          {
            id: 'a-f01-accounts',
            label: 'Accounts & Wallets',
            icon: Wallet,
            path: '/org/finance/accounts',
            description: 'Bank accounts and wallets'
          },
          {
            id: 'a-f01-reimburse',
            label: 'Reimbursements',
            icon: Receipt,
            path: '/org/finance/reimbursements',
            description: 'Employee reimbursements'
          },
          {
            id: 'a-f01-payroll',
            label: 'Payroll Posting',
            icon: Send,
            path: '/org/finance/payroll-posting',
            description: 'Post payroll to ledger'
          },
          {
            id: 'a-f01-costing',
            label: 'Costing & Profit',
            icon: TrendingUp,
            path: '/org/finance/costing-profit',
            description: 'Profit analysis'
          },
          {
            id: 'a-f01-loans',
            label: 'Loans & Liabilities',
            icon: Banknote,
            path: '/org/finance/loans',
            description: 'Loans and liabilities'
          },
          {
            id: 'a-f01-reports',
            label: 'Reports',
            icon: FileSpreadsheet,
            path: '/org/finance/reports',
            description: 'Financial reports'
          },
          {
            id: 'a-f01-team',
            label: 'Team & Permissions',
            icon: UserCog,
            path: '/org/finance/team-permissions',
            description: 'Finance team access'
          },
          {
            id: 'a-f01-settings',
            label: 'Finance Settings',
            icon: Settings,
            path: '/org/finance/settings',
            description: 'Finance configuration'
          }
        ]
      }
    ]
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // 4. INTELLIGENCE OS - Analytics
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'intelligence-os',
    label: 'Intelligence OS',
    icon: BarChart3,
    description: 'Analytics, reports, insights, and business intelligence',
    sections: [
      {
        id: 'intel-analytics',
        label: 'Analytics & Insights',
        items: [
          {
            id: 'a-13',
            label: 'Activity Overview',
            icon: BarChart3,
            path: '/admin/activity-overview',
            description: 'Activity summary'
          },
          {
            id: 'a-an01',
            label: 'Profitability (Coming Soon)',
            icon: TrendingUp,
            path: '/admin/analytics/profitability',
            description: 'Profit analysis and metrics',
            disabled: true
          },
          {
            id: 'a-an02',
            label: 'Burn Risk (Coming Soon)',
            icon: AlertTriangle,
            path: '/admin/analytics/burn-risk',
            description: 'Cash burn risk analysis',
            disabled: true
          },
          {
            id: 'a-an03',
            label: 'What-If Simulator (Coming Soon)',
            icon: Zap,
            path: '/admin/analytics/what-if',
            description: 'Financial scenario planning',
            disabled: true
          },
          {
            id: 'a-14',
            label: 'App Reports',
            icon: FileSpreadsheet,
            path: '/admin/app-reports',
            description: 'Application usage reports'
          }
        ]
      }
    ]
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // 5. PLATFORM OS - Security, Integrations, Settings
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'platform-os',
    label: 'Platform OS',
    icon: Settings,
    description: 'Security, compliance, integrations, and platform settings',
    sections: [
      {
        id: 'platform-security',
        label: 'Security & Compliance',
        items: [
          {
            id: 'a-20',
            label: 'Consent & Privacy',
            icon: Shield,
            path: '/admin/consent',
            description: 'Privacy policies'
          },
          {
            id: 'a-21',
            label: 'Data Retention',
            icon: Database,
            path: '/admin/data-retention',
            description: 'Data retention policies'
          },
          {
            id: 'a-22',
            label: 'Audit Logs',
            icon: FileText,
            path: '/admin/audit-logs',
            description: 'System audit trail'
          },
          {
            id: 'a-23',
            label: 'Security',
            icon: Shield,
            path: '/admin/security',
            description: 'Security settings'
          }
        ]
      },
      {
        id: 'platform-integrations',
        label: 'Integrations',
        items: [
          {
            id: 'a-27',
            label: 'Integrations',
            icon: Link,
            path: '/admin/integrations',
            description: 'Third-party integrations'
          },
          {
            id: 'a-28',
            label: 'API Docs',
            icon: GitBranch,
            path: '/admin/api-docs',
            description: 'API documentation'
          }
        ]
      },
      {
        id: 'platform-settings',
        label: 'Platform Settings',
        items: [
          {
            id: 'a-pf01',
            label: 'Billing',
            icon: CreditCard,
            path: '/admin/billing',
            description: 'Billing and payments'
          },
          {
            id: 'a-pf02',
            label: 'Billing Plans',
            icon: Layers,
            path: '/admin/billing-plans',
            description: 'Subscription plans'
          },
          {
            id: 'a-30',
            label: 'Org Settings',
            icon: Settings,
            path: '/admin/settings',
            description: 'Organization settings'
          }
        ]
      }
    ]
  }
];

// ============================================================================
// SUPER ADMIN NAVIGATION - DOMAIN-BASED
// ============================================================================

export const superAdminDomainNav: NavDomain[] = [
  {
    id: 'platform',
    label: 'Platform',
    icon: Layers,
    description: 'Platform administration and management',
    sections: [
      {
        id: 'platform-overview',
        label: 'Platform Overview',
        items: [
          {
            id: 's-01',
            label: 'Console',
            icon: Layers,
            path: '/super/console',
            description: 'Super Admin console'
          },
          {
            id: 's-06',
            label: 'System Health',
            icon: Activity,
            path: '/super/health',
            description: 'Platform health monitoring'
          }
        ]
      },
      {
        id: 'platform-orgs',
        label: 'Organizations',
        items: [
          {
            id: 's-02',
            label: 'Organizations',
            icon: Building,
            path: '/super/organizations',
            description: 'All organizations'
          },
          {
            id: 's-03',
            label: 'Org Detail',
            icon: FileText,
            path: '/super/org-detail',
            description: 'Organization details'
          }
        ]
      },
      {
        id: 'platform-admin',
        label: 'Platform Administration',
        items: [
          {
            id: 's-08',
            label: 'Platform Admins',
            icon: Key,
            path: '/super/admins',
            description: 'Platform administrators'
          }
        ]
      }
    ]
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: Wallet,
    description: 'Platform-wide financial management',
    sections: [
      {
        id: 'finance-platform',
        label: 'Platform Finance',
        items: [
          {
            id: 's-f01',
            label: 'Finance Platform',
            icon: Wallet,
            path: '/platform/finance-console',
            description: 'Platform finance console'
          },
          {
            id: 's-04',
            label: 'Platform Billing',
            icon: CreditCard,
            path: '/super/billing',
            description: 'Platform billing'
          },
          {
            id: 's-09',
            label: 'Seat Sales',
            icon: DollarSign,
            path: '/super/seat-sales',
            description: 'Seat license sales'
          }
        ]
      }
    ]
  },
  {
    id: 'security',
    label: 'Security & Compliance',
    icon: Shield,
    description: 'Platform security and compliance',
    sections: [
      {
        id: 'security-policies',
        label: 'Policies',
        items: [
          {
            id: 's-05',
            label: 'Global Policies',
            icon: Shield,
            path: '/super/policies',
            description: 'Platform-wide policies'
          }
        ]
      },
      {
        id: 'security-audit',
        label: 'Audit',
        items: [
          {
            id: 's-07',
            label: 'Global Audit Logs',
            icon: FileText,
            path: '/super/audit-logs',
            description: 'Platform audit trail'
          }
        ]
      }
    ]
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get all navigation items from a domain structure (flat list)
 */
export function flattenDomainNav(domains: NavDomain[]): NavItem[] {
  const items: NavItem[] = [];
  
  domains.forEach(domain => {
    domain.sections.forEach(section => {
      items.push(...section.items);
    });
  });
  
  return items;
}

/**
 * Find a navigation item by path
 */
export function findNavItemByPath(domains: NavDomain[], path: string): NavItem | undefined {
  const allItems = flattenDomainNav(domains);
  return allItems.find(item => item.path === path);
}

/**
 * Get domain by ID
 */
export function getDomainById(domains: NavDomain[], domainId: string): NavDomain | undefined {
  return domains.find(domain => domain.id === domainId);
}

/**
 * Count total items in navigation
 */
export function countNavItems(domains: NavDomain[]): number {
  return flattenDomainNav(domains).length;
}

// ============================================================================
// NAVIGATION STATISTICS
// ============================================================================

export const navigationStats = {
  employee: {
    domains: employeeDomainNav.length,
    items: countNavItems(employeeDomainNav)
  },
  admin: {
    domains: adminDomainNav.length,
    items: countNavItems(adminDomainNav)
  },
  superAdmin: {
    domains: superAdminDomainNav.length,
    items: countNavItems(superAdminDomainNav)
  },
  total: {
    domains: employeeDomainNav.length + adminDomainNav.length + superAdminDomainNav.length,
    items: countNavItems(employeeDomainNav) + countNavItems(adminDomainNav) + countNavItems(superAdminDomainNav)
  }
};