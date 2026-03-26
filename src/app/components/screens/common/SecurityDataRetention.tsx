import { useState } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import {
  Database, Clock, Trash2, Shield, AlertTriangle, Save, Archive, HardDrive,
} from 'lucide-react';

interface RetentionPolicy {
  id: string;
  dataType: string;
  description: string;
  retentionDays: number;
  action: 'Delete' | 'Archive' | 'Anonymize';
  lastPurge: string;
  recordsAffected: number;
  status: 'Active' | 'Paused';
}

const POLICIES: RetentionPolicy[] = [
  { id: 'rp1', dataType: 'Time Sessions', description: 'Employee clock-in/out records', retentionDays: 365, action: 'Archive', lastPurge: '2026-02-01', recordsAffected: 12400, status: 'Active' },
  { id: 'rp2', dataType: 'Activity Logs', description: 'System event and audit trails', retentionDays: 730, action: 'Delete', lastPurge: '2026-01-15', recordsAffected: 45000, status: 'Active' },
  { id: 'rp3', dataType: 'Screenshots', description: 'Productivity monitoring screenshots', retentionDays: 90, action: 'Delete', lastPurge: '2026-03-01', recordsAffected: 8200, status: 'Active' },
  { id: 'rp4', dataType: 'Chat Messages', description: 'Internal communication messages', retentionDays: 1095, action: 'Anonymize', lastPurge: '2026-01-01', recordsAffected: 156000, status: 'Active' },
  { id: 'rp5', dataType: 'Leave Records', description: 'Leave requests and approvals', retentionDays: 2190, action: 'Archive', lastPurge: '2025-12-01', recordsAffected: 3400, status: 'Active' },
  { id: 'rp6', dataType: 'Payroll Data', description: 'Payslips and payroll run records', retentionDays: 2555, action: 'Archive', lastPurge: '2025-06-01', recordsAffected: 28000, status: 'Active' },
  { id: 'rp7', dataType: 'Temporary Files', description: 'Upload drafts and temp data', retentionDays: 30, action: 'Delete', lastPurge: '2026-03-03', recordsAffected: 450, status: 'Active' },
];

const ACTION_COLOR: Record<string, string> = {
  Delete: 'bg-red-500/10 text-red-700 dark:text-red-400',
  Archive: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  Anonymize: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
};

const ACTION_ICON: Record<string, typeof Trash2> = {
  Delete: Trash2, Archive: Archive, Anonymize: Shield,
};

export function SecurityDataRetention() {
  const [policies, setPolicies] = useState(POLICIES);

  const totalRecords = policies.reduce((s, p) => s + p.recordsAffected, 0);
  const nextPurgeDate = 'Mar 15, 2026';

  const handleRunPurge = (id: string) => {
    if (window.confirm('Run data purge for this policy now? This action cannot be undone.')) {
      setPolicies(prev => prev.map(p =>
        p.id === id ? { ...p, lastPurge: '2026-03-04', recordsAffected: 0 } : p
      ));
    }
  };

  const formatRetention = (days: number) => {
    if (days >= 365) return `${Math.round(days / 365)} year${days >= 730 ? 's' : ''}`;
    return `${days} days`;
  };

  return (
    <PageLayout
      title="Data Retention"
      description="Configure data lifecycle policies, retention periods, and automated purge schedules"
      kpis={[
        { title: 'Active Policies', value: policies.filter(p => p.status === 'Active').length, change: `${policies.length} total`, changeType: 'positive', icon: <Database className="h-5 w-5" /> },
        { title: 'Records Managed', value: totalRecords.toLocaleString(), change: 'Across all policies', changeType: 'neutral', icon: <HardDrive className="h-5 w-5" /> },
        { title: 'Next Auto Purge', value: nextPurgeDate, change: 'Scheduled', changeType: 'info', icon: <Clock className="h-5 w-5" /> },
        { title: 'Data Types', value: policies.length, change: 'Retention rules defined', changeType: 'neutral', icon: <Shield className="h-5 w-5" /> },
      ]}
    >
      {/* Info banner */}
      <div className="mb-6 rounded-lg bg-blue-500/10 border border-blue-500/30 p-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-medium text-blue-700 dark:text-blue-400">Compliance Notice</h4>
          <p className="text-sm text-muted-foreground mt-1">
            Data retention policies are configured to comply with GDPR Article 5(1)(e) and CCPA requirements.
            Data is automatically processed based on the defined retention period and action.
          </p>
        </div>
      </div>

      {/* Policies */}
      <div className="space-y-4">
        {policies.map(policy => {
          const ActionIcon = ACTION_ICON[policy.action] || Trash2;
          return (
            <div key={policy.id} className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${ACTION_COLOR[policy.action]}`}>
                    <ActionIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{policy.dataType}</h3>
                      <StatusBadge type={policy.status === 'Active' ? 'success' : 'neutral'}>{policy.status}</StatusBadge>
                    </div>
                    <p className="text-sm text-muted-foreground">{policy.description}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleRunPurge(policy.id)}>
                  Run Now
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-md bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">Retention</p>
                  <p className="font-medium">{formatRetention(policy.retentionDays)}</p>
                </div>
                <div className="rounded-md bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">Action</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${ACTION_COLOR[policy.action]}`}>
                    <ActionIcon className="h-3 w-3" />
                    {policy.action}
                  </span>
                </div>
                <div className="rounded-md bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">Records</p>
                  <p className="font-medium">{policy.recordsAffected.toLocaleString()}</p>
                </div>
                <div className="rounded-md bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">Last Purge</p>
                  <p className="font-medium">{new Date(policy.lastPurge).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>

              {/* Retention timeline bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Created</span>
                  <span>Retention ({formatRetention(policy.retentionDays)})</span>
                  <span>{policy.action}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden relative">
                  <div className="h-full bg-primary/60 rounded-full" style={{ width: '65%' }} />
                  <div className={`absolute top-0 right-0 h-full w-[15%] rounded-r-full ${
                    policy.action === 'Delete' ? 'bg-red-400/50' :
                    policy.action === 'Archive' ? 'bg-blue-400/50' : 'bg-purple-400/50'
                  }`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </PageLayout>
  );
}
