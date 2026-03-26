/**
 * A19 - Reports
 * Wired to service layer: usePeopleData + useTimeData + useAnalyticsData for live KPIs
 */
import { useState, useEffect } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { Button } from '../../ui/button';
import { StatusBadge } from '../../shared/StatusBadge';
import { FileText, Download, Calendar, Filter, RefreshCw, Play, CheckCircle, Clock, Users, BarChart3 } from 'lucide-react';
import { usePeopleData, useTimeData, useAnalyticsData } from '../../../services';
import type { ActivityLogEntry } from '../../../services';
import { toast } from 'sonner';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly';
  domain: string;
  lastGenerated?: string;
  status: 'ready' | 'generating' | 'scheduled';
}

const REPORT_TEMPLATES: ReportTemplate[] = [
  { id: 'r1', name: 'Attendance Report', description: 'Daily, weekly, or monthly attendance summary', frequency: 'Daily', domain: 'Time', status: 'ready' },
  { id: 'r2', name: 'Productivity Report', description: 'Team and individual productivity metrics', frequency: 'Weekly', domain: 'Analytics', status: 'ready' },
  { id: 'r3', name: 'Time Log Report', description: 'Detailed time tracking and hours worked', frequency: 'Weekly', domain: 'Time', status: 'ready' },
  { id: 'r4', name: 'Leave Report', description: 'Leave balance and usage summary', frequency: 'Monthly', domain: 'Time', status: 'scheduled' },
  { id: 'r5', name: 'Payroll Report', description: 'Payroll calculations and summaries', frequency: 'Monthly', domain: 'Finance', status: 'scheduled' },
  { id: 'r6', name: 'Department Report', description: 'Department-wise performance analytics', frequency: 'Monthly', domain: 'People', status: 'scheduled' },
  { id: 'r7', name: 'Fines & Compliance', description: 'Attendance fine tracking and compliance status', frequency: 'Weekly', domain: 'Time', status: 'ready' },
  { id: 'r8', name: 'Employee Roster', description: 'Current active employees and their status', frequency: 'Monthly', domain: 'People', status: 'ready' },
];

const domainColor = (d: string) => {
  if (d === 'Time') return 'warning';
  if (d === 'Analytics') return 'info';
  if (d === 'Finance') return 'success';
  return 'neutral';
};

export function A19Reports() {
  const { employees, departments, loading: peopleLoading } = usePeopleData();
  const { leaveRequests, sessions, fines, loading: timeLoading } = useTimeData();
  const { getActivityLog } = useAnalyticsData();

  const [templates, setTemplates] = useState<ReportTemplate[]>(REPORT_TEMPLATES);
  const [recentLogs, setRecentLogs] = useState<ActivityLogEntry[]>([]);
  const [filterDomain, setFilterDomain] = useState('all');
  const [filterFreq, setFilterFreq] = useState('all');
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  useEffect(() => {
    getActivityLog().then(logs => setRecentLogs(logs.slice(0, 5))).catch(() => {});
  }, [getActivityLog]);

  const filtered = templates.filter(t => {
    const matchDomain = filterDomain === 'all' || t.domain === filterDomain;
    const matchFreq = filterFreq === 'all' || t.frequency === filterFreq;
    return matchDomain && matchFreq;
  });

  const handleGenerate = async (id: string) => {
    setGeneratingId(id);
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, status: 'generating' } : t));
    // Simulate generation
    await new Promise(r => setTimeout(r, 1200));
    const now = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, status: 'ready', lastGenerated: now } : t));
    setGeneratingId(null);
    toast.success(`Report generated successfully! Download ready.`);
  };

  const handleExportAll = () => {
    toast.success(`Exporting ${filtered.length} reports…`);
  };

  const loading = peopleLoading || timeLoading;

  // Live KPIs
  const pendingLeave = leaveRequests.filter(l => l.status === 'Pending').length;
  const activeSessions = sessions.filter(s => s.status === 'Active').length;
  const activeEmployees = employees.filter(e => e.status === 'Active').length;
  const openFines = fines.filter(f => f.status === 'Active').length;

  return (
    <PageLayout
      title="ADMIN – A-19 – Reports – v3.0 [Service Layer ✓]"
      description="Generate and download custom reports — KPIs sourced from live service data"
      actions={
        <>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Schedule
          </Button>
          <Button onClick={handleExportAll}>
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
        </>
      }
      kpis={[
        {
          title: 'Report Templates',
          value: String(templates.length),
          change: 'Available',
          changeType: 'neutral',
          icon: <FileText className="h-5 w-5" />,
        },
        {
          title: 'Active Employees',
          value: loading ? '…' : String(activeEmployees),
          change: 'Ready for roster report',
          changeType: 'positive',
          icon: <Users className="h-5 w-5" />,
        },
        {
          title: 'Pending Leave',
          value: loading ? '…' : String(pendingLeave),
          change: 'Awaiting approval',
          changeType: pendingLeave > 0 ? 'warning' : 'neutral',
          icon: <Calendar className="h-5 w-5" />,
        },
        {
          title: 'Active Sessions',
          value: loading ? '…' : String(activeSessions),
          change: `${openFines} open fines`,
          changeType: 'neutral',
          icon: <Clock className="h-5 w-5" />,
        },
      ]}
    >
      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-4">
        <span className="text-sm font-medium">Filter:</span>
        <select
          className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          value={filterDomain}
          onChange={e => setFilterDomain(e.target.value)}
        >
          <option value="all">All Domains</option>
          <option value="Time">Time</option>
          <option value="Analytics">Analytics</option>
          <option value="People">People</option>
          <option value="Finance">Finance</option>
        </select>
        <select
          className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          value={filterFreq}
          onChange={e => setFilterFreq(e.target.value)}
        >
          <option value="all">All Frequencies</option>
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
        </select>
        <span className="text-xs text-muted-foreground ml-auto">{filtered.length} reports</span>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        {filtered.map(report => (
          <div key={report.id} className="rounded-lg border border-border bg-card p-5 hover:border-primary/40 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="flex gap-1">
                <StatusBadge type={domainColor(report.domain) as any}>{report.domain}</StatusBadge>
              </div>
            </div>
            <h4 className="font-semibold mb-1">{report.name}</h4>
            <p className="text-sm text-muted-foreground mb-3">{report.description}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
              <span className="flex items-center gap-1">
                <RefreshCw className="h-3 w-3" />
                {report.frequency}
              </span>
              {report.lastGenerated && (
                <span>Last: {report.lastGenerated}</span>
              )}
              {report.status === 'scheduled' && (
                <StatusBadge type="info">Scheduled</StatusBadge>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => handleGenerate(report.id)}
                disabled={generatingId === report.id}
              >
                {generatingId === report.id ? (
                  <><RefreshCw className="mr-1 h-3 w-3 animate-spin" /> Generating…</>
                ) : (
                  <><Play className="mr-1 h-3 w-3" /> Generate</>
                )}
              </Button>
              {report.lastGenerated && (
                <Button size="sm" variant="ghost" onClick={() => toast.success('Downloading report…')}>
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Log */}
      {recentLogs.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Recent System Activity (Live)
          </h3>
          <div className="space-y-3">
            {recentLogs.map(log => (
              <div key={log.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary shrink-0">
                  {log.userName.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{log.userName}</p>
                  <p className="text-xs text-muted-foreground">
                    {log.action} · {log.target}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </PageLayout>
  );
}
