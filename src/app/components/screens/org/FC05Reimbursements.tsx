import { PageLayout } from '../../shared/PageLayout';
import { Card3D } from '../../shared/Card3D';
import { DataTable } from '../../shared/DataTable';
import { StatusBadge } from '../../shared/StatusBadge';
import { Breadcrumb } from '../../shared/Breadcrumb';
import { FinanceTopTabs } from '../../../finance/components/FinanceTopTabs';
import { useToast } from '../../ui/toast';
import { Receipt, DollarSign, CheckCircle2, Link as LinkIcon } from 'lucide-react';

export function FC05Reimbursements() {
  const { showToast } = useToast();

  const reimbursements = [
    { 
      id: 'REIMB-001', 
      employee: 'Mike Johnson', 
      date: '2025-12-31', 
      expense: 'TXN-985', 
      narration: 'Travel expenses - Client site visit', 
      amount: 1250.00, 
      status: 'pending',
      department: 'Operations'
    },
    { 
      id: 'REIMB-002', 
      employee: 'Sarah Chen', 
      date: '2025-12-28', 
      expense: 'TXN-972', 
      narration: 'Hotel accommodation - Conference', 
      amount: 380.50, 
      status: 'pending',
      department: 'Sales'
    },
    { 
      id: 'REIMB-003', 
      employee: 'Tom Wilson', 
      date: '2025-12-20', 
      expense: 'TXN-945', 
      narration: 'Taxi fare - Airport transfer', 
      amount: 45.00, 
      status: 'paid',
      department: 'Marketing',
      paidOn: '2025-12-25'
    },
    { 
      id: 'REIMB-004', 
      employee: 'Jane Smith', 
      date: '2025-12-18', 
      expense: 'TXN-938', 
      narration: 'Office supplies - Emergency purchase', 
      amount: 156.80, 
      status: 'paid',
      department: 'Admin',
      paidOn: '2025-12-22'
    }
  ];

  const pendingTotal = reimbursements
    .filter(r => r.status === 'pending')
    .reduce((sum, r) => sum + r.amount, 0);

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'employee', header: 'Employee' },
    { key: 'department', header: 'Department' },
    { key: 'date', header: 'Submitted' },
    { 
      key: 'expense', 
      header: 'Expense Link',
      cell: (v: string) => (
        <button
          onClick={() => showToast(`View expense ${v}`, 'info')}
          className="text-primary hover:underline flex items-center gap-1"
        >
          <LinkIcon className="h-3 w-3" />
          {v}
        </button>
      )
    },
    { key: 'narration', header: 'Narration' },
    { 
      key: 'amount', 
      header: 'Amount',
      cell: (v: number) => `$${v.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    },
    { 
      key: 'status', 
      header: 'Status',
      cell: (v: string, row: any) => (
        <div>
          <StatusBadge type={v === 'paid' ? 'success' : 'warning'}>
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </StatusBadge>
          {v === 'paid' && row.paidOn && (
            <p className="text-xs text-muted-foreground mt-1">Paid on {row.paidOn}</p>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (_: any, row: any) => (
        <div className="flex items-center gap-2">
          {row.status === 'pending' && (
            <button
              onClick={() => showToast(`Marked ${row.id} as paid`, 'success')}
              className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded text-xs hover:bg-green-700"
            >
              <CheckCircle2 className="h-3 w-3" />
              Mark Paid
            </button>
          )}
          <button
            onClick={() => showToast(`View details for ${row.id}`, 'info')}
            className="px-3 py-1.5 bg-card border border-border rounded text-xs hover:bg-accent"
          >
            Details
          </button>
        </div>
      )
    }
  ];

  return (
    <PageLayout
      title="Reimbursements"
      description="Track and manage employee reimbursements"
      kpis={[
        {
          title: 'Pending Reimbursements',
          value: reimbursements.filter(r => r.status === 'pending').length.toString(),
          icon: <Receipt className="h-5 w-5" />
        },
        {
          title: 'Total Owed',
          value: `$${pendingTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
          icon: <DollarSign className="h-5 w-5" />
        },
        {
          title: 'Paid This Month',
          value: reimbursements.filter(r => r.status === 'paid').length.toString(),
          icon: <CheckCircle2 className="h-5 w-5" />
        }
      ]}
    >
      <Breadcrumb items={[
        { label: 'Finance', path: '/org/finance/cockpit' },
        { label: 'Reimbursements' }
      ]} />
      <FinanceTopTabs />
      <div className="space-y-6">
        <Card3D>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">All Reimbursements</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => showToast('Bulk payment processing started', 'info')}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90"
              >
                <CheckCircle2 className="h-4 w-4" />
                Pay All Pending
              </button>
            </div>
          </div>
          <DataTable columns={columns} data={reimbursements} />
        </Card3D>

        {/* Info */}
        <div className="bg-accent/50 border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Reimbursement Flow:</strong> Employee submits expense → Admin approves → 
            Ledger entry created → Reimbursement tracked → Payment marked → Audit logged.
            All reimbursements are linked to their source expense transaction.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}