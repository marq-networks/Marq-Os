/**
 * A13 - ACTIVITY OVERVIEW
 * Wired to service layer: useAnalyticsData() → getProductivityMetrics(), getActivityLog()
 */

import { useState, useEffect } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { BarChartComponent, LineChartComponent } from '../../shared/Charts';
import { Activity, TrendingUp, Users, Clock, Search } from 'lucide-react';
import { DataTable } from '../../shared/DataTable';
import { useAnalyticsData, usePeopleData } from '../../../services';
import type { ProductivityMetric, ActivityLogEntry } from '../../../services';

// Date helpers
const today = new Date('2026-03-04');
const oneMonthAgo = new Date(today);
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
const fmt = (d: Date) => d.toISOString().split('T')[0];

export function A13ActivityOverview() {
  const { getProductivityMetrics, getActivityLog, loading } = useAnalyticsData();
  const { departments } = usePeopleData();
  const [metrics, setMetrics] = useState<ProductivityMetric[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getProductivityMetrics(fmt(oneMonthAgo), fmt(today), selectedDept || undefined).then(
      setMetrics,
    );
    getActivityLog(searchQuery || undefined).then(setActivityLog);
  }, [getProductivityMetrics, getActivityLog, selectedDept, searchQuery]);

  // KPI calculations
  const totalActiveHours = metrics.reduce((s, m) => s + m.activeHours, 0);
  const avgProductivity =
    metrics.length > 0
      ? (metrics.reduce((s, m) => s + m.productivityScore, 0) / metrics.length).toFixed(0)
      : '—';
  const activeEmployees = new Set(metrics.map(m => m.employeeId)).size;
  const totalTasksCompleted = metrics.reduce((s, m) => s + m.tasksCompleted, 0);

  // Weekly bar chart data (aggregate by day)
  const byDay = metrics.reduce<Record<string, number>>((acc, m) => {
    const day = new Date(m.date).toLocaleDateString('en-US', { weekday: 'short' });
    acc[day] = (acc[day] ?? 0) + m.activeHours;
    return acc;
  }, {});
  const weeklyData = Object.entries(byDay).map(([day, hours]) => ({
    day,
    hours: Math.round(hours),
  }));

  // Line chart: productivity scores over time
  const productivityTrend = metrics.map(m => ({
    date: new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: m.productivityScore,
  }));

  // Table columns for activity log
  const logColumns = [
    { key: 'userName', header: 'User', width: '20%' },
    { key: 'action', header: 'Action', width: '25%' },
    { key: 'target', header: 'Target', width: '30%' },
    {
      key: 'timestamp',
      header: 'Time',
      width: '25%',
      cell: (value: string) => new Date(value).toLocaleString(),
    },
  ];

  // Employee metrics table
  const empColumns = [
    { key: 'employeeName', header: 'Employee', width: '25%' },
    { key: 'department', header: 'Department', width: '20%' },
    {
      key: 'activeHours',
      header: 'Active Hours',
      width: '15%',
      cell: (v: number) => `${v.toFixed(1)}h`,
    },
    { key: 'tasksCompleted', header: 'Tasks Done', width: '15%' },
    {
      key: 'productivityScore',
      header: 'Score',
      width: '12%',
      cell: (v: number) => (
        <span
          className={`font-semibold ${v >= 85 ? 'text-green-600' : v >= 70 ? 'text-yellow-600' : 'text-red-600'}`}
        >
          {v}%
        </span>
      ),
    },
    {
      key: 'idleMinutes',
      header: 'Idle',
      width: '13%',
      cell: (v: number) => `${v}m`,
    },
  ];

  return (
    <PageLayout
      title="Activity Overview"
      description="Organization-wide activity analytics and productivity insights"
      kpis={[
        {
          title: 'Total Active Hours',
          value: `${totalActiveHours.toFixed(0)}h`,
          change: 'This month',
          changeType: 'neutral',
          icon: <Clock className="h-5 w-5" />,
        },
        {
          title: 'Avg Productivity',
          value: `${avgProductivity}%`,
          changeType: Number(avgProductivity) >= 85 ? 'positive' : 'negative',
          icon: <TrendingUp className="h-5 w-5" />,
        },
        {
          title: 'Active Employees',
          value: String(activeEmployees),
          change: 'With tracked data',
          changeType: 'positive',
          icon: <Users className="h-5 w-5" />,
        },
        {
          title: 'Tasks Completed',
          value: String(totalTasksCompleted),
          change: 'Across all employees',
          changeType: 'positive',
          icon: <Activity className="h-5 w-5" />,
        },
      ]}
    >
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex items-center gap-3">
          <select
            className="rounded-md border border-border bg-background text-sm px-2.5 py-1.5"
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4">Daily Active Hours</h3>
            <BarChartComponent
              data={weeklyData}
              xKey="day"
              bars={[{ dataKey: 'hours', name: 'Hours', color: '#6366f1' }]}
            />
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4">Productivity Score Trend</h3>
            <LineChartComponent
              data={productivityTrend.slice(-14)}
              xKey="date"
              lines={[{ dataKey: 'score', name: 'Score', color: '#10b981' }]}
            />
          </div>
        </div>

        {/* Employee productivity table */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-4">Employee Productivity Details</h3>
          {loading ? (
            <div className="h-32 flex items-center justify-center text-muted-foreground">
              Loading…
            </div>
          ) : (
            <DataTable columns={empColumns} data={metrics} />
          )}
        </div>

        {/* Activity log */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3>Activity Log</h3>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                className="pl-8 pr-3 py-1.5 rounded-md border border-border bg-background text-sm w-64 focus:outline-none"
                placeholder="Search actions…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <DataTable columns={logColumns} data={activityLog.slice(0, 20)} />
        </div>
      </div>
    </PageLayout>
  );
}
