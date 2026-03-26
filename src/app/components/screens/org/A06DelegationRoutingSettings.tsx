import { PageLayout } from '../../shared/PageLayout';
import { Button } from '../../ui/button';
import { useToast } from '../../ui/toast';
import { Settings, Users, Clock, AlertTriangle, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface RoutingRule {
  id: string;
  type: 'expense' | 'import' | 'revision';
  condition: string;
  approver: string;
  priority: number;
}

interface Delegation {
  id: string;
  approver: string;
  delegate: string;
  startDate: string;
  endDate: string;
  active: boolean;
}

export function A06DelegationRoutingSettings() {
  const { showToast } = useToast();
  const [routingRules, setRoutingRules] = useState<RoutingRule[]>([
    { id: '1', type: 'expense', condition: 'Amount > $500', approver: 'Org Admin', priority: 1 },
    { id: '2', type: 'expense', condition: 'Department = Sales', approver: 'Sales Manager', priority: 2 },
    { id: '3', type: 'expense', condition: 'Billable = true', approver: 'Project Owner (view-only)', priority: 3 },
    { id: '4', type: 'import', condition: 'All imports', approver: 'Finance Manager', priority: 1 },
    { id: '5', type: 'revision', condition: 'All revisions', approver: 'Org Admin', priority: 1 }
  ]);

  const [delegations, setDelegations] = useState<Delegation[]>([
    {
      id: '1',
      approver: 'Sarah Chen (Finance Manager)',
      delegate: 'Tom Wilson (Senior Accountant)',
      startDate: '2026-01-10',
      endDate: '2026-01-20',
      active: true
    }
  ]);

  const [slaSettings, setSlaSettings] = useState({
    reminderHours: 24,
    escalateHours: 48,
    defaultApprover: 'Org Admin'
  });

  const handleSaveSLA = () => {
    showToast('success', 'Settings Saved', 'SLA settings updated successfully');
  };

  const handleAddDelegation = () => {
    showToast('info', 'Add Delegation', 'Delegation form would open here');
  };

  const handleDeleteDelegation = (id: string) => {
    setDelegations(delegations.filter(d => d.id !== id));
    showToast('success', 'Deleted', 'Delegation removed');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <PageLayout
      title="ORG – A-06 – Delegation & Routing Settings"
      description="Configure approval workflows, routing rules, and delegation policies"
      actions={
        <Button onClick={handleSaveSLA}>
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      }
      kpis={[
        {
          title: 'Active Rules',
          value: routingRules.length.toString(),
          change: 'Routing configurations',
          changeType: 'neutral',
          icon: <Settings className="h-5 w-5" />
        },
        {
          title: 'Active Delegations',
          value: delegations.filter(d => d.active).length.toString(),
          change: 'Currently delegated',
          changeType: 'neutral',
          icon: <Users className="h-5 w-5" />
        },
        {
          title: 'SLA Reminder',
          value: `${slaSettings.reminderHours}h`,
          change: 'Hours before reminder',
          changeType: 'neutral',
          icon: <Clock className="h-5 w-5" />
        },
        {
          title: 'Escalation Time',
          value: `${slaSettings.escalateHours}h`,
          change: 'Hours before escalation',
          changeType: 'neutral',
          icon: <AlertTriangle className="h-5 w-5" />
        }
      ]}
    >
      <div className="space-y-6">
        {/* Expense Routing Rules */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Expense Routing Rules</h3>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </div>

          <div className="space-y-3">
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">1</span>
                  </div>
                  <div>
                    <p className="font-semibold">Default Approver</p>
                    <p className="text-sm text-muted-foreground">All expenses go to Org Admin by default</p>
                  </div>
                </div>
                <span className="px-2 py-1 rounded text-xs bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">Active</span>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 bg-background rounded px-3 py-2 text-sm">
                  <span className="text-muted-foreground">Approver:</span> <strong>Org Admin</strong>
                </div>
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">2</span>
                  </div>
                  <div>
                    <p className="font-semibold">Department-Based Routing</p>
                    <p className="text-sm text-muted-foreground">Route to Department Head if department selected</p>
                  </div>
                </div>
                <span className="px-2 py-1 rounded text-xs bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">Active</span>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 bg-background rounded px-3 py-2 text-sm">
                  <span className="text-muted-foreground">Condition:</span> <strong>Department is selected</strong>
                </div>
                <div className="flex-1 bg-background rounded px-3 py-2 text-sm">
                  <span className="text-muted-foreground">Approver:</span> <strong>Department Head</strong>
                </div>
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">3</span>
                  </div>
                  <div>
                    <p className="font-semibold">High-Value 2-Step Approval</p>
                    <p className="text-sm text-muted-foreground">Expenses over $500 require Dept Head + Org Admin</p>
                  </div>
                </div>
                <span className="px-2 py-1 rounded text-xs bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">Active</span>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 bg-background rounded px-3 py-2 text-sm">
                  <span className="text-muted-foreground">Condition:</span> <strong>Amount &gt; $500</strong>
                </div>
                <div className="flex-1 bg-background rounded px-3 py-2 text-sm">
                  <span className="text-muted-foreground">Approvers:</span> <strong>Dept Head → Org Admin</strong>
                </div>
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">4</span>
                  </div>
                  <div>
                    <p className="font-semibold">Billable Notification</p>
                    <p className="text-sm text-muted-foreground">Project Owner gets view-only notification for billable expenses</p>
                  </div>
                </div>
                <span className="px-2 py-1 rounded text-xs bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">Active</span>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 bg-background rounded px-3 py-2 text-sm">
                  <span className="text-muted-foreground">Condition:</span> <strong>Billable = true</strong>
                </div>
                <div className="flex-1 bg-background rounded px-3 py-2 text-sm">
                  <span className="text-muted-foreground">Notify:</span> <strong>Project Owner (view-only)</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delegation Management */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Approval Delegation</h3>
            <Button size="sm" onClick={handleAddDelegation}>
              <Plus className="h-4 w-4 mr-2" />
              Add Delegation
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Delegate approval authority during absences. All decisions are audit logged.
          </p>

          <div className="space-y-3">
            {delegations.map((delegation) => (
              <div key={delegation.id} className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold">{delegation.approver} → {delegation.delegate}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(delegation.startDate)} to {formatDate(delegation.endDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {delegation.active && (
                      <span className="px-2 py-1 rounded text-xs bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                        Active
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteDelegation(delegation.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {delegations.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground mb-4">No active delegations</p>
                <Button size="sm" onClick={handleAddDelegation}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Delegation
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* SLA Configuration */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">SLA & Escalation</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                <Clock className="inline h-4 w-4 mr-1" />
                Reminder After (hours)
              </label>
              <input
                type="number"
                value={slaSettings.reminderHours}
                onChange={(e) => setSlaSettings({ ...slaSettings, reminderHours: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Send reminder notification to approver
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <AlertTriangle className="inline h-4 w-4 mr-1" />
                Escalate After (hours)
              </label>
              <input
                type="number"
                value={slaSettings.escalateHours}
                onChange={(e) => setSlaSettings({ ...slaSettings, escalateHours: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Escalate to Org Admin if no action
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Fallback Approver
              </label>
              <select
                value={slaSettings.defaultApprover}
                onChange={(e) => setSlaSettings({ ...slaSettings, defaultApprover: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="Org Admin">Org Admin</option>
                <option value="Finance Manager">Finance Manager</option>
                <option value="CEO">CEO</option>
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                Final fallback if no other approver available
              </p>
            </div>
          </div>

          <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h4 className="font-semibold mb-2">How SLA Works:</h4>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>Expense submitted → Assigned to approver based on routing rules</li>
              <li>After {slaSettings.reminderHours}h → Reminder notification sent</li>
              <li>After {slaSettings.escalateHours}h → Escalated to {slaSettings.defaultApprover}</li>
              <li>All delays visible in approval dashboard as "Overdue"</li>
            </ol>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSaveSLA}>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Save All Settings
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
