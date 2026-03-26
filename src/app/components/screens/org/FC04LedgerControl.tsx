import { PageLayout } from '../../shared/PageLayout';
import { Card3D } from '../../shared/Card3D';
import { DataTable } from '../../shared/DataTable';
import { StatusBadge } from '../../shared/StatusBadge';
import { Breadcrumb } from '../../shared/Breadcrumb';
import { FinanceTopTabs } from '../../../finance/components/FinanceTopTabs';
import { useToast } from '../../ui/toast';
import { useState } from 'react';
import { 
  Edit3, 
  CheckCircle2, 
  Link as LinkIcon, 
  Filter,
  Download
} from 'lucide-react';

export function FC04LedgerControl() {
  const { showToast } = useToast();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState({
    department: '',
    project: '',
    billable: 'all'
  });

  const ledgerData = [
    { id: 'TXN-1001', date: '2026-01-01', narration: 'Office supplies - Amazon', category: 'Office Expenses', amount: -284.50, department: 'Admin', project: '', billable: 'No', status: 'Posted' },
    { id: 'TXN-1002', date: '2026-01-01', narration: 'Client payment - Acme Corp', category: 'Revenue', amount: 12500.00, department: 'Sales', project: 'Project Apollo', billable: 'Yes', status: 'Posted' },
    { id: 'TXN-1003', date: '2025-12-31', narration: 'Software subscription - Figma', category: 'Software', amount: -45.00, department: 'Design', project: 'Project Nova', billable: 'Yes', status: 'Posted' },
    { id: 'TXN-1004', date: '2025-12-31', narration: 'Team lunch - Marina Bay', category: 'Team Activities', amount: -156.80, department: 'Operations', project: '', billable: 'No', status: 'Posted' },
    { id: 'TXN-1005', date: '2025-12-30', narration: 'Consulting services - Client project', category: 'Professional Services', amount: -2500.00, department: 'Engineering', project: 'Project Mars', billable: 'Yes', status: 'Posted' }
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

  const bulkLinkToProject = () => {
    showToast(`Linked ${selectedItems.size} transactions to project`, 'success');
    setSelectedItems(new Set());
  };

  const columns = [
    { 
      key: 'select',
      header: (
        <input
          type="checkbox"
          checked={selectedItems.size === ledgerData.length}
          onChange={() => {
            if (selectedItems.size === ledgerData.length) {
              setSelectedItems(new Set());
            } else {
              setSelectedItems(new Set(ledgerData.map(l => l.id)));
            }
          }}
          className="h-4 w-4 rounded border-border"
        />
      ),
      cell: (_: any, row: any) => (
        <input
          type="checkbox"
          checked={selectedItems.has(row.id)}
          onChange={() => toggleSelection(row.id)}
          className="h-4 w-4 rounded border-border"
        />
      )
    },
    { key: 'id', header: 'ID' },
    { key: 'date', header: 'Date' },
    { key: 'narration', header: 'Narration' },
    { key: 'category', header: 'Category' },
    { 
      key: 'amount', 
      header: 'Amount',
      cell: (v: number) => (
        <span className={v > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
          ${Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      )
    },
    { key: 'department', header: 'Department' },
    { key: 'project', header: 'Project' },
    { 
      key: 'billable', 
      header: 'Billable',
      cell: (v: string) => (
        <StatusBadge type={v === 'Yes' ? 'success' : 'neutral'}>{v}</StatusBadge>
      )
    },
    { 
      key: 'status', 
      header: 'Status',
      cell: (v: string) => (
        <StatusBadge type="success">{v}</StatusBadge>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (_: any, row: any) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast(`Edit ${row.id} - Creates revision record`, 'info')}
            className="p-1.5 rounded hover:bg-accent"
            title="Edit (Creates Revision)"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => showToast(`Link ${row.id} to project/task`, 'info')}
            className="p-1.5 rounded hover:bg-accent"
            title="Link to Project/Task"
          >
            <LinkIcon className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <PageLayout
      title="Ledger Control"
      description="Immutable ledger with bulk actions and audit trail"
    >
      <Breadcrumb items={[
        { label: 'Finance', path: '/org/finance/cockpit' },
        { label: 'Ledger' }
      ]} />
      <FinanceTopTabs />
      <div className="space-y-6">
        {/* Filters */}
        <Card3D>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            <select
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm"
            >
              <option value="">All Departments</option>
              <option value="sales">Sales</option>
              <option value="marketing">Marketing</option>
              <option value="design">Design</option>
              <option value="engineering">Engineering</option>
              <option value="operations">Operations</option>
              <option value="admin">Admin</option>
            </select>
            <select
              value={filters.project}
              onChange={(e) => setFilters({ ...filters, project: e.target.value })}
              className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm"
            >
              <option value="">All Projects</option>
              <option value="apollo">Project Apollo</option>
              <option value="nova">Project Nova</option>
              <option value="mars">Project Mars</option>
            </select>
            <select
              value={filters.billable}
              onChange={(e) => setFilters({ ...filters, billable: e.target.value })}
              className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm"
            >
              <option value="all">All Billability</option>
              <option value="yes">Billable Only</option>
              <option value="no">Non-Billable Only</option>
            </select>
            <button
              onClick={() => showToast('Export started', 'info')}
              className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:bg-accent text-sm"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </Card3D>

        {/* Bulk Actions */}
        {selectedItems.size > 0 && (
          <Card3D>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-medium">
                {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
              </span>
              <button
                onClick={() => showToast('Bulk edit opens modal', 'info')}
                className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90"
              >
                <Edit3 className="h-4 w-4" />
                Bulk Edit
              </button>
              <button
                onClick={() => showToast(`Bulk approve ${selectedItems.size} items`, 'success')}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
              >
                <CheckCircle2 className="h-4 w-4" />
                Bulk Approve
              </button>
              <button
                onClick={bulkLinkToProject}
                className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-lg text-sm hover:bg-accent"
              >
                <LinkIcon className="h-4 w-4" />
                Link to Project/Task
              </button>
            </div>
          </Card3D>
        )}

        {/* Ledger Table */}
        <Card3D>
          <DataTable columns={columns} data={ledgerData} />
        </Card3D>

        {/* Immutability Notice */}
        <div className="bg-accent/50 border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Ledger Immutability:</strong> Posted entries cannot be deleted. 
            Edits create revision records with full audit trail. 
            All bulk actions are logged with admin identity and timestamp.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}