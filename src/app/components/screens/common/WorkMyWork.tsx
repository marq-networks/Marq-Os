import { useState, useMemo } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { useExecutionOS } from '../../../contexts/ExecutionOSContext';
import {
  ListChecks, Search, Filter, X, Clock, CheckCircle2, AlertTriangle,
  Calendar, ArrowUpDown,
} from 'lucide-react';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '../work/workTypes';
import type { Task } from '../work/workMockData';

export function WorkMyWork() {
  const { tasks, changeTaskStatus } = useExecutionOS();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tab, setTab] = useState<'assigned' | 'created' | 'all'>('assigned');

  // Simulate current user
  const currentUser = 'Sarah Johnson';

  const myTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchTab = tab === 'all' || (tab === 'assigned' ? t.assigneeName === currentUser : t.createdBy === currentUser);
      const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || t.status === statusFilter;
      return matchTab && matchSearch && matchStatus;
    });
  }, [tasks, tab, search, statusFilter]);

  const overdue = myTasks.filter(t => t.status === 'Overdue');
  const inProgress = myTasks.filter(t => t.status === 'In Progress');
  const completed = myTasks.filter(t => t.status === 'Closed');

  const handleStatusChange = (taskId: string, status: string) => {
    changeTaskStatus(taskId, status as any);
  };

  return (
    <PageLayout
      title="My Work"
      description={`Tasks and assignments for ${currentUser}`}
      kpis={[
        { title: 'My Tasks', value: myTasks.length, change: 'Assigned to you', changeType: 'neutral', icon: <ListChecks className="h-5 w-5" /> },
        { title: 'In Progress', value: inProgress.length, change: 'Active now', changeType: 'positive', icon: <Clock className="h-5 w-5" /> },
        { title: 'Completed', value: completed.length, change: 'Done', changeType: 'positive', icon: <CheckCircle2 className="h-5 w-5" /> },
        { title: 'Overdue', value: overdue.length, change: overdue.length > 0 ? 'Needs attention' : 'All clear', changeType: overdue.length > 0 ? 'danger' : 'positive', icon: <AlertTriangle className="h-5 w-5" /> },
      ]}
    >
      {/* Tab bar */}
      <div className="flex items-center gap-1 mb-4 border-b border-border">
        {(['assigned', 'created', 'all'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm border-b-2 transition-colors ${
              tab === t ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t === 'assigned' ? 'Assigned to Me' : t === 'created' ? 'Created by Me' : 'All Tasks'}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">All Statuses</option>
          {Object.keys(STATUS_CONFIG).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {(search || statusFilter !== 'all') && (
          <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setStatusFilter('all'); }}>
            <X className="h-4 w-4 mr-1" /> Clear
          </Button>
        )}
        <span className="ml-auto text-sm text-muted-foreground">{myTasks.length} tasks</span>
      </div>

      {/* Task List */}
      <div className="rounded-lg border border-border bg-card divide-y divide-border">
        {myTasks.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <ListChecks className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No tasks found</p>
            <p className="text-sm mt-1">Adjust your filters or check back later.</p>
          </div>
        ) : (
          myTasks.map(task => {
            const statusCfg = STATUS_CONFIG[task.status] || { color: '#888', bg: '#f3f4f6' };
            const priorityCfg = PRIORITY_CONFIG[task.priority] || {};
            return (
              <div key={task.id} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
                {/* Priority indicator */}
                <div
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: priorityCfg.color || '#ccc' }}
                  title={task.priority}
                />

                {/* Task info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-mono text-muted-foreground">{task.id}</span>
                    <span className="font-medium text-sm truncate">{task.title}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{task.projectName || 'No project'}</span>
                    {task.sprintName && <span>{task.sprintName}</span>}
                    {task.dueDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {task.dueDate}
                      </span>
                    )}
                  </div>
                </div>

                {/* Assignee */}
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] text-primary shrink-0" title={task.assigneeName}>
                  {task.assigneeName?.split(' ').map(n => n[0]).join('')}
                </div>

                {/* Status */}
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shrink-0"
                  style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}
                >
                  {task.status}
                </span>

                {/* Quick status change */}
                <select
                  value={task.status}
                  onChange={e => handleStatusChange(task.id, e.target.value)}
                  className="h-7 text-xs rounded border border-input bg-background px-1.5 shrink-0"
                >
                  {Object.keys(STATUS_CONFIG).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            );
          })
        )}
      </div>
    </PageLayout>
  );
}
