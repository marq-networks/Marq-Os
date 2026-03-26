// Placeholder exports for remaining ORG Finance screens
export { F01FinanceHome } from './F01FinanceHome';
export { F01FinanceInbox } from './F01FinanceInbox';
export { F02QuickAdd } from './F02QuickAdd';
export { F02QuickAddOperational } from './F02QuickAddOperational';
export { F03TransactionsLedger } from './F03TransactionsLedger';
export { F06ReviewDecideQueue } from './F06ReviewDecideQueue';
export { F12FinanceSettings } from './F12FinanceSettings';
export { F14ProjectBurnMargin } from './F14ProjectBurnMargin';

// Export FC (Finance Command/Control) screens
export { FC01FinanceCockpit } from './FC01FinanceCockpit';
export { FC02FinanceInbox } from './FC02FinanceInbox';
export { FC03QuickAddAdmin } from './FC03QuickAddAdmin';
export { FC04LedgerControl } from './FC04LedgerControl';
export { FC05Reimbursements } from './FC05Reimbursements';
export { FC06PayrollPosting } from './FC06PayrollPosting';
export { FC07CostingProfitCommand } from './FC07CostingProfitCommand';
export { FC08TeamFinancePermissions } from './FC08TeamFinancePermissions';
export { FC09FinanceSettings } from './FC09FinanceSettings';
export { FC10FinanceIntelligence } from './FC10FinanceIntelligence';

// All imports at the top
import { useState } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { DataTable } from '../../shared/DataTable';
import { StatusBadge } from '../../shared/StatusBadge';
import { Breadcrumb } from '../../shared/Breadcrumb';
import { FinanceTopTabs } from '../../../finance/components/FinanceTopTabs';
import { Button } from '../../ui/button';
import { 
  Wallet, 
  Download, 
  Building2, 
  CreditCard, 
  Filter,
  ArrowRight, 
  Upload, 
  Columns, 
  FileSearch, 
  Sparkles, 
  Eye, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  History,
  BarChart3,
  PieChart,
  TrendingUp,
  Calendar,
  Clock,
  RefreshCw,
  Send,
  Settings,
  DollarSign,
  TrendingDown,
  Calculator,
  Plus
} from 'lucide-react';
import { useFinanceData } from '../../../services/hooks';

export function F04AccountsWallets() {
  const { accounts, loading } = useFinanceData();

  const columns = [
    { key: 'name', header: 'Account' },
    { key: 'type', header: 'Type' },
    { key: 'balance', header: 'Balance', cell: (v: any) => `$${Number(v).toLocaleString()}` },
    { key: 'status', header: 'Status', cell: (v: string) => <StatusBadge type={v === 'Active' ? 'success' : 'neutral'}>{v}</StatusBadge> }
  ];

  return (
    <PageLayout
      title="ORG – F-04 – Accounts & Wallets"
      description="Manage your accounts"
      kpis={[{
        title: 'Total Balance',
        value: loading ? '—' : `$${accounts.reduce((s, a) => s + (a.balance ?? 0), 0).toLocaleString()}`,
        icon: <Wallet className="h-5 w-5" />
      }]}
    >
      <Breadcrumb items={[
        { label: 'Finance', path: '/org/finance/cockpit' },
        { label: 'Accounts & Wallets' }
      ]} />
      <FinanceTopTabs />
      <DataTable columns={columns} data={accounts} />
    </PageLayout>
  );
}

