import { Card3D } from '../../shared/Card3D';
import { DataTable } from '../../shared/DataTable';
import { StatusBadge } from '../../shared/StatusBadge';
import { Breadcrumb } from '../../shared/Breadcrumb';
import { PageLayout } from '../../shared/PageLayout';
import { FinanceTopTabs } from '../../../finance/components/FinanceTopTabs';
import { useToast } from '../../ui/toast';
import { useFinanceData } from '../../../services/hooks';
import { DollarSign, Users, Send, FileText, RotateCcw, Loader2 } from 'lucide-react';

export function FC06PayrollPosting() {
  const { showToast } = useToast();
  const { payrollPostings, loading, postPayrollPosting, reversePayrollPosting } = useFinanceData();

  const handlePost = async (id: string, period: string) => {
    try {
      await postPayrollPosting(id, 'Alex Rivera');
      showToast(`Posted ${period} payroll to finance ledger`, 'success');
    } catch {
      showToast('Failed to post payroll — please retry', 'error');
    }
  };

  const handleReverse = async (id: string, period: string) => {
    try {
      await reversePayrollPosting(id, 'Alex Rivera', 'Manual correction requested');
      showToast(`Reversed ${period} posting — ledger updated`, 'warning');
    } catch {
      showToast('Failed to reverse — please contact finance ops', 'error');
    }
  };

  const totalPosted = payrollPostings
    .filter(p => p.status === 'Posted')
    .reduce((s, p) => s + p.totalAmount, 0);

  const currentDraft = payrollPostings.find(p => p.status === 'Draft');
  const totalEmployees = currentDraft?.employeeCount
    ?? payrollPostings[0]?.employeeCount
    ?? 0;

  const batchColumns = [
    { key: 'period',        header: 'Period' },
    {
      key: 'employeeCount',
      header: 'Employees',
      cell: (v: number) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          {v}
        </div>
      ),
    },
    {
      key: 'totalAmount',
      header: 'Total Cost',
      cell: (v: number) => (
        <span className="font-medium">
          ${v.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (v: string, row: any) => (
        <div>
          <StatusBadge
            type={v === 'Posted' ? 'success' : v === 'Reversed' ? 'error' : 'warning'}
          >
            {v}
          </StatusBadge>
          {v === 'Posted' && row.postedAt && (
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(row.postedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          )}
          {v === 'Posted' && row.ledgerRef && (
            <p className="text-xs text-muted-foreground">Ref: {row.ledgerRef}</p>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (_: any, row: any) => (
        <div className="flex items-center gap-2">
          {row.status === 'Draft' ? (
            <>
              <button
                onClick={() => showToast('Preview opens in ledger view', 'info')}
                className="flex items-center gap-1 px-3 py-1.5 bg-card border border-border rounded text-xs hover:bg-accent"
              >
                <FileText className="h-3 w-3" />
                Preview
              </button>
              <button
                onClick={() => handlePost(row.id, row.period)}
                className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded text-xs hover:bg-primary/90"
              >
                <Send className="h-3 w-3" />
                Post to Ledger
              </button>
            </>
          ) : row.status === 'Posted' ? (
            <button
              onClick={() => handleReverse(row.id, row.period)}
              className="flex items-center gap-1 px-3 py-1.5 bg-card border border-border rounded text-xs hover:bg-accent text-destructive"
            >
              <RotateCcw className="h-3 w-3" />
              Reverse
            </button>
          ) : (
            <span className="text-xs text-muted-foreground italic">Reversed</span>
          )}
        </div>
      ),
    },
  ];

  const deptColumns = [
    { key: 'departmentName', header: 'Department' },
    {
      key: 'employeeCount',
      header: 'Employees',
      cell: (v: number) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          {v}
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Cost',
      cell: (v: number) => (
        <span className="font-medium">
          ${v.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
  ];

  const latestPosting = payrollPostings.find(p => p.status === 'Draft')
    ?? payrollPostings.find(p => p.status === 'Posted');

  return (
    <PageLayout
      title="ORG – FC-06 – Payroll Posting"
      description="Post payroll batches to the finance ledger with full department allocation"
      kpis={[
        {
          title: 'Total Posted YTD',
          value: loading ? '—' : `$${totalPosted.toLocaleString()}`,
          icon: <DollarSign className="h-5 w-5" />,
        },
        {
          title: 'Current Month Employees',
          value: loading ? '—' : String(totalEmployees),
          icon: <Users className="h-5 w-5" />,
        },
        {
          title: 'Batches on Record',
          value: loading ? '—' : String(payrollPostings.length),
          icon: <FileText className="h-5 w-5" />,
        },
      ]}
    >
      <Breadcrumb
        items={[
          { label: 'Finance', path: '/org/finance/cockpit' },
          { label: 'Payroll Posting' },
        ]}
      />
      <FinanceTopTabs />

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Payroll Batches */}
          <Card3D>
            <h3 className="font-semibold mb-4">Payroll Posting History</h3>
            <DataTable columns={batchColumns} data={payrollPostings} />
          </Card3D>

          {/* Department Allocation for latest posting */}
          {latestPosting && (
            <Card3D>
              <h3 className="font-semibold mb-1">
                Department Cost Allocation —{' '}
                <span className="text-muted-foreground">{latestPosting.period}</span>
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {latestPosting.status === 'Draft'
                  ? 'Preview: these entries will be created in the ledger when you post.'
                  : `Posted ${latestPosting.postedAt ? new Date(latestPosting.postedAt).toLocaleDateString() : ''} by ${latestPosting.postedBy ?? 'System'}.`}
              </p>
              <DataTable columns={deptColumns} data={latestPosting.departmentBreakdown} />
            </Card3D>
          )}

          {/* Ledger impact summary */}
          <Card3D>
            <h3 className="font-semibold mb-3">Ledger Impact Preview</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                <span className="text-sm">Total Salary Cost (current draft)</span>
                <span className="text-lg font-bold">
                  {currentDraft
                    ? `$${currentDraft.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                    : 'No draft'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                <span className="text-sm">Ledger Entries on Post</span>
                <span className="text-sm text-muted-foreground">
                  {currentDraft
                    ? `${currentDraft.departmentBreakdown.length} dept entries + 1 summary`
                    : '—'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                <span className="text-sm">Audit Trail</span>
                <span className="text-sm text-muted-foreground">
                  Logged with admin identity, timestamp, and batch reference
                </span>
              </div>
            </div>
          </Card3D>

          {/* Process info */}
          <div className="bg-accent/50 border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              <strong>Payroll Flow:</strong> HR creates payroll run → Admin previews cost impact →
              Post to finance ledger → Department costs allocated → Audit logged.
              Each post creates immutable ledger entries with full traceability.
              Reversals are allowed within the same accounting period only.
            </p>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
