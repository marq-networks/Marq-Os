import { useState, useMemo, useEffect } from 'react';
import { Button } from '../../ui/button';
import {
  CheckSquare, Clock, AlertTriangle, TrendingUp, Check,
  Plus, ChevronRight, Zap, Target, Calendar, BarChart3,
  Coffee, Sparkles, FolderKanban, RefreshCw,
  Play, Pause, StopCircle, MessageSquare, GitBranch,
  Flag, Timer, Activity, X, Edit, Star, Brain, Trophy,
  ClipboardList, Copy, CheckCheck, ChevronDown, Bot
} from 'lucide-react';
import { useExecutionOS } from '../../../contexts/ExecutionOSContext';
import { STATUS_CONFIG, PRIORITY_CONFIG } from './workTypes';
import type { Task, ActivityEntry } from './workMockData';

const CURRENT_USER = 'Sarah Chen';

// ─── Status Pill ──────────────────────────────────────────
function StatusPill({ status }: { status: Task['status'] }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ─── Priority Badge ───────────────────────────────────────
function PriorityDot({ priority }: { priority: Task['priority'] }) {
  const cfg = PRIORITY_CONFIG[priority];
  return (
    <span className={`text-xs px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

// ─── Task Row ─────────────────────────────────────────────
function TaskRow({ task, onStatusChange, onStartTimer }: {
  task: Task;
  onStatusChange: (id: string, status: Task['status']) => void;
  onStartTimer: (task: Task) => void;
}) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const due = new Date(task.dueDate); due.setHours(0, 0, 0, 0);
  const isOverdue = due < today && task.status !== 'Closed';
  const daysUntil = Math.round((due.getTime() - today.getTime()) / 86400000);

  const dueLabel = isOverdue
    ? `${Math.abs(daysUntil)}d overdue`
    : daysUntil === 0 ? 'Today'
    : daysUntil === 1 ? 'Tomorrow'
    : `${daysUntil}d`;

  return (
    <div className="flex items-center gap-3 px-3 py-2.5 hover:bg-accent/50 rounded-lg transition-colors group cursor-pointer">
      {/* Checkbox */}
      <button
        onClick={e => { e.stopPropagation(); onStatusChange(task.id, task.status === 'Closed' ? 'Open' : 'Closed'); }}
        className={`flex-shrink-0 w-4 h-4 rounded border-2 transition-all flex items-center justify-center ${
          task.status === 'Closed' ? 'bg-green-500 border-green-500' : 'border-border hover:border-primary'
        }`}
      >
        {task.status === 'Closed' && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
      </button>

      {/* Color dot */}
      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: task.projectColor || '#94a3b8' }} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm truncate ${task.status === 'Closed' ? 'line-through text-muted-foreground' : ''}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted-foreground truncate">{task.projectName}</span>
          <span className="text-muted-foreground/40 text-xs">·</span>
          <span className="text-xs font-mono text-muted-foreground">{task.taskId}</span>
          {task.subtasks && task.subtasks.length > 0 && (
            <>
              <span className="text-muted-foreground/40 text-xs">·</span>
              <span className="text-xs text-muted-foreground">
                {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} subtasks
              </span>
            </>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 flex-shrink-0 opacity-100 group-hover:opacity-100">
        <PriorityDot priority={task.priority} />
        <StatusPill status={task.status} />
        <span className={`text-xs font-medium min-w-[72px] text-right ${isOverdue ? 'text-red-500' : daysUntil === 0 ? 'text-orange-500' : 'text-muted-foreground'}`}>
          {dueLabel}
        </span>
        <span className="text-xs text-muted-foreground w-8 text-right">{task.estimate}</span>

        {/* Timer button */}
        {task.status === 'In Progress' && (
          <button
            onClick={e => { e.stopPropagation(); onStartTimer(task); }}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-blue-50 rounded text-blue-500 transition-all"
            title="Log time"
          >
            <Timer className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── AI Insight ───────────────────────────────────────────
function AIInsightCard({ tasks }: { tasks: Task[] }) {
  const overdue = tasks.filter(t => {
    const d = new Date(t.dueDate); d.setHours(0,0,0,0);
    const today = new Date(); today.setHours(0,0,0,0);
    return d < today && t.status !== 'Closed';
  }).length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const totalHrs = tasks.filter(t => t.status !== 'Closed').reduce((s, t) => s + (t.estimatedHours || 0), 0);

  const insight =
    overdue > 2 ? { icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-800', msg: `You have ${overdue} overdue tasks. Consider rescheduling or requesting assistance.` }
    : inProgress > 4 ? { icon: Zap, color: 'text-blue-500', bg: 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800', msg: `${inProgress} tasks in flight simultaneously. Focus on 2–3 for higher quality output.` }
    : totalHrs > 50 ? { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800', msg: `${totalHrs.toFixed(0)}h estimated remaining. You may be overcommitted this sprint.` }
    : { icon: Sparkles, color: 'text-green-500', bg: 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800', msg: 'Workload looks balanced. Great job staying on top of your tasks!' };

  const Icon = insight.icon;
  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl border ${insight.bg}`}>
      <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${insight.color}`} />
      <div>
        <p className="text-xs font-semibold mb-0.5 flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> AI Workload Insight
        </p>
        <p className="text-xs text-muted-foreground">{insight.msg}</p>
      </div>
    </div>
  );
}

// ─── Time Tracker Widget ──────────────────────────────────
function TimeTrackerWidget({ activeTask, onStop }: { activeTask: Task | null; onStop: () => void }) {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!activeTask) { setSeconds(0); setRunning(false); return; }
    setRunning(true);
  }, [activeTask]);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [running]);

  const format = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  if (!activeTask) {
    return (
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium flex items-center gap-1.5">
            <Timer className="w-4 h-4 text-muted-foreground" /> Time Tracker
          </h3>
        </div>
        <div className="text-center py-3">
          <p className="text-2xl font-mono text-muted-foreground/40">00:00:00</p>
          <p className="text-xs text-muted-foreground mt-1">No active task</p>
          <p className="text-xs text-muted-foreground">Hover a task and click ⏱ to start</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 dark:bg-blue-950/30 dark:border-blue-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold flex items-center gap-1.5 text-blue-700 dark:text-blue-300">
          <Timer className="w-4 h-4" /> Time Tracker
        </h3>
        <div className="flex items-center gap-1">
          <button onClick={() => setRunning(r => !r)} className="p-1 hover:bg-blue-100 rounded">
            {running ? <Pause className="w-3.5 h-3.5 text-blue-600" /> : <Play className="w-3.5 h-3.5 text-blue-600" />}
          </button>
          <button onClick={onStop} className="p-1 hover:bg-red-50 rounded">
            <StopCircle className="w-3.5 h-3.5 text-red-400" />
          </button>
        </div>
      </div>
      <p className="text-3xl font-mono font-bold text-blue-700 dark:text-blue-300 text-center my-1">
        {format(seconds)}
      </p>
      <p className="text-xs text-blue-600 dark:text-blue-400 truncate text-center">{activeTask.title}</p>
    </div>
  );
}

// ─── Activity Feed ────────────────────────────────────────
const ACTIVITY_ICONS: Record<ActivityEntry['type'], { icon: any; color: string }> = {
  task_completed:  { icon: Check,         color: 'text-green-500 bg-green-100' },
  task_started:    { icon: Play,          color: 'text-blue-500 bg-blue-100' },
  comment_added:   { icon: MessageSquare, color: 'text-purple-500 bg-purple-100' },
  status_changed:  { icon: RefreshCw,     color: 'text-orange-500 bg-orange-100' },
  task_assigned:   { icon: CheckSquare,   color: 'text-primary bg-primary/10' },
  milestone_reached:{ icon: Target,       color: 'text-yellow-600 bg-yellow-100' },
  sprint_started:  { icon: Zap,           color: 'text-indigo-500 bg-indigo-100' },
  task_created:    { icon: Plus,          color: 'text-emerald-600 bg-emerald-100' },
  task_updated:    { icon: RefreshCw,     color: 'text-sky-600 bg-sky-100' },
  task_deleted:    { icon: X,             color: 'text-red-500 bg-red-100' },
  email_created:   { icon: MessageSquare, color: 'text-cyan-600 bg-cyan-100' },
  email_deleted:   { icon: X,             color: 'text-rose-600 bg-rose-100' },
  email_linked:    { icon: GitBranch,     color: 'text-violet-600 bg-violet-100' },
  project_created: { icon: FolderKanban,  color: 'text-blue-600 bg-blue-100' },
  project_deleted: { icon: X,             color: 'text-red-500 bg-red-100' },
  milestone_created:{ icon: Target,       color: 'text-amber-600 bg-amber-100' },
  milestone_deleted:{ icon: X,            color: 'text-red-500 bg-red-100' },
  sprint_created:  { icon: Zap,           color: 'text-indigo-600 bg-indigo-100' },
  sprint_deleted:  { icon: X,             color: 'text-red-500 bg-red-100' },
};

function ActivityFeed({ entries }: { entries: ActivityEntry[] }) {
  const timeAgo = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(diff / 86400000);
    return d > 0 ? `${d}d ago` : h > 0 ? `${h}h ago` : 'Just now';
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-muted-foreground" /> Recent Activity
        </h3>
        <span className="text-xs text-muted-foreground">{entries.length} events</span>
      </div>
      <div className="space-y-3 max-h-64 overflow-auto">
        {entries.slice(0, 10).map(entry => {
          const { icon: Icon, color } = ACTIVITY_ICONS[entry.type];
          return (
            <div key={entry.id} className="flex items-start gap-2.5">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${color.split(' ')[1]}`}>
                <Icon className={`w-3 h-3 ${color.split(' ')[0]}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs leading-relaxed">
                  <span className="font-medium">{entry.actor.split(' ')[0]}</span>
                  {' '}<span className="text-muted-foreground">{entry.message}</span>{' '}
                  <span className="font-medium truncate">{entry.target}</span>
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.projectColor }} />
                  <span className="text-xs text-muted-foreground truncate">{entry.projectName}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{timeAgo(entry.timestamp)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Add Task Quick Modal ─────────────────────────────────
function QuickAddTask({ onAdd, onClose }: { onAdd: (t: Partial<Task>) => void; onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('Medium');
  const [dueDate, setDueDate] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title, priority, dueDate, status: 'Open', assignee: CURRENT_USER });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/40" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-[500px] p-5" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" /> Quick Add Task
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-accent rounded"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <input
            autoFocus
            className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="What needs to be done?"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <div className="flex gap-3">
            <select
              className="flex-1 border border-border rounded-xl px-3 py-2 text-sm bg-background"
              value={priority}
              onChange={e => setPriority(e.target.value as Task['priority'])}
            >
              {['Critical', 'High', 'Medium', 'Low', 'None'].map(p => <option key={p}>{p}</option>)}
            </select>
            <input
              type="date"
              className="flex-1 border border-border rounded-xl px-3 py-2 text-sm bg-background"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
            />
          </div>
          <div className="flex gap-2 pt-1">
            <Button type="submit" className="flex-1" disabled={!title.trim()}>Add Task</Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Personal Goals Widget ────────────────────────────────
const PERSONAL_GOALS = [
  { id: 'g1', title: 'Complete Sprint 4 UX deliverables', category: 'Sprint', target: 14, current: 8, unit: 'tasks', dueDate: '2026-02-24', color: '#3b82f6', icon: Zap, inverse: false },
  { id: 'g2', title: 'Zero overdue tasks this month', category: 'Quality', target: 0, current: 2, unit: 'overdue', dueDate: '2026-02-28', color: '#ef4444', icon: Target, inverse: true },
  { id: 'g3', title: 'Log 40h billable time this sprint', category: 'Billable', target: 40, current: 27.5, unit: 'hours', dueDate: '2026-02-24', color: '#10b981', icon: Clock, inverse: false },
  { id: 'g4', title: 'WCAG accessibility audit', category: 'Compliance', target: 100, current: 60, unit: '%', dueDate: '2026-02-20', color: '#8b5cf6', icon: CheckSquare, inverse: false },
];

function PersonalGoalsWidget({ overdueCount }: { overdueCount: number }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-amber-500" /> My Goals
        </h3>
        <span className="text-xs text-muted-foreground">Sprint 4</span>
      </div>
      <div className="space-y-3">
        {PERSONAL_GOALS.map(goal => {
          const actual = goal.id === 'g2' ? overdueCount : goal.current;
          const progress = goal.inverse
            ? actual === 0 ? 100 : Math.max(0, 100 - Math.round((actual / (goal.target + actual + 2)) * 100))
            : Math.min(Math.round((actual / goal.target) * 100), 100);
          const isDone = goal.inverse ? actual === 0 : progress >= 100;
          const daysLeft = Math.ceil((new Date(goal.dueDate).getTime() - Date.now()) / 86400000);
          const Icon = goal.icon;
          return (
            <div key={goal.id} className={`rounded-xl p-3 transition-all ${isDone ? 'bg-green-50 border border-green-200' : 'bg-muted/30 border border-border/50'}`}>
              <div className="flex items-start gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${goal.color}20` }}>
                  <Icon className="w-3 h-3" style={{ color: goal.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium leading-snug ${isDone ? 'line-through text-muted-foreground' : ''}`}>{goal.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">
                      {goal.inverse ? `${actual} overdue (target: 0)` : `${typeof actual === 'number' && actual % 1 !== 0 ? actual.toFixed(1) : actual} / ${goal.target} ${goal.unit}`}
                    </span>
                    <span className={`text-xs ${daysLeft < 3 ? 'text-orange-500' : 'text-muted-foreground'}`}>
                      {daysLeft > 0 ? `${daysLeft}d` : 'Today'}
                    </span>
                  </div>
                </div>
                {isDone && <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0"><Check className="w-3 h-3 text-white" strokeWidth={3} /></div>}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: isDone ? '#10b981' : goal.color }} />
                </div>
                <span className={`text-xs font-medium w-8 text-right ${isDone ? 'text-green-600' : ''}`}>{progress}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Daily Standup Digest ─────────────────────────────────
function StandupDigest({ myTasks, currentUser }: { myTasks: Task[]; currentUser: string }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);

  // Yesterday: tasks completed (Closed recently or status changed)
  const yesterdayDone = myTasks.filter(t => {
    if (t.completedDate) {
      const cd = new Date(t.completedDate); cd.setHours(0,0,0,0);
      return cd.getTime() === yesterday.getTime();
    }
    return false;
  });

  // Also include tasks with actualHours logged recently as "worked on yesterday"
  const workedYesterday = myTasks.filter(t =>
    t.status === 'In Progress' && t.actualHours && t.actualHours > 0 &&
    !yesterdayDone.find(d => d.id === t.id)
  ).slice(0, 3);

  // Today: tasks due today or in-progress
  const todayPlanned = myTasks.filter(t => {
    const due = new Date(t.dueDate); due.setHours(0,0,0,0);
    return due.getTime() === today.getTime() && t.status !== 'Closed';
  });

  const inProgressToday = myTasks.filter(t =>
    t.status === 'In Progress' && !todayPlanned.find(p => p.id === t.id)
  ).slice(0, 3);

  // Blockers: overdue + waiting + on hold
  const blockers = myTasks.filter(t => {
    const due = new Date(t.dueDate); due.setHours(0,0,0,0);
    return (
      (due < today && t.status !== 'Closed') ||
      t.status === 'Waiting' ||
      t.status === 'On Hold'
    ) && t.status !== 'Closed';
  });

  const allDone = [...yesterdayDone, ...workedYesterday];
  const allToday = [...todayPlanned, ...inProgressToday];

  // Generate standup text
  const generateText = () => {
    const lines: string[] = [
      `📋 Daily Standup — ${today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}`,
      `👤 ${currentUser}`,
      '',
      '✅ Yesterday:',
      ...(allDone.length > 0 ? allDone.map(t => `  • [${t.taskId}] ${t.title} (${t.status})`) : ['  • No completed tasks logged']),
      '',
      '📌 Today:',
      ...(allToday.length > 0 ? allToday.map(t => `  • [${t.taskId}] ${t.title} — ${t.estimate}`) : ['  • No tasks due today']),
      '',
      '🚧 Blockers:',
      ...(blockers.length > 0 ? blockers.slice(0, 3).map(t => `  • [${t.taskId}] ${t.title} (${t.status})`) : ['  • No blockers 🎉']),
    ];
    return lines.join('\n');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateText()).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-accent/30 transition-colors"
      >
        <h3 className="text-sm font-semibold flex items-center gap-1.5">
          <ClipboardList className="w-4 h-4 text-indigo-500" />
          Daily Standup
          <span className="text-xs bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full ml-1">AI</span>
        </h3>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${expanded ? '' : '-rotate-90'}`} />
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          {/* Yesterday */}
          <div>
            <p className="text-xs font-semibold text-green-600 flex items-center gap-1 mb-1.5">
              <CheckCheck className="w-3.5 h-3.5" /> Yesterday
            </p>
            {allDone.length > 0 ? (
              <div className="space-y-1">
                {allDone.slice(0, 3).map(t => (
                  <div key={t.id} className="flex items-center gap-2 text-xs py-1 px-2 bg-green-50 rounded-lg">
                    <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                    <span className="font-mono text-muted-foreground">{t.taskId}</span>
                    <span className="truncate flex-1">{t.title}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {workedYesterday.slice(0, 2).map(t => (
                  <div key={t.id} className="flex items-center gap-2 text-xs py-1 px-2 bg-muted/40 rounded-lg">
                    <Clock className="w-3 h-3 text-blue-400 flex-shrink-0" />
                    <span className="font-mono text-muted-foreground">{t.taskId}</span>
                    <span className="truncate flex-1">{t.title}</span>
                    <span className="text-muted-foreground">{t.actualTime}</span>
                  </div>
                ))}
                {workedYesterday.length === 0 && (
                  <p className="text-xs text-muted-foreground italic">Nothing logged yet</p>
                )}
              </div>
            )}
          </div>

          {/* Today */}
          <div>
            <p className="text-xs font-semibold text-blue-600 flex items-center gap-1 mb-1.5">
              <Target className="w-3.5 h-3.5" /> Today
            </p>
            {allToday.length > 0 ? (
              <div className="space-y-1">
                {allToday.slice(0, 4).map(t => (
                  <div key={t.id} className="flex items-center gap-2 text-xs py-1 px-2 bg-blue-50 rounded-lg">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: t.projectColor || '#94a3b8' }} />
                    <span className="font-mono text-muted-foreground">{t.taskId}</span>
                    <span className="truncate flex-1">{t.title}</span>
                    <span className="text-muted-foreground">{t.estimate}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">No tasks due today</p>
            )}
          </div>

          {/* Blockers */}
          <div>
            <p className={`text-xs font-semibold flex items-center gap-1 mb-1.5 ${blockers.length > 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
              <AlertTriangle className="w-3.5 h-3.5" /> Blockers
            </p>
            {blockers.length > 0 ? (
              <div className="space-y-1">
                {blockers.slice(0, 3).map(t => (
                  <div key={t.id} className="flex items-center gap-2 text-xs py-1 px-2 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-3 h-3 text-red-400 flex-shrink-0" />
                    <span className="font-mono text-muted-foreground">{t.taskId}</span>
                    <span className="truncate flex-1">{t.title}</span>
                    <span className="text-red-500">{t.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-green-600 py-1 px-2 bg-green-50 rounded-lg">
                <Check className="w-3 h-3" />
                No blockers — great work!
              </div>
            )}
          </div>

          {/* AI summary */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Bot className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-xs font-semibold text-indigo-600">AI Summary</span>
            </div>
            <p className="text-xs text-indigo-700 leading-relaxed">
              {blockers.length > 0
                ? `${currentUser.split(' ')[0]} is working through ${allToday.length} task${allToday.length !== 1 ? 's' : ''} today. ${blockers.length} blocker${blockers.length !== 1 ? 's' : ''} need${blockers.length === 1 ? 's' : ''} attention — consider flagging ${blockers[0]?.title.slice(0, 30)}... in the standup.`
                : `${currentUser.split(' ')[0]} is on track with ${allToday.length} task${allToday.length !== 1 ? 's' : ''} planned today. No blockers — good momentum going into the day!`
              }
            </p>
          </div>

          <button
            onClick={handleCopy}
            className={`w-full flex items-center justify-center gap-2 text-xs py-2 rounded-xl border transition-colors ${
              copied
                ? 'bg-green-50 border-green-200 text-green-600'
                : 'border-border text-muted-foreground hover:text-primary hover:border-primary/50'
            }`}
          >
            {copied ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied to clipboard!' : 'Copy standup text'}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Focus Mode Banner ────────────────────────────────────
function FocusBanner({ focusTask, onEnd }: { focusTask: Task; onEnd: () => void }) {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(true);
  const POMODORO = 25 * 60;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const remaining = Math.max(0, POMODORO - elapsed);
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const pct = Math.round(((POMODORO - remaining) / POMODORO) * 100);

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-4 text-white">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4" />
          <span className="text-sm font-semibold">Focus Mode — Pomodoro</span>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{pct}%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setRunning(r => !r)} className="p-1 hover:bg-white/20 rounded">
            {running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button onClick={onEnd} className="p-1 hover:bg-white/20 rounded"><X className="w-3.5 h-3.5" /></button>
        </div>
      </div>
      <div className="flex items-center gap-3 mb-2">
        <div className="flex-1 h-1.5 bg-white/25 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-xl font-mono font-bold">{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}</span>
      </div>
      <p className="text-xs text-indigo-100 truncate"><span className="opacity-70">Focusing on:</span> {focusTask.title}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
export function WorkMyWorkOS() {
  const { tasks, changeTaskStatus, createTask, activityFeed, projects, sprints } = useExecutionOS();
  const [activeTab, setActiveTab] = useState<'today' | 'week' | 'all' | 'overdue'>('today');
  const [timerTask, setTimerTask] = useState<Task | null>(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [focusTask, setFocusTask] = useState<Task | null>(null);

  const myTasks = useMemo(() => tasks.filter(t => t.assignee === CURRENT_USER), [tasks]);

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(today); endOfWeek.setDate(today.getDate() + 7);

  const todayTasks = myTasks.filter(t => {
    const d = new Date(t.dueDate); d.setHours(0,0,0,0);
    return d.getTime() === today.getTime() && t.status !== 'Closed';
  });
  const weekTasks = myTasks.filter(t => {
    const d = new Date(t.dueDate); d.setHours(0,0,0,0);
    return d >= today && d <= endOfWeek && t.status !== 'Closed';
  });
  const overdueTasks = myTasks.filter(t => {
    const d = new Date(t.dueDate); d.setHours(0,0,0,0);
    return d < today && t.status !== 'Closed';
  });
  const allActiveTasks = myTasks.filter(t => t.status !== 'Closed');

  const displayTasks =
    activeTab === 'today' ? todayTasks :
    activeTab === 'week' ? weekTasks :
    activeTab === 'overdue' ? overdueTasks :
    allActiveTasks;

  const handleStatusChange = (id: string, status: Task['status']) => changeTaskStatus(id, status);

  const handleAddTask = (partial: Partial<Task>) => {
    createTask({
      taskId: `SELF-${Date.now().toString().slice(-3)}`,
      title: partial.title || '',
      projectId: 'p1',
      projectName: 'Personal',
      projectColor: '#6366f1',
      assignee: CURRENT_USER,
      assigneeDepartment: 'Product',
      status: 'Open',
      priority: partial.priority || 'Medium',
      dueDate: partial.dueDate || new Date().toISOString().split('T')[0],
      estimate: '1h',
      estimatedHours: 1,
      actualTime: '0h',
      actualHours: 0,
      billable: false,
      hasEvidence: false,
      evidenceCount: 0,
      comments: 0,
      storyPoints: 1,
    });
  };

  const activeSprint = sprints.find(s => s.status === 'Active' && s.projectName === 'Mobile App Redesign');
  const sprintProgress = activeSprint ? Math.round((activeSprint.completedPoints / activeSprint.storyPoints) * 100) : 0;

  const totalLoggedHrs = myTasks.reduce((s, t) => s + (t.actualHours || 0), 0);
  const completedCount = myTasks.filter(t => t.status === 'Closed').length;
  const inProgressCount = myTasks.filter(t => t.status === 'In Progress').length;
  const activeProjects = [...new Set(myTasks.filter(t => t.status !== 'Closed').map(t => t.projectId))].length;

  const TABS = [
    { key: 'today' as const,   label: 'Today',       count: todayTasks.length },
    { key: 'week' as const,    label: 'This Week',   count: weekTasks.length },
    { key: 'overdue' as const, label: 'Overdue',     count: overdueTasks.length },
    { key: 'all' as const,     label: 'All Active',  count: allActiveTasks.length },
  ];

  return (
    <div className="flex h-full flex-col bg-background">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="px-6 py-4 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-primary" />
              My Work
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Welcome back, {CURRENT_USER.split(' ')[0]} ·{' '}
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!focusTask && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => { const t = myTasks.find(x => x.status === 'In Progress'); if (t) setFocusTask(t); }}
                className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
              >
                <Brain className="w-3.5 h-3.5 mr-1.5" /> Focus Mode
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => {}}>
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Sync
            </Button>
            <Button size="sm" onClick={() => setShowQuickAdd(true)}>
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Quick Add
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-5">
          {/* ── KPI Row ───────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Due Today',     value: todayTasks.length,          sub: `${completedCount} completed`,         icon: Coffee,      iconColor: 'text-orange-400', alert: todayTasks.length > 2 },
              { label: 'Overdue',       value: overdueTasks.length,        sub: overdueTasks.length > 0 ? 'Needs attention' : '✓ All caught up', icon: AlertTriangle, iconColor: overdueTasks.length > 0 ? 'text-red-400' : 'text-green-400', alert: overdueTasks.length > 0 },
              { label: 'Hours Logged',  value: `${totalLoggedHrs.toFixed(1)}h`, sub: 'This sprint',                    icon: Clock,       iconColor: 'text-blue-400', alert: false },
              { label: 'Active Projects', value: activeProjects,           sub: `${inProgressCount} tasks in flight`, icon: FolderKanban, iconColor: 'text-purple-400', alert: false },
            ].map((k, i) => {
              const Icon = k.icon;
              return (
                <div key={i} className={`bg-card border rounded-xl p-4 ${k.alert ? 'border-red-200 dark:border-red-900' : 'border-border'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">{k.label}</span>
                    <Icon className={`w-4 h-4 ${k.iconColor}`} />
                  </div>
                  <p className={`text-2xl font-semibold ${k.alert ? 'text-red-500' : ''}`}>{k.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{k.sub}</p>
                </div>
              );
            })}
          </div>

          {/* ── Two-column layout ─────────────────────────── */}
          <div className="grid grid-cols-12 gap-5">
            {/* Left: Tasks */}
            <div className="col-span-8 space-y-4">
              {/* Focus Mode Banner */}
              {focusTask && (
                <FocusBanner focusTask={focusTask} onEnd={() => setFocusTask(null)} />
              )}

              {/* Sprint banner */}
              {activeSprint && (
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      <span className="font-semibold">{activeSprint.name}</span>
                      <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{activeSprint.projectName}</span>
                    </div>
                    <div className="text-right text-xs text-blue-100">
                      <span>Ends {new Date(activeSprint.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      {' · '}
                      <span className="font-medium">{Math.ceil((new Date(activeSprint.endDate).getTime() - Date.now()) / 86400000)}d left</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mb-1.5">
                    <div className="flex-1 h-2 bg-white/25 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full transition-all" style={{ width: `${sprintProgress}%` }} />
                    </div>
                    <span className="font-bold text-sm">{sprintProgress}%</span>
                    <span className="text-xs text-blue-100">{activeSprint.completedPoints}/{activeSprint.storyPoints} pts</span>
                    <span className="text-xs text-blue-100">{activeSprint.completedTasks}/{activeSprint.taskCount} tasks</span>
                  </div>
                  <p className="text-xs text-blue-100">
                    <span className="font-medium">Goal:</span> {activeSprint.goal}
                  </p>
                </div>
              )}

              {/* Overdue alert */}
              {overdueTasks.length > 0 && activeTab !== 'overdue' && (
                <div className="flex items-center gap-3 px-4 py-2.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl text-sm">
                  <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span className="text-red-700 dark:text-red-300">
                    You have <strong>{overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''}</strong>.
                  </span>
                  <button
                    onClick={() => setActiveTab('overdue')}
                    className="ml-auto text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-0.5"
                  >
                    View all <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Task list panel */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                {/* Tab bar */}
                <div className="flex items-center gap-0.5 px-3 pt-3 border-b border-border">
                  {TABS.map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-t text-sm transition-colors ${
                        activeTab === tab.key
                          ? 'bg-background border-x border-t border-border text-foreground -mb-px'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {tab.label}
                      <span className={`text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${
                        tab.key === 'overdue' && tab.count > 0 ? 'bg-red-100 text-red-600' : 'bg-muted text-muted-foreground'
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                  <div className="ml-auto pb-2">
                    <button
                      onClick={() => setShowQuickAdd(true)}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary px-2 py-1 rounded hover:bg-accent transition-colors"
                    >
                      <Plus className="w-3 h-3" /> Add task
                    </button>
                  </div>
                </div>

                {/* Task list */}
                <div className="p-2">
                  {displayTasks.length === 0 ? (
                    <div className="py-10 text-center text-muted-foreground">
                      <Check className="w-8 h-8 mx-auto mb-2 opacity-20" />
                      <p className="text-sm">
                        {activeTab === 'today' ? 'No tasks due today! 🎉' :
                         activeTab === 'overdue' ? 'Nothing overdue. Great work!' :
                         'No tasks in this view'}
                      </p>
                    </div>
                  ) : (
                    displayTasks.map(task => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        onStatusChange={handleStatusChange}
                        onStartTimer={setTimerTask}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Activity Feed */}
              <ActivityFeed entries={activityFeed} />
            </div>

            {/* Right: Sidebar */}
            <div className="col-span-4 space-y-4">
              {/* Time Tracker */}
              <TimeTrackerWidget activeTask={timerTask} onStop={() => setTimerTask(null)} />

              {/* AI Insight */}
              <AIInsightCard tasks={myTasks} />

              {/* My Projects */}
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold">My Projects</h3>
                  <FolderKanban className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="space-y-3">
                  {projects
                    .filter(p => p.team.includes(CURRENT_USER))
                    .slice(0, 4)
                    .map(p => (
                      <div key={p.id} className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{p.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${p.progress}%`, backgroundColor: p.color }} />
                            </div>
                            <span className="text-xs text-muted-foreground">{p.progress}%</span>
                          </div>
                        </div>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                          p.status === 'At Risk' ? 'bg-red-100 text-red-600' :
                          p.status === 'On Hold' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-green-100 text-green-600'
                        }`}>{p.status}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Upcoming Milestones */}
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold">Upcoming Milestones</h3>
                  <Target className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  {[
                    { name: 'Core Development', project: 'MAR', due: '2026-03-15', progress: 42, color: '#3b82f6' },
                    { name: 'Visual Design Phase', project: 'WRD', due: '2026-02-28', progress: 45, color: '#10b981' },
                    { name: 'Core Endpoints v3', project: 'PAV', due: '2026-02-28', progress: 78, color: '#8b5cf6' },
                  ].map((m, i) => {
                    const daysLeft = Math.ceil((new Date(m.due).getTime() - Date.now()) / 86400000);
                    return (
                      <div key={i} className="p-2.5 bg-muted/40 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium truncate flex-1">{m.name}</span>
                          <span className={`text-xs flex-shrink-0 ml-2 ${daysLeft < 7 ? 'text-orange-500 font-medium' : 'text-muted-foreground'}`}>
                            {daysLeft}d left
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${m.progress}%`, backgroundColor: m.color }} />
                          </div>
                          <span className="text-xs text-muted-foreground">{m.progress}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sprint Stats mini-grid */}
              <div className="bg-card border border-border rounded-xl p-4">
                <h3 className="text-sm font-semibold mb-3">Sprint Stats</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Completed', value: completedCount, color: 'text-green-500' },
                    { label: 'In Progress', value: inProgressCount, color: 'text-blue-500' },
                    { label: 'Pending Review', value: myTasks.filter(t => t.status === 'Pending Review').length, color: 'text-amber-500' },
                    { label: 'Billable', value: myTasks.filter(t => t.billable && t.status !== 'Closed').length, color: 'text-purple-500' },
                  ].map((s, i) => (
                    <div key={i} className="text-center p-2.5 bg-muted/40 rounded-xl">
                      <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily Standup Digest */}
              <StandupDigest myTasks={myTasks} currentUser={CURRENT_USER} />

              {/* Personal Goals */}
              <PersonalGoalsWidget overdueCount={overdueTasks.length} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Add Modal */}
      {showQuickAdd && (
        <QuickAddTask onAdd={handleAddTask} onClose={() => setShowQuickAdd(false)} />
      )}
    </div>
  );
}
