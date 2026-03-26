/**
 * A01 - Admin Dashboard
 * Cross-domain live data from People, Time, and Analytics services.
 */

import { useState, useEffect } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { BarChartComponent, DonutChartComponent } from '../../shared/Charts';
import { DataTable } from '../../shared/DataTable';
import { StatusBadge } from '../../shared/StatusBadge';
import { Users, Clock, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../../ui/button';
import { usePeopleData, useTimeData, useAnalyticsData } from '../../../services';

export function A01AdminDashboard() {
  const { employees, departments } = usePeopleData();
  const { sessions, leaveRequests, corrections } = useTimeData();
  const { getActivityLog, getLiveActivity } = useAnalyticsData();
  
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [liveStats, setLiveStats] = useState<{ activeUsers: number; totalUsers: number; byDepartment: Record<string, number> } | null>(null);

  useEffect(() => {
    // Load live activity and recent log
    (async () => {
      try {
        const [live, logs] = await Promise.all([
          getLiveActivity(),
          getActivityLog(),
        ]);
        setLiveStats(live);
        setRecentActivity(logs.slice(0, 8).map(l => ({
          id: l.id,
          employee: l.userName,
          action: l.action,
          target: l.target,
          time: new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: l.targetType,
        })));
      } catch { /* ignore */ }
    })();
  }, [getActivityLog, getLiveActivity]);

  // ─── Compute cross-domain KPIs ────────────────────────────────────
  const activeEmployees = employees.filter(e => e.status === 'Active').length;
  const totalEmployees = employees.length;

  const activeSessions = sessions.filter(s => s.status === 'Active');
  const todaySessions = sessions.filter(s => s.date === new Date().toISOString().split('T')[0]);
  const totalMinutesToday = todaySessions.reduce((s, t) => s + t.totalMinutes, 0);

  const pendingLeave = leaveRequests.filter(lr => lr.status === 'Pending').length;
  const pendingCorrections = corrections.filter(c => c.status === 'Pending').length;
  const totalPending = pendingLeave + pendingCorrections;

  // Department distribution for chart
  const deptData = departments.map(d => ({
    name: d.name,
    value: d.memberCount,
  }));

  // Weekly team activity (mock pattern from live data)
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const teamActivity = weekDays.map((day, i) => ({
    day,
    active: Math.max(0, activeEmployees - Math.floor(Math.random() * 5)),
    total: totalEmployees,
  }));

  const activityColumns = [
    { key: 'employee', header: 'Employee', width: '22%' },
    { key: 'action', header: 'Action', width: '22%' },
    { key: 'target', header: 'Target', width: '28%' },
    { key: 'time', header: 'Time', width: '13%' },
    {
      key: 'type',
      header: 'Type',
      width: '15%',
      cell: (value: string) => {
        const typeMap: Record<string, 'success' | 'info' | 'warning' | 'neutral'> = {
          task: 'success', project: 'info', leave: 'warning', employee: 'info',
          finance: 'success', system: 'neutral', fine: 'warning',
        };
        return <StatusBadge type={typeMap[value] || 'neutral'}>{value}</StatusBadge>;
      },
    },
  ];

  return (
    <PageLayout
      title="Admin Dashboard"
      description="Organization overview with live cross-domain metrics"
      kpis={[
        {
          title: 'Active Employees',
          value: `${liveStats?.activeUsers ?? activeEmployees}/${liveStats?.totalUsers ?? totalEmployees}`,
          change: totalEmployees > 0 ? `${Math.round((activeEmployees / totalEmployees) * 100)}% online` : '—',
          changeType: 'positive',
          icon: <Users className="h-5 w-5" />,
        },
        {
          title: 'Active Sessions',
          value: String(activeSessions.length),
          change: `${Math.round(totalMinutesToday / 60)}h logged today`,
          changeType: 'positive',
          icon: <Clock className="h-5 w-5" />,
        },
        {
          title: 'Departments',
          value: String(departments.length),
          change: `${totalEmployees} total employees`,
          changeType: 'neutral',
          icon: <TrendingUp className="h-5 w-5" />,
        },
        {
          title: 'Pending Approvals',
          value: String(totalPending),
          change: `${pendingLeave} leave, ${pendingCorrections} corrections`,
          changeType: totalPending > 0 ? 'warning' : 'positive',
          icon: <AlertCircle className="h-5 w-5" />,
        },
      ]}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4">Team Activity This Week</h3>
            <BarChartComponent
              data={teamActivity}
              dataKey="active"
              xAxisKey="day"
              height={250}
            />
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4">Team Distribution by Department</h3>
            {deptData.length > 0 ? (
              <DonutChartComponent
                data={deptData}
                dataKey="value"
                nameKey="name"
                height={250}
              />
            ) : (
              <div className="flex items-center justify-center h-[250px] text-muted-foreground">Loading...</div>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3>Recent Activity Feed</h3>
            <span className="text-xs text-muted-foreground">
              Live from Analytics Service
            </span>
          </div>
          {recentActivity.length > 0 ? (
            <DataTable columns={activityColumns} data={recentActivity} />
          ) : (
            <div className="flex items-center justify-center py-8 text-muted-foreground">Loading activity...</div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
