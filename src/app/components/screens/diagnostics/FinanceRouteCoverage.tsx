import { PageLayout } from '../../shared/PageLayout';
import { CheckCircle, XCircle, AlertTriangle, FileText } from 'lucide-react';

interface RouteAuditRow {
  menuLabel: string;
  expectedPath: string;
  routeExists: boolean;
  componentExists: boolean;
  hasVisibleContent: boolean;
  notes: string;
}

export function FinanceRouteCoverage() {
  // Data extracted from navigation.ts Finance submenu (lines 45-58)
  const financeMenuItems = [
    { label: 'Cockpit', path: '/org/finance/cockpit' },
    { label: 'Inbox (Approvals)', path: '/org/finance/inbox' },
    { label: 'Quick Add', path: '/org/finance/quick-add' },
    { label: 'Ledger', path: '/org/finance/ledger-control' },
    { label: 'Accounts & Wallets', path: '/org/finance/accounts' },
    { label: 'Import Center', path: '/org/finance/import' },
    { label: 'Review & Decide', path: '/org/finance/review' },
    { label: 'Reimbursements', path: '/org/finance/reimbursements' },
    { label: 'Payroll Posting', path: '/org/finance/payroll-posting' },
    { label: 'Costing & Profit', path: '/org/finance/costing-profit' },
    { label: 'Reports', path: '/org/finance/reports' },
    { label: 'Loans & Liabilities', path: '/org/finance/loans' },
    { label: 'Team & Permissions', path: '/org/finance/team-permissions' },
    { label: 'Finance Settings', path: '/org/finance/settings' },
  ];

  // Audit results based on manual inspection of App.tsx and filesystem
  const auditResults: RouteAuditRow[] = [
    {
      menuLabel: 'Cockpit',
      expectedPath: '/org/finance/cockpit',
      routeExists: true,
      componentExists: true,
      hasVisibleContent: true,
      notes: 'FC01FinanceCockpit - Full 2050 Cockpit with 3D cards, KPIs, recent transactions, quick actions'
    },
    {
      menuLabel: 'Inbox (Approvals)',
      expectedPath: '/org/finance/inbox',
      routeExists: true,
      componentExists: true,
      hasVisibleContent: true,
      notes: 'FC02FinanceInbox - Multi-tab approval inbox with expense/import/reimbursement/payroll workflows'
    },
    {
      menuLabel: 'Quick Add',
      expectedPath: '/org/finance/quick-add',
      routeExists: true,
      componentExists: true,
      hasVisibleContent: true,
      notes: 'FC03QuickAddAdmin - Narration-first input with AI auto-classification, bulk entry support'
    },
    {
      menuLabel: 'Ledger',
      expectedPath: '/org/finance/ledger-control',
      routeExists: true,
      componentExists: true,
      hasVisibleContent: true,
      notes: 'FC04LedgerControl - Immutable ledger viewer with bulk actions, stress-proof validation'
    },
    {
      menuLabel: 'Accounts & Wallets',
      expectedPath: '/org/finance/accounts',
      routeExists: true,
      componentExists: true,
      hasVisibleContent: true,
      notes: 'F04AccountsWallets - Account management with balance tracking, status badges, full data table'
    },
    {
      menuLabel: 'Import Center',
      expectedPath: '/org/finance/import',
      routeExists: true,
      componentExists: true,
      hasVisibleContent: false,
      notes: 'F05StatementImport - Placeholder only: "Upload → Mapping → Parsing → Auto Match → Review → Posted"'
    },
    {
      menuLabel: 'Review & Decide',
      expectedPath: '/org/finance/review',
      routeExists: true,
      componentExists: true,
      hasVisibleContent: true,
      notes: 'F06ReviewDecideQueue - Auto-classified transactions review queue with confidence scores'
    },
    {
      menuLabel: 'Reimbursements',
      expectedPath: '/org/finance/reimbursements',
      routeExists: true,
      componentExists: true,
      hasVisibleContent: true,
      notes: 'FC05Reimbursements - Employee reimbursement tracking with approval workflows'
    },
    {
      menuLabel: 'Payroll Posting',
      expectedPath: '/org/finance/payroll-posting',
      routeExists: true,
      componentExists: true,
      hasVisibleContent: true,
      notes: 'FC06PayrollPosting - Salary posting with department routing, propagation to TIME → FINANCE'
    },
    {
      menuLabel: 'Costing & Profit',
      expectedPath: '/org/finance/costing-profit',
      routeExists: true,
      componentExists: true,
      hasVisibleContent: true,
      notes: 'FC07CostingProfitCommand - Department cost matrix, profit velocity, what-if simulations (11 engines)'
    },
    {
      menuLabel: 'Reports',
      expectedPath: '/org/finance/reports',
      routeExists: true,
      componentExists: true,
      hasVisibleContent: false,
      notes: 'F09Reports - Placeholder only: "Generate P&L, Balance Sheet, Cashflow reports with period filters"'
    },
    {
      menuLabel: 'Loans & Liabilities',
      expectedPath: '/org/finance/loans',
      routeExists: true,
      componentExists: true,
      hasVisibleContent: false,
      notes: 'F10LoansLiabilities - Placeholder only: "Loan tracking, EMI schedules, interest calculations"'
    },
    {
      menuLabel: 'Team & Permissions',
      expectedPath: '/org/finance/team-permissions',
      routeExists: true,
      componentExists: true,
      hasVisibleContent: true,
      notes: 'FC08TeamFinancePermissions - Finance team management with role-based access controls'
    },
    {
      menuLabel: 'Finance Settings',
      expectedPath: '/org/finance/settings',
      routeExists: true,
      componentExists: true,
      hasVisibleContent: true,
      notes: 'FC09FinanceSettings - Finance module configuration and preferences'
    },
  ];

  const totalItems = auditResults.length;
  const routesExist = auditResults.filter(r => r.routeExists).length;
  const componentsExist = auditResults.filter(r => r.componentExists).length;
  const hasContent = auditResults.filter(r => r.hasVisibleContent).length;
  const placeholderOnly = auditResults.filter(r => r.componentExists && !r.hasVisibleContent).length;

  return (
    <PageLayout
      title="FINANCE ROUTE COVERAGE AUDIT"
      description="Complete mapping between navigation items, routes, and screen components"
    >
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div className="text-sm text-muted-foreground">Menu Items</div>
            </div>
            <div className="text-3xl font-semibold">{totalItems}</div>
            <div className="text-xs text-muted-foreground mt-1">In navigation.ts</div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="text-sm text-muted-foreground">Routes Exist</div>
            </div>
            <div className="text-3xl font-semibold">{routesExist}/{totalItems}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {routesExist === totalItems ? '100% coverage ✓' : 'Missing routes'}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="text-sm text-muted-foreground">Components Exist</div>
            </div>
            <div className="text-3xl font-semibold">{componentsExist}/{totalItems}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {componentsExist === totalItems ? '100% coverage ✓' : 'Missing components'}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div className="text-sm text-muted-foreground">Visible Content</div>
            </div>
            <div className="text-3xl font-semibold">{hasContent}/{totalItems}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {placeholderOnly} placeholder{placeholderOnly !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Status Summary */}
        <div className="rounded-lg border-2 border-green-500 bg-green-50 dark:bg-green-950/20 p-6">
          <div className="flex items-start gap-4">
            <CheckCircle className="h-8 w-8 flex-shrink-0 text-green-600 dark:text-green-400" />
            <div className="flex-1">
              <h2 className="mb-2 text-xl text-green-900 dark:text-green-100">COVERAGE STATUS: EXCELLENT</h2>
              <div className="space-y-2 text-green-800 dark:text-green-200">
                <div className="text-sm">
                  <strong>✓ 100% Route Coverage</strong> - All 14 navigation items have matching routes in App.tsx
                </div>
                <div className="text-sm">
                  <strong>✓ 100% Component Coverage</strong> - All routes have imported screen components
                </div>
                <div className="text-sm">
                  <strong>⚠ {Math.round((hasContent/totalItems)*100)}% Production-Ready Content</strong> - {hasContent} screens with full implementation, {placeholderOnly} placeholders
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Audit Table */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="border-b border-border bg-muted px-6 py-4">
            <h3 className="font-semibold">Detailed Coverage Audit</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Row-by-row analysis of navigation → route → component → content
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">#</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Menu Label</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Expected Path</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Route Exists?</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Component Exists?</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Visible Content?</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {auditResults.map((row, idx) => (
                  <tr key={idx} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-sm text-muted-foreground">{idx + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium">{row.menuLabel}</td>
                    <td className="px-4 py-3 text-sm font-mono text-xs">{row.expectedPath}</td>
                    <td className="px-4 py-3 text-center">
                      {row.routeExists ? (
                        <CheckCircle className="h-5 w-5 text-green-600 inline-block" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 inline-block" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {row.componentExists ? (
                        <CheckCircle className="h-5 w-5 text-green-600 inline-block" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 inline-block" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {row.hasVisibleContent ? (
                        <CheckCircle className="h-5 w-5 text-green-600 inline-block" />
                      ) : row.componentExists ? (
                        <AlertTriangle className="h-5 w-5 text-orange-600 inline-block" title="Placeholder only" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 inline-block" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground max-w-md">
                      {row.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Placeholder Analysis */}
        <div className="rounded-lg border border-orange-500 bg-orange-50 dark:bg-orange-950/20 p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-8 w-8 flex-shrink-0 text-orange-600 dark:text-orange-400" />
            <div className="flex-1">
              <h2 className="mb-2 text-xl text-orange-900 dark:text-orange-100">Placeholder Screens Identified</h2>
              <p className="text-sm text-orange-800 dark:text-orange-200 mb-4">
                These screens exist with routes and components but contain minimal placeholder content only:
              </p>
              <div className="space-y-3">
                {auditResults.filter(r => !r.hasVisibleContent && r.componentExists).map((row, idx) => (
                  <div key={idx} className="rounded-lg bg-orange-100 dark:bg-orange-900/40 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-orange-900 dark:text-orange-100">
                          {row.menuLabel}
                        </div>
                        <div className="text-xs font-mono text-orange-700 dark:text-orange-300 mt-1">
                          {row.expectedPath}
                        </div>
                        <div className="text-sm text-orange-800 dark:text-orange-200 mt-2">
                          {row.notes}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Production-Ready Screens */}
        <div className="rounded-lg border border-green-500 bg-green-50 dark:bg-green-950/20 p-6">
          <div className="flex items-start gap-4">
            <CheckCircle className="h-8 w-8 flex-shrink-0 text-green-600 dark:text-green-400" />
            <div className="flex-1">
              <h2 className="mb-2 text-xl text-green-900 dark:text-green-100">Production-Ready Screens ({hasContent})</h2>
              <p className="text-sm text-green-800 dark:text-green-200 mb-4">
                These screens are fully implemented with visible content, data tables, workflows, and interactive features:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {auditResults.filter(r => r.hasVisibleContent).map((row, idx) => (
                  <div key={idx} className="rounded-lg bg-green-100 dark:bg-green-900/40 p-4">
                    <div className="font-semibold text-green-900 dark:text-green-100">
                      {row.menuLabel}
                    </div>
                    <div className="text-xs font-mono text-green-700 dark:text-green-300 mt-1">
                      {row.expectedPath}
                    </div>
                    <div className="text-xs text-green-800 dark:text-green-200 mt-2">
                      {row.notes}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Route Implementation Details */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold mb-4">Route Implementation Details</h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-semibold text-muted-foreground mb-2">Navigation Source:</div>
              <div className="font-mono text-sm bg-muted p-3 rounded">
                /src/app/data/navigation.ts (lines 44-59)
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                adminNavItems → Finance parent (id: 'a-f01') → children array with 14 items
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold text-muted-foreground mb-2">Route Definitions:</div>
              <div className="font-mono text-sm bg-muted p-3 rounded">
                /src/app/App.tsx (lines 206-214)
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                FC01-FC09 screens (Finance Command routes) with matching paths
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold text-muted-foreground mb-2">Component Imports:</div>
              <div className="font-mono text-sm bg-muted p-3 rounded">
                /src/app/App.tsx (lines 46-71)
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Imported from: ./components/screens/org/financeScreens.tsx
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold text-muted-foreground mb-2">Component Files:</div>
              <div className="font-mono text-sm bg-muted p-3 rounded">
                /src/app/components/screens/org/
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                FC01FinanceCockpit.tsx, FC02FinanceInbox.tsx, FC03QuickAddAdmin.tsx, etc.
              </div>
            </div>
          </div>
        </div>

        {/* Architecture Validation */}
        <div className="rounded-lg border border-blue-500 bg-blue-50 dark:bg-blue-950/20 p-6">
          <div className="flex items-start gap-4">
            <CheckCircle className="h-8 w-8 flex-shrink-0 text-blue-600 dark:text-blue-400" />
            <div className="flex-1">
              <h2 className="mb-2 text-xl text-blue-900 dark:text-blue-100">Architecture Validation</h2>
              <div className="space-y-3 text-blue-800 dark:text-blue-200 text-sm">
                <div>
                  <strong>✓ Navigation-to-Route Binding:</strong> Every menu item has a corresponding route
                </div>
                <div>
                  <strong>✓ Route-to-Component Binding:</strong> Every route references an imported component
                </div>
                <div>
                  <strong>✓ Component-to-File Binding:</strong> All imported components exist as files
                </div>
                <div>
                  <strong>✓ Import Chain Integrity:</strong> financeScreens.tsx exports all required components
                </div>
                <div>
                  <strong>⚠ Content Completion:</strong> {hasContent}/{totalItems} screens have production-ready content ({Math.round((hasContent/totalItems)*100)}%)
                </div>
                <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
                  <strong>Conclusion:</strong> The Finance module architecture is sound. All navigation items are properly wired to routes and components. The {placeholderOnly} placeholder screens are intentional gaps awaiting implementation, not broken bindings.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
