/**
 * E04 - Employee Time Logs
 * Wired to service layer: useTimeData() → sessions filtered to current employee (e1)
 */
import { useState } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { DataTable } from '../../shared/DataTable';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import {
  Clock,
  Calendar,
  Download,
  Filter,
  Search,
  X,
  CheckCircle,
  TrendingUp,
  CalendarDays,
  RefreshCw,
} from 'lucide-react';
import { useTimeData } from '../../../services';
import type { TimeSession } from '../../../services';
import { toast } from 'sonner';

const CURRENT_EMPLOYEE_ID = 'e1'; // Sarah Johnson

export function E04TimeLogs() {
  const { sessions, loading, refresh } = useTimeData();

  // Filter to current employee's sessions
  const mySessions = sessions.filter(s => s.employeeId === CURRENT_EMPLOYEE_ID);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDateRange, setFilterDateRange] = useState('all');
  const [filterMonth, setFilterMonth] = useState('all');
  const [showExportSuccess, setShowExportSuccess] = useState(false);

  const resetFilters = () => {
    setSearchQuery('');
    setFilterStatus('all');
    setFilterDateRange('all');
    setFilterMonth('all');
    toast.info('All filters cleared');
  };

  const handleExportToCSV = () => {
    try {
      const headers = ['Date', 'Check In', 'Check Out', 'Duration', 'Status'];
      const csvData = filteredLogs.map(log => [
        log.date,
        log.checkIn,
        log.checkOut || '—',
        log.duration,
        log.status,
      ]);
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.map(cell => `"${cell}"`).join(',')),
      ].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `time_logs_${new Date().toISOString().split('T')[0]}.csv`;
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setShowExportSuccess(true);
      setTimeout(() => setShowExportSuccess(false), 3000);
      toast.success(`Exported ${filteredLogs.length} time logs to CSV`);
    } catch {
      toast.error('Export failed. Please try again.');
    }
  };

  const filteredLogs = mySessions.filter(log => {
    const matchesSearch =
      searchQuery === '' ||
      log.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.checkIn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.checkOut || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;

    let matchesMonth = true;
    if (filterMonth !== 'all') {
      const logDate = new Date(log.date);
      matchesMonth = logDate.getMonth() === parseInt(filterMonth);
    }

    let matchesDateRange = true;
    if (filterDateRange !== 'all') {
      const logDate = new Date(log.date);
      const today = new Date();
      const diffDays = Math.ceil((today.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
      if (filterDateRange === 'week') matchesDateRange = diffDays <= 7;
      else if (filterDateRange === 'month') matchesDateRange = diffDays <= 30;
      else if (filterDateRange === 'quarter') matchesDateRange = diffDays <= 90;
    }

    return matchesSearch && matchesStatus && matchesMonth && matchesDateRange;
  });

  // Compute stats from service data
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const thisMonthLogs = mySessions.filter(s => {
    const d = new Date(s.date);
    return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  });
  const thisWeekLogs = mySessions.filter(s => {
    const diffDays = Math.ceil((today.getTime() - new Date(s.date).getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  });

  const toHoursStr = (sessions: TimeSession[]): string => {
    const total = sessions.filter(s => s.status === 'Completed').reduce((s, t) => s + t.totalMinutes, 0);
    return `${Math.floor(total / 60)}h ${total % 60}m`;
  };

  const avgMins =
    thisMonthLogs.length > 0
      ? thisMonthLogs.filter(s => s.status === 'Completed').reduce((s, t) => s + t.totalMinutes, 0) /
        Math.max(1, thisMonthLogs.filter(s => s.status === 'Completed').length)
      : 0;
  const avgDaily = `${Math.floor(avgMins / 60)}h ${Math.floor(avgMins % 60)}m`;
  const attendance = Math.round((thisMonthLogs.length / 22) * 100);

  const statusTyp = (s: string) => {
    if (s === 'Completed') return 'success';
    if (s === 'Active') return 'warning';
    return 'neutral';
  };

  const columns = [
    {
      key: 'date',
      header: 'Date',
      width: '20%',
      cell: (value: string) => (
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: 'checkIn',
      header: 'Check In',
      width: '15%',
      cell: (value: string) => <span className="text-sm font-medium text-green-600 dark:text-green-400">{value}</span>,
    },
    {
      key: 'checkOut',
      header: 'Check Out',
      width: '15%',
      cell: (value: string) => (
        <span className={`text-sm font-medium ${value && value !== '—' ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'}`}>
          {value || '—'}
        </span>
      ),
    },
    {
      key: 'duration',
      header: 'Duration',
      width: '15%',
      cell: (value: string) => (
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold">{value}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '35%',
      cell: (value: string) => (
        <StatusBadge type={statusTyp(value) as any}>
          {value === 'Completed' && <CheckCircle className="h-3 w-3 mr-1" />}
          {value}
        </StatusBadge>
      ),
    },
  ];

  const tableData = filteredLogs.map(s => ({
    id: s.id,
    date: s.date,
    checkIn: s.checkIn,
    checkOut: s.checkOut || '—',
    duration: s.duration,
    status: s.status,
  }));

  const hasActiveFilters =
    searchQuery !== '' || filterStatus !== 'all' || filterDateRange !== 'all' || filterMonth !== 'all';

  return (
    <PageLayout
      title="EMPLOYEE – E-04 – Time Logs – v3.0 [Service Layer ✓]"
      description="Your attendance and time tracking history — live data from Time service"
      actions={
        <>
          <Button variant="outline" size="sm" onClick={refresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsFilterOpen(!isFilterOpen)}>
            <Filter className="mr-2 h-4 w-4" />
            {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
            {hasActiveFilters && (
              <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {[searchQuery !== '', filterStatus !== 'all', filterDateRange !== 'all', filterMonth !== 'all'].filter(Boolean).length}
              </span>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </>
      }
      kpis={[
        {
          title: 'This Month',
          value: toHoursStr(thisMonthLogs),
          change: `${thisMonthLogs.length} sessions`,
          changeType: 'positive',
          icon: <Clock className="h-5 w-5" />,
        },
        {
          title: 'This Week',
          value: toHoursStr(thisWeekLogs),
          change: `${thisWeekLogs.length} sessions`,
          changeType: 'positive',
          icon: <Calendar className="h-5 w-5" />,
        },
        {
          title: 'Average Daily',
          value: avgDaily,
          change: `${thisMonthLogs.length} days tracked`,
          changeType: 'positive',
          icon: <TrendingUp className="h-5 w-5" />,
        },
        {
          title: 'Attendance',
          value: `${attendance}%`,
          change: 'This month',
          changeType: 'positive',
          icon: <CheckCircle className="h-5 w-5" />,
        },
      ]}
    >
      {showExportSuccess && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800 p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-medium text-green-900 dark:text-green-100">
              Successfully exported {filteredLogs.length} time logs!
            </span>
          </div>
        </div>
      )}

      {/* Filter Panel */}
      {isFilterOpen && (
        <div className="mb-6 rounded-lg border border-border bg-card p-6 shadow-lg animate-in slide-in-from-top">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Time Logs
            </h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsFilterOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  className="w-full rounded-md border border-border bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Incomplete">Incomplete</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date Range</label>
              <select
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={filterDateRange}
                onChange={e => setFilterDateRange(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="quarter">Last 90 Days</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Month</label>
              <select
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={filterMonth}
                onChange={e => setFilterMonth(e.target.value)}
              >
                <option value="all">All Months</option>
                {['January','February','March','April','May','June','July','August','September','October','November','December'].map((m, i) => (
                  <option key={m} value={i.toString()}>{m}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Time Logs Table */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            My Time Logs
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({tableData.length} {tableData.length === 1 ? 'log' : 'logs'})
            </span>
          </h3>
          {tableData.length !== mySessions.length && (
            <span className="text-sm text-muted-foreground">
              Filtered from {mySessions.length} total
            </span>
          )}
        </div>
        {loading ? (
          <div className="py-12 text-center text-muted-foreground">Loading time logs…</div>
        ) : tableData.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No time logs found</p>
            <p className="text-sm text-muted-foreground mb-4">Try adjusting your filters</p>
            <Button onClick={resetFilters} size="sm">Clear Filters</Button>
          </div>
        ) : (
          <DataTable columns={columns} data={tableData} />
        )}
      </div>
    </PageLayout>
  );
}
