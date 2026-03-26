import { useState, useMemo } from 'react';
import { Button } from '../../ui/button';
import {
  Users, Zap, AlertTriangle, CheckSquare, Clock, BarChart3,
  ArrowRight, RefreshCw, ChevronDown, ChevronRight,
  TrendingUp, TrendingDown, Sparkles, User, FolderKanban,
  X, Calendar, Shield, Star, Grid3X3, BookOpen
} from 'lucide-react';
import { useExecutionOS } from '../../../contexts/ExecutionOSContext';
import { STATUS_CONFIG, PRIORITY_CONFIG, SKILL_CATEGORIES } from './workTypes';
import type { TeamMember, Task } from './workTypes';

// ── Workload Bar ──────────────────────────────────────────
function WorkloadBar({ load, capacity }: { load: number; capacity: number }) {
  const color = load > 90 ? 'bg-red-500' : load > 75 ? 'bg-orange-400' : load > 50 ? 'bg-blue-500' : 'bg-green-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${Math.min(load, 100)}%` }} />
        {load > 100 && (
          <div className="h-full bg-red-300 rounded-full" style={{ width: `${load - 100}%`, marginLeft: '100%' }} />
        )}
      </div>
      <span className={`text-xs font-semibold w-10 text-right ${load > 90 ? 'text-red-500' : load > 75 ? 'text-orange-500' : 'text-muted-foreground'}`}>
        {load}%
      </span>
    </div>
  );
}

