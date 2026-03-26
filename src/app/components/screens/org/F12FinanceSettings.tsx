import { PageLayout } from '../../shared/PageLayout';
import { FormField, Input, Select } from '../../ui/form';
import { Button } from '../../ui/button';
import { useToast } from '../../ui/toast';
import { Settings, Shield, Database, Download } from 'lucide-react';
import { useState } from 'react';
import { mockFinanceSettings } from '../finance/mockData';
import { FinanceSubNav } from './FinanceSubNav';

export function F12FinanceSettings() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState(mockFinanceSettings);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    showToast('success', 'Settings Saved', 'Finance settings have been updated');
  };

  return (
    <PageLayout
      title="ORG – F-12 – Finance Settings"
      description="Configure finance module behavior and preferences"
      subNav={<FinanceSubNav />}
      actions={
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      }
      kpis={[
        {
          title: 'Auto-Classification Rate',
          value: `${settings.confidenceThreshold}%`,
          change: 'Confidence threshold',
          icon: <Settings className="h-5 w-5" />
        },
        {
          title: 'Data Retention',
          value: `${Math.floor(settings.dataRetentionDays / 365)}y`,
          change: `${settings.dataRetentionDays} days`,
          icon: <Database className="h-5 w-5" />
        },
      ]}
    >
      <div className="max-w-3xl space-y-8">
        {/* General Settings */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            General Settings
          </h3>

          <div className="space-y-6">
            <FormField label="Enable Personal World" name="enablePersonalWorld">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enablePersonalWorld}
                  onChange={(e) => setSettings({ ...settings, enablePersonalWorld: e.target.checked })}
                  className="w-4 h-4 rounded border-border mt-0.5"
                />
                <div>
                  <p className="font-medium text-sm">Track personal finances separately</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enables separate tracking for personal income and expenses alongside business
                  </p>
                </div>
              </label>
            </FormField>

            <FormField label="Default Currency" name="defaultCurrency">
              <Select
                id="defaultCurrency"
                value={settings.defaultCurrency}
                onChange={(e) => setSettings({ ...settings, defaultCurrency: e.target.value })}
                options={[
                  { value: 'USD', label: 'USD - US Dollar' },
                  { value: 'EUR', label: 'EUR - Euro' },
                  { value: 'GBP', label: 'GBP - British Pound' },
                  { value: 'INR', label: 'INR - Indian Rupee' }
                ]}
              />
            </FormField>

            <FormField label="Fiscal Year Start" name="fiscalYearStart">
              <Input
                id="fiscalYearStart"
                type="text"
                value={settings.fiscalYearStart}
                onChange={(e) => setSettings({ ...settings, fiscalYearStart: e.target.value })}
                placeholder="MM-DD (e.g., 01-01, 04-01)"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Format: MM-DD (e.g., 04-01 for April 1st)
              </p>
            </FormField>
          </div>
        </div>

        {/* AI & Automation */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            AI & Automation
          </h3>

          <div className="space-y-6">
            <FormField 
              label="Auto-Post Confidence Threshold" 
              name="confidenceThreshold"
            >
              <div className="space-y-2">
                <Input
                  id="confidenceThreshold"
                  type="number"
                  value={settings.confidenceThreshold}
                  onChange={(e) => setSettings({ ...settings, confidenceThreshold: parseInt(e.target.value) })}
                  min="0"
                  max="100"
                />
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${settings.confidenceThreshold}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{settings.confidenceThreshold}%</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Transactions with AI confidence above this threshold will be auto-posted. Lower values = more automation, higher values = more review needed.
                </p>
              </div>
            </FormField>

            <FormField label="Require Approval" name="requireApproval">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.requireApproval}
                  onChange={(e) => setSettings({ ...settings, requireApproval: e.target.checked })}
                  className="w-4 h-4 rounded border-border mt-0.5"
                />
                <div>
                  <p className="font-medium text-sm">Require approval for large transactions</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Transactions above threshold need owner/admin approval
                  </p>
                </div>
              </label>
            </FormField>

            {settings.requireApproval && (
              <FormField label="Approval Threshold" name="approvalThreshold">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="approvalThreshold"
                    type="number"
                    value={settings.approvalThreshold}
                    onChange={(e) => setSettings({ ...settings, approvalThreshold: parseInt(e.target.value) })}
                    className="pl-7"
                    placeholder="5000"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Transactions above this amount require approval
                </p>
              </FormField>
            )}
          </div>
        </div>

        {/* Approval Workflow Settings */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Approval Workflows
          </h3>

          <div className="space-y-6">
            <FormField label="Team Expense Approval" name="requireTeamExpenseApproval">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.requireApproval}
                  onChange={(e) => setSettings({ ...settings, requireApproval: e.target.checked })}
                  className="w-4 h-4 rounded border-border mt-0.5"
                />
                <div>
                  <p className="font-medium text-sm">Require approval for all team member expenses</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    All expenses submitted by team members (non-admin/owner) require approval before posting to ledger
                  </p>
                </div>
              </label>
            </FormField>

            <FormField label="Import Approval" name="requireImportApproval">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.requireApproval}
                  onChange={(e) => setSettings({ ...settings, requireApproval: e.target.checked })}
                  className="w-4 h-4 rounded border-border mt-0.5"
                />
                <div>
                  <p className="font-medium text-sm">Require approval for statement imports</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Imported transactions need review and approval before posting to ledger
                  </p>
                </div>
              </label>
            </FormField>

            <FormField label="Revision Approval" name="requireRevisionApproval">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.requireApproval}
                  onChange={(e) => setSettings({ ...settings, requireApproval: e.target.checked })}
                  className="w-4 h-4 rounded border-border mt-0.5"
                />
                <div>
                  <p className="font-medium text-sm">Require approval for transaction revisions</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Edits to posted transactions create revision entries that need approval
                  </p>
                </div>
              </label>
            </FormField>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2 text-blue-600 dark:text-blue-400">
                ℹ️ Approval Flow Protection
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Ledger remains immutable - all deletes create revision entries</li>
                <li>• Approval workflows can never be bypassed</li>
                <li>• Transaction outcomes are always visible to submitter</li>
                <li>• Balances shown reflect approved/posted transactions only</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Data & Privacy */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Data & Privacy
          </h3>

          <div className="space-y-6">
            <FormField label="Enable Auto Backup" name="enableAutoBackup">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableAutoBackup}
                  onChange={(e) => setSettings({ ...settings, enableAutoBackup: e.target.checked })}
                  className="w-4 h-4 rounded border-border mt-0.5"
                />
                <div>
                  <p className="font-medium text-sm">Automatic daily backups</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your data is backed up daily and encrypted at rest
                  </p>
                </div>
              </label>
            </FormField>

            <FormField label="Data Retention Period" name="dataRetentionDays">
              <Select
                id="dataRetentionDays"
                value={settings.dataRetentionDays.toString()}
                onChange={(e) => setSettings({ ...settings, dataRetentionDays: parseInt(e.target.value) })}
                options={[
                  { value: '365', label: '1 Year' },
                  { value: '730', label: '2 Years' },
                  { value: '1825', label: '5 Years' },
                  { value: '2555', label: '7 Years (Tax Compliance)' },
                  { value: '3650', label: '10 Years' },
                  { value: '-1', label: 'Forever' }
                ]}
              />
              <p className="text-xs text-muted-foreground mt-1">
                How long to keep financial data. Recommended: 7 years for tax compliance.
              </p>
            </FormField>

            <FormField label="Export Format" name="exportFormat">
              <Select
                id="exportFormat"
                value={settings.exportFormat}
                onChange={(e) => setSettings({ ...settings, exportFormat: e.target.value as any })}
                options={[
                  { value: 'pdf', label: 'PDF' },
                  { value: 'excel', label: 'Excel (.xlsx)' },
                  { value: 'csv', label: 'CSV' }
                ]}
              />
            </FormField>
          </div>
        </div>

        {/* Data Ownership & Exit */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Download className="h-5 w-5" />
            Data Ownership & Exit
          </h3>

          <div className="space-y-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2 text-green-600 dark:text-green-400">
                ✓ You Own Your Data 100%
              </h4>
              <p className="text-sm text-muted-foreground">
                All your financial data belongs to you. You can export or delete it anytime, no questions asked.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-sm mb-1">Export All Transactions</p>
                  <p className="text-xs text-muted-foreground">
                    Download complete ledger with all transaction history
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="mr-2 h-3 w-3" />
                  Export CSV
                </Button>
              </div>

              <div className="flex items-start justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-sm mb-1">Export Reports Package</p>
                  <p className="text-xs text-muted-foreground">
                    P&L, Balance Sheet, Cashflow, Net Worth (Last 3 years)
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="mr-2 h-3 w-3" />
                  Export PDF
                </Button>
              </div>

              <div className="flex items-start justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-sm mb-1">Export Audit Logs</p>
                  <p className="text-xs text-muted-foreground">
                    Complete activity log of all users and actions
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="mr-2 h-3 w-3" />
                  Export JSON
                </Button>
              </div>

              <div className="flex items-start justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-sm mb-1">Full Data Dump (Exit)</p>
                  <p className="text-xs text-muted-foreground">
                    Everything: Transactions, Accounts, Rules, Settings, Attachments
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="mr-2 h-3 w-3" />
                  Export ZIP
                </Button>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <p className="text-sm">
                <strong>No Lock-in:</strong> All exports are in standard formats (CSV, PDF, JSON, ZIP). You can import them into any other accounting software.
              </p>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
          <h3 className="font-semibold mb-4 text-red-600 dark:text-red-400">Danger Zone</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Delete All Finance Data</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Permanently delete all transactions, accounts, and reports
                </p>
              </div>
              <Button variant="outline" className="border-red-500 text-red-600 dark:text-red-400">
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}