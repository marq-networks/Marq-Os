import { PageLayout } from '../../shared/PageLayout';
import { BarChartComponent, LineChartComponent } from '../../shared/Charts';
import { DataTable } from '../../shared/DataTable';
import { DollarSign, TrendingUp, Package } from 'lucide-react';

export function S09SeatSales() {
  const planSales = [
    { plan: 'Starter', seats: 1125 },
    { plan: 'Professional', seats: 2688 },
    { plan: 'Enterprise', seats: 2070 },
  ];

  const salesTrend = [
    { month: 'Jul', seats: 1820 },
    { month: 'Aug', seats: 2150 },
    { month: 'Sep', seats: 2480 },
    { month: 'Oct', seats: 2890 },
    { month: 'Nov', seats: 3250 },
    { month: 'Dec', seats: 3675 },
  ];

  const topOrgs = [
    { id: '1', org: 'MegaCorp International', plan: 'Enterprise', seats: 2500, mrr: '$95,000' },
    { id: '2', org: 'Global Enterprises', plan: 'Enterprise', seats: 1200, mrr: '$45,000' },
    { id: '3', org: 'TechGiant Inc', plan: 'Enterprise', seats: 850, mrr: '$32,500' },
    { id: '4', org: 'Acme Corp', plan: 'Enterprise', seats: 450, mrr: '$12,500' },
    { id: '5', org: 'Innovation Labs', plan: 'Professional', seats: 380, mrr: '$18,900' },
  ];

  const columns = [
    { key: 'org', header: 'Organization', width: '35%' },
    { key: 'plan', header: 'Plan', width: '20%' },
    { key: 'seats', header: 'Seats', width: '20%' },
    { key: 'mrr', header: 'MRR', width: '25%' },
  ];

  return (
    <PageLayout
      title="SUPER – S-09 – Seat Sales / Plans – v1.1"
      description="Seat usage and plan distribution analytics"
      kpis={[
        {
          title: 'Total Seats Sold',
          value: '5,883',
          change: '+425 this month',
          changeType: 'positive',
          icon: <Package className="h-5 w-5" />
        },
        {
          title: 'Seat Utilization',
          value: '68%',
          change: 'Across all orgs',
          changeType: 'neutral',
          icon: <TrendingUp className="h-5 w-5" />
        },
        {
          title: 'Avg Seats per Org',
          value: '38',
          icon: <Package className="h-5 w-5" />
        },
        {
          title: 'Revenue per Seat',
          value: '$33',
          change: 'Average',
          changeType: 'positive',
          icon: <DollarSign className="h-5 w-5" />
        },
      ]}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4">Seats by Plan</h3>
            <BarChartComponent 
              data={planSales}
              dataKey="seats"
              xAxisKey="plan"
              height={250}
            />
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4">Seat Growth (6 Months)</h3>
            <LineChartComponent 
              data={salesTrend}
              dataKey="seats"
              xAxisKey="month"
              height={250}
            />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-4">Top Organizations by Seats</h3>
          <DataTable columns={columns} data={topOrgs} />
        </div>
      </div>
    </PageLayout>
  );
}
