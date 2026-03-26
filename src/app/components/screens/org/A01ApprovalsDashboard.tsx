import { PageLayout } from '../../shared/PageLayout';
import { Button } from '../../ui/button';
import { Clock, CheckCircle2, XCircle, TrendingUp, AlertCircle, Filter, ArrowRight, FileText } from 'lucide-react';
import { useState } from 'react';

interface PendingApproval {
  id: string;
  type: 'expense' | 'import' | 'revision' | 'payroll';
  requester: string;
  department: string;
  amount?: number;
  description: string;
  submittedAt: string;
  sla: 'on-time' | 'due-soon' | 'overdue';
  linkedContext?: string;
}

interface RecentDecision {
  id: string;
  type: 'expense' | 'import' | 'revision' | 'payroll';
  requester: string;
  amount?: number;
  decision: 'approved' | 'rejected';
  decidedBy: string;
  decidedAt: string;
  reason?: string;
}

export function A01ApprovalsDashboard() {
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'import' | 'revision' | 'payroll'>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');

  // Mock data
  const stats = {
    totalPending: 14,
    pendingFinance: 8,
    pendingPayroll: 3,
    pendingRevisions: 3,
    avgApprovalTime: '4.2h',
    rejectionRate: '12%'
  };

  const needsAction: PendingApproval[] = [
    {
      id: 'EXP-008',
      type: 'expense',
      requester: 'John Smith',
      department: 'Sales',
      amount: 450.00,
      description: 'Client meeting dinner - Acme Corp',
      submittedAt: '2026-01-01T18:30:00Z',
      sla: 'overdue',
      linkedContext: 'Project: Acme Onboarding'
    },
    {
      id: 'IMP-024',
      type: 'import',
      requester: 'Finance Bot',
      department: 'Finance',
      amount: 12450.00,
      description: 'Chase Bank Statement - Dec 2025 (45 rows)',
      submittedAt: '2026-01-01T08:00:00Z',
      sla: 'due-soon'
    },
    {
      id: 'REV-012',
      type: 'revision',
      requester: 'Sarah Chen',
      department: 'Finance',
      description: 'Correct category: Office Rent → Software License',
      submittedAt: '2025-12-31T16:20:00Z',
      sla: 'on-time'
    },
    {
      id: 'EXP-007',
      type: 'expense',
      requester: 'Mike Johnson',
      department: 'Engineering',
      amount: 85.00,
      description: 'Office supplies - Notebooks and pens',
      submittedAt: '2025-12-30T14:20:00Z',
      sla: 'overdue',
      linkedContext: 'Department: Engineering'
    },
    {
      id: 'PAY-2026-01',
      type: 'payroll',
      requester: 'System',
      department: 'HR',
      amount: 125000.00,
      description: 'Payroll Run - Jan 1-15, 2026 (23 employees)',
      submittedAt: '2025-12-30T10:00:00Z',
      sla: 'due-soon'
    }
  ];

  const recentDecisions: RecentDecision[] = [
    {
      id: 'EXP-006',
      type: 'expense',
      requester: 'Emily Davis',
      amount: 125.50,
      decision: 'approved',
      decidedBy: 'You',
      decidedAt: '2026-01-01T10:30:00Z'
    },
    {
      id: 'EXP-005',
      type: 'expense',
      requester: 'Tom Wilson',
      amount: 670.00,
      decision: 'approved',
      decidedBy: 'You',
      decidedAt: '2026-01-01T09:00:00Z'
    },
    {
      id: 'EXP-003',
      type: 'expense',
      requester: 'John Smith',
      amount: 95.00,
      decision: 'rejected',
      decidedBy: 'You',
      decidedAt: '2025-12-31T10:00:00Z',
      reason: 'Missing receipt'
    },
    {
      id: 'IMP-023',
      type: 'import',
      requester: 'Finance Bot',
      amount: 8900.00,
      decision: 'approved',
      decidedBy: 'You',
      decidedAt: '2025-12-30T15:30:00Z'
    }
  ];

  const filteredNeedsAction = needsAction.filter(item => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (filterDepartment !== 'all' && item.department !== filterDepartment) return false;
    return true;
  });

  const getTypeBadge = (type: string) => {
    const badges = {
      expense: <span className="px-2 py-1 rounded text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">Expense</span>,
      import: <span className="px-2 py-1 rounded text-xs bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">Import</span>,
      revision: <span className="px-2 py-1 rounded text-xs bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">Revision</span>,
      payroll: <span className="px-2 py-1 rounded text-xs bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">Payroll</span>
    };
    return badges[type as keyof typeof badges];
  };

  const getSLABadge = (sla: string) => {
    switch (sla) {
      case 'on-time':
        return <span className="px-2 py-1 rounded text-xs bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">On Time</span>;
      case 'due-soon':
        return <span className="px-2 py-1 rounded text-xs bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20">Due Soon</span>;
      case 'overdue':
        return <span className="px-2 py-1 rounded text-xs bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">Overdue</span>;
      default:
        return null;
    }
  };

  const getDecisionBadge = (decision: string) => {
    return decision === 'approved' 
      ? <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20"><CheckCircle2 className="h-3 w-3" />Approved</span>
      : <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"><XCircle className="h-3 w-3" />Rejected</span>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    
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
      title="ORG – A-01 – Approvals Dashboard"
      description="Manage and track all approval requests across Finance, Payroll, and Operations"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.location.href = '/org/approvals/settings'}>
            <Filter className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button onClick={() => window.location.href = '/org/approvals/inbox'}>
            View All Approvals
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      }
      kpis={[
        {
          title: 'Pending Approvals',
          value: stats.totalPending.toString(),
          change: 'Needs your action',
          changeType: 'neutral',
          icon: <Clock className="h-5 w-5" />
        },
        {
          title: 'Finance Approvals',
          value: stats.pendingFinance.toString(),
          change: 'Expenses + Imports',
          changeType: 'neutral',
          icon: <FileText className="h-5 w-5" />
        },
        {
          title: 'Avg Approval Time',
          value: stats.avgApprovalTime,
          change: '15% faster than last month',
          changeType: 'positive',
          icon: <TrendingUp className="h-5 w-5" />
        },
        {
          title: 'Rejection Rate',
          value: stats.rejectionRate,
          change: '3% lower than average',
          changeType: 'positive',
          icon: <AlertCircle className="h-5 w-5" />
        }
      ]}
    >
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => window.location.href = '/org/approvals/inbox?tab=expenses'}
            className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-2xl font-bold">{stats.pendingFinance}</span>
            </div>
            <h3 className="font-semibold mb-1">Finance Approvals</h3>
            <p className="text-sm text-muted-foreground">Expenses & Imports pending</p>
          </button>

          <button
            onClick={() => window.location.href = '/org/approvals/inbox?tab=payroll'}
            className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-2xl font-bold">{stats.pendingPayroll}</span>
            </div>
            <h3 className="font-semibold mb-1">Payroll Approvals</h3>
            <p className="text-sm text-muted-foreground">Payroll runs pending</p>
          </button>

          <button
            onClick={() => window.location.href = '/org/approvals/inbox?tab=revisions'}
            className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="text-2xl font-bold">{stats.pendingRevisions}</span>
            </div>
            <h3 className="font-semibold mb-1">Revisions</h3>
            <p className="text-sm text-muted-foreground">Transaction edits pending</p>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex gap-4 flex-wrap">
            <div>
              <label className="text-sm font-medium mb-2 block">Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-3 py-2 bg-background border border-border rounded-lg text-sm"
              >
                <option value="all">All Types</option>
                <option value="expense">Expenses</option>
                <option value="import">Imports</option>
                <option value="revision">Revisions</option>
                <option value="payroll">Payroll</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Department</label>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="px-3 py-2 bg-background border border-border rounded-lg text-sm"
              >
                <option value="all">All Departments</option>
                <option value="Sales">Sales</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
                <option value="HR">HR</option>
              </select>
            </div>
          </div>
        </div>

        {/* Needs Your Action */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Needs Your Action ({filteredNeedsAction.length})</h3>
            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/org/approvals/inbox'}>
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {filteredNeedsAction.slice(0, 10).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer border border-transparent hover:border-primary/30"
                onClick={() => window.location.href = `/org/approvals/detail/${item.id}`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getTypeBadge(item.type)}
                    {getSLABadge(item.sla)}
                    <span className="font-mono text-sm text-muted-foreground">{item.id}</span>
                  </div>
                  <p className="font-medium mb-1">{item.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{item.requester}</span>
                    <span>•</span>
                    <span>{item.department}</span>
                    {item.linkedContext && (
                      <>
                        <span>•</span>
                        <span className="text-primary">{item.linkedContext}</span>
                      </>
                    )}
                    <span>•</span>
                    <span>{formatDate(item.submittedAt)}</span>
                  </div>
                </div>
                {item.amount && (
                  <div className="text-right ml-4">
                    <p className="text-xl font-bold">{formatCurrency(item.amount)}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredNeedsAction.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No pending approvals</p>
            </div>
          )}
        </div>

        {/* Recently Decided */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recently Decided</h3>
            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/org/approvals/activity-log'}>
              View Activity Log
            </Button>
          </div>

          <div className="space-y-3">
            {recentDecisions.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getTypeBadge(item.type)}
                    {getDecisionBadge(item.decision)}
                    <span className="font-mono text-sm text-muted-foreground">{item.id}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Requester: <strong>{item.requester}</strong></span>
                    <span>•</span>
                    <span>Decided by: <strong>{item.decidedBy}</strong></span>
                    <span>•</span>
                    <span>{formatDate(item.decidedAt)}</span>
                  </div>
                  {item.reason && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">Reason: {item.reason}</p>
                  )}
                </div>
                {item.amount && (
                  <div className="text-right ml-4">
                    <p className="text-lg font-semibold text-muted-foreground">{formatCurrency(item.amount)}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
