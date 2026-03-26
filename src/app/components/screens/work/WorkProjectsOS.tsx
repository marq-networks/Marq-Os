import { useState, useMemo } from 'react';
import { Button } from '../../ui/button';
import {
  FolderKanban, Plus, Search, Filter, LayoutGrid, List,
  Calendar, Users, DollarSign, TrendingDown, TrendingUp,
  ChevronDown, X, Edit, Archive, MoreHorizontal,
  Target, CheckSquare, Bug, Clock, Zap, AlertTriangle,
  BarChart3, Star, ExternalLink, Play, GanttChart, Flag,
  Trash2, Check, MessageSquare, Paperclip, Eye, Activity,
  ChevronRight
} from 'lucide-react';
import { useExecutionOS } from '../../../contexts/ExecutionOSContext';
import type { ProjectDocument } from './workMockData';
import { PRIORITY_CONFIG, PROJECT_COLORS } from './workTypes';
import type { Project, ProjectStatus, Priority, Task, TaskStatus } from './workTypes';
import { TaskDetailPanel } from './TaskDetailComponents';

// ── Project Status Badge ──────────────────────────────────
function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const cfg: Record<ProjectStatus, { bg: string; color: string }> = {
    'Active':    { bg: 'bg-green-100',  color: 'text-green-700' },
    'At Risk':   { bg: 'bg-red-100',    color: 'text-red-700' },
    'On Hold':   { bg: 'bg-yellow-100', color: 'text-yellow-700' },
    'Completed': { bg: 'bg-blue-100',   color: 'text-blue-700' },
    'Cancelled': { bg: 'bg-gray-100',   color: 'text-gray-600' },
  };
  const c = cfg[status];
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.bg} ${c.color}`}>
      {status}
    </span>
  );
}

// ── Avatar Group ──────────────────────────────────────────
function AvatarGroup({ names, max = 3 }: { names: string[]; max?: number }) {
  const shown = names.slice(0, max);
  const extra = names.length - max;
  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500'];
  return (
    <div className="flex items-center">
      {shown.map((name, i) => (
        <div
          key={i}
          title={name}
          className={`w-6 h-6 rounded-full border-2 border-card flex items-center justify-center text-xs text-white font-medium ${colors[i % colors.length]} -ml-1 first:ml-0`}
        >
          {name.charAt(0)}
        </div>
      ))}
      {extra > 0 && (
        <div className="w-6 h-6 rounded-full border-2 border-card bg-muted flex items-center justify-center text-xs text-muted-foreground -ml-1">
          +{extra}
        </div>
      )}
    </div>
  );
}

// ── Project Card ──────────────────────────────────────────
function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const burnColor = project.burnRate > 100 ? 'text-red-500' : project.burnRate > 80 ? 'text-orange-500' : 'text-green-500';
  const progressColor = project.progress >= 70 ? 'bg-green-500' : project.progress >= 40 ? 'bg-blue-500' : 'bg-muted-foreground';

  return (
    <div
      onClick={onClick}
      className="bg-card border border-border rounded-xl p-5 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold"
            style={{ backgroundColor: project.color }}>
            {project.code}
          </div>
          <div>
            <h3 className="font-medium group-hover:text-primary transition-colors leading-snug">
              {project.name}
            </h3>
            <p className="text-xs text-muted-foreground">{project.client} · {project.department}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ProjectStatusBadge status={project.status} />
          <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-accent rounded transition-all">
            <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-muted-foreground">Overall Progress</span>
          <span className="text-xs font-medium">{project.progress}%</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${progressColor}`} style={{ width: `${project.progress}%` }} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="text-center">
          <p className="text-xs font-semibold">{project.taskCount}</p>
          <p className="text-xs text-muted-foreground">Tasks</p>
        </div>
        <div className="text-center">
          <p className="text-xs font-semibold">{project.milestoneCount}</p>
          <p className="text-xs text-muted-foreground">Milestones</p>
        </div>
        <div className="text-center">
          <p className={`text-xs font-semibold ${project.openIssueCount > 5 ? 'text-red-500' : ''}`}>
            {project.openIssueCount}
          </p>
          <p className="text-xs text-muted-foreground">Issues</p>
        </div>
        <div className="text-center">
          <p className={`text-xs font-semibold ${burnColor}`}>{project.burnRate}%</p>
          <p className="text-xs text-muted-foreground">Burn</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <AvatarGroup names={project.team} max={4} />
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            {project.billingModel}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Project Detail Panel ──────────────────────────────────
type ProjectTab = 'dashboard' | 'tasks' | 'sprints' | 'milestones' | 'issues' | 'timelogs' | 'users' | 'documents';

