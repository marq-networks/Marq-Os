/**
 * A11 - LEAVE MANAGEMENT
 * Wired to service layer: useTimeData() → leaveRequests, approveLeave, rejectLeave
 */

import { useState } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { DataTable } from '../../shared/DataTable';
import { StatusBadge, StatusType } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { Umbrella, CheckCircle, XCircle, Filter, Search, Calendar } from 'lucide-react';
import { useTimeData } from '../../../services';
import type { LeaveRequest } from '../../../services';
import { toast } from 'sonner';

export function A11LeaveManagement() {
  const { leaveRequests, approveLeave, rejectLeave, loading } = useTimeData();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const filtered = leaveRequests.filter(lr => {
    const matchStatus = filterStatus === 'all' || lr.status === filterStatus;
    const matchType = filterType === 'all' || lr.type === filterType;
    const matchSearch =
      searchQuery === '' ||
      lr.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lr.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchType && matchSearch;
  });

  // KPIs
  const pending = leaveRequests.filter(l => l.status === 'Pending').length;
  const approved = leaveRequests.filter(l => l.status === 'Approved').length;
  const rejected = leaveRequests.filter(l => l.status === 'Rejected').length;
  const totalDays = leaveRequests
    .filter(l => l.status === 'Approved')
    .reduce((sum, l) => sum + l.days, 0);

  const leaveTypes = Array.from(new Set(leaveRequests.map(l => l.type))).sort();

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await approveLeave(id, 'admin@company.com');
      toast.success('Leave request approved');
    } catch {
      toast.error('Failed to approve leave');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    try {
      await rejectLeave(id, 'Reviewed and denied by management');
      toast.success('Leave request rejected');
    } catch {
      toast.error('Failed to reject leave');
    } finally {
      setProcessingId(null);
    }
  };

  const columns = [
    {
      key: 'employeeName',
      header: 'Employee',
      width: '20%',
      cell: (value: string, row: LeaveRequest) => (
        <div>
          <div className="font-medium text-sm">{value}</div>
          <div className="text-xs text-muted-foreground">{row.department}</div>
        </div>
      ),
    },
    { key: 'type', header: 'Leave Type', width: '15%' },
    {
      key: 'startDate',
      header: 'Start',
      width: '12%',
      cell: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'endDate',
      header: 'End',
      width: '12%',
      cell: (value: string) => new Date(value).toLocaleDateString(),
    },
    { key: 'days', header: 'Days', width: '7%' },
    {
      key: 'status',
      header: 'Status',
      width: '13%',
      cell: (value: string) => {
        const type: StatusType =
          value === 'Approved'
            ? 'success'
            : value === 'Pending'
            ? 'warning'
            : value === 'Rejected'
            ? 'error'
            : 'neutral';
        return <StatusBadge type={type}>{value}</StatusBadge>;
      },
    },
    { key: 'reason', header: 'Reason', width: '15%' },
    {
      key: 'actions',
      header: '',
      width: '13%',
      cell: (_: any, row: LeaveRequest) =>
        row.status === 'Pending' ? (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-green-600"
              disabled={processingId === row.id}
              onClick={() => handleApprove(row.id)}
            >
              <CheckCircle className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-red-600"
              disabled={processingId === row.id}
              onClick={() => handleReject(row.id)}
            >
              <XCircle className="h-3.5 w-3.5" />
            </Button>
          </div>
        ) : null,
    },
  ];

  return (
    <PageLayout
      title="Leave Management"
      description="View and manage all employee leave requests organization-wide"
      kpis={[
        {
          title: 'Pending Review',
          value: String(pending),
          change: 'Awaiting decision',
          changeType: pending > 0 ? 'negative' : 'positive',
          icon: <Umbrella className="h-5 w-5" />,
        },
        {
          title: 'Approved',
          value: String(approved),
          change: `${totalDays} total days`,
          changeType: 'positive',
          icon: <CheckCircle className="h-5 w-5" />,
        },
        {
          title: 'Rejected',
          value: String(rejected),
          icon: <XCircle className="h-5 w-5" />,
        },
        {
          title: 'Total Requests',
          value: String(leaveRequests.length),
          icon: <Calendar className="h-5 w-5" />,
        },
      ]}
    >
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            className="pl-8 pr-3 py-1.5 rounded-md border border-border bg-background text-sm w-full focus:outline-none focus:ring-1 focus:ring-ring"
            placeholder="Search by employee or department…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="rounded-md border border-border bg-background text-sm px-2.5 py-1.5"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <select
          className="rounded-md border border-border bg-background text-sm px-2.5 py-1.5"
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
        >
          <option value="all">All Leave Types</option>
          {leaveTypes.map(t => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40 text-muted-foreground">
          Loading leave requests…
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card">
          <DataTable columns={columns} data={filtered} />
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Umbrella className="h-10 w-10 mb-2" />
              <p>No leave requests match the current filters.</p>
            </div>
          )}
        </div>
      )}
    </PageLayout>
  );
}
