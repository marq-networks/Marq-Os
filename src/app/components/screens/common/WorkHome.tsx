import { useState, useMemo } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { StatusBadge } from '../../shared/StatusBadge';
import { BarChartComponent, DonutChartComponent } from '../../shared/Charts';
import { useExecutionOS } from '../../../contexts/ExecutionOSContext';
import {
  LayoutDashboard, FolderKanban, ListChecks, Milestone, Users, TrendingUp,
  Calendar, AlertTriangle, Clock,
} from 'lucide-react';
import type { TaskStatus, ProjectStatus } from '../work/workTypes';

const STATUS_COLORS: Record<string, string> = {
  Open: 'bg-blue-500/10 text-blue-700', 'In Progress': 'bg-indigo-500/10 text-indigo-700',
  'To Be Tested': 'bg-purple-500/10 text-purple-700', Closed: 'bg-green-500/10 text-green-700',
  Overdue: 'bg-red-500/10 text-red-700', 'On Hold': 'bg-yellow-500/10 text-yellow-700',
  Waiting: 'bg-orange-500/10 text-orange-700', Reopen: 'bg-pink-500/10 text-pink-700',
};

export function WorkHome() {
  const { projects, tasks, milestones, sprints, activityFeed, teamMembers } = useExecutionOS();

  const openTasks = tasks.filter(t => t.status !== 'Closed');
  const overdueTasks = tasks.filter(t => t.status === 'Overdue');
  const activeProjects = projects.filter(p => p.status === 'Active');
  const activeSprint = sprints.find(s => s.status === 'Active');

  // Task status distribution
  const taskStatusData = useMemo(() => {
    const counts: Record<string, number> = {};
    tasks.forEach(t => { counts[t.status] = (counts[t.status] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [tasks]);

  // Project progress
  const projectProgressData = projects.slice(0, 6).map(p => ({
    name: p.code,
    progress: p.progress,
  }));

  return (
    <PageLayout
      title="Work Dashboard"
      description="Central command center for all projects, tasks, and team activity"
      kpis={[
        { title: 'Active Projects', value: activeProjects.length, change: `${projects.length} total`, changeType: 'positive', icon: <FolderKanban className="h-5 w-5" /> },
        { title: 'Open Tasks', value: openTasks.length, change: `${overdueTasks.length} overdue`, changeType: overdueTasks.length > 0 ? 'warning' : 'positive', icon: <ListChecks className="h-5 w-5" /> },
        { title: 'Team Members', value: teamMembers.length, change: 'Active contributors', changeType: 'neutral', icon: <Users className="h-5 w-5" /> },
        { title: 'Active Sprint', value: activeSprint?.name || 'None', change: activeSprint ? `${activeSprint.completedPoints}/${activeSprint.totalPoints} pts` : '', changeType: activeSprint ? 'positive' : 'neutral', icon: <TrendingUp className="h-5 w-5" /> },
      ]}
    >
      <div className="space-y-6">
        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-medium mb-4">Task Status Distribution</h3>
            <DonutChartComponent data={taskStatusData} dataKey="value" nameKey="name" height={260} />
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-medium mb-4">Project Progress</h3>
            <BarChartComponent data={projectProgressData} dataKey="progress" xAxisKey="name" height={260} />
          </div>
        </div>

        {/* Active Projects + Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Projects list */}
          <div className="lg:col-span-2 rounded-lg border border-border bg-card">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-medium">Active Projects</h3>
              <span className="text-xs text-muted-foreground">{activeProjects.length} active</span>
            </div>
            <div className="divide-y divide-border">
              {activeProjects.slice(0, 6).map(project => {
                const projectTasks = tasks.filter(t => t.projectId === project.id);
                const done = projectTasks.filter(t => t.status === 'Closed').length;
                return (
                  <div key={project.id} className="p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded">{project.code}</span>
                        <span className="font-medium text-sm">{project.name}</span>
                      </div>
                      <StatusBadge type={project.status === 'Active' ? 'success' : project.status === 'At Risk' ? 'danger' : 'neutral'}>
                        {project.status}
                      </StatusBadge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{project.client}</span>
                      <span>{done}/{projectTasks.length} tasks done</span>
                      <span>{project.department}</span>
                    </div>
                    <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${project.progress}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity feed */}
          <div className="rounded-lg border border-border bg-card">
            <div className="p-4 border-b border-border">
              <h3 className="font-medium">Recent Activity</h3>
            </div>
            <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
              {activityFeed.slice(0, 10).map(entry => (
                <div key={entry.id} className="p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] text-primary">
                      {entry.user.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-xs font-medium">{entry.user}</span>
                  </div>
                  <p className="text-xs text-muted-foreground ml-8">{entry.action}</p>
                  <span className="text-[10px] text-muted-foreground ml-8">{entry.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Overdue + Milestones */}
        {overdueTasks.length > 0 && (
          <div className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20 p-4">
            <h3 className="font-medium flex items-center gap-2 mb-3 text-red-700 dark:text-red-400">
              <AlertTriangle className="h-4 w-4" />
              Overdue Tasks ({overdueTasks.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {overdueTasks.slice(0, 6).map(task => (
                <div key={task.id} className="rounded bg-card border border-border p-3">
                  <p className="text-sm font-medium truncate">{task.title}</p>
                  <p className="text-xs text-muted-foreground">{task.assigneeName} • Due: {task.dueDate}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Milestones */}
        <div className="rounded-lg border border-border bg-card">
          <div className="p-4 border-b border-border">
            <h3 className="font-medium flex items-center gap-2">
              <Milestone className="h-4 w-4" />
              Upcoming Milestones
            </h3>
          </div>
          <div className="divide-y divide-border">
            {milestones.filter(m => m.status !== 'Completed').slice(0, 5).map(ms => (
              <div key={ms.id} className="flex items-center gap-4 p-4">
                <div className={`h-3 w-3 rounded-full ${ms.status === 'Overdue' ? 'bg-red-500' : ms.status === 'In Progress' ? 'bg-blue-500' : 'bg-gray-300'}`} />
                <div className="flex-1">
                  <span className="font-medium text-sm">{ms.title}</span>
                  <p className="text-xs text-muted-foreground">Due: {ms.dueDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${ms.progress}%` }} />
                  </div>
                  <span className="text-xs tabular-nums">{ms.progress}%</span>
                </div>
                <StatusBadge type={ms.status === 'Overdue' ? 'danger' : ms.status === 'In Progress' ? 'info' : 'neutral'}>
                  {ms.status}
                </StatusBadge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
