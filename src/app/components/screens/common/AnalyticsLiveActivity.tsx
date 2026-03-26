import { useState, useEffect } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { StatusBadge } from '../../shared/StatusBadge';
import { useAnalyticsData, usePeopleData } from '../../../services/hooks';
import { BarChartComponent } from '../../shared/Charts';
import {
  Activity, Users, Zap, Clock, Eye, MonitorSmartphone,
} from 'lucide-react';
import type { ActivityLogEntry } from '../../../services/types';

const TARGET_MAP: Record<string, 'success' | 'info' | 'warning' | 'neutral'> = {
  task: 'success', project: 'info', leave: 'warning', employee: 'info',
  finance: 'neutral', system: 'neutral',
};

export function AnalyticsLiveActivity() {
  const { getLiveActivity, getActivityLog } = useAnalyticsData();
  const { employees } = usePeopleData();
  const [live, setLive] = useState<{
    activeUsers: number; totalUsers: number;
    byDepartment: Record<string, number>; recentActions: ActivityLogEntry[];
  } | null>(null);
  const [log, setLog] = useState<ActivityLogEntry[]>([]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    getLiveActivity().then(setLive).catch(() => {});
    getActivityLog().then(setLog).catch(() => {});
  }, [getLiveActivity, getActivityLog]);

  // Simulate live refresh every 5s
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 5000);
    return () => clearInterval(interval);
  }, []);

  const deptData = live
    ? Object.entries(live.byDepartment).map(([name, count]) => ({ name, active: count }))
    : [];

  const activeRate = live ? Math.round((live.activeUsers / live.totalUsers) * 100) : 0;

  return (
    <PageLayout
      title="Live Activity"
      description="Real-time monitoring of team activity across the organization"
      kpis={[
        { title: 'Active Users', value: live?.activeUsers ?? '—', change: `of ${live?.totalUsers ?? '—'} total`, changeType: 'positive', icon: <Users className="h-5 w-5" /> },
        { title: 'Activity Rate', value: `${activeRate}%`, change: 'Currently online', changeType: activeRate > 60 ? 'positive' : 'warning', icon: <Activity className="h-5 w-5" /> },
        { title: 'Recent Actions', value: log.length, change: 'Last 24 hours', changeType: 'neutral', icon: <Zap className="h-5 w-5" /> },
        { title: 'Departments Active', value: deptData.filter(d => d.active > 0).length, change: `of ${deptData.length} total`, changeType: 'neutral', icon: <MonitorSmartphone className="h-5 w-5" /> },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Users by Department */}
        <div className="lg:col-span-2 rounded-lg border border-border bg-card p-6">
          <h3 className="font-medium mb-4">Active Users by Department</h3>
          {deptData.length > 0 ? (
            <BarChartComponent data={deptData} dataKey="active" xAxisKey="name" height={280} />
          ) : (
            <div className="h-[280px] flex items-center justify-center text-muted-foreground">Loading...</div>
          )}
        </div>

        {/* Live User Cards */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Online Now
          </h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {employees.filter(e => e.status === 'Active').map(emp => (
              <div key={emp.id} className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary">
                    {emp.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-card" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{emp.name}</div>
                  <div className="text-xs text-muted-foreground">{emp.department}</div>
                </div>
                <span className="text-xs text-muted-foreground">{emp.lastSeen}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="mt-6 rounded-lg border border-border bg-card">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-medium">Recent Activity</h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Live • Refreshes every 5s
          </div>
        </div>
        <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
          {log.map((entry, i) => (
            <div key={entry.id} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary">
                {entry.userName.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm">
                  <span className="font-medium">{entry.userName}</span>
                  {' '}
                  <span className="text-muted-foreground">{entry.action}</span>
                  {' '}
                  <span className="font-medium">{entry.target}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </div>
              </div>
              <StatusBadge type={TARGET_MAP[entry.targetType] || 'neutral'}>
                {entry.targetType}
              </StatusBadge>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
