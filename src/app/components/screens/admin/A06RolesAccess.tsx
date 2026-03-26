import { useState, useEffect } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { DataTable } from '../../shared/DataTable';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { FormDrawer } from '../../shared/FormDrawer';
import { FormField, Input } from '../../ui/form';
import { useToast } from '../../ui/toast';
import { 
  Shield, 
  Plus, 
  Users, 
  Lock,
  Unlock,
  Search,
  Download,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Settings
} from 'lucide-react';
import { usePeopleData } from '../../../services';

interface Role {
  id: string;
  role: string;
  users: number;
  permissions: string;
  description: string;
}

export function A06RolesAccess() {
  const { showToast } = useToast();
  const { roles: serviceRoles, loading } = usePeopleData();

  // Map service data → local UI shape
  const [roles, setRoles] = useState<Role[]>([]);
  
  useEffect(() => {
    setRoles(serviceRoles.map(r => ({
      id: r.id,
      role: r.name,
      users: r.userCount,
      permissions: r.permissions.length > 5 ? 'Full Access' : r.permissions.length > 2 ? 'Most Features' : 'Basic Access',
      description: r.description,
    })));
  }, [serviceRoles]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state for create/edit role
  const [roleForm, setRoleForm] = useState({
    role: '',
    users: '0',
    permissions: '',
    description: ''
  });

  // Reset form
  const resetForm = () => {
    setRoleForm({
      role: '',
      users: '0',
      permissions: '',
      description: ''
    });
  };

  // Create new role
  const handleCreateRole = async () => {
    // Validate required fields
    if (!roleForm.role || !roleForm.permissions || !roleForm.description) {
      showToast('error', 'Validation Error', 'Please fill in all required fields');
      return;
    }

    // Check if role name already exists
    if (roles.some(r => r.role.toLowerCase() === roleForm.role.toLowerCase())) {
      showToast('error', 'Role Exists', 'A role with this name already exists');
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate new role ID
      const newId = String(roles.length + 1);

      const newRole: Role = {
        id: newId,
        role: roleForm.role,
        users: parseInt(roleForm.users) || 0,
        permissions: roleForm.permissions,
        description: roleForm.description
      };

      setRoles(prev => [...prev, newRole]);
      
      showToast('success', 'Role Created', `${newRole.role} has been created successfully`);
      setIsCreateOpen(false);
      resetForm();
    } catch (error) {
      showToast('error', 'Error', 'Failed to create role');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit role
  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setRoleForm({
      role: role.role,
      users: role.users.toString(),
      permissions: role.permissions,
      description: role.description
    });
    setIsEditOpen(true);
  };

  const handleUpdateRole = async () => {
    if (!selectedRole) return;

    // Validate required fields
    if (!roleForm.role || !roleForm.permissions || !roleForm.description) {
      showToast('error', 'Validation Error', 'Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedRole: Role = {
        ...selectedRole,
        role: roleForm.role,
        users: parseInt(roleForm.users) || 0,
        permissions: roleForm.permissions,
        description: roleForm.description
      };

      setRoles(prev => prev.map(r => r.id === selectedRole.id ? updatedRole : r));
      
      showToast('success', 'Role Updated', `${updatedRole.role} has been updated`);
      setIsEditOpen(false);
      setSelectedRole(null);
      resetForm();
    } catch (error) {
      showToast('error', 'Error', 'Failed to update role');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete role
  const handleDeleteRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role) {
      setRoles(prev => prev.filter(r => r.id !== roleId));
      showToast('success', 'Role Deleted', `${role.role} has been removed`);
    }
  };

  // Export to CSV
  const handleExportToCSV = () => {
    const headers = ['Role Name', 'Users', 'Permission Level', 'Description'];
    
    const csvData = filteredRoles.map(r => [
      r.role,
      r.users.toString(),
      r.permissions,
      r.description
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `\"${cell}\"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `roles_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('success', 'Export successful', `Exported ${filteredRoles.length} roles to CSV`);
  };

  // Filter roles
  const filteredRoles = roles.filter(role => {
    const matchesSearch = searchQuery === '' || 
      role.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.permissions.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  // Calculate stats
  const totalUsers = roles.reduce((sum, r) => sum + r.users, 0);
  const adminRoles = roles.filter(r => r.role.toLowerCase().includes('admin')).length;
  const superAdmins = roles.find(r => r.role === 'Super Admin')?.users || 0;
  const regularAdmins = roles.find(r => r.role === 'Admin')?.users || 0;
  const customRoles = roles.filter(r => !['Super Admin', 'Admin', 'Manager', 'Employee', 'Contractor'].includes(r.role)).length;

  const getPermissionBadgeType = (permission: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' => {
    if (permission === 'Full Access') return 'success';
    if (permission === 'Limited Access') return 'warning';
    if (permission === 'Basic Access') return 'neutral';
    return 'info';
  };

  const columns = [
    { 
      key: 'role', 
      header: 'Role Name', 
      width: '20%',
      cell: (value: string, row: Role) => (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Shield className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-xs text-muted-foreground">{row.users} {row.users === 1 ? 'user' : 'users'}</div>
          </div>
        </div>
      )
    },
    { 
      key: 'permissions', 
      header: 'Permission Level', 
      width: '20%',
      cell: (value: string) => (
        <StatusBadge type={getPermissionBadgeType(value)}>
          {value === 'Full Access' && <Unlock className="h-3 w-3 mr-1" />}
          {value === 'Limited Access' && <Lock className="h-3 w-3 mr-1" />}
          {value}
        </StatusBadge>
      )
    },
    { 
      key: 'description', 
      header: 'Description', 
      width: '35%',
      cell: (value: string) => (
        <span className="text-sm text-muted-foreground">{value}</span>
      )
    },
    { 
      key: 'users', 
      header: 'Assigned Users', 
      width: '10%',
      cell: (value: number) => (
        <div className="flex items-center justify-center gap-1">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '15%',
      cell: (_: any, row: Role) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEditRole(row)}
          >
            <Edit className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDeleteRole(row.id)}
          >
            <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <PageLayout
      title="ADMIN – A-06 – Roles & Access – v2.0"
      description="Manage roles and permissions"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Role
          </Button>
        </div>
      }
      kpis={[
        {
          title: 'Total Roles',
          value: roles.length.toString(),
          change: `${customRoles} custom`,
          changeType: 'info',
          icon: <Shield className="h-5 w-5" />
        },
        {
          title: 'Total Users',
          value: totalUsers.toString(),
          change: 'Across all roles',
          changeType: 'neutral',
          icon: <Users className="h-5 w-5" />
        },
        {
          title: 'Admins',
          value: (superAdmins + regularAdmins).toString(),
          change: `${superAdmins} super, ${regularAdmins} regular`,
          changeType: 'neutral',
          icon: <Shield className="h-5 w-5" />
        },
        {
          title: 'Custom Roles',
          value: customRoles.toString(),
          change: 'User-defined',
          changeType: 'info',
          icon: <Settings className="h-5 w-5" />
        },
      ]}
    >
      {/* Search Bar */}
      <div className="mb-6 rounded-lg border border-border bg-card p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search roles, permissions, or descriptions..."
              className="w-full rounded-md border border-border bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Roles Table */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Roles & Permissions
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({filteredRoles.length} {filteredRoles.length === 1 ? 'role' : 'roles'})
            </span>
          </h3>
        </div>
        <DataTable columns={columns} data={filteredRoles} />
      </div>

      {/* Create Role Form */}
      <FormDrawer
        title="Create New Role"
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          resetForm();
        }}
        onSubmit={handleCreateRole}
        isSubmitting={isSubmitting}
      >
        <div className="space-y-1 mb-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Create a custom role
            </span>
          </div>
          <p className="text-xs text-blue-700 dark:text-blue-300 ml-6">
            Define roles with specific permissions to control access levels in your organization.
          </p>
        </div>

        <FormField label="Role Name">
          <Input
            type="text"
            placeholder="e.g. Project Manager"
            value={roleForm.role}
            onChange={(e) => setRoleForm(prev => ({ ...prev, role: e.target.value }))}
            required
          />
        </FormField>

        <FormField label="Permission Level">
          <select
            className="w-full px-3 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            value={roleForm.permissions}
            onChange={(e) => setRoleForm(prev => ({ ...prev, permissions: e.target.value }))}
            required
          >
            <option value="">Select Permission Level</option>
            <option value="Full Access">Full Access</option>
            <option value="Most Features">Most Features</option>
            <option value="Team Management">Team Management</option>
            <option value="Basic Access">Basic Access</option>
            <option value="Limited Access">Limited Access</option>
            <option value="Read Only">Read Only</option>
            <option value="Custom Access">Custom Access</option>
          </select>
        </FormField>

        <FormField label="Description">
          <textarea
            className="w-full px-3 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-colors min-h-[80px] resize-y"
            placeholder="Describe the role and its responsibilities..."
            value={roleForm.description}
            onChange={(e) => setRoleForm(prev => ({ ...prev, description: e.target.value }))}
            required
          />
        </FormField>

        <FormField label="Initial Users (Optional)">
          <Input
            type="number"
            placeholder="e.g. 5"
            value={roleForm.users}
            onChange={(e) => setRoleForm(prev => ({ ...prev, users: e.target.value }))}
            min="0"
          />
          <div className="mt-1 flex items-start gap-1">
            <AlertCircle className="h-3 w-3 text-muted-foreground mt-0.5" />
            <span className="text-xs text-muted-foreground">
              Number of users you plan to assign to this role
            </span>
          </div>
        </FormField>

        {/* Permission Details Info */}
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-900 dark:text-gray-100 mb-1">
                Permission Levels Explained:
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <li><strong>Full Access:</strong> Complete system control</li>
                <li><strong>Most Features:</strong> Organization management</li>
                <li><strong>Team Management:</strong> Team oversight</li>
                <li><strong>Basic Access:</strong> Standard features</li>
                <li><strong>Limited Access:</strong> Restricted access</li>
              </ul>
            </div>
          </div>
        </div>
      </FormDrawer>

      {/* Edit Role Form */}
      <FormDrawer
        title="Edit Role"
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedRole(null);
          resetForm();
        }}
        onSubmit={handleUpdateRole}
        isSubmitting={isSubmitting}
      >
        <FormField label="Role Name">
          <Input
            type="text"
            placeholder="e.g. Project Manager"
            value={roleForm.role}
            onChange={(e) => setRoleForm(prev => ({ ...prev, role: e.target.value }))}
            required
          />
        </FormField>

        <FormField label="Permission Level">
          <select
            className="w-full px-3 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            value={roleForm.permissions}
            onChange={(e) => setRoleForm(prev => ({ ...prev, permissions: e.target.value }))}
            required
          >
            <option value="">Select Permission Level</option>
            <option value="Full Access">Full Access</option>
            <option value="Most Features">Most Features</option>
            <option value="Team Management">Team Management</option>
            <option value="Basic Access">Basic Access</option>
            <option value="Limited Access">Limited Access</option>
            <option value="Read Only">Read Only</option>
            <option value="Custom Access">Custom Access</option>
          </select>
        </FormField>

        <FormField label="Description">
          <textarea
            className="w-full px-3 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-colors min-h-[80px] resize-y"
            placeholder="Describe the role and its responsibilities..."
            value={roleForm.description}
            onChange={(e) => setRoleForm(prev => ({ ...prev, description: e.target.value }))}
            required
          />
        </FormField>

        <FormField label="Assigned Users">
          <Input
            type="number"
            placeholder="e.g. 5"
            value={roleForm.users}
            onChange={(e) => setRoleForm(prev => ({ ...prev, users: e.target.value }))}
            min="0"
          />
        </FormField>
      </FormDrawer>
    </PageLayout>
  );
}