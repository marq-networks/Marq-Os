import { useState, useEffect } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { FileText, Download, Filter, RefreshCw, Search, Shield, AlertTriangle, Activity } from 'lucide-react';
import { useAnalyticsData } from '../../../services';
import type { ActivityLogEntry } from '../../../services/types';

const TARGET_TYPE_COLORS: Record<string, string> = {
  task: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  project: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
  employee: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  leave: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  fine: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  finance: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
  system: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400',
};

export function A22AuditLogs() {
  const { getActivityLog, loading } = useAnalyticsData();
  const [auditEntries, setAuditEntries] = useState<ActivityLogEntry[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const load = async (q?: string) => {
    const data = await getActivityLog(q);
    setAuditEntries(data);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const timer = setTimeout(() => load(search || undefined), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await load(search || undefined);
    setIsRefreshing(false);
  };

  const filtered = typeFilter === 'all'
    ? auditEntries
    : auditEntries.filter(e => e.targetType === typeFilter);

  const securityEvents = auditEntries.filter(e => e.targetType === 'system');
  const todayCount = auditEntries.filter(e =>
    new Date(e.timestamp).toDateString() === new Date().toDateString()
  ).length;

  const formatTime = (ts: string) => {
    try {
      return new Date(ts).toLocaleString('en-US', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
      });
    } catch { return ts; }
  };

  const typeOptions = ['all', 'task', 'project', 'employee', 'leave', 'fine', 'finance', 'system'];

  return (
    <PageLayout
      title="ADMIN – A-22 – Audit Logs"
      description="System activity and security audit trail — live from analytics service"
      actions={
        <>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Advanced Filter
          </Button>
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </>
      }
      kpis={[
        {
          title: 'Total Events',
          value: String(auditEntries.length),
          change: 'All time',
          changeType: 'neutral',
          icon: <FileText className="h-5 w-5" />,
        },
        {
          title: 'Today',
          value: String(todayCount),
          change: 'Since midnight',
          changeType: 'neutral',
          icon: <Activity className="h-5 w-5" />,
        },
        {
          title: 'System Events',
          value: String(securityEvents.length),
          change: 'Require review',
          changeType: securityEvents.length > 0 ? 'warning' : 'positive',
          icon: <AlertTriangle className="h-5 w-5" />,
        },
        {
          title: 'Users Active',
          value: String(new Set(auditEntries.map(e => e.userId)).size),
          change: 'Unique users',
          changeType: 'neutral',
          icon: <Shield className="h-5 w-5" />,
        },
      ]}
    >
      {/* Search & Filter Bar */}
      <div className="mb-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by user, action, or target..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {typeOptions.map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${
                typeFilter === t
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/70 text-muted-foreground'
              }`}
            >
              {t === 'all' ? `All (${auditEntries.length})` : t}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground w-36">Timestamp</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground w-32">User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Action</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Target</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground w-24">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground w-24 hidden md:table-cell">IP</th>
              </tr>
            </thead>
            <tbody>
              {loading && auditEntries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                    Loading audit log…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    No events match your filters
                  </td>
                </tr>
              ) : (
                filtered.map((entry, i) => (
                  <tr
                    key={entry.id}
                    className={`border-b border-border last:border-0 hover:bg-muted/20 transition-colors ${i % 2 === 0 ? '' : 'bg-muted/10'}`}
                  >
                    <td className="px-4 py-3">
                      <span className="text-xs text-muted-foreground font-mono">{formatTime(entry.timestamp)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium">{entry.userName}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm">{entry.action}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-muted-foreground">{entry.target}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${TARGET_TYPE_COLORS[entry.targetType] || ''}`}>
                        {entry.targetType}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="font-mono text-xs text-muted-foreground">
                        {entry.ip || '—'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border">
        <p className="text-xs text-muted-foreground">
          <strong>Service Layer ✓</strong> — Audit log entries sourced from <code className="font-mono">useAnalyticsData().getActivityLog()</code> via the Analytics service.
          In production, swap the mock for a real API returning paginated audit trail entries from your database.
        </p>
      </div>
    </PageLayout>
  );
}
