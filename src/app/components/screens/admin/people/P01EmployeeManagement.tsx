/**
 * P01 - EMPLOYEE MANAGEMENT
 * Comprehensive employee directory and management interface
 */

import { useState, useEffect } from 'react';
import { PageLayout } from '../../../shared/PageLayout';
import { DataTable } from '../../../shared/DataTable';
import { StatusBadge } from '../../../shared/StatusBadge';
import { Button } from '../../../ui/button';
import { FormDrawer } from '../../../shared/FormDrawer';
import { FormField, Input, Select, TextArea } from '../../../ui/form';
import { useToast } from '../../../ui/toast';
import {
  Users,
  Plus,
  Download,
  Filter,
  Search,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  UserPlus,
  FileText,
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-react';
import { mockEmployees as initialMockEmployees, mockEmployeeStats, Employee } from '../../../../data/employeeData';

// LocalStorage key
const EMPLOYEES_STORAGE_KEY = 'workos_employees';

export function P01EmployeeManagement() {
  const { showToast } = useToast();
  
  // Load employees from localStorage or use mock data
  const [employees, setEmployees] = useState<Employee[]>(() => {
    try {
      const stored = localStorage.getItem(EMPLOYEES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialMockEmployees;
      }
    } catch (error) {
      console.error('Failed to load employees from localStorage:', error);
    }
    return initialMockEmployees;
  });

  // Save to localStorage whenever employees change
  useEffect(() => {
    try {
      localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(employees));
    } catch (error) {
      console.error('Failed to save employees to localStorage:', error);
    }
  }, [employees]);

  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state for add/edit employee
  const [employeeForm, setEmployeeForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    department: '',
    manager: '',
    employmentType: 'Full-Time' as 'Full-Time' | 'Part-Time' | 'Contract' | 'Intern',
    workLocation: 'Office' as 'Office' | 'Remote' | 'Hybrid',
    hireDate: new Date().toISOString().split('T')[0],
    salary: '',
    status: 'Active' as 'Active' | 'On Leave' | 'Probation' | 'Suspended' | 'Terminated',
    accessLevel: 'Employee' as 'Employee' | 'Manager' | 'Admin' | 'Super Admin',
    workingHours: '40',
    annualLeaveBalance: '20',
    sickLeaveBalance: '10'
  });

  // Reset form
  const resetForm = () => {
    setEmployeeForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      jobTitle: '',
      department: '',
      manager: '',
      employmentType: 'Full-Time',
      workLocation: 'Office',
      hireDate: new Date().toISOString().split('T')[0],
      salary: '',
      status: 'Active',
      accessLevel: 'Employee',
      workingHours: '40',
      annualLeaveBalance: '20',
      sickLeaveBalance: '10'
    });
  };

  // Add new employee
  const handleAddEmployee = async () => {
    // Validate required fields
    if (!employeeForm.firstName || !employeeForm.lastName || !employeeForm.email || 
        !employeeForm.jobTitle || !employeeForm.department || !employeeForm.salary) {
      showToast('error', 'Validation Error', 'Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate new employee ID
      const newId = `emp-${String(employees.length + 1).padStart(3, '0')}`;
      const newEmployeeId = `EMP-${String(employees.length + 1).padStart(3, '0')}`;

      const newEmployee: Employee = {
        id: newId,
        employeeId: newEmployeeId,
        firstName: employeeForm.firstName,
        lastName: employeeForm.lastName,
        fullName: `${employeeForm.firstName} ${employeeForm.lastName}`,
        email: employeeForm.email,
        phone: employeeForm.phone || undefined,
        jobTitle: employeeForm.jobTitle,
        department: employeeForm.department,
        departmentId: `dept-${employeeForm.department.toLowerCase()}`,
        manager: employeeForm.manager || undefined,
        managerId: employeeForm.manager ? `emp-manager-${Date.now()}` : undefined,
        employmentType: employeeForm.employmentType,
        workLocation: employeeForm.workLocation,
        hireDate: employeeForm.hireDate,
        startDate: employeeForm.hireDate,
        salary: parseFloat(employeeForm.salary),
        currency: 'USD',
        payFrequency: 'Monthly',
        status: employeeForm.status,
        accessLevel: employeeForm.accessLevel,
        workingHours: parseInt(employeeForm.workingHours),
        timeZone: 'America/New_York',
        annualLeaveBalance: parseInt(employeeForm.annualLeaveBalance),
        sickLeaveBalance: parseInt(employeeForm.sickLeaveBalance),
        totalLeaveUsed: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'current-user',
        lastActive: 'Just now',
        isManager: employeeForm.accessLevel === 'Manager' || employeeForm.accessLevel === 'Admin',
        hasDirectReports: false,
        requiresOnboarding: true,
        pendingActions: ['Complete onboarding', 'Set up workspace']
      };

      setEmployees(prev => [...prev, newEmployee]);
      
      showToast('success', 'Employee Added', `${newEmployee.fullName} has been added successfully`);
      setIsAddOpen(false);
      resetForm();
    } catch (error) {
      showToast('error', 'Error', 'Failed to add employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete employee
  const handleDeleteEmployee = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    if (employee) {
      setEmployees(prev => prev.filter(e => e.id !== employeeId));
      showToast('success', 'Employee Deleted', `${employee.fullName} has been removed`);
    }
  };

  // Export to CSV
  const handleExportToCSV = () => {
    const headers = [
      'Employee ID',
      'Name',
      'Email',
      'Phone',
      'Job Title',
      'Department',
      'Employment Type',
      'Location',
      'Status',
      'Hire Date',
      'Salary'
    ];
    
    const csvData = filteredEmployees.map(e => [
      e.employeeId,
      e.fullName,
      e.email,
      e.phone || '',
      e.jobTitle,
      e.department,
      e.employmentType,
      e.workLocation,
      e.status,
      e.hireDate,
      e.salary
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `\"${cell}\"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `employees_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('success', 'Export successful', `Exported ${filteredEmployees.length} employees to CSV`);
  };

  // Filter employees
  const filteredEmployees = employees.filter(emp => {
    const matchesStatus = filterStatus === 'all' || emp.status === filterStatus;
    const matchesDepartment = filterDepartment === 'all' || emp.department === filterDepartment;
    const matchesSearch = searchQuery === '' || 
      emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesDepartment && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { type: 'success' | 'warning' | 'error' | 'info' | 'neutral', icon?: any }> = {
      'Active': { type: 'success', icon: CheckCircle },
      'On Leave': { type: 'warning', icon: Clock },
      'Probation': { type: 'info', icon: AlertCircle },
      'Suspended': { type: 'error', icon: AlertCircle },
      'Terminated': { type: 'neutral' }
    };
    
    const config = statusMap[status] || { type: 'neutral' };
    return (
      <StatusBadge type={config.type}>
        {config.icon && <config.icon className="h-3 w-3 mr-1" />}
        {status}
      </StatusBadge>
    );
  };

  const columns = [
    {
      key: 'employeeId',
      header: 'ID',
      width: '8%',
      cell: (value: string) => (
        <span className="font-mono text-xs text-muted-foreground">{value}</span>
      )
    },
    {
      key: 'fullName',
      header: 'Employee',
      width: '20%',
      cell: (value: string, row: Employee) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {row.firstName[0]}{row.lastName[0]}
          </div>
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-xs text-muted-foreground">{row.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'jobTitle',
      header: 'Job Title',
      width: '15%',
      cell: (value: string) => <span className="text-sm">{value}</span>
    },
    {
      key: 'department',
      header: 'Department',
      width: '12%',
      cell: (value: string) => (
        <StatusBadge type="info">{value}</StatusBadge>
      )
    },
    {
      key: 'employmentType',
      header: 'Type',
      width: '10%',
      cell: (value: string) => (
        <span className="text-xs text-muted-foreground">{value}</span>
      )
    },
    {
      key: 'workLocation',
      header: 'Location',
      width: '10%',
      cell: (value: string) => (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          {value}
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      width: '12%',
      cell: (value: string) => getStatusBadge(value)
    },
    {
      key: 'lastActive',
      header: 'Last Active',
      width: '10%',
      cell: (value: string) => (
        <span className="text-xs text-muted-foreground">{value}</span>
      )
    }
  ];

  // Get unique departments for filter
  const departments = Array.from(new Set(employees.map(e => e.department))).sort();

  return (
    <PageLayout
      title="Employee Management"
      description="Manage your organization's workforce"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
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
          value: mockEmployeeStats.totalEmployees.toString(),
          change: `+${mockEmployeeStats.newHires30Days} this month`,
          changeType: 'positive',
          icon: <Users className="h-5 w-5" />
        },
        {
          title: 'Active',
          value: mockEmployeeStats.activeEmployees.toString(),
          change: `${Math.round((mockEmployeeStats.activeEmployees / mockEmployeeStats.totalEmployees) * 100)}% of total`,
          changeType: 'positive',
          icon: <CheckCircle className="h-5 w-5" />
        },
        {
          title: 'On Probation',
          value: mockEmployeeStats.onProbation.toString(),
          change: 'Requires review',
          changeType: 'neutral',
          icon: <Clock className="h-5 w-5" />
        },
        {
          title: 'Avg. Tenure',
          value: `${mockEmployeeStats.averageTenure}mo`,
          change: 'Company average',
          changeType: 'neutral',
          icon: <TrendingUp className="h-5 w-5" />
        }
      ]}
    >
      {/* Quick Actions Bar */}
      <div className="mb-6 rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {/* Search */}
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

            {/* Status Filter */}
            <select
              className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Probation">Probation</option>
              <option value="Suspended">Suspended</option>
            </select>

            {/* Department Filter */}
            <select
              className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Selected Actions */}
          {selectedRows.length > 0 && (
            <div className="flex items-center gap-2 ml-4">
              <span className="text-sm text-muted-foreground">
                {selectedRows.length} selected
              </span>
              <Button variant="outline" size="sm">
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Employee Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Full-Time</span>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-semibold">{mockEmployeeStats.fullTime}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {Math.round((mockEmployeeStats.fullTime / mockEmployeeStats.totalEmployees) * 100)}% of workforce
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Remote</span>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-semibold">{mockEmployeeStats.remote}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {Math.round((mockEmployeeStats.remote / mockEmployeeStats.totalEmployees) * 100)}% work remotely
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">On Leave</span>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-semibold">{mockEmployeeStats.onLeave}</div>
          <div className="text-xs text-muted-foreground mt-1">Currently away</div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Avg. Salary</span>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-semibold">
            ${(mockEmployeeStats.averageSalary / 1000).toFixed(0)}k
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Annual compensation
          </div>
        </div>
      </div>

      {/* Department Breakdown */}
      <div className="rounded-lg border border-border bg-card p-4 mb-6">
        <h3 className="text-sm font-semibold mb-3">Employees by Department</h3>
        <div className="grid grid-cols-6 gap-4">
          {Object.entries(mockEmployeeStats.byDepartment).map(([dept, count]) => (
            <div key={dept} className="text-center">
              <div className="text-2xl font-semibold">{count}</div>
              <div className="text-xs text-muted-foreground mt-1">{dept}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Employee Table */}
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
            setSelectedRows(prev =>
              prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
            );
          }}
          onSelectAll={() => {
            setSelectedRows(
              selectedRows.length === filteredEmployees.length
                ? []
                : filteredEmployees.map(e => e.id)
            );
          }}
        />
      </div>

      {/* Pending Actions Summary */}
      {employees.some(e => e.pendingActions && e.pendingActions.length > 0) && (
        <div className="mt-6 rounded-lg border border-warning/50 bg-warning/5 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-warning mb-2">
                Pending Employee Actions
              </h4>
              <div className="space-y-2">
                {employees
                  .filter(e => e.pendingActions && e.pendingActions.length > 0)
                  .map(emp => (
                    <div key={emp.id} className="text-sm">
                      <span className="font-medium">{emp.fullName}:</span>{' '}
                      <span className="text-muted-foreground">
                        {emp.pendingActions?.join(', ')}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Form */}
      <FormDrawer
        title="Add New Employee"
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAddEmployee}
        isSubmitting={isSubmitting}
      >
        <FormField label="First Name">
          <Input
            type="text"
            value={employeeForm.firstName}
            onChange={(e) => setEmployeeForm(prev => ({ ...prev, firstName: e.target.value }))}
            required
          />
        </FormField>
        <FormField label="Last Name">
          <Input
            type="text"
            value={employeeForm.lastName}
            onChange={(e) => setEmployeeForm(prev => ({ ...prev, lastName: e.target.value }))}
            required
          />
        </FormField>
        <FormField label="Email">
          <Input
            type="email"
            value={employeeForm.email}
            onChange={(e) => setEmployeeForm(prev => ({ ...prev, email: e.target.value }))}
            required
          />
        </FormField>
        <FormField label="Phone">
          <Input
            type="tel"
            value={employeeForm.phone}
            onChange={(e) => setEmployeeForm(prev => ({ ...prev, phone: e.target.value }))}
          />
        </FormField>
        <FormField label="Job Title">
          <Input
            type="text"
            value={employeeForm.jobTitle}
            onChange={(e) => setEmployeeForm(prev => ({ ...prev, jobTitle: e.target.value }))}
            required
          />
        </FormField>
        <FormField label="Department">
          <select
            className="w-full px-3 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            value={employeeForm.department}
            onChange={(e) => setEmployeeForm(prev => ({ ...prev, department: e.target.value }))}
            required
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Manager">
          <Input
            type="text"
            value={employeeForm.manager}
            onChange={(e) => setEmployeeForm(prev => ({ ...prev, manager: e.target.value }))}
          />
        </FormField>
        <FormField label="Employment Type">
          <select
            className="w-full px-3 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            value={employeeForm.employmentType}
            onChange={(e) => setEmployeeForm(prev => ({ ...prev, employmentType: e.target.value as 'Full-Time' | 'Part-Time' | 'Contract' | 'Intern' }))}
            required
          >
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Contract">Contract</option>
            <option value="Intern">Intern</option>
          </select>
        </FormField>
        <FormField label="Work Location">
          <select
            className="w-full px-3 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            value={employeeForm.workLocation}
            onChange={(e) => setEmployeeForm(prev => ({ ...prev, workLocation: e.target.value as 'Office' | 'Remote' | 'Hybrid' }))}
            required
          >
            <option value="Office">Office</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </FormField>
        <FormField label="Hire Date">
          <Input
            type="date"
            value={employeeForm.hireDate}
            onChange={(e) => setEmployeeForm(prev => ({ ...prev, hireDate: e.target.value }))}
            required
          />
        </FormField>
        <FormField label="Salary">
          <Input
            type="number"
            value={employeeForm.salary}
            onChange={(e) => setEmployeeForm(prev => ({ ...prev, salary: e.target.value }))}
            required
          />
        </FormField>
        <FormField label="Status">
          <select
            className="w-full px-3 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            value={employeeForm.status}
            onChange={(e) => setEmployeeForm(prev => ({ ...prev, status: e.target.value as 'Active' | 'On Leave' | 'Probation' | 'Suspended' | 'Terminated' }))}
            required
          >
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Probation">Probation</option>
            <option value="Suspended">Suspended</option>
            <option value="Terminated">Terminated</option>
          </select>
        </FormField>
        <FormField label="Access Level">
          <select
            className="w-full px-3 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            value={employeeForm.accessLevel}
            onChange={(e) => setEmployeeForm(prev => ({ ...prev, accessLevel: e.target.value as 'Employee' | 'Manager' | 'Admin' | 'Super Admin' }))}
            required
          >
            <option value="Employee">Employee</option>
            <option value="Manager">Manager</option>
            <option value="Admin">Admin</option>
            <option value="Super Admin">Super Admin</option>
          </select>
        </FormField>
        <FormField label="Working Hours">
          <Input
            type="number"
            value={employeeForm.workingHours}
            onChange={(e) => setEmployeeForm(prev => ({ ...prev, workingHours: e.target.value }))}
            required
          />
        </FormField>
        <FormField label="Annual Leave Balance">
          <Input
            type="number"
            value={employeeForm.annualLeaveBalance}
            onChange={(e) => setEmployeeForm(prev => ({ ...prev, annualLeaveBalance: e.target.value }))}
            required
          />
        </FormField>
        <FormField label="Sick Leave Balance">
          <Input
            type="number"
            value={employeeForm.sickLeaveBalance}
            onChange={(e) => setEmployeeForm(prev => ({ ...prev, sickLeaveBalance: e.target.value }))}
            required
          />
        </FormField>
      </FormDrawer>
    </PageLayout>
  );
}