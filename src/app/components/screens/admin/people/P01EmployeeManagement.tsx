import { useMemo, useState } from 'react';
import { PageLayout } from '../../../shared/PageLayout';
import { DataTable } from '../../../shared/DataTable';
import { StatusBadge } from '../../../shared/StatusBadge';
import { Button } from '../../../ui/button';
import { FormDrawer } from '../../../shared/FormDrawer';
import { FormField, Input } from '../../../ui/form';
import { useToast } from '../../../ui/toast';
import {
  Users,
  Plus,
  Download,
  Search,
  Mail,
  MapPin,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clock,
  FileText,
  Trash2
} from 'lucide-react';
import { usePeopleData, type Employee } from '../../../../services';

export function P01EmployeeManagement() {
  const { showToast } = useToast();
  const { employees, departments, loading, createEmployee, deleteEmployee } = usePeopleData();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    departmentId: '',
    manager: '',
    employmentType: 'Full-time' as Employee['employmentType'],
    location: 'Office',
    joinDate: new Date().toISOString().split('T')[0],
    salary: '',
    status: 'Active' as Employee['status'],
    skills: '',
  });

  const resetForm = () => {
    setEmployeeForm({
      name: '',
      email: '',
      phone: '',
      role: '',
      departmentId: '',
      manager: '',
      employmentType: 'Full-time',
      location: 'Office',
      joinDate: new Date().toISOString().split('T')[0],
      salary: '',
      status: 'Active',
      skills: '',
    });
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesStatus = filterStatus === 'all' || employee.status === filterStatus;
      const matchesDepartment = filterDepartment === 'all' || employee.department === filterDepartment;
      const matchesSearch =
        searchQuery === '' ||
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.id.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesDepartment && matchesSearch;
    });
  }, [employees, filterDepartment, filterStatus, searchQuery]);

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((employee) => employee.status === 'Active').length;
  const awayEmployees = employees.filter((employee) => employee.status === 'Away').length;
  const fullTimeEmployees = employees.filter((employee) => employee.employmentType === 'Full-time').length;
  const remoteEmployees = employees.filter((employee) => String(employee.location ?? '').toLowerCase().includes('remote')).length;
  const averageSalary = Math.round(
    employees.reduce((sum, employee) => sum + (employee.salary ?? 0), 0) / Math.max(1, employees.filter((employee) => employee.salary).length),
  );
  const averageTenure = useMemo(() => {
    if (!employees.length) return 0;
    const totalMonths = employees.reduce((sum, employee) => {
      const joinedAt = new Date(employee.joinDate).getTime();
      return sum + Math.max(0, (Date.now() - joinedAt) / (1000 * 60 * 60 * 24 * 30));
    }, 0);
    return Math.round(totalMonths / employees.length);
  }, [employees]);
  const departmentBreakdown = useMemo(() => {
    const counts = new Map<string, number>();
    employees.forEach((employee) => {
      counts.set(employee.department, (counts.get(employee.department) ?? 0) + 1);
    });
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [employees]);

  const handleAddEmployee = async () => {
    if (!employeeForm.name || !employeeForm.email || !employeeForm.role || !employeeForm.departmentId) {
      showToast('error', 'Validation Error', 'Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const department = departments.find((item) => item.id === employeeForm.departmentId);
      const created = await createEmployee({
        name: employeeForm.name,
        email: employeeForm.email,
        role: employeeForm.role,
        department: department?.name ?? 'General',
        departmentId: employeeForm.departmentId,
        status: employeeForm.status,
        lastSeen: 'Just now',
        joinDate: employeeForm.joinDate,
        phone: employeeForm.phone || undefined,
        location: employeeForm.location || undefined,
        manager: employeeForm.manager || undefined,
        skills: employeeForm.skills.split(',').map((item) => item.trim()).filter(Boolean),
        salary: employeeForm.salary ? parseFloat(employeeForm.salary) : undefined,
        employmentType: employeeForm.employmentType,
      });
      showToast('success', 'Employee Added', `${created.name} has been added successfully`);
      setIsAddOpen(false);
      resetForm();
    } catch {
      showToast('error', 'Error', 'Failed to add employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    const employee = employees.find((item) => item.id === employeeId);
    if (!employee) return;
    try {
      await deleteEmployee(employeeId);
      showToast('success', 'Employee Deleted', `${employee.name} has been removed`);
    } catch {
      showToast('error', 'Delete Failed', 'Unable to delete employee');
    }
  };

  const handleExportToCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Job Title', 'Department', 'Employment Type', 'Location', 'Status', 'Join Date', 'Salary'];
    const csvRows = filteredEmployees.map((employee) => [
      employee.id,
      employee.name,
      employee.email,
      employee.role,
      employee.department,
      employee.employmentType,
      employee.location ?? '',
      employee.status,
      employee.joinDate,
      employee.salary ?? '',
    ]);
    const csvContent = [headers.join(','), ...csvRows.map((row) => row.map((cell) => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `employees_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('success', 'Export Successful', `Exported ${filteredEmployees.length} employees to CSV`);
  };

  const getStatusBadge = (status: string) => {
    const config = status === 'Active'
      ? { type: 'success' as const, icon: CheckCircle }
      : status === 'Away'
        ? { type: 'warning' as const, icon: Clock }
        : { type: 'neutral' as const, icon: Clock };
    const Icon = config.icon;
    return (
      <StatusBadge type={config.type}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </StatusBadge>
    );
  };

  const columns = [
    {
      key: 'id',
      header: 'ID',
      width: '12%',
      cell: (value: string) => <span className="font-mono text-xs text-muted-foreground">{value.slice(0, 8)}</span>
    },
    {
      key: 'name',
      header: 'Employee',
      width: '24%',
      cell: (value: string, row: Employee) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {value.split(' ').map((part) => part[0]).slice(0, 2).join('')}
          </div>
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-xs text-muted-foreground">{row.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      header: 'Job Title',
      width: '16%',
    },
    {
      key: 'department',
      header: 'Department',
      width: '14%',
      cell: (value: string) => <StatusBadge type="info">{value}</StatusBadge>
    },
    {
      key: 'employmentType',
      header: 'Type',
      width: '10%',
      cell: (value: string) => <span className="text-xs text-muted-foreground">{value}</span>
    },
    {
      key: 'location',
      header: 'Location',
      width: '12%',
      cell: (value?: string) => (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          {value || '—'}
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      width: '12%',
      cell: (value: string) => getStatusBadge(value)
    }
  ];

  return (
    <PageLayout
      title="Employee Management"
      description="Manage your organization's workforce"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" onClick={() => setIsAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>
      }
      kpis={[
        {
          title: 'Total Employees',
          value: loading ? '...' : totalEmployees.toString(),
          change: `${departments.length} departments`,
          changeType: 'positive',
          icon: <Users className="h-5 w-5" />
        },
        {
          title: 'Active',
          value: loading ? '...' : activeEmployees.toString(),
          change: `${totalEmployees ? Math.round((activeEmployees / totalEmployees) * 100) : 0}% of total`,
          changeType: 'positive',
          icon: <CheckCircle className="h-5 w-5" />
        },
        {
          title: 'Away',
          value: loading ? '...' : awayEmployees.toString(),
          change: 'Needs review',
          changeType: 'neutral',
          icon: <Clock className="h-5 w-5" />
        },
        {
          title: 'Avg. Tenure',
          value: loading ? '...' : `${averageTenure}mo`,
          change: 'Company average',
          changeType: 'neutral',
          icon: <TrendingUp className="h-5 w-5" />
        }
      ]}
    >
      <div className="mb-6 rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
                className="w-full rounded-md border border-border bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Away">Away</option>
              <option value="Offline">Offline</option>
            </select>
            <select
              className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
            >
              <option value="all">All Departments</option>
              {departments.map((department) => (
                <option key={department.id} value={department.name}>{department.name}</option>
              ))}
            </select>
          </div>
          {selectedRows.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{selectedRows.length} selected</span>
              <Button variant="outline" size="sm">
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportToCSV}>
                <FileText className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Full-time</span>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-semibold">{fullTimeEmployees}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {totalEmployees ? Math.round((fullTimeEmployees / totalEmployees) * 100) : 0}% of workforce
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Remote</span>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-semibold">{remoteEmployees}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {totalEmployees ? Math.round((remoteEmployees / totalEmployees) * 100) : 0}% work remotely
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Away</span>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-semibold">{awayEmployees}</div>
          <div className="text-xs text-muted-foreground mt-1">Currently unavailable</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Avg. Salary</span>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-semibold">${(averageSalary / 1000).toFixed(0)}k</div>
          <div className="text-xs text-muted-foreground mt-1">Annual compensation</div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-4 mb-6">
        <h3 className="text-sm font-semibold mb-3">Employees by Department</h3>
        <div className="grid grid-cols-6 gap-4">
          {departmentBreakdown.map(([department, count]) => (
            <div key={department} className="text-center">
              <div className="text-2xl font-semibold">{count}</div>
              <div className="text-xs text-muted-foreground mt-1">{department}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Employee Directory
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({filteredEmployees.length} {filteredEmployees.length === 1 ? 'employee' : 'employees'})
            </span>
          </h3>
        </div>
        <DataTable
          columns={columns}
          data={filteredEmployees}
          selectable
          selectedRows={selectedRows}
          onRowSelect={(id) => {
            setSelectedRows((prev) => prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]);
          }}
          onSelectAll={() => {
            setSelectedRows(selectedRows.length === filteredEmployees.length ? [] : filteredEmployees.map((employee) => employee.id));
          }}
          rowActions={(row: Employee) => (
            <Button variant="ghost" size="sm" onClick={() => handleDeleteEmployee(row.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        />
      </div>

      <FormDrawer
        title="Add New Employee"
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAddEmployee}
        isSubmitting={isSubmitting}
      >
        <FormField label="Full Name">
          <Input value={employeeForm.name} onChange={(e) => setEmployeeForm((prev) => ({ ...prev, name: e.target.value }))} required />
        </FormField>
        <FormField label="Email">
          <Input type="email" value={employeeForm.email} onChange={(e) => setEmployeeForm((prev) => ({ ...prev, email: e.target.value }))} required />
        </FormField>
        <FormField label="Phone">
          <Input value={employeeForm.phone} onChange={(e) => setEmployeeForm((prev) => ({ ...prev, phone: e.target.value }))} />
        </FormField>
        <FormField label="Job Title">
          <Input value={employeeForm.role} onChange={(e) => setEmployeeForm((prev) => ({ ...prev, role: e.target.value }))} required />
        </FormField>
        <FormField label="Department">
          <select
            className="w-full px-3 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            value={employeeForm.departmentId}
            onChange={(e) => setEmployeeForm((prev) => ({ ...prev, departmentId: e.target.value }))}
            required
          >
            <option value="">Select Department</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>{department.name}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Manager">
          <Input value={employeeForm.manager} onChange={(e) => setEmployeeForm((prev) => ({ ...prev, manager: e.target.value }))} />
        </FormField>
        <FormField label="Employment Type">
          <select
            className="w-full px-3 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            value={employeeForm.employmentType}
            onChange={(e) => setEmployeeForm((prev) => ({ ...prev, employmentType: e.target.value as Employee['employmentType'] }))}
            required
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Intern">Intern</option>
          </select>
        </FormField>
        <FormField label="Location">
          <select
            className="w-full px-3 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            value={employeeForm.location}
            onChange={(e) => setEmployeeForm((prev) => ({ ...prev, location: e.target.value }))}
            required
          >
            <option value="Office">Office</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </FormField>
        <FormField label="Join Date">
          <Input type="date" value={employeeForm.joinDate} onChange={(e) => setEmployeeForm((prev) => ({ ...prev, joinDate: e.target.value }))} required />
        </FormField>
        <FormField label="Salary">
          <Input type="number" value={employeeForm.salary} onChange={(e) => setEmployeeForm((prev) => ({ ...prev, salary: e.target.value }))} />
        </FormField>
        <FormField label="Status">
          <select
            className="w-full px-3 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            value={employeeForm.status}
            onChange={(e) => setEmployeeForm((prev) => ({ ...prev, status: e.target.value as Employee['status'] }))}
            required
          >
            <option value="Active">Active</option>
            <option value="Away">Away</option>
            <option value="Offline">Offline</option>
          </select>
        </FormField>
        <FormField label="Skills">
          <Input value={employeeForm.skills} onChange={(e) => setEmployeeForm((prev) => ({ ...prev, skills: e.target.value }))} placeholder="React, Payroll, HRIS" />
        </FormField>
      </FormDrawer>
    </PageLayout>
  );
}
