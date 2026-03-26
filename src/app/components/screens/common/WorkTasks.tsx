import { useState, useMemo } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { StatusBadge } from '../../shared/StatusBadge';
import { DataTable } from '../../shared/DataTable';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { useExecutionOS } from '../../../contexts/ExecutionOSContext';
import {
  ListChecks, Search, Plus, X, Filter, Calendar, Clock, CheckCircle2, AlertTriangle,
} from 'lucide-react';
import { STATUS_CONFIG, PRIORITY_CONFIG, ALL_STATUSES } from '../work/workTypes';
import type { Task } from '../work/workMockData';

export function WorkTasks() {
  const { tasks, changeTaskStatus, createTask, projects } = useExecutionOS();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');

  const filtered = useMemo(() => {
    return tasks.filter(t => {
      const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || t.status === statusFilter;
      const matchPriority = priorityFilter === 'all' || t.priority === priorityFilter;
      const matchProject = projectFilter === 'all' || t.projectId === projectFilter;
      return matchSearch && matchStatus && matchPriority && matchProject;
    });
  }, [tasks, search, statusFilter, priorityFilter, projectFilter]);

  const openCount = tasks.filter(t => t.status !== 'Closed').length;
  const overdueCount = tasks.filter(t => t.status === 'Overdue').length;
  const closedCount = tasks.filter(t => t.status === 'Closed').length;

  const columns = [
    {
      key: 'id',
      header: 'ID',
      cell: (val: string) => <span className="text-xs font-mono text-primary">{val}</span>,
    },
    {
      key: 'title',
      header: 'Task',
      cell: (_: any, row: Task) => (
        <div>
          <span className="font-medium text-sm">{row.title}</span>
          <p className="text-xs text-muted-foreground mt-0.5">{row.projectName || 'Unassigned'}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (val: string, row: Task) => {
        const cfg = STATUS_CONFIG[val] || {};
        return (
          <select
            value={val}
            onChange={e => changeTaskStatus(row.id, e.target.value as any)}
            className="h-7 text-xs rounded border-0 px-2 py-0.5 font-medium"
            style={{ backgroundColor: cfg.bg, color: cfg.color }}
          >
            {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        );
      },
    },
    {
      key: 'priority',
      header: 'Priority',
      cell: (val: string) => {
        const cfg = PRIORITY_CONFIG[val] || {};
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: cfg.color }}>
            {cfg.icon} {val}
          </span>
        );
      },
    },
    {
      key: 'assigneeName',
      header: 'Assignee',
      cell: (val: string) => val ? (
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] text-primary">
            {val.split(' ').map(n => n[0]).join('')}
          </div>
          <span className="text-sm">{val}</span>
        </div>
      ) : <span className="text-xs text-muted-foreground">Unassigned</span>,
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      cell: (val: string) => val ? (
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Calendar className="h-3 w-3" /> {val}
        </span>
      ) : <span className="text-xs text-muted-foreground">—</span>,
    },
    {
      key: 'storyPoints',
      header: 'Points',
      cell: (val: number) => <span className="text-xs tabular-nums">{val || '—'}</span>,
    },
  ];

  return (
    <PageLayout
      title="Tasks"
      description="Manage all tasks across projects with filters and bulk actions"
      actions={
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" /> New Task
        </Button>
      }
      kpis={[
        { title: 'Total Tasks', value: tasks.length, change: `${openCount} open`, changeType: 'neutral', icon: <ListChecks className="h-5 w-5" /> },
        { title: 'In Progress', value: tasks.filter(t => t.status === 'In Progress').length, changeType: 'positive', icon: <Clock className="h-5 w-5" /> },
        { title: 'Completed', value: closedCount, change: `${Math.round((closedCount / tasks.length) * 100)}%`, changeType: 'positive', icon: <CheckCircle2 className="h-5 w-5" /> },
        { title: 'Overdue', value: overdueCount, changeType: overdueCount > 0 ? 'danger' : 'positive', icon: <AlertTriangle className="h-5 w-5" /> },
      ]}
    >
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
          <option value="all">All Statuses</option>
          {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
          <option value="all">All Priorities</option>
          {Object.keys(PRIORITY_CONFIG).map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={projectFilter} onChange={e => setProjectFilter(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
          <option value="all">All Projects</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        {(search || statusFilter !== 'all' || priorityFilter !== 'all' || projectFilter !== 'all') && (
          <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setStatusFilter('all'); setPriorityFilter('all'); setProjectFilter('all'); }}>
            <X className="h-4 w-4 mr-1" /> Clear
          </Button>
        )}
        <span className="ml-auto text-sm text-muted-foreground">{filtered.length} tasks</span>
      </div>

      <DataTable columns={columns} data={filtered} />
    </PageLayout>
  );
}
