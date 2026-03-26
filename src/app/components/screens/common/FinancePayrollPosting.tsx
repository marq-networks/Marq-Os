import { PageLayout } from '../../shared/PageLayout';
import { StatusBadge } from '../../shared/StatusBadge';
import { DataTable } from '../../shared/DataTable';
import { Button } from '../../ui/button';
import { useFinanceData } from '../../../services/hooks';
import {
  CreditCard, DollarSign, CheckCircle2, Clock, Send, FileText, ArrowRight,
} from 'lucide-react';

export function FinancePayrollPosting() {
  const { payrollRuns, payslips, processPayrollRun, loading } = useFinanceData();

  const draftRuns = payrollRuns.filter(r => r.status === 'Draft');
  const processedRuns = payrollRuns.filter(r => r.status === 'Processed');
  const totalPosted = processedRuns.reduce((s, r) => s + r.totalNet, 0);

  const handleProcess = async (id: string) => {
    if (window.confirm('Process this payroll run? This will generate payslips for all employees.')) {
      await processPayrollRun(id, 'Alex Rivera');
    }
  };

  const fmt = (v: number) => `$${v.toLocaleString()}`;

  const columns = [
    {
      key: 'period', header: 'Period',
      cell: (val: string, row: any) => (
        <div>
          <span className="font-medium text-sm">{val}</span>
          <p className="text-xs text-muted-foreground font-mono">{row.id}</p>
        </div>
      ),
    },
    { key: 'employeeCount', header: 'Employees', cell: (val: number) => <span className="tabular-nums">{val}</span> },
    { key: 'totalGross', header: 'Gross Pay', cell: (val: number) => <span className="font-medium tabular-nums">{fmt(val)}</span> },
    { key: 'totalDeductions', header: 'Deductions', cell: (val: number) => <span className="text-red-600 tabular-nums">-{fmt(val)}</span> },
    { key: 'totalNet', header: 'Net Pay', cell: (val: number) => <span className="font-medium text-green-600 tabular-nums">{fmt(val)}</span> },
    {
      key: 'status', header: 'Status',
      cell: (val: string) => <StatusBadge type={val === 'Processed' ? 'success' : val === 'Draft' ? 'warning' : 'neutral'}>{val}</StatusBadge>,
    },
    {
      key: 'processedAt', header: 'Processed',
      cell: (val: string, row: any) => val ? (
        <div className="text-xs text-muted-foreground">
          <div>{new Date(val).toLocaleDateString()}</div>
          <div>by {row.processedBy}</div>
        </div>
      ) : <span className="text-xs text-muted-foreground">—</span>,
    },
    {
      key: 'actions', header: '',
      cell: (_: any, row: any) => row.status === 'Draft' ? (
        <Button size="sm" onClick={() => handleProcess(row.id)}>
          <Send className="h-3.5 w-3.5 mr-1.5" /> Process
        </Button>
      ) : (
        <Button size="sm" variant="outline">
          <FileText className="h-3.5 w-3.5 mr-1.5" /> View
        </Button>
      ),
    },
  ];

  return (
    <PageLayout
      title="Payroll Posting"
      description="Process and post payroll runs, generate payslips, and manage payment batches"
      kpis={[
        { title: 'Draft Runs', value: draftRuns.length, change: 'Ready to process', changeType: draftRuns.length > 0 ? 'warning' : 'positive', icon: <Clock className="h-5 w-5" /> },
        { title: 'Processed', value: processedRuns.length, change: 'Completed runs', changeType: 'positive', icon: <CheckCircle2 className="h-5 w-5" /> },
        { title: 'Total Posted', value: `$${(totalPosted / 1000).toFixed(0)}K`, changeType: 'neutral', icon: <DollarSign className="h-5 w-5" /> },
        { title: 'Payslips', value: payslips.length, change: 'Generated', changeType: 'neutral', icon: <CreditCard className="h-5 w-5" /> },
      ]}
    >
      {/* Processing workflow */}
      <div className="mb-6 rounded-lg border border-border bg-card p-6">
        <h3 className="font-medium mb-4">Payroll Processing Workflow</h3>
        <div className="flex items-center justify-between">
          {[
            { step: '1', label: 'Draft', desc: 'Review data', active: draftRuns.length > 0 },
            { step: '2', label: 'Validate', desc: 'Check errors', active: false },
            { step: '3', label: 'Approve', desc: 'Manager sign-off', active: false },
            { step: '4', label: 'Process', desc: 'Generate payslips', active: false },
            { step: '5', label: 'Post', desc: 'Transfer funds', active: false },
          ].map((s, i, arr) => (
            <div key={s.step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  s.active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {s.step}
                </div>
                <p className="text-xs font-medium mt-1.5">{s.label}</p>
                <p className="text-[10px] text-muted-foreground">{s.desc}</p>
              </div>
              {i < arr.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground mx-4 mt-[-20px]" />}
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-14 bg-muted animate-pulse rounded-lg" />)}
        </div>
      ) : (
        <DataTable columns={columns} data={payrollRuns} />
      )}
    </PageLayout>
  );
}
