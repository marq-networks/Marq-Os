import { useState, useEffect } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { DataTable } from '../../shared/DataTable';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Building, Plus, Download, X, CheckCircle, AlertCircle, Search } from 'lucide-react';
import { toast } from 'sonner';

const STORAGE_KEY = 'workos_super_organizations';

interface Organization {
  id: string;
  name: string;
  plan: 'Enterprise' | 'Professional' | 'Starter';
  users: number;
  status: 'Active' | 'Trial' | 'Suspended';
  mrr: string;
  nextBilling: string;
  adminEmail?: string;
  createdDate?: string;
}

const INITIAL_ORGANIZATIONS: Organization[] = [
  { id: '1', name: 'Acme Corp', plan: 'Enterprise', users: 450, status: 'Active', mrr: '$12,500', nextBilling: '2026-01-15', adminEmail: 'admin@acme.com', createdDate: '2024-06-15' },
  { id: '2', name: 'TechStart Inc', plan: 'Professional', users: 85, status: 'Active', mrr: '$2,800', nextBilling: '2026-01-08', adminEmail: 'admin@techstart.com', createdDate: '2024-08-20' },
  { id: '3', name: 'Global Enterprises', plan: 'Enterprise', users: 1200, status: 'Active', mrr: '$45,000', nextBilling: '2026-01-20', adminEmail: 'admin@global.com', createdDate: '2023-12-10' },
  { id: '4', name: 'StartupHub', plan: 'Starter', users: 25, status: 'Trial', mrr: '$0', nextBilling: '2026-01-05', adminEmail: 'admin@startuphub.com', createdDate: '2025-12-28' },
  { id: '5', name: 'MegaCorp International', plan: 'Enterprise', users: 2500, status: 'Active', mrr: '$95,000', nextBilling: '2026-01-10', adminEmail: 'admin@megacorp.com', createdDate: '2023-03-01' },
];

