import { useState, useEffect } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { LineChartComponent, BarChartComponent, DonutChartComponent, AreaChartComponent } from '../../shared/Charts';
import { useAnalyticsData, usePeopleData, useTimeData } from '../../../services/hooks';
import {
  BarChart3, TrendingUp, Users, Clock, Activity,
} from 'lucide-react';
import type { ProductivityMetric } from '../../../services/types';

export function AnalyticsAnalytics() {
  const { getProductivityMetrics, getLiveActivity } = useAnalyticsData();
  const { employees, departments } = usePeopleData();
  const { sessions, leaveRequests } = useTimeData();
  const [metrics, setMetrics] = useState<ProductivityMetric[]>([]);
  const [live, setLive] = useState<{ activeUsers: number; totalUsers: number; byDepartment: Record<string, number> } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProductivityMetrics('2026-03-01', '2026-03-04'),
      getLiveActivity(),
    ]).then(([m, l]) => {
      setMetrics(m);
      setLive(l);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [getProductivityMetrics, getLiveActivity]);

  const avgScore = metrics.length > 0
    ? Math.round(metrics.reduce((s, m) => s + m.productivityScore, 0) / metrics.length)
    : 0;
  const avgHours = metrics.length > 0
    ? (metrics.reduce((s, m) => s + m.activeHours, 0) / metrics.length).toFixed(1)
    : '0';
  const totalTasks = metrics.reduce((s, m) => s + m.tasksCompleted, 0);

  // Weekly trend data (simulated)
  const weeklyTrend = [
    { day: 'Mon', score: 82, hours: 7.8 },
    { day: 'Tue', score: 86, hours: 8.1 },
    { day: 'Wed', score: avgScore, hours: parseFloat(avgHours) },
    { day: 'Thu', score: 0, hours: 0 },
    { day: 'Fri', score: 0, hours: 0 },
  ];

  // Department productivity
  const deptProductivity = departments.slice(0, 5).map(d => ({
    name: d.name,
    score: Math.round(60 + Math.random() * 35),
    members: d.memberCount,
  }));

  // Productivity distribution
  const distrib = [
    { name: '90-100%', value: metrics.filter(m => m.productivityScore >= 90).length },
    { name: '70-89%', value: metrics.filter(m => m.productivityScore >= 70 && m.productivityScore < 90).length },
    { name: '50-69%', value: metrics.filter(m => m.productivityScore >= 50 && m.productivityScore < 70).length },
    { name: '<50%', value: metrics.filter(m => m.productivityScore < 50).length },
  ];

  // Attendance chart data
  const attendanceData = [
    { name: 'Active', value: sessions.filter(s => s.status === 'Active').length },
    { name: 'Completed', value: sessions.filter(s => s.status === 'Completed').length },
    { name: 'On Leave', value: leaveRequests.filter(lr => lr.status === 'Approved').length },
  ];

  return (
    <PageLayout
      title="Analytics Dashboard"
      description="Organization-wide analytics, trends, and performance insights"
      kpis={[
        { title: 'Avg Productivity', value: `${avgScore}%`, change: 'This week', changeType: avgScore >= 80 ? 'positive' : 'warning', icon: <TrendingUp className="h-5 w-5" /> },
        { title: 'Avg Active Hours', value: `${avgHours}h`, change: 'Per employee/day', changeType: 'neutral', icon: <Clock className="h-5 w-5" /> },
        { title: 'Tasks Completed', value: totalTasks, change: 'This period', changeType: 'positive', icon: <Activity className="h-5 w-5" /> },
        { title: 'Active Users', value: live?.activeUsers ?? '—', change: `of ${live?.totalUsers ?? '—'} total`, changeType: 'positive', icon: <Users className="h-5 w-5" /> },
      ]}
    >
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="h-72 bg-muted animate-pulse rounded-lg" />)}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top row charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Trend */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="font-medium mb-4">Weekly Productivity Trend</h3>
              <LineChartComponent data={weeklyTrend} dataKey="score" xAxisKey="day" height={260} />
            </div>

            {/* Department Scores */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="font-medium mb-4">Department Productivity</h3>
              <BarChartComponent data={deptProductivity} dataKey="score" xAxisKey="name" height={260} />
            </div>
          </div>

          {/* Bottom row charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Score Distribution */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="font-medium mb-4">Score Distribution</h3>
              <DonutChartComponent data={distrib} dataKey="value" nameKey="name" height={240} />
            </div>

            {/* Active Hours Trend */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="font-medium mb-4">Active Hours (Week)</h3>
              <AreaChartComponent data={weeklyTrend} dataKey="hours" xAxisKey="day" height={240} />
            </div>

            {/* Attendance Breakdown */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="font-medium mb-4">Attendance Today</h3>
              <DonutChartComponent data={attendanceData} dataKey="value" nameKey="name" height={240} />
            </div>
          </div>

          {/* Top performers */}
          <div className="rounded-lg border border-border bg-card">
            <div className="p-4 border-b border-border">
              <h3 className="font-medium">Top Performers</h3>
            </div>
            <div className="divide-y divide-border">
              {[...metrics].sort((a, b) => b.productivityScore - a.productivityScore).slice(0, 5).map((m, i) => (
                <div key={m.employeeId} className="flex items-center gap-4 p-4">
                  <span className={`text-sm font-medium w-6 text-right ${i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-amber-700' : 'text-muted-foreground'}`}>
                    #{i + 1}
                  </span>
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary">
                    {m.employeeName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{m.employeeName}</div>
                    <div className="text-xs text-muted-foreground">{m.department}</div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-muted-foreground">{m.activeHours}h active</span>
                    <span className="text-muted-foreground">{m.tasksCompleted} tasks</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${m.productivityScore >= 90 ? 'bg-green-500' : 'bg-yellow-500'}`}
                          style={{ width: `${m.productivityScore}%` }}
                        />
                      </div>
                      <span className="font-medium tabular-nums">{m.productivityScore}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
