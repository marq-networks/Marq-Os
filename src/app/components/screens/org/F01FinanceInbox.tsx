import { PageLayout } from '../../shared/PageLayout';
import { Button } from '../../ui/button';
import { useToast } from '../../ui/toast';
import { Inbox, Clock, CheckCircle2, XCircle, FileText, AlertCircle, User, Calendar, DollarSign, Receipt, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { mockApprovalQueue, mockFinanceInboxSummary, mockReviewQueue, mockStatementImports } from '../finance/mockData';
import { ApprovalQueueItem } from '../finance/types';
import { FinanceSubNav } from './FinanceSubNav';

export function F01FinanceInbox() {
  const { showToast } = useToast();
  const [approvalQueue, setApprovalQueue] = useState(mockApprovalQueue);
  const [activeTab, setActiveTab] = useState<'approvals' | 'imports' | 'revisions' | 'logic'>('approvals');
  const [selectedItem, setSelectedItem] = useState<ApprovalQueueItem | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = async (item: ApprovalQueueItem) => {
    setIsApproving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setApprovalQueue(prev => prev.filter(i => i.id !== item.id));
    setSelectedItem(null);
    setIsApproving(false);
    
    showToast('success', 'Expense Approved', `$${item.amount.toLocaleString()} approved and posted to ledger`);
  };

  const handleReject = async (item: ApprovalQueueItem) => {
    if (!rejectionReason.trim()) {
      showToast('warning', 'Reason Required', 'Please provide a reason for rejection');
      return;
    }

    setIsRejecting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setApprovalQueue(prev => prev.filter(i => i.id !== item.id));
    setSelectedItem(null);
    setRejectionReason('');
    setIsRejecting(false);
    
    showToast('info', 'Expense Rejected', `Submitter will be notified: ${rejectionReason}`);
  };

  const handleBulkApprove = async () => {
    const lowPriorityItems = approvalQueue.filter(i => i.priority === 'low' && i.hasReceipt);
    
    if (lowPriorityItems.length === 0) {
      showToast('warning', 'No Items', 'No low-priority items with receipts to bulk approve');
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setApprovalQueue(prev => prev.filter(i => i.priority !== 'low' || !i.hasReceipt));
    
    showToast('success', 'Bulk Approved', `${lowPriorityItems.length} low-priority expenses approved`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400 bg-red-500/10';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-500/10';
      case 'low': return 'text-green-600 dark:text-green-400 bg-green-500/10';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <PageLayout
      title="ORG – F-01 – Finance Inbox"
      description="Review and approve expenses, imports, and financial actions"
      subNav={<FinanceSubNav />}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleBulkApprove}>
            Bulk Approve Low Priority
          </Button>
        </div>
      }
      kpis={[
        {
          title: 'Pending Approvals',
          value: mockFinanceInboxSummary.pendingApprovals.toString(),
          change: 'Expenses',
          icon: <Clock className="h-5 w-5" />
        },
        {
          title: 'Import Reviews',
          value: mockFinanceInboxSummary.importReviews.toString(),
          change: 'Bank statements',
          icon: <FileText className="h-5 w-5" />
        },
        {
          title: 'Total Items',
          value: mockFinanceInboxSummary.totalItems.toString(),
          change: 'Needs your attention',
          icon: <Inbox className="h-5 w-5" />
        },
      ]}
    >
      <div className="space-y-6">
        {/* Tabs */}
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
              {mockFinanceInboxSummary.pendingApprovals > 0 && (
                <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                  {mockFinanceInboxSummary.pendingApprovals}
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
              {mockFinanceInboxSummary.importReviews > 0 && (
                <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                  {mockFinanceInboxSummary.importReviews}
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
              {mockFinanceInboxSummary.logicOverrides > 0 && (
                <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                  {mockFinanceInboxSummary.logicOverrides}
                </span>
              )}
            </div>
          </button>
        </div>

        {/* Approval Queue Content */}
        {activeTab === 'approvals' && (
          <div className="space-y-4">
            {approvalQueue.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">All Caught Up!</h3>
                <p className="text-muted-foreground">
                  No pending expense approvals. New submissions will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Queue List */}
                <div className="space-y-3">
                  {approvalQueue.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={`bg-card border rounded-lg p-4 cursor-pointer transition-all hover:border-primary/50 ${
                        selectedItem?.id === item.id ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full uppercase font-medium ${getPriorityColor(item.priority)}`}>
                              {item.priority}
                            </span>
                            {item.hasReceipt && (
                              <Receipt className="h-3 w-3 text-green-600 dark:text-green-400" />
                            )}
                          </div>
                          <p className="font-medium text-sm mb-1">{item.transaction.narration}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>{item.submittedByName}</span>
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
                            {item.transaction.departmentName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {item.transaction.expenseTypeName}
                        </span>
                        {item.transaction.isBillable && (
                          <span className="text-green-600 dark:text-green-400">
                            ✓ Billable
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Detail Panel */}
                <div className="bg-card border border-border rounded-lg p-6 sticky top-4">
                  {selectedItem ? (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Expense Details</h3>
                        <p className="text-sm text-muted-foreground">
                          Review and approve or reject this expense
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                          <span className="text-sm text-muted-foreground">Amount</span>
                          <span className="text-2xl font-bold">
                            ${selectedItem.amount.toLocaleString()}
                          </span>
                        </div>

                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Submitted By</span>
                            <span className="font-medium">{selectedItem.submittedByName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Department</span>
                            <span className="font-medium">{selectedItem.transaction.departmentName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Expense Type</span>
                            <span className="font-medium">{selectedItem.transaction.expenseTypeName}</span>
                          </div>
                          {selectedItem.transaction.clientName && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Client</span>
                              <span className="font-medium">{selectedItem.transaction.clientName}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Billable</span>
                            <span className={selectedItem.transaction.isBillable ? 'text-green-600 dark:text-green-400 font-medium' : 'text-muted-foreground'}>
                              {selectedItem.transaction.isBillable ? 'Yes' : 'No'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Date</span>
                            <span className="font-medium">
                              {new Date(selectedItem.transaction.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Account</span>
                            <span className="font-medium">{selectedItem.transaction.accountName}</span>
                          </div>
                        </div>

                        <div className="p-4 bg-muted/30 rounded-lg">
                          <p className="text-sm font-medium mb-1">Description</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedItem.transaction.narration}
                          </p>
                        </div>

                        {selectedItem.transaction.receiptUrls && selectedItem.transaction.receiptUrls.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2">Receipts</p>
                            <div className="space-y-2">
                              {selectedItem.transaction.receiptUrls.map((url, idx) => (
                                <a
                                  key={idx}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors text-sm"
                                >
                                  <Receipt className="h-4 w-4 text-primary" />
                                  <span className="flex-1">Receipt {idx + 1}</span>
                                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3 pt-4 border-t border-border">
                        <Button
                          onClick={() => handleApprove(selectedItem)}
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
                            onClick={() => handleReject(selectedItem)}
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

        {/* Import Reviews Tab */}
        {activeTab === 'imports' && (
          <div className="space-y-4">
            {mockStatementImports.filter(i => i.status === 'review').map((imp) => (
              <div key={imp.id} className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold mb-1">{imp.fileName}</h3>
                    <p className="text-sm text-muted-foreground">{imp.accountName}</p>
                  </div>
                  <Button size="sm">Review Matches</Button>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Total Rows</p>
                    <p className="font-medium">{imp.totalRows}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Matched</p>
                    <p className="font-medium text-green-600 dark:text-green-400">{imp.matchedRows}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Needs Review</p>
                    <p className="font-medium text-yellow-600 dark:text-yellow-400">{imp.reviewRows}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Duplicates</p>
                    <p className="font-medium text-muted-foreground">{imp.duplicatesFound}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Logic Overrides Tab */}
        {activeTab === 'logic' && (
          <div className="space-y-4">
            {mockReviewQueue.slice(0, 1).map((item) => (
              <div key={item.id} className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                      <h3 className="font-semibold">AI Confidence Too Low</h3>
                    </div>
                    <p className="text-sm mb-2">{item.narration}</p>
                    <p className="text-xs text-muted-foreground">{item.reason}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">${item.amount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{item.accountName}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Review & Classify</Button>
                  <Button size="sm" variant="outline">Skip</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}