// ── AI Rebalance Suggestion ───────────────────────────────
function AIRebalancePanel({ members, tasks }: { members: TeamMember[]; tasks: Task[] }) {
  const overloaded = members.filter(m => m.currentLoad > 85);
  const underutilized = members.filter(m => m.currentLoad < 60);

  if (overloaded.length === 0) return (
    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="w-4 h-4 text-green-600" />
        <span className="text-sm font-medium text-green-700">AI Workload Analysis</span>
      </div>
      <p className="text-sm text-green-600">Team workload is well balanced. No redistribution needed.</p>
    </div>
  );

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span className="text-sm font-medium text-amber-700">AI Rebalance Suggestions</span>
        </div>
        <Button variant="outline" size="sm" className="text-xs h-7">
          <RefreshCw className="w-3 h-3 mr-1" /> Apply All
        </Button>
      </div>
      <div className="space-y-2">
        {overloaded.slice(0, 3).map((member, i) => {
          const suggestion = underutilized[i % underutilized.length];
          if (!suggestion) return null;
          const memberTasks = tasks.filter(t => t.assignee === member.name && t.status !== 'Closed');
          const transferTask = memberTasks.find(t => t.priority !== 'Critical');

          return (
            <div key={member.id} className="bg-white rounded-lg p-3 border border-amber-200 flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-red-600">{member.name.split(' ')[0]}</span>
                  <span className="text-muted-foreground text-xs">({member.currentLoad}% load)</span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground" />
                  <span className="font-medium text-green-600">{suggestion.name.split(' ')[0]}</span>
                  <span className="text-muted-foreground text-xs">({suggestion.currentLoad}% load)</span>
                </div>
                {transferTask && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Move: <span className="font-medium">{transferTask.title.slice(0, 40)}{transferTask.title.length > 40 ? '...' : ''}</span>
                  </p>
                )}
              </div>
              <Button variant="outline" size="sm" className="text-xs h-7 flex-shrink-0">Apply</Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Member Card ───────────────────────────────────────────
function MemberCard({ member, tasks, expanded, onToggle, projects }: {
  member: TeamMember;
  tasks: Task[];
  expanded: boolean;
  onToggle: () => void;
  projects: any[];
}) {
  const memberTasks = tasks.filter(t => t.assignee === member.name);
  const activeTasks = memberTasks.filter(t => t.status !== 'Closed');
  const overdueTasks = memberTasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'Closed');
  const projectIds = [...new Set(memberTasks.map(t => t.projectId))];
  const memberProjects = projects.filter(p => projectIds.includes(p.id));

  const loadColor = member.currentLoad > 90 ? 'text-red-500' : member.currentLoad > 75 ? 'text-orange-500' : 'text-green-600';
  const loadBg = member.currentLoad > 90 ? 'bg-red-50 border-red-200' : member.currentLoad > 75 ? 'bg-orange-50 border-orange-200' : '';

  return (
    <div className={`bg-card border rounded-xl overflow-hidden transition-all ${member.currentLoad > 90 ? 'border-red-200' : 'border-border'}`}>
      {/* Member Header */}
      <div className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary flex-shrink-0">
            {member.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-medium">{member.name}</h3>
              {member.currentLoad > 90 && (
                <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">Overloaded</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{member.role} · {member.department}</p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 text-xs">
            <div className="text-center">
              <p className="font-semibold">{activeTasks.length}</p>
              <p className="text-muted-foreground">Active</p>
            </div>
            <div className="text-center">
              <p className={`font-semibold ${overdueTasks.length > 0 ? 'text-red-500' : ''}`}>{overdueTasks.length}</p>
              <p className="text-muted-foreground">Overdue</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">{member.capacity}h</p>
              <p className="text-muted-foreground">Capacity</p>
            </div>
            <div className="text-center">
              <p className={`font-semibold ${loadColor}`}>{member.availability}h</p>
              <p className="text-muted-foreground">Available</p>
            </div>
          </div>

          <button
            onClick={onToggle}
            className="p-1.5 hover:bg-accent rounded-lg ml-2"
          >
            {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Workload */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1.5 text-xs">
            <span className="text-muted-foreground">Workload</span>
            <span className={loadColor}>{member.currentLoad}% of {member.capacity}h/week</span>
          </div>
          <WorkloadBar load={member.currentLoad} capacity={member.capacity} />
        </div>

        {/* Project tags */}
        {memberProjects.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {memberProjects.map(p => (
              <span
                key={p.id}
                className="text-xs px-2 py-0.5 rounded-full border"
                style={{ borderColor: p.color, color: p.color, backgroundColor: `${p.color}15` }}
              >
                {p.code}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Expanded: task list */}
      {expanded && (
        <div className="border-t border-border bg-muted/20 p-4">
          {activeTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No active tasks</p>
          ) : (
            <div className="space-y-1.5">
              {activeTasks.map(task => {
                const isOverdue = new Date(task.dueDate) < new Date();
                const statusCfg = STATUS_CONFIG[task.status];
                return (
                  <div key={task.id} className="flex items-center gap-3 py-2 px-3 bg-card rounded-lg border border-border text-sm">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{task.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground">{task.taskId}</span>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: task.projectColor }} />
                        <span className="text-xs text-muted-foreground">{task.projectName}</span>
                      </div>
                    </div>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${statusCfg.bg} ${statusCfg.color}`}>
                      {task.status}
                    </span>
                    <span className={`text-xs ${isOverdue ? 'text-red-500' : 'text-muted-foreground'}`}>
                      {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="text-xs text-muted-foreground">{task.estimate}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Member Detail Panel ───────────────────────────────────
function MemberDetailPanel({ member, tasks, onClose, projects }: {
  member: TeamMember; tasks: Task[]; onClose: () => void; projects: any[];
}) {
  const [activeTab, setActiveTab] = useState<'profile' | 'tasks' | 'capacity'>('profile');

  const memberTasks = tasks.filter(t => t.assignee === member.name);
  const activeTasks = memberTasks.filter(t => t.status !== 'Closed');
  const completedTasks = memberTasks.filter(t => t.status === 'Closed');
  const overdueTasks = memberTasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'Closed');

  const projectIds = [...new Set(memberTasks.map(t => t.projectId))];
  const memberProjects = projects.filter(p => projectIds.includes(p.id));

  const LOAD_COLOR = member.currentLoad > 90 ? '#ef4444' : member.currentLoad > 75 ? '#f97316' : '#22c55e';
  const RING_R = 42;
  const circ = 2 * Math.PI * RING_R;
  const dashOffset = circ - (Math.min(member.currentLoad, 100) / 100) * circ;

  // Next 14 weekdays with deadlines
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const capacityDays = Array.from({ length: 21 }, (_, i) => {
    const d = new Date(today); d.setDate(today.getDate() + i);
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const dateStr = d.toISOString().split('T')[0];
    const dayTasks = memberTasks.filter(t => t.dueDate === dateStr && t.status !== 'Closed');
    return { date: d, dateStr, dayTasks, hours: dayTasks.reduce((s, t) => s + (t.estimatedHours || 0), 0), isWeekend, isToday: i === 0 };
  }).filter(d => !d.isWeekend).slice(0, 10);

  const completionRate = member.assignedTasks > 0 ? Math.round((member.completedTasks / member.assignedTasks) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-[55vw] bg-background border-l border-border flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-card flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                {member.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h2 className="text-lg font-semibold">{member.name}</h2>
                  {member.currentLoad > 90 && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Overloaded</span>}
                  {member.currentLoad < 60 && <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Available</span>}
                </div>
                <p className="text-sm text-muted-foreground">{member.role} · {member.department}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <ArrowRight className="w-3.5 h-3.5 mr-1.5" /> Reassign Tasks
              </Button>
              <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg"><X className="w-4 h-4" /></button>
            </div>
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Workload', value: `${member.currentLoad}%`, color: member.currentLoad > 90 ? 'text-red-600' : member.currentLoad > 75 ? 'text-orange-500' : 'text-green-600' },
              { label: 'Active Tasks', value: activeTasks.length, color: 'text-foreground' },
              { label: 'Capacity', value: `${member.capacity}h/wk`, color: 'text-foreground' },
              { label: 'Available', value: `${member.availability}h`, color: 'text-green-600' },
            ].map((k, i) => (
              <div key={i} className="bg-muted/40 rounded-lg px-3 py-2">
                <p className="text-xs text-muted-foreground">{k.label}</p>
                <p className={`font-semibold ${k.color}`}>{k.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-6 border-b border-border bg-card flex-shrink-0">
          {([ 
            { key: 'profile', label: 'Profile' },
            { key: 'tasks',   label: `Tasks (${activeTasks.length} active)` },
            { key: 'capacity', label: 'Availability' },
          ] as const).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 border-b-2 text-sm transition-colors ${
                activeTab === tab.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">

          {/* ── Profile ──────────────────────────────────── */}
          {activeTab === 'profile' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                {/* Workload Ring */}
                <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-5">
                  <div className="relative flex-shrink-0">
                    <svg width="110" height="110" viewBox="0 0 110 110">
                      <circle cx="55" cy="55" r={RING_R} fill="none" stroke="currentColor" className="text-muted" strokeWidth="10" />
                      <circle
                        cx="55" cy="55" r={RING_R}
                        fill="none"
                        stroke={LOAD_COLOR}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={circ}
                        strokeDashoffset={dashOffset}
                        transform="rotate(-90 55 55)"
                        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold" style={{ color: LOAD_COLOR }}>{member.currentLoad}%</span>
                      <span className="text-xs text-muted-foreground">load</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Capacity</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex gap-2"><span className="text-muted-foreground w-20">Total:</span><span className="font-medium">{member.capacity}h/wk</span></div>
                      <div className="flex gap-2"><span className="text-muted-foreground w-20">Used:</span><span className="font-medium">{Math.round(member.capacity * member.currentLoad / 100)}h</span></div>
                      <div className="flex gap-2"><span className="text-muted-foreground w-20">Available:</span><span className="font-medium text-green-600">{member.availability}h</span></div>
                      <div className="flex gap-2"><span className="text-muted-foreground w-20">Overdue:</span><span className={`font-medium ${overdueTasks.length > 0 ? 'text-red-500' : 'text-green-600'}`}>{overdueTasks.length} tasks</span></div>
                    </div>
                  </div>
                </div>

                {/* Project Breakdown */}
                <div className="bg-card border border-border rounded-xl p-5">
                  <p className="text-sm font-medium mb-3">Project Breakdown</p>
                  {memberProjects.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No projects</p>
                  ) : (
                    memberProjects.map(proj => {
                      const pTasks = memberTasks.filter(t => t.projectId === proj.id);
                      const pct = memberTasks.length ? Math.round((pTasks.length / memberTasks.length) * 100) : 0;
                      return (
                        <div key={proj.id} className="flex items-center gap-2 mb-2.5">
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: proj.color }} />
                          <span className="text-xs flex-1 truncate">{proj.name}</span>
                          <span className="text-xs font-semibold">{pTasks.length}</span>
                          <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: proj.color }} />
                          </div>
                          <span className="text-xs text-muted-foreground w-7 text-right">{pct}%</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Skills */}
              {member.skills && member.skills.length > 0 && (
                <div className="bg-card border border-border rounded-xl p-5">
                  <p className="text-sm font-medium mb-3 flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-primary" /> Skills & Expertise</p>
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map(skill => (
                      <span key={skill} className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Sprint Performance */}
              <div className="bg-card border border-border rounded-xl p-5">
                <p className="text-sm font-medium mb-3 flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-amber-500" /> Sprint Performance</p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-muted/40 rounded-lg p-3">
                    <p className="text-xl font-bold text-green-600">{member.completedTasks}</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                  <div className="bg-muted/40 rounded-lg p-3">
                    <p className="text-xl font-bold text-blue-600">{activeTasks.length}</p>
                    <p className="text-xs text-muted-foreground">In Progress</p>
                  </div>
                  <div className="bg-muted/40 rounded-lg p-3">
                    <p className="text-xl font-bold">{completionRate}%</p>
                    <p className="text-xs text-muted-foreground">Completion Rate</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-green-500" style={{ width: `${completionRate}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground">{member.completedTasks}/{member.assignedTasks} tasks</span>
                </div>
              </div>
            </div>
          )}

          {/* ── Tasks ────────────────────────────────────── */}
          {activeTab === 'tasks' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
                <span>{activeTasks.length} active</span>
                <span className="text-border">·</span>
                <span>{overdueTasks.length > 0 ? <span className="text-red-500">{overdueTasks.length} overdue</span> : '0 overdue'}</span>
                <span className="text-border">·</span>
                <span>{completedTasks.length} completed</span>
              </div>
              {memberTasks.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <CheckSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No tasks assigned</p>
                </div>
              ) : (
                memberTasks.map(task => {
                  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Closed';
                  return (
                    <div key={task.id} className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: task.projectColor || '#94a3b8' }} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm truncate ${task.status === 'Closed' ? 'line-through text-muted-foreground' : ''}`}>{task.title}</p>
                        <p className="text-xs text-muted-foreground">{task.taskId} · {task.projectName}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                        task.status === 'Overdue' ? 'bg-red-100 text-red-700' :
                        task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                        task.status === 'Closed' ? 'bg-green-100 text-green-700' :
                        task.status === 'To Be Tested' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>{task.status}</span>
                      <span className={`text-xs flex-shrink-0 ${isOverdue ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
                        {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="text-xs text-muted-foreground flex-shrink-0">{task.estimate}</span>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* ── Capacity Calendar ─────────────────────────── */}
          {activeTab === 'capacity' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Task deadlines over the next 2 working weeks</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500" /> Normal</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-500" /> Busy</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /> Overloaded</span>
                </div>
              </div>
              <div className="space-y-2">
                {capacityDays.map(day => {
                  const pct = (day.hours / 8) * 100;
                  const barColor = pct > 100 ? 'bg-red-500' : pct > 75 ? 'bg-orange-500' : pct > 0 ? 'bg-blue-500' : 'bg-muted';
                  return (
                    <div key={day.dateStr} className={`flex items-start gap-4 p-3 rounded-xl border ${day.isToday ? 'border-primary/40 bg-primary/5' : 'border-border bg-card'}`}>
                      <div className={`w-14 text-center flex-shrink-0 ${day.isToday ? 'text-primary' : ''}`}>
                        <p className="text-xs text-muted-foreground">{day.date.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                        <p className={`font-bold text-lg leading-tight ${day.isToday ? 'text-primary' : ''}`}>{day.date.getDate()}</p>
                        <p className="text-xs text-muted-foreground">{day.date.toLocaleDateString('en-US', { month: 'short' })}</p>
                      </div>

                      <div className="flex-1 min-w-0">
                        {day.dayTasks.length === 0 ? (
                          <p className="text-xs text-muted-foreground py-1">No tasks due — available</p>
                        ) : (
                          <div className="space-y-1">
                            {day.dayTasks.map(t => (
                              <div key={t.id} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: t.projectColor || '#94a3b8' }} />
                                <span className="text-xs truncate flex-1">{t.title}</span>
                                <span className="text-xs text-muted-foreground">{t.estimate}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="w-20 flex-shrink-0">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                        </div>
                        <p className="text-xs text-muted-foreground text-right mt-1">{day.hours.toFixed(1)}h / 8h</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Skill Matrix ──────────────────────────────────────────
function SkillMatrixView({ members, skillRatings }: { members: TeamMember[]; skillRatings: any[] }) {
  const [hovered, setHovered] = useState<{ memberId: string; skill: string } | null>(null);
  const [filterDept, setFilterDept] = useState('all');
  const departments = ['all', ...new Set(members.map(m => m.department))];

  const filteredMembers = filterDept === 'all' ? members : members.filter(m => m.department === filterDept);

  const getRating = (memberName: string, skill: string): number => {
    const r = skillRatings.find(r => r.memberName === memberName && r.skill === skill);
    return r?.rating ?? 0;
  };

  const cellStyle = (rating: number) => {
    if (rating === 0) return { bg: 'bg-muted/30', text: 'text-muted-foreground/40', border: 'border-border' };
    if (rating === 1) return { bg: 'bg-blue-50',   text: 'text-blue-500',   border: 'border-blue-100' };
    if (rating === 2) return { bg: 'bg-blue-100',  text: 'text-blue-600',   border: 'border-blue-200' };
    if (rating === 3) return { bg: 'bg-indigo-100',text: 'text-indigo-700', border: 'border-indigo-200' };
    if (rating === 4) return { bg: 'bg-violet-100',text: 'text-violet-700', border: 'border-violet-200' };
    return { bg: 'bg-purple-200', text: 'text-purple-800', border: 'border-purple-300' };
  };

  const ratingLabel = ['—', 'Novice', 'Learning', 'Proficient', 'Advanced', 'Expert'];
  const ratingEmoji = ['', '🌱', '📘', '✅', '⭐', '🏆'];

  // Column stats (avg rating, expert count)
  const skillStats = SKILL_CATEGORIES.map(skill => {
    const ratings = filteredMembers.map(m => getRating(m.name, skill));
    const avg = ratings.reduce((s, r) => s + r, 0) / ratings.length;
    const experts = ratings.filter(r => r >= 4).length;
    const coverage = Math.round((ratings.filter(r => r > 0).length / ratings.length) * 100);
    return { skill, avg, experts, coverage };
  });

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/20">
        <div>
          <h3 className="font-semibold flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" /> Skill Matrix
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">Team competency heat map — {filteredMembers.length} members × {SKILL_CATEGORIES.length} skills</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Department filter */}
          <div className="flex items-center gap-1">
            {departments.map(dept => (
              <button
                key={dept}
                onClick={() => setFilterDept(dept)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  filterDept === dept ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/50'
                }`}
              >
                {dept === 'all' ? 'All' : dept}
              </button>
            ))}
          </div>
          {/* Legend */}
          <div className="flex items-center gap-1.5 text-xs">
            {[1,2,3,4,5].map(r => {
              const s = cellStyle(r);
              return (
                <span key={r} className={`px-2 py-0.5 rounded border ${s.bg} ${s.text} ${s.border}`}>
                  {ratingLabel[r]}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-muted/50 px-4 py-3 text-left font-medium text-muted-foreground w-36 border-b border-r border-border">
                Member
              </th>
              {SKILL_CATEGORIES.map(skill => (
                <th key={skill} className="px-2 py-3 text-center border-b border-border min-w-[88px] bg-muted/30">
                  <div className="font-medium text-muted-foreground leading-tight">{skill.split('/')[0]}</div>
                  {skill.includes('/') && <div className="text-muted-foreground/60">{skill.split('/')[1]}</div>}
                </th>
              ))}
              <th className="px-3 py-3 text-center border-b border-border bg-muted/40 min-w-[64px]">
                <div className="font-medium text-muted-foreground">Avg</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map(member => {
              const memberRatings = SKILL_CATEGORIES.map(skill => getRating(member.name, skill));
              const avgRating = (memberRatings.reduce((s, r) => s + r, 0) / memberRatings.length).toFixed(1);
              const expertSkills = memberRatings.filter(r => r >= 4).length;
              return (
                <tr key={member.id} className="border-b border-border hover:bg-accent/10 transition-colors">
                  <td className="sticky left-0 z-10 bg-card px-4 py-2.5 border-r border-border">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0 ${
                        member.currentLoad > 90 ? 'bg-red-500' : member.currentLoad > 75 ? 'bg-orange-400' : 'bg-primary'
                      }`}>
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{member.name.split(' ')[0]}</p>
                        <p className="text-muted-foreground text-xs truncate max-w-[80px]">{member.role.split(' ').slice(0, 2).join(' ')}</p>
                      </div>
                    </div>
                  </td>
                  {SKILL_CATEGORIES.map(skill => {
                    const rating = getRating(member.name, skill);
                    const s = cellStyle(rating);
                    const isHovered = hovered?.memberId === member.id && hovered?.skill === skill;
                    return (
                      <td
                        key={skill}
                        className="px-1.5 py-1.5 border-r border-border relative"
                        onMouseEnter={() => rating > 0 && setHovered({ memberId: member.id, skill })}
                        onMouseLeave={() => setHovered(null)}
                      >
                        <div className={`rounded-lg border py-2 text-center transition-all cursor-default ${s.bg} ${s.border} ${rating > 0 ? 'hover:scale-105' : ''}`}>
                          {rating > 0 ? (
                            <div>
                              <p className="text-sm">{ratingEmoji[rating]}</p>
                              <p className={`font-semibold text-xs ${s.text}`}>{rating}/5</p>
                            </div>
                          ) : (
                            <p className="text-muted-foreground/30 py-1">—</p>
                          )}
                        </div>
                        {/* Tooltip */}
                        {isHovered && (
                          <div className="absolute z-50 top-full left-1/2 -translate-x-1/2 mt-1 w-40 bg-card border border-border rounded-xl shadow-2xl p-2.5 text-center pointer-events-none">
                            <p className="font-semibold text-xs mb-0.5">{member.name.split(' ')[0]}</p>
                            <p className="text-muted-foreground text-xs mb-1">{skill}</p>
                            <p className={`font-bold ${s.text}`}>{ratingEmoji[rating]} {ratingLabel[rating]}</p>
                            <p className="text-muted-foreground text-xs">{rating}/5</p>
                          </div>
                        )}
                      </td>
                    );
                  })}
                  {/* Avg column */}
                  <td className="px-3 py-1.5 text-center bg-muted/20">
                    <p className="font-bold text-sm">{avgRating}</p>
                    <p className="text-muted-foreground">{expertSkills} exp.</p>
                  </td>
                </tr>
              );
            })}

            {/* Column averages footer */}
            <tr className="border-t-2 border-border bg-muted/40">
              <td className="sticky left-0 z-10 bg-muted/40 px-4 py-2.5 border-r border-border">
                <p className="font-semibold text-muted-foreground text-xs">Team Avg</p>
              </td>
              {skillStats.map(stat => {
                const s = cellStyle(Math.round(stat.avg));
                return (
                  <td key={stat.skill} className="px-1.5 py-2 text-center border-r border-border">
                    <p className={`font-bold ${s.text}`}>{stat.avg.toFixed(1)}</p>
                    <p className="text-muted-foreground text-xs">{stat.experts} exp.</p>
                    <div className="w-full h-1 bg-muted rounded-full overflow-hidden mt-1">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${(stat.avg / 5) * 100}%` }} />
                    </div>
                  </td>
                );
              })}
              <td className="px-3 py-2 text-center">
                <p className="font-bold text-primary text-sm">
                  {(skillStats.reduce((s, d) => s + d.avg, 0) / skillStats.length).toFixed(1)}
                </p>
                <p className="text-muted-foreground text-xs">overall</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Gap Analysis */}
      <div className="px-5 py-4 border-t border-border bg-muted/10">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Skill Gap Analysis</h4>
        <div className="grid grid-cols-4 gap-3">
          {skillStats.sort((a, b) => a.avg - b.avg).slice(0, 4).map(stat => (
            <div key={stat.skill} className="bg-card border border-border rounded-lg px-3 py-2">
              <p className="text-xs font-medium truncate">{stat.skill}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-orange-400" style={{ width: `${(stat.avg / 5) * 100}%` }} />
                </div>
                <span className="text-xs text-orange-600 font-medium">{stat.avg.toFixed(1)}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{100 - stat.coverage}% gap</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Capacity Planning Grid ────────────────────────────────
function CapacityPlanningGrid({ members, tasks }: { members: TeamMember[]; tasks: Task[] }) {
  const [hoveredCell, setHoveredCell] = useState<{ memberId: string; dateStr: string } | null>(null);

  // Build 10 working days from today
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const workDays: { date: Date; dateStr: string; label: string; dayLabel: string; isToday: boolean }[] = [];
  let d = new Date(today);
  while (workDays.length < 10) {
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) {
      const dateStr = d.toISOString().split('T')[0];
      workDays.push({
        date: new Date(d),
        dateStr,
        label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        dayLabel: d.toLocaleDateString('en-US', { weekday: 'short' }),
        isToday: dateStr === today.toISOString().split('T')[0],
      });
    }
    d.setDate(d.getDate() + 1);
  }

  // Compute cell data: hours of tasks due on that day per member
  const getCellData = (memberName: string, dateStr: string) => {
    const cellTasks = tasks.filter(t =>
      t.assignee === memberName &&
      t.dueDate === dateStr &&
      t.status !== 'Closed'
    );
    const hours = cellTasks.reduce((s, t) => s + (t.estimatedHours || 0), 0);
    return { tasks: cellTasks, hours };
  };

  const cellColor = (hours: number) => {
    if (hours === 0) return 'bg-background text-muted-foreground/40';
    if (hours <= 3) return 'bg-green-100 text-green-700';
    if (hours <= 5) return 'bg-blue-100 text-blue-700';
    if (hours <= 7) return 'bg-yellow-100 text-yellow-700';
    if (hours <= 8) return 'bg-orange-100 text-orange-700';
    return 'bg-red-100 text-red-700';
  };

  const cellBorder = (hours: number, isToday: boolean) => {
    if (isToday) return 'border-blue-300 border-2';
    if (hours > 8) return 'border-red-200';
    if (hours > 6) return 'border-orange-200';
    return 'border-border';
  };

  // Column totals
  const dayTotals = workDays.map(day => {
    const totalHours = members.reduce((s, m) => s + getCellData(m.name, day.dateStr).hours, 0);
    const utilizationPct = Math.round((totalHours / (members.length * 8)) * 100);
    return { totalHours, utilizationPct };
  });

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/20">
        <div>
          <h3 className="font-semibold flex items-center gap-2">
            <Grid3X3 className="w-4 h-4 text-primary" /> Capacity Planning Grid
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Task due-date hours per team member over the next 10 working days
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          {[
            { color: 'bg-green-100', label: '1–3h' },
            { color: 'bg-blue-100', label: '3–5h' },
            { color: 'bg-yellow-100', label: '5–7h' },
            { color: 'bg-orange-100', label: '7–8h' },
            { color: 'bg-red-100', label: '8h+' },
          ].map(l => (
            <span key={l.label} className="flex items-center gap-1">
              <span className={`w-3 h-3 rounded ${l.color}`} />
              {l.label}
            </span>
          ))}
        </div>
      </div>

      <div className="overflow-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-muted/50 px-4 py-2.5 text-left font-medium text-muted-foreground w-40 border-b border-r border-border">
                Team Member
              </th>
              {workDays.map(day => (
                <th
                  key={day.dateStr}
                  className={`px-2 py-2 text-center border-b border-border min-w-[72px] ${day.isToday ? 'bg-blue-50' : 'bg-muted/30'}`}
                >
                  <p className="font-medium text-muted-foreground">{day.dayLabel}</p>
                  <p className={`font-semibold ${day.isToday ? 'text-blue-600' : ''}`}>{day.label}</p>
                </th>
              ))}
              <th className="px-3 py-2 text-center border-b border-border bg-muted/40 min-w-[64px]">
                <p className="font-medium text-muted-foreground">Σ</p>
                <p className="font-semibold">Total</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {members.map(member => {
              const rowTotal = workDays.reduce((s, day) => s + getCellData(member.name, day.dateStr).hours, 0);
              return (
                <tr key={member.id} className="border-b border-border hover:bg-accent/20 transition-colors">
                  <td className="sticky left-0 z-10 bg-card px-4 py-2 border-r border-border">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0 ${
                        member.currentLoad > 90 ? 'bg-red-500' : member.currentLoad > 75 ? 'bg-orange-400' : 'bg-primary'
                      }`}>
                        {member.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{member.name.split(' ')[0]}</p>
                        <p className="text-muted-foreground truncate">{member.role.split(' ').slice(-1)[0]}</p>
                      </div>
                    </div>
                  </td>
                  {workDays.map(day => {
                    const cell = getCellData(member.name, day.dateStr);
                    const isHovered = hoveredCell?.memberId === member.id && hoveredCell?.dateStr === day.dateStr;
                    return (
                      <td key={day.dateStr} className={`px-1.5 py-1.5 border-r border-border relative ${day.isToday ? 'bg-blue-50/30' : ''}`}>
                        <div
                          className={`relative rounded-lg border text-center py-1.5 transition-all cursor-default ${cellColor(cell.hours)} ${cellBorder(cell.hours, day.isToday)} ${cell.hours > 0 ? 'hover:scale-105' : ''}`}
                          onMouseEnter={() => cell.hours > 0 && setHoveredCell({ memberId: member.id, dateStr: day.dateStr })}
                          onMouseLeave={() => setHoveredCell(null)}
                        >
                          {cell.hours > 0 ? (
                            <div>
                              <p className="font-bold">{cell.hours.toFixed(0)}h</p>
                              <p className="opacity-70">{cell.tasks.length}t</p>
                            </div>
                          ) : (
                            <p className="text-muted-foreground/30">—</p>
                          )}

                          {/* Tooltip */}
                          {isHovered && cell.tasks.length > 0 && (
                            <div className="absolute z-50 top-full left-1/2 -translate-x-1/2 mt-1 w-52 bg-card border border-border rounded-xl shadow-2xl p-3 text-left pointer-events-none">
                              <p className="font-semibold text-foreground mb-1.5">{day.label} — {cell.hours.toFixed(1)}h</p>
                              <div className="space-y-1">
                                {cell.tasks.map(t => (
                                  <div key={t.id} className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: t.projectColor || '#94a3b8' }} />
                                    <span className="truncate">{t.title.slice(0, 28)}{t.title.length > 28 ? '…' : ''}</span>
                                    <span className="ml-auto font-medium flex-shrink-0">{t.estimate}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                  <td className="px-3 py-1.5 text-center bg-muted/20">
                    <p className={`font-bold ${rowTotal > 50 ? 'text-red-600' : rowTotal > 35 ? 'text-orange-500' : 'text-foreground'}`}>
                      {rowTotal.toFixed(0)}h
                    </p>
                    <p className="text-muted-foreground">{Math.round((rowTotal / 80) * 100)}%</p>
                  </td>
                </tr>
              );
            })}

            {/* Column totals row */}
            <tr className="border-t-2 border-border bg-muted/40">
              <td className="sticky left-0 z-10 bg-muted/40 px-4 py-2 border-r border-border">
                <p className="font-semibold text-muted-foreground">Team Total</p>
              </td>
              {dayTotals.map((day, i) => (
                <td key={i} className="px-1.5 py-2 text-center border-r border-border">
                  <p className={`font-bold ${day.utilizationPct > 100 ? 'text-red-600' : day.utilizationPct > 75 ? 'text-orange-500' : 'text-foreground'}`}>
                    {day.totalHours.toFixed(0)}h
                  </p>
                  <p className="text-muted-foreground">{day.utilizationPct}%</p>
                </td>
              ))}
              <td className="px-3 py-2 text-center">
                <p className="font-bold text-primary">{dayTotals.reduce((s, d) => s + d.totalHours, 0).toFixed(0)}h</p>
                <p className="text-muted-foreground">10d</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
export function WorkAssignmentsOS() {
  const { teamMembers, tasks, projects, skillRatings, changeTaskStatus } = useExecutionOS();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'load' | 'name' | 'tasks'>('load');
  const [expandedMembers, setExpandedMembers] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'cards' | 'heatmap' | 'capacity' | 'skills'>('cards');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const departments = [...new Set(teamMembers.map(m => m.department))];

  const filtered = useMemo(() => {
    const f = teamMembers.filter(m => {
      const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.role.toLowerCase().includes(search.toLowerCase());
      const matchDept = deptFilter === 'all' || m.department === deptFilter;
      return matchSearch && matchDept;
    });

    return [...f].sort((a, b) => {
      if (sortBy === 'load') return b.currentLoad - a.currentLoad;
      if (sortBy === 'tasks') return b.assignedTasks - a.assignedTasks;
      return a.name.localeCompare(b.name);
    });
  }, [teamMembers, search, deptFilter, sortBy]);

  const toggleMember = (id: string) => {
    setExpandedMembers(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Stats
  const avgLoad = Math.round(teamMembers.reduce((s, m) => s + m.currentLoad, 0) / teamMembers.length);
  const overloaded = teamMembers.filter(m => m.currentLoad > 90).length;
  const totalCapacity = teamMembers.reduce((s, m) => s + m.capacity, 0);
  const totalAvailable = teamMembers.reduce((s, m) => s + (m.availability || 0), 0);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="px-6 py-5 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> Assignments
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Team workload & task distribution
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
              <button onClick={() => setViewMode('cards')} className={`px-2.5 py-1.5 rounded text-xs ${viewMode === 'cards' ? 'bg-card shadow-sm' : 'text-muted-foreground'}`}>
                Cards
              </button>
              <button onClick={() => setViewMode('heatmap')} className={`px-2.5 py-1.5 rounded text-xs ${viewMode === 'heatmap' ? 'bg-card shadow-sm' : 'text-muted-foreground'}`}>
                Heatmap
              </button>
              <button onClick={() => setViewMode('capacity')} className={`px-2.5 py-1.5 rounded text-xs flex items-center gap-1 ${viewMode === 'capacity' ? 'bg-card shadow-sm' : 'text-muted-foreground'}`}>
                <Grid3X3 className="w-3 h-3" /> Capacity
              </button>
              <button onClick={() => setViewMode('skills')} className={`px-2.5 py-1.5 rounded text-xs flex items-center gap-1 ${viewMode === 'skills' ? 'bg-card shadow-sm' : 'text-muted-foreground'}`}>
                <BookOpen className="w-3 h-3" /> Skills
              </button>
            </div>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          {[
            { label: 'Avg Load',       value: `${avgLoad}%`,    icon: BarChart3,   color: avgLoad > 85 ? 'text-red-500' : 'text-primary' },
            { label: 'Overloaded',     value: overloaded,       icon: AlertTriangle, color: overloaded > 0 ? 'text-red-500' : 'text-green-600' },
            { label: 'Team Capacity',  value: `${totalCapacity}h/wk`, icon: Clock, color: 'text-primary' },
            { label: 'Available Hrs',  value: `${totalAvailable}h`, icon: TrendingUp, color: 'text-green-600' },
          ].map((k, i) => {
            const Icon = k.icon;
            return (
              <div key={i} className="bg-muted/40 rounded-xl px-4 py-3 flex items-center gap-3">
                <Icon className={`w-4 h-4 ${k.color}`} />
                <div>
                  <p className={`font-semibold ${k.color}`}>{k.value}</p>
                  <p className="text-xs text-muted-foreground">{k.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-border bg-background">
        <div className="relative flex-1 max-w-xs">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            className="w-full pl-9 pr-3 py-1.5 text-sm border border-border rounded-lg bg-background focus:outline-none"
            placeholder="Search team members..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background"
          value={deptFilter}
          onChange={e => setDeptFilter(e.target.value)}
        >
          <option value="all">All Departments</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select
          className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background"
          value={sortBy}
          onChange={e => setSortBy(e.target.value as 'load' | 'name' | 'tasks')}
        >
          <option value="load">Sort: Highest Load</option>
          <option value="tasks">Sort: Most Tasks</option>
          <option value="name">Sort: Name A–Z</option>
        </select>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className={`${viewMode === 'capacity' || viewMode === 'skills' ? 'max-w-full' : 'max-w-5xl'} mx-auto space-y-4`}>
          {/* AI Panel — only for cards/heatmap */}
          {viewMode !== 'capacity' && viewMode !== 'skills' && <AIRebalancePanel members={teamMembers} tasks={tasks} />}

          {viewMode === 'capacity' && (
            <CapacityPlanningGrid members={filtered} tasks={tasks} />
          )}

          {viewMode === 'skills' && (
            <SkillMatrixView members={filtered} skillRatings={skillRatings} />
          )}

          {viewMode !== 'capacity' && viewMode !== 'skills' && viewMode === 'heatmap' ? (
            /* Heatmap view */
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-medium mb-4">Workload Distribution by Project</h3>
              <div className="mb-3 flex items-center gap-3 flex-wrap">
                {projects.map(p => (
                  <div key={p.id} className="flex items-center gap-1.5 text-xs">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: p.color }} />
                    <span className="text-muted-foreground">{p.code}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {filtered.map(member => {
                  const memberTasks = tasks.filter(t => t.assignee === member.name && t.status !== 'Closed');
                  const projectGroups = projects.reduce((acc, project) => {
                    const count = memberTasks.filter(t => t.projectId === project.id).length;
                    if (count > 0) acc.push({ project, count });
                    return acc;
                  }, [] as { project: any; count: number }[]);
                  const overdueMember = memberTasks.filter(t => new Date(t.dueDate) < new Date()).length;

                  return (
                    <div key={member.id} className="flex items-center gap-4">
                      <button
                        className="w-32 flex-shrink-0 text-left hover:text-primary transition-colors"
                        onClick={() => setSelectedMember(member)}
                      >
                        <p className="text-sm font-medium">{member.name.split(' ')[0]}</p>
                        <p className="text-xs text-muted-foreground">{member.currentLoad}% load{overdueMember > 0 ? ` · ${overdueMember} overdue` : ''}</p>
                      </button>
                      <div className="flex-1 flex gap-0.5 rounded overflow-hidden h-7">
                        {projectGroups.map(({ project, count }) => (
                          <div
                            key={project.id}
                            className="relative flex items-center justify-center text-white text-xs font-medium"
                            style={{
                              width: `${(count / memberTasks.length) * 100}%`,
                              minWidth: 20,
                              backgroundColor: project.color,
                            }}
                            title={`${project.name}: ${count} tasks`}
                          >
                            {count > 1 ? count : ''}
                          </div>
                        ))}
                        {memberTasks.length === 0 && (
                          <div className="flex-1 bg-muted flex items-center justify-center text-xs text-muted-foreground">
                            No active tasks
                          </div>
                        )}
                      </div>
                      <div className="w-20 flex-shrink-0">
                        <WorkloadBar load={member.currentLoad} capacity={member.capacity} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border">
                {projects.map(p => (
                  <div key={p.id} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: p.color }} />
                    {p.name}
                  </div>
                ))}
              </div>
            </div>
          ) : viewMode === 'cards' ? (
            /* Cards view */
            <>
              {filtered.map(member => (
                <div key={member.id} className="relative">
                  <MemberCard
                    member={member}
                    tasks={tasks}
                    expanded={expandedMembers.has(member.id)}
                    onToggle={() => toggleMember(member.id)}
                    projects={projects}
                  />
                  <button
                    onClick={() => setSelectedMember(member)}
                    className="absolute top-4 right-14 text-xs text-primary hover:underline"
                  >
                    View Profile
                  </button>
                </div>
              ))}
            </>
          ) : null}
        </div>
      </div>
      {selectedMember && (
        <MemberDetailPanel member={selectedMember} tasks={tasks} onClose={() => setSelectedMember(null)} projects={projects} />
      )}
    </div>
  );
}