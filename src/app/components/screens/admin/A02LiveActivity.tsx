/**
 * A02 - LIVE ACTIVITY MONITOR
 * Wired to service layer: usePeopleData() + useAnalyticsData().getLiveActivity()
 */

import { useState, useEffect, useCallback } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { DataTable } from '../../shared/DataTable';
import { StatusBadge } from '../../shared/StatusBadge';
import { Activity, Users, Clock, RefreshCw, Wifi } from 'lucide-react';
import { Button } from '../../ui/button';
import { usePeopleData, useAnalyticsData } from '../../../services';
import type { ActivityLogEntry } from '../../../services';

interface LiveStats {
  activeUsers: number;
  totalUsers: number;
  byDepartment: Record<string, number>;
  recentActions: ActivityLogEntry[];
}

export function A02LiveActivity() {
  const { employees, loading: peopleLoading } = usePeopleData();
  const { getLiveActivity, loading: analyticsLoading } = useAnalyticsData();
  const [liveStats, setLiveStats] = useState<LiveStats | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const refresh = useCallback(async () => {
    const stats = await getLiveActivity();
    setLiveStats(stats);
    setLastRefresh(new Date());
  }, [getLiveActivity]);

  useEffect(() => {
    refresh();
    // Auto-refresh every 30 seconds
    const interval = setInterval(refresh, 30_000);
    return () => clearInterval(interval);
  }, [refresh]);

  // Build display rows from employees + live status
  const rows = employees.map(emp => ({
    id: emp.id,
    name: emp.name,
    department: emp.department,
    role: emp.role,
    status: emp.status,
    lastSeen: emp.lastSeen,
  }));

  // Count by status
  const activeCount = employees.filter(e => e.status === 'Active').length;
  const awayCount = employees.filter(e => e.status === 'Away').length;
  const offlineCount = employees.filter(e => e.status === 'Offline').length;

  const columns = [
    { key: 'name', header: 'Employee', width: '25%' },
    { key: 'department', header: 'Department', width: '18%' },
    { key: 'role', header: 'Role', width: '22%' },
    {
      key: 'status',
      header: 'Status',
      width: '15%',
      cell: (value: string) => {
        const type =
          value === 'Active' ? 'success' : value === 'Away' ? 'warning' : 'neutral';
        return <StatusBadge type={type}>{value}</StatusBadge>;
      },
    },
    { key: 'lastSeen', header: 'Last Activity', width: '20%' },
  ];

  const loading = peopleLoading || analyticsLoading;

  return (
    <PageLayout
      title="Live Activity Monitor"
      description="Real-time monitoring of employee activity across the organization"
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={refresh}
          disabled={loading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      }
      kpis={[
        {
          title: 'Currently Active',
          value: String(liveStats?.activeUsers ?? activeCount),
          change: `Out of ${liveStats?.totalUsers ?? employees.length} employees`,
          changeType: 'positive',
          icon: <Wifi className="h-5 w-5" />,
        },
        {
          title: 'Away',
          value: String(awayCount),
          icon: <Clock className="h-5 w-5" />,
        },
        {
          title: 'Offline',
          value: String(offlineCount),
          icon: <Users className="h-5 w-5" />,
        },
        {
          title: 'Departments Active',
          value: liveStats
            ? String(Object.keys(liveStats.byDepartment).length)
            : '—',
          change: 'With active members',
          changeType: 'neutral',
          icon: <Activity className="h-5 w-5" />,
        },
      ]}
    >
      <div className="space-y-6">
        {/* Department breakdown */}
        {liveStats && (
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4">Active by Department</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(liveStats.byDepartment).map(([dept, count]) => (
                <div
                  key={dept}
                  className="rounded-md border border-border bg-background p-3"
                >
                  <div className="text-xs text-muted-foreground">{dept}</div>
                  <div className="text-2xl font-semibold mt-1">{count}</div>
                  <div className="text-xs text-green-600 mt-0.5">active</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Employee table */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3>Employee Activity Feed</h3>
            <span className="text-xs text-muted-foreground">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </span>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              Loading activity data…
            </div>
          ) : (
            <DataTable columns={columns} data={rows} />
          )}
        </div>

        {/* Recent actions from analytics service */}
        {liveStats?.recentActions && liveStats.recentActions.length > 0 && (
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4">Recent System Actions</h3>
            <div className="space-y-2">
              {liveStats.recentActions.map(action => (
                <div
                  key={action.id}
                  className="flex items-center gap-3 py-2 border-b border-border last:border-0"
                >
                  <Activity className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-sm">{action.userName}</span>
                    <span className="text-muted-foreground text-sm"> {action.action} </span>
                    <span className="text-sm">{action.target}</span>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {new Date(action.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
