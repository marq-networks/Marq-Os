import { PageLayout } from '../../shared/PageLayout';
import { DataTable } from '../../shared/DataTable';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { Key, Plus, Shield } from 'lucide-react';

export function S08PlatformAdmins() {
  const admins = [
    { id: '1', name: 'Alice Johnson', email: 'alice@workos.com', role: 'Super Admin', lastLogin: '2 hours ago', status: 'Active' },
    { id: '2', name: 'Bob Smith', email: 'bob@workos.com', role: 'Super Admin', lastLogin: '5 hours ago', status: 'Active' },
    { id: '3', name: 'Carol Williams', email: 'carol@workos.com', role: 'Platform Admin', lastLogin: '1 day ago', status: 'Active' },
    { id: '4', name: 'David Brown', email: 'david@workos.com', role: 'Support Admin', lastLogin: '3 hours ago', status: 'Active' },
  ];

  const columns = [
    { key: 'name', header: 'Name', width: '20%' },
    { key: 'email', header: 'Email', width: '25%' },
    { 
      key: 'role', 
      header: 'Role', 
      width: '20%',
      cell: (value: string) => {
        const type = value === 'Super Admin' ? 'danger' : 'info';
        return <StatusBadge type={type}>{value}</StatusBadge>;
      }
    },
    { key: 'lastLogin', header: 'Last Login', width: '20%' },
    { 
      key: 'status', 
      header: 'Status', 
      width: '15%',
      cell: (value: string) => <StatusBadge type="success">{value}</StatusBadge>
    },
  ];

  return (
    <PageLayout
      title="SUPER – S-08 – Platform Admins – v1.1"
      description="Manage platform administrators"
      actions={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Admin
        </Button>
      }
      kpis={[
        {
          title: 'Total Admins',
          value: '4',
          icon: <Key className="h-5 w-5" />
        },
        {
          title: 'Super Admins',
          value: '2',
          change: 'Full access',
          changeType: 'danger',
          icon: <Shield className="h-5 w-5" />
        },
        {
          title: 'Platform Admins',
          value: '1',
          icon: <Key className="h-5 w-5" />
        },
        {
          title: 'Support Admins',
          value: '1',
          icon: <Key className="h-5 w-5" />
        },
      ]}
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-4">Platform Administrators</h3>
          <DataTable columns={columns} data={admins} />
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-6">Admin Roles & Permissions</h3>
          <div className="space-y-4">
            <div className="rounded-lg border border-border p-4">
              <div className="mb-2 flex items-center justify-between">
                <h4>Super Admin</h4>
                <StatusBadge type="danger">Highest Access</StatusBadge>
              </div>
              <p className="text-sm text-muted-foreground">
                Full platform access including all organizations, billing, policies, and system settings.
              </p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <div className="mb-2 flex items-center justify-between">
                <h4>Platform Admin</h4>
                <StatusBadge type="info">High Access</StatusBadge>
              </div>
              <p className="text-sm text-muted-foreground">
                Manage organizations, view analytics, and configure platform features. No billing access.
              </p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <div className="mb-2 flex items-center justify-between">
                <h4>Support Admin</h4>
                <StatusBadge type="neutral">Limited Access</StatusBadge>
              </div>
              <p className="text-sm text-muted-foreground">
                View-only access to organizations and users for customer support purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
