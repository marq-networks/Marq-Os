import { useState } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { StatusBadge } from '../../shared/StatusBadge';
import { FormDrawer } from '../../shared/FormDrawer';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { usePeopleData } from '../../../services/hooks';
import {
  Building2, Users, DollarSign, Plus, Pencil, Trash2, UserCircle,
} from 'lucide-react';
import type { Department } from '../../../services/types';

export function PeopleDepartments() {
  const { departments, employees, loading, createDepartment, updateDepartment, deleteDepartment } = usePeopleData();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);
  const [form, setForm] = useState({
    name: '', description: '', lead: '', leadId: '', budget: 0,
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '', lead: '', leadId: '', budget: 0 });
    setDrawerOpen(true);
  };

  const openEdit = (dept: Department) => {
    setEditing(dept);
    setForm({
      name: dept.name, description: dept.description || '',
      lead: dept.lead, leadId: dept.leadId, budget: dept.budget,
    });
    setDrawerOpen(true);
  };

  const handleSubmit = async () => {
    const payload = {
      ...form,
      memberCount: editing?.memberCount ?? 0,
      status: 'Active' as const,
      createdAt: editing?.createdAt || new Date().toISOString().split('T')[0],
    };
    if (editing) {
      await updateDepartment(editing.id, payload);
    } else {
      await createDepartment(payload);
    }
    setDrawerOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Archive this department?')) {
      await deleteDepartment(id);
    }
  };

  const totalBudget = departments.reduce((s, d) => s + d.budget, 0);
  const totalMembers = departments.reduce((s, d) => s + d.memberCount, 0);

  return (
    <PageLayout
      title="Departments"
      description="Manage organizational structure, department leads, and budgets"
      actions={
        <Button size="sm" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Department
        </Button>
      }
      kpis={[
        { title: 'Total Departments', value: departments.length, change: `${departments.filter(d => d.status === 'Active').length} active`, changeType: 'positive', icon: <Building2 className="h-5 w-5" /> },
        { title: 'Total Headcount', value: totalMembers, change: `Across all depts`, changeType: 'neutral', icon: <Users className="h-5 w-5" /> },
        { title: 'Total Budget', value: `$${(totalBudget / 1000000).toFixed(1)}M`, change: 'Annual allocation', changeType: 'neutral', icon: <DollarSign className="h-5 w-5" /> },
        { title: 'Avg Dept Size', value: departments.length ? Math.round(totalMembers / departments.length) : 0, change: 'Members per dept', changeType: 'neutral', icon: <Users className="h-5 w-5" /> },
      ]}
    >
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map(dept => {
            const deptEmployees = employees.filter(e => e.departmentId === dept.id);
            return (
              <div
                key={dept.id}
                className="rounded-lg border border-border bg-card p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{dept.name}</h3>
                      <StatusBadge type={dept.status === 'Active' ? 'success' : 'neutral'}>{dept.status}</StatusBadge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(dept)} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => handleDelete(dept.id)} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {dept.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{dept.description}</p>
                )}

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <UserCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Lead:</span>
                    <span>{dept.lead}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Members:</span>
                    <span>{dept.memberCount}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Budget:</span>
                    <span>${(dept.budget / 1000).toFixed(0)}K / yr</span>
                  </div>
                </div>

                {/* Mini member avatars */}
                {deptEmployees.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center -space-x-2">
                      {deptEmployees.slice(0, 5).map(emp => (
                        <div
                          key={emp.id}
                          className="h-7 w-7 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[10px] text-muted-foreground"
                          title={emp.name}
                        >
                          {emp.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      ))}
                      {deptEmployees.length > 5 && (
                        <div className="h-7 w-7 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[10px] text-muted-foreground">
                          +{deptEmployees.length - 5}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <FormDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? 'Edit Department' : 'Add Department'}
        onSubmit={handleSubmit}
        submitLabel={editing ? 'Update' : 'Create'}
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Name *</label>
            <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Engineering" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Description</label>
            <Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Software development and infrastructure" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Department Lead</label>
            <select
              value={form.leadId}
              onChange={e => {
                const emp = employees.find(em => em.id === e.target.value);
                setForm(f => ({ ...f, leadId: e.target.value, lead: emp?.name || '' }));
              }}
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Select lead</option>
              {employees.map(e => (
                <option key={e.id} value={e.id}>{e.name} — {e.role}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Annual Budget ($)</label>
            <Input
              type="number"
              value={form.budget}
              onChange={e => setForm(f => ({ ...f, budget: Number(e.target.value) }))}
              placeholder="500000"
            />
          </div>
        </div>
      </FormDrawer>
    </PageLayout>
  );
}
