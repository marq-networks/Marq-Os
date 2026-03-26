import { PageLayout } from '../../shared/PageLayout';
import { BarChartComponent, DonutChartComponent, LineChartComponent } from '../../shared/Charts';
import { StatusBadge } from '../../shared/StatusBadge';
import { useFinanceData } from '../../../services/hooks';
import {
  DollarSign, TrendingUp, CreditCard, ArrowUpRight, ArrowDownRight, Wallet,
  Receipt, AlertTriangle,
} from 'lucide-react';

export function FinanceCockpit() {
  const { payrollRuns, billingInvoices, payslips, loading } = useFinanceData();

  const totalPayroll = payrollRuns.reduce((s, r) => s + r.totalGross, 0);
  const totalBilled = billingInvoices.reduce((s, i) => s + i.amount, 0);
  const pendingInvoices = billingInvoices.filter(i => i.status === 'Pending');
  const paidInvoices = billingInvoices.filter(i => i.status === 'Paid');
  const pendingAmount = pendingInvoices.reduce((s, i) => s + i.amount, 0);

  const monthlyData = payrollRuns.map(r => ({
    name: r.period.replace(' 2026', '').substring(0, 3),
    gross: r.totalGross / 1000,
    net: r.totalNet / 1000,
    deductions: r.totalDeductions / 1000,
  }));

  const invoiceStatus = [
    { name: 'Paid', value: paidInvoices.length },
    { name: 'Pending', value: pendingInvoices.length },
    { name: 'Overdue', value: billingInvoices.filter(i => i.status === 'Overdue').length },
  ];

  const fmt = (v: number) => `$${(v / 1000).toFixed(0)}K`;

  return (
    <PageLayout
      title="Finance Cockpit"
      description="Financial command center — payroll, billing, cash flow, and alerts"
      kpis={[
        { title: 'Total Payroll', value: fmt(totalPayroll), change: `${payrollRuns.length} runs`, changeType: 'neutral', icon: <DollarSign className="h-5 w-5" /> },
        { title: 'Revenue Billed', value: fmt(totalBilled), change: `${billingInvoices.length} invoices`, changeType: 'positive', icon: <TrendingUp className="h-5 w-5" /> },
        { title: 'Pending', value: fmt(pendingAmount), change: `${pendingInvoices.length} invoices`, changeType: pendingInvoices.length > 0 ? 'warning' : 'positive', icon: <Receipt className="h-5 w-5" /> },
        { title: 'Employees', value: payrollRuns[0]?.employeeCount || 0, change: 'On latest payroll', changeType: 'neutral', icon: <Wallet className="h-5 w-5" /> },
      ]}
    >
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="h-72 bg-muted animate-pulse rounded-lg" />)}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="font-medium mb-4">Monthly Payroll Trend ($K)</h3>
              <BarChartComponent data={monthlyData} dataKey="gross" xAxisKey="name" height={280} />
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="font-medium mb-4">Invoice Status</h3>
              <DonutChartComponent data={invoiceStatus} dataKey="value" nameKey="name" height={280} />
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Net Payroll', value: fmt(payrollRuns.reduce((s, r) => s + r.totalNet, 0)), icon: ArrowDownRight, color: 'text-red-500' },
              { label: 'Deductions', value: fmt(payrollRuns.reduce((s, r) => s + r.totalDeductions, 0)), icon: ArrowDownRight, color: 'text-orange-500' },
              { label: 'Paid Invoices', value: fmt(paidInvoices.reduce((s, i) => s + i.amount, 0)), icon: ArrowUpRight, color: 'text-green-500' },
              { label: 'Cash Flow', value: fmt(paidInvoices.reduce((s, i) => s + i.amount, 0) - payrollRuns.slice(0, 1).reduce((s, r) => s + r.totalNet, 0)), icon: TrendingUp, color: 'text-blue-500' },
            ].map(item => (
              <div key={item.label} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <p className="text-xl font-medium">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Recent Payroll Runs */}
          <div className="rounded-lg border border-border bg-card">
            <div className="p-4 border-b border-border">
              <h3 className="font-medium">Recent Payroll Runs</h3>
            </div>
            <div className="divide-y divide-border">
              {payrollRuns.slice(0, 4).map(run => (
                <div key={run.id} className="flex items-center gap-4 p-4 hover:bg-muted/30">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-sm">{run.period}</span>
                    <p className="text-xs text-muted-foreground">{run.employeeCount} employees</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{fmt(run.totalGross)}</p>
                    <p className="text-xs text-muted-foreground">Net: {fmt(run.totalNet)}</p>
                  </div>
                  <StatusBadge type={run.status === 'Processed' ? 'success' : run.status === 'Draft' ? 'warning' : 'neutral'}>
                    {run.status}
                  </StatusBadge>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Alerts */}
          {pendingInvoices.length > 0 && (
            <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/30 p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-700 dark:text-yellow-400">Payment Attention Needed</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {pendingInvoices.length} invoice{pendingInvoices.length > 1 ? 's' : ''} pending payment totaling {fmt(pendingAmount)}.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </PageLayout>
  );
}
