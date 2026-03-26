import { useState, useMemo } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { DataTable } from '../../shared/DataTable';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import {
  Receipt, Search, Plus, X, DollarSign, CheckCircle2, Clock, AlertTriangle,
} from 'lucide-react';

interface Reimbursement {
  id: string; employee: string; department: string; category: string;
  description: string; amount: number; date: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Paid'; receiptCount: number;
}

const REIMBURSEMENTS: Reimbursement[] = [
  { id: 'RM-001', employee: 'Sarah Johnson', department: 'Product', category: 'Travel', description: 'Client visit to NYC - flights and hotel', amount: 1250, date: '2026-03-03', status: 'Pending', receiptCount: 4 },
  { id: 'RM-002', employee: 'Michael Chen', department: 'Engineering', category: 'Software', description: 'JetBrains annual license', amount: 299, date: '2026-03-02', status: 'Approved', receiptCount: 1 },
  { id: 'RM-003', employee: 'Anna Park', department: 'Engineering', category: 'Equipment', description: 'Standing desk for home office', amount: 650, date: '2026-03-01', status: 'Paid', receiptCount: 1 },
  { id: 'RM-004', employee: 'Robert Taylor', department: 'Engineering', category: 'Conference', description: 'ReactConf 2026 ticket', amount: 799, date: '2026-02-28', status: 'Paid', receiptCount: 1 },
  { id: 'RM-005', employee: 'David Kim', department: 'Marketing', category: 'Meals', description: 'Team lunch with vendors', amount: 180, date: '2026-02-27', status: 'Approved', receiptCount: 1 },
  { id: 'RM-006', employee: 'Lisa Anderson', department: 'HR', category: 'Travel', description: 'Recruiting event transport', amount: 320, date: '2026-02-25', status: 'Rejected', receiptCount: 2 },
  { id: 'RM-007', employee: 'James Wilson', department: 'Sales', category: 'Meals', description: 'Client dinner at DataCo', amount: 450, date: '2026-02-24', status: 'Pending', receiptCount: 1 },
];

const STATUS_TYPE: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
  Pending: 'warning', Approved: 'info', Rejected: 'danger', Paid: 'success',
};

export function FinanceReimbursements() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [items, setItems] = useState(REIMBURSEMENTS);

  const filtered = useMemo(() => items.filter(r => {
    const matchSearch = !search || r.employee.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  }), [items, search, statusFilter]);

  const pendingCount = items.filter(r => r.status === 'Pending').length;
  const pendingAmount = items.filter(r => r.status === 'Pending').reduce((s, r) => s + r.amount, 0);
  const paidTotal = items.filter(r => r.status === 'Paid').reduce((s, r) => s + r.amount, 0);

  const handleApprove = (id: string) => setItems(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' as const } : r));
  const handleReject = (id: string) => setItems(prev => prev.map(r => r.id === id ? { ...r, status: 'Rejected' as const } : r));

  const columns = [
    { key: 'id', header: 'ID', cell: (val: string) => <span className="text-xs font-mono text-primary">{val}</span> },
    {
      key: 'employee', header: 'Employee',
      cell: (_: any, row: Reimbursement) => (
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] text-primary">
            {row.employee.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <span className="text-sm font-medium">{row.employee}</span>
            <p className="text-xs text-muted-foreground">{row.department}</p>
          </div>
        </div>
      ),
    },
    { key: 'category', header: 'Category', cell: (val: string) => <span className="text-xs px-2 py-0.5 rounded-full bg-muted">{val}</span> },
    { key: 'description', header: 'Description', cell: (val: string) => <span className="text-sm truncate max-w-[200px] block">{val}</span> },
    { key: 'amount', header: 'Amount', cell: (val: number) => <span className="font-medium">${val.toLocaleString()}</span> },
    { key: 'date', header: 'Date', cell: (val: string) => <span className="text-xs text-muted-foreground">{val}</span> },
    { key: 'receiptCount', header: 'Receipts', cell: (val: number) => <span className="text-xs">{val}</span> },
    {
      key: 'status', header: 'Status',
      cell: (val: string) => <StatusBadge type={STATUS_TYPE[val] || 'neutral'}>{val}</StatusBadge>,
    },
    {
      key: 'actions', header: '',
      cell: (_: any, row: Reimbursement) => row.status === 'Pending' ? (
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" className="text-green-600 h-7 px-2" onClick={() => handleApprove(row.id)}>Approve</Button>
          <Button size="sm" variant="ghost" className="text-red-600 h-7 px-2" onClick={() => handleReject(row.id)}>Reject</Button>
        </div>
      ) : null,
    },
  ];

  return (
    <PageLayout
      title="Reimbursements"
      description="Manage employee expense reimbursement claims and approvals"
      actions={<Button size="sm"><Plus className="mr-2 h-4 w-4" /> New Claim</Button>}
      kpis={[
        { title: 'Pending', value: pendingCount, change: `$${pendingAmount.toLocaleString()}`, changeType: pendingCount > 0 ? 'warning' : 'positive', icon: <Clock className="h-5 w-5" /> },
        { title: 'Total Paid', value: `$${paidTotal.toLocaleString()}`, changeType: 'positive', icon: <DollarSign className="h-5 w-5" /> },
        { title: 'Total Claims', value: items.length, changeType: 'neutral', icon: <Receipt className="h-5 w-5" /> },
        { title: 'Rejected', value: items.filter(r => r.status === 'Rejected').length, changeType: 'neutral', icon: <AlertTriangle className="h-5 w-5" /> },
      ]}
    >
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search reimbursements..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
          <option value="all">All Statuses</option>
          {['Pending', 'Approved', 'Rejected', 'Paid'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {(search || statusFilter !== 'all') && (
          <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setStatusFilter('all'); }}>
            <X className="h-4 w-4 mr-1" /> Clear
          </Button>
        )}
      </div>
      <DataTable columns={columns} data={filtered} />
    </PageLayout>
  );
}
