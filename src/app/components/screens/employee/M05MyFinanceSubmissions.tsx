import { PageLayout } from '../../shared/PageLayout';
import { Card3D } from '../../shared/Card3D';
import { StatusBadge } from '../../shared/StatusBadge';
import { DataTable } from '../../shared/DataTable';
import { 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Receipt,
  FileText,
  Calendar
} from 'lucide-react';
import { mockOperationalTransactions, mockUser as currentUser } from '../finance/mockData';
import { TransactionOperational } from '../finance/types';

export function M05MyFinanceSubmissions() {
  // Get current user ID - for demo purposes we'll use 'tm-3' (Emily Martinez)
  // In production, this would come from auth context
  const currentUserId = 'tm-3';

  // Filter transactions submitted by current user
  const mySubmissions = mockOperationalTransactions.filter(
    txn => txn.submittedBy === currentUserId
  );

  // Calculate stats
  const pendingCount = mySubmissions.filter(t => t.status === 'pending-approval').length;
  const approvedCount = mySubmissions.filter(t => t.status === 'approved').length;
  const rejectedCount = mySubmissions.filter(t => t.status === 'rejected').length;
  const totalAmount = mySubmissions.reduce((sum, t) => sum + t.amount, 0);
  const pendingAmount = mySubmissions
    .filter(t => t.status === 'pending-approval')
    .reduce((sum, t) => sum + t.amount, 0);

  const columns = [
    { 
      key: 'date', 
      header: 'Date',
      cell: (value: string) => new Date(value).toLocaleDateString('en-US', { 
        year: 'numeric',
        month: 'short', 
        day: 'numeric' 
      })
    },
    { 
      key: 'amount', 
      header: 'Amount',
      cell: (value: number) => (
        <span className="font-semibold">
          ${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      )
    },
    { 
      key: 'categoryName', 
      header: 'Category'
    },
    { 
      key: 'narration', 
      header: 'Description'
    },
    { 
      key: 'status', 
      header: 'Status',
      cell: (value: string) => {
        if (value === 'pending-approval') {
          return <StatusBadge type="warning">Pending</StatusBadge>;
        } else if (value === 'approved') {
          return <StatusBadge type="success">Approved</StatusBadge>;
        } else if (value === 'rejected') {
          return <StatusBadge type="destructive">Rejected</StatusBadge>;
        } else {
          return <StatusBadge type="neutral">{value}</StatusBadge>;
        }
      }
    },
    { 
      key: 'rejectionReason', 
      header: 'Rejection Reason',
      cell: (value: string | undefined, row: TransactionOperational) => {
        if (row.status === 'rejected' && value) {
          return (
            <div className="max-w-xs">
              <p className="text-sm text-red-600 dark:text-red-400">{value}</p>
            </div>
          );
        }
        return <span className="text-muted-foreground">—</span>;
      }
    },
    {
      key: 'receiptUrls',
      header: 'Receipt',
      cell: (value: string[] | undefined) => {
        if (value && value.length > 0) {
          return (
            <Receipt className="h-4 w-4 text-green-600 dark:text-green-400" title="Receipt attached" />
          );
        }
        return <span className="text-muted-foreground">—</span>;
      }
    }
  ];

  return (
    <PageLayout
      title="TEAM – My Finance Submissions"
      description="Track your submitted expenses and reimbursement requests"
      kpis={[
        {
          title: 'Total Submitted',
          value: `$${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
          subtitle: `${mySubmissions.length} submission${mySubmissions.length !== 1 ? 's' : ''}`,
          icon: <DollarSign className="h-5 w-5" />
        },
        {
          title: 'Pending Approval',
          value: pendingCount.toString(),
          subtitle: `$${pendingAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} waiting`,
          icon: <Clock className="h-5 w-5" />,
          alert: pendingCount > 0
        },
        {
          title: 'Approved',
          value: approvedCount.toString(),
          icon: <CheckCircle2 className="h-5 w-5" />
        },
        {
          title: 'Rejected',
          value: rejectedCount.toString(),
          icon: <XCircle className="h-5 w-5" />,
          alert: rejectedCount > 0
        }
      ]}
    >
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card3D className="border-blue-500/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Recent Submissions</p>
                <p className="text-xl font-bold">
                  {mySubmissions.filter(t => {
                    const submittedDate = new Date(t.submittedAt);
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                    return submittedDate >= sevenDaysAgo;
                  }).length}
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">In last 7 days</p>
          </Card3D>

          <Card3D className="border-green-500/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Receipt className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">With Receipts</p>
                <p className="text-xl font-bold">
                  {mySubmissions.filter(t => t.receiptUrls && t.receiptUrls.length > 0).length}
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((mySubmissions.filter(t => t.receiptUrls && t.receiptUrls.length > 0).length / mySubmissions.length) * 100)}% of submissions
            </p>
          </Card3D>

          <Card3D className="border-purple-500/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Billable Expenses</p>
                <p className="text-xl font-bold">
                  ${mySubmissions
                    .filter(t => t.isBillable)
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {mySubmissions.filter(t => t.isBillable).length} client expenses
            </p>
          </Card3D>
        </div>

        {/* Submissions Table */}
        <Card3D>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">All My Submissions</h3>
            <div className="flex items-center gap-2">
              <StatusBadge type="warning">{pendingCount} Pending</StatusBadge>
              <StatusBadge type="success">{approvedCount} Approved</StatusBadge>
              {rejectedCount > 0 && (
                <StatusBadge type="destructive">{rejectedCount} Rejected</StatusBadge>
              )}
            </div>
          </div>

          {mySubmissions.length > 0 ? (
            <DataTable columns={columns} data={mySubmissions} />
          ) : (
            <div className="text-center py-12">
              <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-2">No submissions yet</p>
              <p className="text-sm text-muted-foreground">
                Your submitted expenses will appear here
              </p>
            </div>
          )}
        </Card3D>

        {/* Status Legend */}
        <div className="bg-accent/50 border border-border rounded-lg p-4">
          <h4 className="text-sm font-semibold mb-3">Status Guide</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5" />
              <div>
                <p className="font-medium">Pending</p>
                <p className="text-xs text-muted-foreground">Awaiting approval from your manager</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
              <div>
                <p className="font-medium">Approved</p>
                <p className="text-xs text-muted-foreground">Posted to finance ledger, ready for payment</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5" />
              <div>
                <p className="font-medium">Rejected</p>
                <p className="text-xs text-muted-foreground">Review reason and resubmit if appropriate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Help Notice */}
        {rejectedCount > 0 && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-sm text-red-600 dark:text-red-400 font-medium mb-1">
              ⚠️ You have {rejectedCount} rejected submission{rejectedCount !== 1 ? 's' : ''}
            </p>
            <p className="text-sm text-muted-foreground">
              Check the rejection reasons in the table above. You can resubmit corrected expenses 
              through the Submit Expense page if appropriate.
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
