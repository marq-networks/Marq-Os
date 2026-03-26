import { PageLayout } from '../../shared/PageLayout';
import { LineChartComponent } from '../../shared/Charts';
import { DataTable } from '../../shared/DataTable';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { Building, Users, DollarSign, Calendar, Edit } from 'lucide-react';

export function S03OrgDetail() {
  const usageHistory = [
    { month: 'Jul', users: 42 },
    { month: 'Aug', users: 45 },
    { month: 'Sep', users: 46 },
    { month: 'Oct', users: 48 },
    { month: 'Nov', users: 50 },
    { month: 'Dec', users: 52 },
  ];

  const adminUsers = [
    { id: '1', name: 'John Smith', email: 'john@acme.com', role: 'Super Admin', lastLogin: '2 hours ago' },
    { id: '2', name: 'Jane Doe', email: 'jane@acme.com', role: 'Admin', lastLogin: '1 day ago' },
  ];

  const columns = [
    { key: 'name', header: 'Name', width: '25%' },
    { key: 'email', header: 'Email', width: '30%' },
    { key: 'role', header: 'Role', width: '20%' },
    { key: 'lastLogin', header: 'Last Login', width: '25%' },
  ];

  return (
    <PageLayout
      title="SUPER – S-03 – Org Detail – v1.1"
      description="Detailed view of Acme Corp"
      actions={
        <>
          <Button variant="outline">
            Suspend
          </Button>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </>
      }
      kpis={[
        {
          title: 'Current Plan',
          value: 'Enterprise',
          icon: <Building className="h-5 w-5" />
        },
        {
          title: 'Total Users',
          value: '52',
          change: 'Limit: 100',
          changeType: 'positive',
          icon: <Users className="h-5 w-5" />
        },
        {
          title: 'MRR',
          value: '$12,500',
          icon: <DollarSign className="h-5 w-5" />
        },
        {
          title: 'Member Since',
          value: 'Jan 2024',
          icon: <Calendar className="h-5 w-5" />
        },
      ]}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-6">Organization Information</h3>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Name</dt>
                <dd className="font-semibold">Acme Corp</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Status</dt>
                <dd><StatusBadge type="success">Active</StatusBadge></dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Email</dt>
                <dd>admin@acme.com</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Phone</dt>
                <dd>+1 (555) 123-4567</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Next Billing</dt>
                <dd>Jan 15, 2026</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-6">Subscription Details</h3>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Plan</dt>
                <dd className="font-semibold">Enterprise</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Billing Cycle</dt>
                <dd>Monthly</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Price per User</dt>
                <dd>$240/user</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Active Users</dt>
                <dd>52 / 100</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Total MRR</dt>
                <dd className="font-semibold">$12,500</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-4">User Growth (6 Months)</h3>
          <LineChartComponent 
            data={usageHistory}
            dataKey="users"
            xAxisKey="month"
            height={250}
          />
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-4">Administrators</h3>
          <DataTable columns={columns} data={adminUsers} />
        </div>
      </div>
    </PageLayout>
  );
}
