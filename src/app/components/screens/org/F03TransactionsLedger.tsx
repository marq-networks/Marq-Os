import { PageLayout } from '../../shared/PageLayout';
import { Button } from '../../ui/button';
import { Select } from '../../ui/form';
import { useToast } from '../../ui/toast';
import {
  Filter,
  CheckCircle2,
  Clock,
  FileText,
  Download,
  Search,
  Calendar,
  DollarSign,
  Ban
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useFinanceData, type FinanceTransaction } from '../../../services';
import { FinanceSubNav } from './FinanceSubNav';

export function F03TransactionsLedger() {
  const { showToast } = useToast();
  const { transactions, accounts, loading, voidTransaction } = useFinanceData();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    status: 'all',
    department: 'all',
    account: 'all',
    search: '',
  });
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  const departments = useMemo(
    () => [...new Set(transactions.map((transaction) => transaction.departmentName).filter(Boolean))].sort(),
    [transactions],
  );

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      if (filters.status !== 'all' && transaction.status !== filters.status) return false;
      if (filters.department !== 'all' && transaction.departmentName !== filters.department) return false;
      if (filters.account !== 'all' && transaction.accountId !== filters.account) return false;
      if (
        filters.search &&
        !`${transaction.description} ${transaction.reference ?? ''}`.toLowerCase().includes(filters.search.toLowerCase())
      ) return false;
      return true;
    });
  }, [filters, transactions]);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    setSelectedIds(
      selectedIds.length === filteredTransactions.length ? [] : filteredTransactions.map((transaction) => transaction.id),
    );
  };

  const handleBulkVoid = async () => {
    const toVoid = filteredTransactions.filter(
      (transaction) => selectedIds.includes(transaction.id) && transaction.status !== 'Voided',
    );

    if (toVoid.length === 0) {
      showToast('warning', 'No Items', 'No eligible transactions selected');
      return;
    }

    setIsBulkProcessing(true);
    try {
      await Promise.all(toVoid.map((transaction) => voidTransaction(transaction.id)));
      setSelectedIds([]);
      showToast('success', 'Transactions Voided', `${toVoid.length} transactions were voided`);
    } catch {
      showToast('error', 'Bulk Action Failed', 'Unable to void selected transactions');
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const handleExport = () => {
    const headers = ['Date', 'Description', 'Department', 'Account', 'Amount', 'Status', 'Created By'];
    const rows = filteredTransactions.map((transaction) => [
      transaction.date,
      transaction.description,
      transaction.departmentName ?? '',
      transaction.accountName,
      transaction.amount,
      transaction.status,
      transaction.createdBy,
    ]);
    const csvContent = [headers.join(','), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('success', 'Exported', `Exported ${filteredTransactions.length} transactions`);
  };

  const getStatusColor = (status: FinanceTransaction['status']) => {
    switch (status) {
      case 'Posted':
        return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
      case 'Pending':
        return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20';
      case 'Processing':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'Voided':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: FinanceTransaction['status']) => {
    switch (status) {
      case 'Posted':
        return <CheckCircle2 className="h-3 w-3" />;
      case 'Pending':
      case 'Processing':
        return <Clock className="h-3 w-3" />;
      case 'Voided':
        return <Ban className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <PageLayout
      title="ORG – F-03 – Transactions Ledger"
      description="Complete transaction history from the finance service"
      subNav={<FinanceSubNav />}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      }
      kpis={[
        {
          title: 'Total Transactions',
          value: loading ? '...' : transactions.length.toString(),
          change: `${filteredTransactions.length} visible`,
          icon: <FileText className="h-5 w-5" />
        },
        {
          title: 'Pending',
          value: loading ? '...' : transactions.filter((transaction) => transaction.status === 'Pending').length.toString(),
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
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">Filters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search description..."
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
                { value: 'Pending', label: 'Pending' },
                { value: 'Processing', label: 'Processing' },
                { value: 'Posted', label: 'Posted' },
                { value: 'Voided', label: 'Voided' },
              ]}
            />

            <Select
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              options={[
                { value: 'all', label: 'All Departments' },
                ...departments.map((department) => ({ value: department ?? '', label: department ?? 'Unknown' })),
              ]}
            />

            <Select
              value={filters.account}
              onChange={(e) => setFilters({ ...filters, account: e.target.value })}
              options={[
                { value: 'all', label: 'All Accounts' },
                ...accounts.map((account) => ({ value: account.id, label: account.name })),
              ]}
            />
          </div>
        </div>

        {selectedIds.length > 0 && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="font-medium">{selectedIds.length} transaction(s) selected</p>
              <Button size="sm" onClick={handleBulkVoid} disabled={isBulkProcessing}>
                <Ban className="mr-2 h-4 w-4" />
                Void Selected
              </Button>
            </div>
          </div>
        )}

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
                  <th className="text-left p-4 text-sm font-medium">Account</th>
                  <th className="text-right p-4 text-sm font-medium">Amount</th>
                  <th className="text-left p-4 text-sm font-medium">Status</th>
                  <th className="text-left p-4 text-sm font-medium">Created By</th>
                  <th className="text-center p-4 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-12 text-center text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No transactions found</p>
                      <p className="text-sm mt-1">Adjust filters to view matching records</p>
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className={`hover:bg-muted/30 transition-colors ${selectedIds.includes(transaction.id) ? 'bg-primary/5' : ''}`}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(transaction.id)}
                          onChange={() => toggleSelection(transaction.id)}
                          className="w-4 h-4 rounded border-border"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span>{new Date(transaction.date).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-sm font-medium mb-1">{transaction.description}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{transaction.reference || transaction.category}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm px-2 py-1 bg-muted rounded">
                          {transaction.departmentName || 'General'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{transaction.accountName}</span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <DollarSign className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium">{transaction.amount.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded border ${getStatusColor(transaction.status)}`}>
                          {getStatusIcon(transaction.status)}
                          <span>{transaction.status}</span>
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{transaction.createdBy}</span>
                      </td>
                      <td className="p-4 text-center">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={transaction.status === 'Voided'}
                          onClick={async () => {
                            try {
                              await voidTransaction(transaction.id);
                              showToast('success', 'Transaction Voided', 'The transaction has been voided');
                            } catch {
                              showToast('error', 'Action Failed', 'Unable to void this transaction');
                            }
                          }}
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
