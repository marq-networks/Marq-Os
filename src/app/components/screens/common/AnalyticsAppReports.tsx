import { useState, useEffect } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { DonutChartComponent, BarChartComponent } from '../../shared/Charts';
import { useAnalyticsData } from '../../../services/hooks';
import {
  AppWindow, TrendingUp, Clock, BarChart3, AlertTriangle,
} from 'lucide-react';
import type { AppUsageReport } from '../../../services/types';

const CATEGORY_COLOR: Record<string, string> = {
  Productive: 'bg-green-500/10 text-green-700 dark:text-green-400',
  Neutral: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
  Unproductive: 'bg-red-500/10 text-red-700 dark:text-red-400',
};

export function AnalyticsAppReports() {
  const { getAppUsageReports } = useAnalyticsData();
  const [reports, setReports] = useState<AppUsageReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAppUsageReports('2026-03-01', '2026-03-04')
      .then(data => { setReports(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [getAppUsageReports]);

  const totalMinutes = reports.reduce((s, r) => s + r.totalMinutes, 0);
  const productiveMinutes = reports.filter(r => r.category === 'Productive').reduce((s, r) => s + r.totalMinutes, 0);
  const unproductiveMinutes = reports.filter(r => r.category === 'Unproductive').reduce((s, r) => s + r.totalMinutes, 0);
  const productiveRate = totalMinutes > 0 ? Math.round((productiveMinutes / totalMinutes) * 100) : 0;

  const categoryData = ['Productive', 'Neutral', 'Unproductive'].map(cat => ({
    name: cat,
    value: reports.filter(r => r.category === cat).reduce((s, r) => s + r.totalMinutes, 0),
  }));

  const topApps = [...reports].sort((a, b) => b.totalMinutes - a.totalMinutes).slice(0, 8);
  const barData = topApps.map(r => ({ name: r.appName, minutes: r.totalMinutes }));

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <PageLayout
      title="App Usage Reports"
      description="Analyze application usage patterns across the organization"
      kpis={[
        { title: 'Total Usage', value: formatDuration(totalMinutes), change: `${reports.length} apps tracked`, changeType: 'neutral', icon: <Clock className="h-5 w-5" /> },
        { title: 'Productive', value: `${productiveRate}%`, change: formatDuration(productiveMinutes), changeType: productiveRate >= 70 ? 'positive' : 'warning', icon: <TrendingUp className="h-5 w-5" /> },
        { title: 'Apps Tracked', value: reports.length, change: 'Active applications', changeType: 'neutral', icon: <AppWindow className="h-5 w-5" /> },
        { title: 'Unproductive', value: formatDuration(unproductiveMinutes), change: `${reports.filter(r => r.category === 'Unproductive').length} apps`, changeType: unproductiveMinutes > 0 ? 'danger' : 'positive', icon: <AlertTriangle className="h-5 w-5" /> },
      ]}
    >
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-muted animate-pulse rounded-lg" />
          <div className="h-80 bg-muted animate-pulse rounded-lg" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Category breakdown donut */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="font-medium mb-4">Usage by Category</h3>
              <DonutChartComponent data={categoryData} dataKey="value" nameKey="name" height={280} />
            </div>

            {/* Top apps bar chart */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="font-medium mb-4">Top Applications (minutes)</h3>
              <BarChartComponent data={barData} dataKey="minutes" xAxisKey="name" height={280} />
            </div>
          </div>

          {/* App list */}
          <div className="rounded-lg border border-border bg-card">
            <div className="p-4 border-b border-border">
              <h3 className="font-medium">All Applications</h3>
            </div>
            <div className="divide-y divide-border">
              {[...reports].sort((a, b) => b.totalMinutes - a.totalMinutes).map((app, i) => (
                <div key={app.appName} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
                  <span className="text-sm text-muted-foreground w-6 text-right">#{i + 1}</span>
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-xs text-primary font-medium">
                    {app.appName.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{app.appName}</div>
                    <div className="text-xs text-muted-foreground">{app.users} users</div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${CATEGORY_COLOR[app.category] || 'bg-muted'}`}>
                    {app.category}
                  </span>
                  <div className="text-right">
                    <div className="text-sm font-medium tabular-nums">{formatDuration(app.totalMinutes)}</div>
                    <div className="text-xs text-muted-foreground">{app.percentage}%</div>
                  </div>
                  <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        app.category === 'Productive' ? 'bg-green-500' :
                        app.category === 'Neutral' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${app.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </PageLayout>
  );
}
