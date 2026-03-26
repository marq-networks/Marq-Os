import { useState } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import {
  DollarSign, Download, Calendar, CheckCircle2, Users,
  RefreshCw, Play, FileText, TrendingUp, ChevronDown, ChevronUp,
} from 'lucide-react';
import { useFinanceData } from '../../../services';
import type { PayrollRun, Payslip } from '../../../services/types';
import { toast } from 'sonner';

const RUN_STATUS_CONFIG: Record<string, { type: 'success' | 'warning' | 'info' | 'error' | 'neutral'; label: string }> = {
  Draft:      { type: 'warning', label: 'Draft' },
  Processing: { type: 'info', label: 'Processing' },
  Processed:  { type: 'success', label: 'Processed' },
  Failed:     { type: 'error', label: 'Failed' },
};

const PAYSLIP_STATUS_CONFIG: Record<string, { type: 'success' | 'warning' | 'info' | 'neutral' }> = {
  Processed:  { type: 'success' },
  Processing: { type: 'info' },
  Pending:    { type: 'warning' },
};

export function A24Payroll() {
  const { payrollRuns, payslips, loading, processPayrollRun, refresh } = useFinanceData();
  const [expandedRun, setExpandedRun] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  const currentRun = payrollRuns.find(r => r.status === 'Draft') || payrollRuns[0];
  const latestProcessed = payrollRuns.filter(r => r.status === 'Processed')[0];

  const handleProcess = async (runId: string) => {
    setProcessing(runId);
    try {
      await processPayrollRun(runId, 'Alex Rivera');
      toast.success('Payroll processed successfully — payslips generated and auto-posted to Finance ledger');
    } catch (e: any) {
      toast.error(e.message || 'Failed to process payroll');
    } finally {
      setProcessing(null);
    }
  };

  const getPayslipsForRun = (run: PayrollRun): Payslip[] =>
    payslips.filter(p => p.payrollRunId === run.id);

  const fmt = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;

  return (
    <PageLayout
      title="ADMIN – A-24 – Payroll"
      description="Payroll runs and payslip management — wired to useFinanceData()"
      actions={
        <>
          <Button variant="outline" size="sm" onClick={refresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </>
      }
      kpis={[
        {
          title: 'Current Run Total',
          value: currentRun ? fmt(currentRun.totalGross) : '—',
          change: currentRun?.period || 'No active run',
          changeType: 'neutral',
          icon: <DollarSign className="h-5 w-5" />,
        },
        {
          title: 'Employees',
          value: String(currentRun?.employeeCount || 0),
          change: 'In current run',
          changeType: 'neutral',
          icon: <Users className="h-5 w-5" />,
        },
        {
          title: 'Net Payout',
          value: currentRun ? fmt(currentRun.totalNet) : '—',
          change: `Deductions: ${currentRun ? fmt(currentRun.totalDeductions) : '—'}`,
          changeType: 'neutral',
          icon: <TrendingUp className="h-5 w-5" />,
        },
        {
          title: 'Last Processed',
          value: latestProcessed?.period || '—',
          change: latestProcessed ? `${fmt(latestProcessed.totalNet)} net` : '—',
          changeType: 'positive',
          icon: <CheckCircle2 className="h-5 w-5" />,
        },
      ]}
    >
      {loading && payrollRuns.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          Loading payroll data…
        </div>
      ) : (
        <div className="space-y-4">
          {payrollRuns.map(run => {
            const runPayslips = getPayslipsForRun(run);
            const isExpanded = expandedRun === run.id;
            const isProcessing = processing === run.id;
            const statusCfg = RUN_STATUS_CONFIG[run.status];

            return (
              <div
                key={run.id}
                className={`rounded-lg border bg-card overflow-hidden ${
                  run.status === 'Draft' ? 'border-yellow-300 dark:border-yellow-800' : 'border-border'
                }`}
              >
                {/* Run Header */}
                <div className="flex items-center justify-between gap-4 px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base">{run.period}</h3>
                        <StatusBadge type={statusCfg.type}>{statusCfg.label}</StatusBadge>
                        {run.status === 'Draft' && (
                          <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded-full font-medium">
                            Action Required
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span><Users className="h-3 w-3 inline mr-1" />{run.employeeCount} employees</span>
                        <span><DollarSign className="h-3 w-3 inline mr-0.5" />Gross: {fmt(run.totalGross)}</span>
                        <span>Net: {fmt(run.totalNet)}</span>
                        <span>Deductions: {fmt(run.totalDeductions)}</span>
                      </div>
                      {run.processedBy && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Processed by {run.processedBy} · {run.processedAt ? new Date(run.processedAt).toLocaleDateString() : ''}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {run.status === 'Draft' && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleProcess(run.id)}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <><RefreshCw className="mr-2 h-4 w-4 animate-spin" />Processing…</>
                        ) : (
                          <><Play className="mr-2 h-4 w-4" />Process Payroll</>
                        )}
                      </Button>
                    )}
                    {run.status === 'Processed' && (
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-3 w-3" />
                        Download
                      </Button>
                    )}
                    {runPayslips.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setExpandedRun(isExpanded ? null : run.id)}
                      >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        <span className="ml-1">{runPayslips.length} payslips</span>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Payslips Table (expanded) */}
                {isExpanded && runPayslips.length > 0 && (
                  <div className="border-t border-border bg-muted/10">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-muted/20">
                          <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Employee</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Department</th>
                          <th className="px-4 py-2 text-right text-xs font-semibold text-muted-foreground">Gross</th>
                          <th className="px-4 py-2 text-right text-xs font-semibold text-muted-foreground">Deductions</th>
                          <th className="px-4 py-2 text-right text-xs font-semibold text-muted-foreground">Net Pay</th>
                          <th className="px-4 py-2 text-center text-xs font-semibold text-muted-foreground">Status</th>
                          <th className="px-4 py-2 text-center text-xs font-semibold text-muted-foreground">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {runPayslips.map(payslip => {
                          const psCfg = PAYSLIP_STATUS_CONFIG[payslip.status];
                          return (
                            <tr key={payslip.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                              <td className="px-4 py-2">
                                <p className="text-sm font-medium">{payslip.employeeName}</p>
                                {payslip.bonus > 0 && (
                                  <p className="text-xs text-muted-foreground">Incl. {fmt(payslip.bonus)} bonus</p>
                                )}
                              </td>
                              <td className="px-4 py-2 text-sm text-muted-foreground">{payslip.department}</td>
                              <td className="px-4 py-2 text-right text-sm font-medium">{fmt(payslip.grossSalary)}</td>
                              <td className="px-4 py-2 text-right text-sm text-red-600 dark:text-red-400">−{fmt(payslip.deductions)}</td>
                              <td className="px-4 py-2 text-right text-sm font-semibold text-green-700 dark:text-green-400">{fmt(payslip.netPay)}</td>
                              <td className="px-4 py-2 text-center">
                                <StatusBadge type={psCfg.type}>{payslip.status}</StatusBadge>
                              </td>
                              <td className="px-4 py-2 text-center">
                                {payslip.pdfUrl ? (
                                  <button className="text-xs text-primary hover:underline flex items-center gap-1 mx-auto">
                                    <FileText className="h-3 w-3" />
                                    PDF
                                  </button>
                                ) : (
                                  <span className="text-xs text-muted-foreground">Pending</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border">
        <p className="text-xs text-muted-foreground">
          <strong>Service Layer ✓</strong> — Payroll runs from <code className="font-mono">useFinanceData().payrollRuns</code>.
          Processing a run marks all payslips as Processed and auto-posts to Finance via <code className="font-mono">finance.processPayrollRun()</code>.
        </p>
      </div>
    </PageLayout>
  );
}
