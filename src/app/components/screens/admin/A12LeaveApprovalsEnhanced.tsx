import { PageLayout } from '../../shared/PageLayout';
import { DataTable } from '../../shared/DataTable';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { FormDrawer } from '../../shared/FormDrawer';
import { FormField, Input, TextArea, Select, APIDoc } from '../../ui/form';
import { ConfirmModal } from '../../ui/modal';
import { EmptyState } from '../../shared/EmptyState';
import { ErrorBanner } from '../../shared/ErrorState';
import { useToast } from '../../ui/toast';
import { 
  Calendar, 
  Plus, 
  Download, 
  Filter, 
  Check, 
  X, 
  Eye,
  AlertCircle,
  Clock
} from 'lucide-react';
import { useState } from 'react';

interface LeaveRequest {
  id: string;
  employeeName: string;
  department: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedDate: string;
  reason: string;
}

const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeName: 'Sarah Johnson',
    department: 'Engineering',
    leaveType: 'Vacation',
    startDate: '2025-01-15',
    endDate: '2025-01-20',
    days: 5,
    status: 'Pending',
    submittedDate: '2025-01-05',
    reason: 'Family vacation to the mountains'
  },
  {
    id: '2',
    employeeName: 'Michael Chen',
    department: 'Marketing',
    leaveType: 'Sick Leave',
    startDate: '2025-01-10',
    endDate: '2025-01-12',
    days: 2,
    status: 'Pending',
    submittedDate: '2025-01-09',
    reason: 'Medical appointment and recovery'
  },
  {
    id: '3',
    employeeName: 'Emma Davis',
    department: 'Sales',
    leaveType: 'Personal',
    startDate: '2025-01-08',
    endDate: '2025-01-08',
    days: 1,
    status: 'Approved',
    submittedDate: '2025-01-02',
    reason: 'Personal matters'
  },
];

