import { useState, useMemo } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { useExecutionOS } from '../../../contexts/ExecutionOSContext';
import {
  Milestone as MilestoneIcon, Search, X, Calendar, CheckCircle2, AlertTriangle, Clock, Target,
} from 'lucide-react';
import type { MilestoneStatus } from '../work/workTypes';

const STATUS_TYPE: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
  'Not Started': 'neutral', 'In Progress': 'info', Completed: 'success', Overdue: 'danger',
};

export function WorkMilestones() {
  const { milestones, projects, tasks } = useExecutionOS();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => {
    return milestones.filter(m => {
      const matchSearch = !search || m.title.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || m.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [milestones, search, statusFilter]);

  const completed = milestones.filter(m => m.status === 'Completed').length;
  const overdue = milestones.filter(m => m.status === 'Overdue').length;
  const inProgress = milestones.filter(m => m.status === 'In Progress').length;
  const avgProgress = milestones.length > 0 ? Math.round(milestones.reduce((s, m) => s + m.progress, 0) / milestones.length) : 0;

  return (
    <PageLayout
      title="Milestones"
      description="Track project milestones, deliverables, and key deadlines"
      kpis={[
        { title: 'Total Milestones', value: milestones.length, changeType: 'neutral', icon: <Target className="h-5 w-5" /> },
        { title: 'In Progress', value: inProgress, changeType: 'positive', icon: <Clock className="h-5 w-5" /> },
        { title: 'Completed', value: completed, change: `${Math.round((completed / milestones.length) * 100)}%`, changeType: 'positive', icon: <CheckCircle2 className="h-5 w-5" /> },
        { title: 'Overdue', value: overdue, changeType: overdue > 0 ? 'danger' : 'positive', icon: <AlertTriangle className="h-5 w-5" /> },
      ]}
    >
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search milestones..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
          <option value="all">All Statuses</option>
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Overdue">Overdue</option>
        </select>
        {(search || statusFilter !== 'all') && (
          <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setStatusFilter('all'); }}>
            <X className="h-4 w-4 mr-1" /> Clear
          </Button>
        )}
      </div>

      {/* Milestone Cards */}
      <div className="space-y-4">
        {filtered.map(milestone => {
          const project = projects.find(p => p.id === milestone.projectId);
          const milestoneTasks = tasks.filter(t => milestone.taskIds.includes(t.id));
          const closedTasks = milestoneTasks.filter(t => t.status === 'Closed').length;
          return (
            <div key={milestone.id} className={`rounded-lg border bg-card p-5 ${
              milestone.status === 'Overdue' ? 'border-red-200 dark:border-red-900' : 'border-border'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    milestone.status === 'Completed' ? 'bg-green-500/10 text-green-600' :
                    milestone.status === 'Overdue' ? 'bg-red-500/10 text-red-600' :
                    milestone.status === 'In Progress' ? 'bg-blue-500/10 text-blue-600' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    <MilestoneIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">{milestone.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {project?.name || 'Unknown Project'} • {project?.code || ''}
                    </p>
                  </div>
                </div>
                <StatusBadge type={STATUS_TYPE[milestone.status] || 'neutral'}>{milestone.status}</StatusBadge>
              </div>

              {milestone.description && (
                <p className="text-sm text-muted-foreground mb-4">{milestone.description}</p>
              )}

              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{milestone.progress}%</span>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      milestone.status === 'Completed' ? 'bg-green-500' :
                      milestone.status === 'Overdue' ? 'bg-red-500' : 'bg-primary'
                    }`}
                    style={{ width: `${milestone.progress}%` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">Due Date</p>
                  <p className="text-sm font-medium flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {milestone.dueDate}
                  </p>
                </div>
                <div className="rounded bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">Tasks</p>
                  <p className="text-sm font-medium">{closedTasks}/{milestoneTasks.length} done</p>
                </div>
                <div className="rounded bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">Deliverables</p>
                  <p className="text-sm font-medium">{milestone.deliverables?.length || 0}</p>
                </div>
                <div className="rounded bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">Owner</p>
                  <p className="text-sm font-medium">{milestone.owner || '—'}</p>
                </div>
              </div>

              {/* Deliverables */}
              {milestone.deliverables && milestone.deliverables.length > 0 && (
                <div className="mt-4 pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">Deliverables</p>
                  <div className="flex flex-wrap gap-2">
                    {milestone.deliverables.map((d, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-md text-xs">
                        <CheckCircle2 className="h-3 w-3 text-green-500" /> {d}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </PageLayout>
  );
}
