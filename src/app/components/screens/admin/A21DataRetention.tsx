import { useState, useEffect } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Switch } from '../../ui/switch';
import { Database, Save, Trash2, HardDrive, Archive } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { toast } from 'sonner';
import { useAuthService } from '../../../services';

const STORAGE_KEY = 'workos_data_retention_settings';

interface RetentionSettings {
  timeLogs: string;
  activityData: string;
  screenshots: string;
  auditLogs: string;
  autoDeleteEnabled: boolean;
  autoArchiveEnabled: boolean;
  backupRetentionDays: number;
}

const DEFAULTS: RetentionSettings = {
  timeLogs: '365',
  activityData: '180',
  screenshots: '90',
  auditLogs: '730',
  autoDeleteEnabled: true,
  autoArchiveEnabled: true,
  backupRetentionDays: 30,
};

export function A21DataRetention() {
  const authService = useAuthService();
  const [settings, setSettings] = useState<RetentionSettings>(DEFAULTS);
  const [hasChanges, setHasChanges] = useState(false);
  const [original, setOriginal] = useState<RetentionSettings>(DEFAULTS);
  const [orgName, setOrgName] = useState('Acme Corp');

  useEffect(() => {
    // Bridge to auth service for org name
    authService.getCurrentOrganization().then(org => setOrgName(org.name)).catch(() => {});
    // Load persisted settings
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings(parsed);
        setOriginal(parsed);
      }
    } catch {}
  }, []);

  useEffect(() => {
    setHasChanges(JSON.stringify(settings) !== JSON.stringify(original));
  }, [settings, original]);

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setOriginal(settings);
    setHasChanges(false);
    toast.success('Data retention policies saved');
  };

  // Estimate storage based on retention periods
  const totalDays = Object.values({ a: parseInt(settings.timeLogs), b: parseInt(settings.activityData), c: parseInt(settings.screenshots), d: parseInt(settings.auditLogs) }).reduce((a, b) => a + b, 0);
  const estimatedGB = (totalDays * 0.015).toFixed(1);

  return (
    <PageLayout
      title="ADMIN – A-21 – Data Retention"
      description={`Configure retention and deletion policies — ${orgName}`}
      actions={
        <Button onClick={handleSave} disabled={!hasChanges}>
          <Save className="mr-2 h-4 w-4" />
          {hasChanges ? 'Save Changes' : 'Saved'}
        </Button>
      }
      kpis={[
        {
          title: 'Est. Storage',
          value: `${estimatedGB} GB`,
          change: 'Based on retention periods',
          changeType: 'neutral',
          icon: <HardDrive className="h-5 w-5" />,
        },
        {
          title: 'Auto-Delete',
          value: settings.autoDeleteEnabled ? 'On' : 'Off',
          change: `${settings.timeLogs}d max retention`,
          changeType: settings.autoDeleteEnabled ? 'positive' : 'warning',
          icon: <Trash2 className="h-5 w-5" />,
        },
        {
          title: 'Archiving',
          value: settings.autoArchiveEnabled ? 'On' : 'Off',
          change: 'Before deletion',
          changeType: settings.autoArchiveEnabled ? 'positive' : 'neutral',
          icon: <Archive className="h-5 w-5" />,
        },
        {
          title: 'Backups',
          value: `${settings.backupRetentionDays}d`,
          change: 'Backup retention',
          changeType: 'neutral',
          icon: <Database className="h-5 w-5" />,
        },
      ]}
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-6">Retention Periods</h3>
          <div className="space-y-4">
            {[
              { key: 'timeLogs' as const, label: 'Time Logs', desc: 'Clock-in/out records and session data' },
              { key: 'activityData' as const, label: 'Activity Data', desc: 'App usage, screenshots, keystroke metrics' },
              { key: 'screenshots' as const, label: 'Screenshots', desc: 'Captured employee screenshots' },
              { key: 'auditLogs' as const, label: 'Audit Logs', desc: 'Security and compliance audit trail' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <Label>{label}</Label>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
                <Select
                  value={settings[key]}
                  onValueChange={v => setSettings({ ...settings, [key]: v })}
                >
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">180 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                    <SelectItem value="730">2 years</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-6">Automation</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-Delete Expired Data</Label>
                <p className="text-sm text-muted-foreground">Automatically delete data past retention period</p>
              </div>
              <Switch
                checked={settings.autoDeleteEnabled}
                onCheckedChange={v => setSettings({ ...settings, autoDeleteEnabled: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-Archive Before Delete</Label>
                <p className="text-sm text-muted-foreground">Create compressed archive before permanent deletion</p>
              </div>
              <Switch
                checked={settings.autoArchiveEnabled}
                onCheckedChange={v => setSettings({ ...settings, autoArchiveEnabled: v })}
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label>Backup Retention (days)</Label>
                <p className="text-sm text-muted-foreground">How long to keep system backups</p>
              </div>
              <Input
                type="number"
                min={7}
                max={365}
                value={settings.backupRetentionDays}
                onChange={e => setSettings({ ...settings, backupRetentionDays: Number(e.target.value) })}
                className="w-24"
              />
            </div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-muted/30 border border-border">
          <p className="text-xs text-muted-foreground">
            <strong>Service Layer ✓</strong> — Settings persist to localStorage. Organization context from <code className="font-mono">useAuthService().getCurrentOrganization()</code>.
            In production, POST these settings to your API on save.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}