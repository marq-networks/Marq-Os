import { useState, useMemo } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { useExecutionOS } from '../../../contexts/ExecutionOSContext';
import {
  Users, Search, X, UserCheck, AlertTriangle, BarChart3, Calendar,
} from 'lucide-react';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '../work/workTypes';

export function WorkAssignments() {
  const { tasks, teamMembers, projects } = useExecutionOS();
  const [search, setSearch] = useState('');
  const [memberFilter, setMemberFilter] = useState('all');

  // Group tasks by assignee
  const assigneeGroups = useMemo(() => {
    const groups: Record<string, { name: string; tasks: typeof tasks; role?: string }> = {};
    tasks.forEach(t => {
      const key = t.assigneeName || 'Unassigned';
      if (!groups[key]) {
        const member = teamMembers.find(m => m.name === t.assigneeName);
        groups[key] = { name: key, tasks: [], role: member?.role };
      }
      groups[key].tasks.push(t);
    });
    return Object.values(groups)
      .filter(g => {
        const matchSearch = !search || g.name.toLowerCase().includes(search.toLowerCase());
        const matchMember = memberFilter === 'all' || g.name === memberFilter;
        return matchSearch && matchMember;
      })
      .sort((a, b) => b.tasks.length - a.tasks.length);
  }, [tasks, teamMembers, search, memberFilter]);

  const totalAssigned = tasks.filter(t => t.assigneeName).length;
  const unassigned = tasks.filter(t => !t.assigneeName).length;
  const overloaded = assigneeGroups.filter(g => g.tasks.length > 8).length;
  const avgLoad = teamMembers.length > 0 ? Math.round(totalAssigned / teamMembers.length) : 0;

  return (
    <PageLayout
      title="Assignments"
      description="View task distribution and workload across team members"
      kpis={[
        { title: 'Team Members', value: teamMembers.length, change: `${totalAssigned} tasks assigned`, changeType: 'neutral', icon: <Users className="h-5 w-5" /> },
        { title: 'Avg Workload', value: `${avgLoad} tasks`, change: 'Per person', changeType: avgLoad <= 6 ? 'positive' : 'warning', icon: <BarChart3 className="h-5 w-5" /> },
        { title: 'Unassigned', value: unassigned, changeType: unassigned > 0 ? 'warning' : 'positive', icon: <AlertTriangle className="h-5 w-5" /> },
        { title: 'Overloaded', value: overloaded, change: '8+ tasks', changeType: overloaded > 0 ? 'danger' : 'positive', icon: <UserCheck className="h-5 w-5" /> },
      ]}
    >
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search team members..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select value={memberFilter} onChange={e => setMemberFilter(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
          <option value="all">All Members</option>
          {teamMembers.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
        </select>
        {(search || memberFilter !== 'all') && (
          <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setMemberFilter('all'); }}>
            <X className="h-4 w-4 mr-1" /> Clear
          </Button>
        )}
      </div>

      {/* Assignment Cards */}
      <div className="space-y-4">
        {assigneeGroups.map(group => {
          const openTasks = group.tasks.filter(t => t.status !== 'Closed');
          const closedTasks = group.tasks.filter(t => t.status === 'Closed');
          const overdueTasks = group.tasks.filter(t => t.status === 'Overdue');
          const isOverloaded = openTasks.length > 8;

          return (
            <div key={group.name} className={`rounded-lg border bg-card ${isOverloaded ? 'border-red-200 dark:border-red-900' : 'border-border'}`}>
              {/* Header */}
              <div className="flex items-center gap-4 p-4 border-b border-border">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm text-primary font-medium">
                  {group.name === 'Unassigned' ? '?' : group.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{group.name}</span>
                    {isOverloaded && <StatusBadge type="danger">Overloaded</StatusBadge>}
                  </div>
                  {group.role && <p className="text-xs text-muted-foreground">{group.role}</p>}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-center">
                    <p className="font-medium">{openTasks.length}</p>
                    <p className="text-xs text-muted-foreground">Open</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-green-600">{closedTasks.length}</p>
                    <p className="text-xs text-muted-foreground">Done</p>
                  </div>
                  {overdueTasks.length > 0 && (
                    <div className="text-center">
                      <p className="font-medium text-red-600">{overdueTasks.length}</p>
                      <p className="text-xs text-muted-foreground">Overdue</p>
                    </div>
                  )}
                </div>
                {/* Workload bar */}
                <div className="w-24">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isOverloaded ? 'bg-red-500' : openTasks.length > 5 ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${Math.min(100, (openTasks.length / 10) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground text-center mt-0.5">{openTasks.length}/10 capacity</p>
                </div>
              </div>

              {/* Task list */}
              <div className="divide-y divide-border">
                {group.tasks.slice(0, 5).map(task => {
                  const statusCfg = STATUS_CONFIG[task.status] || {};
                  const priorityCfg = PRIORITY_CONFIG[task.priority] || {};
                  return (
                    <div key={task.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30 transition-colors">
                      <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: priorityCfg.color || '#ccc' }} />
                      <span className="text-xs font-mono text-muted-foreground shrink-0">{task.id}</span>
                      <span className="text-sm flex-1 truncate">{task.title}</span>
                      {task.dueDate && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
                          <Calendar className="h-3 w-3" /> {task.dueDate}
                        </span>
                      )}
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs shrink-0" style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}>
                        {task.status}
                      </span>
                    </div>
                  );
                })}
                {group.tasks.length > 5 && (
                  <div className="px-4 py-2 text-center">
                    <span className="text-xs text-muted-foreground">+{group.tasks.length - 5} more tasks</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </PageLayout>
  );
}
