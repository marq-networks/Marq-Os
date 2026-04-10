import { useState, useEffect } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import {
  DollarSign, TrendingUp, Calendar, Download, FileText,
  RefreshCw, ChevronDown, ChevronUp, Gift,
} from 'lucide-react';
import { useCurrentEmployee, useFinanceData } from '../../../services';
import type { Payslip } from '../../../services/types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { toast } from 'sonner';

const STATUS_CONFIG: Record<string, { type: 'success' | 'warning' | 'info' }> = {
  Processed:  { type: 'success' },
  Pending:    { type: 'warning' },
  Processing: { type: 'info' },
};

export function E08MyEarnings() {
  const { getMyPayslips, loading } = useFinanceData();
  const { employeeId } = useCurrentEmployee();
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!employeeId) return;
    getMyPayslips(employeeId).then(setPayslips).catch(console.error);
  }, [employeeId, getMyPayslips]);

  const processedPayslips = payslips.filter(p => p.status === 'Processed');
  const latestPayslip = payslips[0];

  // Chart data
  const chartData = [...payslips]
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-8)
    .map(p => ({
      month: p.period.split(' ')[0].slice(0, 3),
      netPay: p.netPay,
      gross: p.grossSalary,
      bonus: p.bonus,
    }));

  const ytdGross = processedPayslips.reduce((sum, p) => sum + p.grossSalary, 0);
  const ytdNet = processedPayslips.reduce((sum, p) => sum + p.netPay, 0);
  const ytdBonuses = processedPayslips.reduce((sum, p) => sum + p.bonus, 0);

  const fmt = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  const handleDownload = (payslip: Payslip) => {
    if (payslip.status === 'Pending') {
      toast.warning('Payslip will be available after the payroll run is processed');
      return;
    }
    toast.success(`Downloading ${payslip.period} payslip PDF…`);
  };

  return (
    <PageLayout
      title="My Earnings"
      description="Your payslip history and earnings breakdown — wired to useFinanceData()"
      actions={
        <Button size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export History
        </Button>
      }
      kpis={[
        {
          title: 'YTD Gross',
          value: fmt(ytdGross),
          change: 'Year to date',
          changeType: 'positive',
          icon: <TrendingUp className="h-5 w-5" />,
        },
        {
          title: 'YTD Net',
          value: fmt(ytdNet),
          change: `${processedPayslips.length} payslips`,
          changeType: 'positive',
          icon: <DollarSign className="h-5 w-5" />,
        },
        {
          title: 'YTD Bonuses',
          value: fmt(ytdBonuses),
          change: 'Performance bonuses',
          changeType: 'positive',
          icon: <Gift className="h-5 w-5" />,
        },
        {
          title: 'Latest Payslip',
          value: latestPayslip ? latestPayslip.period : '—',
          change: latestPayslip ? latestPayslip.status : '—',
          changeType: latestPayslip?.status === 'Processed' ? 'positive' : 'warning',
          icon: <Calendar className="h-5 w-5" />,
        },
      ]}
    >
      {loading && payslips.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          Loading earnings data…
        </div>
      ) : (
        <div className="space-y-6">
          {/* Earnings Chart */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3>Earnings History</h3>
              <span className="text-sm text-muted-foreground">Net pay over time</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={v => `$${(v / 1000).toFixed(1)}k`}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [fmt(value), name === 'netPay' ? 'Net Pay' : 'Gross']}
                  contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}
                />
                <Area
                  type="monotone"
                  dataKey="netPay"
                  stroke="var(--primary)"
                  fill="url(#earningsGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Payslips List */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h3>Payslip History</h3>
            </div>
            <div className="divide-y divide-border">
              {payslips.map(payslip => {
                const isOpen = expanded === payslip.id;
                const cfg = STATUS_CONFIG[payslip.status];
                return (
                  <div key={payslip.id} className="overflow-hidden">
                    {/* Payslip row */}
                    <div
                      className="flex items-center gap-4 px-6 py-4 hover:bg-muted/20 cursor-pointer transition-colors"
                      onClick={() => setExpanded(isOpen ? null : payslip.id)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{payslip.period}</span>
                          <StatusBadge type={cfg.type}>{payslip.status}</StatusBadge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-0.5">
                          <span>Gross: {fmt(payslip.grossSalary)}</span>
                          <span>Deductions: −{fmt(payslip.deductions)}</span>
                          {payslip.bonus > 0 && <span className="text-green-600">Bonus: +{fmt(payslip.bonus)}</span>}
                          {payslip.paymentDate && <span>Paid: {new Date(payslip.paymentDate).toLocaleDateString()}</span>}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-lg font-bold text-green-700 dark:text-green-400">{fmt(payslip.netPay)}</p>
                        <p className="text-xs text-muted-foreground">Net Pay</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={e => { e.stopPropagation(); handleDownload(payslip); }}
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          PDF
                        </Button>
                        {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                      </div>
                    </div>

                    {/* Breakdown */}
                    {isOpen && (
                      <div className="px-6 py-4 bg-muted/10 border-t border-border">
                        <h4 className="text-sm font-semibold mb-3">Earnings Breakdown</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {payslip.breakdown.map((item, i) => (
                            <div
                              key={i}
                              className={`flex justify-between items-center py-2 px-3 rounded-lg ${
                                item.type === 'addition'
                                  ? 'bg-green-50 dark:bg-green-950/20'
                                  : 'bg-red-50 dark:bg-red-950/20'
                              }`}
                            >
                              <span className="text-sm">{item.label}</span>
                              <span className={`text-sm font-semibold ${
                                item.type === 'addition'
                                  ? 'text-green-700 dark:text-green-400'
                                  : 'text-red-600 dark:text-red-400'
                              }`}>
                                {item.type === 'addition' ? '+' : '−'}{fmt(item.amount)}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 flex justify-between items-center pt-3 border-t border-border">
                          <span className="font-semibold">Net Pay</span>
                          <span className="text-lg font-bold text-green-700 dark:text-green-400">{fmt(payslip.netPay)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border">
        <p className="text-xs text-muted-foreground">
          <strong>Service Layer ✓</strong> — Payslips sourced from <code className="font-mono">useFinanceData().getMyPayslips('e1')</code>.
          All breakdown items, YTD calculations, and status badges are computed live from service data.
        </p>
      </div>
    </PageLayout>
  );
}
