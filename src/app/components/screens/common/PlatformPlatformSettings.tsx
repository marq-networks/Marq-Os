import { useState } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Switch } from '../../ui/switch';
import { Label } from '../../ui/label';
import { DataTable } from '../../shared/DataTable';
import {
  Settings, Server, Database, Globe, Shield, Users, Building2,
  Save, RefreshCw, AlertTriangle, CheckCircle2,
} from 'lucide-react';

// Mock organization data for platform admin
const ORGS = [
  { id: 'org1', name: 'Acme Corp', plan: 'Professional', seats: 100, usedSeats: 67, status: 'Active', created: '2024-06-15' },
  { id: 'org2', name: 'TechStart Inc', plan: 'Starter', seats: 25, usedSeats: 18, status: 'Active', created: '2025-01-10' },
  { id: 'org3', name: 'Global Enterprises', plan: 'Enterprise', seats: 500, usedSeats: 342, status: 'Active', created: '2023-03-01' },
  { id: 'org4', name: 'Beta Testing LLC', plan: 'Free', seats: 5, usedSeats: 3, status: 'Trial', created: '2026-02-20' },
];

interface PlatformConfig {
  maintenanceMode: boolean;
  registrationOpen: boolean;
  maxOrgsPerAccount: number;
  defaultTrialDays: number;
  apiRateLimit: number;
  forceSSL: boolean;
  debugMode: boolean;
  maxUploadSizeMB: number;
}

const DEFAULT_CONFIG: PlatformConfig = {
  maintenanceMode: false,
  registrationOpen: true,
  maxOrgsPerAccount: 5,
  defaultTrialDays: 14,
  apiRateLimit: 1000,
  forceSSL: true,
  debugMode: false,
  maxUploadSizeMB: 50,
};

