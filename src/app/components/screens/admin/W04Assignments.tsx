import { PageLayout } from '../../shared/PageLayout';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { useToast } from '../../ui/toast';
import { 
  UserCheck, 
  AlertTriangle,
  TrendingUp,
  Users,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { useState } from 'react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  capacity: number; // hours per week
  allocated: number; // hours allocated
  tasks: number;
  projects: string[];
  status: 'Available' | 'Full' | 'Overloaded';
  utilizationPercent: number;
}

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Senior Developer',
    capacity: 40,
    allocated: 42,
    tasks: 8,
    projects: ['Mobile App Redesign', 'Platform API'],
    status: 'Overloaded',
    utilizationPercent: 105
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Full Stack Developer',
    capacity: 40,
    allocated: 38,
    tasks: 6,
    projects: ['Platform API', 'Backend Infrastructure'],
    status: 'Full',
    utilizationPercent: 95
  },
  {
    id: '3',
    name: 'Emma Davis',
    role: 'Frontend Developer',
    capacity: 40,
    allocated: 35,
    tasks: 5,
    projects: ['Website Redesign', 'E-commerce Platform'],
    status: 'Full',
    utilizationPercent: 88
  },
  {
    id: '4',
    name: 'David Wilson',
    role: 'UI/UX Designer',
    capacity: 40,
    allocated: 28,
    tasks: 4,
    projects: ['Mobile App Redesign', 'Website Redesign'],
    status: 'Available',
    utilizationPercent: 70
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    role: 'Backend Developer',
    capacity: 40,
    allocated: 24,
    tasks: 3,
    projects: ['Website Redesign'],
    status: 'Available',
    utilizationPercent: 60
  },
  {
    id: '6',
    name: 'James Martinez',
    role: 'DevOps Engineer',
    capacity: 40,
    allocated: 30,
    tasks: 5,
    projects: ['Backend Infrastructure', 'Platform API'],
    status: 'Available',
    utilizationPercent: 75
  }
];

