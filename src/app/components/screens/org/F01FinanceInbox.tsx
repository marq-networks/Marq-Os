import { PageLayout } from '../../shared/PageLayout';
import { Button } from '../../ui/button';
import { useToast } from '../../ui/toast';
import { Inbox, Clock, CheckCircle2, XCircle, FileText, AlertCircle, User, Calendar, DollarSign, Receipt } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useFinanceData, type FinanceInboxItem, type OfflineSyncRecord, type Reimbursement } from '../../../services';
import { FinanceSubNav } from './FinanceSubNav';

export function F01FinanceInbox() {
  const { showToast } = useToast();
  const {
    reimbursements,
    financeInbox,
    offlineSyncRecords,
    loading,
    approveReimbursement,
    rejectReimbursement,
    actionInboxItem,
  } = useFinanceData();

  const [activeTab, setActiveTab] = useState<'approvals' | 'imports' | 'logic'>('approvals');
  const [selectedApprovalId, setSelectedApprovalId] = useState<string | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const pendingApprovals = useMemo(
    () => reimbursements.filter(item => item.status === 'Pending'),
    [reimbursements],
  );
  const importReviews = useMemo(
    () => offlineSyncRecords.filter(item => item.status === 'Failed' || item.status === 'Pending' || item.status === 'Syncing'),
    [offlineSyncRecords],
  );
  const logicOverrides = useMemo(
    () => financeInbox.filter(item => item.type === 'alert' || item.type === 'payment_due'),
    [financeInbox],
  );
  const selectedApproval = useMemo(
    () => pendingApprovals.find(item => item.id === selectedApprovalId) ?? pendingApprovals[0] ?? null,
    [pendingApprovals, selectedApprovalId],
  );

  useEffect(() => {
    if (!selectedApprovalId && pendingApprovals.length > 0) {
      setSelectedApprovalId(pendingApprovals[0].id);
    }
    if (selectedApprovalId && !pendingApprovals.some(item => item.id === selectedApprovalId)) {
      setSelectedApprovalId(pendingApprovals[0]?.id ?? null);
    }
  }, [pendingApprovals, selectedApprovalId]);

  const handleApprove = async (item: Reimbursement) => {
    setIsApproving(true);
    try {
      await approveReimbursement(item.id, 'Finance Admin');
      setSelectedApprovalId(null);
      showToast('success', 'Expense Approved', `$${item.amount.toLocaleString()} approved and posted to ledger`);
    } catch {
      showToast('error', 'Approval Failed', 'Unable to approve this reimbursement');
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async (item: Reimbursement) => {
    if (!rejectionReason.trim()) {
      showToast('warning', 'Reason Required', 'Please provide a reason for rejection');
      return;
    }

    setIsRejecting(true);
    try {
      await rejectReimbursement(item.id, 'Finance Admin', rejectionReason);
      setSelectedApprovalId(null);
      setRejectionReason('');
      showToast('info', 'Expense Rejected', `Submitter will be notified: ${rejectionReason}`);
    } catch {
      showToast('error', 'Rejection Failed', 'Unable to reject this reimbursement');
    } finally {
      setIsRejecting(false);
    }
  };

  const handleBulkApprove = async () => {
    const lowPriorityItems = pendingApprovals.filter(item => item.amount <= 500);

    if (lowPriorityItems.length === 0) {
      showToast('warning', 'No Items', 'No low-value items available for bulk approval');
      return;
    }

    try {
      await Promise.all(lowPriorityItems.map(item => approveReimbursement(item.id, 'Finance Admin')));
      showToast('success', 'Bulk Approved', `${lowPriorityItems.length} low-value expenses approved`);
    } catch {
      showToast('error', 'Bulk Approval Failed', 'Some reimbursements could not be approved');
    }
  };

  const handleActionItem = async (item: FinanceInboxItem) => {
    try {
      await actionInboxItem(item.id);
      showToast('success', 'Item Actioned', `${item.title} marked as handled`);
    } catch {
      showToast('error', 'Action Failed', 'Unable to update this inbox item');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
      case 'high': return 'text-red-600 dark:text-red-400 bg-red-500/10';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-500/10';
      case 'low': return 'text-green-600 dark:text-green-400 bg-green-500/10';
      default: return 'text-muted-foreground';
    }
  };

  const getApprovalPriority = (item: Reimbursement) => {
    if (item.amount >= 5000) return 'high';
    if (item.amount >= 1000) return 'medium';
    return 'low';
  };

  return (
    <PageLayout
      title="ORG – F-01 – Finance Inbox"
      description="Review and approve expenses, imports, and financial actions"
      subNav={<FinanceSubNav />}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleBulkApprove}>
            Bulk Approve Low Value
          </Button>
        </div>
      }
      kpis={[
        {
          title: 'Pending Approvals',
          value: loading ? '...' : pendingApprovals.length.toString(),
          change: 'Reimbursements',
          icon: <Clock className="h-5 w-5" />
        },
        {
          title: 'Import Reviews',
          value: loading ? '...' : importReviews.length.toString(),
          change: 'Sync exceptions',
          icon: <FileText className="h-5 w-5" />
        },
        {
          title: 'Total Items',
          value: loading ? '...' : (pendingApprovals.length + importReviews.length + logicOverrides.length).toString(),
          change: 'Needs your attention',
          icon: <Inbox className="h-5 w-5" />
        },
      ]}
    >
      <div className="space-y-6">
        <div className="flex gap-2 border-b border-border">
          <button
            onClick={() => setActiveTab('approvals')}
            className={`px-4 py-2 -mb-px border-b-2 transition-colors ${
              activeTab === 'approvals'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Expense Approvals</span>
              {pendingApprovals.length > 0 && (
                <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                  {pendingApprovals.length}
                </span>
              )}
            </div>
          </button>

          <button
            onClick={() => setActiveTab('imports')}
            className={`px-4 py-2 -mb-px border-b-2 transition-colors ${
              activeTab === 'imports'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Import Reviews</span>
              {importReviews.length > 0 && (
                <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                  {importReviews.length}
                </span>
              )}
            </div>
          </button>

          <button
            onClick={() => setActiveTab('logic')}
            className={`px-4 py-2 -mb-px border-b-2 transition-colors ${
              activeTab === 'logic'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>Logic Overrides</span>
              {logicOverrides.length > 0 && (
                <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                  {logicOverrides.length}
                </span>
              )}
            </div>
          </button>
        </div>

        {activeTab === 'approvals' && (
          <div className="space-y-4">
            {pendingApprovals.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">All Caught Up!</h3>
                <p className="text-muted-foreground">
                  No pending reimbursement approvals. New submissions will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  {pendingApprovals.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedApprovalId(item.id)}
                      className={`bg-card border rounded-lg p-4 cursor-pointer transition-all hover:border-primary/50 ${
                        selectedApproval?.id === item.id ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full uppercase font-medium ${getPriorityColor(getApprovalPriority(item))}`}>
                              {getApprovalPriority(item)}
                            </span>
                            {item.receiptUrl && (
                              <Receipt className="h-3 w-3 text-green-600 dark:text-green-400" />
                            )}
                          </div>
                          <p className="font-medium text-sm mb-1">{item.description}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>{item.employeeName}</span>
                            <span>•</span>
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(item.submittedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-lg">
                            ${item.amount.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.department}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {item.category}
                        </span>
                        <span className="text-green-600 dark:text-green-400">
                          {item.receiptUrl ? '✓ Receipt attached' : 'No receipt'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-card border border-border rounded-lg p-6 sticky top-4">
                  {selectedApproval ? (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Expense Details</h3>
                        <p className="text-sm text-muted-foreground">
                          Review and approve or reject this reimbursement
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                          <span className="text-sm text-muted-foreground">Amount</span>
                          <span className="text-2xl font-bold">
                            ${selectedApproval.amount.toLocaleString()}
                          </span>
                        </div>

                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Submitted By</span>
                            <span className="font-medium">{selectedApproval.employeeName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Department</span>
                            <span className="font-medium">{selectedApproval.department}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Expense Type</span>
                            <span className="font-medium">{selectedApproval.category}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Date</span>
                            <span className="font-medium">
                              {new Date(selectedApproval.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Status</span>
                            <span className="font-medium">{selectedApproval.status}</span>
                          </div>
                        </div>

                        <div className="p-4 bg-muted/30 rounded-lg">
                          <p className="text-sm font-medium mb-1">Description</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedApproval.description}
                          </p>
                        </div>

                        {selectedApproval.receiptUrl && (
                          <a
                            href={selectedApproval.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors text-sm"
                          >
                            <Receipt className="h-4 w-4 text-primary" />
                            <span className="flex-1">Open receipt</span>
                          </a>
                        )}
                      </div>

                      <div className="space-y-3 pt-4 border-t border-border">
                        <Button
                          onClick={() => handleApprove(selectedApproval)}
                          disabled={isApproving || isRejecting}
                          className="w-full"
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          {isApproving ? 'Approving...' : 'Approve & Post'}
                        </Button>

                        <div className="space-y-2">
                          <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Reason for rejection (required)..."
                            rows={3}
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                          <Button
                            onClick={() => handleReject(selectedApproval)}
                            disabled={isApproving || isRejecting || !rejectionReason.trim()}
                            variant="outline"
                            className="w-full border-red-500/50 text-red-600 dark:text-red-400 hover:bg-red-500/10"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            {isRejecting ? 'Rejecting...' : 'Reject Expense'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Inbox className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Select an expense to review</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'imports' && (
          <div className="space-y-4">
            {importReviews.map((imp: OfflineSyncRecord) => (
              <div key={imp.id} className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold mb-1">{imp.employeeName}</h3>
                    <p className="text-sm text-muted-foreground">{imp.recordType} • {imp.department}</p>
                  </div>
                  <Button size="sm" variant="outline">Review Sync</Button>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Records</p>
                    <p className="font-medium">{imp.recordCount}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Status</p>
                    <p className="font-medium text-yellow-600 dark:text-yellow-400">{imp.status}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Device</p>
                    <p className="font-medium">{imp.deviceName ?? 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Last Attempt</p>
                    <p className="font-medium">{new Date(imp.lastSyncAttempt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'logic' && (
          <div className="space-y-4">
            {logicOverrides.map((item) => (
              <div key={item.id} className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                      <h3 className="font-semibold">{item.title}</h3>
                    </div>
                    <p className="text-sm mb-2">{item.description}</p>
                    <p className="text-xs text-muted-foreground">
                      Submitted by {item.submittedBy ?? 'System'} • {new Date(item.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    {item.amount !== undefined && (
                      <p className="text-2xl font-bold">${item.amount.toLocaleString()}</p>
                    )}
                    <p className="text-xs text-muted-foreground">{item.priority}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleActionItem(item)}>Mark Actioned</Button>
                  <Button size="sm" variant="outline">Review</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
