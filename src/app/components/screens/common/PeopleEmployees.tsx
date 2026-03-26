import { useState, useMemo } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { DataTable } from '../../shared/DataTable';
import { StatusBadge } from '../../shared/StatusBadge';
import { FormDrawer } from '../../shared/FormDrawer';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { usePeopleData } from '../../../services/hooks';
import {
  Users, UserPlus, Search, Filter, Download, Mail, MapPin, Building2, Briefcase, X,
} from 'lucide-react';
import type { Employee } from '../../../services/types';

const STATUS_MAP: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = {
  Active: 'success',
  Away: 'warning',
  Offline: 'neutral',
  Suspended: 'danger',
  Deactivated: 'danger',
};

const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Intern'] as const;

export function PeopleEmployees() {
  const {
    employees, departments, loading,
    createEmployee, updateEmployee, deleteEmployee,
  } = usePeopleData();

  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [detailEmployee, setDetailEmployee] = useState<Employee | null>(null);

  // Form state
  const [form, setForm] = useState({
    name: '', email: '', role: '', department: '', departmentId: '',
    employmentType: 'Full-time' as Employee['employmentType'],
    location: '', phone: '', manager: '', managerId: '',
  });

  const filtered = useMemo(() => {
    return employees.filter(e => {
      const matchesSearch = !search ||
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.email.toLowerCase().includes(search.toLowerCase()) ||
        e.role.toLowerCase().includes(search.toLowerCase());
      const matchesDept = deptFilter === 'all' || e.departmentId === deptFilter;
      const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [employees, search, deptFilter, statusFilter]);

  const openCreate = () => {
    setEditingEmployee(null);
    setForm({
      name: '', email: '', role: '', department: '', departmentId: '',
      employmentType: 'Full-time', location: '', phone: '', manager: '', managerId: '',
    });
    setDrawerOpen(true);
  };

  const openEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setForm({
      name: emp.name, email: emp.email, role: emp.role,
      department: emp.department, departmentId: emp.departmentId,
      employmentType: emp.employmentType,
      location: emp.location || '', phone: emp.phone || '',
      manager: emp.manager || '', managerId: emp.managerId || '',
    });
    setDrawerOpen(true);
    setDetailEmployee(null);
  };

  const handleSubmit = async () => {
    const dept = departments.find(d => d.id === form.departmentId);
    const payload = {
      ...form,
      department: dept?.name || form.department,
      status: 'Active' as const,
      lastSeen: 'Just now',
      joinDate: new Date().toISOString().split('T')[0],
      skills: [],
    };
    if (editingEmployee) {
      await updateEmployee(editingEmployee.id, payload);
    } else {
      await createEmployee(payload);
    }
    setDrawerOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to deactivate this employee?')) {
      await deleteEmployee(id);
      setDetailEmployee(null);
    }
  };

  const handleRowSelect = (id: string) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const columns = [
    {
      key: 'name',
      header: 'Employee',
      cell: (_: any, row: Employee) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm text-primary">
            {row.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="font-medium">{row.name}</div>
            <div className="text-xs text-muted-foreground">{row.email}</div>
          </div>
        </div>
      ),
    },
    { key: 'role', header: 'Job Title' },
    { key: 'department', header: 'Department' },
    {
      key: 'employmentType',
      header: 'Type',
      cell: (val: string) => (
        <span className="text-xs px-2 py-0.5 rounded-full bg-muted">{val}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (val: string) => (
        <StatusBadge type={STATUS_MAP[val] || 'neutral'}>{val}</StatusBadge>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      cell: (val: string) => val || '—',
    },
    {
      key: 'lastSeen',
      header: 'Last Seen',
      cell: (val: string) => (
        <span className="text-sm text-muted-foreground">{val}</span>
      ),
    },
  ];

  const activeCount = employees.filter(e => e.status === 'Active').length;
  const deptCount = [...new Set(employees.map(e => e.department))].length;

  return (
    <PageLayout
      title="Employees"
      description="Manage employee records, profiles, and organizational assignments"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" onClick={openCreate}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>
      }
      kpis={[
        { title: 'Total Employees', value: employees.length, change: `${activeCount} active`, changeType: 'positive', icon: <Users className="h-5 w-5" /> },
        { title: 'Departments', value: deptCount, change: `${departments.length} total depts`, changeType: 'neutral', icon: <Building2 className="h-5 w-5" /> },
        { title: 'Full-time', value: employees.filter(e => e.employmentType === 'Full-time').length, change: `${employees.filter(e => e.employmentType !== 'Full-time').length} other types`, changeType: 'neutral', icon: <Briefcase className="h-5 w-5" /> },
        { title: 'Away / Offline', value: employees.filter(e => e.status === 'Away' || e.status === 'Offline').length, change: 'Currently unavailable', changeType: 'warning', icon: <Users className="h-5 w-5" /> },
      ]}
      drawer={detailEmployee ? {
        isOpen: true,
        onClose: () => setDetailEmployee(null),
        title: detailEmployee.name,
        content: (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-xl text-primary">
                {detailEmployee.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-lg">{detailEmployee.name}</h3>
                <p className="text-sm text-muted-foreground">{detailEmployee.role}</p>
                <StatusBadge type={STATUS_MAP[detailEmployee.status] || 'neutral'}>{detailEmployee.status}</StatusBadge>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { icon: Mail, label: 'Email', value: detailEmployee.email },
                { icon: Building2, label: 'Department', value: detailEmployee.department },
                { icon: Briefcase, label: 'Type', value: detailEmployee.employmentType },
                { icon: MapPin, label: 'Location', value: detailEmployee.location || '—' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3 text-sm">
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground w-24">{item.label}</span>
                  <span>{item.value}</span>
                </div>
              ))}
            </div>
            {detailEmployee.skills && detailEmployee.skills.length > 0 && (
              <div>
                <h4 className="text-sm text-muted-foreground mb-2">Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {detailEmployee.skills.map(skill => (
                    <span key={skill} className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">{skill}</span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-2 pt-4 border-t border-border">
              <Button size="sm" onClick={() => openEdit(detailEmployee)}>Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(detailEmployee.id)}>Deactivate</Button>
            </div>
          </div>
        ),
      } : undefined}
    >
      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={deptFilter}
          onChange={e => setDeptFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">All Departments</option>
          {departments.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Away">Away</option>
          <option value="Offline">Offline</option>
          <option value="Suspended">Suspended</option>
        </select>
        {(search || deptFilter !== 'all' || statusFilter !== 'all') && (
          <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setDeptFilter('all'); setStatusFilter('all'); }}>
            <X className="h-4 w-4 mr-1" /> Clear
          </Button>
        )}
        <div className="ml-auto text-sm text-muted-foreground">
          {filtered.length} of {employees.length} employees
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          selectable
          selectedRows={selectedRows}
          onRowSelect={handleRowSelect}
          onSelectAll={() =>
            setSelectedRows(prev =>
              prev.length === filtered.length ? [] : filtered.map(e => e.id)
            )
          }
          onRowClick={(row) => setDetailEmployee(row)}
          pagination={{
            page: 1,
            pageSize: 20,
            total: filtered.length,
            onPageChange: () => {},
          }}
        />
      )}

      {/* Create / Edit Drawer */}
      <FormDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editingEmployee ? 'Edit Employee' : 'Add Employee'}
        description={editingEmployee ? `Editing ${editingEmployee.name}` : 'Add a new employee to the organization'}
        onSubmit={handleSubmit}
        submitLabel={editingEmployee ? 'Update' : 'Create'}
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Full Name *</label>
            <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="John Doe" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Email *</label>
            <Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="john@company.com" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Job Title *</label>
            <Input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="Software Engineer" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Department *</label>
            <select
              value={form.departmentId}
              onChange={e => {
                const dept = departments.find(d => d.id === e.target.value);
                setForm(f => ({ ...f, departmentId: e.target.value, department: dept?.name || '' }));
              }}
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Select department</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Employment Type</label>
            <select
              value={form.employmentType}
              onChange={e => setForm(f => ({ ...f, employmentType: e.target.value as Employee['employmentType'] }))}
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              {EMPLOYMENT_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Location</label>
            <Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="New York" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Phone</label>
            <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+1 555-0123" />
          </div>
        </div>
      </FormDrawer>
    </PageLayout>
  );
}
