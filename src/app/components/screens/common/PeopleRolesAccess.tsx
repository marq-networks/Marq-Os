import { useState } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { StatusBadge } from '../../shared/StatusBadge';
import { FormDrawer } from '../../shared/FormDrawer';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { usePeopleData } from '../../../services/hooks';
import {
  Shield, Users, Plus, Pencil, Trash2, Lock, Check, X,
} from 'lucide-react';
import type { RoleDefinition } from '../../../services/types';

const ALL_PERMISSIONS = [
  { key: 'view_own_data', label: 'View Own Data', category: 'Data Access' },
  { key: 'view_team_data', label: 'View Team Data', category: 'Data Access' },
  { key: 'view_all_employees', label: 'View All Employees', category: 'Data Access' },
  { key: 'view_reports', label: 'View Reports', category: 'Data Access' },
  { key: 'view_finance', label: 'View Finance', category: 'Data Access' },
  { key: 'view_payroll', label: 'View Payroll', category: 'Data Access' },
  { key: 'submit_time', label: 'Submit Time', category: 'Actions' },
  { key: 'submit_leave', label: 'Submit Leave', category: 'Actions' },
  { key: 'approve_leave', label: 'Approve Leave', category: 'Actions' },
  { key: 'manage_tasks', label: 'Manage Tasks', category: 'Management' },
  { key: 'manage_employees', label: 'Manage Employees', category: 'Management' },
  { key: 'manage_department', label: 'Manage Department', category: 'Management' },
  { key: 'manage_leave_policies', label: 'Manage Leave Policies', category: 'Management' },
  { key: 'manage_fines', label: 'Manage Fines', category: 'Management' },
  { key: 'manage_transactions', label: 'Manage Transactions', category: 'Finance' },
  { key: 'approve_expenses', label: 'Approve Expenses', category: 'Finance' },
  { key: 'manage_billing', label: 'Manage Billing', category: 'Finance' },
];

const PERMISSION_CATEGORIES = [...new Set(ALL_PERMISSIONS.map(p => p.category))];

