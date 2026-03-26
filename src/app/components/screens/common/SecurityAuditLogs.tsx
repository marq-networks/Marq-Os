import { useState, useEffect, useMemo } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { DataTable } from '../../shared/DataTable';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { useAnalyticsData } from '../../../services/hooks';
import {
  FileText, Search, Download, X, Filter, Clock, Shield, AlertTriangle,
} from 'lucide-react';
import type { ActivityLogEntry } from '../../../services/types';

const TYPE_BADGE: Record<string, 'success' | 'info' | 'warning' | 'neutral' | 'danger'> = {
  task: 'success', project: 'info', leave: 'warning', employee: 'info',
  finance: 'neutral', system: 'danger',
};

export function SecurityAuditLogs() {
  const { getActivityLog } = useAnalyticsData();
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    setLoading(true);
    getActivityLog().then(data => { setLogs(data); setLoading(false); }).catch(() => setLoading(false));
  }, [getActivityLog]);

  const filtered = useMemo(() => {
    return logs.filter(entry => {
      const matchSearch = !search ||
        entry.userName.toLowerCase().includes(search.toLowerCase()) ||
        entry.action.toLowerCase().includes(search.toLowerCase()) ||
        entry.target.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === 'all' || entry.targetType === typeFilter;
      return matchSearch && matchType;
    });
  }, [logs, search, typeFilter]);

  const columns = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      cell: (val: string) => (
        <div className="text-sm">
          <div>{new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
          <div className="text-xs text-muted-foreground">{new Date(val).toLocaleTimeString()}</div>
        </div>
      ),
    },
    {
      key: 'userName',
      header: 'User',
      cell: (_: any, row: ActivityLogEntry) => (
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary">
            {row.userName.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="text-sm font-medium">{row.userName}</div>
            <div className="text-xs text-muted-foreground font-mono">{row.userId}</div>
          </div>
        </div>
      ),
    },
    { key: 'action', header: 'Action', cell: (val: string) => <span className="text-sm">{val}</span> },
    {
      key: 'target',
      header: 'Target',
      cell: (val: string) => <span className="text-sm font-medium">{val}</span>,
    },
    {
      key: 'targetType',
      header: 'Type',
      cell: (val: string) => <StatusBadge type={TYPE_BADGE[val] || 'neutral'}>{val}</StatusBadge>,
    },
    {
      key: 'ip',
      header: 'IP Address',
      cell: (val: string) => <span className="text-xs font-mono text-muted-foreground">{val || '—'}</span>,
    },
  ];

  const types = [...new Set(logs.map(l => l.targetType))];

  return (
    <PageLayout
      title="Audit Logs"
      description="Comprehensive audit trail of all system events and user actions"
      actions={
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export Logs
        </Button>
      }
      kpis={[
        { title: 'Total Events', value: logs.length, change: 'All recorded', changeType: 'neutral', icon: <FileText className="h-5 w-5" /> },
        { title: 'System Events', value: logs.filter(l => l.targetType === 'system').length, change: 'Critical events', changeType: 'info', icon: <Shield className="h-5 w-5" /> },
        { title: 'Users Active', value: [...new Set(logs.map(l => l.userId))].length, change: 'Unique actors', changeType: 'neutral', icon: <AlertTriangle className="h-5 w-5" /> },
        { title: 'Latest Event', value: logs.length > 0 ? new Date(logs[0].timestamp).toLocaleTimeString() : '—', change: 'Most recent', changeType: 'neutral', icon: <Clock className="h-5 w-5" /> },
      ]}
    >
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search audit logs..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">All Event Types</option>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        {(search || typeFilter !== 'all') && (
          <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setTypeFilter('all'); }}>
            <X className="h-4 w-4 mr-1" /> Clear
          </Button>
        )}
        <span className="ml-auto text-sm text-muted-foreground">{filtered.length} events</span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => <div key={i} className="h-14 bg-muted animate-pulse rounded-lg" />)}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          pagination={{
            page: 1, pageSize: 20, total: filtered.length, onPageChange: () => {},
          }}
        />
      )}
    </PageLayout>
  );
}
