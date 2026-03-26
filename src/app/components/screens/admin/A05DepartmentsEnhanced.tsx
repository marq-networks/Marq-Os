import { PageLayout } from '../../shared/PageLayout';
import { DataTable } from '../../shared/DataTable';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { FormDrawer } from '../../shared/FormDrawer';
import { FormField, Input, TextArea, Select, APIDoc } from '../../ui/form';
import { ConfirmModal } from '../../ui/modal';
import { EmptyState } from '../../shared/EmptyState';
import { LoadingState, TableSkeleton } from '../../shared/LoadingState';
import { ErrorBanner } from '../../shared/ErrorState';
import { useToast } from '../../ui/toast';
import { 
  Building2, 
  Plus, 
  Download, 
  Filter, 
  Edit, 
  Trash2,
  Users,
  TrendingUp
} from 'lucide-react';
import { useState } from 'react';

interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  headOfDepartment: string;
  employeeCount: number;
  budget: string;
  status: 'Active' | 'Inactive';
}

const mockDepartments: Department[] = [
  {
    id: '1',
    name: 'Engineering',
    code: 'ENG',
    description: 'Software development and technology',
    headOfDepartment: 'Sarah Johnson',
    employeeCount: 24,
    budget: '$2.4M',
    status: 'Active'
  },
  {
    id: '2',
    name: 'Marketing',
    code: 'MKT',
    description: 'Brand, content, and digital marketing',
    headOfDepartment: 'Michael Chen',
    employeeCount: 12,
    budget: '$850K',
    status: 'Active'
  },
  {
    id: '3',
    name: 'Sales',
    code: 'SAL',
    description: 'Revenue generation and client relations',
    headOfDepartment: 'Emma Davis',
    employeeCount: 18,
    budget: '$1.2M',
    status: 'Active'
  },
  {
    id: '4',
    name: 'Human Resources',
    code: 'HR',
    description: 'Talent management and employee relations',
    headOfDepartment: 'David Wilson',
    employeeCount: 6,
    budget: '$450K',
    status: 'Active'
  },
  {
    id: '5',
    name: 'Finance',
    code: 'FIN',
    description: 'Financial planning and accounting',
    headOfDepartment: 'Lisa Anderson',
    employeeCount: 8,
    budget: '$680K',
    status: 'Active'
  }
];

interface DepartmentForm {
  name: string;
  code: string;
  description: string;
  headOfDepartment: string;
  budget: string;
  status: 'Active' | 'Inactive';
}

type ViewState = 'loading' | 'empty' | 'error' | 'data';