export function S02Organizations() {
  const [organizations, setOrganizations] = useState<Organization[]>(INITIAL_ORGANIZATIONS);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    plan: 'Professional' as Organization['plan'],
    users: '10',
    adminEmail: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Load organizations from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setOrganizations(parsed);
      }
    } catch (error) {
      console.error('Failed to load organizations:', error);
    }
  }, []);

  // Save organizations to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(organizations));
    } catch (error) {
      console.error('Failed to save organizations:', error);
    }
  }, [organizations]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Organization name is required';
    } else if (formData.name.trim().length < 3) {
      errors.name = 'Name must be at least 3 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.adminEmail.trim()) {
      errors.adminEmail = 'Admin email is required';
    } else if (!emailRegex.test(formData.adminEmail)) {
      errors.adminEmail = 'Invalid email format';
    }

    const userCount = parseInt(formData.users);
    if (isNaN(userCount) || userCount < 1) {
      errors.users = 'Users must be at least 1';
    } else if (userCount > 10000) {
      errors.users = 'Users cannot exceed 10,000';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const calculateMRR = (plan: Organization['plan'], users: number): string => {
    const rates = {
      'Starter': 15,
      'Professional': 35,
      'Enterprise': 50,
    };
    const mrr = users * rates[plan];
    return `$${mrr.toLocaleString()}`;
  };

  const handleAddOrganization = () => {
    if (!validateForm()) {
      toast.error('Please fix the form errors', {
        description: 'Check all required fields and correct any validation errors.',
        icon: <AlertCircle className="h-4 w-4" />,
      });
      return;
    }

    const userCount = parseInt(formData.users);
    const mrr = calculateMRR(formData.plan, userCount);
    
    const newOrg: Organization = {
      id: `org-${Date.now()}`,
      name: formData.name,
      plan: formData.plan,
      users: userCount,
      status: 'Active',
      mrr: mrr,
      nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      adminEmail: formData.adminEmail,
      createdDate: new Date().toISOString().split('T')[0],
    };

    setOrganizations([newOrg, ...organizations]);
    
    toast.success('Organization created successfully!', {
      description: `${formData.name} has been added to the platform.`,
      icon: <CheckCircle className="h-4 w-4" />,
    });

    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setShowAddDialog(false);
    setFormData({
      name: '',
      plan: 'Professional',
      users: '10',
      adminEmail: '',
    });
    setFormErrors({});
  };

  const handleExport = () => {
    try {
      // Filter organizations based on search
      const dataToExport = filteredOrganizations;

      // Create CSV content
      const headers = ['Organization', 'Plan', 'Users', 'Status', 'MRR', 'Next Billing', 'Admin Email', 'Created Date'];
      const rows = dataToExport.map(org => [
        org.name,
        org.plan,
        org.users.toString(),
        org.status,
        org.mrr,
        org.nextBilling,
        org.adminEmail || 'N/A',
        org.createdDate || 'N/A',
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `organizations_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Organizations exported successfully!', {
        description: `${dataToExport.length} organizations exported to CSV.`,
        icon: <Download className="h-4 w-4" />,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed', {
        description: 'There was an error exporting the data. Please try again.',
      });
    }
  };

  // Filter organizations by search query
  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.plan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate KPIs
  const totalOrgs = organizations.length;
  const activeOrgs = organizations.filter(o => o.status === 'Active').length;
  const trialOrgs = organizations.filter(o => o.status === 'Trial').length;
  const avgMRR = organizations.length > 0
    ? Math.round(organizations.reduce((sum, org) => {
        const mrr = parseInt(org.mrr.replace(/[$,]/g, ''));
        return sum + mrr;
      }, 0) / organizations.length)
    : 0;

  const columns = [
    { key: 'name', header: 'Organization', width: '20%' },
    { 
      key: 'plan', 
      header: 'Plan', 
      width: '15%',
      cell: (value: string) => {
        const type = value === 'Enterprise' ? 'success' : value === 'Professional' ? 'info' : 'neutral';
        return <StatusBadge type={type}>{value}</StatusBadge>;
      }
    },
    { key: 'users', header: 'Users', width: '10%' },
    { 
      key: 'status', 
      header: 'Status', 
      width: '12%',
      cell: (value: string) => {
        const type = value === 'Active' ? 'success' : value === 'Trial' ? 'warning' : 'danger';
        return <StatusBadge type={type}>{value}</StatusBadge>;
      }
    },
    { key: 'mrr', header: 'MRR', width: '12%' },
    { key: 'nextBilling', header: 'Next Billing', width: '15%' },
    {
      key: 'adminEmail',
      header: 'Admin Email',
      width: '16%',
      cell: (value: any) => value || 'N/A'
    }
  ];

  return (
    <PageLayout
      title="SUPER – S-02 – Organizations – v2.0"
      description="Manage all platform organizations"
      actions={
        <>
          <Button variant="outline" onClick={handleExport} disabled={organizations.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Organization
          </Button>
        </>
      }
      kpis={[
        {
          title: 'Total Organizations',
          value: totalOrgs.toString(),
          change: totalOrgs > INITIAL_ORGANIZATIONS.length ? `+${totalOrgs - INITIAL_ORGANIZATIONS.length} added` : `${INITIAL_ORGANIZATIONS.length} default`,
          changeType: totalOrgs > INITIAL_ORGANIZATIONS.length ? 'positive' : 'neutral',
          icon: <Building className="h-5 w-5" />
        },
        {
          title: 'Active',
          value: activeOrgs.toString(),
          change: `${Math.round((activeOrgs / totalOrgs) * 100)}% active rate`,
          changeType: 'positive',
          icon: <Building className="h-5 w-5" />
        },
        {
          title: 'Trial',
          value: trialOrgs.toString(),
          change: trialOrgs > 0 ? 'Convert to paid' : 'No trials',
          changeType: trialOrgs > 0 ? 'warning' : 'neutral',
          icon: <Building className="h-5 w-5" />
        },
        {
          title: 'Avg MRR',
          value: `$${avgMRR.toLocaleString()}`,
          change: 'Per organization',
          changeType: 'neutral',
          icon: <Building className="h-5 w-5" />
        },
      ]}
    >
      <div className="space-y-6">
        {/* Add Organization Dialog */}
        {showAddDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleCloseDialog}>
            <div 
              className="bg-card rounded-lg shadow-lg w-full max-w-md p-6 m-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Add Organization</h2>
                <Button variant="ghost" size="sm" onClick={handleCloseDialog}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {/* Organization Name */}
                <div>
                  <Label htmlFor="orgName">Organization Name *</Label>
                  <Input
                    id="orgName"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Acme Corporation"
                    className="mt-2"
                  />
                  {formErrors.name && (
                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.name}
                    </p>
                  )}
                </div>

                {/* Admin Email */}
                <div>
                  <Label htmlFor="adminEmail">Admin Email *</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={formData.adminEmail}
                    onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                    placeholder="admin@company.com"
                    className="mt-2"
                  />
                  {formErrors.adminEmail && (
                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.adminEmail}
                    </p>
                  )}
                </div>

                {/* Plan */}
                <div>
                  <Label htmlFor="plan">Plan *</Label>
                  <select
                    id="plan"
                    value={formData.plan}
                    onChange={(e) => setFormData({ ...formData, plan: e.target.value as Organization['plan'] })}
                    className="w-full mt-2 px-3 py-2 border border-border rounded-md bg-background"
                  >
                    <option value="Starter">Starter - $15/user/month</option>
                    <option value="Professional">Professional - $35/user/month</option>
                    <option value="Enterprise">Enterprise - $50/user/month</option>
                  </select>
                </div>

                {/* Initial Users */}
                <div>
                  <Label htmlFor="users">Initial Users *</Label>
                  <Input
                    id="users"
                    type="number"
                    min="1"
                    max="10000"
                    value={formData.users}
                    onChange={(e) => setFormData({ ...formData, users: e.target.value })}
                    className="mt-2"
                  />
                  {formErrors.users && (
                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.users}
                    </p>
                  )}
                </div>

                {/* MRR Preview */}
                <div className="rounded-lg bg-blue-500/10 border border-blue-500/30 p-3">
                  <p className="text-sm font-medium">
                    Estimated MRR: <span className="text-lg font-bold">
                      {calculateMRR(formData.plan, parseInt(formData.users) || 0)}
                    </span>
                  </p>
                </div>
              </div>

              {/* Dialog Actions */}
              <div className="flex gap-2 mt-6">
                <Button variant="outline" onClick={handleCloseDialog} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleAddOrganization} className="flex-1">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Create Organization
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search organizations by name, plan, or status..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Organizations Table */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-4 font-semibold">
            Organizations ({filteredOrganizations.length})
          </h3>
          {filteredOrganizations.length > 0 ? (
            <DataTable columns={columns} data={filteredOrganizations} />
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No organizations found</p>
              <p className="text-sm">
                {searchQuery ? 'Try a different search term' : 'Click "Add Organization" to create your first organization'}
              </p>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="rounded-lg bg-muted/50 border border-border p-4">
          <p className="text-sm text-muted-foreground">
            <strong>💡 How it works:</strong> Click "Add Organization" to create new organizations on the platform. 
            Use the search bar to filter organizations. Click "Export" to download all organizations as a CSV file. 
            MRR is automatically calculated based on plan and user count. All data is saved locally in this demo.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
