import { useState, useMemo } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { DataTable } from '../../shared/DataTable';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { useFinanceData } from '../../../services/hooks';
import {
  Receipt, Search, Plus, X, DollarSign, CheckCircle2, Clock, Send, Download,
} from 'lucide-react';
import type { BillingInvoice } from '../../../services/types';

const STATUS_TYPE: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
  Paid: 'success', Pending: 'warning', Overdue: 'danger', Sent: 'info', Draft: 'neutral',
};

export function FinanceBilling() {
  const { billingInvoices, loading } = useFinanceData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => billingInvoices.filter(inv => {
    const matchSearch = !search || inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) || inv.clientName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchSearch && matchStatus;
  }), [billingInvoices, search, statusFilter]);

  const totalBilled = billingInvoices.reduce((s, i) => s + i.amount, 0);
  const paidAmount = billingInvoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0);
  const pendingAmount = billingInvoices.filter(i => i.status === 'Pending' || i.status === 'Sent').reduce((s, i) => s + i.amount, 0);
  const overdueAmount = billingInvoices.filter(i => i.status === 'Overdue').reduce((s, i) => s + i.amount, 0);

  const fmt = (v: number) => `$${v.toLocaleString()}`;

  const columns = [
    {
      key: 'invoiceNumber', header: 'Invoice',
      cell: (val: string) => <span className="font-mono text-sm text-primary">{val}</span>,
    },
    {
      key: 'clientName', header: 'Client',
      cell: (val: string) => <span className="font-medium text-sm">{val}</span>,
    },
    {
      key: 'amount', header: 'Amount',
      cell: (val: number) => <span className="font-medium tabular-nums">{fmt(val)}</span>,
    },
    {
      key: 'issueDate', header: 'Issued',
      cell: (val: string) => <span className="text-xs text-muted-foreground">{val}</span>,
    },
    {
      key: 'dueDate', header: 'Due',
      cell: (val: string) => <span className="text-xs text-muted-foreground">{val}</span>,
    },
    {
      key: 'status', header: 'Status',
      cell: (val: string) => <StatusBadge type={STATUS_TYPE[val] || 'neutral'}>{val}</StatusBadge>,
    },
    {
      key: 'actions', header: '',
      cell: (_: any, row: BillingInvoice) => (
        <div className="flex gap-1">
          {row.status === 'Draft' && (
            <Button size="sm" variant="ghost"><Send className="h-3.5 w-3.5" /></Button>
          )}
          <Button size="sm" variant="ghost"><Download className="h-3.5 w-3.5" /></Button>
        </div>
      ),
    },
  ];

  return (
    <PageLayout
      title="Billing & Invoicing"
      description="Create, send, and track invoices and billing records"
      actions={<Button size="sm"><Plus className="mr-2 h-4 w-4" /> New Invoice</Button>}
      kpis={[
        { title: 'Total Billed', value: `$${(totalBilled / 1000).toFixed(0)}K`, change: `${billingInvoices.length} invoices`, changeType: 'neutral', icon: <Receipt className="h-5 w-5" /> },
        { title: 'Collected', value: `$${(paidAmount / 1000).toFixed(0)}K`, changeType: 'positive', icon: <CheckCircle2 className="h-5 w-5" /> },
        { title: 'Pending', value: fmt(pendingAmount), changeType: pendingAmount > 0 ? 'warning' : 'positive', icon: <Clock className="h-5 w-5" /> },
        { title: 'Overdue', value: fmt(overdueAmount), changeType: overdueAmount > 0 ? 'danger' : 'positive', icon: <DollarSign className="h-5 w-5" /> },
      ]}
    >
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search invoices..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
          <option value="all">All Statuses</option>
          {['Draft', 'Sent', 'Pending', 'Paid', 'Overdue'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {(search || statusFilter !== 'all') && (
          <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setStatusFilter('all'); }}>
            <X className="h-4 w-4 mr-1" /> Clear
          </Button>
        )}
        <span className="ml-auto text-sm text-muted-foreground">{filtered.length} invoices</span>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-muted animate-pulse rounded-lg" />)}</div>
      ) : (
        <DataTable columns={columns} data={filtered} />
      )}
    </PageLayout>
  );
}
