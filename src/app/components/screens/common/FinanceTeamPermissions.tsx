import { useState } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { Switch } from '../../ui/switch';
import { Label } from '../../ui/label';
import { usePeopleData } from '../../../services/hooks';
import {
  Shield, Users, Eye, Edit, Trash2, Plus, Save, Lock, CheckCircle2,
} from 'lucide-react';

interface FinanceRole {
  id: string; name: string; description: string; members: string[];
  permissions: Record<string, boolean>;
}

const PERMISSION_KEYS = [
  'view_transactions', 'create_transactions', 'approve_payments',
  'manage_payroll', 'view_reports', 'export_data',
  'manage_accounts', 'manage_settings',
];
const PERMISSION_LABELS: Record<string, string> = {
  view_transactions: 'View Transactions', create_transactions: 'Create Transactions',
  approve_payments: 'Approve Payments', manage_payroll: 'Manage Payroll',
  view_reports: 'View Reports', export_data: 'Export Data',
  manage_accounts: 'Manage Accounts', manage_settings: 'Manage Settings',
};

const FINANCE_ROLES: FinanceRole[] = [
  { id: 'fr1', name: 'Finance Admin', description: 'Full access to all finance modules', members: ['Alex Rivera', 'Lisa Anderson'],
    permissions: Object.fromEntries(PERMISSION_KEYS.map(k => [k, true])) },
  { id: 'fr2', name: 'Payroll Manager', description: 'Manage payroll and payslips', members: ['Sarah Johnson'],
    permissions: { view_transactions: true, create_transactions: false, approve_payments: true, manage_payroll: true, view_reports: true, export_data: true, manage_accounts: false, manage_settings: false } },
  { id: 'fr3', name: 'Accountant', description: 'Manage transactions and generate reports', members: ['Michael Chen', 'Emily Rodriguez'],
    permissions: { view_transactions: true, create_transactions: true, approve_payments: false, manage_payroll: false, view_reports: true, export_data: true, manage_accounts: true, manage_settings: false } },
  { id: 'fr4', name: 'Finance Viewer', description: 'Read-only access to financial data', members: ['David Kim', 'Robert Taylor', 'James Wilson'],
    permissions: { view_transactions: true, create_transactions: false, approve_payments: false, manage_payroll: false, view_reports: true, export_data: false, manage_accounts: false, manage_settings: false } },
];

export function FinanceTeamPermissions() {
  const [roles, setRoles] = useState(FINANCE_ROLES);
  const [hasChanges, setHasChanges] = useState(false);

  const togglePermission = (roleId: string, key: string) => {
    setRoles(prev => prev.map(r => r.id === roleId ? {
      ...r, permissions: { ...r.permissions, [key]: !r.permissions[key] }
    } : r));
    setHasChanges(true);
  };

  const handleSave = () => { setHasChanges(false); alert('Permissions saved successfully.'); };
  const totalMembers = [...new Set(roles.flatMap(r => r.members))].length;

  return (
    <PageLayout
      title="Finance Team Permissions"
      description="Manage roles and access levels for finance module users"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Plus className="mr-2 h-4 w-4" /> New Role</Button>
          <Button onClick={handleSave} disabled={!hasChanges}>
            <Save className="mr-2 h-4 w-4" /> {hasChanges ? 'Save Changes' : 'Saved'}
          </Button>
        </div>
      }
      kpis={[
        { title: 'Finance Roles', value: roles.length, changeType: 'neutral', icon: <Shield className="h-5 w-5" /> },
        { title: 'Team Members', value: totalMembers, change: 'With finance access', changeType: 'neutral', icon: <Users className="h-5 w-5" /> },
        { title: 'Permissions', value: PERMISSION_KEYS.length, change: 'Configurable', changeType: 'neutral', icon: <Lock className="h-5 w-5" /> },
        { title: 'Admin Users', value: roles.find(r => r.name === 'Finance Admin')?.members.length || 0, changeType: 'neutral', icon: <CheckCircle2 className="h-5 w-5" /> },
      ]}
    >
      {/* Permission Matrix */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground min-w-[200px]">Permission</th>
                {roles.map(role => (
                  <th key={role.id} className="px-4 py-3 text-center text-xs font-medium text-muted-foreground min-w-[140px]">
                    {role.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMISSION_KEYS.map(key => (
                <tr key={key} className="border-b border-border last:border-0 hover:bg-muted/20">
                  <td className="px-4 py-3 text-sm">{PERMISSION_LABELS[key]}</td>
                  {roles.map(role => (
                    <td key={role.id} className="px-4 py-3 text-center">
                      <Switch
                        checked={role.permissions[key] || false}
                        onCheckedChange={() => togglePermission(role.id, key)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map(role => {
          const enabledCount = Object.values(role.permissions).filter(Boolean).length;
          return (
            <div key={role.id} className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium">{role.name}</h4>
                  <p className="text-xs text-muted-foreground">{role.description}</p>
                </div>
                <span className="text-xs text-muted-foreground">{enabledCount}/{PERMISSION_KEYS.length} permissions</span>
              </div>
              <div className="mb-3">
                <p className="text-xs text-muted-foreground mb-1.5">Members ({role.members.length})</p>
                <div className="flex flex-wrap gap-2">
                  {role.members.map(member => (
                    <div key={member} className="flex items-center gap-1.5 px-2 py-1 bg-muted rounded-full text-xs">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-[9px] text-primary">
                        {member.split(' ').map(n => n[0]).join('')}
                      </div>
                      {member}
                    </div>
                  ))}
                </div>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${(enabledCount / PERMISSION_KEYS.length) * 100}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </PageLayout>
  );
}
