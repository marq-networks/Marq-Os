import { useState, useMemo } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import {
  Inbox, Search, X, CheckCircle2, Clock, DollarSign, FileText, Eye, Archive,
} from 'lucide-react';

interface FinanceInboxItem {
  id: string;
  type: 'invoice' | 'expense' | 'reimbursement' | 'payment' | 'approval';
  title: string;
  from: string;
  amount: number;
  date: string;
  status: 'New' | 'Reviewed' | 'Actioned';
  priority: 'high' | 'medium' | 'low';
  description: string;
}

const ITEMS: FinanceInboxItem[] = [
  { id: 'fi1', type: 'invoice', title: 'Invoice #INV-2026-0312', from: 'CloudHost Pro', amount: 4800, date: '2026-03-04', status: 'New', priority: 'high', description: 'Monthly cloud infrastructure hosting - March 2026' },
  { id: 'fi2', type: 'expense', title: 'Travel Expense Claim', from: 'Sarah Johnson', amount: 1250, date: '2026-03-03', status: 'New', priority: 'medium', description: 'Client visit to NYC - flights, hotel, meals' },
  { id: 'fi3', type: 'reimbursement', title: 'Software License', from: 'Michael Chen', amount: 299, date: '2026-03-03', status: 'New', priority: 'low', description: 'Annual JetBrains IDE license renewal' },
  { id: 'fi4', type: 'approval', title: 'Budget Increase Request', from: 'Emily Rodriguez', amount: 15000, date: '2026-03-02', status: 'New', priority: 'high', description: 'Q2 marketing budget increase for campaign launch' },
  { id: 'fi5', type: 'payment', title: 'Vendor Payment Due', from: 'Design Agency Co', amount: 8500, date: '2026-03-01', status: 'Reviewed', priority: 'high', description: 'Website redesign phase 2 - milestone payment' },
  { id: 'fi6', type: 'expense', title: 'Office Supplies', from: 'Admin Team', amount: 450, date: '2026-03-01', status: 'Reviewed', priority: 'low', description: 'Monthly office supplies and equipment' },
  { id: 'fi7', type: 'invoice', title: 'Invoice #INV-2026-0298', from: 'Legal Partners LLP', amount: 3200, date: '2026-02-28', status: 'Actioned', priority: 'medium', description: 'Legal consultation - contract review' },
  { id: 'fi8', type: 'reimbursement', title: 'Conference Ticket', from: 'Robert Taylor', amount: 799, date: '2026-02-27', status: 'Actioned', priority: 'low', description: 'ReactConf 2026 attendance fee' },
];

const TYPE_ICON: Record<string, typeof Inbox> = {
  invoice: FileText, expense: DollarSign, reimbursement: DollarSign,
  payment: DollarSign, approval: CheckCircle2,
};
const TYPE_COLOR: Record<string, string> = {
  invoice: 'bg-blue-500/10 text-blue-600', expense: 'bg-orange-500/10 text-orange-600',
  reimbursement: 'bg-green-500/10 text-green-600', payment: 'bg-purple-500/10 text-purple-600',
  approval: 'bg-yellow-500/10 text-yellow-600',
};

export function FinanceInbox() {
  const [items, setItems] = useState(ITEMS);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = useMemo(() => items.filter(i => {
    const matchSearch = !search || i.title.toLowerCase().includes(search.toLowerCase()) || i.from.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || i.type === typeFilter;
    return matchSearch && matchType;
  }), [items, search, typeFilter]);

  const newCount = items.filter(i => i.status === 'New').length;
  const totalAmount = items.filter(i => i.status === 'New').reduce((s, i) => s + i.amount, 0);

  const handleAction = (id: string, action: 'review' | 'archive') => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: action === 'review' ? 'Reviewed' as const : 'Actioned' as const } : i));
  };

  return (
    <PageLayout
      title="Finance Inbox"
      description="Incoming financial requests, invoices, and items requiring attention"
      kpis={[
        { title: 'New Items', value: newCount, change: 'Needs review', changeType: newCount > 0 ? 'warning' : 'positive', icon: <Inbox className="h-5 w-5" /> },
        { title: 'Pending Amount', value: `$${totalAmount.toLocaleString()}`, changeType: 'neutral', icon: <DollarSign className="h-5 w-5" /> },
        { title: 'Reviewed', value: items.filter(i => i.status === 'Reviewed').length, changeType: 'info', icon: <Eye className="h-5 w-5" /> },
        { title: 'Actioned', value: items.filter(i => i.status === 'Actioned').length, changeType: 'positive', icon: <CheckCircle2 className="h-5 w-5" /> },
      ]}
    >
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search inbox..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
          <option value="all">All Types</option>
          <option value="invoice">Invoices</option>
          <option value="expense">Expenses</option>
          <option value="reimbursement">Reimbursements</option>
          <option value="payment">Payments</option>
          <option value="approval">Approvals</option>
        </select>
        {(search || typeFilter !== 'all') && (
          <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setTypeFilter('all'); }}>
            <X className="h-4 w-4 mr-1" /> Clear
          </Button>
        )}
      </div>

      <div className="rounded-lg border border-border bg-card divide-y divide-border">
        {filtered.map(item => {
          const Icon = TYPE_ICON[item.type] || Inbox;
          return (
            <div key={item.id} className={`flex items-start gap-4 p-4 hover:bg-muted/30 transition-colors ${item.status === 'New' ? 'bg-primary/[0.02]' : ''}`}>
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${TYPE_COLOR[item.type]}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  {item.status === 'New' && <div className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />}
                  <span className="font-medium text-sm">{item.title}</span>
                  {item.priority === 'high' && <StatusBadge type="danger">Urgent</StatusBadge>}
                </div>
                <p className="text-xs text-muted-foreground mb-1">{item.description}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>From: {item.from}</span>
                  <span>{item.date}</span>
                  <span className={`px-1.5 py-0.5 rounded ${TYPE_COLOR[item.type]}`}>{item.type}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-medium">${item.amount.toLocaleString()}</p>
                <StatusBadge type={item.status === 'New' ? 'warning' : item.status === 'Reviewed' ? 'info' : 'success'}>
                  {item.status}
                </StatusBadge>
              </div>
              {item.status !== 'Actioned' && (
                <div className="flex flex-col gap-1 shrink-0">
                  {item.status === 'New' && (
                    <Button size="sm" variant="ghost" onClick={() => handleAction(item.id, 'review')}>
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => handleAction(item.id, 'archive')}>
                    <Archive className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </PageLayout>
  );
}
