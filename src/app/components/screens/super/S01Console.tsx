import { useEffect, useMemo, useState } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { LineChartComponent, BarChartComponent, DonutChartComponent } from '../../shared/Charts';
import { Layers, Building, TrendingUp, DollarSign } from 'lucide-react';
import { useAnalyticsData, useFinanceData, usePeopleData, type ProductivityMetric } from '../../../services';

export function S01Console() {
  const { employees, departments, loading: peopleLoading } = usePeopleData();
  const { billingInvoices, loading: financeLoading } = useFinanceData();
  const { getProductivityMetrics } = useAnalyticsData();
  const [productivityMetrics, setProductivityMetrics] = useState<ProductivityMetric[]>([]);
  const [metricsLoading, setMetricsLoading] = useState(true);

  useEffect(() => {
    const today = new Date();
    const from = new Date(today);
    from.setMonth(today.getMonth() - 5);

    const fromDate = from.toISOString().slice(0, 10);
    const toDate = today.toISOString().slice(0, 10);

    let mounted = true;

    getProductivityMetrics(fromDate, toDate)
      .then(data => {
        if (mounted) {
          setProductivityMetrics(data);
        }
      })
      .catch(() => {
        if (mounted) {
          setProductivityMetrics([]);
        }
      })
      .finally(() => {
        if (mounted) {
          setMetricsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [getProductivityMetrics]);

  const revenueData = useMemo(() => {
    const monthMap = new Map<string, number>();

    billingInvoices.forEach(invoice => {
      const date = new Date(invoice.issueDate || invoice.date || invoice.dueDate);
      const label = date.toLocaleDateString('en-US', { month: 'short' });
      monthMap.set(label, (monthMap.get(label) ?? 0) + (invoice.amount || invoice.total || 0));
    });

    return [...monthMap.entries()].map(([month, revenue]) => ({
      month,
      revenue: Number(revenue.toFixed(2)),
    }));
  }, [billingInvoices]);

  const planDistribution = useMemo(() => {
    const planMap = new Map<string, number>();

    billingInvoices.forEach(invoice => {
      const plan = invoice.plan || 'Unknown';
      planMap.set(plan, (planMap.get(plan) ?? 0) + 1);
    });

    return [...planMap.entries()].map(([name, value]) => ({ name, value }));
  }, [billingInvoices]);

  const userGrowth = useMemo(() => {
    const monthMap = new Map<string, number>();

    employees.forEach(employee => {
      const date = new Date(employee.joinDate);
      const label = date.toLocaleDateString('en-US', { month: 'short' });
      monthMap.set(label, (monthMap.get(label) ?? 0) + 1);
    });

    let runningUsers = 0;

    return [...monthMap.entries()].map(([month, addedUsers]) => {
      runningUsers += addedUsers;
      return {
        month,
        users: runningUsers,
      };
    });
  }, [employees]);

  const totalRevenue = useMemo(
    () => billingInvoices.reduce((sum, invoice) => sum + (invoice.amount || invoice.total || 0), 0),
    [billingInvoices],
  );

  const avgProductivity = useMemo(() => {
    if (!productivityMetrics.length) {
      return 0;
    }

    return productivityMetrics.reduce((sum, metric) => sum + metric.productivityScore, 0) / productivityMetrics.length;
  }, [productivityMetrics]);

  const organizationCount = useMemo(
    () => new Set(billingInvoices.map(invoice => invoice.organizationId)).size,
    [billingInvoices],
  );

  const activeUsers = useMemo(
    () => employees.filter(employee => employee.status === 'Active').length,
    [employees],
  );

  const isLoading = peopleLoading || financeLoading || metricsLoading;

  return (
    <PageLayout
      title="SUPER – S-01 – Console – v1.1"
      description="Platform-wide metrics and overview"
      kpis={[
        {
          title: 'Total Organizations',
          value: isLoading ? '...' : String(organizationCount),
          change: `${departments.length} departments tracked`,
          changeType: organizationCount > 0 ? 'positive' : 'neutral',
          icon: <Building className="h-5 w-5" />
        },
        {
          title: 'Total Users',
          value: isLoading ? '...' : String(employees.length),
          change: `${activeUsers} active users`,
          changeType: activeUsers > 0 ? 'positive' : 'neutral',
          icon: <Layers className="h-5 w-5" />
        },
        {
          title: 'MRR',
          value: isLoading ? '...' : `$${Math.round(totalRevenue).toLocaleString()}`,
          change: `${billingInvoices.length} billing records`,
          changeType: totalRevenue > 0 ? 'positive' : 'neutral',
          icon: <DollarSign className="h-5 w-5" />
        },
        {
          title: 'Platform Health',
          value: isLoading ? '...' : `${Math.round(avgProductivity)}%`,
          change: 'Avg productivity',
          changeType: avgProductivity >= 70 ? 'positive' : avgProductivity >= 40 ? 'neutral' : 'negative',
          icon: <TrendingUp className="h-5 w-5" />
        },
      ]}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4">Monthly Revenue</h3>
            <LineChartComponent 
              data={revenueData.length ? revenueData : [{ month: 'N/A', revenue: 0 }]}
              dataKey="revenue"
              xAxisKey="month"
              height={250}
            />
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4">Plan Distribution</h3>
            <DonutChartComponent 
              data={planDistribution.length ? planDistribution : [{ name: 'No Data', value: 1 }]}
              dataKey="value"
              nameKey="name"
              height={250}
            />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-4">User Growth (6 Months)</h3>
          <BarChartComponent 
            data={userGrowth.length ? userGrowth : [{ month: 'N/A', users: 0 }]}
            dataKey="users"
            xAxisKey="month"
            height={300}
          />
        </div>
      </div>
    </PageLayout>
  );
}
