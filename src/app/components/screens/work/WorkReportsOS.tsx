import { useState } from 'react';
import { Button } from '../../ui/button';
import {
  BarChart3, Download, TrendingUp, TrendingDown, Clock,
  CheckSquare, Users, DollarSign, AlertTriangle, Target,
  FileSpreadsheet, Activity, Zap, RefreshCw, Bug, User, Calendar,
  Shield, Star, ThumbsUp, ThumbsDown, Minus
} from 'lucide-react';
import { BarChart, Bar, Line, LineChart, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useExecutionOS } from '../../../contexts/ExecutionOSContext';

type ReportType = 'velocity' | 'burndown' | 'workload' | 'timelogs' | 'budget' | 'issues' | 'timebyperson' | 'forecast' | 'cfd' | 'billing' | 'health';

// ── Report Tab ────────────────────────────────────────────
interface ReportTabProps {
  active: boolean;
  icon: any;
  label: string;
  onClick: () => void;
}
function ReportTab({ active, icon: Icon, label, onClick }: ReportTabProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-sm transition-colors whitespace-nowrap ${
        active
          ? 'border-primary text-primary'
          : 'border-transparent text-muted-foreground hover:text-foreground'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

// ── Velocity Report ───────────────────────────────────────
function VelocityReport({ tasks }: { tasks: any[] }) {
  const data = [
    { sprint: 'Sprint 1', planned: 32, completed: 28, velocity: 28 },
    { sprint: 'Sprint 2', planned: 36, completed: 36, velocity: 36 },
    { sprint: 'Sprint 3', planned: 40, completed: 38, velocity: 38 },
    { sprint: 'Sprint 4', planned: 42, completed: 35, velocity: 35 },
    { sprint: 'Sprint 5', planned: 55, completed: 31, velocity: 31 },
  ];

  const avg = Math.round(data.reduce((s, d) => s + d.velocity, 0) / data.length);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Avg Velocity', value: `${avg} pts`, icon: Zap, color: 'text-blue-500' },
          { label: 'Current Sprint', value: '31 pts', icon: Activity, color: 'text-orange-500', sub: 'Sprint 5 (active)' },
          { label: 'Trend', value: '-11%', icon: TrendingDown, color: 'text-red-500', sub: 'vs Sprint 4' },
        ].map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{k.label}</span>
                <Icon className={`w-4 h-4 ${k.color}`} />
              </div>
              <p className={`text-2xl font-semibold ${k.color}`}>{k.value}</p>
              {k.sub && <p className="text-xs text-muted-foreground mt-1">{k.sub}</p>}
            </div>
          );
        })}
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-medium mb-4">Sprint Velocity (Story Points)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="sprint" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="planned" name="Planned" fill="#e2e8f0" radius={[3, 3, 0, 0]} />
            <Bar dataKey="completed" name="Completed" fill="#3b82f6" radius={[3, 3, 0, 0]} />
            <Line type="monotone" dataKey="velocity" name="Velocity Trend" stroke="#f59e0b" strokeWidth={2} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ── Burndown Report ───────────────────────────────────────
function BurndownReport({ burndownData }: { burndownData: any[] }) {
  const data = burndownData;

  const tasksDone = 0;
  const tasksOpen = 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Tasks', value: data.length > 0 ? data[0].ideal : 0, icon: CheckSquare, color: 'text-primary' },
          { label: 'Completed', value: tasksDone, icon: CheckSquare, color: 'text-green-500' },
          { label: 'Remaining', value: tasksOpen, icon: Activity, color: 'text-blue-500' },
          { label: 'Sprint Burndown', value: '0%', icon: TrendingDown, color: 'text-orange-500' },
        ].map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{k.label}</span>
                <Icon className={`w-4 h-4 ${k.color}`} />
              </div>
              <p className={`text-2xl font-semibold ${k.color}`}>{k.value}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Sprint 5 — Payments · Burndown Chart</h3>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Feb 3 – Feb 20, 2026</span>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">Active Sprint</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="idealGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e2e8f0" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#e2e8f0" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 12 }} label={{ value: 'Points Remaining', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 11 } }} />
            <Tooltip formatter={(v: number | undefined, name: string) => v !== undefined ? [`${v} pts`, name] : ['–', name]} />
            <Legend />
            <Area type="monotone" dataKey="ideal" name="Ideal Burndown" stroke="#cbd5e1" fill="url(#idealGrad)" strokeDasharray="5 5" strokeWidth={2} />
            <Area type="monotone" dataKey="actual" name="Actual Progress" stroke="#3b82f6" fill="url(#actualGrad)" strokeWidth={2.5} connectNulls={false} dot={{ r: 3, fill: '#3b82f6' }} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mt-3 flex items-center gap-6 text-xs text-muted-foreground">
          <span>📊 38/55 story points completed</span>
          <span>📅 Today: <strong className="text-foreground">Feb 17 (Day 11)</strong></span>
          <span className={`${17 > 14.4 ? 'text-orange-500' : 'text-green-600'}`}>
            {17 > 14.4 ? `⚠ ${(17 - 14.4).toFixed(1)} pts behind ideal` : `✓ On track`}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Workload Report ───────────────────────────────────────
