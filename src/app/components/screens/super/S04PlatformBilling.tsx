import { PageLayout } from '../../shared/PageLayout';
import { LineChartComponent, BarChartComponent } from '../../shared/Charts';
import { DataTable } from '../../shared/DataTable';
import { DollarSign, TrendingUp, CreditCard } from 'lucide-react';
import { mockRevenueData } from '../../../data/mockData';

export function S04PlatformBilling() {
  const mrrByPlan = [
    { plan: 'Starter', mrr: 45000 },
    { plan: 'Professional', mrr: 78000 },
    { plan: 'Enterprise', mrr: 72000 },
  ];

  const topOrgs = [
    { id: '1', org: 'MegaCorp International', plan: 'Enterprise', mrr: '$95,000', growth: '+5%' },
    { id: '2', org: 'Global Enterprises', plan: 'Enterprise', mrr: '$45,000', growth: '+8%' },
    { id: '3', org: 'TechGiant Inc', plan: 'Enterprise', mrr: '$32,500', growth: '+3%' },
    { id: '4', org: 'Innovation Labs', plan: 'Professional', mrr: '$18,900', growth: '+12%' },
    { id: '5', org: 'Acme Corp', plan: 'Enterprise', mrr: '$12,500', growth: '+6%' },
  ];

  const columns = [
    { key: 'org', header: 'Organization', width: '35%' },
    { key: 'plan', header: 'Plan', width: '20%' },
    { key: 'mrr', header: 'MRR', width: '20%' },
    { key: 'growth', header: 'Growth', width: '25%' },
  ];

  return (
    <PageLayout
      title="SUPER – S-04 – Platform Billing – v1.1"
      description="Revenue and billing analytics"
      kpis={[
        {
          title: 'Total MRR',
          value: '$195K',
          change: '+$17K this month',
          changeType: 'positive',
          icon: <DollarSign className="h-5 w-5" />
        },
        {
          title: 'ARR',
          value: '$2.34M',
          change: 'Annual projection',
          changeType: 'positive',
          icon: <TrendingUp className="h-5 w-5" />
        },
        {
          title: 'ARPU',
          value: '$1,250',
          change: 'Average per org',
          changeType: 'neutral',
          icon: <CreditCard className="h-5 w-5" />
        },
        {
          title: 'Growth Rate',
          value: '+9.5%',
          change: 'Month over month',
          changeType: 'positive',
          icon: <TrendingUp className="h-5 w-5" />
        },
      ]}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4">Revenue Trend (6 Months)</h3>
            <LineChartComponent 
              data={mockRevenueData}
              dataKey="revenue"
              xAxisKey="month"
              height={250}
            />
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4">MRR by Plan</h3>
            <BarChartComponent 
              data={mrrByPlan}
              dataKey="mrr"
              xAxisKey="plan"
              height={250}
            />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-4">Top Revenue Organizations</h3>
          <DataTable columns={columns} data={topOrgs} />
        </div>
      </div>
    </PageLayout>
  );
}
