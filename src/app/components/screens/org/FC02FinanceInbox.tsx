import { PageLayout } from '../../shared/PageLayout';
import { Card3D } from '../../shared/Card3D';
import { DataTable } from '../../shared/DataTable';
import { StatusBadge } from '../../shared/StatusBadge';
import { Breadcrumb } from '../../shared/Breadcrumb';
import { FinanceTopTabs } from '../../../finance/components/FinanceTopTabs';
import { useToast } from '../../ui/toast';
import { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  Download,
  Eye
} from 'lucide-react';

type ApprovalType = 'expense' | 'import' | 'reimbursement' | 'payroll' | 'revision';

interface ApprovalItem {
  id: string;
  type: ApprovalType;
  submittedBy: string;
  date: string;
  narration: string;
  amount: number;
  department?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export function FC02FinanceInbox() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<ApprovalType | 'all'>('all');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const approvals: ApprovalItem[] = [
    { id: 'E-001', type: 'expense', submittedBy: 'John Doe', date: '2026-01-01', narration: 'Client dinner - Project Apollo', amount: 284.50, department: 'Sales', status: 'pending' },
    { id: 'E-002', type: 'expense', submittedBy: 'Sarah Chen', date: '2026-01-01', narration: 'Software license - Adobe Creative', amount: 52.99, department: 'Design', status: 'pending' },
    { id: 'R-001', type: 'reimbursement', submittedBy: 'Mike Johnson', date: '2025-12-31', narration: 'Travel expenses - Client site visit', amount: 1250.00, department: 'Operations', status: 'pending' },
    { id: 'I-001', type: 'import', submittedBy: 'System', date: '2025-12-31', narration: 'Bank statement import - December batch', amount: 48500.00, status: 'pending' },
    { id: 'P-001', type: 'payroll', submittedBy: 'HR Admin', date: '2025-12-30', narration: 'December salary posting', amount: 48200.00, status: 'pending' },
    { id: 'REV-001', type: 'revision', submittedBy: 'Jane Smith', date: '2025-12-30', narration: 'Correction: Wrong category - Office Supplies', amount: 156.80, department: 'Admin', status: 'pending' },
    { id: 'E-003', type: 'expense', submittedBy: 'Tom Wilson', date: '2025-12-29', narration: 'Office supplies - Staples', amount: 89.90, department: 'Admin', status: 'pending' }
  ];

  const filteredApprovals = activeTab === 'all' 
    ? approvals 
    : approvals.filter(a => a.type === activeTab);

  const tabs = [
    { id: 'all', label: 'All', count: approvals.length },
    { id: 'expense', label: 'Expenses', count: approvals.filter(a => a.type === 'expense').length },
    { id: 'import', label: 'Imports', count: approvals.filter(a => a.type === 'import').length },
    { id: 'reimbursement', label: 'Reimbursements', count: approvals.filter(a => a.type === 'reimbursement').length },
    { id: 'payroll', label: 'Payroll', count: approvals.filter(a => a.type === 'payroll').length },
    { id: 'revision', label: 'Revisions', count: approvals.filter(a => a.type === 'revision').length }
  ];

  const toggleSelection = (id: string) => {
    setSelectedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === filteredApprovals.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredApprovals.map(a => a.id)));
    }
  };

  const bulkApprove = () => {
    showToast(`Approved ${selectedItems.size} items`, 'success');
    setSelectedItems(new Set());
  };

  const bulkReject = () => {
    showToast(`Rejected ${selectedItems.size} items`, 'warning');
    setSelectedItems(new Set());
  };

  const columns = [
    { 
      key: 'select', 
      header: (
        <input
          type="checkbox"
          checked={selectedItems.size === filteredApprovals.length && filteredApprovals.length > 0}
          onChange={toggleSelectAll}
          className="h-4 w-4 rounded border-border"
        />
      ),
      cell: (_: any, row: ApprovalItem) => (
        <input
          type="checkbox"
          checked={selectedItems.has(row.id)}
          onChange={() => toggleSelection(row.id)}
          className="h-4 w-4 rounded border-border"
        />
      )
    },
    { key: 'id', header: 'ID' },
    { 
      key: 'type', 
      header: 'Type',
      cell: (v: string) => (
        <StatusBadge type={
          v === 'expense' ? 'warning' : 
          v === 'reimbursement' ? 'info' : 
          v === 'payroll' ? 'success' :
          v === 'revision' ? 'destructive' : 'neutral'
        }>
          {v.charAt(0).toUpperCase() + v.slice(1)}
        </StatusBadge>
      )
    },
    { key: 'submittedBy', header: 'Submitted By' },
    { key: 'date', header: 'Date' },
    { key: 'narration', header: 'Narration' },
    { key: 'department', header: 'Department' },
    { 
      key: 'amount', 
      header: 'Amount',
      cell: (v: number) => `$${v.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (_: any, row: ApprovalItem) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast(`Viewing ${row.id}`, 'info')}
            className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-accent-foreground"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => showToast(`Approved ${row.id}`, 'success')}
            className="p-1.5 rounded hover:bg-green-500/10 text-green-600"
            title="Approve"
          >
            <CheckCircle2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => showToast(`Rejected ${row.id}`, 'warning')}
            className="p-1.5 rounded hover:bg-red-500/10 text-red-600"
            title="Reject"
          >
            <XCircle className="h-4 w-4" />
          </button>
          <button
            onClick={() => showToast(`Comment on ${row.id}`, 'info')}
            className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-accent-foreground"
            title="Add Comment"
          >
            <MessageSquare className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <PageLayout
      title="ORG – FC-02 – Finance Inbox"
      description="Approve, reject, and manage pending transactions"
    >
      <Breadcrumb items={[
        { label: 'Finance', path: '/finance/cockpit' },
        { label: 'Inbox' }
      ]} />
      <FinanceTopTabs />
      <div className="space-y-6">
        {/* Tabs */}
        <Card3D>
          <div className="flex items-center gap-2 border-b border-border pb-4 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-destructive text-destructive-foreground text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Bulk Actions */}
          {selectedItems.size > 0 && (
            <div className="flex items-center gap-3 py-3 border-b border-border">
              <span className="text-sm text-muted-foreground">
                {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
              </span>
              <button
                onClick={bulkApprove}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
              >
                <CheckCircle2 className="h-4 w-4" />
                Bulk Approve
              </button>
              <button
                onClick={bulkReject}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
              >
                <XCircle className="h-4 w-4" />
                Bulk Reject
              </button>
              <button
                onClick={() => showToast('Comment dialog opened', 'info')}
                className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-lg text-sm hover:bg-accent"
              >
                <MessageSquare className="h-4 w-4" />
                Bulk Comment
              </button>
              <button
                onClick={() => showToast('Export started', 'info')}
                className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-lg text-sm hover:bg-accent"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          )}

          {/* Table */}
          <div className="pt-4">
            <DataTable columns={columns} data={filteredApprovals} />
          </div>
        </Card3D>

        {/* Immutability Notice */}
        <div className="bg-accent/50 border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Approval Workflow:</strong> All approvals are logged with timestamp and approver identity. 
            Rejected items require comment. Approved items are immediately posted to immutable ledger.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}