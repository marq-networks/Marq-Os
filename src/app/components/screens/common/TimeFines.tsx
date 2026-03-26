import { useState, useMemo } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { DataTable } from '../../shared/DataTable';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { useTimeData } from '../../../services/hooks';
import {
  AlertTriangle, DollarSign, Search, Download, X, CheckCircle2, Ban, Scale,
} from 'lucide-react';
import type { Fine } from '../../../services/types';

const STATUS_MAP: Record<string, 'success' | 'warning' | 'danger' | 'neutral' | 'info'> = {
  Active: 'danger', Paid: 'success', Waived: 'info', Disputed: 'warning',
};

const TYPE_COLOR: Record<string, string> = {
  'Late Arrival': 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
  'Early Departure': 'bg-orange-500/10 text-orange-700 dark:text-orange-400',
  'Absent': 'bg-red-500/10 text-red-700 dark:text-red-400',
  'Break Violation': 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
  'Policy Violation': 'bg-red-600/10 text-red-800 dark:text-red-300',
};

export function TimeFines() {
  const { fines, loading, waiveFine } = useTimeData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = useMemo(() => {
    return fines.filter(f => {
      const matchSearch = !search ||
        f.employeeName.toLowerCase().includes(search.toLowerCase()) ||
        f.department.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || f.status === statusFilter;
      const matchType = typeFilter === 'all' || f.type === typeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }, [fines, search, statusFilter, typeFilter]);

  const handleWaive = async (id: string) => {
    const reason = window.prompt('Reason for waiving this fine:');
    if (!reason) return;
    await waiveFine(id, 'Alex Rivera', reason);
  };

  const totalActive = fines.filter(f => f.status === 'Active').reduce((s, f) => s + f.amount, 0);
  const totalCollected = fines.filter(f => f.status === 'Paid').reduce((s, f) => s + f.amount, 0);

  const columns = [
    {
      key: 'employeeName',
      header: 'Employee',
      cell: (_: any, row: Fine) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary">
            {row.employeeName.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="font-medium text-sm">{row.employeeName}</div>
            <div className="text-xs text-muted-foreground">{row.department}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Violation Type',
      cell: (val: string) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${TYPE_COLOR[val] || 'bg-muted'}`}>
          {val}
        </span>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      cell: (val: string) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    },
    {
      key: 'amount',
      header: 'Amount',
      cell: (_: any, row: Fine) => (
        <span className="font-medium">${row.amount} {row.currency}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (val: string) => <StatusBadge type={STATUS_MAP[val] || 'neutral'}>{val}</StatusBadge>,
    },
    {
      key: 'description',
      header: 'Description',
      cell: (val: string) => (
        <span className="text-sm text-muted-foreground max-w-[250px] truncate block">{val}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      cell: (_: any, row: Fine) => row.status === 'Active' ? (
        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleWaive(row.id); }}>
          <Scale className="h-3.5 w-3.5 mr-1" />
          Waive
        </Button>
      ) : null,
    },
  ];

  return (
    <PageLayout
      title="Fines Management"
      description="Track, manage, and waive employee fines and policy violations"
      actions={
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      }
      kpis={[
        { title: 'Total Fines', value: fines.length, change: `${fines.filter(f => f.status === 'Active').length} active`, changeType: fines.filter(f => f.status === 'Active').length > 0 ? 'danger' : 'positive', icon: <AlertTriangle className="h-5 w-5" /> },
        { title: 'Outstanding', value: `$${totalActive}`, change: 'Active fines total', changeType: 'danger', icon: <DollarSign className="h-5 w-5" /> },
        { title: 'Collected', value: `$${totalCollected}`, change: 'Paid fines total', changeType: 'positive', icon: <CheckCircle2 className="h-5 w-5" /> },
        { title: 'Disputed', value: fines.filter(f => f.status === 'Disputed').length, change: 'Pending review', changeType: 'warning', icon: <Scale className="h-5 w-5" /> },
      ]}
    >
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by employee..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">All Types</option>
          <option value="Late Arrival">Late Arrival</option>
          <option value="Early Departure">Early Departure</option>
          <option value="Absent">Absent</option>
          <option value="Break Violation">Break Violation</option>
          <option value="Policy Violation">Policy Violation</option>
        </select>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Paid">Paid</option>
          <option value="Waived">Waived</option>
          <option value="Disputed">Disputed</option>
        </select>
        {(search || statusFilter !== 'all' || typeFilter !== 'all') && (
          <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setStatusFilter('all'); setTypeFilter('all'); }}>
            <X className="h-4 w-4 mr-1" /> Clear
          </Button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          pagination={{
            page: 1, pageSize: 20, total: filtered.length, onPageChange: () => {},
          }}
        />
      )}
    </PageLayout>
  );
}
