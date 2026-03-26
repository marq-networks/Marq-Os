import { PageLayout } from '../../shared/PageLayout';
import { Button } from '../../ui/button';
import { Clock, CheckCircle2, XCircle, DollarSign, Receipt, Calendar, MessageSquare, Filter, Download, Eye } from 'lucide-react';
import { useState } from 'react';

interface ExpenseSubmission {
  id: string;
  date: string;
  amount: number;
  narration: string;
  department: string;
  client?: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  comments?: string;
  hasReceipt: boolean;
  billable: boolean;
  paymentMode: string;
  rejectionReason?: string;
}

export function M03MySubmissions() {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'paid'>('all');
  const [selectedExpense, setSelectedExpense] = useState<ExpenseSubmission | null>(null);

  // Mock data
  const submissions: ExpenseSubmission[] = [
    {
      id: 'EXP-008',
      date: '2026-01-01',
      amount: 450.00,
      narration: 'Client meeting dinner - Acme Corp',
      department: 'Sales',
      client: 'Acme Corporation',
      status: 'pending',
      submittedAt: '2026-01-01T18:30:00Z',
      hasReceipt: true,
      billable: true,
      paymentMode: 'Personal Card'
    },
    {
      id: 'EXP-007',
      date: '2025-12-30',
      amount: 85.00,
      narration: 'Office supplies - Notebooks and pens',
      department: 'Operations',
      status: 'pending',
      submittedAt: '2025-12-30T14:20:00Z',
      hasReceipt: true,
      billable: false,
      paymentMode: 'Personal Cash'
    },
    {
      id: 'EXP-006',
      date: '2025-12-28',
      amount: 125.50,
      narration: 'Uber to client site',
      department: 'Sales',
      client: 'TechStart Inc',
      status: 'approved',
      submittedAt: '2025-12-28T09:15:00Z',
      reviewedAt: '2025-12-29T10:30:00Z',
      reviewedBy: 'Sarah Chen (Finance Manager)',
      comments: 'Approved. Will be reimbursed in next payroll.',
      hasReceipt: true,
      billable: true,
      paymentMode: 'Personal Card'
    },
    {
      id: 'EXP-005',
      date: '2025-12-27',
      amount: 670.00,
      narration: 'Hotel - Business conference',
      department: 'Marketing',
      status: 'approved',
      submittedAt: '2025-12-27T20:00:00Z',
      reviewedAt: '2025-12-28T09:00:00Z',
      reviewedBy: 'Sarah Chen (Finance Manager)',
      hasReceipt: true,
      billable: false,
      paymentMode: 'Personal Card'
    },
    {
      id: 'EXP-004',
      date: '2025-12-20',
      amount: 320.00,
      narration: 'Team lunch - End of year celebration',
      department: 'Engineering',
      status: 'paid',
      submittedAt: '2025-12-20T16:00:00Z',
      reviewedAt: '2025-12-21T11:00:00Z',
      reviewedBy: 'Sarah Chen (Finance Manager)',
      comments: 'Approved and paid via Dec 31 payroll',
      hasReceipt: true,
      billable: false,
      paymentMode: 'Personal Card'
    },
    {
      id: 'EXP-003',
      date: '2025-12-15',
      amount: 95.00,
      narration: 'Parking at client office',
      department: 'Sales',
      client: 'Global Solutions Ltd',
      status: 'rejected',
      submittedAt: '2025-12-15T17:30:00Z',
      reviewedAt: '2025-12-16T10:00:00Z',
      reviewedBy: 'Sarah Chen (Finance Manager)',
      rejectionReason: 'Missing receipt. Please resubmit with parking receipt attached.',
      hasReceipt: false,
      billable: true,
      paymentMode: 'Personal Cash'
    },
    {
      id: 'EXP-002',
      date: '2025-12-10',
      amount: 540.00,
      narration: 'Software license - Adobe Creative Cloud',
      department: 'Marketing',
      status: 'paid',
      submittedAt: '2025-12-10T10:00:00Z',
      reviewedAt: '2025-12-11T09:00:00Z',
      reviewedBy: 'Sarah Chen (Finance Manager)',
      hasReceipt: true,
      billable: false,
      paymentMode: 'Personal Card'
    },
    {
      id: 'EXP-001',
      date: '2025-12-05',
      amount: 180.00,
      narration: 'Client meeting coffee and snacks',
      department: 'Sales',
      client: 'Innovation Labs',
      status: 'paid',
      submittedAt: '2025-12-05T15:00:00Z',
      reviewedAt: '2025-12-06T08:30:00Z',
      reviewedBy: 'Sarah Chen (Finance Manager)',
      hasReceipt: true,
      billable: true,
      paymentMode: 'Personal Card'
    }
  ];

  const filteredSubmissions = filterStatus === 'all' 
    ? submissions 
    : submissions.filter(s => s.status === filterStatus);

  const stats = {
    pending: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
    paid: submissions.filter(s => s.status === 'paid').length,
    totalPending: submissions.filter(s => s.status === 'pending').reduce((sum, s) => sum + s.amount, 0),
    totalApproved: submissions.filter(s => s.status === 'approved').reduce((sum, s) => sum + s.amount, 0)
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20">
            <Clock className="h-3 w-3" />
            Pending Approval
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
            <CheckCircle2 className="h-3 w-3" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
            <XCircle className="h-3 w-3" />
            Rejected
          </span>
        );
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <DollarSign className="h-3 w-3" />
            Paid
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <PageLayout
      title="TEAM – M-03 – My Submissions"
      description="Track your expense submissions and approval status"
      actions={
        <Button onClick={() => window.location.href = '/employee/money/submit-expense'}>
          <Receipt className="h-4 w-4 mr-2" />
          Submit New Expense
        </Button>
      }
      kpis={[
        {
          title: 'Pending Approval',
          value: stats.pending.toString(),
          change: formatCurrency(stats.totalPending),
          changeType: 'neutral',
          icon: <Clock className="h-5 w-5" />
        },
        {
          title: 'Approved',
          value: stats.approved.toString(),
          change: formatCurrency(stats.totalApproved),
          changeType: 'positive',
          icon: <CheckCircle2 className="h-5 w-5" />
        },
        {
          title: 'Rejected',
          value: stats.rejected.toString(),
          change: 'Needs resubmission',
          changeType: 'negative',
          icon: <XCircle className="h-5 w-5" />
        },
        {
          title: 'Paid',
          value: stats.paid.toString(),
          change: 'Reimbursed',
          changeType: 'positive',
          icon: <DollarSign className="h-5 w-5" />
        }
      ]}
    >
      <div className="space-y-6">
        {/* Filter Tabs */}
        <div className="bg-card border border-border rounded-lg p-2 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              filterStatus === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            }`}
          >
            All ({submissions.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              filterStatus === 'pending'
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            }`}
          >
            Pending ({stats.pending})
          </button>
          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              filterStatus === 'approved'
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            }`}
          >
            Approved ({stats.approved})
          </button>
          <button
            onClick={() => setFilterStatus('rejected')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              filterStatus === 'rejected'
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            }`}
          >
            Rejected ({stats.rejected})
          </button>
          <button
            onClick={() => setFilterStatus('paid')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              filterStatus === 'paid'
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            }`}
          >
            Paid ({stats.paid})
          </button>
        </div>

        {/* Submissions Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold">ID</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold">Date</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold">Description</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold">Department</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold">Amount</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold">Status</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold">Receipt</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((expense) => (
                  <tr
                    key={expense.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedExpense(expense)}
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-muted-foreground">{expense.id}</span>
                    </td>
                    <td className="px-6 py-4 text-sm">{formatDate(expense.date)}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{expense.narration}</p>
                        {expense.client && (
                          <p className="text-xs text-muted-foreground mt-1">Client: {expense.client}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{expense.department}</td>
                    <td className="px-6 py-4 text-right font-semibold">{formatCurrency(expense.amount)}</td>
                    <td className="px-6 py-4">{getStatusBadge(expense.status)}</td>
                    <td className="px-6 py-4 text-center">
                      {expense.hasReceipt ? (
                        <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                          <Receipt className="h-3 w-3" />
                          Yes
                        </span>
                      ) : (
                        <span className="text-xs text-red-600 dark:text-red-400">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedExpense(expense); }}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSubmissions.length === 0 && (
            <div className="text-center py-12">
              <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground mb-4">No {filterStatus !== 'all' ? filterStatus : ''} expenses found</p>
              <Button onClick={() => window.location.href = '/employee/money/submit'}>
                Submit Your First Expense
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Detail Drawer */}
      {selectedExpense && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end"
          onClick={() => setSelectedExpense(null)}
        >
          <div
            className="w-full max-w-2xl h-full bg-background border-l border-border overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Expense Details</h2>
                  <p className="text-sm text-muted-foreground font-mono">{selectedExpense.id}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedExpense(null)}>
                  ✕
                </Button>
              </div>

              {/* Status */}
              <div className="bg-muted/30 rounded-lg p-4">
                {getStatusBadge(selectedExpense.status)}
                {selectedExpense.status === 'rejected' && selectedExpense.rejectionReason && (
                  <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">Rejection Reason:</p>
                    <p className="text-sm">{selectedExpense.rejectionReason}</p>
                  </div>
                )}
              </div>

              {/* Amount */}
              <div className="bg-card border border-border rounded-lg p-6">
                <p className="text-sm text-muted-foreground mb-2">Amount</p>
                <p className="text-4xl font-bold">{formatCurrency(selectedExpense.amount)}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Expense Date</p>
                  <p className="font-semibold">{formatDate(selectedExpense.date)}</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Submitted</p>
                  <p className="font-semibold">{formatDate(selectedExpense.submittedAt)}</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Department</p>
                  <p className="font-semibold">{selectedExpense.department}</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Payment Mode</p>
                  <p className="font-semibold">{selectedExpense.paymentMode}</p>
                </div>
              </div>

              {/* Description */}
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="font-medium">{selectedExpense.narration}</p>
              </div>

              {/* Client (if applicable) */}
              {selectedExpense.client && (
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-2">Client</p>
                  <p className="font-medium">{selectedExpense.client}</p>
                  {selectedExpense.billable && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">✓ Billable to client</p>
                  )}
                </div>
              )}

              {/* Review Info */}
              {selectedExpense.reviewedAt && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <p className="text-sm font-medium mb-2">Review Information</p>
                  <p className="text-sm text-muted-foreground mb-1">
                    Reviewed by {selectedExpense.reviewedBy}
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    on {formatDate(selectedExpense.reviewedAt)}
                  </p>
                  {selectedExpense.comments && (
                    <div className="mt-3 pt-3 border-t border-blue-500/20">
                      <p className="text-sm font-medium mb-1">Comments:</p>
                      <p className="text-sm">{selectedExpense.comments}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Receipt */}
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-2">Receipt</p>
                {selectedExpense.hasReceipt ? (
                  <div className="flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium">Receipt attached</span>
                    <Button variant="ghost" size="sm" className="ml-auto">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-red-600 dark:text-red-400">No receipt attached</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {selectedExpense.status === 'rejected' && (
                  <Button className="flex-1" onClick={() => window.location.href = '/employee/money/submit-expense'}>
                    Resubmit Expense
                  </Button>
                )}
                <Button variant="outline" onClick={() => setSelectedExpense(null)} className="flex-1">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}