export function W04Assignments() {
  const { showToast } = useToast();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const handleRebalance = () => {
    showToast('success', 'Rebalancing initiated', 'Analyzing workload distribution...');
    setTimeout(() => {
      showToast('info', 'Suggestions ready', '3 rebalancing options available');
    }, 2000);
  };

  const getStatusColor = (status: TeamMember['status']) => {
    switch (status) {
      case 'Available': return 'success';
      case 'Full': return 'warning';
      case 'Overloaded': return 'danger';
    }
  };

  const getUtilizationColor = (percent: number) => {
    if (percent > 100) return 'bg-red-500';
    if (percent >= 90) return 'bg-yellow-500';
    if (percent >= 70) return 'bg-green-500';
    return 'bg-blue-500';
  };

  const overloadedMembers = teamMembers.filter(m => m.status === 'Overloaded');
  const availableMembers = teamMembers.filter(m => m.status === 'Available');
  const avgUtilization = Math.round(
    teamMembers.reduce((sum, m) => sum + m.utilizationPercent, 0) / teamMembers.length
  );
  const totalCapacity = teamMembers.reduce((sum, m) => sum + m.capacity, 0);
  const totalAllocated = teamMembers.reduce((sum, m) => sum + m.allocated, 0);

  return (
    <PageLayout
      title="ADMIN – W-04 – Assignments – v1.3"
      description="Team capacity planning and workload management"
      actions={
        <>
          <Button variant="outline" onClick={handleRebalance}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Auto-Rebalance
          </Button>
        </>
      }
      kpis={[
        {
          title: 'Team Capacity',
          value: `${totalAllocated}/${totalCapacity}h`,
          change: `${Math.round((totalAllocated / totalCapacity) * 100)}% utilized`,
          changeType: totalAllocated > totalCapacity ? 'danger' : 'positive',
          icon: <Users className="h-5 w-5" />
        },
        {
          title: 'Avg Utilization',
          value: `${avgUtilization}%`,
          change: avgUtilization > 90 ? 'High load' : 'Healthy',
          changeType: avgUtilization > 100 ? 'danger' : avgUtilization > 90 ? 'warning' : 'positive',
          icon: <TrendingUp className="h-5 w-5" />
        },
        {
          title: 'Overloaded',
          value: overloadedMembers.length.toString(),
          change: overloadedMembers.length > 0 ? 'Needs rebalancing' : 'All balanced',
          changeType: overloadedMembers.length > 0 ? 'danger' : 'positive',
          icon: <AlertTriangle className="h-5 w-5" />
        },
        {
          title: 'Available',
          value: availableMembers.length.toString(),
          change: `${availableMembers.reduce((sum, m) => sum + (m.capacity - m.allocated), 0)}h free`,
          icon: <UserCheck className="h-5 w-5" />
        },
      ]}
    >
      <div className="grid grid-cols-12 gap-6">
        {/* Main Content */}
        <div className="col-span-8 space-y-6">
          {/* Overload Warning */}
          {overloadedMembers.length > 0 && (
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900 dark:text-red-100 mb-1">
                    Workload Alert
                  </h3>
                  <p className="text-sm text-red-800 dark:text-red-200">
                    {overloadedMembers.length} team member{overloadedMembers.length > 1 ? 's are' : ' is'} overloaded. 
                    Consider redistributing tasks or extending deadlines.
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={handleRebalance}>
                  Rebalance
                </Button>
              </div>
            </div>
          )}

          {/* Team Members List */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold mb-6">Team Capacity Overview</h3>
            <div className="space-y-6">
              {teamMembers.map(member => (
                <div 
                  key={member.id}
                  className="pb-6 border-b border-border last:border-0 last:pb-0"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold">{member.name}</h4>
                        <StatusBadge type={getStatusColor(member.status)}>
                          {member.status}
                        </StatusBadge>
                      </div>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {member.allocated}h / {member.capacity}h
                      </div>
                      <div className={`text-sm ${
                        member.utilizationPercent > 100 ? 'text-red-600 dark:text-red-400 font-semibold' :
                        member.utilizationPercent >= 90 ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-muted-foreground'
                      }`}>
                        {member.utilizationPercent}% utilized
                      </div>
                    </div>
                  </div>

                  {/* Utilization Bar */}
                  <div className="mb-3">
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${getUtilizationColor(member.utilizationPercent)}`}
                        style={{ width: `${Math.min(member.utilizationPercent, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Task Details */}
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{member.tasks} active tasks</span>
                    </div>
                    <div>
                      Projects: {member.projects.join(', ')}
                    </div>
                  </div>

                  {member.status === 'Overloaded' && (
                    <div className="mt-3 p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                      <p className="text-xs text-red-800 dark:text-red-200">
                        <strong>Overload:</strong> {member.allocated - member.capacity}h over capacity. 
                        Consider reassigning {Math.ceil((member.allocated - member.capacity) / 4)} tasks.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-4 space-y-6">
          {/* Workload Heatmap */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Workload Heatmap</h3>
            <div className="space-y-3">
              {teamMembers
                .sort((a, b) => b.utilizationPercent - a.utilizationPercent)
                .map(member => (
                  <div key={member.id}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="truncate max-w-[120px]">{member.name}</span>
                      <span className={`font-medium ${
                        member.utilizationPercent > 100 ? 'text-red-600 dark:text-red-400' :
                        member.utilizationPercent >= 90 ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-muted-foreground'
                      }`}>
                        {member.utilizationPercent}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${getUtilizationColor(member.utilizationPercent)}`}
                        style={{ width: `${Math.min(member.utilizationPercent, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Distribution</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Overloaded</span>
                  <span className="font-medium text-red-600 dark:text-red-400">
                    {overloadedMembers.length}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500"
                    style={{ width: `${(overloadedMembers.length / teamMembers.length) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">At Capacity</span>
                  <span className="font-medium text-yellow-600 dark:text-yellow-400">
                    {teamMembers.filter(m => m.status === 'Full').length}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-500"
                    style={{ width: `${(teamMembers.filter(m => m.status === 'Full').length / teamMembers.length) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Available</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {availableMembers.length}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500"
                    style={{ width: `${(availableMembers.length / teamMembers.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Rebalance Suggestions */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Rebalance Actions</h3>
            <div className="space-y-3 text-sm">
              {overloadedMembers.length > 0 ? (
                <>
                  <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                      Suggested Actions:
                    </p>
                    <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                      <li>Move 2 tasks from Sarah to Lisa</li>
                      <li>Extend deadline for Mobile App project</li>
                      <li>Assign new work to David or Lisa first</li>
                    </ul>
                  </div>
                  <Button size="sm" className="w-full" onClick={handleRebalance}>
                    View Detailed Plan
                  </Button>
                </>
              ) : (
                <p className="text-muted-foreground">
                  Team workload is well balanced. No action needed.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