function WorkloadReport({ teamMembers, tasks }: { teamMembers: any[]; tasks: any[] }) {
  const data = teamMembers.map(m => ({
    name: m.name.split(' ')[0],
    load: m.currentLoad,
    capacity: m.capacity,
    tasks: m.assignedTasks,
  }));

  const byDept = ['Engineering', 'Product', 'Design', 'Operations'].map(dept => ({
    dept,
    count: teamMembers.filter(m => m.department === dept).length,
    avgLoad: Math.round(teamMembers.filter(m => m.department === dept).reduce((s, m) => s + m.currentLoad, 0) / (teamMembers.filter(m => m.department === dept).length || 1)),
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-medium mb-4">Team Load Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={50} />
              <Tooltip formatter={(v: number) => `${v}%`} />
              <Bar dataKey="load" name="Load %" radius={[0, 4, 4, 0]}>
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.load > 90 ? '#ef4444' : entry.load > 75 ? '#f97316' : '#3b82f6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-medium mb-4">Load by Department</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={byDept} dataKey="avgLoad" nameKey="dept" cx="50%" cy="50%" outerRadius={90} label={({ dept, avgLoad }) => `${dept}: ${avgLoad}%`}>
                {byDept.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              {['Member', 'Department', 'Role', 'Load', 'Tasks', 'Capacity', 'Available'].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((m, i) => (
              <tr key={m.id} className={`border-t border-border ${i % 2 === 0 ? '' : 'bg-muted/20'}`}>
                <td className="px-4 py-3 font-medium">{m.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{m.department}</td>
                <td className="px-4 py-3 text-muted-foreground">{m.role}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${m.currentLoad > 90 ? 'bg-red-500' : m.currentLoad > 75 ? 'bg-orange-400' : 'bg-green-500'}`}
                        style={{ width: `${m.currentLoad}%` }}
                      />
                    </div>
                    <span className={`text-xs font-medium ${m.currentLoad > 90 ? 'text-red-500' : ''}`}>{m.currentLoad}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">{m.assignedTasks}</td>
                <td className="px-4 py-3">{m.capacity}h/wk</td>
                <td className="px-4 py-3 text-green-600">{m.availability}h</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Budget Report ─────────────────────────────────────────
function BudgetReport({ projects }: { projects: any[] }) {
  const data = projects.map(p => ({
    name: p.code,
    fullName: p.name,
    budget: p.budget,
    spent: p.spent,
    remaining: p.budget - p.spent,
    burn: p.burnRate,
  }));

  const total = data.reduce((s, d) => ({ budget: s.budget + d.budget, spent: s.spent + d.spent }), { budget: 0, spent: 0 });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Budget', value: `$${(total.budget / 1000).toFixed(0)}k`, icon: DollarSign, color: 'text-primary' },
          { label: 'Total Spent', value: `$${(total.spent / 1000).toFixed(0)}k`, icon: TrendingDown, color: 'text-orange-500', sub: `${Math.round((total.spent / total.budget) * 100)}% of budget` },
          { label: 'Remaining', value: `$${((total.budget - total.spent) / 1000).toFixed(0)}k`, icon: TrendingUp, color: 'text-green-500' },
        ].map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{k.label}</span>
                <Icon className={`w-4 h-4 ${k.color}`} />
              </div>
              <p className={`text-2xl font-semibold ${k.color}`}>{k.value}</p>
              {k.sub && <p className="text-xs text-muted-foreground mt-1">{k.sub}</p>}
            </div>
          );
        })}
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-medium mb-4">Budget vs Spent by Project</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `$${v / 1000}k`} />
            <Tooltip formatter={(v: number) => `$${(v / 1000).toFixed(1)}k`} />
            <Legend />
            <Bar dataKey="budget" name="Budget" fill="#e2e8f0" radius={[3, 3, 0, 0]} />
            <Bar dataKey="spent" name="Spent" fill="#3b82f6" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              {['Project', 'Budget', 'Spent', 'Remaining', 'Burn Rate', 'Status'].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.map((p, i) => {
              const remaining = p.budget - p.spent;
              return (
                <tr key={p.id} className={`border-t border-border ${i % 2 === 0 ? '' : 'bg-muted/20'}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">${(p.budget / 1000).toFixed(0)}k</td>
                  <td className="px-4 py-3">${(p.spent / 1000).toFixed(0)}k</td>
                  <td className="px-4 py-3 text-green-600">${(remaining / 1000).toFixed(0)}k</td>
                  <td className={`px-4 py-3 font-medium ${p.burnRate > 100 ? 'text-red-500' : p.burnRate > 80 ? 'text-orange-500' : 'text-green-600'}`}>
                    {p.burnRate}%
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === 'Active' ? 'bg-green-100 text-green-700' : p.status === 'At Risk' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Time Logs Report ──────────────────────────────────────
function TimeLogsReport({ timeLogs }: { timeLogs: any[] }) {
  const totalLogged = timeLogs.reduce((s, l) => s + l.hours, 0);
  const totalBillable = timeLogs.filter(l => l.billable).reduce((s, l) => s + l.hours, 0);
  const billableRate = totalLogged > 0 ? Math.round((totalBillable / totalLogged) * 100) : 0;

  const byProject: any[] = [];
  const data: any[] = [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Logged', value: `${totalLogged.toFixed(1)}h`, icon: Clock, color: 'text-primary' },
          { label: 'Billable Hours', value: `${totalBillable.toFixed(1)}h`, icon: DollarSign, color: 'text-green-500' },
          { label: 'Non-Billable', value: `${(totalLogged - totalBillable).toFixed(1)}h`, icon: Clock, color: 'text-muted-foreground' },
          { label: 'Billable Rate', value: `${billableRate}%`, icon: TrendingUp, color: billableRate > 70 ? 'text-green-500' : 'text-orange-500' },
        ].map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{k.label}</span>
                <Icon className={`w-4 h-4 ${k.color}`} />
              </div>
              <p className={`text-2xl font-semibold ${k.color}`}>{k.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-medium mb-4">Hours by Team Member</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="estimated" name="Estimated" fill="#e2e8f0" radius={[3, 3, 0, 0]} />
              <Bar dataKey="logged" name="Logged" fill="#3b82f6" radius={[3, 3, 0, 0]} />
              <Bar dataKey="billable" name="Billable" fill="#10b981" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-medium mb-4">Hours by Project</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={byProject} dataKey="hours" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, hours }) => `${name}: ${hours}h`}>
                {byProject.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => `${v}h`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Log Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-medium">Recent Log Entries</h3>
          <span className="text-xs text-muted-foreground">{timeLogs.length} entries</span>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              {['Date', 'Logged By', 'Task', 'Project', 'Duration', 'Type'].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-2.5">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeLogs.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 12).map((log, i) => {
              const task: any = null;
              const project: any = null;
              return (
                <tr key={log.id} className={`border-t border-border ${i % 2 === 0 ? '' : 'bg-muted/20'}`}>
                  <td className="px-4 py-2.5 text-muted-foreground">{new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs">{log.loggedBy.charAt(0)}</div>
                      <span>{log.loggedBy.split(' ')[0]}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 max-w-[200px]"><p className="truncate text-xs">{task?.title || log.taskId}</p></td>
                  <td className="px-4 py-2.5">
                    {project && <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: project.color }} /><span className="text-xs text-muted-foreground">{project.code}</span></div>}
                  </td>
                  <td className="px-4 py-2.5 font-mono font-medium">{log.duration}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${log.billable ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                      {log.billable ? '$ Billable' : 'Internal'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Issues Report ─────────────────────────────────────────
function IssuesReport({ issues }: { issues: any[] }) {
  const severityOrder = { Critical: 0, Major: 1, Minor: 2, Trivial: 3 };
  const sorted = [...issues].sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  const bySeverity = (['Critical', 'Major', 'Minor', 'Trivial'] as const).map(s => ({
    name: s,
    count: issues.filter(i => i.severity === s).length,
    open: issues.filter(i => i.severity === s && (i.status === 'Open' || i.status === 'In Progress')).length,
  }));

  const byProject: any[] = [];

  const SEVERITY_CFG: Record<string, { bg: string; color: string; border: string; dot: string }> = {
    Critical: { bg: 'bg-red-100',    color: 'text-red-700',    border: 'border-red-300',    dot: 'bg-red-500'    },
    Major:    { bg: 'bg-orange-100', color: 'text-orange-700', border: 'border-orange-300', dot: 'bg-orange-500' },
    Minor:    { bg: 'bg-yellow-100', color: 'text-yellow-700', border: 'border-yellow-300', dot: 'bg-yellow-500' },
    Trivial:  { bg: 'bg-gray-100',   color: 'text-gray-600',   border: 'border-gray-300',   dot: 'bg-gray-400'   },
  };

  const STATUS_ISSUE_CFG: Record<string, { bg: string; color: string }> = {
    'Open':        { bg: 'bg-slate-100',  color: 'text-slate-700'  },
    'In Progress': { bg: 'bg-blue-100',   color: 'text-blue-700'   },
    'Resolved':    { bg: 'bg-green-100',  color: 'text-green-700'  },
    'Closed':      { bg: 'bg-gray-100',   color: 'text-gray-600'   },
    "Won't Fix":   { bg: 'bg-gray-50',    color: 'text-gray-400'   },
  };

  const openCount = issues.filter(i => i.status === 'Open' || i.status === 'In Progress').length;
  const criticalOpen = issues.filter(i => i.severity === 'Critical' && (i.status === 'Open' || i.status === 'In Progress')).length;
  const resolved = issues.filter(i => i.status === 'Resolved' || i.status === 'Closed').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Issues', value: issues.length, icon: Activity, color: 'text-primary' },
          { label: 'Open / In Progress', value: openCount, icon: AlertTriangle, color: openCount > 0 ? 'text-orange-500' : 'text-green-500' },
          { label: 'Critical Open', value: criticalOpen, icon: AlertTriangle, color: criticalOpen > 0 ? 'text-red-500' : 'text-green-500' },
          { label: 'Resolved', value: resolved, icon: CheckSquare, color: 'text-green-500' },
        ].map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{k.label}</span>
                <Icon className={`w-4 h-4 ${k.color}`} />
              </div>
              <p className={`text-2xl font-semibold ${k.color}`}>{k.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-medium mb-4">Issues by Severity</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={bySeverity} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={60} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Total" fill="#e2e8f0" radius={[0, 3, 3, 0]} />
              <Bar dataKey="open" name="Open" radius={[0, 3, 3, 0]}>
                {bySeverity.map((entry, i) => {
                  const colors = ['#ef4444', '#f97316', '#eab308', '#94a3b8'];
                  return <Cell key={i} fill={colors[i]} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-medium mb-4">Open vs Resolved by Project</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={byProject}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="open" name="Open" fill="#ef4444" radius={[3, 3, 0, 0]} />
              <Bar dataKey="resolved" name="Resolved" fill="#22c55e" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Issues Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-medium">All Issues</h3>
          <span className="text-xs text-muted-foreground">{issues.length} total</span>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              {['ID', 'Title', 'Project', 'Severity', 'Status', 'Assignee', 'Reporter', 'Due'].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-2.5">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((issue, i) => {
              const sc = SEVERITY_CFG[issue.severity];
              const stc = STATUS_ISSUE_CFG[issue.status] || { bg: 'bg-muted', color: 'text-muted-foreground' };
              const project: any = null;
              const isOverdue = new Date(issue.dueDate) < new Date();
              return (
                <tr key={issue.id} className={`border-t border-border ${i % 2 === 0 ? '' : 'bg-muted/20'}`}>
                  <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{issue.issueId}</td>
                  <td className="px-4 py-2.5 max-w-[200px]"><p className="truncate font-medium">{issue.title}</p></td>
                  <td className="px-4 py-2.5">
                    {project && <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: project.color }} /><span className="text-xs">{project.code}</span></div>}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${sc.bg} ${sc.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{issue.severity}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${stc.bg} ${stc.color}`}>{issue.status}</span>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">{issue.assignee.split(' ')[0]}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{issue.reporter.split(' ')[0]}</td>
                  <td className={`px-4 py-2.5 ${isOverdue && issue.status !== 'Resolved' && issue.status !== 'Closed' ? 'text-red-500' : 'text-muted-foreground'}`}>
                    {new Date(issue.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Time by Person Report ─────────────────────────────────
function TimeByPersonReport({ timeLogs, teamMembers }: { timeLogs: any[]; teamMembers: any[] }) {
  const [selectedPerson, setSelectedPerson] = useState(teamMembers[0]?.name || '');

  const memberData = teamMembers.find(m => m.name === selectedPerson)!;
  const personLogs = timeLogs.filter(l => l.loggedBy === selectedPerson);
  const personTasks: any[] = [];

  const totalHours = parseFloat(personLogs.reduce((s, l) => s + l.hours, 0).toFixed(1));
  const billableHours = parseFloat(personLogs.filter(l => l.billable).reduce((s, l) => s + l.hours, 0).toFixed(1));
  const billableRate = totalHours > 0 ? Math.round((billableHours / totalHours) * 100) : 0;
  const totalEstimated = personTasks.reduce((s, t) => s + (t.estimatedHours || 0), 0);

  const projectBreakdown: any[] = [];

  const dailyMap: Record<string, number> = {};
  personLogs.forEach(l => { dailyMap[l.date] = (dailyMap[l.date] || 0) + l.hours; });
  const dailyData = Object.entries(dailyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, hours]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      hours: parseFloat(hours.toFixed(1)),
    }));

  const taskAccuracy = personTasks
    .filter(t => (t.actualHours ?? 0) > 0 && (t.estimatedHours ?? 0) > 0)
    .map(t => ({
      taskId: t.taskId, title: t.title, project: t.projectName, color: t.projectColor || '#94a3b8',
      estimated: t.estimatedHours || 0, actual: t.actualHours || 0,
      varPct: Math.round(((t.actualHours || 0) / (t.estimatedHours || 1) - 1) * 100), status: t.status,
    }));

  const memberSummary = teamMembers.map(m => {
    const logs = timeLogs.filter(l => l.loggedBy === m.name);
    const lh = parseFloat(logs.reduce((s, l) => s + l.hours, 0).toFixed(1));
    const bh = parseFloat(logs.filter(l => l.billable).reduce((s, l) => s + l.hours, 0).toFixed(1));
    return { ...m, loggedHrs: lh, billableHrs: bh };
  });

  return (
    <div className="flex gap-5">
      {/* Person selector */}
      <div className="w-52 flex-shrink-0 space-y-1.5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 px-1">Team Members</p>
        {memberSummary.map(m => {
          const rate = m.loggedHrs > 0 ? Math.round((m.billableHrs / m.loggedHrs) * 100) : 0;
          const isSel = m.name === selectedPerson;
          return (
            <button key={m.id} onClick={() => setSelectedPerson(m.name)}
              className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all ${isSel ? 'bg-primary/10 border-primary/30' : 'bg-card border-border hover:bg-accent'}`}>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${isSel ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
                  {m.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${isSel ? 'text-primary' : ''}`}>{m.name.split(' ')[0]}</p>
                  <p className="text-xs text-muted-foreground">{m.loggedHrs}h · {rate}% bill.</p>
                </div>
              </div>
              {m.loggedHrs > 0 && (
                <div className="mt-1.5 h-1 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${rate}%` }} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Detail panel */}
      <div className="flex-1 space-y-5 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-4 bg-card border border-border rounded-xl p-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary flex-shrink-0">
            {selectedPerson.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-lg">{selectedPerson}</h2>
            <p className="text-sm text-muted-foreground">{memberData?.role} · {memberData?.department}</p>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {memberData?.skills?.map(s => (
                <span key={s} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{s}</span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 flex-shrink-0">
            {[
              { label: 'Logged',    value: `${totalHours}h`,     color: 'text-primary' },
              { label: 'Billable',  value: `${billableHours}h`,  color: 'text-green-600' },
              { label: 'Bill. Rate',value: `${billableRate}%`,   color: billableRate >= 70 ? 'text-green-600' : 'text-orange-500' },
              { label: 'Estimated', value: `${totalEstimated}h`, color: 'text-muted-foreground' },
            ].map((k, i) => (
              <div key={i} className="text-center bg-muted/40 rounded-xl px-3 py-2">
                <p className={`font-bold ${k.color}`}>{k.value}</p>
                <p className="text-xs text-muted-foreground">{k.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-5">
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-medium mb-4 text-sm">Hours by Project</h3>
            {projectBreakdown.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">No time logged</div>
            ) : (
              <div className="space-y-3">
                {projectBreakdown.map(p => (
                  <div key={p.name}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                        <span className="text-xs font-medium">{p.fullName}</span>
                      </div>
                      <span className="text-xs font-semibold">{p.hours}h ({Math.round((p.hours / totalHours) * 100)}%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${Math.round((p.hours / totalHours) * 100)}%`, backgroundColor: p.color }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-medium mb-4 text-sm">Daily Hours Logged</h3>
            {dailyData.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">No daily logs</div>
            ) : (
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={dailyData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v: number) => [`${v}h`, 'Logged']} />
                  <ReferenceLine y={8} stroke="#10b981" strokeDasharray="4 4" label={{ value: '8h', position: 'right', fontSize: 9, fill: '#10b981' }} />
                  <Bar dataKey="hours" name="Hours" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Task accuracy table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-medium">Estimate vs Actual by Task</h3>
            <span className="text-xs text-muted-foreground">{taskAccuracy.length} tasks with time data</span>
          </div>
          {taskAccuracy.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-sm">No tasks with both estimate and actual hours</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  {['Task', 'Project', 'Estimated', 'Actual', 'Variance', 'Status'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-2.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {taskAccuracy.map((t, i) => (
                  <tr key={t.taskId} className={`border-t border-border ${i % 2 === 0 ? '' : 'bg-muted/20'}`}>
                    <td className="px-4 py-2.5">
                      <p className="text-xs font-medium truncate max-w-[160px]">{t.title}</p>
                      <p className="text-xs text-muted-foreground font-mono">{t.taskId}</p>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                        <span className="text-xs text-muted-foreground">{t.project}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 font-mono">{t.estimated}h</td>
                    <td className="px-4 py-2.5 font-mono">{t.actual}h</td>
                    <td className="px-4 py-2.5">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        t.varPct > 20 ? 'bg-red-100 text-red-600' : t.varPct > 0 ? 'bg-orange-100 text-orange-600'
                        : t.varPct < -10 ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                      }`}>{t.varPct > 0 ? '+' : ''}{t.varPct}%</span>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">{t.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Raw log entries */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-medium">Time Log Entries</h3>
            <span className="text-xs text-muted-foreground">{personLogs.length} entries · {totalHours}h total</span>
          </div>
          {personLogs.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-sm">No time logged yet</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  {['Date', 'Task', 'Description', 'Duration', 'Type'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-2.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...personLogs].sort((a, b) => b.date.localeCompare(a.date)).map((log, i) => {
                  const task: any = null;
                  const project: any = null;
                  return (
                    <tr key={log.id} className={`border-t border-border ${i % 2 === 0 ? '' : 'bg-muted/20'}`}>
                      <td className="px-4 py-2.5 text-muted-foreground whitespace-nowrap text-xs">
                        {new Date(log.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-4 py-2.5">
                        <p className="text-xs font-medium truncate max-w-[140px]">{task?.title || log.taskId}</p>
                        {project && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: project.color }} />
                            <span className="text-xs text-muted-foreground">{project.code}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2.5 max-w-[200px]">
                        <p className="text-xs text-muted-foreground truncate">{log.description}</p>
                      </td>
                      <td className="px-4 py-2.5 font-mono font-semibold text-primary">{log.duration}</td>
                      <td className="px-4 py-2.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${log.billable ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                          {log.billable ? '$ Billable' : 'Internal'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Budget Forecast Report ────────────────────────────────
function ForecastReport({ tasks, milestones }: { tasks: any[]; milestones: any[] }) {
  const today = new Date();
  const CHART_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#8b5cf6'];

  const forecasts = projects
    .filter(p => p.status !== 'Cancelled' && p.budget > 0)
    .map(p => {
      const startMs = new Date(p.startDate).getTime();
      const endMs = new Date(p.endDate).getTime();
      const totalDays = Math.max(1, Math.ceil((endMs - startMs) / 86400000));
      const elapsedDays = Math.max(0, Math.min(Math.ceil((today.getTime() - startMs) / 86400000), totalDays));
      const spendPerDay = elapsedDays > 0 ? p.spent / elapsedDays : 0;
      const remainingDays = totalDays - elapsedDays;
      const projectedTotal = Math.round(p.spent + spendPerDay * remainingDays);
      const projectedOverspend = Math.max(0, projectedTotal - p.budget);
      const budgetRemaining = Math.max(0, p.budget - p.spent);
      const daysUntilExhaust = spendPerDay > 0 ? Math.floor(budgetRemaining / spendPerDay) : null;
      const exhaustDate = daysUntilExhaust !== null
        ? new Date(today.getTime() + daysUntilExhaust * 86400000) : null;
      const riskLevel = p.burnRate > 110 ? 'Critical' : p.burnRate > 100 ? 'Over Budget' : p.burnRate > 85 ? 'At Risk' : 'On Track';
      return { ...p, spendPerDay: Math.round(spendPerDay), projectedTotal, projectedOverspend, riskLevel, exhaustDate, daysUntilExhaust };
    })
    .sort((a, b) => b.burnRate - a.burnRate);

  const totalBudget = forecasts.reduce((s, f) => s + f.budget, 0);
  const totalProjected = forecasts.reduce((s, f) => s + f.projectedTotal, 0);
  const atRisk = forecasts.filter(f => f.riskLevel === 'Critical' || f.riskLevel === 'Over Budget').length;
  const totalOverspend = forecasts.reduce((s, f) => s + f.projectedOverspend, 0);

  const RISK_CFG: Record<string, { bg: string; color: string; dot: string }> = {
    'Critical':    { bg: 'bg-red-100',    color: 'text-red-700',    dot: 'bg-red-500' },
    'Over Budget': { bg: 'bg-orange-100', color: 'text-orange-700', dot: 'bg-orange-500' },
    'At Risk':     { bg: 'bg-yellow-100', color: 'text-yellow-700', dot: 'bg-yellow-500' },
    'On Track':    { bg: 'bg-green-100',  color: 'text-green-700',  dot: 'bg-green-500' },
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  const chartData = months.map((month, i) => {
    const obj: Record<string, number | string> = { month };
    forecasts.slice(0, 4).forEach(f => {
      obj[`${f.code}`] = Math.round((f.budget * Math.min(1, (i / 6) * (f.burnRate / 100))) / 1000);
    });
    return obj;
  });

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Budget',      value: `$${(totalBudget/1000).toFixed(0)}k`,   color: 'text-primary',    icon: DollarSign },
          { label: 'Projected Total',   value: `$${(totalProjected/1000).toFixed(0)}k`, color: totalProjected > totalBudget ? 'text-red-500' : 'text-green-600', icon: TrendingUp },
          { label: 'Projects At Risk',  value: atRisk,                                  color: atRisk > 0 ? 'text-red-500' : 'text-green-600', icon: AlertTriangle },
          { label: 'Projected Overrun', value: totalOverspend > 0 ? `$${(totalOverspend/1000).toFixed(0)}k` : '$0', color: totalOverspend > 0 ? 'text-red-500' : 'text-green-600', icon: TrendingDown },
        ].map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{k.label}</span>
                <Icon className={`w-4 h-4 ${k.color}`} />
              </div>
              <p className={`text-2xl font-semibold ${k.color}`}>{k.value}</p>
            </div>
          );
        })}
      </div>

      {/* Forecast Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-medium">Project Budget Forecast</h3>
          <span className="text-xs text-muted-foreground">Based on current burn rate · Feb 2026</span>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              {['Project', 'Budget', 'Spent', 'Projected Total', 'Burn Rate', 'Budget Exhaustion', 'Risk'].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-2.5">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {forecasts.map((f, i) => {
              const rc = RISK_CFG[f.riskLevel];
              const exhaustStr = f.exhaustDate
                ? f.daysUntilExhaust !== null && f.daysUntilExhaust < 0
                  ? 'Exhausted'
                  : `${f.daysUntilExhaust}d (${f.exhaustDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`
                : '—';
              return (
                <tr key={f.id} className={`border-t border-border ${i % 2 === 0 ? '' : 'bg-muted/20'}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: f.color }} />
                      <div>
                        <p className="font-medium text-sm">{f.name}</p>
                        <p className="text-xs text-muted-foreground">{f.client}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">${(f.budget/1000).toFixed(0)}k</td>
                  <td className="px-4 py-3">
                    <span>${(f.spent/1000).toFixed(0)}k</span>
                    <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                      <div className={`h-full rounded-full ${f.burnRate > 100 ? 'bg-red-500' : 'bg-blue-500'}`}
                        style={{ width: `${Math.min((f.spent/f.budget)*100, 100)}%` }} />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${f.projectedTotal > f.budget ? 'text-red-500' : 'text-green-600'}`}>
                      ${(f.projectedTotal/1000).toFixed(0)}k
                    </span>
                    {f.projectedOverspend > 0 && (
                      <p className="text-xs text-red-400">+${(f.projectedOverspend/1000).toFixed(0)}k over</p>
                    )}
                  </td>
                  <td className={`px-4 py-3 font-semibold ${f.burnRate > 100 ? 'text-red-500' : f.burnRate > 85 ? 'text-orange-500' : 'text-green-600'}`}>
                    {f.burnRate}%
                  </td>
                  <td className={`px-4 py-3 text-xs ${f.daysUntilExhaust !== null && f.daysUntilExhaust < 30 ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
                    {exhaustStr}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${rc.bg} ${rc.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${rc.dot}`} />{f.riskLevel}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Spend projection chart */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Cumulative Spend Projection — 2026</h3>
          <span className="text-xs text-muted-foreground">Based on current burn rate per project</span>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${v}k`} />
            <Tooltip formatter={(v: number, name: string) => [`$${v}k`, name]} />
            <Legend />
            {forecasts.slice(0, 4).map((f, i) => (
              <Line
                key={f.code}
                type="monotone"
                dataKey={f.code}
                name={f.name}
                stroke={CHART_COLORS[i]}
                strokeWidth={2.5}
                dot={{ r: 4, fill: CHART_COLORS[i] }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Risk cards */}
      <div className="grid grid-cols-3 gap-4">
        {forecasts.filter(f => f.riskLevel !== 'On Track').slice(0, 3).map(f => (
          <div key={f.id} className="bg-card border border-red-200 rounded-xl p-4">
            <div className="flex items-start gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">{f.name}</p>
                <p className="text-xs text-muted-foreground">{f.client}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Burn rate <span className="font-semibold text-foreground">{f.burnRate}%</span>. Projected{' '}
              <span className={`font-semibold ${f.projectedTotal > f.budget ? 'text-red-500' : 'text-foreground'}`}>
                ${(f.projectedTotal/1000).toFixed(0)}k
              </span>
              {f.projectedOverspend > 0 ? `, exceeding budget by $${(f.projectedOverspend/1000).toFixed(0)}k.` : '.'}
              {f.daysUntilExhaust !== null && f.daysUntilExhaust < 60
                ? ` Budget exhausts in ${Math.max(0, f.daysUntilExhaust)}d.` : ''}
            </p>
          </div>
        ))}
        {forecasts.filter(f => f.riskLevel !== 'On Track').length === 0 && (
          <div className="col-span-3 bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-sm text-green-700 font-medium">✓ All projects are tracking within budget</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Cumulative Flow Diagram ───────────────────────────────
function CumulativeFlowReport({ tasks }: { tasks: any[] }) {
  const cfdData = [
    { week: 'Dec 23', backlog: 45, open: 28, inProgress: 8,  testing: 3, review: 2, done: 12 },
    { week: 'Dec 30', backlog: 42, open: 25, inProgress: 10, testing: 4, review: 3, done: 18 },
    { week: 'Jan 6',  backlog: 38, open: 22, inProgress: 12, testing: 5, review: 2, done: 25 },
    { week: 'Jan 13', backlog: 34, open: 20, inProgress: 14, testing: 6, review: 4, done: 32 },
    { week: 'Jan 20', backlog: 30, open: 18, inProgress: 11, testing: 7, review: 3, done: 41 },
    { week: 'Jan 27', backlog: 27, open: 15, inProgress: 13, testing: 8, review: 5, done: 50 },
    { week: 'Feb 3',  backlog: 22, open: 14, inProgress: 15, testing: 9, review: 4, done: 57 },
    { week: 'Feb 10', backlog: 18, open: 12, inProgress: 14, testing: 8, review: 6, done: 63 },
    { week: 'Feb 17', backlog: 15, open: 11, inProgress: 13, testing: 7, review: 5, done: 70 },
  ];

  const latest = cfdData[cfdData.length - 1];
  const prev = cfdData[cfdData.length - 2];
  const throughput = latest.done - prev.done;
  const wip = latest.open + latest.inProgress + latest.testing + latest.review;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Done',   value: latest.done,           icon: CheckSquare, color: 'text-green-500',      sub: `+${throughput} this week` },
          { label: 'WIP Active',   value: wip,                   icon: Activity,    color: 'text-blue-500',       sub: 'Tasks in flight' },
          { label: 'Cycle Time',   value: `~${(wip / Math.max(1, throughput)).toFixed(1)}w`, icon: Clock, color: 'text-purple-500', sub: 'Avg weeks to done' },
          { label: 'Backlog',      value: latest.backlog,         icon: FileSpreadsheet, color: 'text-muted-foreground', sub: `was ${prev.backlog} last week` },
        ].map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{k.label}</span>
                <Icon className={`w-4 h-4 ${k.color}`} />
              </div>
              <p className={`text-2xl font-semibold ${k.color}`}>{k.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{k.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Cumulative Flow Diagram — All Projects</h3>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>Dec 2025 — Feb 2026</span>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">Weekly snapshots</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mb-4">A narrowing gap between Done and Backlog indicates healthy flow. Widening WIP bands signal bottlenecks.</p>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={cfdData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
            <XAxis dataKey="week" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="backlog"    name="Backlog"      stackId="1" stroke="#e2e8f0" fill="#e2e8f0" fillOpacity={0.6} strokeWidth={1} />
            <Area type="monotone" dataKey="open"       name="Open"         stackId="1" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.6} strokeWidth={1} />
            <Area type="monotone" dataKey="inProgress" name="In Progress"  stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.7} strokeWidth={1.5} />
            <Area type="monotone" dataKey="testing"    name="Testing"      stackId="1" stroke="#a855f7" fill="#a855f7" fillOpacity={0.7} strokeWidth={1.5} />
            <Area type="monotone" dataKey="review"     name="Review"       stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.7} strokeWidth={1.5} />
            <Area type="monotone" dataKey="done"       name="Done"         stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.8} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="bg-card border border-border rounded-xl p-5">
          <h4 className="text-sm font-medium mb-3">Weekly Throughput</h4>
          <div className="space-y-2">
            {cfdData.slice(1).map((w, i) => {
              const tp = w.done - cfdData[i].done;
              return (
                <div key={w.week} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-12">{w.week}</span>
                  <div className="flex-1 h-4 bg-muted rounded overflow-hidden">
                    <div className="h-full rounded bg-green-500" style={{ width: `${Math.min((tp / 12) * 100, 100)}%` }} />
                  </div>
                  <span className="text-xs font-semibold w-8 text-right text-green-600">+{tp}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h4 className="text-sm font-medium mb-3">WIP Trend</h4>
          <div className="space-y-2">
            {cfdData.map(w => {
              const wipVal = w.open + w.inProgress + w.testing + w.review;
              return (
                <div key={w.week} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-12">{w.week}</span>
                  <div className="flex-1 h-4 bg-muted rounded overflow-hidden">
                    <div className={`h-full rounded ${wipVal > 35 ? 'bg-red-500' : wipVal > 28 ? 'bg-orange-500' : 'bg-blue-500'}`} style={{ width: `${Math.min((wipVal / 45) * 100, 100)}%` }} />
                  </div>
                  <span className={`text-xs font-semibold w-6 text-right ${wipVal > 35 ? 'text-red-500' : 'text-foreground'}`}>{wipVal}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h4 className="text-sm font-medium mb-3">Flow Efficiency</h4>
          <div className="space-y-3">
            {[
              { label: 'Avg cycle time', value: '3.2 weeks', color: 'text-blue-600' },
              { label: 'Defect escape rate', value: '2.4%', color: 'text-orange-500' },
              { label: 'Blocked tasks', value: '4', color: 'text-red-500' },
              { label: 'Flow predictability', value: '82%', color: 'text-green-600' },
              { label: 'Avg WIP breach', value: '1.2×', color: 'text-yellow-600' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{item.label}</span>
                <span className={`text-xs font-semibold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Client Billing Report ─────────────────────────────────
function ClientBillingReport({ projects, timeLogs }: { projects: any[]; timeLogs: any[] }) {
  const billableProjects = projects.filter(p => p.billableDefault && p.client !== 'Internal');

  const billingData = billableProjects.map(p => {
    const projectTaskIds: string[] = [];
    const loggedBillable = timeLogs.filter(l => projectTaskIds.includes(l.taskId) && l.billable).reduce((s, l) => s + l.hours, 0);
    const rate = 150;
    const invoiced = parseFloat((loggedBillable * rate).toFixed(0));
    const outstanding = parseFloat((Math.max(0, p.budget * 0.25) ).toFixed(0));
    return {
      id: p.id, name: p.name, code: p.code, client: p.client, color: p.color,
      billingModel: p.billingModel || 'Fixed',
      billableHours: Math.round(loggedBillable),
      rate, invoiced, outstanding,
      budget: p.budget,
      utilization: p.billableHours ? Math.round((loggedBillable / p.billableHours) * 100) : 0,
    };
  });

  const totalBillable = billingData.reduce((s, d) => s + d.billableHours, 0);
  const totalInvoiced = billingData.reduce((s, d) => s + d.invoiced, 0);
  const totalOutstanding = billingData.reduce((s, d) => s + d.outstanding, 0);
  const totalBudget = billingData.reduce((s, d) => s + d.budget, 0);

  const barData = billingData.map(d => ({
    name: d.code, hours: d.billableHours,
    invoiced: Math.round(d.invoiced / 1000), budget: Math.round(d.budget / 1000),
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Billable Hours',   value: `${totalBillable}h`,                      icon: Clock,        color: 'text-primary' },
          { label: 'Total Invoiced',   value: `$${(totalInvoiced / 1000).toFixed(0)}k`, icon: DollarSign,   color: 'text-green-500' },
          { label: 'Outstanding',      value: `$${(totalOutstanding / 1000).toFixed(0)}k`, icon: AlertTriangle, color: totalOutstanding > 10000 ? 'text-orange-500' : 'text-muted-foreground' },
          { label: 'Client Budget',    value: `$${(totalBudget / 1000).toFixed(0)}k`,   icon: TrendingUp,   color: 'text-primary' },
        ].map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{k.label}</span>
                <Icon className={`w-4 h-4 ${k.color}`} />
              </div>
              <p className={`text-2xl font-semibold ${k.color}`}>{k.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-medium mb-4">Hours & Revenue by Project</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="hours"    name="Billable Hrs" fill="#3b82f6" radius={[3,3,0,0]} />
              <Bar dataKey="invoiced" name="Invoiced $k"  fill="#10b981" radius={[3,3,0,0]} />
              <Bar dataKey="budget"   name="Budget $k"    fill="#e2e8f0" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-medium mb-4">Revenue by Client</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={billingData.map(d => ({ name: d.client, value: Math.max(1, d.budget) }))}
                dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90}
                label={({ name, percent }) => `${name.split(' ')[0]}: ${(percent * 100).toFixed(0)}%`}
              >
                {billingData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => `$${(v / 1000).toFixed(1)}k`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-medium">Client Billing Summary</h3>
          <Button variant="outline" size="sm" className="h-7 text-xs">
            <Download className="w-3 h-3 mr-1" /> Export Invoice Data
          </Button>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              {['Project', 'Client', 'Model', 'Billed Hrs', 'Invoiced', 'Outstanding', 'Utilization'].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-2.5">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {billingData.map((d, i) => (
              <tr key={d.id} className={`border-t border-border ${i % 2 === 0 ? '' : 'bg-muted/20'}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                    <div>
                      <p className="font-medium text-sm">{d.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{d.code}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-sm">{d.client}</td>
                <td className="px-4 py-3"><span className="text-xs bg-muted px-2 py-0.5 rounded">{d.billingModel}</span></td>
                <td className="px-4 py-3 font-mono font-medium">{d.billableHours}h</td>
                <td className="px-4 py-3"><span className="font-medium text-green-600">${(d.invoiced / 1000).toFixed(1)}k</span></td>
                <td className="px-4 py-3">
                  {d.outstanding > 0
                    ? <span className="text-orange-500 font-medium">${(d.outstanding / 1000).toFixed(1)}k</span>
                    : <span className="text-green-500 text-xs">Paid</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(d.utilization, 100)}%` }} />
                    </div>
                    <span className="text-xs">{d.utilization}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Project Health Scorecard ──────────────────────────────
function ProjectHealthReport({ projects, tasks }: { projects: any[]; tasks: any[] }) {
  const today = new Date();

  const scoredProjects = projects.map(p => {
    const startMs = new Date(p.startDate).getTime();
    const endMs = new Date(p.endDate).getTime();
    const totalMs = Math.max(1, endMs - startMs);
    const elapsedMs = Math.max(0, today.getTime() - startMs);
    const timelinePos = Math.min(100, Math.round((elapsedMs / totalMs) * 100)); // % through timeline
    const progressVsTime = p.progress - timelinePos; // positive = ahead, negative = behind

    const projectTasks = tasks.filter(t => t.projectId === p.id);
    const overdueTasks = projectTasks.filter(t => new Date(t.dueDate) < today && t.status !== 'Closed').length;
    const projectIssues: any[] = [];
    const criticalIssues = projectIssues.filter(i => i.severity === 'Critical' && i.status !== 'Closed' && i.status !== 'Resolved').length;

    // Health score (0-100)
    let score = 100;
    // Schedule: behind schedule costs points
    if (progressVsTime < -20) score -= 30;
    else if (progressVsTime < -10) score -= 20;
    else if (progressVsTime < 0) score -= 10;
    else score += Math.min(10, progressVsTime / 2);
    // Budget: burn rate
    if (p.burnRate > 120) score -= 30;
    else if (p.burnRate > 110) score -= 20;
    else if (p.burnRate > 100) score -= 10;
    // Overdue tasks
    score -= Math.min(25, overdueTasks * 5);
    // Critical issues
    score -= Math.min(20, criticalIssues * 10);
    // Status
    if (p.status === 'Cancelled') score = 0;
    if (p.status === 'On Hold') score = Math.min(score, 50);

    score = Math.max(0, Math.min(100, Math.round(score)));

    const ragStatus = score >= 70 ? 'Green' : score >= 40 ? 'Amber' : 'Red';
    const trend: 'up' | 'down' | 'flat' =
      progressVsTime > 5 && p.burnRate < 90 ? 'up'
      : progressVsTime < -10 || p.burnRate > 110 ? 'down'
      : 'flat';

    return {
      ...p, score, ragStatus, trend,
      progressVsTime: Math.round(progressVsTime),
      timelinePos, overdueTasks, criticalIssues,
      openIssues: projectIssues.filter(i => i.status !== 'Closed' && i.status !== 'Resolved').length,
    };
  }).sort((a, b) => a.score - b.score);

  const green = scoredProjects.filter(p => p.ragStatus === 'Green').length;
  const amber = scoredProjects.filter(p => p.ragStatus === 'Amber').length;
  const red = scoredProjects.filter(p => p.ragStatus === 'Red').length;
  const avgScore = Math.round(scoredProjects.reduce((s, p) => s + p.score, 0) / scoredProjects.length);

  const ragCfg = {
    'Green': { bg: 'bg-green-100', color: 'text-green-700', border: 'border-green-300', dot: 'bg-green-500', label: 'Healthy' },
    'Amber': { bg: 'bg-amber-100', color: 'text-amber-700', border: 'border-amber-300', dot: 'bg-amber-500', label: 'At Risk' },
    'Red':   { bg: 'bg-red-100',   color: 'text-red-700',   border: 'border-red-300',   dot: 'bg-red-500',   label: 'Critical' },
  };

  const scoreColor = (score: number) => score >= 70 ? 'text-green-600' : score >= 40 ? 'text-amber-600' : 'text-red-600';
  const scoreBar = (score: number) => score >= 70 ? 'bg-green-500' : score >= 40 ? 'bg-amber-500' : 'bg-red-500';

  const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'flat' }) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Portfolio Score',  value: `${avgScore}/100`,  icon: Shield,      color: scoreColor(avgScore) },
          { label: 'Healthy',          value: green,               icon: ThumbsUp,    color: 'text-green-600' },
          { label: 'At Risk',          value: amber,               icon: AlertTriangle, color: 'text-amber-500' },
          { label: 'Critical',         value: red,                 icon: ThumbsDown,  color: red > 0 ? 'text-red-600' : 'text-muted-foreground' },
        ].map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{k.label}</span>
                <Icon className={`w-4 h-4 ${k.color}`} />
              </div>
              <p className={`text-2xl font-semibold ${k.color}`}>{k.value}</p>
            </div>
          );
        })}
      </div>

      {/* Score visualization — horizontal bar per project */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-medium">Project Health Scores</h3>
          <div className="flex items-center gap-4 text-xs">
            {[{ color: 'bg-green-500', label: '70–100 Healthy' }, { color: 'bg-amber-500', label: '40–69 At Risk' }, { color: 'bg-red-500', label: '0–39 Critical' }].map(l => (
              <span key={l.label} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
                {l.label}
              </span>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {[...scoredProjects].sort((a, b) => b.score - a.score).map(p => {
            const rc = ragCfg[p.ragStatus];
            return (
              <div key={p.id} className="flex items-center gap-4">
                <div className="w-36 flex-shrink-0 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.client}</p>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold ${scoreColor(p.score)}`}>{p.score}/100</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${rc.bg} ${rc.color} border ${rc.border}`}>{rc.label}</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${scoreBar(p.score)}`}
                      style={{ width: `${p.score}%` }}
                    />
                  </div>
                </div>
                <TrendIcon trend={p.trend} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail cards */}
      <div className="grid grid-cols-2 gap-5">
        {scoredProjects.map(p => {
          const rc = ragCfg[p.ragStatus];
          return (
            <div key={p.id} className={`bg-card border rounded-xl p-5 ${p.ragStatus === 'Red' ? 'border-red-200' : p.ragStatus === 'Amber' ? 'border-amber-200' : 'border-border'}`}>
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ backgroundColor: p.color }}>
                    {p.code}
                  </div>
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.client} · {p.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-bold ${scoreColor(p.score)}`}>{p.score}</span>
                  <div className="flex flex-col items-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${rc.bg} ${rc.color}`}>{rc.label}</span>
                    <div className="flex items-center gap-0.5 mt-1">
                      <TrendIcon trend={p.trend} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Score breakdown */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                {[
                  {
                    label: 'Schedule',
                    value: p.progressVsTime === 0 ? 'On time' : p.progressVsTime > 0 ? `+${p.progressVsTime}% ahead` : `${p.progressVsTime}% behind`,
                    ok: p.progressVsTime >= 0,
                  },
                  {
                    label: 'Budget Burn',
                    value: `${p.burnRate}%`,
                    ok: p.burnRate <= 100,
                  },
                  {
                    label: 'Overdue Tasks',
                    value: p.overdueTasks > 0 ? `${p.overdueTasks} overdue` : 'None',
                    ok: p.overdueTasks === 0,
                  },
                  {
                    label: 'Critical Issues',
                    value: p.criticalIssues > 0 ? `${p.criticalIssues} open` : 'None',
                    ok: p.criticalIssues === 0,
                  },
                  {
                    label: 'Progress',
                    value: `${p.progress}% (timeline: ${p.timelinePos}%)`,
                    ok: p.progress >= p.timelinePos,
                  },
                  {
                    label: 'Status',
                    value: p.status,
                    ok: p.status === 'Active' || p.status === 'Completed',
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className={`font-medium ${item.ok ? 'text-green-600' : 'text-red-500'}`}>{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Overall Progress</span>
                  <span className="font-medium">{p.progress}%</span>
                </div>
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  {/* Timeline position marker */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-gray-400 z-10"
                    style={{ left: `${p.timelinePos}%` }}
                    title={`Expected: ${p.timelinePos}% through timeline`}
                  />
                  <div
                    className={`h-full rounded-full ${scoreBar(p.score)}`}
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-muted-foreground">Timeline: {p.timelinePos}% elapsed</span>
                  <span className={p.progressVsTime >= 0 ? 'text-green-600' : 'text-red-500'}>
                    {p.progressVsTime >= 0 ? `↑ ${p.progressVsTime}pts ahead` : `↓ ${Math.abs(p.progressVsTime)}pts behind`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
export function WorkReportsOS() {
  const { tasks, projects, teamMembers, milestones, timeLogs, issues, burndownData } = useExecutionOS();
  const [activeReport, setActiveReport] = useState<ReportType>('velocity');
  const [period, setPeriod] = useState('This Sprint');

  const REPORTS: { key: ReportType; label: string; icon: any; badge?: string }[] = [
    { key: 'velocity',     label: 'Velocity',     icon: Zap },
    { key: 'burndown',     label: 'Burndown',     icon: TrendingDown },
    { key: 'workload',     label: 'Workload',     icon: Users },
    { key: 'timelogs',     label: 'Time Logs',    icon: Clock },
    { key: 'timebyperson', label: 'By Person',    icon: User },
    { key: 'budget',       label: 'Budget',       icon: DollarSign },
    { key: 'billing',      label: 'Billing',      icon: FileSpreadsheet, badge: 'New' },
    { key: 'issues',       label: 'Issues',       icon: Bug },
    { key: 'forecast',     label: 'Forecast',     icon: TrendingUp },
    { key: 'cfd',          label: 'Flow Diagram', icon: Activity },
    { key: 'health',       label: 'Health Score', icon: Shield, badge: 'New' },
  ];

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" /> Work Reports
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Analytics and insights for your execution OS
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 bg-muted p-1 rounded-lg">
              {['This Sprint', 'This Month', 'Last 30d', 'This Quarter', 'YTD'].map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-2.5 py-1.5 rounded text-xs transition-colors ${period === p ? 'bg-card shadow-sm font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {p}
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-3.5 h-3.5 mr-1.5" /> Export
            </Button>
          </div>
        </div>

        {/* Report Tabs */}
        <div className="flex items-center gap-1 mt-4 border-b border-border -mb-px overflow-x-auto">
          {REPORTS.map(r => (
            <button
              key={r.key}
              onClick={() => setActiveReport(r.key)}
              className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 text-sm transition-colors whitespace-nowrap ${
                activeReport === r.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <r.icon className="w-3.5 h-3.5" />
              {r.label}
              {r.badge && (
                <span className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full leading-none">{r.badge}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Report Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto">
          {activeReport === 'velocity'     && <VelocityReport tasks={tasks} />}
          {activeReport === 'burndown'     && <BurndownReport burndownData={burndownData} />}
          {activeReport === 'workload'     && <WorkloadReport teamMembers={teamMembers} tasks={tasks} />}
          {activeReport === 'timelogs'     && <TimeLogsReport timeLogs={timeLogs} />}
          {activeReport === 'timebyperson' && <TimeByPersonReport timeLogs={timeLogs} teamMembers={teamMembers} />}
          {activeReport === 'budget'       && <BudgetReport projects={projects} />}
          {activeReport === 'billing'      && <ClientBillingReport projects={projects} timeLogs={timeLogs} />}
          {activeReport === 'issues'       && <IssuesReport issues={issues} />}
          {activeReport === 'forecast'     && <ForecastReport tasks={tasks} milestones={milestones} />}
          {activeReport === 'cfd'          && <CumulativeFlowReport tasks={tasks} />}
          {activeReport === 'health'       && <ProjectHealthReport projects={projects} tasks={tasks} />}
        </div>
      </div>
    </div>
  );
}
