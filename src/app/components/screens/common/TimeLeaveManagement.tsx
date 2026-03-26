import { useState, useMemo } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { DataTable } from '../../shared/DataTable';
import { StatusBadge } from '../../shared/StatusBadge';
import { FormDrawer } from '../../shared/FormDrawer';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { useTimeData, usePeopleData } from '../../../services/hooks';
import {
  Calendar, Plus, PlaneTakeoff, Thermometer, User, Clock, Search, X,
} from 'lucide-react';
import type { LeaveRequest } from '../../../services/types';

const STATUS_MAP: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = {
  Pending: 'warning', Approved: 'success', Rejected: 'danger', Cancelled: 'neutral',
};

const LEAVE_ICONS: Record<string, typeof PlaneTakeoff> = {
  Vacation: PlaneTakeoff, 'Sick Leave': Thermometer, Personal: User,
  Parental: User, Bereavement: User, Unpaid: Clock,
};

export function TimeLeaveManagement() {
  const { leaveRequests, loading, submitLeaveRequest, cancelLeave } = useTimeData();
  const { employees } = usePeopleData();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState({
    employeeId: 'e1', employeeName: 'Sarah Johnson', department: 'Product',
    type: 'Vacation' as LeaveRequest['type'],
    startDate: '', endDate: '', reason: '',
  });

  const filtered = useMemo(() => {
    return leaveRequests.filter(lr => {
      const matchSearch = !search ||
        lr.employeeName.toLowerCase().includes(search.toLowerCase()) ||
        lr.department.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === 'all' || lr.type === typeFilter;
      const matchStatus = statusFilter === 'all' || lr.status === statusFilter;
      return matchSearch && matchType && matchStatus;
    });
  }, [leaveRequests, search, typeFilter, statusFilter]);

  const handleSubmit = async () => {
    const days = Math.ceil(
      (new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;
    await submitLeaveRequest({
      employeeId: form.employeeId,
      employeeName: form.employeeName,
      department: form.department,
      type: form.type,
      startDate: form.startDate,
      endDate: form.endDate,
      days: Math.max(1, days),
      reason: form.reason,
    });
    setDrawerOpen(false);
  };

  const handleCancel = async (id: string) => {
    if (window.confirm('Cancel this leave request?')) {
      await cancelLeave(id);
    }
  };

  const pendingCount = leaveRequests.filter(lr => lr.status === 'Pending').length;
  const totalDaysOff = leaveRequests.filter(lr => lr.status === 'Approved').reduce((s, lr) => s + lr.days, 0);

  const columns = [
    {
      key: 'employeeName',
      header: 'Employee',
      cell: (_: any, row: LeaveRequest) => (
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
      header: 'Type',
      cell: (val: string) => {
        const Icon = LEAVE_ICONS[val] || Calendar;
        return (
          <span className="inline-flex items-center gap-1.5 text-sm">
            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
            {val}
          </span>
        );
      },
    },
    {
      key: 'startDate',
      header: 'Period',
      cell: (_: any, row: LeaveRequest) => (
        <span className="text-sm">
          {new Date(row.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          {row.startDate !== row.endDate && ` — ${new Date(row.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
        </span>
      ),
    },
    {
      key: 'days',
      header: 'Days',
      cell: (val: number) => <span className="font-medium">{val}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (val: string) => <StatusBadge type={STATUS_MAP[val] || 'neutral'}>{val}</StatusBadge>,
    },
    {
      key: 'reason',
      header: 'Reason',
      cell: (val: string) => (
        <span className="text-sm text-muted-foreground max-w-[200px] truncate block">{val}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      cell: (_: any, row: LeaveRequest) => row.status === 'Pending' ? (
        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleCancel(row.id); }}>
          Cancel
        </Button>
      ) : null,
    },
  ];

  // Leave balance cards
  const balances = [
    { type: 'Vacation', total: 20, used: 7, color: 'bg-blue-500' },
    { type: 'Sick Leave', total: 10, used: 2, color: 'bg-red-400' },
    { type: 'Personal', total: 5, used: 1, color: 'bg-purple-500' },
    { type: 'Parental', total: 30, used: 0, color: 'bg-green-500' },
  ];

  return (
    <PageLayout
      title="Leave Management"
      description="Request and track leave, view balances, and manage time off"
      actions={
        <Button size="sm" onClick={() => setDrawerOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Request Leave
        </Button>
      }
      kpis={[
        { title: 'Pending Requests', value: pendingCount, change: 'Awaiting approval', changeType: pendingCount > 0 ? 'warning' : 'positive', icon: <Clock className="h-5 w-5" /> },
        { title: 'Total Requests', value: leaveRequests.length, change: 'All time', changeType: 'neutral', icon: <Calendar className="h-5 w-5" /> },
        { title: 'Days Approved', value: totalDaysOff, change: 'Total days off granted', changeType: 'neutral', icon: <Calendar className="h-5 w-5" /> },
        { title: 'Vacation Balance', value: '13 days', change: '7 used of 20', changeType: 'neutral', icon: <PlaneTakeoff className="h-5 w-5" /> },
      ]}
    >
      {/* Leave Balances */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {balances.map(b => (
          <div key={b.type} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{b.type}</span>
              <span className="text-sm font-medium">{b.total - b.used} left</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${b.color}`}
                style={{ width: `${(b.used / b.total) * 100}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground mt-1">{b.used} / {b.total} days used</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">All Types</option>
          <option value="Vacation">Vacation</option>
          <option value="Sick Leave">Sick Leave</option>
          <option value="Personal">Personal</option>
          <option value="Parental">Parental</option>
        </select>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
        {(search || typeFilter !== 'all' || statusFilter !== 'all') && (
          <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setTypeFilter('all'); setStatusFilter('all'); }}>
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

      <FormDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Request Leave"
        description="Submit a new leave request for approval"
        onSubmit={handleSubmit}
        submitLabel="Submit Request"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Leave Type *</label>
            <select
              value={form.type}
              onChange={e => setForm(f => ({ ...f, type: e.target.value as LeaveRequest['type'] }))}
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="Vacation">Vacation</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Personal">Personal</option>
              <option value="Parental">Parental</option>
              <option value="Bereavement">Bereavement</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">Start Date *</label>
              <Input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">End Date *</label>
              <Input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Reason *</label>
            <textarea
              value={form.reason}
              onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
              className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
              placeholder="Provide a reason for your leave request..."
            />
          </div>
        </div>
      </FormDrawer>
    </PageLayout>
  );
}
