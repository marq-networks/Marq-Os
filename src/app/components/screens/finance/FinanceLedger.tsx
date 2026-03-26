/**
 * ⛔ DEPRECATED — Phase 14 gap closure (FL-001)
 * This file is no longer rendered by any route or nav entry.
 * Use FC04LedgerControl (screens/org/) for all ledger functionality.
 * common/FinanceLedger.tsx now re-exports FC04LedgerControl.
 * This file will be removed in Phase 15.
 */
import { PageLayout } from '../../shared/PageLayout';
import { Card3D } from '../../shared/Card3D';
import { StatusBadge } from '../../shared/StatusBadge';
import { Breadcrumb } from '../../shared/Breadcrumb';
import { FinanceTopTabs } from '../../../finance/components/FinanceTopTabs';
import { useLedger } from '../../../stores/ledgerStore';
import { useRouter } from '../../router';
import { 
  BookOpen, 
  Plus, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Filter,
  Download,
  Calendar
} from 'lucide-react';

export function FinanceLedger() {
  const { entries, currentBalance, totalCredits, totalDebits } = useLedger();
  const { navigate } = useRouter();
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter entries
  const filteredEntries = entries.filter(entry => {
    const matchesType = filterType === 'all' || entry.entryType === filterType;
    const matchesSearch = searchTerm === '' || 
      entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.reference.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getEntryTypeColor = (type: string) => {
    switch (type) {
      case 'income':
        return 'success';
      case 'expense':
        return 'warning';
      case 'salary':
        return 'error';
      case 'reimbursement':
        return 'neutral';
      case 'adjustment':
        return 'info';
      default:
        return 'neutral';
    }
  };

  const getEntryTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <PageLayout
      title="Finance Ledger"
      description="Append-only financial ledger with auto-balancing"
    >
      <Breadcrumb items={[
        { label: 'Finance', path: '/finance/cockpit' },
        { label: 'Ledger' }
      ]} />
      <FinanceTopTabs />
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card3D>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Current Balance</p>
                <p className="text-2xl font-bold">{formatCurrency(currentBalance)}</p>
              </div>
              <div className="p-2 rounded-lg bg-blue-500/10">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </Card3D>

          <Card3D>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Total Credits</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalCredits)}</p>
                <p className="text-xs text-muted-foreground mt-1">Money In</p>
              </div>
              <div className="p-2 rounded-lg bg-green-500/10">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </Card3D>

          <Card3D>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Total Debits</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDebits)}</p>
                <p className="text-xs text-muted-foreground mt-1">Money Out</p>
              </div>
              <div className="p-2 rounded-lg bg-red-500/10">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </Card3D>

          <Card3D>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Total Entries</p>
                <p className="text-2xl font-bold">{entries.length}</p>
                <p className="text-xs text-muted-foreground mt-1">All Time</p>
              </div>
              <div className="p-2 rounded-lg bg-purple-500/10">
                <BookOpen className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </Card3D>
        </div>

        {/* Controls */}
        <Card3D>
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              {/* Search */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search description or reference..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                />
              </div>

              {/* Filter by Type */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                  <option value="salary">Salary</option>
                  <option value="reimbursement">Reimbursement</option>
                  <option value="adjustment">Adjustment</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/finance/quick-add')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span className="text-sm font-medium">Quick Add</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors">
                <Download className="h-4 w-4" />
                <span className="text-sm font-medium">Export</span>
              </button>
            </div>
          </div>
        </Card3D>

        {/* Ledger Table */}
        <Card3D>
          <div className="mb-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Ledger Entries
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Chronological, append-only, auto-balancing ledger
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground">Date</th>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground">Entry Type</th>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground">Reference</th>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground">Description</th>
                  <th className="text-right p-3 text-xs font-semibold text-muted-foreground">Debit</th>
                  <th className="text-right p-3 text-xs font-semibold text-muted-foreground">Credit</th>
                  <th className="text-right p-3 text-xs font-semibold text-muted-foreground">Balance</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center p-8 text-muted-foreground">
                      No entries found
                    </td>
                  </tr>
                ) : (
                  filteredEntries.map((entry) => (
                    <tr 
                      key={entry.id} 
                      className="border-b border-border/50 hover:bg-accent/30 transition-colors"
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {formatDate(entry.date)}
                        </div>
                      </td>
                      <td className="p-3">
                        <StatusBadge type={getEntryTypeColor(entry.entryType)}>
                          {getEntryTypeLabel(entry.entryType)}
                        </StatusBadge>
                      </td>
                      <td className="p-3">
                        <p className="text-sm font-medium">{entry.reference}</p>
                        {entry.category && (
                          <p className="text-xs text-muted-foreground">{entry.category}</p>
                        )}
                      </td>
                      <td className="p-3">
                        <p className="text-sm">{entry.description}</p>
                      </td>
                      <td className="p-3 text-right">
                        {entry.debit > 0 ? (
                          <span className="text-sm font-semibold text-red-600">
                            {formatCurrency(entry.debit)}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        {entry.credit > 0 ? (
                          <span className="text-sm font-semibold text-green-600">
                            {formatCurrency(entry.credit)}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <span className="text-sm font-bold">{formatCurrency(entry.balance)}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filteredEntries.length > 0 && (
            <div className="mt-4 p-4 bg-accent/30 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Showing {filteredEntries.length} of {entries.length} entries
                </span>
                <span className="font-semibold">
                  Final Balance: {formatCurrency(currentBalance)}
                </span>
              </div>
            </div>
          )}
        </Card3D>

        {/* Immutability Notice */}
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            <strong className="text-blue-600">Ledger Immutability:</strong> This ledger is append-only. 
            Entries cannot be edited or deleted. For corrections, use Manual Adjustment entries with proper 
            descriptions. All entries are timestamped and maintain a running balance for full auditability.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}