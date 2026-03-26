import { PageLayout } from '../../shared/PageLayout';
import { Button } from '../../ui/button';
import { DollarSign, Clock, AlertCircle, CheckCircle2, XCircle, TrendingUp, Calendar, Receipt, FileText } from 'lucide-react';
import { useState } from 'react';

interface ExpenseSubmission {
  id: string;
  date: string;
  amount: number;
  narration: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  submittedAt: string;
}

interface PayrollSummary {
  nextPayDate: string;
  nextPayAmount: number;
  lastPaidDate: string;
  lastPaidAmount: number;
  netPaidThisMonth: number;
}

export function M01MyMoneyDashboard() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  // Mock data
  const payrollSummary: PayrollSummary = {
    nextPayDate: '2026-01-15',
    nextPayAmount: 5800.00,
    lastPaidDate: '2025-12-31',
    lastPaidAmount: 5800.00,
    netPaidThisMonth: 5800.00
  };

  const expenseStats = {
    pendingCount: 3,
    pendingAmount: 1245.50,
    approvedCount: 8,
    approvedAmount: 3420.00,
    rejectedCount: 1,
    paidCount: 7,
    paidAmount: 2890.00
  };

  const recentSubmissions: ExpenseSubmission[] = [
    {
      id: 'EXP-001',
      date: '2026-01-01',
      amount: 450.00,
      narration: 'Client meeting dinner - Acme Corp',
      status: 'pending',
      submittedAt: '2026-01-01T18:30:00Z'
    },
    {
      id: 'EXP-002',
      date: '2025-12-28',
      amount: 125.50,
      narration: 'Uber to client site',
      status: 'approved',
      submittedAt: '2025-12-28T09:15:00Z'
    },
    {
      id: 'EXP-003',
      date: '2025-12-27',
      amount: 670.00,
      narration: 'Hotel - Business conference',
      status: 'approved',
      submittedAt: '2025-12-27T20:00:00Z'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20"><Clock className="h-3 w-3" />Pending</span>;
      case 'approved':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20"><CheckCircle2 className="h-3 w-3" />Approved</span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"><XCircle className="h-3 w-3" />Rejected</span>;
      case 'paid':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"><DollarSign className="h-3 w-3" />Paid</span>;
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
      title="TEAM – M-01 – My Money Dashboard"
      description="Your salary, expenses, and reimbursements in one place"
      actions={
        <Button onClick={() => window.location.href = '/employee/money/submit-expense'}>
          <Receipt className="h-4 w-4 mr-2" />
          Submit Expense
        </Button>
      }
      kpis={[
        {
          title: 'Upcoming Pay',
          value: formatCurrency(payrollSummary.nextPayAmount),
          change: formatDate(payrollSummary.nextPayDate),
          changeType: 'neutral',
          icon: <Calendar className="h-5 w-5" />
        },
        {
          title: 'Last Salary Paid',
          value: formatCurrency(payrollSummary.lastPaidAmount),
          change: formatDate(payrollSummary.lastPaidDate),
          changeType: 'positive',
          icon: <CheckCircle2 className="h-5 w-5" />
        },
        {
          title: 'Pending Reimbursements',
          value: formatCurrency(expenseStats.pendingAmount),
          change: `${expenseStats.pendingCount} expenses`,
          changeType: 'neutral',
          icon: <Clock className="h-5 w-5" />
        },
        {
          title: 'Net Paid This Month',
          value: formatCurrency(payrollSummary.netPaidThisMonth),
          change: 'Salary + Expenses',
          changeType: 'positive',
          icon: <DollarSign className="h-5 w-5" />
        }
      ]}
    >
      <div className="space-y-6">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => window.location.href = '/employee/money/my-submissions'}
            className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <span className="text-2xl font-bold">{expenseStats.pendingCount}</span>
            </div>
            <h3 className="font-semibold mb-1">Pending Approval</h3>
            <p className="text-sm text-muted-foreground">{formatCurrency(expenseStats.pendingAmount)} waiting</p>
          </button>

          <button
            onClick={() => window.location.href = '/employee/money/my-submissions'}
            className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-2xl font-bold">{expenseStats.approvedCount}</span>
            </div>
            <h3 className="font-semibold mb-1">Approved Expenses</h3>
            <p className="text-sm text-muted-foreground">{formatCurrency(expenseStats.approvedAmount)} this month</p>
          </button>

          <button
            onClick={() => window.location.href = '/employee/money/my-submissions'}
            className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <span className="text-2xl font-bold">{expenseStats.rejectedCount}</span>
            </div>
            <h3 className="font-semibold mb-1">Rejected</h3>
            <p className="text-sm text-muted-foreground">Needs resubmission</p>
          </button>

          <button
            onClick={() => window.location.href = '/employee/money/payslips-history'}
            className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-2xl font-bold">12</span>
            </div>
            <h3 className="font-semibold mb-1">Payslips</h3>
            <p className="text-sm text-muted-foreground">View all history</p>
          </button>
        </div>

        {/* Payroll Preview Card */}
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-2 border-primary/20 rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Next Payroll</h2>
              <p className="text-sm text-muted-foreground">Your upcoming salary payment</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-card/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Pay Date</p>
              <p className="text-xl font-bold">{formatDate(payrollSummary.nextPayDate)}</p>
            </div>
            <div className="bg-card/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Net Amount</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">{formatCurrency(payrollSummary.nextPayAmount)}</p>
            </div>
            <div className="bg-card/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Payment Status</p>
              <p className="text-xl font-bold">Scheduled</p>
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={() => window.location.href = '/employee/money/payslips-history'}>
            View Payslip Details
          </Button>
        </div>

        {/* Recent Submissions */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Expense Submissions</h3>
            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/employee/money/submissions'}>
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {recentSubmissions.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => setSelectedCard(expense.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-sm text-muted-foreground">{expense.id}</span>
                    {getStatusBadge(expense.status)}
                  </div>
                  <p className="font-medium mb-1">{expense.narration}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(expense.date)}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-xl font-bold">{formatCurrency(expense.amount)}</p>
                </div>
              </div>
            ))}
          </div>

          {recentSubmissions.length === 0 && (
            <div className="text-center py-12">
              <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground mb-4">No expense submissions yet</p>
              <Button onClick={() => window.location.href = '/employee/money/submit'}>
                Submit Your First Expense
              </Button>
            </div>
          )}
        </div>

        {/* Help Card */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">How Reimbursements Work</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Submit expenses with receipts → Finance team approves → Reimbursement added to your next payroll or paid separately based on company policy.
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Approval time:</strong> Usually 2-3 business days • <strong>Payment:</strong> Next payroll cycle
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}