export function PeopleRolesAccess() {
  const { roles, loading, createRole, updateRole, deleteRole } = usePeopleData();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<RoleDefinition | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '', description: '', permissions: [] as string[],
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '', permissions: [] });
    setDrawerOpen(true);
  };

  const openEdit = (role: RoleDefinition) => {
    setEditing(role);
    setForm({ name: role.name, description: role.description, permissions: [...role.permissions] });
    setDrawerOpen(true);
  };

  const togglePermission = (key: string) => {
    setForm(f => ({
      ...f,
      permissions: f.permissions.includes(key)
        ? f.permissions.filter(p => p !== key)
        : [...f.permissions, key],
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      ...form,
      userCount: editing?.userCount ?? 0,
      isSystem: editing?.isSystem ?? false,
      createdAt: editing?.createdAt || new Date().toISOString().split('T')[0],
    };
    if (editing) {
      await updateRole(editing.id, payload);
    } else {
      await createRole(payload);
    }
    setDrawerOpen(false);
  };

  const handleDelete = async (id: string) => {
    const role = roles.find(r => r.id === id);
    if (role?.isSystem) {
      alert('System roles cannot be deleted.');
      return;
    }
    if (window.confirm('Delete this role?')) {
      await deleteRole(id);
    }
  };

  const totalUsers = roles.reduce((s, r) => s + r.userCount, 0);

  return (
    <PageLayout
      title="Roles & Access"
      description="Define roles, assign permissions, and manage access control across the organization"
      actions={
        <Button size="sm" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Create Role
        </Button>
      }
      kpis={[
        { title: 'Total Roles', value: roles.length, change: `${roles.filter(r => r.isSystem).length} system roles`, changeType: 'neutral', icon: <Shield className="h-5 w-5" /> },
        { title: 'Users Assigned', value: totalUsers, change: 'Across all roles', changeType: 'neutral', icon: <Users className="h-5 w-5" /> },
        { title: 'System Roles', value: roles.filter(r => r.isSystem).length, change: 'Protected', changeType: 'info', icon: <Lock className="h-5 w-5" /> },
        { title: 'Custom Roles', value: roles.filter(r => !r.isSystem).length, change: 'User-created', changeType: 'neutral', icon: <Shield className="h-5 w-5" /> },
      ]}
    >
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Role Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {roles.map(role => (
              <div
                key={role.id}
                className={`rounded-lg border bg-card p-5 cursor-pointer transition-all ${
                  selectedRole === role.id ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedRole(selectedRole === role.id ? null : role.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      role.isSystem ? 'bg-amber-500/10 text-amber-600' : 'bg-primary/10 text-primary'
                    }`}>
                      {role.isSystem ? <Lock className="h-5 w-5" /> : <Shield className="h-5 w-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{role.name}</h3>
                        {role.isSystem && (
                          <StatusBadge type="warning">System</StatusBadge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                    </div>
                  </div>
                  {!role.isSystem && (
                    <div className="flex gap-1">
                      <button onClick={(e) => { e.stopPropagation(); openEdit(role); }} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(role.id); }} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span><Users className="inline h-3.5 w-3.5 mr-1" />{role.userCount} users</span>
                  <span><Shield className="inline h-3.5 w-3.5 mr-1" />{role.permissions.length} permissions</span>
                </div>

                {/* Expanded permissions view */}
                {selectedRole === role.id && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <h4 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Permissions</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {ALL_PERMISSIONS.map(perm => {
                        const has = role.permissions.includes(perm.key);
                        return (
                          <span
                            key={perm.key}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full ${
                              has
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {has ? <Check className="h-2.5 w-2.5" /> : <X className="h-2.5 w-2.5" />}
                            {perm.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Permissions Matrix */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/30">
              <h3 className="font-medium">Permission Matrix</h3>
              <p className="text-sm text-muted-foreground">Overview of all roles and their permissions</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 font-medium min-w-[180px]">Permission</th>
                    {roles.map(role => (
                      <th key={role.id} className="text-center p-3 font-medium min-w-[100px]">
                        {role.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PERMISSION_CATEGORIES.map(cat => (
                    <>
                      <tr key={`cat-${cat}`} className="bg-muted/20">
                        <td colSpan={roles.length + 1} className="px-3 py-2 text-xs uppercase tracking-wider text-muted-foreground">
                          {cat}
                        </td>
                      </tr>
                      {ALL_PERMISSIONS.filter(p => p.category === cat).map(perm => (
                        <tr key={perm.key} className="border-b border-border/50 hover:bg-muted/10">
                          <td className="p-3 text-muted-foreground">{perm.label}</td>
                          {roles.map(role => (
                            <td key={role.id} className="text-center p-3">
                              {role.permissions.includes(perm.key) ? (
                                <Check className="h-4 w-4 mx-auto text-green-600 dark:text-green-400" />
                              ) : (
                                <span className="block h-4 w-4 mx-auto text-muted-foreground/30">—</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <FormDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? 'Edit Role' : 'Create Role'}
        onSubmit={handleSubmit}
        submitLabel={editing ? 'Update' : 'Create'}
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Role Name *</label>
            <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Manager" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Description *</label>
            <Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Management capabilities" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-3 block">Permissions</label>
            {PERMISSION_CATEGORIES.map(cat => (
              <div key={cat} className="mb-4">
                <h5 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{cat}</h5>
                <div className="space-y-2">
                  {ALL_PERMISSIONS.filter(p => p.category === cat).map(perm => (
                    <label key={perm.key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.permissions.includes(perm.key)}
                        onChange={() => togglePermission(perm.key)}
                        className="rounded border-input"
                      />
                      <span className="text-sm">{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </FormDrawer>
    </PageLayout>
  );
}
