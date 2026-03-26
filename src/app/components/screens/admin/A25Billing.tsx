import { useState } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { CreditCard, TrendingUp, Calendar, Download, ExternalLink, RefreshCw, Users } from 'lucide-react';
import { useFinanceData } from '../../../services';
import type { BillingInvoice } from '../../../services/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const STATUS_CONFIG: Record<BillingInvoice['status'], { type: 'success' | 'warning' | 'error' | 'info' }> = {
  Paid:      { type: 'success' },
  Pending:   { type: 'warning' },
  Overdue:   { type: 'error' },
  Cancelled: { type: 'info' },
};

export function A25Billing() {
  const { billingInvoices, loading, refresh } = useFinanceData();
  const [selected, setSelected] = useState<string | null>(null);

  const currentInvoice = billingInvoices.find(i => i.status === 'Pending') || billingInvoices[0];
  const paidInvoices = billingInvoices.filter(i => i.status === 'Paid');
  const totalPaid = paidInvoices.reduce((sum, i) => sum + i.total, 0);

  // Chart data: last 6 invoices
  const chartData = [...billingInvoices]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-6)
    .map(inv => ({
      month: inv.period.split(' ')[0].slice(0, 3),
      amount: inv.total,
      seats: inv.seats,
      status: inv.status,
    }));

  const fmt = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch { return d; }
  };

  return (
    <PageLayout
      title="ADMIN – A-25 – Billing"
      description="Subscription billing and invoice management — wired to useFinanceData()"
      actions={
        <>
          <Button variant="outline" size="sm" onClick={refresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm">
            <ExternalLink className="mr-2 h-4 w-4" />
            Manage Plan
          </Button>
        </>
      }
      kpis={[
        {
          title: 'Current Plan',
          value: currentInvoice?.plan || 'Professional',
          change: currentInvoice ? `${fmt(currentInvoice.total)}/mo` : '—',
          changeType: 'info',
          icon: <CreditCard className="h-5 w-5" />,
        },
        {
          title: 'Active Seats',
          value: String(currentInvoice?.seats || 0),
          change: `${fmt(currentInvoice?.pricePerSeat || 0)} per seat`,
          changeType: 'neutral',
          icon: <Users className="h-5 w-5" />,
        },
        {
          title: 'Total Paid (YTD)',
          value: fmt(totalPaid),
          change: `${paidInvoices.length} invoices`,
          changeType: 'positive',
          icon: <TrendingUp className="h-5 w-5" />,
        },
        {
          title: 'Next Due',
          value: currentInvoice ? formatDate(currentInvoice.dueDate) : '—',
          change: currentInvoice ? fmt(currentInvoice.total) : '—',
          changeType: currentInvoice?.status === 'Pending' ? 'warning' : 'neutral',
          icon: <Calendar className="h-5 w-5" />,
        },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 rounded-lg border border-border bg-card p-6">
          <h3 className="mb-4">Billing History</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={v => `$${(v / 1000).toFixed(1)}k`}
              />
              <Tooltip
                formatter={(value: number) => [fmt(value), 'Amount']}
                contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}
              />
              <Bar dataKey="amount" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Current plan card */}
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h3>Current Plan</h3>
          <div className="rounded-lg bg-primary/10 p-4 text-center">
            <p className="text-2xl font-bold text-primary">{currentInvoice?.plan || 'Professional'}</p>
            <p className="text-muted-foreground text-sm mt-1">{currentInvoice?.seats || 0} seats</p>
            <p className="text-3xl font-bold mt-2">{currentInvoice ? fmt(currentInvoice.total) : '—'}</p>
            <p className="text-xs text-muted-foreground">per month (incl. tax)</p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Seats</span>
              <span>{currentInvoice?.seats || 0} × {fmt(currentInvoice?.pricePerSeat || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{currentInvoice ? fmt(currentInvoice.subtotal) : '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax (8%)</span>
              <span>{currentInvoice ? fmt(currentInvoice.tax) : '—'}</span>
            </div>
            <div className="flex justify-between font-semibold border-t border-border pt-2">
              <span>Total</span>
              <span>{currentInvoice ? fmt(currentInvoice.total) : '—'}</span>
            </div>
          </div>
          <Button className="w-full" variant="outline" size="sm">
            Upgrade Plan
          </Button>
        </div>
      </div>

      {/* Invoices table */}
      <div className="mt-6 rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3>Invoice History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Invoice</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Period</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Due</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Seats</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Total</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && billingInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                    <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2" />
                    Loading invoices…
                  </td>
                </tr>
              ) : (
                billingInvoices.map((inv, i) => {
                  const cfg = STATUS_CONFIG[inv.status];
                  return (
                    <tr
                      key={inv.id}
                      className={`border-b border-border last:border-0 hover:bg-muted/20 transition-colors cursor-pointer ${
                        selected === inv.id ? 'bg-muted/30' : i % 2 === 0 ? '' : 'bg-muted/10'
                      }`}
                      onClick={() => setSelected(selected === inv.id ? null : inv.id)}
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-sm font-medium text-primary">{inv.invoiceNumber}</span>
                      </td>
                      <td className="px-4 py-3 text-sm">{inv.period}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(inv.date)}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(inv.dueDate)}</td>
                      <td className="px-4 py-3 text-right text-sm">{inv.seats}</td>
                      <td className="px-4 py-3 text-right text-sm font-semibold">{fmt(inv.total)}</td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge type={cfg.type}>{inv.status}</StatusBadge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {inv.downloadUrl ? (
                          <button className="text-xs text-primary hover:underline flex items-center gap-1 mx-auto">
                            <Download className="h-3 w-3" />
                            PDF
                          </button>
                        ) : inv.status === 'Pending' ? (
                          <Button size="sm" variant="outline" className="text-xs h-7">
                            Pay Now
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border">
        <p className="text-xs text-muted-foreground">
          <strong>Service Layer ✓</strong> — Invoices from <code className="font-mono">useFinanceData().billingInvoices</code>.
          Seat-based pricing: {currentInvoice?.seats || 0} seats × {fmt(currentInvoice?.pricePerSeat || 35)}/seat/month.
        </p>
      </div>
    </PageLayout>
  );
}
