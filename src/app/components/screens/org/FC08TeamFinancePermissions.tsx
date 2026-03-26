import { PageLayout } from '../../shared/PageLayout';
import { Card3D } from '../../shared/Card3D';
import { DataTable } from '../../shared/DataTable';
import { StatusBadge } from '../../shared/StatusBadge';
import { Breadcrumb } from '../../shared/Breadcrumb';
import { FinanceTopTabs } from '../../../finance/components/FinanceTopTabs';
import { useToast } from '../../ui/toast';
import { Shield, CheckCircle2, XCircle } from 'lucide-react';

export function FC08TeamFinancePermissions() {
  const { showToast } = useToast();

  const roles = [
    {
      role: 'Finance Admin',
      users: 2,
      canSubmit: true,
      canViewSalaries: true,
      canApprove: true,
      canPost: true,
      canImport: true
    },
    {
      role: 'Department Manager',
      users: 5,
      canSubmit: true,
      canViewSalaries: false,
      canApprove: true,
      canPost: false,
      canImport: false
    },
    {
      role: 'Team Lead',
      users: 8,
      canSubmit: true,
      canViewSalaries: false,
      canApprove: false,
      canPost: false,
      canImport: false
    },
    {
      role: 'Employee',
      users: 45,
      canSubmit: true,
      canViewSalaries: false,
      canApprove: false,
      canPost: false,
      canImport: false
    }
  ];

  const PermissionCell = ({ allowed }: { allowed: boolean }) => (
    <div className="flex items-center justify-center">
      {allowed ? (
        <CheckCircle2 className="h-5 w-5 text-green-600" />
      ) : (
        <XCircle className="h-5 w-5 text-gray-400" />
      )}
    </div>
  );

  const columns = [
    { 
      key: 'role', 
      header: 'Role',
      cell: (v: string) => <span className="font-medium">{v}</span>
    },
    { 
      key: 'users', 
      header: 'Users',
      cell: (v: number) => (
        <StatusBadge type="neutral">{v}</StatusBadge>
      )
    },
    { 
      key: 'canSubmit', 
      header: 'Submit Expenses',
      cell: (v: boolean) => <PermissionCell allowed={v} />
    },
    { 
      key: 'canViewSalaries', 
      header: 'View Salaries',
      cell: (v: boolean) => <PermissionCell allowed={v} />
    },
    { 
      key: 'canApprove', 
      header: 'Approve Txns',
      cell: (v: boolean) => <PermissionCell allowed={v} />
    },
    { 
      key: 'canPost', 
      header: 'Post to Ledger',
      cell: (v: boolean) => <PermissionCell allowed={v} />
    },
    { 
      key: 'canImport', 
      header: 'Run Imports',
      cell: (v: boolean) => <PermissionCell allowed={v} />
    },
    {
      key: 'actions',
      header: '',
      cell: (_, row: any) => (
        <button
          onClick={() => showToast(`Edit permissions for ${row.role}`, 'info')}
          className="px-3 py-1 bg-card border border-border rounded text-xs hover:bg-accent"
        >
          Edit
        </button>
      )
    }
  ];

  return (
    <PageLayout
      title="ORG – FC-08 – Team Finance Permissions"
      description="Manage finance permissions per role"
      kpis={[
        {
          title: 'Total Roles',
          value: '4',
          icon: <Shield className="h-5 w-5" />
        },
        {
          title: 'Total Users',
          value: '60',
          icon: <Shield className="h-5 w-5" />
        }
      ]}
    >
      <Breadcrumb items={[
        { label: 'Finance', path: '/org/finance/cockpit' },
        { label: 'Team Permissions' }
      ]} />
      <FinanceTopTabs />
      <div className="space-y-6">
        <Card3D>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Role Permissions Matrix</h3>
            <button
              onClick={() => showToast('Create new role', 'info')}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90"
            >
              Add Role
            </button>
          </div>
          <DataTable columns={columns} data={roles} />
        </Card3D>

        {/* Permission Descriptions */}
        <Card3D>
          <h3 className="font-semibold mb-4">Permission Descriptions</h3>
          <div className="space-y-3">
            <div className="p-3 bg-accent/50 rounded-lg">
              <p className="text-sm font-medium">Submit Expenses</p>
              <p className="text-xs text-muted-foreground mt-1">
                Can create and submit expense/income transactions for approval
              </p>
            </div>
            <div className="p-3 bg-accent/50 rounded-lg">
              <p className="text-sm font-medium">View Salaries</p>
              <p className="text-xs text-muted-foreground mt-1">
                Can view salary information and payroll data (restricted to finance admins only)
              </p>
            </div>
            <div className="p-3 bg-accent/50 rounded-lg">
              <p className="text-sm font-medium">Approve Transactions</p>
              <p className="text-xs text-muted-foreground mt-1">
                Can approve or reject submitted transactions before they're posted
              </p>
            </div>
            <div className="p-3 bg-accent/50 rounded-lg">
              <p className="text-sm font-medium">Post to Ledger</p>
              <p className="text-xs text-muted-foreground mt-1">
                Can directly post transactions to immutable ledger (admin privilege)
              </p>
            </div>
            <div className="p-3 bg-accent/50 rounded-lg">
              <p className="text-sm font-medium">Run Imports</p>
              <p className="text-xs text-muted-foreground mt-1">
                Can import bank statements and reconcile transactions (admin privilege)
              </p>
            </div>
          </div>
        </Card3D>

        {/* Audit Logging */}
        <div className="bg-accent/50 border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Permission Auditing:</strong> All permission changes are logged with admin identity, 
            timestamp, and affected users. Permission escalation requires Super Admin approval.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}