/**
 * P02 - EMPLOYEE DETAIL VIEW
 * Comprehensive employee profile and management interface
 */

import { useState } from 'react';
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
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Target,
  Activity,
  Wallet
} from 'lucide-react';
import { mockEmployees } from '../../../../data/employeeData';

export function P02EmployeeDetail() {
  // Using first employee as example
  const employee = mockEmployees[0];
  const [activeTab, setActiveTab] = useState<'overview' | 'compensation' | 'time' | 'performance' | 'documents'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'compensation', label: 'Compensation', icon: DollarSign },
    { id: 'time', label: 'Time & Attendance', icon: Clock },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'documents', label: 'Documents', icon: FileText }
  ];

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
      'Active': 'success',
      'On Leave': 'warning',
      'Probation': 'info',
      'Suspended': 'error',
      'Terminated': 'neutral' as any
    };
    return <StatusBadge type={statusMap[status] || 'neutral'}>{status}</StatusBadge>;
  };

  return (
    <PageLayout
      title="Employee Profile"
      description={`${employee.employeeId} • ${employee.department}`}
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
      {/* Employee Header Card */}
      <div className="rounded-lg border border-border bg-card p-6 mb-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-3xl font-semibold text-primary flex-shrink-0">
            {employee.firstName[0]}{employee.lastName[0]}
          </div>

          {/* Basic Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold mb-1">{employee.fullName}</h2>
                <p className="text-muted-foreground mb-2">{employee.jobTitle}</p>
                <div className="flex items-center gap-2">
                  {getStatusBadge(employee.status)}
                  <StatusBadge type="info">{employee.employmentType}</StatusBadge>
                  <StatusBadge type="neutral">{employee.workLocation}</StatusBadge>
                </div>
              </div>
            </div>

            {/* Contact & Details Grid */}
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
                <span>Joined {new Date(employee.hireDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Tenure</div>
            <div className="text-lg font-semibold">
              {Math.floor((new Date().getTime() - new Date(employee.hireDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} months
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Leave Balance</div>
            <div className="text-lg font-semibold">{employee.annualLeaveBalance} days</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Performance Rating</div>
            <div className="text-lg font-semibold flex items-center gap-1">
              {employee.performanceRating || 'N/A'}
              {employee.performanceRating && employee.performanceRating >= 4 && (
                <Award className="h-4 w-4 text-warning" />
              )}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Last Active</div>
            <div className="text-lg font-semibold">{employee.lastActive}</div>
          </div>
        </div>

        {/* Pending Actions */}
        {employee.pendingActions && employee.pendingActions.length > 0 && (
          <div className="mt-4 p-3 rounded-md bg-warning/10 border border-warning/20">
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-warning" />
              <span className="font-medium text-warning">Pending Actions:</span>
              <span className="text-muted-foreground">{employee.pendingActions.join(', ')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-border">
          <div className="flex gap-6">
            {tabs.map(tab => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
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

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-2 gap-6">
          {/* Employment Details */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Employment Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Employee ID</span>
                <span className="font-mono text-sm font-medium">{employee.employeeId}</span>
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
                <span className="text-sm font-medium">{employee.workLocation}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Working Hours</span>
                <span className="text-sm font-medium">{employee.workingHours} hrs/week</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Time Zone</span>
                <span className="text-sm font-medium">{employee.timeZone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Access Level</span>
                <StatusBadge type={employee.accessLevel === 'Admin' ? 'warning' : 'info'}>
                  {employee.accessLevel}
                </StatusBadge>
              </div>
            </div>
          </div>

          {/* Skills & Qualifications */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Award className="h-5 w-5" />
              Skills & Qualifications
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-2">Skills</div>
                <div className="flex flex-wrap gap-2">
                  {employee.skills?.map(skill => (
                    <span
                      key={skill}
                      className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              {employee.certifications && employee.certifications.length > 0 && (
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Certifications</div>
                  <div className="flex flex-wrap gap-2">
                    {employee.certifications.map(cert => (
                      <span
                        key={cert}
                        className="px-2 py-1 rounded-md bg-success/10 text-success text-xs font-medium flex items-center gap-1"
                      >
                        <CheckCircle className="h-3 w-3" />
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {employee.education && (
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Education</div>
                  <div className="text-sm">{employee.education}</div>
                </div>
              )}
            </div>
          </div>

          {/* Team & Projects */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Teams & Projects
            </h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground mb-2">Team Memberships</div>
                <div className="space-y-1">
                  {employee.teamIds?.map(teamId => (
                    <div key={teamId} className="text-sm">{teamId}</div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-2">Assigned Projects</div>
                <div className="space-y-1">
                  {employee.projectIds?.map(projectId => (
                    <div key={projectId} className="text-sm flex items-center gap-2">
                      <Target className="h-3 w-3 text-muted-foreground" />
                      {projectId}
                    </div>
                  ))}
                </div>
              </div>
              {employee.hasDirectReports && (
                <div className="pt-3 border-t border-border">
                  <StatusBadge type="info">Has Direct Reports</StatusBadge>
                </div>
              )}
            </div>
          </div>

          {/* Important Dates */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Important Dates
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Hire Date</span>
                <span className="text-sm font-medium">
                  {new Date(employee.hireDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Start Date</span>
                <span className="text-sm font-medium">
                  {new Date(employee.startDate).toLocaleDateString()}
                </span>
              </div>
              {employee.probationEndDate && (
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">Probation Ends</span>
                  <span className="text-sm font-medium">
                    {new Date(employee.probationEndDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              {employee.lastReviewDate && (
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">Last Review</span>
                  <span className="text-sm font-medium">
                    {new Date(employee.lastReviewDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              {employee.nextReviewDate && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Next Review</span>
                  <span className="text-sm font-medium">
                    {new Date(employee.nextReviewDate).toLocaleDateString()}
                  </span>
                </div>
              )}
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
                <span className="text-lg font-semibold">
                  ${employee.salary.toLocaleString()} {employee.currency}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Pay Frequency</span>
                <span className="text-sm font-medium">{employee.payFrequency}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Pay Grade</span>
                <span className="text-sm font-medium">{employee.payGrade}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Monthly Amount</span>
                <span className="text-lg font-semibold">
                  ${Math.round(employee.salary / 12).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="p-4 rounded-md bg-primary/5 border border-primary/20">
              <div className="text-sm text-muted-foreground mb-2">Annual Cost to Company</div>
              <div className="text-2xl font-bold text-primary">
                ${Math.round(employee.salary * 1.3).toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Including benefits & taxes (est.)
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'time' && (
        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Leave Balance</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Annual Leave</span>
                <span className="text-lg font-semibold">{employee.annualLeaveBalance} days</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Sick Leave</span>
                <span className="text-lg font-semibold">{employee.sickLeaveBalance} days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Used</span>
                <span className="text-lg font-semibold">{employee.totalLeaveUsed} days</span>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Work Schedule</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Working Hours</span>
                <span className="text-sm font-medium">{employee.workingHours} hrs/week</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Time Zone</span>
                <span className="text-sm font-medium">{employee.timeZone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Work Location</span>
                <span className="text-sm font-medium">{employee.workLocation}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Reviews</h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-md bg-card border border-border">
              <div className="text-sm text-muted-foreground mb-1">Current Rating</div>
              <div className="text-3xl font-bold">{employee.performanceRating || 'N/A'}</div>
              <div className="text-xs text-muted-foreground mt-1">Out of 5.0</div>
            </div>
            <div className="p-4 rounded-md bg-card border border-border">
              <div className="text-sm text-muted-foreground mb-1">Last Review</div>
              <div className="text-lg font-semibold">
                {employee.lastReviewDate
                  ? new Date(employee.lastReviewDate).toLocaleDateString()
                  : 'Not yet'}
              </div>
            </div>
            <div className="p-4 rounded-md bg-card border border-border">
              <div className="text-sm text-muted-foreground mb-1">Next Review</div>
              <div className="text-lg font-semibold">
                {employee.nextReviewDate
                  ? new Date(employee.nextReviewDate).toLocaleDateString()
                  : 'Not scheduled'}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Employee Documents</h3>
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No documents uploaded yet</p>
            <Button variant="outline" size="sm" className="mt-4">
              Upload Document
            </Button>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
