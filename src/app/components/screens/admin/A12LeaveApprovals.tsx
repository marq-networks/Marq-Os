/**
 * A12 - Leave Approvals
 * Now wired to the Time Service for live CRUD data.
 */

import { useState } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { DataTable } from '../../shared/DataTable';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { CheckCircle, XCircle, FileText, Clock, RefreshCw } from 'lucide-react';
import { useTimeData } from '../../../services';

export function A12LeaveApprovals() {
  const { leaveRequests, approveLeave, rejectLeave, loading, refresh } = useTimeData();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Compute KPIs from live data
  const pending = leaveRequests.filter(lr => lr.status === 'Pending');
  const approved = leaveRequests.filter(lr => lr.status === 'Approved');
  const rejected = leaveRequests.filter(lr => lr.status === 'Rejected');
  const approvalRate = leaveRequests.length > 0
    ? Math.round((approved.length / leaveRequests.length) * 100)
    : 0;

  // Map to table data
  const tableData = leaveRequests.map(lr => ({
    id: lr.id,
    employee: lr.employeeName,
    department: lr.department,
    type: lr.type,
    startDate: lr.startDate,
    endDate: lr.endDate,
    days: lr.days,
    reason: lr.reason,
    status: lr.status,
    submittedAt: lr.submittedAt ? new Date(lr.submittedAt).toLocaleDateString() : '—',
  }));

  const handleApprove = async (id: string) => {
    try {
      await approveLeave(id, 'Admin User');
    } catch { /* handled by service */ }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectLeave(id, 'Insufficient balance');
    } catch { /* handled by service */ }
  };

  const columns = [
    { key: 'employee', header: 'Employee', width: '15%' },
    { key: 'department', header: 'Dept', width: '10%' },
    { key: 'type', header: 'Type', width: '10%' },
    { key: 'startDate', header: 'Start', width: '10%' },
    { key: 'endDate', header: 'End', width: '10%' },
    { key: 'days', header: 'Days', width: '6%' },
    { key: 'reason', header: 'Reason', width: '17%' },
    {
      key: 'status',
      header: 'Status',
      width: '10%',
      cell: (value: string) => (
        <StatusBadge type={value === 'Approved' ? 'success' : value === 'Pending' ? 'warning' : value === 'Rejected' ? 'error' : 'neutral'}>
          {value}
        </StatusBadge>
      ),
    },
    {
      key: 'id',
      header: 'Actions',
      width: '12%',
      cell: (value: string) => {
        const lr = leaveRequests.find(l => l.id === value);
        if (!lr || lr.status !== 'Pending') return null;
        return (
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => handleApprove(value)}>
              <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
              Approve
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => handleReject(value)}>
              <XCircle className="h-3 w-3 mr-1 text-red-600" />
              Reject
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <PageLayout
      title="Leave Approvals"
      description="Review and approve pending leave requests"
      actions={
        <Button variant="outline" size="sm" onClick={refresh} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      }
      kpis={[
        {
          title: 'Pending Approval',
          value: String(pending.length),
          change: pending.length > 0 ? 'Require review' : 'All clear',
          changeType: pending.length > 0 ? 'warning' : 'positive',
          icon: <Clock className="h-5 w-5" />,
        },
        {
          title: 'Approved',
          value: String(approved.length),
          icon: <CheckCircle className="h-5 w-5" />,
        },
        {
          title: 'Rejected',
          value: String(rejected.length),
          icon: <XCircle className="h-5 w-5" />,
        },
        {
          title: 'Approval Rate',
          value: `${approvalRate}%`,
          change: 'Overall',
          changeType: approvalRate >= 80 ? 'positive' : 'neutral',
          icon: <FileText className="h-5 w-5" />,
        },
      ]}
    >
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="mb-4">All Leave Requests</h3>
        {loading ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">Loading leave requests...</div>
        ) : (
          <DataTable columns={columns} data={tableData} />
        )}
      </div>
    </PageLayout>
  );
}
