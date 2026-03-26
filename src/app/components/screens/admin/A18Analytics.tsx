/**
 * A18 - ANALYTICS
 * Wired to service layer: useAnalyticsData() → getProductivityMetrics()
 */

import { useState, useEffect } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { LineChartComponent, BarChartComponent, DonutChartComponent } from '../../shared/Charts';
import { BarChart3, TrendingUp, Users, Award } from 'lucide-react';
import { useAnalyticsData, usePeopleData } from '../../../services';
import type { ProductivityMetric } from '../../../services';

// Date helpers
const today = '2026-03-04';
const sixMonthsAgo = '2025-09-04';

export function A18Analytics() {
  const { getProductivityMetrics, loading } = useAnalyticsData();
  const { departments } = usePeopleData();
  const [metrics, setMetrics] = useState<ProductivityMetric[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>('');

  useEffect(() => {
    getProductivityMetrics(sixMonthsAgo, today, selectedDept || undefined).then(setMetrics);
  }, [getProductivityMetrics, selectedDept]);

  // Aggregate by department for donut
  const byDept = metrics.reduce<Record<string, number>>((acc, m) => {
    acc[m.department] = (acc[m.department] ?? 0) + m.productivityScore;
    return acc;
  }, {});
  const deptCounts = metrics.reduce<Record<string, number>>((acc, m) => {
    acc[m.department] = (acc[m.department] ?? 0) + 1;
    return acc;
  }, {});
  const departmentPerformance = Object.entries(byDept).map(([name, total]) => ({
    name,
    value: Math.round(total / (deptCounts[name] || 1)),
  }));

  // Performance trend (aggregate by date)
  const byDate = metrics.reduce<Record<string, number[]>>((acc, m) => {
    const label = new Date(m.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    if (!acc[label]) acc[label] = [];
    acc[label].push(m.productivityScore);
    return acc;
  }, {});
  const performanceTrend = Object.entries(byDate)
    .slice(-8)
    .map(([date, scores]) => ({
      date,
      score: Math.round(scores.reduce((s, v) => s + v, 0) / scores.length),
    }));

  // KPIs
  const avgScore =
    metrics.length > 0
      ? Math.round(metrics.reduce((s, m) => s + m.productivityScore, 0) / metrics.length)
      : 0;
  const topPerformer = metrics.reduce(
    (best, m) => (m.productivityScore > (best?.productivityScore ?? 0) ? m : best),
    null as ProductivityMetric | null,
  );
  const uniqueEmployees = new Set(metrics.map(m => m.employeeId)).size;
  const avgHoursPerDay =
    metrics.length > 0
      ? (metrics.reduce((s, m) => s + m.activeHours, 0) / metrics.length).toFixed(1)
      : '0';

  return (
    <PageLayout
      title="Analytics"
      description="Comprehensive organization performance and productivity analytics"
      actions={
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
      }
      kpis={[
        {
          title: 'Org Performance',
          value: `${avgScore}/100`,
          change: avgScore >= 85 ? 'Above target' : 'Below target',
          changeType: avgScore >= 85 ? 'positive' : 'negative',
          icon: <BarChart3 className="h-5 w-5" />,
        },
        {
          title: 'Avg Active Hours/Day',
          value: `${avgHoursPerDay}h`,
          changeType: 'neutral',
          icon: <TrendingUp className="h-5 w-5" />,
        },
        {
          title: 'Employees Tracked',
          value: String(uniqueEmployees),
          changeType: 'neutral',
          icon: <Users className="h-5 w-5" />,
        },
        {
          title: 'Top Performer',
          value: topPerformer ? `${topPerformer.productivityScore}%` : '—',
          change: topPerformer?.employeeName ?? '',
          changeType: 'positive',
          icon: <Award className="h-5 w-5" />,
        },
      ]}
    >
      {loading ? (
        <div className="flex items-center justify-center h-40 text-muted-foreground">
          Loading analytics…
        </div>
      ) : (
        <div className="space-y-6">
          {/* Performance trend + department donut */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-4">Performance Trend</h3>
              <LineChartComponent
                data={performanceTrend}
                xKey="date"
                lines={[{ dataKey: 'score', name: 'Avg Score', color: '#6366f1' }]}
              />
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-4">Department Performance</h3>
              <DonutChartComponent data={departmentPerformance} />
            </div>
          </div>

          {/* Department bar chart */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4">Average Score by Department</h3>
            <BarChartComponent
              data={departmentPerformance}
              xKey="name"
              bars={[{ dataKey: 'value', name: 'Avg Score', color: '#10b981' }]}
            />
          </div>

          {/* Top performers table */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4">Top Performers</h3>
            <div className="space-y-2">
              {[...metrics]
                .sort((a, b) => b.productivityScore - a.productivityScore)
                .slice(0, 5)
                .map((m, i) => (
                  <div
                    key={`${m.employeeId}-${m.date}`}
                    className="flex items-center gap-3 py-2 border-b border-border last:border-0"
                  >
                    <span className="w-6 text-center font-semibold text-muted-foreground">
                      #{i + 1}
                    </span>
                    <div className="flex-1">
                      <span className="font-medium">{m.employeeName}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        {m.department}
                      </span>
                    </div>
                    <span
                      className={`font-semibold ${m.productivityScore >= 90 ? 'text-green-600' : m.productivityScore >= 75 ? 'text-yellow-600' : 'text-red-600'}`}
                    >
                      {m.productivityScore}%
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
