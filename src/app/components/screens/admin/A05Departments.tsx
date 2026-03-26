import { useState, useEffect } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { DataTable } from '../../shared/DataTable';
import { Button } from '../../ui/button';
import { FormDrawer } from '../../shared/FormDrawer';
import { FormField, Input } from '../../ui/form';
import { useToast } from '../../ui/toast';
import { 
  Building, 
  Plus, 
  Users, 
  DollarSign, 
  TrendingUp,
  Search,
  Download,
  Edit,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { usePeopleData } from '../../../services';

// LocalStorage key — no longer used (data comes from service layer)
interface Department {
  id: string;
  name: string;
  members: number;
  lead: string;
  budget: string;
}

// Helper: format numeric budget to display string
function formatBudget(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

// Helper: parse display budget string to number
function parseBudget(str: string): number {
  const clean = str.replace('$', '').replace(',', '');
  if (clean.includes('M')) return parseFloat(clean) * 1_000_000;
  if (clean.includes('K')) return parseFloat(clean) * 1_000;
  return parseFloat(clean) || 0;
}

export function A05Departments() {
  const { showToast } = useToast();
  const { departments: serviceDepts, createDepartment, updateDepartment, deleteDepartment, loading } = usePeopleData();

  // Map service data → local UI shape
  const [departments, setDepartments] = useState<Department[]>([]);
  
  useEffect(() => {
    setDepartments(serviceDepts.map(d => ({
      id: d.id,
      name: d.name,
      members: d.memberCount,
      lead: d.lead,
      budget: formatBudget(d.budget),
    })));
  }, [serviceDepts]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state for add/edit department
  const [departmentForm, setDepartmentForm] = useState({
    name: '',
    members: '0',
    lead: '',
    budget: ''
  });

  // Reset form
  const resetForm = () => {
    setDepartmentForm({
      name: '',
      members: '0',
      lead: '',
      budget: ''
    });
  };

  // Add new department
  const handleAddDepartment = async () => {
    // Validate required fields
    if (!departmentForm.name || !departmentForm.lead || !departmentForm.budget) {
      showToast('error', 'Validation Error', 'Please fill in all required fields');
      return;
    }

    // Check if department name already exists
    if (departments.some(d => d.name.toLowerCase() === departmentForm.name.toLowerCase())) {
      showToast('error', 'Department Exists', 'A department with this name already exists');
      return;
    }

    // Validate budget format
    if (!departmentForm.budget.includes('$') && !departmentForm.budget.includes('K') && !departmentForm.budget.includes('M')) {
      showToast('error', 'Invalid Budget', 'Please enter budget in format: $500K or $2.4M');
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate new department ID
      const newId = String(departments.length + 1);

      const newDepartment: Department = {
        id: newId,
        name: departmentForm.name,
        members: parseInt(departmentForm.members) || 0,
        lead: departmentForm.lead,
        budget: departmentForm.budget
      };

      setDepartments(prev => [...prev, newDepartment]);
      
      showToast('success', 'Department Added', `${newDepartment.name} has been created successfully`);
      setIsAddOpen(false);
      resetForm();
    } catch (error) {
      showToast('error', 'Error', 'Failed to add department');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit department
  const handleEditDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setDepartmentForm({
      name: department.name,
      members: department.members.toString(),
      lead: department.lead,
      budget: department.budget
    });
    setIsEditOpen(true);
  };

  const handleUpdateDepartment = async () => {
    if (!selectedDepartment) return;

    // Validate required fields
    if (!departmentForm.name || !departmentForm.lead || !departmentForm.budget) {
      showToast('error', 'Validation Error', 'Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedDepartment: Department = {
        ...selectedDepartment,
        name: departmentForm.name,
        members: parseInt(departmentForm.members) || 0,
        lead: departmentForm.lead,
        budget: departmentForm.budget
      };

      setDepartments(prev => prev.map(d => d.id === selectedDepartment.id ? updatedDepartment : d));
      
      showToast('success', 'Department Updated', `${updatedDepartment.name} has been updated`);
      setIsEditOpen(false);
      setSelectedDepartment(null);
      resetForm();
    } catch (error) {
      showToast('error', 'Error', 'Failed to update department');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete department
  const handleDeleteDepartment = (departmentId: string) => {
    const department = departments.find(d => d.id === departmentId);
    if (department) {
      setDepartments(prev => prev.filter(d => d.id !== departmentId));
      showToast('success', 'Department Deleted', `${department.name} has been removed`);
    }
  };

  // Export to CSV
  const handleExportToCSV = () => {
    const headers = ['Department Name', 'Members', 'Department Lead', 'Budget'];
    
    const csvData = filteredDepartments.map(d => [
      d.name,
      d.members.toString(),
      d.lead,
      d.budget
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `\"${cell}\"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `departments_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('success', 'Export successful', `Exported ${filteredDepartments.length} departments to CSV`);
  };

  // Filter departments
  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = searchQuery === '' || 
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.lead.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  // Calculate stats
  const totalMembers = departments.reduce((sum, d) => sum + d.members, 0);
  const largestDept = departments.reduce((max, d) => d.members > max.members ? d : max, departments[0] || { members: 0, name: 'N/A' });
  
  // Calculate total budget (parse budget strings)
  const totalBudgetValue = departments.reduce((sum, d) => {
    const budgetStr = d.budget.replace('$', '').replace(',', '');
    let value = 0;
    if (budgetStr.includes('M')) {
      value = parseFloat(budgetStr) * 1000000;
    } else if (budgetStr.includes('K')) {
      value = parseFloat(budgetStr) * 1000;
    } else {
      value = parseFloat(budgetStr);
    }
    return sum + value;
  }, 0);

  const totalBudget = totalBudgetValue >= 1000000 
    ? `$${(totalBudgetValue / 1000000).toFixed(1)}M` 
    : `$${(totalBudgetValue / 1000).toFixed(0)}K`;

  const columns = [
    { 
      key: 'name', 
      header: 'Department', 
      width: '25%',
      cell: (value: string) => (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Building className="h-4 w-4 text-primary" />
          </div>
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    { 
      key: 'members', 
      header: 'Members', 
      width: '15%',
      cell: (value: number) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    { 
      key: 'lead', 
      header: 'Department Lead', 
      width: '25%',
      cell: (value: string) => (
        <span className="text-sm">{value}</span>
      )
    },
    { 
      key: 'budget', 
      header: 'Budget', 
      width: '20%',
      cell: (value: string) => (
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
          <span className="font-semibold text-green-600 dark:text-green-400">{value}</span>
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '15%',
      cell: (_: any, row: Department) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEditDepartment(row)}
          >
            <Edit className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDeleteDepartment(row.id)}
          >
            <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <PageLayout
      title="ADMIN – A-05 – Departments – v2.0"
      description="Manage organizational departments"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" onClick={() => setIsAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Department
          </Button>
        </div>
      }
      kpis={[
        {
          title: 'Total Departments',
          value: departments.length.toString(),
          change: `${filteredDepartments.length} visible`,
          changeType: 'neutral',
          icon: <Building className="h-5 w-5" />
        },
        {
          title: 'Total Members',
          value: totalMembers.toString(),
          change: 'Across all departments',
          changeType: 'neutral',
          icon: <Users className="h-5 w-5" />
        },
        {
          title: 'Largest Dept',
          value: largestDept.name,
          change: `${largestDept.members} members`,
          changeType: 'info',
          icon: <TrendingUp className="h-5 w-5" />
        },
        {
          title: 'Total Budget',
          value: totalBudget,
          change: 'Combined budget',
          changeType: 'positive',
          icon: <DollarSign className="h-5 w-5" />
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
              placeholder="Search departments or leads..."
              className="w-full rounded-md border border-border bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Departments Table */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Departments Overview
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({filteredDepartments.length} {filteredDepartments.length === 1 ? 'department' : 'departments'})
            </span>
          </h3>
        </div>
        <DataTable columns={columns} data={filteredDepartments} />
      </div>

      {/* Add Department Form */}
      <FormDrawer
        title="Add New Department"
        isOpen={isAddOpen}
        onClose={() => {
          setIsAddOpen(false);
          resetForm();
        }}
        onSubmit={handleAddDepartment}
        isSubmitting={isSubmitting}
      >
        <div className="space-y-1 mb-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Create a new department
            </span>
          </div>
          <p className="text-xs text-blue-700 dark:text-blue-300 ml-6">
            Add organizational structure by creating departments with leads and budgets.
          </p>
        </div>

        <FormField label="Department Name">
          <Input
            type="text"
            placeholder="e.g. Engineering"
            value={departmentForm.name}
            onChange={(e) => setDepartmentForm(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </FormField>

        <FormField label="Number of Members">
          <Input
            type="number"
            placeholder="e.g. 45"
            value={departmentForm.members}
            onChange={(e) => setDepartmentForm(prev => ({ ...prev, members: e.target.value }))}
            min="0"
          />
        </FormField>

        <FormField label="Department Lead">
          <Input
            type="text"
            placeholder="e.g. John Smith"
            value={departmentForm.lead}
            onChange={(e) => setDepartmentForm(prev => ({ ...prev, lead: e.target.value }))}
            required
          />
        </FormField>

        <FormField label="Budget">
          <Input
            type="text"
            placeholder="e.g. $2.4M or $500K"
            value={departmentForm.budget}
            onChange={(e) => setDepartmentForm(prev => ({ ...prev, budget: e.target.value }))}
            required
          />
          <div className="mt-1 flex items-start gap-1">
            <AlertCircle className="h-3 w-3 text-muted-foreground mt-0.5" />
            <span className="text-xs text-muted-foreground">
              Use format: $500K for thousands or $2.4M for millions
            </span>
          </div>
        </FormField>
      </FormDrawer>

      {/* Edit Department Form */}
      <FormDrawer
        title="Edit Department"
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedDepartment(null);
          resetForm();
        }}
        onSubmit={handleUpdateDepartment}
        isSubmitting={isSubmitting}
      >
        <FormField label="Department Name">
          <Input
            type="text"
            placeholder="e.g. Engineering"
            value={departmentForm.name}
            onChange={(e) => setDepartmentForm(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </FormField>

        <FormField label="Number of Members">
          <Input
            type="number"
            placeholder="e.g. 45"
            value={departmentForm.members}
            onChange={(e) => setDepartmentForm(prev => ({ ...prev, members: e.target.value }))}
            min="0"
          />
        </FormField>

        <FormField label="Department Lead">
          <Input
            type="text"
            placeholder="e.g. John Smith"
            value={departmentForm.lead}
            onChange={(e) => setDepartmentForm(prev => ({ ...prev, lead: e.target.value }))}
            required
          />
        </FormField>

        <FormField label="Budget">
          <Input
            type="text"
            placeholder="e.g. $2.4M or $500K"
            value={departmentForm.budget}
            onChange={(e) => setDepartmentForm(prev => ({ ...prev, budget: e.target.value }))}
            required
          />
          <div className="mt-1 flex items-start gap-1">
            <AlertCircle className="h-3 w-3 text-muted-foreground mt-0.5" />
            <span className="text-xs text-muted-foreground">
              Use format: $500K for thousands or $2.4M for millions
            </span>
          </div>
        </FormField>
      </FormDrawer>
    </PageLayout>
  );
}