import { PageLayout } from '../../shared/PageLayout';
import { DataTable } from '../../shared/DataTable';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { FormDrawer } from '../../shared/FormDrawer';
import { FormField, Input, Select, APIDoc } from '../../ui/form';
import { ConfirmModal } from '../../ui/modal';
import { EmptyState } from '../../shared/EmptyState';
import { LoadingState } from '../../shared/LoadingState';
import { ErrorBanner } from '../../shared/ErrorState';
import { useToast } from '../../ui/toast';
import { Users, Plus, Download, Filter, MoreVertical, Edit, Trash2, UserX } from 'lucide-react';
import { mockUsers } from '../../../data/mockData';
import { useState } from 'react';

type ViewState = 'loading' | 'empty' | 'error' | 'data';

interface UserForm {
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
}

export function A03UsersEnhanced() {
  const { showToast } = useToast();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [viewState, setViewState] = useState<ViewState>('data');
  const [showError, setShowError] = useState(false);
  
  // Form states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<UserForm>({
    name: '',
    email: '',
    role: '',
    department: '',
    status: 'Active'
  });
  const [formErrors, setFormErrors] = useState<Partial<UserForm>>({});

  // Confirmation modals
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; userId?: string }>({ isOpen: false });
  const [suspendModal, setSuspendModal] = useState<{ isOpen: boolean; userId?: string }>({ isOpen: false });

  const validateForm = (): boolean => {
    const errors: Partial<UserForm> = {};
    
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    if (!formData.role) errors.role = 'Role is required';
    if (!formData.department) errors.department = 'Department is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenDrawer = (editMode = false, user?: any) => {
    setIsEditing(editMode);
    if (editMode && user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        status: user.status
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: '',
        department: '',
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
    
    setIsSubmitting(false);
    setIsDrawerOpen(false);
    
    showToast(
      'success',
      isEditing ? 'User updated successfully' : 'User created successfully',
      isEditing ? `${formData.name} has been updated` : `${formData.name} has been added to the system`
    );
  };

  const handleDelete = async (userId: string) => {
    showToast('success', 'User deleted', 'User has been removed from the system');
    setDeleteModal({ isOpen: false });
  };

  const handleSuspend = async (userId: string) => {
    showToast('warning', 'User suspended', 'User access has been temporarily suspended');
    setSuspendModal({ isOpen: false });
  };

  const handleExport = () => {
    showToast('success', 'Export started', 'Your user data is being prepared for download');
    // Simulate file download
    setTimeout(() => {
      showToast('success', 'Export complete', 'users-export.csv downloaded successfully');
    }, 2000);
  };

  const columns = [
    { key: 'name', header: 'Name', width: '20%' },
    { key: 'email', header: 'Email', width: '25%' },
    { key: 'role', header: 'Role', width: '15%' },
    { 
      key: 'department', 
      header: 'Department', 
      width: '15%',
      cell: (value: string) => <StatusBadge type="info">{value}</StatusBadge>
    },
    { 
      key: 'status', 
      header: 'Status', 
      width: '15%',
      cell: (value: string) => {
        const type = value === 'Active' ? 'success' : value === 'Suspended' ? 'warning' : 'neutral';
        return <StatusBadge type={type}>{value}</StatusBadge>;
      }
    },
    {
      key: 'actions',
      header: '',
      width: '10%',
      cell: (value: any, row: any) => (
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
            onClick={() => setSuspendModal({ isOpen: true, userId: row.id })}
          >
            <UserX className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => setDeleteModal({ isOpen: true, userId: row.id })}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      )
    }
  ];

  // Loading state
  if (viewState === 'loading') {
    return (
      <PageLayout
        title="ADMIN – A-03 – Users – v1.2"
        description="Manage all users in your organization"
      >
        <LoadingState />
      </PageLayout>
    );
  }

  // Empty state
  if (viewState === 'empty') {
    return (
      <PageLayout
        title="ADMIN – A-03 – Users – v1.2"
        description="Manage all users in your organization"
      >
        <EmptyState
          icon={Users}
          title="No users found"
          description="Get started by adding your first user to the system. Users can be employees, contractors, or administrators."
          actionLabel="Add First User"
          onAction={() => handleOpenDrawer()}
        />
      </PageLayout>
    );
  }

  return (
    <>
      <PageLayout
        title="ADMIN – A-03 – Users – v1.2"
        description="Manage all users in your organization"
        actions={
          <>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={() => handleOpenDrawer()}>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </>
        }
        kpis={[
          {
            title: 'Total Users',
            value: '52',
            change: '+4 this month',
            changeType: 'positive',
            icon: <Users className="h-5 w-5" />
          },
          {
            title: 'Active',
            value: '48',
            change: '92% active rate',
            changeType: 'positive',
            icon: <Users className="h-5 w-5" />
          },
          {
            title: 'New This Month',
            value: '4',
            icon: <Users className="h-5 w-5" />
          },
          {
            title: 'Pending Invites',
            value: '2',
            icon: <Users className="h-5 w-5" />
          },
        ]}
      >
        {showError && (
          <ErrorBanner
            message="Failed to load user data. Please check your connection and try again."
            onDismiss={() => setShowError(false)}
            onRetry={() => setViewState('loading')}
          />
        )}

        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-4">User Directory</h3>
          <DataTable 
            columns={columns} 
            data={mockUsers}
            selectable
            selectedRows={selectedRows}
            onRowSelect={(id) => {
              setSelectedRows(prev => 
                prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
              );
            }}
            onSelectAll={() => {
              setSelectedRows(selectedRows.length === mockUsers.length ? [] : mockUsers.map(u => u.id));
            }}
          />
        </div>
      </PageLayout>

      {/* Create/Edit User Drawer */}
      <FormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={isEditing ? 'Edit User' : 'Add New User'}
        description={isEditing ? 'Update user information and permissions' : 'Create a new user account'}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel={isEditing ? 'Update User' : 'Create User'}
        apiDoc={
          <APIDoc
            method="POST"
            endpoint="/api/users"
            payload={{
              name: "string",
              email: "string",
              role: "string",
              department: "string",
              status: "Active | Inactive"
            }}
            response={{
              id: "string",
              name: "string",
              email: "string",
              createdAt: "ISO8601",
              status: "Active"
            }}
          />
        }
      >
        <div className="space-y-6">
          <FormField
            label="Full Name"
            name="name"
            required
            error={formErrors.name}
            helperText="Legal name as it appears on official documents"
          >
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={!!formErrors.name}
              placeholder="John Doe"
            />
          </FormField>

          <FormField
            label="Email Address"
            name="email"
            required
            error={formErrors.email}
            helperText="Work email for system access and notifications"
          >
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={!!formErrors.email}
              placeholder="john.doe@company.com"
            />
          </FormField>

          <FormField
            label="Role"
            name="role"
            required
            error={formErrors.role}
            helperText="Determines user permissions and access level"
          >
            <Select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              error={!!formErrors.role}
              options={[
                { value: '', label: 'Select a role' },
                { value: 'Employee', label: 'Employee' },
                { value: 'Manager', label: 'Manager' },
                { value: 'Admin', label: 'Administrator' },
                { value: 'Super Admin', label: 'Super Administrator' }
              ]}
            />
          </FormField>

          <FormField
            label="Department"
            name="department"
            required
            error={formErrors.department}
          >
            <Select
              id="department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              error={!!formErrors.department}
              options={[
                { value: '', label: 'Select a department' },
                { value: 'Engineering', label: 'Engineering' },
                { value: 'Marketing', label: 'Marketing' },
                { value: 'Sales', label: 'Sales' },
                { value: 'HR', label: 'Human Resources' },
                { value: 'Finance', label: 'Finance' }
              ]}
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
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
                { value: 'Suspended', label: 'Suspended' }
              ]}
            />
          </FormField>
        </div>
      </FormDrawer>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false })}
        onConfirm={() => handleDelete(deleteModal.userId!)}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone. All user data and history will be permanently removed."
        confirmText="Delete User"
        variant="danger"
      />

      {/* Suspend Confirmation */}
      <ConfirmModal
        isOpen={suspendModal.isOpen}
        onClose={() => setSuspendModal({ isOpen: false })}
        onConfirm={() => handleSuspend(suspendModal.userId!)}
        title="Suspend User"
        description="This will temporarily disable the user's access to the system. They will not be able to log in until reactivated."
        confirmText="Suspend User"
        variant="warning"
      />
    </>
  );
}
