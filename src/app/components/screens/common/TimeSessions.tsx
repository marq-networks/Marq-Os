import { useState, useMemo } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { DataTable } from '../../shared/DataTable';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { useTimeData } from '../../../services/hooks';
import {
  Clock, Search, Download, Calendar, Filter, X,
} from 'lucide-react';
import type { TimeSession } from '../../../services/types';

const STATUS_MAP: Record<string, 'success' | 'warning' | 'danger' | 'neutral' | 'info'> = {
  Active: 'success', Completed: 'info', Incomplete: 'warning', Manual: 'neutral',
};

export function TimeSessions() {
  const { sessions, loading } = useTimeData();
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => {
    return sessions.filter(s => {
      const matchSearch = !search ||
        s.employeeName.toLowerCase().includes(search.toLowerCase()) ||
        s.department.toLowerCase().includes(search.toLowerCase());
      const matchDate = !dateFilter || s.date === dateFilter;
      const matchStatus = statusFilter === 'all' || s.status === statusFilter;
      return matchSearch && matchDate && matchStatus;
    });
  }, [sessions, search, dateFilter, statusFilter]);

  const totalHours = sessions.filter(s => s.status === 'Completed').reduce((sum, s) => sum + s.totalMinutes, 0);
  const avgHours = sessions.filter(s => s.status === 'Completed').length > 0
    ? totalHours / sessions.filter(s => s.status === 'Completed').length
    : 0;

  const columns = [
    {
      key: 'employeeName',
      header: 'Employee',
      cell: (_: any, row: TimeSession) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary">
            {row.employeeName.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="font-medium text-sm">{row.employeeName}</div>
            <div className="text-xs text-muted-foreground">{row.department}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      cell: (val: string) => (
        <span className="text-sm">{new Date(val).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
      ),
    },
    { key: 'checkIn', header: 'Check In' },
    {
      key: 'checkOut',
      header: 'Check Out',
      cell: (val: string) => val || <span className="text-muted-foreground">—</span>,
    },
    {
      key: 'duration',
      header: 'Duration',
      cell: (val: string) => <span className="font-medium tabular-nums">{val}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (val: string) => (
        <StatusBadge type={STATUS_MAP[val] || 'neutral'}>{val}</StatusBadge>
      ),
    },
    {
      key: 'notes',
      header: 'Notes',
      cell: (val: string) => val ? (
        <span className="text-xs text-muted-foreground">{val}</span>
      ) : <span className="text-muted-foreground">—</span>,
    },
  ];

  return (
    <PageLayout
      title="Time Sessions"
      description="View and manage all employee time tracking sessions"
      actions={
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      }
      kpis={[
        { title: 'Total Sessions', value: sessions.length, change: `${sessions.filter(s => s.status === 'Active').length} active`, changeType: 'positive', icon: <Clock className="h-5 w-5" /> },
        { title: 'Total Hours', value: `${Math.floor(totalHours / 60)}h ${totalHours % 60}m`, change: 'All completed sessions', changeType: 'neutral', icon: <Clock className="h-5 w-5" /> },
        { title: 'Avg Session', value: `${Math.floor(avgHours / 60)}h ${Math.round(avgHours % 60)}m`, change: 'Per completed session', changeType: 'neutral', icon: <Clock className="h-5 w-5" /> },
        { title: 'Incomplete', value: sessions.filter(s => s.status === 'Incomplete').length, change: 'Need attention', changeType: sessions.filter(s => s.status === 'Incomplete').length > 0 ? 'warning' : 'neutral', icon: <Clock className="h-5 w-5" /> },
      ]}
    >
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by employee or department..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="date"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            className="pl-9 w-[180px]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
          <option value="Incomplete">Incomplete</option>
          <option value="Manual">Manual</option>
        </select>
        {(search || dateFilter || statusFilter !== 'all') && (
          <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setDateFilter(''); setStatusFilter('all'); }}>
            <X className="h-4 w-4 mr-1" /> Clear
          </Button>
        )}
        <span className="ml-auto text-sm text-muted-foreground">{filtered.length} sessions</span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          pagination={{
            page: 1,
            pageSize: 20,
            total: filtered.length,
            onPageChange: () => {},
          }}
        />
      )}
    </PageLayout>
  );
}
