/**
 * A07 - Sessions / Time Logs
 * Now wired to the Time Service for live CRUD data.
 */

import { PageLayout } from '../../shared/PageLayout';
import { DataTable } from '../../shared/DataTable';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { Clock, Users, RefreshCw } from 'lucide-react';
import { useTimeData } from '../../../services';

export function A07Sessions() {
  const { sessions, loading, refresh } = useTimeData();

  // Compute live KPIs from real data
  const activeSessions = sessions.filter(s => s.status === 'Active');
  const completedToday = sessions.filter(s => s.status === 'Completed' && s.date === new Date().toISOString().split('T')[0]);
  const totalMinutesToday = sessions
    .filter(s => s.date === new Date().toISOString().split('T')[0])
    .reduce((sum, s) => sum + s.totalMinutes, 0);
  const avgMinutes = completedToday.length > 0 ? Math.round(totalMinutesToday / completedToday.length) : 0;
  const avgHours = (avgMinutes / 60).toFixed(1);

  // Table data — map sessions to table-friendly format
  const tableData = sessions.map(s => ({
    id: s.id,
    employee: s.employeeName,
    department: s.department,
    date: s.date,
    checkIn: s.checkIn,
    checkOut: s.checkOut || '—',
    duration: s.duration,
    status: s.status,
  }));

  const columns = [
    { key: 'employee', header: 'Employee', width: '20%' },
    { key: 'department', header: 'Department', width: '15%' },
    { key: 'date', header: 'Date', width: '15%' },
    { key: 'checkIn', header: 'Check In', width: '12%' },
    { key: 'checkOut', header: 'Check Out', width: '12%' },
    { key: 'duration', header: 'Duration', width: '12%' },
    {
      key: 'status',
      header: 'Status',
      width: '14%',
      cell: (value: string) => (
        <StatusBadge type={value === 'Active' ? 'warning' : value === 'Completed' ? 'success' : 'neutral'}>
          {value}
        </StatusBadge>
      ),
    },
  ];

  return (
    <PageLayout
      title="Sessions / Time Logs"
      description="View and manage employee time sessions"
      actions={
        <Button variant="outline" size="sm" onClick={refresh} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      }
      kpis={[
        {
          title: 'Active Sessions',
          value: String(activeSessions.length),
          changeType: activeSessions.length > 0 ? 'positive' : 'neutral',
          icon: <Clock className="h-5 w-5" />,
        },
        {
          title: 'Total Today',
          value: `${Math.round(totalMinutesToday / 60)}h`,
          icon: <Clock className="h-5 w-5" />,
        },
        {
          title: 'Average Session',
          value: `${avgHours}h`,
          icon: <Clock className="h-5 w-5" />,
        },
        {
          title: 'Employees Logged',
          value: `${new Set(sessions.filter(s => s.date === new Date().toISOString().split('T')[0]).map(s => s.employeeId)).size}`,
          icon: <Users className="h-5 w-5" />,
        },
      ]}
    >
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="mb-4">Recent Sessions</h3>
        {loading ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">Loading sessions...</div>
        ) : (
          <DataTable columns={columns} data={tableData} />
        )}
      </div>
    </PageLayout>
  );
}
