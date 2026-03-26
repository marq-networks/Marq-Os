import { useState } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import {
  FileText, Download, Play, Calendar, DollarSign, BarChart3, CreditCard, Receipt,
} from 'lucide-react';

interface FinanceReport {
  id: string; name: string; description: string; category: string;
  icon: typeof FileText; format: string; frequency: string; lastGenerated: string;
}

const REPORTS: FinanceReport[] = [
  { id: 'fr1', name: 'Profit & Loss Statement', description: 'Monthly P&L with revenue, expenses, and net income', category: 'Statements', icon: BarChart3, format: 'PDF', frequency: 'Monthly', lastGenerated: '2026-03-01' },
  { id: 'fr2', name: 'Balance Sheet', description: 'Assets, liabilities, and equity snapshot', category: 'Statements', icon: DollarSign, format: 'PDF', frequency: 'Monthly', lastGenerated: '2026-03-01' },
  { id: 'fr3', name: 'Cash Flow Report', description: 'Operating, investing, and financing cash flows', category: 'Statements', icon: DollarSign, format: 'Excel', frequency: 'Monthly', lastGenerated: '2026-03-01' },
  { id: 'fr4', name: 'Payroll Summary', description: 'Gross pay, deductions, net pay by department', category: 'Payroll', icon: CreditCard, format: 'Excel', frequency: 'Monthly', lastGenerated: '2026-02-28' },
  { id: 'fr5', name: 'Expense Analysis', description: 'Expense breakdown by category and department', category: 'Expenses', icon: Receipt, format: 'Excel', frequency: 'Weekly', lastGenerated: '2026-03-03' },
  { id: 'fr6', name: 'Accounts Receivable Aging', description: 'Outstanding invoices by aging bucket', category: 'Receivables', icon: Calendar, format: 'PDF', frequency: 'Weekly', lastGenerated: '2026-03-03' },
  { id: 'fr7', name: 'Budget Variance Report', description: 'Actual vs budget with variance analysis', category: 'Budgets', icon: BarChart3, format: 'Excel', frequency: 'Monthly', lastGenerated: '2026-03-01' },
  { id: 'fr8', name: 'Tax Liability Report', description: 'Estimated tax obligations and withholdings', category: 'Tax', icon: FileText, format: 'PDF', frequency: 'Quarterly', lastGenerated: '2026-01-15' },
];

const CATEGORY_COLOR: Record<string, string> = {
  Statements: 'bg-blue-500/10 text-blue-700', Payroll: 'bg-green-500/10 text-green-700',
  Expenses: 'bg-orange-500/10 text-orange-700', Receivables: 'bg-purple-500/10 text-purple-700',
  Budgets: 'bg-indigo-500/10 text-indigo-700', Tax: 'bg-red-500/10 text-red-700',
};

export function FinanceReports() {
  const [generating, setGenerating] = useState<string | null>(null);

  const handleGenerate = (id: string) => {
    setGenerating(id);
    setTimeout(() => { setGenerating(null); alert('Report generated successfully!'); }, 1500);
  };

  return (
    <PageLayout
      title="Finance Reports"
      description="Generate and download financial statements, payroll reports, and analysis"
      kpis={[
        { title: 'Reports', value: REPORTS.length, change: `${[...new Set(REPORTS.map(r => r.category))].length} categories`, changeType: 'neutral', icon: <FileText className="h-5 w-5" /> },
        { title: 'Statements', value: REPORTS.filter(r => r.category === 'Statements').length, changeType: 'neutral', icon: <BarChart3 className="h-5 w-5" /> },
        { title: 'Last Generated', value: 'Mar 3', changeType: 'neutral', icon: <Calendar className="h-5 w-5" /> },
        { title: 'Formats', value: 'PDF / Excel', changeType: 'neutral', icon: <Download className="h-5 w-5" /> },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REPORTS.map(report => {
          const Icon = report.icon;
          const isGenerating = generating === report.id;
          return (
            <div key={report.id} className="rounded-lg border border-border bg-card p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start gap-4">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${CATEGORY_COLOR[report.category] || 'bg-muted'}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{report.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5 mb-2">{report.description}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className={`px-2 py-0.5 rounded-full ${CATEGORY_COLOR[report.category]}`}>{report.category}</span>
                    <span>{report.frequency}</span>
                    <span>{report.format}</span>
                    <span>Last: {new Date(report.lastGenerated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-3 border-t border-border">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => handleGenerate(report.id)} disabled={isGenerating}>
                  {isGenerating ? 'Generating...' : <><Play className="h-3 w-3 mr-1.5" /> Generate</>}
                </Button>
                <Button size="sm" variant="outline"><Download className="h-3 w-3 mr-1.5" /> Download</Button>
              </div>
            </div>
          );
        })}
      </div>
    </PageLayout>
  );
}
