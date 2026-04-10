import { useEffect, useMemo, useState } from 'react';
import { PageLayout } from '../../../shared/PageLayout';
import { StatusBadge } from '../../../shared/StatusBadge';
import { Button } from '../../../ui/button';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Briefcase,
  Clock,
  Award,
  FileText,
  Edit,
  Trash2,
  TrendingUp,
  Activity,
  Wallet
} from 'lucide-react';
import { useAuthService, usePeopleData } from '../../../../services';

export function P02EmployeeDetail() {
  const authService = useAuthService();
  const { employees, loading } = usePeopleData();
  const [activeTab, setActiveTab] = useState<'overview' | 'compensation' | 'time' | 'performance' | 'documents'>('overview');
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  useEffect(() => {
    authService.getCurrentUser().then((user) => setCurrentUserEmail(user.email)).catch(() => {});
  }, [authService]);

  const employee = useMemo(
    () =>
      employees.find((item) => item.email === currentUserEmail) ||
      employees.find((item) => item.name.toLowerCase().includes('sarah')) ||
      employees[0],
    [currentUserEmail, employees],
  );
  const tenureMonths = useMemo(() => {
    if (!employee) return 0;
    return Math.floor((Date.now() - new Date(employee.joinDate).getTime()) / (1000 * 60 * 60 * 24 * 30));
  }, [employee]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'compensation', label: 'Compensation', icon: DollarSign },
    { id: 'time', label: 'Time & Attendance', icon: Clock },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'documents', label: 'Documents', icon: FileText }
  ];

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, 'success' | 'warning' | 'neutral'> = {
      Active: 'success',
      Away: 'warning',
      Offline: 'neutral',
    };
    return <StatusBadge type={statusMap[status] || 'neutral'}>{status}</StatusBadge>;
  };

  if (loading) {
    return (
      <PageLayout title="Employee Profile" description="Loading employee data">
        <div className="rounded-lg border border-border bg-card p-6">Loading employee profile...</div>
      </PageLayout>
    );
  }

  if (!employee) {
    return (
      <PageLayout title="Employee Profile" description="No employee data available">
        <div className="rounded-lg border border-border bg-card p-6">No employee records found.</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Employee Profile"
      description={`${employee.id.slice(0, 8)} • ${employee.department}`}
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Export Profile
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Deactivate
          </Button>
        </div>
      }
    >
      <div className="rounded-lg border border-border bg-card p-6 mb-6">
        <div className="flex items-start gap-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-3xl font-semibold text-primary flex-shrink-0">
            {employee.name.split(' ').map(part => part[0]).slice(0, 2).join('')}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold mb-1">{employee.name}</h2>
                <p className="text-muted-foreground mb-2">{employee.role}</p>
                <div className="flex items-center gap-2">
                  {getStatusBadge(employee.status)}
                  <StatusBadge type="info">{employee.employmentType}</StatusBadge>
                  <StatusBadge type="neutral">{employee.location || 'Office'}</StatusBadge>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{employee.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{employee.phone || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>{employee.department}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {new Date(employee.joinDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Tenure</div>
            <div className="text-lg font-semibold">{tenureMonths} months</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Skills</div>
            <div className="text-lg font-semibold">{employee.skills?.length ?? 0}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Salary</div>
            <div className="text-lg font-semibold">{employee.salary ? `$${employee.salary.toLocaleString()}` : 'N/A'}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Last Active</div>
            <div className="text-lg font-semibold">{employee.lastSeen}</div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="border-b border-border">
          <div className="flex gap-6">
            {tabs.map(tab => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 px-1 py-3 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary font-medium'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <TabIcon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Employment Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Employee ID</span>
                <span className="font-mono text-sm font-medium">{employee.id}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Manager</span>
                <span className="text-sm font-medium">{employee.manager || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Employment Type</span>
                <span className="text-sm font-medium">{employee.employmentType}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Work Location</span>
                <span className="text-sm font-medium">{employee.location || 'Office'}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Last Seen</span>
                <span className="text-sm font-medium">{employee.lastSeen}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Join Date</span>
                <span className="text-sm font-medium">{employee.joinDate}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Award className="h-5 w-5" />
              Skills & Qualifications
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-2">Skills</div>
                <div className="flex flex-wrap gap-2">
                  {(employee.skills ?? []).map(skill => (
                    <span key={skill} className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                  {!employee.skills?.length && <span className="text-sm text-muted-foreground">No skills recorded</span>}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-2">Department</div>
                <div className="text-sm">{employee.department}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-2">Role</div>
                <div className="text-sm">{employee.role}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'compensation' && (
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Compensation Details
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Base Salary</span>
                <span className="text-lg font-semibold">{employee.salary ? `$${employee.salary.toLocaleString()}` : 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Monthly Amount</span>
                <span className="text-sm font-medium">{employee.salary ? `$${Math.round(employee.salary / 12).toLocaleString()}` : 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Department</span>
                <span className="text-sm font-medium">{employee.department}</span>
              </div>
            </div>
            <div className="p-4 rounded-md bg-primary/5 border border-primary/20">
              <div className="text-sm text-muted-foreground mb-2">Annual Cost to Company</div>
              <div className="text-2xl font-bold text-primary">
                {employee.salary ? `$${Math.round(employee.salary * 1.25).toLocaleString()}` : 'N/A'}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Estimated with benefits loaded</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'time' && (
        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Availability</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="text-lg font-semibold">{employee.status}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Last Seen</span>
                <span className="text-lg font-semibold">{employee.lastSeen}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Location</span>
                <span className="text-lg font-semibold">{employee.location || 'Office'}</span>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Work Snapshot</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Skills Tagged</span>
                <span className="text-sm font-medium">{employee.skills?.length ?? 0}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Manager</span>
                <span className="text-sm font-medium">{employee.manager || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Tenure</span>
                <span className="text-sm font-medium">{tenureMonths} months</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Snapshot</h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-md bg-card border border-border">
              <div className="text-sm text-muted-foreground mb-1">Department</div>
              <div className="text-2xl font-bold">{employee.department}</div>
              <div className="text-xs text-muted-foreground mt-1">Primary team</div>
            </div>
            <div className="p-4 rounded-md bg-card border border-border">
              <div className="text-sm text-muted-foreground mb-1">Role</div>
              <div className="text-lg font-semibold">{employee.role}</div>
            </div>
            <div className="p-4 rounded-md bg-card border border-border">
              <div className="text-sm text-muted-foreground mb-1">Last Activity</div>
              <div className="text-lg font-semibold">{employee.lastSeen}</div>
            </div>
          </div>
          <div className="rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Notes</span>
            </div>
            <p className="text-sm text-muted-foreground">This screen now reflects live employee data from the People service. Performance-specific records are not yet wired for this page.</p>
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Employee Documents</h3>
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>This profile now uses live people data. Document attachments are the next piece to wire for this screen.</p>
            <Button variant="outline" size="sm" className="mt-4">
              Upload Document
            </Button>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