export function A05DepartmentsEnhanced() {
  const { showToast } = useToast();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [viewState, setViewState] = useState<ViewState>('data');
  const [showError, setShowError] = useState(false);
  
  // Form states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<DepartmentForm>({
    name: '',
    code: '',
    description: '',
    headOfDepartment: '',
    budget: '',
    status: 'Active'
  });
  const [formErrors, setFormErrors] = useState<Partial<DepartmentForm>>({});

  // Delete modal
  const [deleteModal, setDeleteModal] = useState<{ 
    isOpen: boolean; 
    departmentId?: string;
    employeeCount?: number; 
  }>({ isOpen: false });

  const validateForm = (): boolean => {
    const errors: Partial<DepartmentForm> = {};
    
    if (!formData.name.trim()) errors.name = 'Department name is required';
    if (!formData.code.trim()) errors.code = 'Department code is required';
    else if (!/^[A-Z]{2,5}$/.test(formData.code)) {
      errors.code = 'Code must be 2-5 uppercase letters';
    }
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.headOfDepartment) errors.headOfDepartment = 'Head of department is required';
    if (!formData.budget.trim()) errors.budget = 'Budget is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenDrawer = (editMode = false, dept?: Department) => {
    setIsEditing(editMode);
    if (editMode && dept) {
      setFormData({
        name: dept.name,
        code: dept.code,
        description: dept.description,
        headOfDepartment: dept.headOfDepartment,
        budget: dept.budget,
        status: dept.status
      });
    } else {
      setFormData({
        name: '',
        code: '',
        description: '',
        headOfDepartment: '',
        budget: '',
        status: 'Active'
      });
    }
    setFormErrors({});
    setIsDrawerOpen(true);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (isEditing) {
      setDepartments(prev => prev.map(d => 
        d.code === formData.code 
          ? { ...d, ...formData, employeeCount: d.employeeCount } 
          : d
      ));
    } else {
      const newDept: Department = {
        id: Date.now().toString(),
        ...formData,
        employeeCount: 0
      };
      setDepartments(prev => [...prev, newDept]);
    }
    
    setIsSubmitting(false);
    setIsDrawerOpen(false);
    
    showToast(
      'success',
      isEditing ? 'Department updated' : 'Department created',
      isEditing 
        ? `${formData.name} has been updated successfully` 
        : `${formData.name} has been added to the organization`
    );
  };

  const handleDelete = async (departmentId: string) => {
    setDepartments(prev => prev.filter(d => d.id !== departmentId));
    setDeleteModal({ isOpen: false });
    
    showToast('success', 'Department deleted', 'Department has been removed from the system');
    
    // Audit log indicator
    setTimeout(() => {
      showToast('info', 'Audit log updated', 'Deletion recorded in system logs');
    }, 500);
  };

  const columns = [
    { 
      key: 'name', 
      header: 'Department', 
      width: '20%',
      cell: (value: string, row: Department) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-xs text-muted-foreground">{row.code}</div>
        </div>
      )
    },
    { 
      key: 'description', 
      header: 'Description', 
      width: '25%',
      cell: (value: string) => (
        <div className="text-sm text-muted-foreground truncate max-w-xs">
          {value}
        </div>
      )
    },
    { 
      key: 'headOfDepartment', 
      header: 'Head of Dept.', 
      width: '15%' 
    },
    { 
      key: 'employeeCount', 
      header: 'Employees', 
      width: '10%',
      cell: (value: number) => (
        <div className="flex items-center gap-1">
          <Users className="h-3 w-3 text-muted-foreground" />
          <span>{value}</span>
        </div>
      )
    },
    { 
      key: 'budget', 
      header: 'Budget', 
      width: '10%',
      cell: (value: string) => (
        <span className="font-mono text-sm">{value}</span>
      )
    },
    { 
      key: 'status', 
      header: 'Status', 
      width: '10%',
      cell: (value: string) => (
        <StatusBadge type={value === 'Active' ? 'success' : 'neutral'}>
          {value}
        </StatusBadge>
      )
    },
    {
      key: 'actions',
      header: '',
      width: '10%',
      cell: (value: any, row: Department) => (
        <div className="flex items-center justify-end gap-1">
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => handleOpenDrawer(true, row)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => setDeleteModal({ 
              isOpen: true, 
              departmentId: row.id,
              employeeCount: row.employeeCount 
            })}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      )
    }
  ];

  const totalEmployees = departments.reduce((sum, d) => sum + d.employeeCount, 0);
  const totalBudget = departments.reduce((sum, d) => {
    const budget = parseFloat(d.budget.replace(/[$MK,]/g, '')) * 
                   (d.budget.includes('M') ? 1000000 : 1000);
    return sum + budget;
  }, 0);

  // Loading state
  if (viewState === 'loading') {
    return (
      <PageLayout
        title="ADMIN – A-05 – Departments – v1.2"
        description="Manage organizational departments and structure"
      >
        <LoadingState />
      </PageLayout>
    );
  }

  // Empty state
  if (viewState === 'empty') {
    return (
      <PageLayout
        title="ADMIN – A-05 – Departments – v1.2"
        description="Manage organizational departments and structure"
      >
        <EmptyState
          icon={Building2}
          title="No departments found"
          description="Start building your organizational structure by creating your first department. Departments help organize employees and manage budgets."
          actionLabel="Create First Department"
          onAction={() => handleOpenDrawer()}
        />
      </PageLayout>
    );
  }

  return (
    <>
      <PageLayout
        title="ADMIN – A-05 – Departments – v1.2"
        description="Manage organizational departments and structure"
        actions={
          <>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={() => handleOpenDrawer()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Department
            </Button>
          </>
        }
        kpis={[
          {
            title: 'Total Departments',
            value: departments.length.toString(),
            change: '+1 this quarter',
            changeType: 'positive',
            icon: <Building2 className="h-5 w-5" />
          },
          {
            title: 'Total Employees',
            value: totalEmployees.toString(),
            change: 'Across all departments',
            icon: <Users className="h-5 w-5" />
          },
          {
            title: 'Total Budget',
            value: `$${(totalBudget / 1000000).toFixed(1)}M`,
            change: 'Annual allocation',
            icon: <TrendingUp className="h-5 w-5" />
          },
          {
            title: 'Active',
            value: departments.filter(d => d.status === 'Active').length.toString(),
            icon: <Building2 className="h-5 w-5" />
          },
        ]}
      >
        {showError && (
          <ErrorBanner
            message="Failed to load department data. Please check your connection."
            onDismiss={() => setShowError(false)}
            onRetry={() => setViewState('loading')}
          />
        )}

        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-4">Department Directory</h3>
          <DataTable 
            columns={columns} 
            data={departments}
            selectable
            selectedRows={selectedRows}
            onRowSelect={(id) => {
              setSelectedRows(prev => 
                prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
              );
            }}
            onSelectAll={() => {
              setSelectedRows(
                selectedRows.length === departments.length 
                  ? [] 
                  : departments.map(d => d.id)
              );
            }}
          />
        </div>
      </PageLayout>

      {/* Create/Edit Department Drawer */}
      <FormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={isEditing ? 'Edit Department' : 'Create New Department'}
        description={
          isEditing 
            ? 'Update department information and settings' 
            : 'Add a new department to your organizational structure'
        }
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel={isEditing ? 'Update Department' : 'Create Department'}
        apiDoc={
          <APIDoc
            method="POST"
            endpoint="/api/departments"
            payload={{
              name: "string",
              code: "string (2-5 uppercase letters)",
              description: "string",
              headOfDepartment: "user_id",
              budget: "string",
              status: "Active | Inactive"
            }}
            response={{
              id: "uuid",
              name: "string",
              code: "string",
              employeeCount: 0,
              createdAt: "ISO8601",
              status: "Active"
            }}
          />
        }
      >
        <div className="space-y-6">
          <FormField
            label="Department Name"
            name="name"
            required
            error={formErrors.name}
            helperText="Full name of the department"
          >
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={!!formErrors.name}
              placeholder="e.g., Engineering"
            />
          </FormField>

          <FormField
            label="Department Code"
            name="code"
            required
            error={formErrors.code}
            helperText="2-5 uppercase letters (e.g., ENG, MKT)"
          >
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              error={!!formErrors.code}
              placeholder="ENG"
              maxLength={5}
            />
          </FormField>

          <FormField
            label="Description"
            name="description"
            required
            error={formErrors.description}
            helperText="Brief description of the department's role"
          >
            <TextArea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              error={!!formErrors.description}
              placeholder="Describe the department's responsibilities..."
              rows={3}
            />
          </FormField>

          <FormField
            label="Head of Department"
            name="headOfDepartment"
            required
            error={formErrors.headOfDepartment}
            helperText="Manager responsible for this department"
          >
            <Select
              id="headOfDepartment"
              value={formData.headOfDepartment}
              onChange={(e) => setFormData({ ...formData, headOfDepartment: e.target.value })}
              error={!!formErrors.headOfDepartment}
              options={[
                { value: '', label: 'Select a manager' },
                { value: 'Sarah Johnson', label: 'Sarah Johnson' },
                { value: 'Michael Chen', label: 'Michael Chen' },
                { value: 'Emma Davis', label: 'Emma Davis' },
                { value: 'David Wilson', label: 'David Wilson' },
                { value: 'Lisa Anderson', label: 'Lisa Anderson' }
              ]}
            />
          </FormField>

          <FormField
            label="Annual Budget"
            name="budget"
            required
            error={formErrors.budget}
            helperText="Annual budget allocation (e.g., $1.2M, $850K)"
          >
            <Input
              id="budget"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              error={!!formErrors.budget}
              placeholder="$1.2M"
            />
          </FormField>

          <FormField
            label="Status"
            name="status"
            required
          >
            <Select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' }
              ]}
            />
          </FormField>
        </div>
      </FormDrawer>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false })}
        onConfirm={() => handleDelete(deleteModal.departmentId!)}
        title="Delete Department"
        description={
          deleteModal.employeeCount && deleteModal.employeeCount > 0
            ? `This department has ${deleteModal.employeeCount} employee${deleteModal.employeeCount > 1 ? 's' : ''}. Please reassign them before deleting. All department data, budgets, and history will be permanently removed.`
            : 'Are you sure you want to delete this department? This action cannot be undone. All department data and history will be permanently removed.'
        }
        confirmText="Delete Department"
        variant="danger"
      />
    </>
  );
}
