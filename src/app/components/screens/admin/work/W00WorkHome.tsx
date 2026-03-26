import { PageLayout } from '../../../shared/PageLayout';
import { StatusBadge } from '../../../shared/StatusBadge';
import { Button } from '../../../ui/button';
import { 
  FolderKanban, 
  Target, 
  CheckSquare, 
  AlertTriangle,
  TrendingDown,
  Users,
  DollarSign,
  PieChart,
  BarChart3,
  Activity,
  Clock,
  FileText,
  Link as LinkIcon
} from 'lucide-react';
import { useState } from 'react';
import { mockProjects, mockMilestones, mockTasks, mockTeamMembers } from './mockData';

export function W00WorkHome() {
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');

  // Calculate metrics
  const activeProjects = mockProjects.filter(p => p.status === 'Active').length;
  const activeMilestones = mockMilestones.filter(m => m.status === 'In Progress').length;
  const openTasks = mockTasks.filter(t => t.status !== 'Done' && t.approvalStatus === 'Approved').length;
  const overdueTasks = mockTasks.filter(t => {
    const today = new Date();
    const dueDate = new Date(t.dueDate);
    return dueDate < today && t.status !== 'Done' && t.approvalStatus === 'Approved';
  }).length;
  
  const totalBudget = mockProjects.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = mockProjects.reduce((sum, p) => sum + p.spent, 0);
  const avgBurnRate = Math.round(mockProjects.reduce((sum, p) => sum + p.burnRate, 0) / mockProjects.length);
  
  const avgTeamLoad = Math.round(mockTeamMembers.reduce((sum, m) => sum + m.currentLoad, 0) / mockTeamMembers.length);
  
  const highRiskProjects = mockProjects.filter(p => p.profitRisk === 'High').length;

  // Slipping tasks (in progress but overdue)
  const slippingTasks = mockTasks.filter(t => {
    const today = new Date();
    const dueDate = new Date(t.dueDate);
    return t.status === 'In Progress' && dueDate < today;
  });

  // Overdue milestones
  const overdueMilestones = mockMilestones.filter(m => m.status === 'Overdue');

  // Burn alerts (projects over 100% burn rate)
  const burnAlerts = mockProjects.filter(p => p.burnRate > 100);

  // Evidence missing tasks
  const evidenceMissingTasks = mockTasks.filter(t => 
    t.status === 'Done' && !t.hasEvidence && t.billable
  );

  return (
    <PageLayout
      title="ADMIN – W-00 – Work Home – v1.3"
      description="Portfolio command center with MARQ intelligence"
      actions={
        <div className="flex gap-2">
          <select 
            className="px-3 py-2 bg-card border border-border rounded-lg text-sm"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option>This Week</option>
            <option>This Month</option>
            <option>This Quarter</option>
            <option>This Year</option>
          </select>
          <Button variant="outline">Export Report</Button>
        </div>
      }
      kpis={[
        {
          title: 'Active Projects',
          value: activeProjects.toString(),
          change: `${mockProjects.length} total`,
          icon: <FolderKanban className="h-5 w-5" />
        },
        {
          title: 'Active Milestones',
          value: activeMilestones.toString(),
          change: `${mockMilestones.length} total`,
          icon: <Target className="h-5 w-5" />
        },
        {
          title: 'Open Tasks',
          value: openTasks.toString(),
          change: `${mockTasks.filter(t => t.approvalStatus === 'Approved').length} approved`,
          icon: <CheckSquare className="h-5 w-5" />
        },
        {
          title: 'Overdue Tasks',
          value: overdueTasks.toString(),
          change: overdueTasks > 0 ? 'Needs attention' : 'All on track',
          changeType: overdueTasks > 0 ? 'danger' : 'positive',
          icon: <AlertTriangle className="h-5 w-5" />
        },
        {
          title: 'Burn Rate',
          value: `${avgBurnRate}%`,
          change: `$${totalSpent.toLocaleString()} / $${totalBudget.toLocaleString()}`,
          changeType: avgBurnRate > 100 ? 'danger' : avgBurnRate > 80 ? 'warning' : 'positive',
          icon: <TrendingDown className="h-5 w-5" />
        },
        {
          title: 'Team Load',
          value: `${avgTeamLoad}%`,
          change: `${mockTeamMembers.filter(m => m.currentLoad > 90).length} overloaded`,
          changeType: avgTeamLoad > 90 ? 'danger' : avgTeamLoad > 75 ? 'warning' : 'positive',
          icon: <Users className="h-5 w-5" />
        },
        {
          title: 'Profit Risk',
          value: highRiskProjects.toString(),
          change: highRiskProjects > 0 ? 'Projects at risk' : 'All healthy',
          changeType: highRiskProjects > 0 ? 'danger' : 'positive',
          icon: <DollarSign className="h-5 w-5" />
        },
      ]}
    >
      <div className="space-y-6">
        {/* Charts Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Execution Health */}
          <div className="col-span-3 bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Execution Health</h3>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-center py-8">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-muted"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    strokeDasharray={`${(100 - overdueTasks * 5) * 3.51} 351.86`}
                    className="text-primary"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-2xl font-bold">{100 - overdueTasks * 5}%</span>
                  <span className="text-xs text-muted-foreground">Healthy</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-muted-foreground">On Track</span>
                </div>
                <p className="font-medium">{mockProjects.filter(p => p.status === 'Active').length}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-muted-foreground">At Risk</span>
                </div>
                <p className="font-medium">{mockProjects.filter(p => p.status === 'At Risk').length}</p>
              </div>
            </div>
          </div>

          {/* Load Distribution */}
          <div className="col-span-5 bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Team Load Distribution</h3>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-3">
              {mockTeamMembers.slice(0, 5).map(member => (
                <div key={member.id}>
                  <div className="flex items-center justify-between mb-1 text-sm">
                    <span className="text-muted-foreground">{member.name}</span>
                    <span className="font-medium">{member.currentLoad}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${
                        member.currentLoad > 90 ? 'bg-red-500' :
                        member.currentLoad > 75 ? 'bg-yellow-500' : 
                        'bg-primary'
                      }`}
                      style={{ width: `${member.currentLoad}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Client/Dept Burn */}
          <div className="col-span-4 bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Department Burn</h3>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-3">
              {['Engineering', 'Product', 'Design', 'Operations'].map((dept, idx) => {
                const deptProjects = mockProjects.filter(p => p.department === dept);
                const deptSpend = deptProjects.reduce((sum, p) => sum + p.spent, 0);
                const percentage = Math.round((deptSpend / totalSpent) * 100);
                
                return (
                  <div key={dept} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full`} style={{ 
                        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][idx]
                      }}></div>
                      <span className="text-sm">{dept}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">${(deptSpend / 1000).toFixed(0)}k</span>
                      <span className="text-muted-foreground ml-2">({percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Delivery Risk Curve */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Delivery Risk Timeline</h3>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="h-48 flex items-end gap-2">
            {Array.from({ length: 12 }, (_, i) => {
              const height = Math.max(20, Math.random() * 100);
              const isHigh = height > 70;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div 
                    className={`w-full rounded-t transition-all ${
                      isHigh ? 'bg-red-500' : 'bg-primary'
                    }`}
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs text-muted-foreground">W{i + 1}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Control Tables */}
        <div className="grid grid-cols-12 gap-6">
          {/* Slipping Tasks */}
          <div className="col-span-6 bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Slipping Tasks</h3>
              <StatusBadge type="danger">{slippingTasks.length}</StatusBadge>
            </div>
            <div className="space-y-2">
              {slippingTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No slipping tasks</p>
              ) : (
                slippingTasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.projectName} • {task.assignee}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-red-500" />
                      <span className="text-xs text-red-500 font-medium">
                        {Math.ceil((new Date().getTime() - new Date(task.dueDate).getTime()) / (1000 * 60 * 60 * 24))}d overdue
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Overdue Milestones */}
          <div className="col-span-6 bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Overdue Milestones</h3>
              <StatusBadge type="danger">{overdueMilestones.length}</StatusBadge>
            </div>
            <div className="space-y-2">
              {overdueMilestones.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">All milestones on track</p>
              ) : (
                overdueMilestones.map(milestone => (
                  <div key={milestone.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{milestone.name}</p>
                      <p className="text-xs text-muted-foreground">{milestone.projectName} • {milestone.owner}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">{milestone.progress}%</span>
                      <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-red-500"
                          style={{ width: `${milestone.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Burn Alerts */}
          <div className="col-span-6 bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Burn Alerts</h3>
              <StatusBadge type="warning">{burnAlerts.length}</StatusBadge>
            </div>
            <div className="space-y-2">
              {burnAlerts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">All projects within budget</p>
              ) : (
                burnAlerts.map(project => (
                  <div key={project.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{project.name}</p>
                      <p className="text-xs text-muted-foreground">{project.client}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-3 w-3 text-orange-500" />
                      <span className="text-xs text-orange-500 font-medium">{project.burnRate}% burn</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Evidence Missing */}
          <div className="col-span-6 bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Evidence-Missing Work</h3>
              <StatusBadge type="warning">{evidenceMissingTasks.length}</StatusBadge>
            </div>
            <div className="space-y-2">
              {evidenceMissingTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">All billable work has evidence</p>
              ) : (
                evidenceMissingTasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.projectName} • {task.assignee}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-3 w-3 text-orange-500" />
                      <span className="text-xs text-orange-500 font-medium">No evidence</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
