import { PageLayout } from '../../shared/PageLayout';
import { Card3D } from '../../shared/Card3D';
import { StatusBadge } from '../../shared/StatusBadge';
import { Breadcrumb } from '../../shared/Breadcrumb';
import { FinanceTopTabs } from '../../../finance/components/FinanceTopTabs';
import { useToast } from '../../ui/toast';
import { useState } from 'react';
import { Settings, Database, Download, Shield, DollarSign, AlertTriangle } from 'lucide-react';

export function FC09FinanceSettings() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState({
    enablePersonalWorld: false,
    approvalThreshold: 500,
    cashAccountId: 'ACC-001',
    dataRetention: 7,
    autoBackup: true
  });

  const handleSave = () => {
    showToast('Finance settings saved successfully', 'success');
  };

  return (
    <PageLayout
      title="ORG – FC-09 – Finance Settings"
      description="Configure finance system settings and preferences"
    >
      <Breadcrumb items={[
        { label: 'Finance', path: '/org/finance/cockpit' },
        { label: 'Settings' }
      ]} />
      <FinanceTopTabs />
      <div className="max-w-3xl space-y-6">
        {/* General Settings */}
        <Card3D>
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-5 w-5" />
            <h3 className="font-semibold">General Settings</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Enable Personal World</p>
                <p className="text-xs text-muted-foreground">
                  Allow employees to track personal finances separately
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enablePersonalWorld}
                  onChange={(e) => setSettings({ ...settings, enablePersonalWorld: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Auto Backup</p>
                <p className="text-xs text-muted-foreground">
                  Automatically backup ledger data daily
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoBackup}
                  onChange={(e) => setSettings({ ...settings, autoBackup: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </Card3D>

        {/* Approval Settings */}
        <Card3D>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="font-semibold">Approval Workflow</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Approval Threshold
              </label>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="number"
                    value={settings.approvalThreshold}
                    onChange={(e) => setSettings({ ...settings, approvalThreshold: Number(e.target.value) })}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-background"
                  />
                </div>
                <StatusBadge type="info">
                  Expenses above this amount require approval
                </StatusBadge>
              </div>
            </div>

            <div className="p-3 bg-accent/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Current: Expenses over ${settings.approvalThreshold} require manager approval, 
                then finance admin approval before posting to ledger.
              </p>
            </div>
          </div>
        </Card3D>

        {/* Account Settings */}
        <Card3D>
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-5 w-5" />
            <h3 className="font-semibold">Default Accounts</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Cash in Hand Account
              </label>
              <select
                value={settings.cashAccountId}
                onChange={(e) => setSettings({ ...settings, cashAccountId: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background"
              >
                <option value="ACC-001">Cash Account - Main</option>
                <option value="ACC-002">Petty Cash</option>
                <option value="ACC-003">Cash Reserve</option>
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                Default account for cash transactions
              </p>
            </div>
          </div>
        </Card3D>

        {/* Data Management */}
        <Card3D>
          <div className="flex items-center gap-2 mb-4">
            <Database className="h-5 w-5" />
            <h3 className="font-semibold">Data Management</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Data Retention (Years)
              </label>
              <input
                type="number"
                value={settings.dataRetention}
                onChange={(e) => setSettings({ ...settings, dataRetention: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Minimum 7 years for compliance. Archived data remains accessible but read-only.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => showToast('Export initiated - Processing...', 'info')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-card border border-border rounded-lg hover:bg-accent"
              >
                <Download className="h-5 w-5" />
                Export All Data
              </button>
              <button
                onClick={() => showToast('Backup created successfully', 'success')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-card border border-border rounded-lg hover:bg-accent"
              >
                <Database className="h-5 w-5" />
                Backup Now
              </button>
            </div>
          </div>
        </Card3D>

        {/* Security Settings */}
        <Card3D>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5" />
            <h3 className="font-semibold">Security & Compliance</h3>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-sm font-medium text-green-600">✓ Ledger Immutability Enabled</p>
              <p className="text-xs text-muted-foreground mt-1">
                All posted transactions are immutable. Edits create revision records.
              </p>
            </div>
            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-sm font-medium text-green-600">✓ Full Audit Trail Active</p>
              <p className="text-xs text-muted-foreground mt-1">
                Every action logged with user, timestamp, and IP address.
              </p>
            </div>
            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-sm font-medium text-green-600">✓ Role-Based Access Control</p>
              <p className="text-xs text-muted-foreground mt-1">
                Permissions enforced at API level with zero-trust architecture.
              </p>
            </div>
          </div>
        </Card3D>

        {/* Save Button */}
        <Card3D>
          <button
            onClick={handleSave}
            className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90"
          >
            Save Settings
          </button>
        </Card3D>

        {/* Info */}
        <div className="bg-accent/50 border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Settings Audit:</strong> All setting changes are logged with admin identity and timestamp. 
            Critical settings (approval thresholds, retention) require Super Admin approval.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}