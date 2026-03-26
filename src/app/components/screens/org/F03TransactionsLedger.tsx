import { PageLayout } from '../../shared/PageLayout';
import { Button } from '../../ui/button';
import { FormField, Select } from '../../ui/form';
import { useToast } from '../../ui/toast';
import { 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  Trash2,
  Download,
  MoreVertical,
  Search,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useState } from 'react';
import { mockOperationalTransactions, mockDepartments, mockClients } from '../finance/mockData';
import { TransactionOperational } from '../finance/types';
import { FinanceSubNav } from './FinanceSubNav';

export function F03TransactionsLedger() {
  const { showToast } = useToast();
  const [transactions, setTransactions] = useState(mockOperationalTransactions);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    status: 'all',
    department: 'all',
    client: 'all',
    world: 'all',
    search: ''
  });
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  // Filter transactions
  const filteredTransactions = transactions.filter(txn => {
    if (filters.status !== 'all' && txn.status !== filters.status) return false;
    if (filters.department !== 'all' && txn.departmentId !== filters.department) return false;
    if (filters.client !== 'all' && txn.clientId !== filters.client) return false;
    if (filters.world !== 'all' && txn.world !== filters.world) return false;
    if (filters.search && !txn.narration.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  // Toggle selection
  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Select all
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredTransactions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTransactions.map(t => t.id));
    }
  };

  // Bulk actions
  const handleBulkApprove = async () => {
    const toApprove = transactions.filter(t => 
      selectedIds.includes(t.id) && t.status === 'pending-approval'
    );

    if (toApprove.length === 0) {
      showToast('warning', 'No Items', 'No pending approval transactions selected');
      return;
    }

    setIsBulkProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setTransactions(prev => prev.map(t => 
      selectedIds.includes(t.id) && t.status === 'pending-approval'
        ? { ...t, status: 'approved' as any }
        : t
    ));
    
    setSelectedIds([]);
    setIsBulkProcessing(false);
    showToast('success', 'Bulk Approved', `${toApprove.length} transactions approved`);
  };

  const handleBulkReject = async () => {
    const toReject = transactions.filter(t => 
      selectedIds.includes(t.id) && t.status === 'pending-approval'
    );

    if (toReject.length === 0) {
      showToast('warning', 'No Items', 'No pending approval transactions selected');
      return;
    }

    setIsBulkProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setTransactions(prev => prev.map(t => 
      selectedIds.includes(t.id) && t.status === 'pending-approval'
        ? { ...t, status: 'rejected' as any, rejectionReason: 'Bulk rejected' }
        : t
    ));
    
    setSelectedIds([]);
    setIsBulkProcessing(false);
    showToast('info', 'Bulk Rejected', `${toReject.length} transactions rejected`);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      showToast('warning', 'No Selection', 'Please select transactions to delete');
      return;
    }

    const canDelete = transactions.filter(t => 
      selectedIds.includes(t.id) && (t.status === 'draft' || t.status === 'rejected')
    );

    if (canDelete.length === 0) {
      showToast('error', 'Cannot Delete', 'Only draft or rejected transactions can be deleted');
      return;
    }

    if (!confirm(`Delete ${canDelete.length} transaction(s)? This creates a revision entry.`)) {
      return;
    }

    setIsBulkProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setTransactions(prev => prev.filter(t => !selectedIds.includes(t.id) || (t.status !== 'draft' && t.status !== 'rejected')));
    setSelectedIds([]);
    setIsBulkProcessing(false);
    showToast('success', 'Deleted', `${canDelete.length} transactions removed (revision logged)`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'posted': return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
      case 'approved': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'pending-approval': return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
      case 'draft': return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'posted':
      case 'approved':
        return <CheckCircle2 className="h-3 w-3" />;
      case 'pending-approval':
        return <Clock className="h-3 w-3" />;
      case 'rejected':
        return <XCircle className="h-3 w-3" />;
      case 'draft':
        return <FileText className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <PageLayout
      title="ORG – F-03 – Transactions Ledger"
      description="Complete transaction history with approval workflow"
      subNav={<FinanceSubNav />}
      actions={
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      }
      kpis={[
        {
          title: 'Total Transactions',
          value: transactions.length.toString(),
          change: `${filteredTransactions.length} visible`,
          icon: <FileText className="h-5 w-5" />
        },
        {
          title: 'Pending Approval',
          value: transactions.filter(t => t.status === 'pending-approval').length.toString(),
          change: 'Needs review',
          icon: <Clock className="h-5 w-5" />
        },
        {
          title: 'Selected',
          value: selectedIds.length.toString(),
          change: 'Items',
          icon: <CheckCircle2 className="h-5 w-5" />
        },
      ]}
    >
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">Filters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search narration..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <Select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'draft', label: 'Draft' },
                { value: 'pending-approval', label: 'Pending Approval' },
                { value: 'approved', label: 'Approved' },
                { value: 'rejected', label: 'Rejected' },
                { value: 'posted', label: 'Posted' }
              ]}
            />

            <Select
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              options={[
                { value: 'all', label: 'All Departments' },
                ...mockDepartments.map(d => ({ value: d.id, label: d.name }))
              ]}
            />

            <Select
              value={filters.client}
              onChange={(e) => setFilters({ ...filters, client: e.target.value })}
              options={[
                { value: 'all', label: 'All Clients' },
                ...mockClients.map(c => ({ value: c.id, label: c.name }))
              ]}
            />

            <Select
              value={filters.world}
              onChange={(e) => setFilters({ ...filters, world: e.target.value })}
              options={[
                { value: 'all', label: 'All Worlds' },
                { value: 'business', label: 'Business' },
                { value: 'personal', label: 'Personal' }
              ]}
            />
          </div>

          {(filters.status !== 'all' || filters.department !== 'all' || filters.client !== 'all' || filters.world !== 'all' || filters.search) && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredTransactions.length} of {transactions.length} transactions
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setFilters({ status: 'all', department: 'all', client: 'all', world: 'all', search: '' })}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Bulk Actions Bar */}
        {selectedIds.length > 0 && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="font-medium">
                {selectedIds.length} transaction(s) selected
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleBulkApprove}
                  disabled={isBulkProcessing}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleBulkReject}
                  disabled={isBulkProcessing}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleBulkDelete}
                  disabled={isBulkProcessing}
                  className="border-red-500/50 text-red-600 dark:text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Transactions Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left p-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredTransactions.length && filteredTransactions.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-border"
                    />
                  </th>
                  <th className="text-left p-4 text-sm font-medium">Date</th>
                  <th className="text-left p-4 text-sm font-medium">Description</th>
                  <th className="text-left p-4 text-sm font-medium">Department</th>
                  <th className="text-left p-4 text-sm font-medium">Client</th>
                  <th className="text-right p-4 text-sm font-medium">Amount</th>
                  <th className="text-left p-4 text-sm font-medium">Status</th>
                  <th className="text-left p-4 text-sm font-medium">Submitted By</th>
                  <th className="text-center p-4 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-12 text-center text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No transactions found</p>
                      <p className="text-sm mt-1">Adjust filters or add a new transaction</p>
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((txn) => (
                    <tr
                      key={txn.id}
                      className={`hover:bg-muted/30 transition-colors ${
                        selectedIds.includes(txn.id) ? 'bg-primary/5' : ''
                      }`}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(txn.id)}
                          onChange={() => toggleSelection(txn.id)}
                          className="w-4 h-4 rounded border-border"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span>{new Date(txn.date).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-sm font-medium mb-1">{txn.narration}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{txn.accountName}</span>
                            {txn.isBillable && (
                              <>
                                <span>•</span>
                                <span className="text-green-600 dark:text-green-400">Billable</span>
                              </>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {txn.departmentName && (
                          <span className="text-sm px-2 py-1 bg-muted rounded">
                            {txn.departmentName}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        {txn.clientName && (
                          <span className="text-sm">{txn.clientName}</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <DollarSign className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium">
                            {txn.amount.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded border ${getStatusColor(txn.status)}`}>
                          {getStatusIcon(txn.status)}
                          <span className="capitalize">{txn.status.replace('-', ' ')}</span>
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{txn.createdBy}</span>
                      </td>
                      <td className="p-4">
                        <button className="p-2 hover:bg-muted rounded transition-colors">
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rejection Details */}
        {filteredTransactions.some(t => t.status === 'rejected' && t.rejectionReason) && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Rejected Transactions</h3>
            <div className="space-y-3">
              {filteredTransactions
                .filter(t => t.status === 'rejected' && t.rejectionReason)
                .map(txn => (
                  <div key={txn.id} className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-sm">{txn.narration}</p>
                      <span className="text-sm text-muted-foreground">
                        ${txn.amount.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-red-600 dark:text-red-400">
                      <strong>Reason:</strong> {txn.rejectionReason}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Rejected by {txn.rejectedBy} on {txn.rejectedAt && new Date(txn.rejectedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}