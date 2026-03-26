import { Button } from '../../ui/button';
import { useToast } from '../../ui/toast';
import { CheckCircle2, XCircle, AlertCircle, Receipt, Eye, MessageSquare, Calendar, DollarSign, User, Building } from 'lucide-react';
import { useState } from 'react';

interface ApprovalDetailDrawerProps {
  approvalId: string;
  type: 'expense' | 'import' | 'revision' | 'payroll';
  onClose: () => void;
  onApprove?: () => void;
  onReject?: () => void;
}

export function A03ApprovalDetailDrawer({ approvalId, type, onClose, onApprove, onReject }: ApprovalDetailDrawerProps) {
  const { showToast } = useToast();
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [comment, setComment] = useState('');

  // Mock data based on type
  const expenseData = {
    id: approvalId,
    requester: 'John Smith',
    requesterEmail: 'john.smith@company.com',
    amount: 450.00,
    narration: 'Client meeting dinner - Acme Corp',
    date: '2026-01-01',
    department: 'Sales',
    client: 'Acme Corporation',
    account: 'Business Credit Card',
    world: 'business',
    billable: true,
    hasReceipt: true,
    receiptUrl: '#',
    suggestedCategory: 'Client Entertainment',
    confidence: 94,
    submittedAt: '2026-01-01T18:30:00Z',
    linkedProject: 'Acme Onboarding',
    paymentMode: 'Personal Card (Reimbursable)',
    comments: [
      {
        author: 'John Smith',
        text: 'Dinner meeting with Acme Corp decision makers. Discussed Q1 project scope.',
        timestamp: '2026-01-01T18:30:00Z'
      }
    ]
  };

  const importData = {
    id: approvalId,
    account: 'Chase Business Checking',
    rowCount: 45,
    duplicates: 2,
    autoMatched: 38,
    needsReview: 5,
    totalAmount: 12450.00,
    dateRange: 'Dec 1-31, 2025',
    riskFlags: [
      'Unknown payee detected: 3 transactions',
      'ATM withdrawals: 2 transactions'
    ],
    submittedAt: '2026-01-01T08:00:00Z',
    requester: 'Finance Bot'
  };

  const revisionData = {
    id: approvalId,
    transactionId: 'TXN-00234',
    requester: 'Sarah Chen',
    requesterEmail: 'sarah.chen@company.com',
    reason: 'Invoice shows this was for Adobe Creative Cloud, not office rent',
    submittedAt: '2025-12-31T16:20:00Z',
    before: {
      amount: 1200.00,
      narration: 'Monthly office expense',
      category: 'Office Rent',
      date: '2025-12-15',
      account: 'Business Credit Card'
    },
    after: {
      amount: 1200.00,
      narration: 'Adobe Creative Cloud - Annual subscription',
      category: 'Software Subscriptions',
      date: '2025-12-15',
      account: 'Business Credit Card'
    }
  };

  const handleApprove = async () => {
    setIsApproving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    showToast('success', 'Approved', `${type.charAt(0).toUpperCase() + type.slice(1)} approved and processed`);
    
    if (onApprove) onApprove();
    setTimeout(() => onClose(), 1000);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      showToast('warning', 'Reason Required', 'Please provide a reason for rejection');
      return;
    }

    setIsRejecting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    showToast('info', 'Rejected', `Requester will be notified: ${rejectionReason}`);
    
    if (onReject) onReject();
    setTimeout(() => onClose(), 1000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl h-full bg-background border-l border-border overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {type === 'expense' && 'Expense Approval'}
                {type === 'import' && 'Import Batch Approval'}
                {type === 'revision' && 'Revision Approval'}
                {type === 'payroll' && 'Payroll Approval'}
              </h2>
              <p className="text-sm text-muted-foreground font-mono">{approvalId}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>

          {/* Expense Detail */}
          {type === 'expense' && (
            <>
              {/* Amount Card */}
              <div className="bg-gradient-to-br from-blue-500/10 to-transparent border-2 border-blue-500/20 rounded-xl p-6">
                <p className="text-sm text-muted-foreground mb-2">Expense Amount</p>
                <p className="text-4xl font-bold mb-4">{formatCurrency(expenseData.amount)}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Expense Date</p>
                    <p className="font-semibold">{formatDate(expenseData.date)}</p>
                  </div>
                  <div className="bg-card/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Submitted</p>
                    <p className="font-semibold">{formatDate(expenseData.submittedAt)}</p>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Requester</p>
                  <p className="font-semibold">{expenseData.requester}</p>
                  <p className="text-xs text-muted-foreground mt-1">{expenseData.requesterEmail}</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Department</p>
                  <p className="font-semibold">{expenseData.department}</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Payment Mode</p>
                  <p className="font-semibold">{expenseData.paymentMode}</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Account/World</p>
                  <p className="font-semibold">{expenseData.account}</p>
                  <p className="text-xs text-primary mt-1">World: {expenseData.world}</p>
                </div>
              </div>

              {/* Narration */}
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="font-medium">{expenseData.narration}</p>
              </div>

              {/* Client & Project */}
              {expenseData.client && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Client</p>
                      <p className="font-semibold">{expenseData.client}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Linked Project</p>
                      <p className="font-semibold">{expenseData.linkedProject}</p>
                    </div>
                  </div>
                  {expenseData.billable && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-3">✓ Billable to client</p>
                  )}
                </div>
              )}

              {/* AI Classification */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold mb-3">AI Classification Suggestion</h3>
                <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-semibold">{expenseData.suggestedCategory}</p>
                      <p className="text-xs text-muted-foreground">Confidence: {expenseData.confidence}%</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Edit Classification</Button>
                </div>
              </div>

              {/* Receipt */}
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-3">Receipt</p>
                {expenseData.hasReceipt ? (
                  <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Receipt className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <span className="font-medium">Receipt attached</span>
                    </div>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View Receipt
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <span className="text-sm text-red-600 dark:text-red-400">No receipt attached</span>
                  </div>
                )}
              </div>

              {/* Comment Thread */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Comments</h3>
                <div className="space-y-3 mb-4">
                  {expenseData.comments.map((comment, idx) => (
                    <div key={idx} className="bg-muted/30 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium text-sm">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">• {formatDate(comment.timestamp)}</span>
                      </div>
                      <p className="text-sm">{comment.text}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm"
                  />
                  <Button size="sm">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Impact Preview */}
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <h3 className="font-semibold mb-3">If Approved, This Will:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
                    <span>Post ${formatCurrency(expenseData.amount)} to {expenseData.suggestedCategory}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
                    <span>Create reimbursement entry for {expenseData.requester}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
                    <span>Update {expenseData.department} department budget</span>
                  </li>
                  {expenseData.billable && (
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
                      <span>Mark billable to {expenseData.client}</span>
                    </li>
                  )}
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
                    <span>Notify {expenseData.requester} of approval</span>
                  </li>
                </ul>
              </div>
            </>
          )}

          {/* Import Detail */}
          {type === 'import' && (
            <>
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold mb-4">Import Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Account</p>
                    <p className="font-semibold">{importData.account}</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Date Range</p>
                    <p className="font-semibold">{importData.dateRange}</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Total Rows</p>
                    <p className="text-2xl font-bold">{importData.rowCount}</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                    <p className="text-2xl font-bold">{formatCurrency(importData.totalAmount)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold mb-4">Processing Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                    <span className="text-sm">Auto-matched transactions</span>
                    <span className="font-bold text-green-600 dark:text-green-400">{importData.autoMatched}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg">
                    <span className="text-sm">Needs review</span>
                    <span className="font-bold text-yellow-600 dark:text-yellow-400">{importData.needsReview}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg">
                    <span className="text-sm">Duplicates detected</span>
                    <span className="font-bold text-red-600 dark:text-red-400">{importData.duplicates}</span>
                  </div>
                </div>
              </div>

              {importData.riskFlags.length > 0 && (
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    Risk Flags
                  </h3>
                  <ul className="space-y-2">
                    {importData.riskFlags.map((flag, idx) => (
                      <li key={idx} className="text-sm text-orange-600 dark:text-orange-400">• {flag}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">View Review Queue</Button>
              </div>
            </>
          )}

          {/* Revision Detail */}
          {type === 'revision' && (
            <>
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold mb-4">Revision Request</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Requester</p>
                    <p className="font-semibold">{revisionData.requester}</p>
                    <p className="text-xs text-muted-foreground mt-1">{revisionData.requesterEmail}</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Transaction ID</p>
                    <p className="font-mono font-semibold">{revisionData.transactionId}</p>
                  </div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <p className="text-sm font-medium mb-1">Reason for Revision:</p>
                  <p className="text-sm">{revisionData.reason}</p>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold mb-4">Before / After Comparison</h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Before */}
                  <div className="border-2 border-red-500/20 rounded-lg p-4 bg-red-500/5">
                    <p className="text-sm font-semibold text-red-600 dark:text-red-400 mb-3">BEFORE</p>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Amount</p>
                        <p className="font-semibold">{formatCurrency(revisionData.before.amount)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Category</p>
                        <p className="font-semibold">{revisionData.before.category}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Narration</p>
                        <p className="text-sm">{revisionData.before.narration}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Date</p>
                        <p className="text-sm">{formatDate(revisionData.before.date)}</p>
                      </div>
                    </div>
                  </div>

                  {/* After */}
                  <div className="border-2 border-green-500/20 rounded-lg p-4 bg-green-500/5">
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400 mb-3">AFTER</p>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Amount</p>
                        <p className="font-semibold">{formatCurrency(revisionData.after.amount)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Category</p>
                        <p className="font-semibold">{revisionData.after.category}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Narration</p>
                        <p className="text-sm">{revisionData.after.narration}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Date</p>
                        <p className="text-sm">{formatDate(revisionData.after.date)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Rejection Form */}
          {showRejectForm && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Rejection Reason</h3>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                placeholder="Please provide a clear reason for rejection..."
                rows={4}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 sticky bottom-0 bg-background pt-4 border-t border-border">
            {!showRejectForm ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowRejectForm(true)}
                  className="flex-1"
                  disabled={isApproving}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={handleApprove}
                  disabled={isApproving}
                  className="flex-1"
                >
                  {isApproving ? (
                    'Approving...'
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Approve
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRejectForm(false);
                    setRejectionReason('');
                  }}
                  className="flex-1"
                  disabled={isRejecting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={isRejecting}
                  className="flex-1"
                >
                  {isRejecting ? 'Rejecting...' : 'Confirm Rejection'}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
