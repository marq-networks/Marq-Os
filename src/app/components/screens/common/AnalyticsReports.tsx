import { useState } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import {
  FileText, Download, Calendar, Clock, BarChart3, Users, DollarSign, Shield, Play,
  Plus, Search,
} from 'lucide-react';
import { Input } from '../../ui/input';

interface ReportDef {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: typeof FileText;
  frequency: string;
  lastRun: string;
  status: 'Ready' | 'Generating' | 'Scheduled';
  format: string;
}

const REPORTS: ReportDef[] = [
  { id: 'r1', name: 'Employee Attendance Summary', description: 'Monthly attendance, late arrivals, and absences report', category: 'Time', icon: Clock, frequency: 'Monthly', lastRun: '2026-03-01', status: 'Ready', format: 'PDF' },
  { id: 'r2', name: 'Productivity Scorecard', description: 'Team and individual productivity metrics and trends', category: 'Analytics', icon: BarChart3, frequency: 'Weekly', lastRun: '2026-03-03', status: 'Ready', format: 'Excel' },
  { id: 'r3', name: 'Leave Utilization Report', description: 'Leave balances, usage patterns, and forecast', category: 'Time', icon: Calendar, frequency: 'Monthly', lastRun: '2026-03-01', status: 'Ready', format: 'PDF' },
  { id: 'r4', name: 'Headcount Report', description: 'Employee count by department, role, and employment type', category: 'People', icon: Users, frequency: 'Monthly', lastRun: '2026-03-01', status: 'Ready', format: 'Excel' },
  { id: 'r5', name: 'Payroll Summary', description: 'Gross, deductions, and net pay breakdown by department', category: 'Finance', icon: DollarSign, frequency: 'Monthly', lastRun: '2026-02-28', status: 'Ready', format: 'PDF' },
  { id: 'r6', name: 'App Usage Analysis', description: 'Application usage hours and categorization', category: 'Analytics', icon: BarChart3, frequency: 'Weekly', lastRun: '2026-03-03', status: 'Ready', format: 'Excel' },
  { id: 'r7', name: 'Audit Trail Report', description: 'Security events, access logs, and compliance checks', category: 'Security', icon: Shield, frequency: 'Monthly', lastRun: '2026-03-01', status: 'Scheduled', format: 'PDF' },
  { id: 'r8', name: 'Overtime & Fines Report', description: 'Overtime hours, fines issued, and violation patterns', category: 'Time', icon: Clock, frequency: 'Bi-weekly', lastRun: '2026-02-28', status: 'Ready', format: 'Excel' },
];

const CATEGORY_COLOR: Record<string, string> = {
  Time: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  Analytics: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
  People: 'bg-green-500/10 text-green-700 dark:text-green-400',
  Finance: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  Security: 'bg-red-500/10 text-red-700 dark:text-red-400',
};

const STATUS_MAP: Record<string, 'success' | 'warning' | 'info'> = {
  Ready: 'success', Generating: 'warning', Scheduled: 'info',
};

export function AnalyticsReports() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [generating, setGenerating] = useState<string | null>(null);

  const categories = [...new Set(REPORTS.map(r => r.category))];

  const filtered = REPORTS.filter(r => {
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'all' || r.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const handleGenerate = (id: string) => {
    setGenerating(id);
    setTimeout(() => {
      setGenerating(null);
      alert('Report generated successfully! Download will begin shortly.');
    }, 1500);
  };

  return (
    <PageLayout
      title="Reports"
      description="Generate, schedule, and download organizational reports"
      actions={
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Custom Report
        </Button>
      }
      kpis={[
        { title: 'Available Reports', value: REPORTS.length, change: `${categories.length} categories`, changeType: 'neutral', icon: <FileText className="h-5 w-5" /> },
        { title: 'Ready', value: REPORTS.filter(r => r.status === 'Ready').length, changeType: 'positive', icon: <Download className="h-5 w-5" /> },
        { title: 'Scheduled', value: REPORTS.filter(r => r.status === 'Scheduled').length, changeType: 'info', icon: <Calendar className="h-5 w-5" /> },
        { title: 'Last Generated', value: 'Mar 3', change: 'Productivity Scorecard', changeType: 'neutral', icon: <Clock className="h-5 w-5" /> },
      ]}
    >
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search reports..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs ${categoryFilter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/70'}`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(categoryFilter === cat ? 'all' : cat)}
              className={`px-3 py-1.5 rounded-full text-xs ${categoryFilter === cat ? 'bg-primary text-primary-foreground' : CATEGORY_COLOR[cat] || 'bg-muted'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(report => {
          const Icon = report.icon;
          const isGenerating = generating === report.id;
          return (
            <div key={report.id} className="rounded-lg border border-border bg-card p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start gap-4">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${CATEGORY_COLOR[report.category] || 'bg-muted'}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{report.name}</h4>
                    <StatusBadge type={STATUS_MAP[report.status] || 'neutral'}>{report.status}</StatusBadge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{report.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className={`px-2 py-0.5 rounded-full ${CATEGORY_COLOR[report.category] || 'bg-muted'}`}>{report.category}</span>
                    <span>{report.frequency}</span>
                    <span>{report.format}</span>
                    <span>Last: {new Date(report.lastRun).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-3 border-t border-border">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleGenerate(report.id)}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>Generating...</>
                  ) : (
                    <><Play className="h-3 w-3 mr-1.5" /> Generate</>
                  )}
                </Button>
                <Button size="sm" variant="outline" disabled={report.status !== 'Ready'}>
                  <Download className="h-3 w-3 mr-1.5" /> Download
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </PageLayout>
  );
}