export function F05StatementImport() {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'complete'>('idle');

  const recentImports = [
    {
      id: '1',
      filename: 'chase_business_jan_2025.csv',
      bank: 'Chase Business',
      uploadDate: '2025-01-20 14:32',
      transactions: 127,
      matched: 98,
      pending: 29,
      status: 'Review Pending',
      progress: 77
    },
    {
      id: '2',
      filename: 'bofa_checking_dec_2024.ofx',
      bank: 'Bank of America',
      uploadDate: '2025-01-18 09:15',
      transactions: 84,
      matched: 84,
      pending: 0,
      status: 'Posted',
      progress: 100
    },
    {
      id: '3',
      filename: 'wells_fargo_statement.csv',
      bank: 'Wells Fargo',
      uploadDate: '2025-01-15 16:48',
      transactions: 156,
      matched: 142,
      pending: 14,
      status: 'Auto-Matching',
      progress: 91
    },
    {
      id: '4',
      filename: 'paypal_transactions.csv',
      bank: 'PayPal Business',
      uploadDate: '2025-01-12 11:20',
      transactions: 203,
      matched: 203,
      pending: 0,
      status: 'Posted',
      progress: 100
    },
    {
      id: '5',
      filename: 'stripe_payout_summary.csv',
      bank: 'Stripe',
      uploadDate: '2025-01-10 08:05',
      transactions: 67,
      matched: 67,
      pending: 0,
      status: 'Posted',
      progress: 100
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, 'success' | 'warning' | 'info' | 'neutral'> = {
      'Posted': 'success',
      'Review Pending': 'warning',
      'Auto-Matching': 'info',
      'Processing': 'info',
      'Failed': 'neutral',
    };
    return statusMap[status] || 'neutral';
  };

  const columns = [
    {
      key: 'filename',
      header: 'File Name',
      width: '25%',
      cell: (value: string, row: any) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-xs text-muted-foreground">{row.bank}</div>
        </div>
      )
    },
    {
      key: 'uploadDate',
      header: 'Upload Date',
      width: '15%',
      cell: (value: string) => (
        <span className="text-sm text-muted-foreground">{value}</span>
      )
    },
    {
      key: 'transactions',
      header: 'Transactions',
      width: '12%',
      cell: (value: number) => (
        <span className="font-mono text-sm">{value}</span>
      )
    },
    {
      key: 'matched',
      header: 'Matched',
      width: '10%',
      cell: (value: number, row: any) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-green-600 dark:text-green-400">{value}</span>
          <span className="text-xs text-muted-foreground">
            ({Math.round((value / row.transactions) * 100)}%)
          </span>
        </div>
      )
    },
    {
      key: 'pending',
      header: 'Pending',
      width: '10%',
      cell: (value: number) => (
        <span className="font-mono text-sm text-amber-600 dark:text-amber-400">{value}</span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      width: '18%',
      cell: (value: string, row: any) => (
        <div className="space-y-1">
          <StatusBadge type={getStatusBadge(value)}>{value}</StatusBadge>
          {row.progress < 100 && (
            <div className="w-full bg-muted rounded-full h-1.5">
              <div 
                className="bg-primary h-1.5 rounded-full transition-all" 
                style={{ width: `${row.progress}%` }}
              />
            </div>
          )}
        </div>
      )
    },
    {
      key: 'id',
      header: 'Actions',
      width: '10%',
      cell: (value: string, row: any) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  ];

  return (
    <PageLayout
      title="ORG – F-05 – Statement Import Center"
      description="Import and reconcile bank statements"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Templates
          </Button>
          <Button variant="outline" size="sm">
            <History className="mr-2 h-4 w-4" />
            History
          </Button>
          <Button size="sm">
            <Upload className="mr-2 h-4 w-4" />
            New Import
          </Button>
        </div>
      }
      kpis={[
        {
          title: 'Imports This Month',
          value: '23',
          change: '+8 from last month',
          changeType: 'positive',
          icon: <Upload className="h-5 w-5" />
        },
        {
          title: 'Total Transactions',
          value: '1,847',
          change: 'Imported this month',
          changeType: 'neutral',
          icon: <FileText className="h-5 w-5" />
        },
        {
          title: 'Auto-Match Rate',
          value: '94.2%',
          change: '+2.1% from last month',
          changeType: 'positive',
          icon: <CheckCircle className="h-5 w-5" />
        },
        {
          title: 'Pending Review',
          value: '43',
          change: '2 require attention',
          changeType: 'warning',
          icon: <AlertTriangle className="h-5 w-5" />
        },
      ]}
    >
      <Breadcrumb items={[
        { label: 'Finance', path: '/org/finance/cockpit' },
        { label: 'Import Center' }
      ]} />
      <FinanceTopTabs />
      <div className="space-y-6">
        {/* Import Workflow Pipeline */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-4 flex items-center gap-2">
            <ArrowRight className="h-5 w-5 text-primary" />
            Import Workflow Pipeline
          </h3>
          <div className="flex items-center justify-between gap-4">
            {[
              { step: '1', label: 'Upload', icon: Upload, status: 'complete' },
              { step: '2', label: 'Mapping', icon: Columns, status: 'complete' },
              { step: '3', label: 'Parsing', icon: FileSearch, status: 'complete' },
              { step: '4', label: 'Auto Match', icon: Sparkles, status: 'active' },
              { step: '5', label: 'Review', icon: Eye, status: 'pending' },
              { step: '6', label: 'Posted', icon: CheckCircle, status: 'pending' },
            ].map((item, idx, arr) => (
              <div key={item.step} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className={`
                    flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all
                    ${item.status === 'complete' ? 'border-green-500 bg-green-500/10 text-green-600 dark:text-green-400' : ''}
                    ${item.status === 'active' ? 'border-primary bg-primary/10 text-primary animate-pulse' : ''}
                    ${item.status === 'pending' ? 'border-muted bg-muted/50 text-muted-foreground' : ''}
                  `}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-xs text-muted-foreground">Step {item.step}</div>
                  </div>
                </div>
                {idx < arr.length - 1 && (
                  <div className={`h-0.5 flex-1 -mt-8 ${
                    item.status === 'complete' ? 'bg-green-500' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upload Zone */}
        <div className="rounded-lg border-2 border-dashed border-border bg-card/50 p-12 text-center hover:border-primary/50 hover:bg-card transition-all cursor-pointer">
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="mb-2">Drop bank statement files here</h3>
              <p className="text-sm text-muted-foreground">
                Supports CSV, OFX, QFX, QIF, XLSX formats • Max 10MB per file
              </p>
            </div>
            <Button size="lg">
              <Upload className="mr-2 h-4 w-4" />
              Choose Files
            </Button>
          </div>
        </div>

        {/* Quick Import Templates */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { bank: 'Chase', icon: Building2, color: 'blue' },
            { bank: 'Bank of America', icon: Building2, color: 'red' },
            { bank: 'Wells Fargo', icon: Building2, color: 'amber' },
            { bank: 'PayPal', icon: CreditCard, color: 'indigo' },
          ].map((template) => (
            <div
              key={template.bank}
              className="rounded-lg border border-border bg-card p-4 hover:border-primary/50 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-${template.color}-500/10`}>
                  <template.icon className={`h-5 w-5 text-${template.color}-600 dark:text-${template.color}-400`} />
                </div>
                <div>
                  <div className="font-medium text-sm">{template.bank}</div>
                  <div className="text-xs text-muted-foreground">Use template</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Imports Table */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3>Recent Imports</h3>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
          <DataTable columns={columns} data={recentImports} />
        </div>
      </div>
    </PageLayout>
  );
}

export function F07LogicLearning() {
  return (
    <PageLayout
      title="ORG – F-07 – Logic & Learning Center"
      description="Train AI classification rules"
    >
      <Breadcrumb items={[
        { label: 'Finance', path: '/org/finance/cockpit' },
        { label: 'Logic & Learning' }
      ]} />
      <FinanceTopTabs />
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <p>Narration rules, confidence scores, version history</p>
      </div>
    </PageLayout>
  );
}

export function F08CostingPricing() {
  return (
    <PageLayout
      title="ORG – F-08 – Costing & Pricing Intelligence"
      description="Department rates, overhead allocation, profit analysis"
    >
      <Breadcrumb items={[
        { label: 'Finance', path: '/org/finance/cockpit' },
        { label: 'Costing & Pricing' }
      ]} />
      <FinanceTopTabs />
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <p>Profit per hour/min, Quote Profit Check, What-if Simulations</p>
      </div>
    </PageLayout>
  );
}

export function F09Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('monthly');
  const [dateRange, setDateRange] = useState({ from: '2025-01-01', to: '2025-01-31' });

  const reportTypes = [
    {
      id: 'pl',
      name: 'Profit & Loss',
      description: 'Income statement showing revenue, expenses, and profit',
      icon: TrendingUp,
      color: 'green',
      lastGenerated: '2025-01-20',
      frequency: 'Monthly'
    },
    {
      id: 'balance',
      name: 'Balance Sheet',
      description: 'Assets, liabilities, and equity snapshot',
      icon: BarChart3,
      color: 'blue',
      lastGenerated: '2025-01-15',
      frequency: 'Quarterly'
    },
    {
      id: 'cashflow',
      name: 'Cash Flow Statement',
      description: 'Cash inflows and outflows by category',
      icon: PieChart,
      color: 'purple',
      lastGenerated: '2025-01-18',
      frequency: 'Monthly'
    },
    {
      id: 'networth',
      name: 'Net Worth Report',
      description: 'Total assets minus total liabilities over time',
      icon: Wallet,
      color: 'amber',
      lastGenerated: '2025-01-10',
      frequency: 'Annual'
    }
  ];

  const recentReports = [
    {
      id: '1',
      reportType: 'Profit & Loss',
      period: 'Jan 2025',
      generatedDate: '2025-01-20 15:42',
      generatedBy: 'Sarah Chen',
      format: 'PDF',
      status: 'Completed',
      size: '2.4 MB'
    },
    {
      id: '2',
      reportType: 'Cash Flow Statement',
      period: 'Jan 2025',
      generatedDate: '2025-01-18 11:23',
      generatedBy: 'Michael Rodriguez',
      format: 'Excel',
      status: 'Completed',
      size: '1.8 MB'
    },
    {
      id: '3',
      reportType: 'Balance Sheet',
      period: 'Q4 2024',
      generatedDate: '2025-01-15 09:15',
      generatedBy: 'Emily Park',
      format: 'PDF',
      status: 'Completed',
      size: '3.1 MB'
    },
    {
      id: '4',
      reportType: 'Profit & Loss',
      period: 'Dec 2024',
      generatedDate: '2025-01-05 14:30',
      generatedBy: 'Sarah Chen',
      format: 'PDF',
      status: 'Completed',
      size: '2.2 MB'
    },
    {
      id: '5',
      reportType: 'Net Worth Report',
      period: '2024 Annual',
      generatedDate: '2025-01-10 16:08',
      generatedBy: 'David Kim',
      format: 'Excel',
      status: 'Completed',
      size: '4.5 MB'
    }
  ];

  const columns = [
    {
      key: 'reportType',
      header: 'Report Type',
      width: '20%',
      cell: (value: string) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'period',
      header: 'Period',
      width: '15%',
      cell: (value: string) => (
        <span className="text-sm">{value}</span>
      )
    },
    {
      key: 'generatedDate',
      header: 'Generated',
      width: '18%',
      cell: (value: string) => (
        <div className="text-sm text-muted-foreground">{value}</div>
      )
    },
    {
      key: 'generatedBy',
      header: 'Generated By',
      width: '15%',
      cell: (value: string) => (
        <span className="text-sm">{value}</span>
      )
    },
    {
      key: 'format',
      header: 'Format',
      width: '10%',
      cell: (value: string) => (
        <StatusBadge type="info">{value}</StatusBadge>
      )
    },
    {
      key: 'size',
      header: 'Size',
      width: '10%',
      cell: (value: string) => (
        <span className="text-xs text-muted-foreground">{value}</span>
      )
    },
    {
      key: 'id',
      header: 'Actions',
      width: '12%',
      cell: (value: string) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <PageLayout
      title="ORG – F-09 – Reports & Statements"
      description="Generate and manage financial reports"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Clock className="mr-2 h-4 w-4" />
            Schedule
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      }
      kpis={[
        {
          title: 'Reports Generated',
          value: '156',
          change: '+23 this month',
          changeType: 'positive',
          icon: <FileText className="h-5 w-5" />
        },
        {
          title: 'Most Recent',
          value: 'P&L Jan 2025',
          change: 'Generated 2 days ago',
          changeType: 'neutral',
          icon: <Clock className="h-5 w-5" />
        },
        {
          title: 'Report Types',
          value: '4',
          change: 'Active report templates',
          changeType: 'neutral',
          icon: <BarChart3 className="h-5 w-5" />
        },
        {
          title: 'Scheduled Reports',
          value: '8',
          change: '3 running this week',
          changeType: 'info',
          icon: <Calendar className="h-5 w-5" />
        }
      ]}
    >
      <Breadcrumb items={[
        { label: 'Finance', path: '/org/finance/cockpit' },
        { label: 'Reports' }
      ]} />
      <FinanceTopTabs />
      <div className="space-y-6">
        {/* Period Selector */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Report Period Selection
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Period Type</label>
              <div className="flex gap-2">
                {['Monthly', 'Quarterly', 'Annual', 'Custom'].map((period) => (
                  <Button
                    key={period}
                    variant={selectedPeriod.toLowerCase() === period.toLowerCase() ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedPeriod(period.toLowerCase())}
                  >
                    {period}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                />
                <span className="flex items-center text-muted-foreground">to</span>
                <input
                  type="date"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Report Type Cards */}
        <div>
          <h3 className="mb-4">Available Reports</h3>
          <div className="grid grid-cols-2 gap-4">
            {reportTypes.map((report) => (
              <div
                key={report.id}
                className="rounded-lg border border-border bg-card p-6 hover:border-primary/50 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-${report.color}-500/10`}>
                      <report.icon className={`h-6 w-6 text-${report.color}-600 dark:text-${report.color}-400`} />
                    </div>
                    <div>
                      <h4 className="font-semibold">{report.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{report.description}</p>
                    </div>
                  </div>
                  <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    Generate
                  </Button>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs">Last: {report.lastGenerated}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <RefreshCw className="h-3 w-3" />
                      <span className="text-xs">{report.frequency}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export Options */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-4">Export Format</h3>
          <div className="flex gap-3">
            {[
              { format: 'PDF', icon: FileText, description: 'Printable document' },
              { format: 'Excel', icon: FileText, description: 'Editable spreadsheet' },
              { format: 'CSV', icon: FileText, description: 'Raw data export' },
              { format: 'Email', icon: Send, description: 'Send to recipients' }
            ].map((option) => (
              <div
                key={option.format}
                className="flex-1 rounded-lg border border-border bg-background p-4 hover:border-primary/50 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <option.icon className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium text-sm">{option.format}</div>
                    <div className="text-xs text-muted-foreground">{option.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reports Table */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3>Recent Reports</h3>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
          <DataTable columns={columns} data={recentReports} />
        </div>
      </div>
    </PageLayout>
  );
}

export function F10LoansLiabilities() {
  const activeLoans = [
    {
      id: '1',
      lender: 'Chase Business Capital',
      type: 'Business Term Loan',
      originalAmount: 500000,
      outstanding: 387500,
      interestRate: 6.5,
      emi: 8542,
      startDate: '2023-06-15',
      endDate: '2028-06-15',
      nextPaymentDate: '2025-02-15',
      status: 'Active',
      paymentsMade: 19,
      totalPayments: 60
    },
    {
      id: '2',
      lender: 'Bank of America',
      type: 'Equipment Financing',
      originalAmount: 250000,
      outstanding: 142500,
      interestRate: 5.2,
      emi: 4687,
      startDate: '2023-09-01',
      endDate: '2028-09-01',
      nextPaymentDate: '2025-02-01',
      status: 'Active',
      paymentsMade: 16,
      totalPayments: 60
    },
    {
      id: '3',
      lender: 'Wells Fargo Credit Line',
      type: 'Business Line of Credit',
      originalAmount: 100000,
      outstanding: 45000,
      interestRate: 8.75,
      emi: 328,
      startDate: '2024-03-01',
      endDate: '2027-03-01',
      nextPaymentDate: '2025-02-10',
      status: 'Active',
      paymentsMade: 10,
      totalPayments: 36
    },
    {
      id: '4',
      lender: 'SBA Loan Program',
      type: 'SBA 7(a) Loan',
      originalAmount: 750000,
      outstanding: 648750,
      interestRate: 4.8,
      emi: 11250,
      startDate: '2023-01-15',
      endDate: '2033-01-15',
      nextPaymentDate: '2025-02-15',
      status: 'Active',
      paymentsMade: 24,
      totalPayments: 120
    }
  ];

  const totalOutstanding = activeLoans.reduce((sum, loan) => sum + loan.outstanding, 0);
  const totalEMI = activeLoans.reduce((sum, loan) => sum + loan.emi, 0);
  const totalInterestPaid = activeLoans.reduce((sum, loan) => {
    const paid = (loan.originalAmount - loan.outstanding);
    const principalPaid = paid / (1 + (loan.interestRate / 100));
    return sum + (paid - principalPaid);
  }, 0);

  const columns = [
    {
      key: 'lender',
      header: 'Lender',
      width: '18%',
      cell: (value: string, row: any) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-xs text-muted-foreground">{row.type}</div>
        </div>
      )
    },
    {
      key: 'originalAmount',
      header: 'Original',
      width: '12%',
      cell: (value: number) => (
        <span className="font-mono text-sm">${(value / 1000).toFixed(0)}K</span>
      )
    },
    {
      key: 'outstanding',
      header: 'Outstanding',
      width: '12%',
      cell: (value: number) => (
        <span className="font-mono text-sm font-semibold">${(value / 1000).toFixed(1)}K</span>
      )
    },
    {
      key: 'interestRate',
      header: 'Rate',
      width: '8%',
      cell: (value: number) => (
        <span className="text-sm">{value}%</span>
      )
    },
    {
      key: 'emi',
      header: 'Monthly EMI',
      width: '12%',
      cell: (value: number) => (
        <span className="font-mono text-sm">${value.toLocaleString()}</span>
      )
    },
    {
      key: 'nextPaymentDate',
      header: 'Next Payment',
      width: '12%',
      cell: (value: string) => (
        <span className="text-sm text-muted-foreground">{value}</span>
      )
    },
    {
      key: 'paymentsMade',
      header: 'Progress',
      width: '16%',
      cell: (value: number, row: any) => (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span>{value}/{row.totalPayments}</span>
            <span className="text-muted-foreground">
              {Math.round((value / row.totalPayments) * 100)}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5">
            <div 
              className="bg-green-500 h-1.5 rounded-full transition-all" 
              style={{ width: `${(value / row.totalPayments) * 100}%` }}
            />
          </div>
        </div>
      )
    },
    {
      key: 'id',
      header: 'Actions',
      width: '10%',
      cell: (value: string) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Calculator className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <PageLayout
      title="ORG – F-10 – Loans & Liabilities"
      description="Track loans, credit lines, and liabilities"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calculator className="mr-2 h-4 w-4" />
            EMI Calculator
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Loan
          </Button>
        </div>
      }
      kpis={[
        {
          title: 'Total Outstanding',
          value: `$${(totalOutstanding / 1000).toFixed(0)}K`,
          change: '-$42K from last month',
          changeType: 'positive',
          icon: <DollarSign className="h-5 w-5" />
        },
        {
          title: 'Monthly Payment',
          value: `$${totalEMI.toLocaleString()}`,
          change: 'Total EMI due',
          changeType: 'neutral',
          icon: <Calendar className="h-5 w-5" />
        },
        {
          title: 'Active Loans',
          value: activeLoans.length.toString(),
          change: '1 maturing in 2025',
          changeType: 'info',
          icon: <CreditCard className="h-5 w-5" />
        },
        {
          title: 'Interest Paid YTD',
          value: `$${(totalInterestPaid / 1000).toFixed(1)}K`,
          change: 'Year to date 2025',
          changeType: 'neutral',
          icon: <TrendingDown className="h-5 w-5" />
        }
      ]}
    >
      <Breadcrumb items={[
        { label: 'Finance', path: '/org/finance/cockpit' },
        { label: 'Loans & Liabilities' }
      ]} />
      <FinanceTopTabs />
      <div className="space-y-6">
        {/* Active Loans Summary Cards */}
        <div>
          <h3 className="mb-4">Active Loans</h3>
          <div className="grid grid-cols-2 gap-4">
            {activeLoans.map((loan) => {
              const percentPaid = (loan.paymentsMade / loan.totalPayments) * 100;
              const percentOutstanding = (loan.outstanding / loan.originalAmount) * 100;
              
              return (
                <div
                  key={loan.id}
                  className="rounded-lg border border-border bg-card p-5 hover:border-primary/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold mb-1">{loan.lender}</h4>
                      <p className="text-xs text-muted-foreground">{loan.type}</p>
                    </div>
                    <StatusBadge type="success">Active</StatusBadge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Outstanding</div>
                      <div className="font-mono font-semibold">
                        ${(loan.outstanding / 1000).toFixed(1)}K
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Monthly EMI</div>
                      <div className="font-mono font-semibold">
                        ${loan.emi.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Interest Rate</div>
                      <div className="text-sm font-medium">{loan.interestRate}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Next Payment</div>
                      <div className="text-sm">{loan.nextPaymentDate}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Payment Progress</span>
                      <span className="font-medium">
                        {loan.paymentsMade} / {loan.totalPayments} ({Math.round(percentPaid)}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all" 
                        style={{ width: `${percentPaid}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Amount Repaid</span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        ${((loan.originalAmount - loan.outstanding) / 1000).toFixed(1)}K of ${(loan.originalAmount / 1000).toFixed(0)}K
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Schedule */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Upcoming Payments
          </h3>
          <div className="space-y-3">
            {activeLoans
              .sort((a, b) => new Date(a.nextPaymentDate).getTime() - new Date(b.nextPaymentDate).getTime())
              .map((loan) => (
                <div key={loan.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{loan.lender}</div>
                      <div className="text-xs text-muted-foreground">{loan.type}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Due Date</div>
                      <div className="text-sm font-medium">{loan.nextPaymentDate}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Amount</div>
                      <div className="font-mono font-semibold">${loan.emi.toLocaleString()}</div>
                    </div>
                    <Button size="sm">
                      Pay Now
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Detailed Loans Table */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3>All Loans & Liabilities</h3>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
          <DataTable columns={columns} data={activeLoans} />
        </div>

        {/* Loan Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Borrowed</div>
                <div className="font-mono text-xl font-semibold">
                  ${(activeLoans.reduce((s, l) => s + l.originalAmount, 0) / 1000).toFixed(0)}K
                </div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Across {activeLoans.length} active loans
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <TrendingDown className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Repaid</div>
                <div className="font-mono text-xl font-semibold text-green-600 dark:text-green-400">
                  ${(activeLoans.reduce((s, l) => s + (l.originalAmount - l.outstanding), 0) / 1000).toFixed(0)}K
                </div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {Math.round((activeLoans.reduce((s, l) => s + (l.originalAmount - l.outstanding), 0) / activeLoans.reduce((s, l) => s + l.originalAmount, 0)) * 100)}% of total borrowed
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Calculator className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Avg Interest Rate</div>
                <div className="font-mono text-xl font-semibold">
                  {(activeLoans.reduce((s, l) => s + l.interestRate, 0) / activeLoans.length).toFixed(2)}%
                </div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Weighted across all loans
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export function F11TeamPermissions() {
  return (
    <PageLayout
      title="ORG – F-11 – Team & Permissions"
      description="Manage finance team access"
    >
      <Breadcrumb items={[
        { label: 'Finance', path: '/org/finance/cockpit' },
        { label: 'Team Permissions' }
      ]} />
      <FinanceTopTabs />
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <p>Team members, roles, permissions</p>
      </div>
    </PageLayout>
  );
}