import { useMemo } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { BarChartComponent, DonutChartComponent, LineChartComponent } from '../../shared/Charts';
import { useExecutionOS } from '../../../contexts/ExecutionOSContext';
import {
  BarChart3, FolderKanban, ListChecks, Target, Users, TrendingUp, Clock,
} from 'lucide-react';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '../work/workTypes';

export function WorkReports() {
  const { tasks, projects, milestones, sprints, teamMembers } = useExecutionOS();

  // Task status distribution
  const taskStatusData = useMemo(() => {
    const counts: Record<string, number> = {};
    tasks.forEach(t => { counts[t.status] = (counts[t.status] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [tasks]);

  // Priority distribution
  const priorityData = useMemo(() => {
    const counts: Record<string, number> = {};
    tasks.forEach(t => { counts[t.priority] = (counts[t.priority] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [tasks]);

  // Tasks per project
  const projectTaskData = projects.slice(0, 8).map(p => ({
    name: p.code,
    total: tasks.filter(t => t.projectId === p.id).length,
    closed: tasks.filter(t => t.projectId === p.id && t.status === 'Closed').length,
  }));

  // Workload per team member
  const workloadData = teamMembers.slice(0, 8).map(m => ({
    name: m.name.split(' ')[0],
    tasks: tasks.filter(t => t.assigneeName === m.name && t.status !== 'Closed').length,
  }));

  // Sprint velocity (simulated)
  const velocityData = sprints.map(s => ({
    name: s.name.replace('Sprint ', 'S'),
    planned: s.totalPoints,
    completed: s.completedPoints,
  }));

  // Project progress
  const projectProgressData = projects.slice(0, 8).map(p => ({
    name: p.code,
    progress: p.progress,
  }));

  const closedTasks = tasks.filter(t => t.status === 'Closed').length;
  const completionRate = tasks.length > 0 ? Math.round((closedTasks / tasks.length) * 100) : 0;
  const overdueTasks = tasks.filter(t => t.status === 'Overdue').length;
  const totalStoryPoints = tasks.reduce((s, t) => s + (t.storyPoints || 0), 0);

  return (
    <PageLayout
      title="Work Reports"
      description="Project and task analytics, sprint velocity, and team workload reports"
      kpis={[
        { title: 'Completion Rate', value: `${completionRate}%`, change: `${closedTasks}/${tasks.length} tasks`, changeType: completionRate >= 50 ? 'positive' : 'warning', icon: <TrendingUp className="h-5 w-5" /> },
        { title: 'Overdue', value: overdueTasks, changeType: overdueTasks > 0 ? 'danger' : 'positive', icon: <Clock className="h-5 w-5" /> },
        { title: 'Story Points', value: totalStoryPoints, change: `${sprints.length} sprints`, changeType: 'neutral', icon: <Target className="h-5 w-5" /> },
        { title: 'Active Projects', value: projects.filter(p => p.status === 'Active').length, change: `${projects.length} total`, changeType: 'neutral', icon: <FolderKanban className="h-5 w-5" /> },
      ]}
    >
      <div className="space-y-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-medium mb-4">Task Status Distribution</h3>
            <DonutChartComponent data={taskStatusData} dataKey="value" nameKey="name" height={280} />
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-medium mb-4">Priority Distribution</h3>
            <DonutChartComponent data={priorityData} dataKey="value" nameKey="name" height={280} />
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-medium mb-4">Tasks per Project</h3>
            <BarChartComponent data={projectTaskData} dataKey="total" xAxisKey="name" height={280} />
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-medium mb-4">Team Workload (Open Tasks)</h3>
            <BarChartComponent data={workloadData} dataKey="tasks" xAxisKey="name" height={280} />
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-medium mb-4">Sprint Velocity</h3>
            {velocityData.length > 0 ? (
              <BarChartComponent data={velocityData} dataKey="completed" xAxisKey="name" height={280} />
            ) : (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground">No sprint data</div>
            )}
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-medium mb-4">Project Progress</h3>
            <BarChartComponent data={projectProgressData} dataKey="progress" xAxisKey="name" height={280} />
          </div>
        </div>

        {/* Summary Table */}
        <div className="rounded-lg border border-border bg-card">
          <div className="p-4 border-b border-border">
            <h3 className="font-medium">Project Summary</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Project</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Tasks</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Closed</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Overdue</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Progress</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Budget</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(p => {
                  const pTasks = tasks.filter(t => t.projectId === p.id);
                  const pClosed = pTasks.filter(t => t.status === 'Closed').length;
                  const pOverdue = pTasks.filter(t => t.status === 'Overdue').length;
                  return (
                    <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-primary">{p.code}</span>
                          <span className="text-sm font-medium">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-sm">{pTasks.length}</td>
                      <td className="px-4 py-3 text-center text-sm text-green-600">{pClosed}</td>
                      <td className="px-4 py-3 text-center text-sm text-red-600">{pOverdue}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${p.progress}%` }} />
                          </div>
                          <span className="text-xs tabular-nums">{p.progress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-xs text-muted-foreground">${(p.budget / 1000).toFixed(0)}K</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs ${
                          p.status === 'Active' ? 'bg-green-500/10 text-green-700' :
                          p.status === 'At Risk' ? 'bg-red-500/10 text-red-700' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
