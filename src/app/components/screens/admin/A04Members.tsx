/**
 * A04 - Members
 * Wired to service layer: usePeopleData() → employees (createEmployee, deleteEmployee)
 */
import { useState, useEffect } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { DataTable } from '../../shared/DataTable';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { FormDrawer } from '../../shared/FormDrawer';
import { FormField, Input } from '../../ui/form';
import {
  Users,
  Plus,
  Mail,
  Search,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  Trash2
} from 'lucide-react';
import { usePeopleData } from '../../../services';
import type { Employee } from '../../../services';
import { toast } from 'sonner';

// UI-local member shape (flattened for table)
interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
  lastSeen: string;
}

function toMember(e: Employee): Member {
  return {
    id: e.id,
    name: e.name,
    email: e.email,
    role: e.role,
    department: e.department,
    status: e.status,
    lastSeen: e.lastSeen,
  };
}

export function A04Members() {
  const {
    employees,
    departments,
    loading,
    createEmployee,
    deleteEmployee,
  } = usePeopleData();

  const members: Member[] = employees.map(toMember);

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [memberForm, setMemberForm] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    status: 'Active' as Employee['status'],
  });

  const resetForm = () => {
    setMemberForm({ name: '', email: '', role: '', department: '', status: 'Active' });
  };

  const handleInviteMember = async () => {
    if (!memberForm.name || !memberForm.email || !memberForm.role || !memberForm.department) {
      toast.error('Please fill in all required fields');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(memberForm.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (employees.some(m => m.email.toLowerCase() === memberForm.email.toLowerCase())) {
      toast.error('A member with this email already exists');
      return;
    }

    setIsSubmitting(true);
    try {
      const dept = departments.find(d => d.name === memberForm.department);
      await createEmployee({
        name: memberForm.name,
        email: memberForm.email,
        role: memberForm.role,
        department: memberForm.department,
        departmentId: dept?.id || '',
        status: memberForm.status,
        lastSeen: 'Just now',
        joinDate: new Date().toISOString().split('T')[0],
        employmentType: 'Full-time',
      });
      toast.success(`Invitation sent to ${memberForm.email}`);
      setIsInviteOpen(false);
      resetForm();
    } catch {
      toast.error('Failed to invite member');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    if (member) {
      try {
        await deleteEmployee(memberId);
        toast.success(`${member.name} has been removed`);
      } catch {
        toast.error('Failed to remove member');
      }
    }
  };

  const handleExportToCSV = () => {
    const headers = ['Name', 'Email', 'Role', 'Department', 'Status', 'Last Seen'];
    const csvData = filteredMembers.map(m => [m.name, m.email, m.role, m.department, m.status, m.lastSeen]);
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `members_${new Date().toISOString().split('T')[0]}.csv`;
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filteredMembers.length} members to CSV`);
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch =
      searchQuery === '' ||
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    const matchesDepartment = filterDepartment === 'all' || member.department === filterDepartment;
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
  });

  const uniqueRoles = Array.from(new Set(members.map(m => m.role))).sort();
  const uniqueDepartments = Array.from(new Set(members.map(m => m.department))).sort();
  const activeMembers = members.filter(m => m.status === 'Active').length;
  const managers = members.filter(m =>
    m.role.toLowerCase().includes('manager') ||
    m.role.toLowerCase().includes('lead') ||
    m.role.toLowerCase().includes('director') ||
    m.role.toLowerCase().includes('vp')
  ).length;
  const onlineNow = members.filter(m => m.lastSeen === 'Just now' || m.lastSeen.includes('min ago')).length;

  const getStatusBadge = (status: string) => {
    const config: Record<string, { type: 'success' | 'warning' | 'neutral'; icon: any }> = {
      Active: { type: 'success', icon: CheckCircle },
      Away: { type: 'warning', icon: Clock },
      Offline: { type: 'neutral', icon: XCircle },
    };
    const c = config[status] || { type: 'neutral', icon: Clock };
    return (
      <StatusBadge type={c.type}>
        <c.icon className="h-3 w-3 mr-1" />
        {status}
      </StatusBadge>
    );
  };

  const columns = [
    {
      key: 'name',
      header: 'Member',
      width: '25%',
      cell: (value: string, row: Member) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {value.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-xs text-muted-foreground">{row.email}</div>
          </div>
        </div>
      ),
    },
    { key: 'role', header: 'Role', width: '20%' },
    {
      key: 'department',
      header: 'Department',
      width: '15%',
      cell: (value: string) => <StatusBadge type="info">{value}</StatusBadge>,
    },
    {
      key: 'status',
      header: 'Status',
      width: '15%',
      cell: (value: string) => getStatusBadge(value),
    },
    {
      key: 'lastSeen',
      header: 'Last Seen',
      width: '15%',
      cell: (value: string) => <span className="text-xs text-muted-foreground">{value}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '10%',
      cell: (_: any, row: Member) => (
        <Button size="sm" variant="ghost" onClick={() => handleDeleteMember(row.id)}>
          <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
        </Button>
      ),
    },
  ];

  return (
    <PageLayout
      title="ADMIN – A-04 – Members – v3.0 [Service Layer ✓]"
      description="Team members and their roles — live data from People service"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" onClick={() => setIsInviteOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        </div>
      }
      kpis={[
        {
          title: 'Team Members',
          value: loading ? '…' : members.length.toString(),
          change: `${activeMembers} active`,
          changeType: 'positive',
          icon: <Users className="h-5 w-5" />,
        },
        {
          title: 'Managers',
          value: managers.toString(),
          change: 'Leadership roles',
          icon: <Users className="h-5 w-5" />,
        },
        {
          title: 'Individual Contributors',
          value: (members.length - managers).toString(),
          change: 'Team members',
          icon: <Users className="h-5 w-5" />,
        },
        {
          title: 'Online Now',
          value: onlineNow.toString(),
          change: 'Currently active',
          changeType: 'positive',
          icon: <CheckCircle className="h-5 w-5" />,
        },
      ]}
    >
      {/* Search and Filter Bar */}
      <div className="mb-6 rounded-lg border border-border bg-card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full rounded-md border border-border bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={filterRole}
            onChange={e => setFilterRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            {uniqueRoles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <select
            className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={filterDepartment}
            onChange={e => setFilterDepartment(e.target.value)}
          >
            <option value="all">All Departments</option>
            {uniqueDepartments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <select
            className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Away">Away</option>
            <option value="Offline">Offline</option>
          </select>
        </div>
      </div>

      {/* Members Table */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Team Members
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({filteredMembers.length} {filteredMembers.length === 1 ? 'member' : 'members'})
            </span>
          </h3>
        </div>
        {loading ? (
          <div className="py-12 text-center text-muted-foreground">Loading members…</div>
        ) : (
          <DataTable columns={columns} data={filteredMembers} />
        )}
      </div>

      {/* Invite Member Form */}
      <FormDrawer
        title="Invite New Member"
        isOpen={isInviteOpen}
        onClose={() => { setIsInviteOpen(false); resetForm(); }}
        onSubmit={handleInviteMember}
        isSubmitting={isSubmitting}
      >
        <div className="space-y-1 mb-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Invitation will be sent via email
            </span>
          </div>
          <p className="text-xs text-blue-700 dark:text-blue-300 ml-6">
            The new member will receive an email with instructions to join.
          </p>
        </div>

        <FormField label="Full Name">
          <Input
            type="text"
            placeholder="e.g. John Doe"
            value={memberForm.name}
            onChange={e => setMemberForm(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </FormField>

        <FormField label="Email Address">
          <Input
            type="email"
            placeholder="e.g. john.doe@company.com"
            value={memberForm.email}
            onChange={e => setMemberForm(prev => ({ ...prev, email: e.target.value }))}
            required
          />
        </FormField>

        <FormField label="Role / Job Title">
          <Input
            type="text"
            placeholder="e.g. Software Engineer"
            value={memberForm.role}
            onChange={e => setMemberForm(prev => ({ ...prev, role: e.target.value }))}
            required
          />
        </FormField>

        <FormField label="Department">
          <select
            className="w-full px-3 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            value={memberForm.department}
            onChange={e => setMemberForm(prev => ({ ...prev, department: e.target.value }))}
            required
          >
            <option value="">Select Department</option>
            {uniqueDepartments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Initial Status">
          <select
            className="w-full px-3 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            value={memberForm.status}
            onChange={e => setMemberForm(prev => ({ ...prev, status: e.target.value as Employee['status'] }))}
          >
            <option value="Active">Active</option>
            <option value="Away">Away</option>
            <option value="Offline">Offline</option>
          </select>
        </FormField>
      </FormDrawer>
    </PageLayout>
  );
}
