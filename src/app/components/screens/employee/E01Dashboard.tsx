/**
 * E01 - Employee Dashboard
 * Personal daily overview pulling live data from Time, Analytics, and People services.
 */

import { useState, useEffect } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { DataTable } from '../../shared/DataTable';
import { LineChartComponent, DonutChartComponent } from '../../shared/Charts';
import { StatusBadge } from '../../shared/StatusBadge';
import { Clock, TrendingUp, Award, Briefcase } from 'lucide-react';
import { useTimeData, useAnalyticsData, useNotificationData } from '../../../services';

export function E01Dashboard() {
  const { sessions, leaveRequests, fines } = useTimeData();
  const { getActivityLog } = useAnalyticsData();
  const { unreadCount } = useNotificationData();

  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Current user is Sarah Johnson (e1 in mock data)
  const currentUserId = 'e1';

  useEffect(() => {
    (async () => {
      try {
        const logs = await getActivityLog();
        // Filter to current user's activity
        const myLogs = logs.filter(l => l.userId === currentUserId).slice(0, 5);
        setRecentActivity(myLogs.map(l => ({
          id: l.id,
          time: new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          activity: l.action,
          target: l.target,
          type: l.targetType,
        })));
      } catch { /* ignore */ }
    })();
  }, [getActivityLog]);

  // ─── My metrics from real service data ─────────────────────────────
  const mySessions = sessions.filter(s => s.employeeId === currentUserId);
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySession = mySessions.find(s => s.date === todayStr);
  const activeSession = mySessions.find(s => s.status === 'Active');

  // Total hours this week (completed sessions)
  const weekMinutes = mySessions
    .filter(s => s.status === 'Completed')
    .reduce((sum, s) => sum + s.totalMinutes, 0);
  const weekHours = Math.floor(weekMinutes / 60);
  const weekMins = weekMinutes % 60;

  // My leave balance
  const myPendingLeave = leaveRequests.filter(lr => lr.employeeId === currentUserId && lr.status === 'Pending').length;
  const myActiveFines = fines.filter(f => f.employeeId === currentUserId && f.status === 'Active').length;

  // Weekly activity chart
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const weeklyChart = weekDays.map((day, i) => {
    const session = mySessions.find(s => {
      const d = new Date(s.date);
      return d.getDay() === i + 1; // Mon=1...Fri=5
    });
    return { day, hours: session ? +(session.totalMinutes / 60).toFixed(1) : 0 };
  });

  // Time distribution
  const timeDistribution = [
    { name: 'Coding', value: 45 },
    { name: 'Meetings', value: 20 },
    { name: 'Code Review', value: 15 },
    { name: 'Planning', value: 12 },
    { name: 'Break', value: 8 },
  ];

  const activityColumns = [
    { key: 'time', header: 'Time', width: '15%' },
    { key: 'activity', header: 'Activity', width: '30%' },
    { key: 'target', header: 'Target', width: '35%' },
    {
      key: 'type',
      header: 'Type',
      width: '20%',
      cell: (value: string) => <StatusBadge type="info">{value}</StatusBadge>,
    },
  ];

  return (
    <PageLayout
      title="My Dashboard"
      description="Your daily overview and performance metrics"
      kpis={[
        {
          title: "Today's Status",
          value: activeSession ? 'Clocked In' : 'Not Clocked In',
          change: activeSession ? `Since ${activeSession.checkIn}` : 'Clock in to start',
          changeType: activeSession ? 'positive' : 'warning',
          icon: <Clock className="h-5 w-5" />,
        },
        {
          title: 'This Week',
          value: `${weekHours}h ${weekMins}m`,
          change: `${Math.round((weekMinutes / 2400) * 100)}% of 40h target`,
          changeType: weekMinutes >= 2000 ? 'positive' : 'neutral',
          icon: <TrendingUp className="h-5 w-5" />,
        },
        {
          title: 'Pending Items',
          value: String(myPendingLeave + myActiveFines + unreadCount),
          change: `${myPendingLeave} leave, ${unreadCount} notifications`,
          changeType: (myPendingLeave + myActiveFines + unreadCount) > 0 ? 'warning' : 'positive',
          icon: <Briefcase className="h-5 w-5" />,
        },
        {
          title: 'Performance',
          value: '88%',
          change: 'Productivity score',
          changeType: 'positive',
          icon: <Award className="h-5 w-5" />,
        },
      ]}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4">Weekly Activity</h3>
            <LineChartComponent
              data={weeklyChart}
              dataKey="hours"
              xAxisKey="day"
              height={250}
            />
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4">Time Distribution</h3>
            <DonutChartComponent
              data={timeDistribution}
              dataKey="value"
              nameKey="name"
              height={250}
            />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-4">My Recent Activity</h3>
          {recentActivity.length > 0 ? (
            <DataTable columns={activityColumns} data={recentActivity} />
          ) : (
            <div className="text-center py-8 text-muted-foreground">Loading your activity...</div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
