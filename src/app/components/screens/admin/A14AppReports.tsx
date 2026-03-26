/**
 * A14 - APP & WEBSITE REPORTS
 * Wired to service layer: useAnalyticsData() → getAppUsageReports()
 */

import { useState, useEffect } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { DataTable } from '../../shared/DataTable';
import { DonutChartComponent } from '../../shared/Charts';
import { StatusBadge } from '../../shared/StatusBadge';
import { Monitor, Clock, TrendingUp, Users } from 'lucide-react';
import { useAnalyticsData } from '../../../services';
import type { AppUsageReport } from '../../../services';

// Date helpers
const today = '2026-03-04';
const oneMonthAgo = '2026-02-04';

export function A14AppReports() {
  const { getAppUsageReports, loading } = useAnalyticsData();
  const [reports, setReports] = useState<AppUsageReport[]>([]);

  useEffect(() => {
    getAppUsageReports(oneMonthAgo, today).then(setReports);
  }, [getAppUsageReports]);

  // KPIs
  const totalApps = reports.length;
  const totalMinutes = reports.reduce((s, r) => s + r.totalMinutes, 0);
  const totalHours = Math.round(totalMinutes / 60);
  const productiveMinutes = reports
    .filter(r => r.category === 'Productive')
    .reduce((s, r) => s + r.totalMinutes, 0);
  const productivePercent =
    totalMinutes > 0
      ? ((productiveMinutes / totalMinutes) * 100).toFixed(0)
      : '0';
  const maxUsers = Math.max(...reports.map(r => r.users), 0);

  // Donut chart data
  const donutData = reports.map(r => ({ name: r.appName, value: r.totalMinutes }));

  // Category badge
  const getCategoryBadge = (category: AppUsageReport['category']) => {
    const map: Record<string, 'success' | 'neutral' | 'error'> = {
      Productive: 'success',
      Neutral: 'neutral',
      Unproductive: 'error',
    };
    return <StatusBadge type={map[category]}>{category}</StatusBadge>;
  };

  const columns = [
    { key: 'appName', header: 'Application', width: '25%' },
    {
      key: 'category',
      header: 'Category',
      width: '18%',
      cell: (value: AppUsageReport['category']) => getCategoryBadge(value),
    },
    {
      key: 'totalMinutes',
      header: 'Total Time',
      width: '18%',
      cell: (value: number) => {
        const h = Math.floor(value / 60);
        const m = value % 60;
        return `${h}h ${m}m`;
      },
    },
    {
      key: 'percentage',
      header: 'Share',
      width: '15%',
      cell: (value: number) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full"
              style={{ width: `${Math.min(value, 100)}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground w-8 text-right">{value}%</span>
        </div>
      ),
    },
    { key: 'users', header: 'Users', width: '12%' },
    {
      key: 'users',
      header: 'Adoption',
      width: '12%',
      cell: (value: number) => (
        <span className="text-sm text-muted-foreground">
          {maxUsers > 0 ? Math.round((value / maxUsers) * 100) : 0}% of team
        </span>
      ),
    },
  ];

  return (
    <PageLayout
      title="App & Website Reports"
      description="Application usage tracking and productivity categorization"
      kpis={[
        {
          title: 'Apps Tracked',
          value: String(totalApps),
          icon: <Monitor className="h-5 w-5" />,
        },
        {
          title: 'Total Time',
          value: `${totalHours}h`,
          change: 'This month',
          changeType: 'neutral',
          icon: <Clock className="h-5 w-5" />,
        },
        {
          title: 'Productive Time',
          value: `${productivePercent}%`,
          change: 'Of all tracked time',
          changeType: Number(productivePercent) >= 60 ? 'positive' : 'negative',
          icon: <TrendingUp className="h-5 w-5" />,
        },
        {
          title: 'Peak Users',
          value: String(maxUsers),
          change: 'On most-used app',
          changeType: 'neutral',
          icon: <Users className="h-5 w-5" />,
        },
      ]}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Table */}
          <div className="lg:col-span-2 rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4">Application Usage Breakdown</h3>
            {loading ? (
              <div className="h-32 flex items-center justify-center text-muted-foreground">
                Loading reports…
              </div>
            ) : (
              <DataTable columns={columns} data={reports} />
            )}
          </div>

          {/* Donut chart */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4">Time Distribution</h3>
            {donutData.length > 0 && <DonutChartComponent data={donutData} />}
            {/* Legend */}
            <div className="mt-4 space-y-2">
              {reports.map(r => (
                <div key={r.appName} className="flex items-center justify-between text-sm">
                  <span>{r.appName}</span>
                  <span className="text-muted-foreground">{r.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category summary */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-4">Category Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            {(['Productive', 'Neutral', 'Unproductive'] as const).map(cat => {
              const catReports = reports.filter(r => r.category === cat);
              const catMinutes = catReports.reduce((s, r) => s + r.totalMinutes, 0);
              const catHours = Math.round(catMinutes / 60);
              return (
                <div
                  key={cat}
                  className="rounded-md border border-border p-4 text-center"
                >
                  <div className="mb-2">{getCategoryBadge(cat)}</div>
                  <div className="text-2xl font-semibold">{catHours}h</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {catReports.length} apps
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