function ProjectDetailPanel({ project, onClose }: { project: Project; onClose: () => void }) {
  const { tasks, milestones, issues, timeLogs, teamMembers, projects, deleteProject } = useExecutionOS();
  const [activeTab, setActiveTab] = useState<ProjectTab>('dashboard');
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Get the latest project data from context to reflect any updates
  const currentProject = projects.find(p => p.id === project.id) || project;

  const projectTasks = tasks.filter(t => t.projectId === currentProject.id);
  const projectMilestones = milestones.filter(m => m.projectId === currentProject.id);
  const projectSprints: any[] = [];
  const projectIssues = issues.filter(i => i.projectId === currentProject.id);
  const projectMembers = teamMembers.filter(m => currentProject.team.includes(m.name));
  const projectTimeLogs = timeLogs.filter(log => {
    const task = projectTasks.find(t => t.id === log.taskId);
    return !!task;
  });
  const projectDocuments: any[] = [];

  const TABS: { key: ProjectTab; label: string; icon: any; count?: number }[] = [
    { key: 'dashboard',  label: 'Dashboard',  icon: BarChart3 },
    { key: 'tasks',      label: 'Tasks',      icon: CheckSquare, count: projectTasks.length },
    { key: 'sprints',    label: 'Sprints',    icon: Zap, count: projectSprints.length },
    { key: 'milestones', label: 'Milestones', icon: Target, count: projectMilestones.length },
    { key: 'issues',     label: 'Issues',     icon: Bug, count: projectIssues.length },
    { key: 'timelogs',   label: 'Time Logs',  icon: Clock, count: projectTimeLogs.length },
    { key: 'users',      label: 'Users',      icon: Users, count: projectMembers.length },
    { key: 'documents',  label: 'Documents',  icon: FolderKanban, count: projectDocuments.length },
  ];

  const budgetPercent = Math.round((currentProject.spent / currentProject.budget) * 100);

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-[70vw] bg-background border-l border-border flex flex-col shadow-2xl">
        {/* Project Header */}
        <div className="px-6 py-4 border-b border-border bg-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: currentProject.color }}>
                {currentProject.code}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">{currentProject.name}</h2>
                  <ProjectStatusBadge status={currentProject.status} />
                </div>
                <p className="text-sm text-muted-foreground">{currentProject.client} · {currentProject.department} · {currentProject.billingModel}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowEditDrawer(true)}><Edit className="w-3.5 h-3.5 mr-1.5" /> Edit</Button>
              <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(true)} className="text-red-600 hover:text-red-700 hover:border-red-300">
                <Archive className="w-3.5 h-3.5 mr-1.5" /> Delete
              </Button>
              <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-5 gap-3">
            {[
              { label: 'Progress', value: `${currentProject.progress}%`, sub: 'Overall' },
              { label: 'Budget', value: `$${(currentProject.spent / 1000).toFixed(0)}k`, sub: `of $${(currentProject.budget / 1000).toFixed(0)}k (${budgetPercent}%)` },
              { label: 'Burn Rate', value: `${currentProject.burnRate}%`, sub: currentProject.burnRate > 100 ? '⚠ Over budget' : 'On track' },
              { label: 'Team', value: currentProject.team.length, sub: 'Members' },
              { label: 'Due', value: new Date(currentProject.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), sub: 'End date' },
            ].map((k, i) => (
              <div key={i} className="bg-muted/40 rounded-lg px-3 py-2">
                <p className="text-xs text-muted-foreground">{k.label}</p>
                <p className="font-semibold">{k.value}</p>
                <p className="text-xs text-muted-foreground">{k.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-6 py-2 border-b border-border bg-card overflow-x-auto">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.key
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
                {tab.count !== undefined && (
                  <span className={`text-xs px-1.5 rounded-full ${activeTab === tab.key ? 'bg-white/20' : 'bg-muted'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Progress Overview */}
                <div className="bg-card border border-border rounded-xl p-4">
                  <h4 className="text-sm font-medium mb-3">Progress by Milestone</h4>
                  <div className="space-y-3">
                    {projectMilestones.map(m => (
                      <div key={m.id}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground truncate flex-1">{m.name}</span>
                          <span className="font-medium ml-2">{m.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${m.progress}%`, backgroundColor: currentProject.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Task Status Breakdown */}
                <div className="bg-card border border-border rounded-xl p-4">
                  <h4 className="text-sm font-medium mb-3">Task Status Breakdown</h4>
                  <div className="space-y-2">
                    {(['Open', 'In Progress', 'To Be Tested', 'Closed'] as const).map(status => {
                      const count = projectTasks.filter(t => t.status === status).length;
                      return (
                        <div key={status} className="flex items-center gap-2">
                          <div className="flex-1 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{
                              backgroundColor: status === 'Closed' ? '#22c55e' : status === 'In Progress' ? '#3b82f6' : status === 'To Be Tested' ? '#a855f7' : '#94a3b8'
                            }} />
                            <span className="text-sm">{status}</span>
                          </div>
                          <span className="text-sm font-medium">{count}</span>
                          <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${projectTasks.length ? (count / projectTasks.length) * 100 : 0}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Budget Timeline */}
              <div className="bg-card border border-border rounded-xl p-4">
                <h4 className="text-sm font-medium mb-3">Budget Utilization</h4>
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${currentProject.burnRate > 100 ? 'bg-red-500' : currentProject.burnRate > 80 ? 'bg-orange-400' : 'bg-green-500'}`}
                        style={{ width: `${Math.min(budgetPercent, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>$0</span>
                      <span>${(currentProject.budget / 1000).toFixed(0)}k budget</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${(currentProject.spent / 1000).toFixed(1)}k</p>
                    <p className="text-xs text-muted-foreground">spent ({budgetPercent}%)</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {[
                    { label: 'Burn Rate', value: `${currentProject.burnRate}%`, alert: currentProject.burnRate > 100 },
                    { label: 'Billable Hrs', value: `${currentProject.billableHours || 0}h` },
                    { label: 'Non-Billable', value: `${currentProject.nonBillableHours || 0}h` },
                  ].map((k, i) => (
                    <div key={i} className={`rounded-lg px-3 py-2 ${k.alert ? 'bg-red-50' : 'bg-muted/40'}`}>
                      <p className={`text-xs font-semibold ${k.alert ? 'text-red-600' : ''}`}>{k.value}</p>
                      <p className="text-xs text-muted-foreground">{k.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Time Logs */}
              {projectTimeLogs.length > 0 && (
                <div className="bg-card border border-border rounded-xl p-4">
                  <h4 className="text-sm font-medium mb-3 flex items-center justify-between">
                    Recent Time Logs
                    <span className="text-xs text-muted-foreground">{projectTimeLogs.reduce((s, l) => s + l.hours, 0).toFixed(1)}h total</span>
                  </h4>
                  <div className="space-y-2">
                    {projectTimeLogs.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4).map(log => {
                      const task = projectTasks.find(t => t.id === log.taskId);
                      return (
                        <div key={log.id} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium flex-shrink-0">{log.loggedBy.charAt(0)}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs truncate">{task?.title || 'Unknown task'}</p>
                            <p className="text-xs text-muted-foreground">{log.loggedBy.split(' ')[0]} · {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                          </div>
                          <span className={`text-xs font-mono font-medium ${log.billable ? 'text-green-600' : 'text-muted-foreground'}`}>{log.duration}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-2">
              {projectTasks.length === 0 ? (
                <p className="text-center text-muted-foreground py-8 text-sm">No tasks in this project</p>
              ) : (
                projectTasks.map(task => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:bg-accent/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedTask(task)}
                  >
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{
                      backgroundColor: task.status === 'Closed' ? '#22c55e' :
                        task.status === 'In Progress' ? '#3b82f6' :
                        task.status === 'Overdue' ? '#ef4444' : '#94a3b8'
                    }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.taskId} · {task.assignee}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{task.dueDate}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      task.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                      task.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                      'bg-muted text-muted-foreground'
                    }`}>{task.priority}</span>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'sprints' && (
            <div className="space-y-3">
              {projectSprints.length === 0 ? (
                <p className="text-center text-muted-foreground py-8 text-sm">No sprints defined</p>
              ) : (
                projectSprints.map(sprint => {
                  const progress = Math.round((sprint.completedPoints / sprint.storyPoints) * 100);
                  const statusColor: Record<string, string> = {
                    Active: 'text-blue-600 bg-blue-100',
                    Planning: 'text-yellow-600 bg-yellow-100',
                    Completed: 'text-green-600 bg-green-100',
                    Cancelled: 'text-gray-500 bg-gray-100',
                  };
                  return (
                    <div key={sprint.id} className="bg-card border border-border rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{sprint.name}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[sprint.status]}`}>
                          {sprint.status}
                        </span>
                      </div>
                      {sprint.goal && (
                        <p className="text-sm text-muted-foreground mb-3">{sprint.goal}</p>
                      )}
                      <div className="grid grid-cols-3 gap-3 mb-3 text-sm">
                        <div>
                          <span className="text-muted-foreground text-xs">Story Points</span>
                          <p className="font-medium">{sprint.completedPoints}/{sprint.storyPoints}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-xs">Tasks</span>
                          <p className="font-medium">{sprint.completedTasks}/{sprint.taskCount}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-xs">Duration</span>
                          <p className="font-medium">
                            {new Date(sprint.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — {new Date(sprint.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'milestones' && (
            <div className="space-y-3">
              {projectMilestones.map(m => {
                const statusColor: Record<string, string> = {
                  Completed: 'text-green-600 bg-green-100',
                  'In Progress': 'text-blue-600 bg-blue-100',
                  'Not Started': 'text-gray-500 bg-gray-100',
                  Overdue: 'text-red-600 bg-red-100',
                };
                return (
                  <div key={m.id} className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary" />
                        <h4 className="font-medium">{m.name}</h4>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[m.status]}`}>{m.status}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span>Owner: {m.owner}</span>
                      <span>Tasks: {m.completedTasks}/{m.taskCount}</span>
                      <span>Due: {new Date(m.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${m.progress}%`, backgroundColor: project.color }} />
                      </div>
                      <span className="text-xs font-medium">{m.progress}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'issues' && (
            <div className="space-y-2">
              {projectIssues.length === 0 ? (
                <p className="text-center text-muted-foreground py-8 text-sm">No issues reported</p>
              ) : (
                projectIssues.map(issue => {
                  const severityColor: Record<string, string> = {
                    Critical: 'bg-red-100 text-red-700',
                    Major: 'bg-orange-100 text-orange-700',
                    Minor: 'bg-yellow-100 text-yellow-700',
                    Trivial: 'bg-gray-100 text-gray-600',
                  };
                  return (
                    <div key={issue.id} className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{issue.title}</p>
                        <p className="text-xs text-muted-foreground">{issue.issueId} · {issue.assignee} · {issue.module}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${severityColor[issue.severity]}`}>
                        {issue.severity}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        issue.status === 'Open' ? 'bg-gray-100 text-gray-600' :
                        issue.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>{issue.status}</span>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-2">
              {projectMembers.map(member => (
                <div key={member.id} className="flex items-center gap-4 p-3 bg-card border border-border rounded-lg">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-medium text-sm">
                    {member.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role} · {member.department}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${member.currentLoad > 90 ? 'bg-red-500' : member.currentLoad > 75 ? 'bg-orange-400' : 'bg-green-500'}`}
                          style={{ width: `${member.currentLoad}%` }}
                        />
                      </div>
                      <span className="text-xs">{member.currentLoad}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{member.assignedTasks} tasks</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'timelogs' && (
            <div className="space-y-3">
              {/* Summary */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Total Logged', value: `${projectTimeLogs.reduce((s, l) => s + l.hours, 0).toFixed(1)}h` },
                  { label: 'Billable', value: `${projectTimeLogs.filter(l => l.billable).reduce((s, l) => s + l.hours, 0).toFixed(1)}h` },
                  { label: 'Non-Billable', value: `${projectTimeLogs.filter(l => !l.billable).reduce((s, l) => s + l.hours, 0).toFixed(1)}h` },
                ].map((k, i) => (
                  <div key={i} className="bg-muted/40 rounded-lg px-4 py-3 text-center">
                    <p className="font-semibold">{k.value}</p>
                    <p className="text-xs text-muted-foreground">{k.label}</p>
                  </div>
                ))}
              </div>
              {projectTimeLogs.length === 0 ? (
                <p className="text-center text-muted-foreground py-8 text-sm">No time logs for this project</p>
              ) : (
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        {['Date', 'Task', 'Logged By', 'Duration', 'Description', 'Billable'].map(h => (
                          <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-2.5">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {projectTimeLogs.sort((a, b) => b.date.localeCompare(a.date)).map((log, i) => {
                        const task = projectTasks.find(t => t.id === log.taskId);
                        return (
                          <tr key={log.id} className={`border-t border-border ${i % 2 === 0 ? '' : 'bg-muted/20'}`}>
                            <td className="px-4 py-2.5 text-muted-foreground">{new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                            <td className="px-4 py-2.5 max-w-[200px]">
                              <p className="font-medium truncate">{task?.title || log.taskId}</p>
                              <p className="text-xs text-muted-foreground">{task?.taskId}</p>
                            </td>
                            <td className="px-4 py-2.5">
                              <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">{log.loggedBy.charAt(0)}</div>
                                <span>{log.loggedBy.split(' ')[0]}</span>
                              </div>
                            </td>
                            <td className="px-4 py-2.5 font-mono font-medium">{log.duration}</td>
                            <td className="px-4 py-2.5 text-muted-foreground max-w-[220px]">
                              <p className="truncate text-xs">{log.description}</p>
                            </td>
                            <td className="px-4 py-2.5">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${log.billable ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                                {log.billable ? '$ Billable' : 'Internal'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-3">
              {/* Folder groups */}
              {projectDocuments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8 text-sm">No documents uploaded yet</p>
              ) : (() => {
                const folders = [...new Set(projectDocuments.map(d => d.folder || 'General'))];
                const FILE_ICONS: Record<string, { icon: string; color: string; bg: string }> = {
                  PDF:   { icon: '📄', color: 'text-red-600',    bg: 'bg-red-50'    },
                  FIGMA: { icon: '🎨', color: 'text-purple-600', bg: 'bg-purple-50' },
                  XLSX:  { icon: '📊', color: 'text-green-700',  bg: 'bg-green-50'  },
                  DOCX:  { icon: '📝', color: 'text-blue-600',   bg: 'bg-blue-50'   },
                  MP4:   { icon: '🎬', color: 'text-orange-600', bg: 'bg-orange-50' },
                  ZIP:   { icon: '📦', color: 'text-gray-600',   bg: 'bg-gray-50'   },
                  PPTX:  { icon: '📑', color: 'text-amber-600',  bg: 'bg-amber-50'  },
                  PNG:   { icon: '🖼️', color: 'text-cyan-600',   bg: 'bg-cyan-50'   },
                };
                return folders.map(folder => (
                  <div key={folder} className="bg-card border border-border rounded-xl overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/40 border-b border-border">
                      <FolderKanban className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-sm font-medium">{folder}</span>
                      <span className="text-xs text-muted-foreground">({projectDocuments.filter(d => (d.folder || 'General') === folder).length} files)</span>
                    </div>
                    <div className="divide-y divide-border">
                      {projectDocuments.filter(d => (d.folder || 'General') === folder).map(doc => {
                        const fi = FILE_ICONS[doc.type] || FILE_ICONS['PDF'];
                        return (
                          <div key={doc.id} className="flex items-center gap-4 px-4 py-3 hover:bg-accent/30 transition-colors group">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0 ${fi.bg}`}>
                              {fi.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{doc.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{doc.description}</p>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground flex-shrink-0">
                              <span className={`px-2 py-0.5 rounded font-mono ${fi.bg} ${fi.color}`}>{doc.type}</span>
                              <span>{doc.version}</span>
                              <span>{doc.size}</span>
                              <div className="flex items-center gap-1.5">
                                <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center text-xs">{doc.uploadedBy.charAt(0)}</div>
                                <span>{doc.uploadedBy.split(' ')[0]}</span>
                              </div>
                              <span>{new Date(doc.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            </div>
                            <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-accent rounded-lg transition-all">
                              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ));
              })()}
            </div>
          )}
        </div>
      </div>
      {showEditDrawer && (
        <EditProjectDrawer
          project={project}
          onClose={() => setShowEditDrawer(false)}
        />
      )}
      {showDeleteConfirm && (
        <DeleteProjectConfirm
          project={currentProject}
          onConfirm={() => {
            deleteProject(currentProject.id);
            setShowDeleteConfirm(false);
            onClose();
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
      {selectedTask && (
        <TaskDetailPanel task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
}

// ── Add Project Drawer ────────────────────────────────────
function AddProjectDrawer({ onClose, onAdd }: { onClose: () => void; onAdd: (p: Partial<Project>) => void }) {
  const [form, setForm] = useState({
    name: '', client: '', department: 'Engineering', priority: 'Medium' as Priority,
    startDate: '', endDate: '', budget: '', billingModel: 'Fixed', description: '',
    color: PROJECT_COLORS[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.endDate) return;
    onAdd({
      ...form,
      budget: parseFloat(form.budget) || 0,
      status: 'Active',
      progress: 0, spent: 0, burnRate: 0,
      profitRisk: 'None',
      team: [], teamLead: '',
      taskCount: 0, openTaskCount: 0, milestoneCount: 0, openIssueCount: 0, sprintCount: 0,
      code: form.name.split(' ').map(w => w[0]).join('').slice(0, 4).toUpperCase(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-[480px] bg-background border-l border-border flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semibold">New Project</h2>
          <button onClick={onClose} className="p-1 hover:bg-accent rounded"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-6 space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">Project Name *</label>
            <input
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Enter project name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium block mb-1.5">Client</label>
              <input
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Client name"
                value={form.client}
                onChange={e => setForm({ ...form, client: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Department</label>
              <select
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none"
                value={form.department}
                onChange={e => setForm({ ...form, department: e.target.value })}
              >
                {['Engineering', 'Product', 'Design', 'Operations', 'Marketing'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium block mb-1.5">Priority</label>
              <select
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
                value={form.priority}
                onChange={e => setForm({ ...form, priority: e.target.value as Priority })}
              >
                {['Critical', 'High', 'Medium', 'Low'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Billing Model</label>
              <select
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
                value={form.billingModel}
                onChange={e => setForm({ ...form, billingModel: e.target.value })}
              >
                {['Fixed', 'Hourly', 'Retainer'].map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium block mb-1.5">Start Date</label>
              <input type="date" className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
                value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">End Date *</label>
              <input type="date" className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
                value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} required />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Budget (USD)</label>
            <input type="number" className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
              placeholder="0.00" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">Project Color</label>
            <div className="flex gap-2">
              {PROJECT_COLORS.map(color => (
                <button
                  key={color} type="button"
                  onClick={() => setForm({ ...form, color })}
                  className={`w-6 h-6 rounded-full transition-all ${form.color === color ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Description</label>
            <textarea
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background resize-none focus:outline-none"
              rows={3}
              placeholder="Project description..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1">Create Project</Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Edit Project Drawer ───────────────────────────────────
function EditProjectDrawer({ project, onClose }: { project: Project; onClose: () => void }) {
  const { updateProject } = useExecutionOS();
  const [form, setForm] = useState({
    name: project.name,
    client: project.client,
    department: project.department,
    priority: project.priority,
    status: project.status,
    startDate: project.startDate,
    endDate: project.endDate,
    budget: project.budget.toString(),
    billingModel: project.billingModel || 'Fixed',
    description: project.description || '',
    color: project.color,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.endDate) return;
    
    updateProject(project.id, {
      name: form.name,
      client: form.client,
      department: form.department,
      priority: form.priority,
      status: form.status,
      startDate: form.startDate,
      endDate: form.endDate,
      budget: parseFloat(form.budget) || 0,
      billingModel: form.billingModel as 'Fixed' | 'Hourly' | 'Retainer',
      description: form.description,
      color: form.color,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-[480px] bg-background border-l border-border flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semibold">Edit Project</h2>
          <button onClick={onClose} className="p-1 hover:bg-accent rounded"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-6 space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">Project Name *</label>
            <input
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Enter project name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium block mb-1.5">Client</label>
              <input
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Client name"
                value={form.client}
                onChange={e => setForm({ ...form, client: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Department</label>
              <select
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none"
                value={form.department}
                onChange={e => setForm({ ...form, department: e.target.value })}
              >
                {['Engineering', 'Product', 'Design', 'Operations', 'Marketing'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium block mb-1.5">Status</label>
              <select
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value as ProjectStatus })}
              >
                {['Active', 'At Risk', 'On Hold', 'Completed', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Priority</label>
              <select
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
                value={form.priority}
                onChange={e => setForm({ ...form, priority: e.target.value as Priority })}
              >
                {['Critical', 'High', 'Medium', 'Low'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Billing Model</label>
            <select
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
              value={form.billingModel}
              onChange={e => setForm({ ...form, billingModel: e.target.value })}
            >
              {['Fixed', 'Hourly', 'Retainer'].map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium block mb-1.5">Start Date</label>
              <input type="date" className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
                value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">End Date *</label>
              <input type="date" className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
                value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} required />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Budget (USD)</label>
            <input type="number" className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
              placeholder="0.00" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">Project Color</label>
            <div className="flex gap-2">
              {PROJECT_COLORS.map(color => (
                <button
                  key={color} type="button"
                  onClick={() => setForm({ ...form, color })}
                  className={`w-6 h-6 rounded-full transition-all ${form.color === color ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Description</label>
            <textarea
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background resize-none focus:outline-none"
              rows={3}
              placeholder="Project description..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1">Update Project</Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Delete Project Confirmation ───────────────────────────
function DeleteProjectConfirm({ 
  project, 
  onConfirm, 
  onCancel 
}: { 
  project: Project; 
  onConfirm: () => void; 
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-background border border-border rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Delete Project</h3>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete <span className="font-medium text-foreground">{project.name}</span>? 
              This will also delete all associated tasks, milestones, and data. This action cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button 
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete Project
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Portfolio Timeline (Gantt) ────────────────────────────
function PortfolioTimeline({ projects, milestones: allMilestones }: { projects: Project[]; milestones: any[] }) {
  const today = new Date(); today.setHours(0, 0, 0, 0);

  // Build month columns: from earliest startDate to latest endDate
  const allStarts = projects.map(p => new Date(p.startDate));
  const allEnds   = projects.map(p => new Date(p.endDate));
  const rangeStart = new Date(Math.min(...allStarts.map(d => d.getTime())));
  const rangeEnd   = new Date(Math.max(...allEnds.map(d => d.getTime())));
  rangeStart.setDate(1);
  rangeEnd.setDate(1); rangeEnd.setMonth(rangeEnd.getMonth() + 1);

  const months: { year: number; month: number; label: string; isToday: boolean }[] = [];
  const cur = new Date(rangeStart);
  while (cur < rangeEnd) {
    months.push({
      year: cur.getFullYear(),
      month: cur.getMonth(),
      label: cur.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      isToday: cur.getFullYear() === today.getFullYear() && cur.getMonth() === today.getMonth(),
    });
    cur.setMonth(cur.getMonth() + 1);
  }

  const totalMs = rangeEnd.getTime() - rangeStart.getTime();
  const pct = (d: Date) => Math.max(0, Math.min(100, ((d.getTime() - rangeStart.getTime()) / totalMs) * 100));
  const colWidth = `${100 / months.length}%`;

  // Milestones for this set of projects
  const milestones = allMilestones.filter(m => projects.some(p => p.id === m.projectId));

  // today % through timeline
  const todayPct = pct(today);

  const STATUS_COLOR: Record<string, string> = {
    'Active':    'bg-blue-500',
    'At Risk':   'bg-red-500',
    'On Hold':   'bg-yellow-500',
    'Completed': 'bg-green-500',
    'Cancelled': 'bg-gray-400',
  };

  const MILESTONE_STATUS_DOT: Record<string, string> = {
    'Completed':   'bg-green-500',
    'In Progress': 'bg-blue-500',
    'Not Started': 'bg-gray-400',
    'Overdue':     'bg-red-500',
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Legend */}
      <div className="flex items-center gap-6 px-5 py-3 border-b border-border bg-muted/20">
        <div className="flex items-center gap-4 text-xs">
          {[
            { color: 'bg-blue-500',   label: 'Active' },
            { color: 'bg-red-500',    label: 'At Risk' },
            { color: 'bg-yellow-500', label: 'On Hold' },
            { color: 'bg-green-500',  label: 'Completed' },
            { color: 'bg-gray-400',   label: 'Cancelled' },
          ].map(l => (
            <span key={l.label} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-sm ${l.color}`} />{l.label}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3 ml-auto text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500 border-2 border-white ring-1 ring-orange-400" />Milestone</span>
          <span className="flex items-center gap-1.5"><span className="w-0.5 h-4 bg-blue-500 opacity-70" />Today</span>
        </div>
      </div>

      <div className="overflow-auto">
        <div style={{ minWidth: `${Math.max(700, months.length * 90)}px` }}>
          {/* Month header */}
          <div className="flex border-b border-border bg-muted/30">
            <div className="w-52 flex-shrink-0 px-4 py-2.5 text-xs font-semibold text-muted-foreground border-r border-border">
              Project
            </div>
            <div className="flex-1 flex relative">
              {months.map(m => (
                <div
                  key={`${m.year}-${m.month}`}
                  className={`border-r border-border/60 px-2 py-2.5 text-center text-xs ${m.isToday ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-muted-foreground'}`}
                  style={{ width: colWidth }}
                >
                  {m.label}
                </div>
              ))}
            </div>
          </div>

          {/* Project rows */}
          {projects.map(project => {
            const start = new Date(project.startDate);
            const end   = new Date(project.endDate);
            const left  = pct(start);
            const right = pct(end);
            const width = right - left;
            const barColor = STATUS_COLOR[project.status] || 'bg-blue-500';
            const progressWidth = Math.max(0, Math.min(width, (width * project.progress) / 100));
            const projectMilestones = milestones.filter(m => m.projectId === project.id);

            return (
              <div key={project.id} className="flex border-b border-border/40 hover:bg-accent/20 transition-colors group">
                {/* Label */}
                <div className="w-52 flex-shrink-0 px-4 py-3 border-r border-border flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0"
                    style={{ backgroundColor: project.color, fontSize: '10px' }}
                  >
                    {project.code}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">{project.name}</p>
                    <p className="text-xs text-muted-foreground">{project.progress}% · {project.status}</p>
                  </div>
                </div>

                {/* Bar */}
                <div className="flex-1 relative py-3 px-0" style={{ height: '52px' }}>
                  {/* Month grid lines */}
                  {months.map((m, i) => (
                    <div
                      key={i}
                      className={`absolute top-0 bottom-0 border-r border-border/30 ${m.isToday ? 'bg-blue-50/40' : ''}`}
                      style={{ left: `${(i / months.length) * 100}%`, width: colWidth }}
                    />
                  ))}

                  {/* Today line */}
                  {todayPct > 0 && todayPct < 100 && (
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-blue-500 opacity-60 z-20"
                      style={{ left: `${todayPct}%` }}
                    />
                  )}

                  {/* Project bar */}
                  <div
                    className="absolute rounded-full overflow-hidden"
                    style={{
                      left: `${left}%`,
                      width: `${Math.max(width, 0.5)}%`,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      height: '20px',
                    }}
                  >
                    {/* Background track */}
                    <div className={`absolute inset-0 rounded-full opacity-30 ${barColor}`} />
                    {/* Progress fill */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 rounded-full ${barColor}`}
                      style={{ width: `${project.progress}%` }}
                    />
                    {/* Label inside bar */}
                    <div className="absolute inset-0 flex items-center px-2 overflow-hidden">
                      <span className="text-white font-semibold truncate" style={{ fontSize: '10px' }}>
                        {project.name}
                      </span>
                    </div>
                  </div>

                  {/* Milestone diamonds */}
                  {projectMilestones.map(ms => {
                    const msEnd = new Date(ms.endDate);
                    const msPct = pct(msEnd);
                    if (msPct < 0 || msPct > 100) return null;
                    const dot = MILESTONE_STATUS_DOT[ms.status] || 'bg-gray-400';
                    return (
                      <div
                        key={ms.id}
                        className="absolute z-30 group/ms"
                        style={{ left: `${msPct}%`, top: '50%', transform: 'translate(-50%, -50%)' }}
                        title={`${ms.name} · ${ms.status}`}
                      >
                        <div
                          className={`w-3 h-3 ${dot} border-2 border-white shadow-md`}
                          style={{ transform: 'rotate(45deg)' }}
                        />
                        {/* Milestone tooltip */}
                        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-44 bg-card border border-border rounded-xl shadow-xl p-2.5 hidden group-hover/ms:block pointer-events-none">
                          <p className="font-semibold text-xs mb-0.5 truncate">{ms.name}</p>
                          <p className={`text-xs px-1.5 py-0.5 rounded-full inline-block ${
                            ms.status === 'Completed' ? 'bg-green-100 text-green-700' :
                            ms.status === 'Overdue' ? 'bg-red-100 text-red-700' :
                            ms.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>{ms.status}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Due: {new Date(ms.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                          </p>
                          <div className="mt-1.5 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${dot}`} style={{ width: `${ms.progress}%` }} />
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{ms.progress}% complete</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-0 border-t border-border">
        {[
          { label: 'Active Projects',  value: projects.filter(p => p.status === 'Active').length,    color: 'text-blue-600' },
          { label: 'At Risk',          value: projects.filter(p => p.status === 'At Risk').length,    color: 'text-red-500' },
          { label: 'Total Milestones', value: milestones.length,                                      color: 'text-purple-600' },
          { label: 'Overdue Milestones', value: milestones.filter(m => m.status === 'Overdue').length, color: 'text-orange-500' },
        ].map((k, i) => (
          <div key={i} className={`px-5 py-3 text-center ${i < 3 ? 'border-r border-border' : ''}`}>
            <p className={`font-semibold ${k.color}`}>{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
export function WorkProjectsOS() {
  const { projects, tasks: allTasks, milestones, issues: allIssues, createProject } = useExecutionOS();
  const [view, setView] = useState<'grid' | 'list' | 'timeline'>('grid');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAddDrawer, setShowAddDrawer] = useState(false);

  const filtered = useMemo(() => {
    return projects.filter(p => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.client.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || p.status === statusFilter;
      const matchDept = deptFilter === 'all' || p.department === deptFilter;
      return matchSearch && matchStatus && matchDept;
    });
  }, [projects, search, statusFilter, deptFilter]);

  const departments = [...new Set(projects.map(p => p.department))];
  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
  const totalSpent = projects.reduce((s, p) => s + p.spent, 0);
  const atRisk = projects.filter(p => p.status === 'At Risk' || p.burnRate > 100).length;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="px-6 py-5 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-primary" />
              Projects
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {projects.filter(p => p.status === 'Active').length} active · {projects.length} total
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex items-center gap-0.5 bg-muted p-1 rounded-lg">
              <button onClick={() => setView('grid')} className={`p-1.5 rounded transition-colors ${view === 'grid' ? 'bg-card shadow-sm' : 'text-muted-foreground hover:text-foreground'}`} title="Grid view">
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button onClick={() => setView('list')} className={`p-1.5 rounded transition-colors ${view === 'list' ? 'bg-card shadow-sm' : 'text-muted-foreground hover:text-foreground'}`} title="List view">
                <List className="w-4 h-4" />
              </button>
              <button onClick={() => setView('timeline')} className={`flex items-center gap-1 px-2 py-1.5 rounded text-xs transition-colors ${view === 'timeline' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`} title="Portfolio timeline">
                <GanttChart className="w-4 h-4" /> Timeline
              </button>
            </div>
            <Button onClick={() => setShowAddDrawer(true)} size="sm">
              <Plus className="w-3.5 h-3.5 mr-1.5" /> New Project
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border text-sm">
          <div>
            <span className="text-muted-foreground">Total Budget: </span>
            <span className="font-semibold">${(totalBudget / 1000).toFixed(0)}k</span>
          </div>
          <div>
            <span className="text-muted-foreground">Spent: </span>
            <span className="font-semibold">${(totalSpent / 1000).toFixed(0)}k</span>
            <span className="text-muted-foreground ml-1">({Math.round((totalSpent / totalBudget) * 100)}%)</span>
          </div>
          {atRisk > 0 && (
            <div className="flex items-center gap-1 text-red-500">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{atRisk} at risk</span>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-border bg-background">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            className="w-full pl-9 pr-3 py-1.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Search projects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background focus:outline-none"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          {['Active', 'At Risk', 'On Hold', 'Completed', 'Cancelled'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background focus:outline-none"
          value={deptFilter}
          onChange={e => setDeptFilter(e.target.value)}
        >
          <option value="all">All Departments</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <FolderKanban className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No projects match your filters</p>
          </div>
        ) : view === 'timeline' ? (
          <PortfolioTimeline projects={filtered} milestones={milestones} />
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(project => (
              <ProjectCard key={project.id} project={project} onClick={() => setSelectedProject(project)} />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs text-muted-foreground uppercase tracking-wide">
              <div className="col-span-4">Project</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Progress</div>
              <div className="col-span-2">Budget</div>
              <div className="col-span-1">Burn</div>
              <div className="col-span-2">Team / Due</div>
            </div>
            {filtered.map(project => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="grid grid-cols-12 gap-4 items-center px-4 py-3 bg-card border border-border rounded-lg hover:bg-accent/30 cursor-pointer transition-colors"
              >
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: project.color }}>
                    {project.code}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{project.name}</p>
                    <p className="text-xs text-muted-foreground">{project.client}</p>
                  </div>
                </div>
                <div className="col-span-2"><ProjectStatusBadge status={project.status} /></div>
                <div className="col-span-1">
                  <div className="flex items-center gap-1">
                    <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${project.progress}%` }} />
                    </div>
                    <span className="text-xs">{project.progress}%</span>
                  </div>
                </div>
                <div className="col-span-2 text-sm">
                  <span className="font-medium">${(project.spent / 1000).toFixed(0)}k</span>
                  <span className="text-muted-foreground"> / ${(project.budget / 1000).toFixed(0)}k</span>
                </div>
                <div className={`col-span-1 text-sm font-medium ${project.burnRate > 100 ? 'text-red-500' : project.burnRate > 80 ? 'text-orange-500' : 'text-green-600'}`}>
                  {project.burnRate}%
                </div>
                <div className="col-span-2 flex items-center justify-between">
                  <AvatarGroup names={project.team} max={3} />
                  <span className="text-xs text-muted-foreground">
                    {new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedProject && (
        <ProjectDetailPanel project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}

      {showAddDrawer && (
        <AddProjectDrawer
          onClose={() => setShowAddDrawer(false)}
          onAdd={p => {
            const newProjectData: Omit<Project, 'id'> = {
              name: p.name || 'Untitled',
              code: p.code || 'NEW',
              client: p.client || 'Internal',
              department: p.department || 'Engineering',
              status: 'Active',
              priority: (p.priority as Priority) || 'Medium',
              startDate: p.startDate || new Date().toISOString().split('T')[0],
              endDate: p.endDate || '',
              progress: 0, 
              budget: p.budget || 0, 
              spent: 0, 
              burnRate: 0,
              profitRisk: 'None', 
              team: [], 
              teamLead: '',
              color: p.color || PROJECT_COLORS[0],
              billingModel: (p.billingModel as any) || 'Fixed',
              taskCount: 0, 
              openTaskCount: 0, 
              milestoneCount: 0, 
              openIssueCount: 0, 
              sprintCount: 0,
              description: p.description,
            };
            createProject(newProjectData);
            setShowAddDrawer(false);
          }}
        />
      )}
    </div>
  );
}
