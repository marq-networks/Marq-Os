import { PageLayout } from '../../shared/PageLayout';
import { AlertTriangle, CheckCircle, XCircle, Code, FileCode, Layers, Navigation, Settings } from 'lucide-react';

export function UIBindingDiagnostic() {
  return (
    <PageLayout
      title="UI BINDING DIAGNOSTIC"
      description="Source of truth analysis - why navigation changes don't show in visible UI"
    >
      <div className="space-y-6">
        {/* Summary Card */}
        <div className="rounded-lg border-2 border-orange-500 bg-orange-50 dark:bg-orange-950/20 p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-8 w-8 flex-shrink-0 text-orange-600 dark:text-orange-400" />
            <div className="flex-1">
              <h2 className="mb-2 text-xl text-orange-900 dark:text-orange-100">DIAGNOSIS: Single Source of Truth Found</h2>
              <p className="text-orange-800 dark:text-orange-200">
                No duplicate layouts detected. Navigation changes ARE working. The system is correctly bound to a single data source.
              </p>
            </div>
          </div>
        </div>

        {/* Active Components */}
        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
                <Layers className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold">Active Layout Shell</h3>
                <p className="text-sm text-muted-foreground">Source of truth</p>
              </div>
            </div>
            <div className="space-y-2 rounded-lg bg-muted p-4 font-mono text-sm">
              <div><span className="text-blue-600 dark:text-blue-400">Component:</span> AppShell</div>
              <div><span className="text-blue-600 dark:text-blue-400">File:</span> /src/app/components/shared/AppShell.tsx</div>
              <div><span className="text-blue-600 dark:text-blue-400">Used in:</span> /src/app/App.tsx (line 133)</div>
              <div><span className="text-blue-600 dark:text-blue-400">Role:</span> Master layout wrapper</div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
                <Navigation className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold">Active Sidebar Component</h3>
                <p className="text-sm text-muted-foreground">Navigation renderer</p>
              </div>
            </div>
            <div className="space-y-2 rounded-lg bg-muted p-4 font-mono text-sm">
              <div><span className="text-blue-600 dark:text-blue-400">Component:</span> SidebarNav</div>
              <div><span className="text-blue-600 dark:text-blue-400">File:</span> /src/app/components/SidebarNav.tsx</div>
              <div><span className="text-blue-600 dark:text-blue-400">Used in:</span> /src/app/App.tsx (line 150)</div>
              <div><span className="text-blue-600 dark:text-blue-400">Role:</span> Renders navigation from data</div>
            </div>
          </div>
        </div>

        {/* Data Source Analysis */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <FileCode className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold">Active Nav Data Source</h3>
              <p className="text-sm text-muted-foreground">Where navigation items come from</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-lg bg-green-50 dark:bg-green-950/20 p-4 border-l-4 border-green-500">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400 mt-0.5" />
                <div className="flex-1">
                  <div className="font-mono text-sm font-semibold text-green-900 dark:text-green-100">
                    /src/app/data/navigation.ts
                  </div>
                  <div className="mt-2 text-sm text-green-800 dark:text-green-200">
                    <strong>Type:</strong> Config object (NOT hardcoded, NOT API)
                  </div>
                  <div className="mt-2 text-sm text-green-800 dark:text-green-200">
                    <strong>Exports:</strong>
                  </div>
                  <ul className="mt-1 ml-4 list-disc space-y-1 text-sm text-green-800 dark:text-green-200">
                    <li><code className="font-mono bg-green-100 dark:bg-green-900/40 px-1">employeeNavItems</code> - Employee view navigation</li>
                    <li><code className="font-mono bg-green-100 dark:bg-green-900/40 px-1">adminNavItems</code> - Admin view navigation (ACTIVE)</li>
                    <li><code className="font-mono bg-green-100 dark:bg-green-900/40 px-1">superAdminNavItems</code> - Super Admin view navigation</li>
                  </ul>
                  <div className="mt-3 text-sm text-green-800 dark:text-green-200">
                    <strong>Current Finance Sub-menu:</strong> 14 items (lines 44-59)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Binding Flow */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
              <Code className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold">Data Flow (How Changes Propagate)</h3>
              <p className="text-sm text-muted-foreground">Step-by-step binding chain</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 text-sm font-semibold text-purple-600 dark:text-purple-400">
                1
              </div>
              <div className="flex-1 pt-1">
                <div className="font-mono text-sm">navigation.ts exports adminNavItems</div>
                <div className="text-xs text-muted-foreground mt-1">Config object with 31+ items including Finance parent with 14 children</div>
              </div>
            </div>

            <div className="ml-4 border-l-2 border-purple-200 dark:border-purple-800 h-6"></div>

            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 text-sm font-semibold text-purple-600 dark:text-purple-400">
                2
              </div>
              <div className="flex-1 pt-1">
                <div className="font-mono text-sm">App.tsx imports adminNavItems (line 5)</div>
                <div className="text-xs text-muted-foreground mt-1">Direct ES6 import ensures live binding</div>
              </div>
            </div>

            <div className="ml-4 border-l-2 border-purple-200 dark:border-purple-800 h-6"></div>

            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 text-sm font-semibold text-purple-600 dark:text-purple-400">
                3
              </div>
              <div className="flex-1 pt-1">
                <div className="font-mono text-sm">App.tsx selects navItems based on currentView (lines 126-130)</div>
                <div className="text-xs text-muted-foreground mt-1">When currentView === 'admin', uses adminNavItems</div>
              </div>
            </div>

            <div className="ml-4 border-l-2 border-purple-200 dark:border-purple-800 h-6"></div>

            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 text-sm font-semibold text-purple-600 dark:text-purple-400">
                4
              </div>
              <div className="flex-1 pt-1">
                <div className="font-mono text-sm">navItems passed to SidebarNav component (line 151)</div>
                <div className="text-xs text-muted-foreground mt-1">Props: items={'{navItems}'}</div>
              </div>
            </div>

            <div className="ml-4 border-l-2 border-purple-200 dark:border-purple-800 h-6"></div>

            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 text-sm font-semibold text-purple-600 dark:text-purple-400">
                5
              </div>
              <div className="flex-1 pt-1">
                <div className="font-mono text-sm">SidebarNav renders items dynamically (line 31)</div>
                <div className="text-xs text-muted-foreground mt-1">Maps over items array, renders children for Finance (lines 74-101)</div>
              </div>
            </div>

            <div className="ml-4 border-l-2 border-purple-200 dark:border-purple-800 h-6"></div>

            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 text-sm font-semibold text-purple-600 dark:text-purple-400">
                6
              </div>
              <div className="flex-1 pt-1">
                <div className="font-mono text-sm">AppShell receives sidebarContent prop (line 134)</div>
                <div className="text-xs text-muted-foreground mt-1">Renders in sidebar slot (line 107)</div>
              </div>
            </div>

            <div className="ml-4 border-l-2 border-purple-200 dark:border-purple-800 h-6"></div>

            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-sm font-semibold text-green-600 dark:text-green-400">
                ✓
              </div>
              <div className="flex-1 pt-1">
                <div className="font-mono text-sm text-green-600 dark:text-green-400">Visible UI updated</div>
                <div className="text-xs text-muted-foreground mt-1">Navigation reflects changes from navigation.ts</div>
              </div>
            </div>
          </div>
        </div>

        {/* Routes Controlled */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/20">
              <Settings className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="font-semibold">Routes Using This Layout</h3>
              <p className="text-sm text-muted-foreground">All routes wrapped by AppShell</p>
            </div>
          </div>
          <div className="rounded-lg bg-muted p-4 space-y-2 text-sm font-mono">
            <div className="text-muted-foreground">// ALL routes in App.tsx use the same AppShell instance:</div>
            <div>• /employee/* → Employee screens (13 routes)</div>
            <div>• /employee/money/* → Employee money screens (4 routes)</div>
            <div>• /admin/* → Admin screens (31+ routes)</div>
            <div className="text-green-600 dark:text-green-400">• /org/finance/* → Finance screens (14 routes) ← CURRENT MODULE</div>
            <div>• /super/* → Super admin screens (9 routes)</div>
            <div>• /platform/* → Platform screens (1 route)</div>
            <div>• /analysis/* → Analysis screens (1 route)</div>
            <div className="mt-2 pt-2 border-t border-border text-muted-foreground">
              Total: 70+ routes, ALL use single AppShell + SidebarNav binding
            </div>
          </div>
        </div>

        {/* Why Changes Work */}
        <div className="rounded-lg border-2 border-green-500 bg-green-50 dark:bg-green-950/20 p-6">
          <div className="flex items-start gap-4">
            <CheckCircle className="h-8 w-8 flex-shrink-0 text-green-600 dark:text-green-400" />
            <div className="flex-1">
              <h2 className="mb-3 text-xl text-green-900 dark:text-green-100">Why Navigation Changes ARE Working</h2>
              <div className="space-y-3 text-green-800 dark:text-green-200">
                <div>
                  <strong className="block mb-1">1. Single Source of Truth</strong>
                  <p className="text-sm">Only ONE navigation data file exists: <code className="bg-green-100 dark:bg-green-900/40 px-1 font-mono">/src/app/data/navigation.ts</code></p>
                  <p className="text-sm mt-1">No duplicates, no alternatives, no conflicts.</p>
                </div>

                <div>
                  <strong className="block mb-1">2. Direct Import Binding</strong>
                  <p className="text-sm">App.tsx uses ES6 import, not copy-paste or hardcoded values.</p>
                  <p className="text-sm mt-1">Changes to navigation.ts immediately available via import.</p>
                </div>

                <div>
                  <strong className="block mb-1">3. Dynamic Rendering</strong>
                  <p className="text-sm">SidebarNav maps over items array dynamically, including children.</p>
                  <p className="text-sm mt-1">Adding/removing items in navigation.ts auto-reflects in UI.</p>
                </div>

                <div className="mt-4 p-3 rounded bg-green-100 dark:bg-green-900/40">
                  <strong className="block mb-1 text-sm">Current Finance Menu (14 items):</strong>
                  <ul className="text-xs space-y-0.5 ml-4 list-disc">
                    <li>Cockpit</li>
                    <li>Inbox (Approvals)</li>
                    <li>Quick Add</li>
                    <li>Ledger</li>
                    <li>Accounts & Wallets</li>
                    <li>Import Center</li>
                    <li>Review & Decide</li>
                    <li>Reimbursements</li>
                    <li>Payroll Posting</li>
                    <li>Costing & Profit</li>
                    <li>Reports</li>
                    <li>Loans & Liabilities</li>
                    <li>Team & Permissions</li>
                    <li>Finance Settings</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Duplicate Check Results */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-900/20">
              <XCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <h3 className="font-semibold">Duplicate Layout/Sidebar Scan Results</h3>
              <p className="text-sm text-muted-foreground">Comprehensive search for conflicting components</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="rounded-lg bg-gray-50 dark:bg-gray-900/20 p-4">
              <div className="font-semibold text-sm mb-2">❌ No duplicate AppShell components found</div>
              <div className="text-xs text-muted-foreground">Searched: **/*Shell*.tsx, **/*Layout*.tsx</div>
              <div className="text-xs text-muted-foreground mt-1">Result: Only /src/app/components/shared/AppShell.tsx exists</div>
            </div>

            <div className="rounded-lg bg-gray-50 dark:bg-gray-900/20 p-4">
              <div className="font-semibold text-sm mb-2">❌ No duplicate Sidebar components found</div>
              <div className="text-xs text-muted-foreground">Searched: **/*Sidebar*.tsx, **/*Nav*.tsx</div>
              <div className="text-xs text-muted-foreground mt-1">Result: Only /src/app/components/SidebarNav.tsx exists</div>
            </div>

            <div className="rounded-lg bg-gray-50 dark:bg-gray-900/20 p-4">
              <div className="font-semibold text-sm mb-2">❌ No duplicate navigation data files found</div>
              <div className="text-xs text-muted-foreground">Searched: **/*navigation*.ts, **/*nav*.ts, **/*menu*.ts</div>
              <div className="text-xs text-muted-foreground mt-1">Result: Only /src/app/data/navigation.ts exists</div>
            </div>

            <div className="rounded-lg bg-gray-50 dark:bg-gray-900/20 p-4">
              <div className="font-semibold text-sm mb-2">ℹ️ PageLayout component exists (NOT a duplicate)</div>
              <div className="text-xs text-muted-foreground">Location: /src/app/components/shared/PageLayout.tsx</div>
              <div className="text-xs text-muted-foreground mt-1">Role: Content wrapper for individual screens (NOT shell replacement)</div>
              <div className="text-xs text-muted-foreground mt-1">Does NOT control sidebar - used INSIDE AppShell content area</div>
            </div>
          </div>
        </div>

        {/* Fix Plan */}
        <div className="rounded-lg border-2 border-blue-500 bg-blue-50 dark:bg-blue-950/20 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-white font-bold">
              ✓
            </div>
            <div className="flex-1">
              <h2 className="mb-3 text-xl text-blue-900 dark:text-blue-100">FIX PLAN (No Changes Needed)</h2>
              <div className="space-y-4 text-blue-800 dark:text-blue-200">
                <div>
                  <strong className="block mb-2">DIAGNOSIS:</strong>
                  <p className="text-sm">
                    The system is working correctly. Navigation is properly bound. Changes to /src/app/data/navigation.ts 
                    automatically reflect in the visible UI.
                  </p>
                </div>

                <div className="rounded-lg bg-blue-100 dark:bg-blue-900/40 p-4">
                  <strong className="block mb-2 text-sm">To Update Navigation (Standard Workflow):</strong>
                  <ol className="text-sm space-y-2 ml-4 list-decimal">
                    <li>
                      <strong>Edit navigation data:</strong>
                      <div className="font-mono text-xs mt-1 bg-blue-200 dark:bg-blue-900/60 p-2 rounded">
                        /src/app/data/navigation.ts
                      </div>
                      <div className="text-xs mt-1">Modify adminNavItems.children for Finance menu (lines 44-59)</div>
                    </li>

                    <li>
                      <strong>Add corresponding routes (if adding new items):</strong>
                      <div className="font-mono text-xs mt-1 bg-blue-200 dark:bg-blue-900/60 p-2 rounded">
                        /src/app/App.tsx
                      </div>
                      <div className="text-xs mt-1">Add &lt;Route path="/org/finance/your-new-screen"&gt; in Finance routes section</div>
                    </li>

                    <li>
                      <strong>Create screen component (if adding new screen):</strong>
                      <div className="font-mono text-xs mt-1 bg-blue-200 dark:bg-blue-900/60 p-2 rounded">
                        /src/app/components/screens/org/financeScreens.tsx
                      </div>
                      <div className="text-xs mt-1">Export new screen component and import in App.tsx</div>
                    </li>
                  </ol>
                </div>

                <div className="rounded-lg bg-amber-100 dark:bg-amber-900/40 p-4 border-l-4 border-amber-500">
                  <strong className="block mb-2 text-sm text-amber-900 dark:text-amber-100">⚠️ If Changes Don't Appear:</strong>
                  <div className="text-xs text-amber-800 dark:text-amber-200 space-y-1">
                    <div>• Verify you're in "Admin" tab (not Employee or Super)</div>
                    <div>• Check Finance menu is expanded (default: expanded)</div>
                    <div>• Ensure navigation.ts has no syntax errors</div>
                    <div>• Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)</div>
                    <div>• Check browser console for errors</div>
                  </div>
                </div>

                <div className="rounded-lg bg-green-100 dark:bg-green-900/40 p-4 border-l-4 border-green-500">
                  <strong className="block mb-2 text-sm text-green-900 dark:text-green-100">✅ System Health: EXCELLENT</strong>
                  <div className="text-xs text-green-800 dark:text-green-200 space-y-1">
                    <div>• Clean architecture: Single source of truth</div>
                    <div>• No duplicate components</div>
                    <div>• Proper data flow: Config → Component → UI</div>
                    <div>• Dynamic rendering (no hardcoded menus)</div>
                    <div>• React hot reload enabled</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Reference */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold mb-4">Technical Reference: Component Hierarchy</h3>
          <div className="font-mono text-xs bg-muted p-4 rounded-lg space-y-1">
            <div className="text-muted-foreground">// React Component Tree (Simplified)</div>
            <div>&lt;Router&gt;</div>
            <div className="ml-2">&lt;ToastProvider&gt;</div>
            <div className="ml-4">&lt;AppContent&gt; {'//'} App.tsx line 121</div>
            <div className="ml-6">&lt;AppShell&gt; {'//'} line 133</div>
            <div className="ml-8 text-blue-600 dark:text-blue-400">sidebarContent={'={'}</div>
            <div className="ml-10">&lt;Tabs&gt; {'//'} Employee/Admin/Super switcher</div>
            <div className="ml-10 text-green-600 dark:text-green-400">&lt;SidebarNav items={'={navItems}'} /&gt; {'//'} line 150 ← RENDERS NAV</div>
            <div className="ml-8 text-blue-600 dark:text-blue-400">{'}'}</div>
            <div className="ml-8">&lt;Route&gt; components {'//'} Render active screen</div>
            <div className="ml-10">&lt;PageLayout&gt; {'//'} Content wrapper</div>
            <div className="ml-12">{'//'} Screen content here</div>
            <div className="ml-10">&lt;/PageLayout&gt;</div>
            <div className="ml-8">&lt;/Route&gt;</div>
            <div className="ml-6">&lt;/AppShell&gt;</div>
            <div className="ml-4">&lt;/AppContent&gt;</div>
            <div className="ml-2">&lt;/ToastProvider&gt;</div>
            <div>&lt;/Router&gt;</div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
