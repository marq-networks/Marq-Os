import { PageLayout } from '../../shared/PageLayout';
import { LineChartComponent } from '../../shared/Charts';
import { DataTable } from '../../shared/DataTable';
import { StatusBadge } from '../../shared/StatusBadge';
import { Activity, Server, Zap, Database } from 'lucide-react';

export function S06SystemHealth() {
  const uptimeData = [
    { day: 'Mon', uptime: 99.9 },
    { day: 'Tue', uptime: 100 },
    { day: 'Wed', uptime: 99.8 },
    { day: 'Thu', uptime: 99.9 },
    { day: 'Fri', uptime: 100 },
    { day: 'Sat', uptime: 100 },
    { day: 'Sun', uptime: 99.9 },
  ];

  const services = [
    { id: '1', service: 'API Gateway', status: 'Operational', uptime: '99.9%', latency: '45ms' },
    { id: '2', service: 'Authentication', status: 'Operational', uptime: '100%', latency: '12ms' },
    { id: '3', service: 'Database Primary', status: 'Operational', uptime: '99.8%', latency: '8ms' },
    { id: '4', service: 'Database Replica', status: 'Operational', uptime: '100%', latency: '10ms' },
    { id: '5', service: 'File Storage', status: 'Operational', uptime: '99.9%', latency: '85ms' },
  ];

  const columns = [
    { key: 'service', header: 'Service', width: '30%' },
    { 
      key: 'status', 
      header: 'Status', 
      width: '20%',
      cell: (value: string) => <StatusBadge type="success">{value}</StatusBadge>
    },
    { key: 'uptime', header: 'Uptime (30d)', width: '25%' },
    { key: 'latency', header: 'Avg Latency', width: '25%' },
  ];

  return (
    <PageLayout
      title="SUPER – S-06 – System Health – v1.1"
      description="Platform infrastructure and performance monitoring"
      kpis={[
        {
          title: 'System Status',
          value: 'Operational',
          change: 'All systems normal',
          changeType: 'positive',
          icon: <Activity className="h-5 w-5" />
        },
        {
          title: 'Uptime',
          value: '99.8%',
          change: 'Last 30 days',
          changeType: 'positive',
          icon: <Server className="h-5 w-5" />
        },
        {
          title: 'Avg Response Time',
          value: '32ms',
          change: '-8ms improvement',
          changeType: 'positive',
          icon: <Zap className="h-5 w-5" />
        },
        {
          title: 'DB Load',
          value: '42%',
          change: 'Optimal range',
          changeType: 'positive',
          icon: <Database className="h-5 w-5" />
        },
      ]}
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-4">Weekly Uptime</h3>
          <LineChartComponent 
            data={uptimeData}
            dataKey="uptime"
            xAxisKey="day"
            height={300}
          />
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-4">Service Status</h3>
          <DataTable columns={columns} data={services} />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-6">
            <h4 className="mb-2 text-muted-foreground">Active Connections</h4>
            <p className="text-3xl">1,248</p>
            <p className="mt-2 text-sm text-muted-foreground">Real-time users</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h4 className="mb-2 text-muted-foreground">API Requests</h4>
            <p className="text-3xl">45.2K/min</p>
            <p className="mt-2 text-sm text-muted-foreground">Average rate</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h4 className="mb-2 text-muted-foreground">Data Transfer</h4>
            <p className="text-3xl">2.4 TB</p>
            <p className="mt-2 text-sm text-muted-foreground">Today</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
