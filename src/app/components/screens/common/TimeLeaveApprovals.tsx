import { useState } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { useTimeData } from '../../../services/hooks';
import {
  CheckCircle2, XCircle, Clock, AlertTriangle, Calendar,
  PlaneTakeoff, Thermometer, User,
} from 'lucide-react';
import type { LeaveRequest } from '../../../services/types';

const STATUS_MAP: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = {
  Pending: 'warning', Approved: 'success', Rejected: 'danger', Cancelled: 'neutral',
};

const LEAVE_TYPE_COLOR: Record<string, string> = {
  Vacation: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  'Sick Leave': 'bg-red-500/10 text-red-700 dark:text-red-400',
  Personal: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
  Parental: 'bg-green-500/10 text-green-700 dark:text-green-400',
};

export function TimeLeaveApprovals() {
  const { leaveRequests, loading, approveLeave, rejectLeave } = useTimeData();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [tab, setTab] = useState<'pending' | 'all'>('pending');

  const pending = leaveRequests.filter(lr => lr.status === 'Pending');
  const display = tab === 'pending' ? pending : leaveRequests;

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    await approveLeave(id, 'Alex Rivera');
    setProcessingId(null);
  };

  const handleReject = async (id: string) => {
    const reason = window.prompt('Reason for rejection:');
    if (!reason) return;
    setProcessingId(id);
    await rejectLeave(id, reason);
    setProcessingId(null);
  };

  const renderLeaveCard = (lr: LeaveRequest) => (
    <div key={lr.id} className="rounded-lg border border-border bg-card p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm text-primary">
            {lr.employeeName.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h4 className="font-medium">{lr.employeeName}</h4>
            <p className="text-sm text-muted-foreground">{lr.department}</p>
          </div>
        </div>
        <StatusBadge type={STATUS_MAP[lr.status] || 'neutral'}>{lr.status}</StatusBadge>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="rounded-md bg-muted/30 p-3">
          <p className="text-xs text-muted-foreground mb-1">Type</p>
          <span className={`inline-flex items-center gap-1.5 text-sm px-2 py-0.5 rounded-full ${LEAVE_TYPE_COLOR[lr.type] || 'bg-muted'}`}>
            {lr.type === 'Vacation' && <PlaneTakeoff className="h-3 w-3" />}
            {lr.type === 'Sick Leave' && <Thermometer className="h-3 w-3" />}
            {lr.type === 'Personal' && <User className="h-3 w-3" />}
            {lr.type}
          </span>
        </div>
        <div className="rounded-md bg-muted/30 p-3">
          <p className="text-xs text-muted-foreground mb-1">Duration</p>
          <p className="text-sm font-medium">{lr.days} day{lr.days > 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
        <Calendar className="h-3.5 w-3.5" />
        <span>
          {new Date(lr.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          {lr.startDate !== lr.endDate && ` — ${new Date(lr.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-1">Reason</p>
        <p className="text-sm">{lr.reason}</p>
      </div>

      <div className="text-xs text-muted-foreground mb-3">
        Submitted {new Date(lr.submittedAt).toLocaleDateString()}
        {lr.approvedBy && ` &middot; Approved by ${lr.approvedBy}`}
      </div>

      {lr.status === 'Pending' && (
        <div className="flex gap-2 pt-3 border-t border-border">
          <Button size="sm" onClick={() => handleApprove(lr.id)} disabled={processingId === lr.id}>
            <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
            Approve
          </Button>
          <Button size="sm" variant="destructive" onClick={() => handleReject(lr.id)} disabled={processingId === lr.id}>
            <XCircle className="mr-1.5 h-3.5 w-3.5" />
            Reject
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <PageLayout
      title="Leave Approvals"
      description="Review and approve or reject employee leave requests"
      kpis={[
        { title: 'Pending', value: pending.length, change: pending.length > 0 ? 'Action needed' : 'All clear', changeType: pending.length > 0 ? 'warning' : 'positive', icon: <AlertTriangle className="h-5 w-5" /> },
        { title: 'Approved', value: leaveRequests.filter(lr => lr.status === 'Approved').length, changeType: 'positive', icon: <CheckCircle2 className="h-5 w-5" /> },
        { title: 'Rejected', value: leaveRequests.filter(lr => lr.status === 'Rejected').length, changeType: 'danger', icon: <XCircle className="h-5 w-5" /> },
        { title: 'Total Days Requested', value: leaveRequests.reduce((s, lr) => s + lr.days, 0), change: 'Across all requests', changeType: 'neutral', icon: <Clock className="h-5 w-5" /> },
      ]}
    >
      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-border">
        <button
          onClick={() => setTab('pending')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === 'pending' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Pending ({pending.length})
        </button>
        <button
          onClick={() => setTab('all')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === 'all' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          All Requests ({leaveRequests.length})
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-56 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : display.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="font-medium text-lg mb-2">
            {tab === 'pending' ? 'No pending requests' : 'No leave requests'}
          </h3>
          <p className="text-sm">
            {tab === 'pending' ? 'All leave requests have been reviewed.' : 'No leave requests have been submitted yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {display.map(renderLeaveCard)}
        </div>
      )}
    </PageLayout>
  );
}
