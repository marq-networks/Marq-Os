import { PageLayout } from '../../shared/PageLayout';
import { Button } from '../../ui/button';
import { useToast } from '../../ui/toast';
import { Clock, CheckCircle2, XCircle, FileText, Upload, AlertCircle, Users, Eye } from 'lucide-react';
import { useState } from 'react';

interface ApprovalItem {
  id: string;
  type: 'expense' | 'import' | 'revision' | 'payroll';
  requester: string;
  department: string;
  amount?: number;
  description: string;
  submittedAt: string;
  sla: 'on-time' | 'due-soon' | 'overdue';
  linkedContext?: string;
  hasReceipt?: boolean;
  selected?: boolean;
}

export function A02ApprovalsInbox() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'all' | 'expenses' | 'imports' | 'revisions' | 'payroll'>('all');
  const [items, setItems] = useState<ApprovalItem[]>([
    {
      id: 'EXP-008',
      type: 'expense',
      requester: 'John Smith',
      department: 'Sales',
      amount: 450.00,
      description: 'Client meeting dinner - Acme Corp',
      submittedAt: '2026-01-01T18:30:00Z',
      sla: 'overdue',
      linkedContext: 'Project: Acme Onboarding',
      hasReceipt: true,
      selected: false
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
      linkedContext: 'Department: Engineering',
      hasReceipt: true,
      selected: false
    },
    {
      id: 'EXP-009',
      type: 'expense',
      requester: 'Lisa Brown',
      department: 'Marketing',
      amount: 320.00,
      description: 'LinkedIn Ads - Q1 Campaign',
      submittedAt: '2026-01-01T12:00:00Z',
      sla: 'on-time',
      hasReceipt: true,
      selected: false
    },
    {
      id: 'IMP-024',
      type: 'import',
      requester: 'Finance Bot',
      department: 'Finance',
      amount: 12450.00,
      description: 'Chase Bank Statement - Dec 2025 (45 rows)',
      submittedAt: '2026-01-01T08:00:00Z',
      sla: 'due-soon',
      selected: false
    },
    {
      id: 'REV-012',
      type: 'revision',
      requester: 'Sarah Chen',
      department: 'Finance',
      description: 'Correct category: Office Rent → Software License',
      submittedAt: '2025-12-31T16:20:00Z',
      sla: 'on-time',
      selected: false
    },
    {
      id: 'REV-013',
      type: 'revision',
      requester: 'Tom Wilson',
      department: 'Finance',
      description: 'Update transaction amount: $1,200 → $1,250',
      submittedAt: '2025-12-31T10:00:00Z',
      sla: 'on-time',
      selected: false
    },
    {
      id: 'PAY-2026-01',
      type: 'payroll',
      requester: 'System',
      department: 'HR',
      amount: 125000.00,
      description: 'Payroll Run - Jan 1-15, 2026 (23 employees)',
      submittedAt: '2025-12-30T10:00:00Z',
      sla: 'due-soon',
      selected: false
    }
  ]);

  const filteredItems = activeTab === 'all' 
    ? items 
    : items.filter(item => {
        if (activeTab === 'expenses') return item.type === 'expense';
        if (activeTab === 'imports') return item.type === 'import';
        if (activeTab === 'revisions') return item.type === 'revision';
        if (activeTab === 'payroll') return item.type === 'payroll';
        return true;
      });

  const selectedCount = items.filter(item => item.selected).length;
  const stats = {
    all: items.length,
    expenses: items.filter(i => i.type === 'expense').length,
    imports: items.filter(i => i.type === 'import').length,
    revisions: items.filter(i => i.type === 'revision').length,
    payroll: items.filter(i => i.type === 'payroll').length
  };

  const handleSelectAll = () => {
    const allSelected = filteredItems.every(item => item.selected);
    setItems(items.map(item => {
      if (filteredItems.find(fi => fi.id === item.id)) {
        return { ...item, selected: !allSelected };
      }
      return item;
    }));
  };

  const handleSelectItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  const handleBulkApprove = async () => {
    const selectedItems = items.filter(item => item.selected);
    if (selectedItems.length === 0) {
      showToast('warning', 'No Selection', 'Please select items to approve');
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setItems(items.filter(item => !item.selected));
    showToast('success', 'Bulk Approved', `${selectedItems.length} items approved and processed`);
  };

  const handleBulkReject = () => {
    const selectedItems = items.filter(item => item.selected);
    if (selectedItems.length === 0) {
      showToast('warning', 'No Selection', 'Please select items to reject');
      return;
    }

    showToast('info', 'Bulk Rejection', 'Rejection drawer will open (not implemented in this patch)');
  };

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
      title="ORG – A-02 – Approvals Inbox"
      description="Review, approve, or reject pending requests"
      actions={
        selectedCount > 0 ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleBulkReject}>
              <XCircle className="h-4 w-4 mr-2" />
              Reject ({selectedCount})
            </Button>
            <Button onClick={handleBulkApprove}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Approve ({selectedCount})
            </Button>
          </div>
        ) : (
          <Button variant="outline" onClick={() => window.location.href = '/org/approvals/settings'}>
            Settings
          </Button>
        )
      }
      kpis={[
        {
          title: 'All Pending',
          value: stats.all.toString(),
          change: 'Total items',
          changeType: 'neutral',
          icon: <Clock className="h-5 w-5" />
        },
        {
          title: 'Expenses',
          value: stats.expenses.toString(),
          change: 'Employee submissions',
          changeType: 'neutral',
          icon: <FileText className="h-5 w-5" />
        },
        {
          title: 'Imports',
          value: stats.imports.toString(),
          change: 'Bank statements',
          changeType: 'neutral',
          icon: <Upload className="h-5 w-5" />
        },
        {
          title: 'Revisions',
          value: stats.revisions.toString(),
          change: 'Transaction edits',
          changeType: 'neutral',
          icon: <AlertCircle className="h-5 w-5" />
        }
      ]}
    >
      <div className="space-y-6">
        {/* Tabs */}
        <div className="bg-card border border-border rounded-lg p-2 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            }`}
          >
            All ({stats.all})
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'expenses'
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            }`}
          >
            Expenses ({stats.expenses})
          </button>
          <button
            onClick={() => setActiveTab('imports')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'imports'
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            }`}
          >
            Imports ({stats.imports})
          </button>
          <button
            onClick={() => setActiveTab('revisions')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'revisions'
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            }`}
          >
            Revisions ({stats.revisions})
          </button>
          <button
            onClick={() => setActiveTab('payroll')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'payroll'
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            }`}
          >
            Payroll ({stats.payroll})
          </button>
        </div>

        {/* Bulk Actions Bar */}
        {selectedCount > 0 && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="font-medium">{selectedCount} item{selectedCount > 1 ? 's' : ''} selected</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setItems(items.map(i => ({ ...i, selected: false })))}>
                  Clear Selection
                </Button>
                <Button size="sm" variant="outline" onClick={handleBulkReject}>
                  Reject All
                </Button>
                <Button size="sm" onClick={handleBulkApprove}>
                  Approve All
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Approvals Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left px-6 py-4 w-8">
                    <input
                      type="checkbox"
                      checked={filteredItems.length > 0 && filteredItems.every(item => item.selected)}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-border"
                    />
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold">Type</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold">ID</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold">Description</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold">Requester</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold">Department</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold">Amount</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold">SLA</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold">Submitted</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className={`border-b border-border last:border-0 hover:bg-muted/30 transition-colors ${
                      item.selected ? 'bg-primary/5' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={() => handleSelectItem(item.id)}
                        className="w-4 h-4 rounded border-border"
                      />
                    </td>
                    <td className="px-6 py-4">{getTypeBadge(item.type)}</td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-muted-foreground">{item.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{item.description}</p>
                        {item.linkedContext && (
                          <p className="text-xs text-primary mt-1">{item.linkedContext}</p>
                        )}
                        {item.hasReceipt && (
                          <p className="text-xs text-green-600 dark:text-green-400 mt-1">✓ Receipt attached</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{item.requester}</td>
                    <td className="px-6 py-4 text-sm">{item.department}</td>
                    <td className="px-6 py-4 text-right font-semibold">
                      {item.amount ? formatCurrency(item.amount) : '—'}
                    </td>
                    <td className="px-6 py-4">{getSLABadge(item.sla)}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{formatDate(item.submittedAt)}</td>
                    <td className="px-6 py-4 text-center">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => window.location.href = `/org/approvals/detail/${item.id}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No pending {activeTab !== 'all' ? activeTab : 'approvals'}</p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
