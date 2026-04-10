import { PageLayout } from '../../shared/PageLayout';
import { Button } from '../../ui/button';
import { DollarSign, Download, Calendar, TrendingUp, Eye, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useCurrentEmployee, useFinanceData } from '../../../services';

interface PayslipDeduction {
  name: string;
  amount: number;
}

interface Payslip {
  id: string;
  payPeriod: string;
  payDate: string;
  grossPay: number;
  deductions: PayslipDeduction[];
  netPay: number;
  paymentStatus: 'scheduled' | 'paid' | 'processing';
  department: string;
  bankAccount: string;
}

export function M04PayslipsHistory() {
  const { employeeId } = useCurrentEmployee();
  const { payslips: allPayslips, loading } = useFinanceData();
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const payslips: Payslip[] = useMemo(
    () =>
      allPayslips
        .filter((payslip) => !employeeId || payslip.employeeId === employeeId)
        .map((payslip) => ({
          id: payslip.id,
          payPeriod: payslip.period,
          payDate: payslip.paymentDate || `${payslip.month}-28`,
          grossPay: payslip.grossSalary,
          deductions: payslip.breakdown
            .filter((item) => item.type === 'deduction')
            .map((item) => ({ name: item.label, amount: item.amount })),
          netPay: payslip.netPay,
          paymentStatus: payslip.status === 'Processed' ? 'paid' : payslip.status === 'Pending' ? 'scheduled' : 'processing',
          department: payslip.department,
          bankAccount: '****4521',
        })),
    [allPayslips, employeeId],
  );

  const totalGrossPay = payslips.reduce((sum, p) => sum + p.grossPay, 0);
  const totalDeductions = payslips.reduce((sum, p) => sum + p.deductions.reduce((dSum, d) => dSum + d.amount, 0), 0);
  const totalNetPay = payslips.reduce((sum, p) => sum + p.netPay, 0);
  const paidCount = payslips.filter(p => p.paymentStatus === 'paid').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Calendar className="h-3 w-3" />
            Scheduled
          </span>
        );
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
            <DollarSign className="h-3 w-3" />
            Paid
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20">
            <TrendingUp className="h-3 w-3" />
            Processing
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getTotalDeductions = (deductions: PayslipDeduction[]) => {
    return deductions.reduce((sum, d) => sum + d.amount, 0);
  };

  return (
    <PageLayout
      title="TEAM – M-04 – Payslips & Payroll History"
      description="View your salary statements, deductions, and payment history"
      actions={
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download All
        </Button>
      }
      kpis={[
        {
          title: 'Total Gross Pay (6 months)',
          value: formatCurrency(totalGrossPay),
          change: 'Pre-deduction earnings',
          changeType: 'neutral',
          icon: <DollarSign className="h-5 w-5" />
        },
        {
          title: 'Total Deductions',
          value: formatCurrency(totalDeductions),
          change: 'Taxes + Benefits',
          changeType: 'neutral',
          icon: <TrendingUp className="h-5 w-5" />
        },
        {
          title: 'Total Net Pay',
          value: formatCurrency(totalNetPay),
          change: 'Actual received',
          changeType: 'positive',
          icon: <DollarSign className="h-5 w-5" />
        },
        {
          title: 'Payslips',
          value: loading ? '...' : paidCount.toString(),
          change: `${payslips.length} total`,
          changeType: 'neutral',
          icon: <FileText className="h-5 w-5" />
        }
      ]}
    >
      <div className="space-y-6">
        {/* Upcoming Payroll Banner */}
        {payslips.some(p => p.paymentStatus === 'scheduled') && (
          <div className="bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border-2 border-blue-500/20 rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold mb-2">Upcoming Payroll</h3>
                <p className="text-sm text-muted-foreground mb-4">Your next salary payment is scheduled</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-card/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Pay Date</p>
                    <p className="text-xl font-bold">{formatDate(payslips[0].payDate)}</p>
                  </div>
                  <div className="bg-card/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Net Amount</p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(payslips[0].netPay)}
                    </p>
                  </div>
                  <div className="bg-card/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Account</p>
                    <p className="text-xl font-bold font-mono">{payslips[0].bankAccount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payslips Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold w-8"></th>
                  <th className="text-left px-6 py-4 text-sm font-semibold">ID</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold">Pay Period</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold">Pay Date</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold">Gross Pay</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold">Deductions</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold">Net Pay</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold">Status</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payslips.map((payslip) => (
                  <>
                    <tr
                      key={payslip.id}
                      className="border-b border-border hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setExpandedRow(expandedRow === payslip.id ? null : payslip.id)}
                          className="p-1 hover:bg-muted rounded"
                        >
                          {expandedRow === payslip.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-muted-foreground">{payslip.id}</span>
                      </td>
                      <td className="px-6 py-4 text-sm">{payslip.payPeriod}</td>
                      <td className="px-6 py-4 text-sm font-medium">{formatDate(payslip.payDate)}</td>
                      <td className="px-6 py-4 text-right text-sm">{formatCurrency(payslip.grossPay)}</td>
                      <td className="px-6 py-4 text-right text-sm text-red-600 dark:text-red-400">
                        -{formatCurrency(getTotalDeductions(payslip.deductions))}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(payslip.netPay)}
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(payslip.paymentStatus)}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedPayslip(payslip)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                    {expandedRow === payslip.id && (
                      <tr className="bg-muted/20">
                        <td colSpan={9} className="px-6 py-4">
                          <div className="pl-8 space-y-3">
                            <h4 className="font-semibold text-sm mb-3">Deduction Breakdown</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {payslip.deductions.map((deduction) => (
                                <div key={`${payslip.id}-${deduction.name}`} className="bg-card rounded-lg p-3 border border-border">
                                  <p className="text-xs text-muted-foreground mb-1">{deduction.name}</p>
                                  <p className="font-semibold text-red-600 dark:text-red-400">
                                    -{formatCurrency(deduction.amount)}
                                  </p>
                                </div>
                              ))}
                            </div>
                            <div className="flex items-center gap-4 pt-3 border-t border-border mt-4">
                              <div className="bg-card rounded-lg p-3 border border-border">
                                <p className="text-xs text-muted-foreground mb-1">Department</p>
                                <p className="font-semibold">{payslip.department}</p>
                              </div>
                              <div className="bg-card rounded-lg p-3 border border-border">
                                <p className="text-xs text-muted-foreground mb-1">Bank Account</p>
                                <p className="font-mono font-semibold">{payslip.bankAccount}</p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Year-to-Date Summary */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4">Year-to-Date Summary (2025-2026)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-2">Total Gross Income</p>
              <p className="text-2xl font-bold">{formatCurrency(totalGrossPay)}</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-2">Total Deductions</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                -{formatCurrency(totalDeductions)}
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-2">Total Net Received</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(totalNetPay)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Drawer */}
      {selectedPayslip && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end"
          onClick={() => setSelectedPayslip(null)}
        >
          <div
            className="w-full max-w-2xl h-full bg-background border-l border-border overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Payslip Details</h2>
                  <p className="text-sm text-muted-foreground font-mono">{selectedPayslip.id}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedPayslip(null)}>
                    ✕
                  </Button>
                </div>
              </div>

              {/* Status */}
              <div className="bg-muted/30 rounded-lg p-4">
                {getStatusBadge(selectedPayslip.paymentStatus)}
              </div>

              {/* Pay Period */}
              <div className="bg-card border border-border rounded-lg p-6">
                <p className="text-sm text-muted-foreground mb-2">Pay Period</p>
                <p className="text-xl font-bold mb-4">{selectedPayslip.payPeriod}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Pay Date</p>
                    <p className="font-semibold">{formatDate(selectedPayslip.payDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Department</p>
                    <p className="font-semibold">{selectedPayslip.department}</p>
                  </div>
                </div>
              </div>

              {/* Earnings */}
              <div className="bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 rounded-lg p-6">
                <p className="text-sm text-muted-foreground mb-2">Gross Pay</p>
                <p className="text-4xl font-bold text-green-600 dark:text-green-400 mb-4">
                  {formatCurrency(selectedPayslip.grossPay)}
                </p>
                <p className="text-sm text-muted-foreground">Base salary before deductions</p>
              </div>

              {/* Deductions */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold mb-4">Deductions</h3>
                <div className="space-y-3">
                  {selectedPayslip.deductions.map((deduction) => (
                    <div key={`drawer-${selectedPayslip.id}-${deduction.name}`} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <span className="text-sm">{deduction.name}</span>
                      <span className="font-semibold text-red-600 dark:text-red-400">
                        -{formatCurrency(deduction.amount)}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-lg mt-4">
                    <span className="font-semibold">Total Deductions</span>
                    <span className="font-bold text-red-600 dark:text-red-400">
                      -{formatCurrency(getTotalDeductions(selectedPayslip.deductions))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Net Pay */}
              <div className="bg-gradient-to-br from-blue-500/10 to-transparent border-2 border-blue-500/20 rounded-lg p-6">
                <p className="text-sm text-muted-foreground mb-2">Net Pay (Take Home)</p>
                <p className="text-4xl font-bold mb-4">{formatCurrency(selectedPayslip.netPay)}</p>
                <div className="bg-card/50 rounded-lg p-3">
                  <p className="text-sm text-muted-foreground mb-1">Paid to Account</p>
                  <p className="font-mono font-semibold">{selectedPayslip.bankAccount}</p>
                </div>
              </div>

              {/* Close Button */}
              <Button variant="outline" onClick={() => setSelectedPayslip(null)} className="w-full">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
