import { useMemo } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { LineChartComponent, BarChartComponent } from '../../shared/Charts';
import { DataTable } from '../../shared/DataTable';
import { DollarSign, TrendingUp, CreditCard } from 'lucide-react';
import { useFinanceData } from '../../../services';

export function S04PlatformBilling() {
  const { billingInvoices, loading } = useFinanceData();

  const revenueData = useMemo(() => {
    const monthTotals = new Map<string, number>();

    billingInvoices.forEach(invoice => {
      const sourceDate = invoice.issueDate || invoice.date || invoice.dueDate;
      const date = new Date(sourceDate);
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      monthTotals.set(month, (monthTotals.get(month) ?? 0) + (invoice.amount || invoice.total || 0));
    });

    return [...monthTotals.entries()].map(([month, revenue]) => ({ month, revenue }));
  }, [billingInvoices]);

  const mrrByPlan = useMemo(() => {
    const totals = new Map<string, number>();

    billingInvoices.forEach(invoice => {
      totals.set(invoice.plan, (totals.get(invoice.plan) ?? 0) + (invoice.amount || invoice.total || 0));
    });

    return [...totals.entries()].map(([plan, mrr]) => ({ plan, mrr }));
  }, [billingInvoices]);

  const topOrgs = useMemo(() => {
    const grouped = new Map<string, { id: string; org: string; plan: string; total: number; count: number }>();

    billingInvoices.forEach(invoice => {
      const key = `${invoice.organizationId}:${invoice.clientName}`;
      const current = grouped.get(key) ?? {
        id: invoice.organizationId,
        org: invoice.clientName,
        plan: invoice.plan,
        total: 0,
        count: 0,
      };

      current.total += invoice.amount || invoice.total || 0;
      current.count += 1;
      current.plan = invoice.plan;
      grouped.set(key, current);
    });

    return [...grouped.values()]
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
      .map(row => ({
        id: row.id,
        org: row.org,
        plan: row.plan,
        mrr: `$${Math.round(row.total).toLocaleString()}`,
        growth: `${row.count} invoices`,
      }));
  }, [billingInvoices]);

  const totalMrr = useMemo(
    () => billingInvoices.reduce((sum, invoice) => sum + (invoice.amount || invoice.total || 0), 0),
    [billingInvoices],
  );

  const arr = totalMrr * 12;
  const orgCount = new Set(billingInvoices.map(invoice => invoice.organizationId)).size;
  const arpu = orgCount > 0 ? totalMrr / orgCount : 0;

  const growthRate = useMemo(() => {
    if (revenueData.length < 2) {
      return 0;
    }

    const previous = revenueData[revenueData.length - 2]?.revenue ?? 0;
    const current = revenueData[revenueData.length - 1]?.revenue ?? 0;
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }
    return ((current - previous) / previous) * 100;
  }, [revenueData]);

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
          value: loading ? '...' : `$${Math.round(totalMrr).toLocaleString()}`,
          change: `${billingInvoices.length} invoices loaded`,
          changeType: totalMrr > 0 ? 'positive' : 'neutral',
          icon: <DollarSign className="h-5 w-5" />
        },
        {
          title: 'ARR',
          value: loading ? '...' : `$${Math.round(arr).toLocaleString()}`,
          change: 'Annual projection',
          changeType: arr > 0 ? 'positive' : 'neutral',
          icon: <TrendingUp className="h-5 w-5" />
        },
        {
          title: 'ARPU',
          value: loading ? '...' : `$${Math.round(arpu).toLocaleString()}`,
          change: 'Average per org',
          changeType: 'neutral',
          icon: <CreditCard className="h-5 w-5" />
        },
        {
          title: 'Growth Rate',
          value: loading ? '...' : `${growthRate >= 0 ? '+' : ''}${growthRate.toFixed(1)}%`,
          change: 'Month over month',
          changeType: growthRate >= 0 ? 'positive' : 'negative',
          icon: <TrendingUp className="h-5 w-5" />
        },
      ]}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4">Revenue Trend (6 Months)</h3>
            <LineChartComponent 
              data={revenueData.length ? revenueData : [{ month: 'N/A', revenue: 0 }]}
              dataKey="revenue"
              xAxisKey="month"
              height={250}
            />
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4">MRR by Plan</h3>
            <BarChartComponent 
              data={mrrByPlan.length ? mrrByPlan : [{ plan: 'No Data', mrr: 0 }]}
              dataKey="mrr"
              xAxisKey="plan"
              height={250}
            />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-4">Top Revenue Organizations</h3>
          <DataTable columns={columns} data={topOrgs.length ? topOrgs : [{ id: 'empty', org: 'No billing data', plan: '-', mrr: '$0', growth: '0 invoices' }]} />
        </div>
      </div>
    </PageLayout>
  );
}