export function A12LeaveApprovalsEnhanced() {
  const { showToast } = useToast();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [requests, setRequests] = useState(mockLeaveRequests);
  const [showError, setShowError] = useState(false);
  
  // Detail drawer
  const [detailDrawer, setDetailDrawer] = useState<{ isOpen: boolean; request?: LeaveRequest }>({ 
    isOpen: false 
  });

  // Action modals
  const [approveModal, setApproveModal] = useState<{ 
    isOpen: boolean; 
    requestId?: string;
    isProcessing?: boolean; 
  }>({ isOpen: false });
  
  const [rejectModal, setRejectModal] = useState<{ 
    isOpen: boolean; 
    requestId?: string;
    reason: string;
  }>({ isOpen: false, reason: '' });

  const handleViewDetails = (request: LeaveRequest) => {
    setDetailDrawer({ isOpen: true, request });
  };

  const handleApprove = async (requestId: string) => {
    setApproveModal({ ...approveModal, isProcessing: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update request status
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'Approved' as const } : req
    ));
    
    setApproveModal({ isOpen: false });
    setDetailDrawer({ isOpen: false });
    
    showToast(
      'success',
      'Leave request approved',
      'Employee has been notified via email'
    );

    // Simulate audit log creation
    setTimeout(() => {
      showToast('info', 'Audit log created', 'Action recorded in system logs');
    }, 500);
  };

  const handleReject = async (requestId: string) => {
    if (!rejectModal.reason.trim()) {
      showToast('error', 'Reason required', 'Please provide a reason for rejection');
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update request status
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'Rejected' as const } : req
    ));
    
    setRejectModal({ isOpen: false, reason: '' });
    setDetailDrawer({ isOpen: false });
    
    showToast(
      'warning',
      'Leave request rejected',
      'Employee has been notified with the reason'
    );
  };

  const handleBulkApprove = async () => {
    if (selectedRows.length === 0) return;

    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setRequests(prev => prev.map(req => 
      selectedRows.includes(req.id) && req.status === 'Pending' 
        ? { ...req, status: 'Approved' as const } 
        : req
    ));
    
    setSelectedRows([]);
    showToast('success', 'Bulk approval complete', `${selectedRows.length} requests approved`);
  };

  const columns = [
    { 
      key: 'employeeName', 
      header: 'Employee', 
      width: '20%',
      cell: (value: string, row: LeaveRequest) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-xs text-muted-foreground">{row.department}</div>
        </div>
      )
    },
    { 
      key: 'leaveType', 
      header: 'Type', 
      width: '12%',
      cell: (value: string) => (
        <StatusBadge type="info">{value}</StatusBadge>
      )
    },
    { 
      key: 'startDate', 
      header: 'Start Date', 
      width: '12%',
      cell: (value: string) => new Date(value).toLocaleDateString()
    },
    { 
      key: 'endDate', 
      header: 'End Date', 
      width: '12%',
      cell: (value: string) => new Date(value).toLocaleDateString()
    },
    { 
      key: 'days', 
      header: 'Days', 
      width: '8%',
      cell: (value: number) => `${value} day${value > 1 ? 's' : ''}`
    },
    { 
      key: 'status', 
      header: 'Status', 
      width: '12%',
      cell: (value: string) => {
        const types = {
          'Pending': 'warning' as const,
          'Approved': 'success' as const,
          'Rejected': 'danger' as const,
        };
        return <StatusBadge type={types[value as keyof typeof types]}>{value}</StatusBadge>;
      }
    },
    {
      key: 'actions',
      header: '',
      width: '24%',
      cell: (value: any, row: LeaveRequest) => (
        <div className="flex items-center justify-end gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleViewDetails(row)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          {row.status === 'Pending' && (
            <>
              <Button 
                size="sm"
                onClick={() => setApproveModal({ isOpen: true, requestId: row.id })}
              >
                <Check className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => setRejectModal({ isOpen: true, requestId: row.id, reason: '' })}
              >
                <X className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </>
          )}
        </div>
      )
    }
  ];

  const pendingCount = requests.filter(r => r.status === 'Pending').length;
  const approvedCount = requests.filter(r => r.status === 'Approved').length;
  const rejectedCount = requests.filter(r => r.status === 'Rejected').length;

  return (
    <>
      <PageLayout
        title="ADMIN – A-12 – Leave Approvals – v1.2"
        description="Review and approve employee leave requests"
        actions={
          <>
            {selectedRows.length > 0 && (
              <Button onClick={handleBulkApprove}>
                <Check className="mr-2 h-4 w-4" />
                Approve Selected ({selectedRows.length})
              </Button>
            )}
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </>
        }
        kpis={[
          {
            title: 'Pending Requests',
            value: pendingCount.toString(),
            change: 'Needs attention',
            changeType: pendingCount > 0 ? 'warning' : 'positive',
            icon: <Clock className="h-5 w-5" />
          },
          {
            title: 'Approved This Month',
            value: approvedCount.toString(),
            icon: <Check className="h-5 w-5" />
          },
          {
            title: 'Rejected',
            value: rejectedCount.toString(),
            icon: <X className="h-5 w-5" />
          },
          {
            title: 'Total Requests',
            value: requests.length.toString(),
            icon: <Calendar className="h-5 w-5" />
          },
        ]}
      >
        {showError && (
          <ErrorBanner
            message="Failed to load leave requests. Please try again."
            onDismiss={() => setShowError(false)}
            onRetry={() => window.location.reload()}
          />
        )}

        {pendingCount > 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-start gap-3 mb-6">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                {pendingCount} pending request{pendingCount > 1 ? 's' : ''} require{pendingCount === 1 ? 's' : ''} your attention
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                Please review and respond within 48 hours to maintain service standards
              </p>
            </div>
          </div>
        )}

        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-4">Leave Requests</h3>
          <DataTable 
            columns={columns} 
            data={requests}
            selectable
            selectedRows={selectedRows}
            onRowSelect={(id) => {
              const request = requests.find(r => r.id === id);
              if (request?.status === 'Pending') {
                setSelectedRows(prev => 
                  prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
                );
              }
            }}
            onSelectAll={() => {
              const pendingIds = requests.filter(r => r.status === 'Pending').map(r => r.id);
              setSelectedRows(selectedRows.length === pendingIds.length ? [] : pendingIds);
            }}
          />
        </div>
      </PageLayout>

      {/* Request Detail Drawer */}
      {detailDrawer.request && (
        <FormDrawer
          isOpen={detailDrawer.isOpen}
          onClose={() => setDetailDrawer({ isOpen: false })}
          title="Leave Request Details"
          description={`Submitted by ${detailDrawer.request.employeeName}`}
          onSubmit={() => {}}
          submitLabel="Close"
          apiDoc={
            <APIDoc
              method="PATCH"
              endpoint={`/api/leave/requests/${detailDrawer.request.id}`}
              payload={{
                status: "Approved | Rejected",
                reviewedBy: "admin_id",
                reviewNote: "string"
              }}
              response={{
                id: "string",
                status: "Approved",
                reviewedAt: "ISO8601",
                notificationSent: true
              }}
            />
          }
        >
          <div className="space-y-6">
            {/* Employee Info */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold mb-3">Employee Information</h4>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Name</dt>
                  <dd className="font-medium">{detailDrawer.request.employeeName}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Department</dt>
                  <dd className="font-medium">{detailDrawer.request.department}</dd>
                </div>
              </dl>
            </div>

            {/* Leave Details */}
            <div>
              <h4 className="font-semibold mb-3">Leave Details</h4>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Leave Type</dt>
                  <dd className="font-medium">{detailDrawer.request.leaveType}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Start Date</dt>
                  <dd className="font-medium">
                    {new Date(detailDrawer.request.startDate).toLocaleDateString()}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">End Date</dt>
                  <dd className="font-medium">
                    {new Date(detailDrawer.request.endDate).toLocaleDateString()}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Duration</dt>
                  <dd className="font-medium">{detailDrawer.request.days} days</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Submitted</dt>
                  <dd className="font-medium">
                    {new Date(detailDrawer.request.submittedDate).toLocaleDateString()}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Status</dt>
                  <dd>
                    <StatusBadge 
                      type={
                        detailDrawer.request.status === 'Pending' ? 'warning' :
                        detailDrawer.request.status === 'Approved' ? 'success' : 'danger'
                      }
                    >
                      {detailDrawer.request.status}
                    </StatusBadge>
                  </dd>
                </div>
              </dl>
            </div>

            {/* Reason */}
            <div>
              <h4 className="font-semibold mb-2">Reason</h4>
              <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-4">
                {detailDrawer.request.reason}
              </p>
            </div>

            {/* Actions */}
            {detailDrawer.request.status === 'Pending' && (
              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  className="flex-1"
                  onClick={() => {
                    setApproveModal({ isOpen: true, requestId: detailDrawer.request?.id });
                  }}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Approve Request
                </Button>
                <Button 
                  className="flex-1"
                  variant="destructive"
                  onClick={() => {
                    setRejectModal({ isOpen: true, requestId: detailDrawer.request?.id, reason: '' });
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Reject Request
                </Button>
              </div>
            )}
          </div>
        </FormDrawer>
      )}

      {/* Approve Confirmation */}
      <ConfirmModal
        isOpen={approveModal.isOpen}
        onClose={() => setApproveModal({ isOpen: false })}
        onConfirm={() => handleApprove(approveModal.requestId!)}
        title="Approve Leave Request"
        description="This will approve the leave request and notify the employee. The employee's leave balance will be updated automatically."
        confirmText="Approve"
        isLoading={approveModal.isProcessing}
      />

      {/* Reject Modal with Reason */}
      <FormDrawer
        isOpen={rejectModal.isOpen}
        onClose={() => setRejectModal({ isOpen: false, reason: '' })}
        title="Reject Leave Request"
        description="Please provide a reason for rejecting this request"
        onSubmit={() => handleReject(rejectModal.requestId!)}
        submitLabel="Reject Request"
        cancelLabel="Cancel"
      >
        <FormField
          label="Rejection Reason"
          name="reason"
          required
          helperText="This will be sent to the employee"
        >
          <TextArea
            id="reason"
            value={rejectModal.reason}
            onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
            placeholder="Please explain why this request cannot be approved..."
            rows={6}
          />
        </FormField>
      </FormDrawer>
    </>
  );
}
