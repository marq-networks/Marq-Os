import { useState, useMemo } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { useExecutionOS } from '../../../contexts/ExecutionOSContext';
import {
  FolderKanban, Search, Plus, X, Grid3X3, List, DollarSign,
  Calendar, Users, TrendingUp,
} from 'lucide-react';
import { PRIORITY_CONFIG, PROJECT_COLORS } from '../work/workTypes';

const STATUS_TYPE: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
  Active: 'success', 'On Hold': 'warning', 'At Risk': 'danger', Completed: 'info', Cancelled: 'neutral',
};

export function WorkProjects() {
  const { projects, tasks, createProject } = useExecutionOS();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const filtered = useMemo(() => {
    return projects.filter(p => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [projects, search, statusFilter]);

  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
  const totalSpent = projects.reduce((s, p) => s + p.spent, 0);
  const avgProgress = projects.length > 0 ? Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length) : 0;

  const formatCurrency = (v: number) => `$${(v / 1000).toFixed(0)}K`;

  return (
    <PageLayout
      title="Projects"
      description="View and manage all projects across the organization"
      actions={
        <Button size="sm" onClick={() => createProject({ name: 'New Project', code: 'NP-001', client: 'Internal', department: 'Engineering', status: 'Active', priority: 'Medium', startDate: '2026-03-04', endDate: '2026-06-30', progress: 0, budget: 50000, spent: 0, burnRate: 0, profitRisk: 'None', team: [], sprintIds: [], milestoneIds: [] })}>
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      }
      kpis={[
        { title: 'Total Projects', value: projects.length, change: `${projects.filter(p => p.status === 'Active').length} active`, changeType: 'positive', icon: <FolderKanban className="h-5 w-5" /> },
        { title: 'Avg Progress', value: `${avgProgress}%`, changeType: avgProgress >= 50 ? 'positive' : 'warning', icon: <TrendingUp className="h-5 w-5" /> },
        { title: 'Total Budget', value: formatCurrency(totalBudget), change: `${formatCurrency(totalSpent)} spent`, changeType: totalSpent <= totalBudget * 0.8 ? 'positive' : 'warning', icon: <DollarSign className="h-5 w-5" /> },
        { title: 'Team Members', value: [...new Set(projects.flatMap(p => p.team))].length, changeType: 'neutral', icon: <Users className="h-5 w-5" /> },
      ]}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
          <option value="all">All Statuses</option>
          {['Active', 'On Hold', 'At Risk', 'Completed', 'Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {(search || statusFilter !== 'all') && (
          <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setStatusFilter('all'); }}>
            <X className="h-4 w-4 mr-1" /> Clear
          </Button>
        )}
        <div className="ml-auto flex border border-border rounded-md overflow-hidden">
          <button onClick={() => setView('grid')} className={`p-2 ${view === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button onClick={() => setView('list')} className={`p-2 ${view === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project, i) => {
            const projectTasks = tasks.filter(t => t.projectId === project.id);
            const closedTasks = projectTasks.filter(t => t.status === 'Closed').length;
            const color = PROJECT_COLORS[i % PROJECT_COLORS.length];
            const priorityCfg = PRIORITY_CONFIG[project.priority];
            return (
              <div key={project.id} className="rounded-lg border border-border bg-card overflow-hidden hover:shadow-sm transition-shadow">
                <div className="h-1.5" style={{ backgroundColor: color }} />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-xs font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded">{project.code}</span>
                      <h4 className="font-medium mt-1.5">{project.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{project.client} • {project.department}</p>
                    </div>
                    <StatusBadge type={STATUS_TYPE[project.status] || 'neutral'}>{project.status}</StatusBadge>
                  </div>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${project.progress}%`, backgroundColor: color }} />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded bg-muted/30 p-2">
                      <p className="text-xs text-muted-foreground">Tasks</p>
                      <p className="text-sm font-medium">{closedTasks}/{projectTasks.length}</p>
                    </div>
                    <div className="rounded bg-muted/30 p-2">
                      <p className="text-xs text-muted-foreground">Budget</p>
                      <p className="text-sm font-medium">{formatCurrency(project.budget)}</p>
                    </div>
                    <div className="rounded bg-muted/30 p-2">
                      <p className="text-xs text-muted-foreground">Team</p>
                      <p className="text-sm font-medium">{project.team.length}</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {project.startDate} → {project.endDate}</span>
                    <span className="inline-flex items-center gap-1" style={{ color: priorityCfg?.color }}>
                      {priorityCfg?.icon} {project.priority}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card divide-y divide-border">
          {filtered.map(project => {
            const projectTasks = tasks.filter(t => t.projectId === project.id);
            return (
              <div key={project.id} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
                <span className="text-xs font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded shrink-0">{project.code}</span>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-sm">{project.name}</span>
                  <p className="text-xs text-muted-foreground">{project.client} • {project.department}</p>
                </div>
                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${project.progress}%` }} />
                </div>
                <span className="text-xs tabular-nums w-10 text-right">{project.progress}%</span>
                <span className="text-xs text-muted-foreground w-16">{projectTasks.length} tasks</span>
                <span className="text-xs text-muted-foreground w-16">{formatCurrency(project.budget)}</span>
                <StatusBadge type={STATUS_TYPE[project.status] || 'neutral'}>{project.status}</StatusBadge>
              </div>
            );
          })}
        </div>
      )}
    </PageLayout>
  );
}
