import { useState, useEffect, useMemo } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { useAnalyticsData } from '../../../services/hooks';
import {
  Activity, Search, Filter, X, FileText, GitPullRequest, Calendar, Users, DollarSign, Settings,
} from 'lucide-react';
import type { ActivityLogEntry } from '../../../services/types';

const TYPE_ICONS: Record<string, typeof Activity> = {
  task: GitPullRequest, project: FileText, leave: Calendar,
  employee: Users, finance: DollarSign, system: Settings,
};

const TYPE_COLOR: Record<string, string> = {
  task: 'bg-green-500/10 text-green-600', project: 'bg-blue-500/10 text-blue-600',
  leave: 'bg-yellow-500/10 text-yellow-600', employee: 'bg-purple-500/10 text-purple-600',
  finance: 'bg-emerald-500/10 text-emerald-600', system: 'bg-gray-500/10 text-gray-600',
};

export function AnalyticsActivityOverview() {
  const { getActivityLog } = useAnalyticsData();
  const [log, setLog] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    setLoading(true);
    getActivityLog().then(data => { setLog(data); setLoading(false); }).catch(() => setLoading(false));
  }, [getActivityLog]);

  const filtered = useMemo(() => {
    return log.filter(entry => {
      const matchSearch = !search ||
        entry.userName.toLowerCase().includes(search.toLowerCase()) ||
        entry.action.toLowerCase().includes(search.toLowerCase()) ||
        entry.target.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === 'all' || entry.targetType === typeFilter;
      return matchSearch && matchType;
    });
  }, [log, search, typeFilter]);

  // Group by date
  const grouped = useMemo(() => {
    const groups: Record<string, ActivityLogEntry[]> = {};
    filtered.forEach(entry => {
      const date = new Date(entry.timestamp).toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(entry);
    });
    return Object.entries(groups);
  }, [filtered]);

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    log.forEach(e => { counts[e.targetType] = (counts[e.targetType] || 0) + 1; });
    return counts;
  }, [log]);

  return (
    <PageLayout
      title="Activity Overview"
      description="Comprehensive timeline of all organization activity and events"
      kpis={[
        { title: 'Total Events', value: log.length, change: 'All recorded', changeType: 'neutral', icon: <Activity className="h-5 w-5" /> },
        { title: 'Task Events', value: typeCounts.task || 0, changeType: 'positive', icon: <GitPullRequest className="h-5 w-5" /> },
        { title: 'System Events', value: typeCounts.system || 0, changeType: 'neutral', icon: <Settings className="h-5 w-5" /> },
        { title: 'Users Active', value: [...new Set(log.map(e => e.userId))].length, change: 'Unique users', changeType: 'positive', icon: <Users className="h-5 w-5" /> },
      ]}
    >
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search activity..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">All Types</option>
          <option value="task">Tasks</option>
          <option value="project">Projects</option>
          <option value="leave">Leave</option>
          <option value="employee">Employees</option>
          <option value="finance">Finance</option>
          <option value="system">System</option>
        </select>
        {(search || typeFilter !== 'all') && (
          <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setTypeFilter('all'); }}>
            <X className="h-4 w-4 mr-1" /> Clear
          </Button>
        )}
      </div>

      {/* Type breakdown chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(typeCounts).map(([type, count]) => {
          const Icon = TYPE_ICONS[type] || Activity;
          return (
            <button
              key={type}
              onClick={() => setTypeFilter(typeFilter === type ? 'all' : type)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors ${
                typeFilter === type ? 'bg-primary text-primary-foreground' : TYPE_COLOR[type] || 'bg-muted'
              }`}
            >
              <Icon className="h-3 w-3" />
              {type} ({count})
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />)}
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(([date, entries]) => (
            <div key={date}>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">{date}</h3>
              <div className="space-y-1">
                {entries.map((entry, i) => {
                  const Icon = TYPE_ICONS[entry.targetType] || Activity;
                  return (
                    <div key={entry.id} className="flex gap-4 group">
                      {/* Timeline dot */}
                      <div className="flex flex-col items-center">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${TYPE_COLOR[entry.targetType] || 'bg-muted'}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        {i < entries.length - 1 && <div className="w-px flex-1 bg-border" />}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="rounded-lg border border-border bg-card p-4 hover:shadow-sm transition-shadow">
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="font-medium text-sm">{entry.userName}</span>
                              <span className="text-sm text-muted-foreground"> {entry.action} </span>
                              <span className="text-sm font-medium">{entry.target}</span>
                            </div>
                            <StatusBadge type={entry.targetType === 'task' ? 'success' : entry.targetType === 'system' ? 'info' : 'neutral'}>
                              {entry.targetType}
                            </StatusBadge>
                          </div>
                          <div className="text-xs text-muted-foreground mt-2">
                            {new Date(entry.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            {entry.ip && ` • IP: ${entry.ip}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
