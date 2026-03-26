import { useState } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { Database, RefreshCw, CheckCircle, AlertTriangle, Clock, Wifi, WifiOff, Laptop } from 'lucide-react';
import { useFinanceData } from '../../../services';
import type { OfflineSyncRecord } from '../../../services/types';
import { toast } from 'sonner';

const STATUS_CONFIG: Record<OfflineSyncRecord['status'], { type: 'success' | 'warning' | 'info' | 'error'; icon: any }> = {
  'Completed':   { type: 'success', icon: CheckCircle },
  'In Progress': { type: 'info', icon: RefreshCw },
  'Pending':     { type: 'warning', icon: Clock },
  'Failed':      { type: 'error', icon: AlertTriangle },
};

const TYPE_ICONS: Record<string, any> = {
  'Time Log':      Clock,
  'Activity Data': Database,
  'Screenshots':   Laptop,
  'Task Updates':  CheckCircle,
};

export function A17OfflineSync() {
  const { offlineSyncRecords, loading, triggerSync, syncAll, refresh } = useFinanceData();
  const [syncing, setSyncing] = useState<string | null>(null);
  const [syncingAll, setSyncingAll] = useState(false);

  const pendingCount = offlineSyncRecords.filter(r => r.status === 'Pending' || r.status === 'Failed').length;
  const completedCount = offlineSyncRecords.filter(r => r.status === 'Completed').length;
  const totalRecords = offlineSyncRecords.reduce((sum, r) => sum + r.recordCount, 0);
  const failedCount = offlineSyncRecords.filter(r => r.status === 'Failed').length;

  const handleSync = async (id: string) => {
    setSyncing(id);
    try {
      await triggerSync(id);
      toast.success('Sync completed successfully');
    } catch {
      toast.error('Sync failed — please retry');
    } finally {
      setSyncing(null);
    }
  };

  const handleSyncAll = async () => {
    setSyncingAll(true);
    try {
      await syncAll();
      toast.success(`All ${pendingCount} pending records synced successfully`);
    } catch {
      toast.error('Sync all failed');
    } finally {
      setSyncingAll(false);
    }
  };

  const formatTime = (ts: string) => {
    try {
      return new Date(ts).toLocaleString('en-US', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
      });
    } catch { return ts; }
  };

  return (
    <PageLayout
      title="ADMIN – A-17 – Offline Sync"
      description="Manage offline data synchronization — wired to useFinanceData()"
      actions={
        <>
          <Button variant="outline" size="sm" onClick={refresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={handleSyncAll}
            disabled={syncingAll || pendingCount === 0}
          >
            <Wifi className={`mr-2 h-4 w-4 ${syncingAll ? 'animate-pulse' : ''}`} />
            {syncingAll ? 'Syncing…' : `Sync All (${pendingCount})`}
          </Button>
        </>
      }
      kpis={[
        {
          title: 'Pending Sync',
          value: String(pendingCount),
          change: `${totalRecords} total records`,
          changeType: pendingCount > 0 ? 'warning' : 'positive',
          icon: <Database className="h-5 w-5" />,
        },
        {
          title: 'Synced',
          value: String(completedCount),
          change: 'Completed successfully',
          changeType: 'positive',
          icon: <CheckCircle className="h-5 w-5" />,
        },
        {
          title: 'Failed',
          value: String(failedCount),
          change: failedCount > 0 ? 'Requires attention' : 'All clear',
          changeType: failedCount > 0 ? 'warning' : 'positive',
          icon: <AlertTriangle className="h-5 w-5" />,
        },
        {
          title: 'Active Devices',
          value: String(offlineSyncRecords.length),
          change: 'Registered devices',
          changeType: 'neutral',
          icon: <Laptop className="h-5 w-5" />,
        },
      ]}
    >
      {/* Sync Queue */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3>Sync Queue</h3>
          <span className="text-xs text-muted-foreground">{offlineSyncRecords.length} devices</span>
        </div>
        <div className="divide-y divide-border">
          {loading && offlineSyncRecords.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <RefreshCw className="h-5 w-5 animate-spin mr-2" />
              Loading sync records…
            </div>
          ) : offlineSyncRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <CheckCircle className="h-8 w-8 mb-2 text-green-500" />
              <p>All devices are synced</p>
            </div>
          ) : (
            offlineSyncRecords.map(record => {
              const cfg = STATUS_CONFIG[record.status];
              const StatusIcon = cfg.icon;
              const TypeIcon = TYPE_ICONS[record.recordType] || Database;
              const isActive = syncing === record.id;

              return (
                <div
                  key={record.id}
                  className={`flex items-center gap-4 p-4 hover:bg-muted/20 transition-colors ${
                    record.status === 'Failed' ? 'bg-red-50/50 dark:bg-red-950/10' : ''
                  }`}
                >
                  {/* Device icon */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    record.status === 'Completed' ? 'bg-green-100 dark:bg-green-900/30' :
                    record.status === 'Failed' ? 'bg-red-100 dark:bg-red-900/30' :
                    record.status === 'In Progress' ? 'bg-blue-100 dark:bg-blue-900/30' :
                    'bg-yellow-100 dark:bg-yellow-900/30'
                  }`}>
                    <TypeIcon className={`h-5 w-5 ${
                      record.status === 'Completed' ? 'text-green-600' :
                      record.status === 'Failed' ? 'text-red-600' :
                      record.status === 'In Progress' ? 'text-blue-600' :
                      'text-yellow-600'
                    }`} />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold">{record.employeeName}</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">{record.department}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{record.recordType}</span>
                      <span>·</span>
                      <span>{record.recordCount} records</span>
                      {record.deviceName && (
                        <>
                          <span>·</span>
                          <span className="font-mono">{record.deviceName}</span>
                        </>
                      )}
                    </div>
                    {record.errorMessage && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">{record.errorMessage}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Last attempt: {formatTime(record.lastSyncAttempt)}
                    </p>
                  </div>

                  {/* Status + action */}
                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge type={cfg.type}>
                      <span className="flex items-center gap-1">
                        <StatusIcon className={`h-3 w-3 ${record.status === 'In Progress' ? 'animate-spin' : ''}`} />
                        {record.status}
                      </span>
                    </StatusBadge>
                    {(record.status === 'Pending' || record.status === 'Failed') && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSync(record.id)}
                        disabled={isActive}
                      >
                        {isActive ? (
                          <RefreshCw className="h-3 w-3 animate-spin" />
                        ) : (
                          <Wifi className="h-3 w-3" />
                        )}
                        <span className="ml-1 text-xs">{isActive ? 'Syncing…' : 'Sync'}</span>
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Summary footer */}
      <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {completedCount === offlineSyncRecords.length && offlineSyncRecords.length > 0 ? (
              <><CheckCircle className="h-4 w-4 text-green-600" /><span className="text-sm text-green-700 dark:text-green-400">All devices synced</span></>
            ) : (
              <><WifiOff className="h-4 w-4 text-yellow-600" /><span className="text-sm text-yellow-700 dark:text-yellow-400">{pendingCount} devices pending sync</span></>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            <strong>Service Layer ✓</strong> — <code className="font-mono">useFinanceData().offlineSyncRecords</code>
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