export function PlatformPlatformSettings() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [hasChanges, setHasChanges] = useState(false);

  const update = <K extends keyof PlatformConfig>(key: K, value: PlatformConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    setHasChanges(false);
    alert('Platform settings saved.');
  };

  const totalSeats = ORGS.reduce((s, o) => s + o.seats, 0);
  const usedSeats = ORGS.reduce((s, o) => s + o.usedSeats, 0);

  const orgColumns = [
    {
      key: 'name',
      header: 'Organization',
      cell: (_: any, row: typeof ORGS[0]) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs text-primary font-medium">
            {row.name.substring(0, 2).toUpperCase()}
          </div>
          <span className="font-medium text-sm">{row.name}</span>
        </div>
      ),
    },
    {
      key: 'plan',
      header: 'Plan',
      cell: (val: string) => (
        <span className={`px-2 py-0.5 rounded-full text-xs ${
          val === 'Enterprise' ? 'bg-purple-500/10 text-purple-700 dark:text-purple-400' :
          val === 'Professional' ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400' :
          val === 'Starter' ? 'bg-green-500/10 text-green-700 dark:text-green-400' :
          'bg-muted text-muted-foreground'
        }`}>
          {val}
        </span>
      ),
    },
    {
      key: 'usedSeats',
      header: 'Seats',
      cell: (_: any, row: typeof ORGS[0]) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${(row.usedSeats / row.seats) * 100}%` }} />
          </div>
          <span className="text-xs text-muted-foreground">{row.usedSeats}/{row.seats}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (val: string) => (
        <StatusBadge type={val === 'Active' ? 'success' : val === 'Trial' ? 'info' : 'warning'}>{val}</StatusBadge>
      ),
    },
    {
      key: 'created',
      header: 'Created',
      cell: (val: string) => <span className="text-sm text-muted-foreground">{new Date(val).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>,
    },
  ];

  return (
    <PageLayout
      title="Platform Settings"
      description="Platform-level configuration for super administrators"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" /> Sync All
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges}>
            <Save className="mr-2 h-4 w-4" />
            {hasChanges ? 'Save Changes' : 'Saved'}
          </Button>
        </div>
      }
      kpis={[
        { title: 'Organizations', value: ORGS.length, change: `${ORGS.filter(o => o.status === 'Active').length} active`, changeType: 'positive', icon: <Building2 className="h-5 w-5" /> },
        { title: 'Total Users', value: usedSeats, change: `of ${totalSeats} seats`, changeType: 'neutral', icon: <Users className="h-5 w-5" /> },
        { title: 'Platform Status', value: config.maintenanceMode ? 'Maintenance' : 'Online', changeType: config.maintenanceMode ? 'danger' : 'positive', icon: <Server className="h-5 w-5" /> },
        { title: 'API Rate Limit', value: `${config.apiRateLimit}/min`, changeType: 'neutral', icon: <Globe className="h-5 w-5" /> },
      ]}
    >
      <div className="space-y-6">
        {/* Maintenance warning */}
        {config.maintenanceMode && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <div>
              <h4 className="font-medium text-red-700 dark:text-red-400">Maintenance Mode Active</h4>
              <p className="text-sm text-muted-foreground">Platform is in maintenance mode. Users will see a maintenance page.</p>
            </div>
          </div>
        )}

        {/* Platform Config */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5" /> Platform Configuration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Maintenance Mode</Label>
                  <p className="text-xs text-muted-foreground">Take platform offline for maintenance</p>
                </div>
                <Switch checked={config.maintenanceMode} onCheckedChange={v => update('maintenanceMode', v)} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Open Registration</Label>
                  <p className="text-xs text-muted-foreground">Allow new organizations to register</p>
                </div>
                <Switch checked={config.registrationOpen} onCheckedChange={v => update('registrationOpen', v)} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Force SSL</Label>
                  <p className="text-xs text-muted-foreground">Require HTTPS for all connections</p>
                </div>
                <Switch checked={config.forceSSL} onCheckedChange={v => update('forceSSL', v)} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Debug Mode</Label>
                  <p className="text-xs text-muted-foreground">Enable detailed logging</p>
                </div>
                <Switch checked={config.debugMode} onCheckedChange={v => update('debugMode', v)} />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Max Orgs Per Account</Label>
                <Input type="number" value={config.maxOrgsPerAccount} onChange={e => update('maxOrgsPerAccount', Number(e.target.value))} className="mt-1.5" />
              </div>
              <div>
                <Label>Default Trial Days</Label>
                <Input type="number" value={config.defaultTrialDays} onChange={e => update('defaultTrialDays', Number(e.target.value))} className="mt-1.5" />
              </div>
              <div>
                <Label>API Rate Limit (req/min)</Label>
                <Input type="number" value={config.apiRateLimit} onChange={e => update('apiRateLimit', Number(e.target.value))} className="mt-1.5" />
              </div>
              <div>
                <Label>Max Upload Size (MB)</Label>
                <Input type="number" value={config.maxUploadSizeMB} onChange={e => update('maxUploadSizeMB', Number(e.target.value))} className="mt-1.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Organizations Table */}
        <div className="rounded-lg border border-border bg-card">
          <div className="p-4 border-b border-border">
            <h3 className="font-medium flex items-center gap-2">
              <Building2 className="h-5 w-5" /> Managed Organizations
            </h3>
          </div>
          <div className="p-4">
            <DataTable columns={orgColumns} data={ORGS} />
          </div>
        </div>

        {/* System health */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'API Server', status: 'Healthy', icon: Server },
            { label: 'Database', status: 'Healthy', icon: Database },
            { label: 'CDN', status: 'Healthy', icon: Globe },
            { label: 'Security', status: 'Healthy', icon: Shield },
          ].map(item => (
            <div key={item.label} className="rounded-lg border border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20 p-4 text-center">
              <item.icon className="h-5 w-5 mx-auto mb-2 text-green-600" />
              <p className="text-xs font-medium">{item.label}</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <CheckCircle2 className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600">{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
