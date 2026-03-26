import { PageLayout } from '../../shared/PageLayout';
import { StatusBadge } from '../../shared/StatusBadge';
import { BarChartComponent, DonutChartComponent } from '../../shared/Charts';
import {
  Landmark, DollarSign, Calendar, TrendingDown, AlertTriangle, Percent,
} from 'lucide-react';

interface Loan {
  id: string; name: string; lender: string; type: 'Term Loan' | 'Credit Line' | 'Equipment Lease' | 'Mortgage';
  principal: number; outstanding: number; interestRate: number; monthlyPayment: number;
  startDate: string; maturityDate: string; status: 'Active' | 'Paid Off' | 'Defaulted';
}

const LOANS: Loan[] = [
  { id: 'l1', name: 'Business Expansion Loan', lender: 'JPMorgan Chase', type: 'Term Loan', principal: 500000, outstanding: 385000, interestRate: 5.75, monthlyPayment: 9800, startDate: '2024-01-15', maturityDate: '2029-01-15', status: 'Active' },
  { id: 'l2', name: 'Working Capital Line', lender: 'Bank of America', type: 'Credit Line', principal: 200000, outstanding: 75000, interestRate: 7.25, monthlyPayment: 3200, startDate: '2025-06-01', maturityDate: '2027-06-01', status: 'Active' },
  { id: 'l3', name: 'Server Equipment Lease', lender: 'Dell Financial', type: 'Equipment Lease', principal: 120000, outstanding: 48000, interestRate: 4.5, monthlyPayment: 4500, startDate: '2024-09-01', maturityDate: '2027-09-01', status: 'Active' },
  { id: 'l4', name: 'Office Fit-out Loan', lender: 'Wells Fargo', type: 'Term Loan', principal: 80000, outstanding: 0, interestRate: 6.0, monthlyPayment: 0, startDate: '2022-01-01', maturityDate: '2025-01-01', status: 'Paid Off' },
];

const TYPE_COLOR: Record<string, string> = {
  'Term Loan': 'bg-blue-500/10 text-blue-600', 'Credit Line': 'bg-purple-500/10 text-purple-600',
  'Equipment Lease': 'bg-green-500/10 text-green-600', Mortgage: 'bg-orange-500/10 text-orange-600',
};

export function FinanceLoansLiabilities() {
  const active = LOANS.filter(l => l.status === 'Active');
  const totalOutstanding = active.reduce((s, l) => s + l.outstanding, 0);
  const totalMonthly = active.reduce((s, l) => s + l.monthlyPayment, 0);
  const avgRate = active.length > 0 ? (active.reduce((s, l) => s + l.interestRate, 0) / active.length).toFixed(2) : '0';

  const loanBreakdown = active.map(l => ({ name: l.name.length > 15 ? l.name.substring(0, 15) + '...' : l.name, outstanding: l.outstanding / 1000 }));
  const typeData = ['Term Loan', 'Credit Line', 'Equipment Lease'].map(type => ({
    name: type, value: active.filter(l => l.type === type).reduce((s, l) => s + l.outstanding, 0),
  })).filter(d => d.value > 0);

  const fmt = (v: number) => `$${v.toLocaleString()}`;

  return (
    <PageLayout
      title="Loans & Liabilities"
      description="Track active loans, credit lines, leases, and repayment schedules"
      kpis={[
        { title: 'Total Outstanding', value: `$${(totalOutstanding / 1000).toFixed(0)}K`, changeType: 'neutral', icon: <DollarSign className="h-5 w-5" /> },
        { title: 'Monthly Payments', value: fmt(totalMonthly), change: 'Combined payment', changeType: 'neutral', icon: <Calendar className="h-5 w-5" /> },
        { title: 'Active Loans', value: active.length, change: `of ${LOANS.length} total`, changeType: 'neutral', icon: <Landmark className="h-5 w-5" /> },
        { title: 'Avg Interest', value: `${avgRate}%`, changeType: 'neutral', icon: <Percent className="h-5 w-5" /> },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-medium mb-4">Outstanding by Loan ($K)</h3>
          <BarChartComponent data={loanBreakdown} dataKey="outstanding" xAxisKey="name" height={260} />
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-medium mb-4">Liability by Type</h3>
          <DonutChartComponent data={typeData} dataKey="value" nameKey="name" height={260} />
        </div>
      </div>

      <div className="space-y-4">
        {LOANS.map(loan => {
          const paidPercent = loan.principal > 0 ? Math.round(((loan.principal - loan.outstanding) / loan.principal) * 100) : 100;
          return (
            <div key={loan.id} className={`rounded-lg border bg-card p-5 ${loan.status === 'Paid Off' ? 'border-green-200 dark:border-green-900 opacity-70' : 'border-border'}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${TYPE_COLOR[loan.type] || 'bg-muted'}`}>
                    <Landmark className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{loan.name}</h4>
                      <StatusBadge type={loan.status === 'Active' ? 'info' : loan.status === 'Paid Off' ? 'success' : 'danger'}>{loan.status}</StatusBadge>
                    </div>
                    <p className="text-xs text-muted-foreground">{loan.lender} • {loan.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-medium">{fmt(loan.outstanding)}</p>
                  <p className="text-xs text-muted-foreground">of {fmt(loan.principal)} principal</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Repayment Progress</span>
                  <span className="font-medium">{paidPercent}% paid</span>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${loan.status === 'Paid Off' ? 'bg-green-500' : 'bg-primary'}`} style={{ width: `${paidPercent}%` }} />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="rounded bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">Interest Rate</p>
                  <p className="font-medium">{loan.interestRate}%</p>
                </div>
                <div className="rounded bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">Monthly</p>
                  <p className="font-medium">{fmt(loan.monthlyPayment)}</p>
                </div>
                <div className="rounded bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">Start</p>
                  <p className="font-medium text-sm">{new Date(loan.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                </div>
                <div className="rounded bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">Maturity</p>
                  <p className="font-medium text-sm">{new Date(loan.maturityDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                </div>
                <div className="rounded bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">Remaining</p>
                  <p className="font-medium">{fmt(loan.outstanding)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </PageLayout>
  );
}
