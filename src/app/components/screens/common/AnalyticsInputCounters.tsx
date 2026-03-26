import { useState, useEffect } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { DataTable } from '../../shared/DataTable';
import { BarChartComponent } from '../../shared/Charts';
import { useAnalyticsData } from '../../../services/hooks';
import {
  Mouse, Keyboard, MonitorPlay, TrendingUp, Activity,
} from 'lucide-react';
import type { ProductivityMetric } from '../../../services/types';

export function AnalyticsInputCounters() {
  const { getProductivityMetrics } = useAnalyticsData();
  const [metrics, setMetrics] = useState<ProductivityMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProductivityMetrics('2026-03-03', '2026-03-04')
      .then(data => { setMetrics(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [getProductivityMetrics]);

  const totalKeystrokes = metrics.reduce((s, m) => s + (m.keystrokes || 0), 0);
  const totalClicks = metrics.reduce((s, m) => s + (m.mouseClicks || 0), 0);
  const avgProductivity = metrics.length > 0
    ? Math.round(metrics.reduce((s, m) => s + m.productivityScore, 0) / metrics.length)
    : 0;
  const totalScreenshots = metrics.reduce((s, m) => s + m.screenshotsCount, 0);

  const chartData = metrics.map(m => ({
    name: m.employeeName.split(' ')[0],
    productivity: m.productivityScore,
    activeHours: m.activeHours,
  }));

  const columns = [
    {
      key: 'employeeName',
      header: 'Employee',
      cell: (_: any, row: ProductivityMetric) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary">
            {row.employeeName.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="font-medium text-sm">{row.employeeName}</div>
            <div className="text-xs text-muted-foreground">{row.department}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'activeHours',
      header: 'Active Hours',
      cell: (val: number) => <span className="font-medium tabular-nums">{val}h</span>,
    },
    {
      key: 'idleMinutes',
      header: 'Idle Time',
      cell: (val: number) => <span className="text-muted-foreground tabular-nums">{val}m</span>,
    },
    {
      key: 'keystrokes',
      header: 'Keystrokes',
      cell: (val: number) => <span className="tabular-nums">{val?.toLocaleString() || '—'}</span>,
    },
    {
      key: 'mouseClicks',
      header: 'Mouse Clicks',
      cell: (val: number) => <span className="tabular-nums">{val?.toLocaleString() || '—'}</span>,
    },
    {
      key: 'tasksCompleted',
      header: 'Tasks Done',
      cell: (val: number) => <span className="font-medium">{val}</span>,
    },
    {
      key: 'screenshotsCount',
      header: 'Screenshots',
      cell: (val: number) => <span className="tabular-nums">{val}</span>,
    },
    {
      key: 'productivityScore',
      header: 'Score',
      cell: (val: number) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${val >= 90 ? 'bg-green-500' : val >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${val}%` }}
            />
          </div>
          <span className={`text-sm font-medium ${val >= 90 ? 'text-green-600' : val >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
            {val}%
          </span>
        </div>
      ),
    },
  ];

  return (
    <PageLayout
      title="Input Counters & Productivity"
      description="Track keyboard, mouse, and overall productivity metrics per employee"
      kpis={[
        { title: 'Avg Productivity', value: `${avgProductivity}%`, change: 'Team average', changeType: avgProductivity >= 80 ? 'positive' : 'warning', icon: <TrendingUp className="h-5 w-5" /> },
        { title: 'Total Keystrokes', value: totalKeystrokes.toLocaleString(), change: 'Today', changeType: 'neutral', icon: <Keyboard className="h-5 w-5" /> },
        { title: 'Total Clicks', value: totalClicks.toLocaleString(), change: 'Today', changeType: 'neutral', icon: <Mouse className="h-5 w-5" /> },
        { title: 'Screenshots', value: totalScreenshots, change: `${metrics.length} employees`, changeType: 'neutral', icon: <MonitorPlay className="h-5 w-5" /> },
      ]}
    >
      {/* Chart */}
      <div className="rounded-lg border border-border bg-card p-6 mb-6">
        <h3 className="font-medium mb-4">Productivity Scores by Employee</h3>
        {chartData.length > 0 ? (
          <BarChartComponent data={chartData} dataKey="productivity" xAxisKey="name" height={250} />
        ) : (
          <div className="h-[250px] flex items-center justify-center text-muted-foreground">Loading...</div>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-muted animate-pulse rounded-lg" />)}
        </div>
      ) : (
        <DataTable columns={columns} data={metrics} />
      )}
    </PageLayout>
  );
}
