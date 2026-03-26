import { useState, useMemo } from 'react';
import { Button } from '../../ui/button';
import {
  Target, Plus, Search, Calendar, ChevronDown, ChevronRight,
  CheckSquare, Clock, AlertTriangle, Check, Edit, Trash2,
  BarChart3, List, X, Flag, User, FolderKanban,
  FileText, ExternalLink, MessageSquare, Tag
} from 'lucide-react';
import { useExecutionOS } from '../../../contexts/ExecutionOSContext';
import type { Milestone, MilestoneStatus } from './workTypes';

const STATUS_CFG: Record<MilestoneStatus, { bg: string; color: string; border: string; dot: string }> = {
  'Completed':   { bg: 'bg-green-100',  color: 'text-green-700',  border: 'border-green-300', dot: 'bg-green-500'  },
  'In Progress': { bg: 'bg-blue-100',   color: 'text-blue-700',   border: 'border-blue-300',  dot: 'bg-blue-500'   },
  'Not Started': { bg: 'bg-gray-100',   color: 'text-gray-600',   border: 'border-gray-300',  dot: 'bg-gray-400'   },
  'Overdue':     { bg: 'bg-red-100',    color: 'text-red-700',    border: 'border-red-300',   dot: 'bg-red-500'    },
};

function StatusBadge({ status }: { status: MilestoneStatus }) {
  const cfg = STATUS_CFG[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
}

// ── Timeline Gantt for Milestones ─────────────────────────
function MilestoneTimeline({ milestones, projects, tasks }: { milestones: Milestone[]; projects: any[]; tasks: any[] }) {
  if (milestones.length === 0) return (
    <div className="text-center py-12 text-muted-foreground">
      <Target className="w-8 h-8 mx-auto mb-2 opacity-30" />
      <p className="text-sm">No milestones to display</p>
    </div>
  );

  const today = new Date();
  const allDates = milestones.flatMap(m => [new Date(m.startDate), new Date(m.endDate)]);
  const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));
  minDate.setDate(minDate.getDate() - 7);
  maxDate.setDate(maxDate.getDate() + 14);

  const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / 86400000);
  const dayWidth = 22;

  // Build month labels
  const months: { label: string; days: number }[] = [];
  let cursor = new Date(minDate);
  cursor.setDate(1);
  while (cursor <= maxDate) {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    months.push({
      label: cursor.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      days: daysInMonth
    });
    cursor.setMonth(cursor.getMonth() + 1);
  }

  const getLeft = (date: string) =>
    Math.max(0, Math.ceil((new Date(date).getTime() - minDate.getTime()) / 86400000)) * dayWidth;

  const getWidth = (start: string, end: string) =>
    Math.max(dayWidth, Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / 86400000) * dayWidth);

  const todayLeft = Math.ceil((today.getTime() - minDate.getTime()) / 86400000) * dayWidth;

  const projectColors: Record<string, string> = {};
  projects.forEach(p => { projectColors[p.id] = p.color; });

  return (
    <div className="overflow-auto">
      <div style={{ minWidth: `${280 + totalDays * dayWidth}px` }}>
        {/* Month headers */}
        <div className="flex border-b border-border sticky top-0 bg-card z-10">
          <div className="w-[280px] flex-shrink-0 border-r border-border" />
          <div className="flex">
            {months.map((m, i) => (
              <div
                key={i}
                className="border-r border-border px-2 py-2 text-xs font-medium text-muted-foreground"
                style={{ width: `${m.days * dayWidth}px` }}
              >
                {m.label}
              </div>
            ))}
          </div>
        </div>

        {/* Milestones */}
        {milestones.map((m, i) => {
          const project = projects.find(p => p.id === m.projectId);
          const barColor = project?.color || '#3b82f6';
          const tasksDone = tasks.filter(t => t.milestoneId === m.id && t.status === 'Closed').length;
          const tasksTotal = tasks.filter(t => t.milestoneId === m.id).length;

          return (
            <div key={m.id} className={`flex items-center border-b border-border/50 hover:bg-accent/20 ${i % 2 === 0 ? '' : 'bg-muted/20'}`} style={{ height: 52 }}>
              {/* Label */}
              <div className="w-[280px] flex-shrink-0 px-4 flex items-center gap-2 border-r border-border h-full">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: barColor }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{m.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{m.projectName}</p>
                </div>
                <StatusBadge status={m.status} />
              </div>

              {/* Bar area */}
              <div className="relative flex-1 h-full">
                {/* Today line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-red-400 opacity-70 z-10"
                  style={{ left: todayLeft }}
                />
                {/* Bar */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    left: getLeft(m.startDate),
                    width: getWidth(m.startDate, m.endDate),
                    height: 20,
                    backgroundColor: barColor,
                    opacity: m.status === 'Completed' ? 0.6 : 0.85,
                  }}
                >
                  {/* Progress fill */}
                  <div
                    className="h-full rounded-full bg-white/30"
                    style={{ width: `${m.progress}%` }}
                  />
                  <span className="absolute inset-0 flex items-center px-2 text-white text-xs font-medium">
                    {m.progress}%
                  </span>
                </div>
                {/* Diamond marker at end */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 border-2"
                  style={{
                    left: getLeft(m.endDate) - 6,
                    backgroundColor: barColor,
                    borderColor: 'white',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Add Milestone Drawer ──────────────────────────────────
function AddMilestoneDrawer({ onClose, onAdd, projects }: {
  onClose: () => void;
  onAdd: (m: Partial<Milestone>) => void;
  projects: any[];
}) {
  const [form, setForm] = useState({
    name: '', projectId: '', owner: '', startDate: '', endDate: '', notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const project = projects.find(p => p.id === form.projectId);
    onAdd({
      ...form,
      projectName: project?.name || '',
      progress: 0, status: 'Not Started',
      taskCount: 0, completedTasks: 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-[420px] bg-background border-l border-border flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semibold flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" /> New Milestone
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-accent rounded"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-6 space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">Milestone Name *</label>
            <input
              required
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Milestone name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Project *</label>
            <select
              required
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
              value={form.projectId}
              onChange={e => setForm({ ...form, projectId: e.target.value })}
            >
              <option value="">Select project...</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Owner</label>
            <input
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
              placeholder="Owner name"
              value={form.owner}
              onChange={e => setForm({ ...form, owner: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium block mb-1.5">Start Date</label>
              <input type="date" className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
                value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Due Date *</label>
              <input type="date" className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
                value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} required />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Notes</label>
            <textarea
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background resize-none"
              rows={3}
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              placeholder="Optional notes..."
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1">Create Milestone</Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Edit Milestone Drawer ─────────────────────────────────
function EditMilestoneDrawer({ 
  milestone, 
  onClose, 
  projects 
}: { 
  milestone: Milestone; 
  onClose: () => void; 
  projects: any[];
}) {
  const { updateMilestone } = useExecutionOS();
  const [form, setForm] = useState({
    name: milestone.name,
    projectId: milestone.projectId,
    owner: milestone.owner,
    startDate: milestone.startDate,
    endDate: milestone.endDate,
    status: milestone.status,
    notes: milestone.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const project = projects.find(p => p.id === form.projectId);
    updateMilestone(milestone.id, {
      name: form.name,
      projectId: form.projectId,
      projectName: project?.name || milestone.projectName,
      owner: form.owner,
      startDate: form.startDate,
      endDate: form.endDate,
      status: form.status,
      notes: form.notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-[420px] bg-background border-l border-border flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semibold flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" /> Edit Milestone
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-accent rounded"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-6 space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">Milestone Name *</label>
            <input
              required
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Milestone name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Project *</label>
            <select
              required
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
              value={form.projectId}
              onChange={e => setForm({ ...form, projectId: e.target.value })}
            >
              <option value="">Select project...</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Status</label>
            <select
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value as MilestoneStatus })}
            >
              {['Not Started', 'In Progress', 'Completed', 'Overdue'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Owner</label>
            <input
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
              placeholder="Owner name"
              value={form.owner}
              onChange={e => setForm({ ...form, owner: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium block mb-1.5">Start Date</label>
              <input type="date" className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
                value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Due Date *</label>
              <input type="date" className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
                value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} required />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Notes</label>
            <textarea
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background resize-none"
              rows={3}
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              placeholder="Optional notes..."
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1">Update Milestone</Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Delete Milestone Confirmation ─────────────────────────
function DeleteMilestoneConfirm({ 
  milestone, 
  onConfirm, 
  onCancel 
}: { 
  milestone: Milestone; 
  onConfirm: () => void; 
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-background border border-border rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Delete Milestone</h3>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete <span className="font-medium text-foreground">{milestone.name}</span>? 
              This action cannot be undone. Tasks linked to this milestone will need to be reassigned.
            </p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button 
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete Milestone
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Milestone Detail Panel ────────────────────────────────
function MilestoneDetailPanel({ milestone, onClose, projects, tasks }: { milestone: Milestone; onClose: () => void; projects: any[]; tasks: any[] }) {
  const { updateMilestone, deleteMilestone, milestones } = useExecutionOS();
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'notes'>('overview');
  const [notes, setNotes] = useState(milestone.notes || '');
  const [taskStatusFilter, setTaskStatusFilter] = useState('all');
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Get the latest milestone data from context
  const currentMilestone = milestones.find(m => m.id === milestone.id) || milestone;

  const project = projects.find(p => p.id === currentMilestone.projectId);
  const allTasks = tasks.filter(t => t.milestoneId === currentMilestone.id);
  const filteredTasks = taskStatusFilter === 'all' ? allTasks : allTasks.filter(t => t.status === taskStatusFilter);

  const daysLeft = Math.ceil((new Date(currentMilestone.endDate).getTime() - Date.now()) / 86400000);
  const completedCount = allTasks.filter(t => t.status === 'Closed').length;
  const inProgressCount = allTasks.filter(t => t.status === 'In Progress').length;
  const overdueCount = allTasks.filter(t => t.status === 'Overdue').length;
  const openCount = allTasks.filter(t => t.status === 'Open').length;

  const COLOR = project?.color || '#3b82f6';
  const RING_R = 42;
  const circ = 2 * Math.PI * RING_R;
  const dashOffset = circ - (currentMilestone.progress / 100) * circ;

  const TABS = [
    { key: 'overview' as const, label: 'Overview', icon: BarChart3 },
    { key: 'tasks' as const, label: `Tasks (${allTasks.length})`, icon: CheckSquare },
    { key: 'notes' as const, label: 'Notes', icon: FileText },
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-[58vw] bg-background border-l border-border flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-card flex-shrink-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${COLOR}20` }}
              >
                <div className="w-4 h-4 rotate-45 rounded" style={{ backgroundColor: COLOR }} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">{currentMilestone.name}</h2>
                  <StatusBadge status={currentMilestone.status} />
                </div>
                <p className="text-sm text-muted-foreground">{currentMilestone.projectName} · Owner: {currentMilestone.owner}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowEditDrawer(true)}><Edit className="w-3.5 h-3.5 mr-1.5" /> Edit</Button>
              <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(true)} className="text-red-600 hover:text-red-700 hover:border-red-300">
                <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
              </Button>
              <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg"><X className="w-4 h-4" /></button>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Progress', value: `${currentMilestone.progress}%`, sub: `${completedCount}/${allTasks.length} tasks done`, alert: false },
              { label: 'Days Left', value: daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : daysLeft === 0 ? 'Due today' : `${daysLeft}d`, sub: new Date(currentMilestone.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), alert: daysLeft < 0 },
              { label: 'Open Tasks', value: openCount + inProgressCount, sub: overdueCount > 0 ? `${overdueCount} overdue` : 'On track', alert: overdueCount > 0 },
              { label: 'Completed', value: completedCount, sub: `of ${allTasks.length} total`, alert: false },
            ].map((k, i) => (
              <div key={i} className={`rounded-lg px-3 py-2 ${k.alert ? 'bg-red-50 border border-red-200' : 'bg-muted/40'}`}>
                <p className="text-xs text-muted-foreground">{k.label}</p>
                <p className={`font-semibold ${k.alert ? 'text-red-600' : ''}`}>{k.value}</p>
                <p className={`text-xs ${k.alert ? 'text-red-500' : 'text-muted-foreground'}`}>{k.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-1 px-6 border-b border-border bg-card flex-shrink-0">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 text-sm transition-colors ${
                  activeTab === tab.key
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">

          {/* ── Overview ─────────────────────────────────── */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-5">

                {/* Progress Ring */}
                <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-6">
                  <div className="relative flex-shrink-0">
                    <svg width="120" height="120" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r={RING_R} fill="none" stroke="currentColor" className="text-muted" strokeWidth="10" />
                      <circle
                        cx="60" cy="60" r={RING_R}
                        fill="none"
                        stroke={COLOR}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={circ}
                        strokeDashoffset={dashOffset}
                        transform="rotate(-90 60 60)"
                        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold">{currentMilestone.progress}%</span>
                      <span className="text-xs text-muted-foreground">done</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-3">Task Breakdown</p>
                    {[
                      { label: 'Completed', count: completedCount, color: '#22c55e' },
                      { label: 'In Progress', count: inProgressCount, color: '#3b82f6' },
                      { label: 'Open', count: openCount, color: '#94a3b8' },
                      { label: 'Overdue', count: overdueCount, color: '#ef4444' },
                    ].map(item => (
                      <div key={item.label} className="flex items-center gap-2 mb-2">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-xs flex-1">{item.label}</span>
                        <span className="text-xs font-semibold">{item.count}</span>
                        <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${allTasks.length ? (item.count / allTasks.length) * 100 : 0}%`, backgroundColor: item.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-card border border-border rounded-xl p-5">
                  <p className="text-sm font-medium mb-4">Timeline</p>
                  <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span>{new Date(currentMilestone.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <span>{new Date(currentMilestone.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="relative h-6 bg-muted rounded-full overflow-hidden mb-4">
                    <div className="h-full rounded-full" style={{ width: `${currentMilestone.progress}%`, backgroundColor: COLOR }} />
                    {(() => {
                      const start = new Date(currentMilestone.startDate).getTime();
                      const end = new Date(currentMilestone.endDate).getTime();
                      const pct = Math.max(0, Math.min(100, ((Date.now() - start) / (end - start)) * 100));
                      return (
                        <div className="absolute top-0 bottom-0 w-0.5 bg-red-400 z-10" style={{ left: `${pct}%` }}>
                          <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-red-500 font-medium whitespace-nowrap">Today</span>
                        </div>
                      );
                    })()}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/40 rounded-lg p-2.5">
                      <p className="text-xs text-muted-foreground">Start</p>
                      <p className="text-sm font-medium">{new Date(currentMilestone.startDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                    </div>
                    <div className={`rounded-lg p-2.5 ${daysLeft < 0 ? 'bg-red-50' : daysLeft < 7 ? 'bg-orange-50' : 'bg-muted/40'}`}>
                      <p className={`text-xs ${daysLeft < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>Due Date</p>
                      <p className={`text-sm font-medium ${daysLeft < 0 ? 'text-red-600' : ''}`}>{new Date(currentMilestone.endDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Tasks */}
              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium">Tasks Preview</p>
                  <button onClick={() => setActiveTab('tasks')} className="text-xs text-primary hover:underline flex items-center gap-1">
                    View all <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
                {allTasks.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">No tasks assigned to this milestone</p>
                ) : (
                  <div className="space-y-1.5">
                    {allTasks.slice(0, 5).map(task => {
                      const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Closed';
                      return (
                        <div key={task.id} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-muted/40 transition-colors">
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${task.status === 'Closed' ? 'bg-green-500 border-green-500' : 'border-border'}`}>
                            {task.status === 'Closed' && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                          </div>
                          <span className="text-xs font-mono text-muted-foreground w-16 flex-shrink-0">{task.taskId}</span>
                          <span className={`text-sm flex-1 min-w-0 truncate ${task.status === 'Closed' ? 'line-through text-muted-foreground' : ''}`}>{task.title}</span>
                          <span className="text-xs text-muted-foreground flex-shrink-0">{task.assignee.split(' ')[0]}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded flex-shrink-0 ${
                            task.status === 'Overdue' ? 'bg-red-100 text-red-700' :
                            task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                            task.status === 'Closed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                          }`}>{task.status}</span>
                          <span className={`text-xs flex-shrink-0 ${isOverdue ? 'text-red-500' : 'text-muted-foreground'}`}>
                            {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Tasks ────────────────────────────────────── */}
          {activeTab === 'tasks' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <select
                  className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background"
                  value={taskStatusFilter}
                  onChange={e => setTaskStatusFilter(e.target.value)}
                >
                  <option value="all">All Status ({allTasks.length})</option>
                  <option value="Open">Open ({openCount})</option>
                  <option value="In Progress">In Progress ({inProgressCount})</option>
                  <option value="Overdue">Overdue ({overdueCount})</option>
                  <option value="Closed">Completed ({completedCount})</option>
                </select>
                <Button size="sm" variant="outline">
                  <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Task
                </Button>
                <span className="text-xs text-muted-foreground ml-auto">{filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}</span>
              </div>

              {filteredTasks.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <CheckSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No tasks match the filter</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {filteredTasks.map(task => {
                    const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Closed';
                    return (
                      <div key={task.id} className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors">
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${task.status === 'Closed' ? 'bg-green-500 border-green-500' : 'border-border'}`}>
                          {task.status === 'Closed' && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                        </div>
                        <span className="text-xs font-mono text-muted-foreground w-16 flex-shrink-0">{task.taskId}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm truncate ${task.status === 'Closed' ? 'line-through text-muted-foreground' : ''}`}>{task.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{task.projectName} · {task.assigneeDepartment}</p>
                        </div>
                        <span className="text-xs text-muted-foreground flex-shrink-0">{task.assignee.split(' ')[0]}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                          task.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                          task.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                          'bg-muted text-muted-foreground'
                        }`}>{task.priority}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                          task.status === 'Overdue' ? 'bg-red-100 text-red-700' :
                          task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                          task.status === 'Closed' ? 'bg-green-100 text-green-700' :
                          task.status === 'To Be Tested' ? 'bg-purple-100 text-purple-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>{task.status}</span>
                        <span className={`text-xs flex-shrink-0 ${isOverdue ? 'text-red-500' : 'text-muted-foreground'}`}>
                          {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <span className="text-xs text-muted-foreground flex-shrink-0">{task.estimate}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── Notes ────────────────────────────────────── */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Milestone Notes & Context</label>
                <textarea
                  className="w-full h-64 border border-border rounded-xl px-4 py-3 text-sm bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Add notes, context, dependencies, or blockers for this milestone..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm">Save Notes</Button>
                <Button size="sm" variant="outline" onClick={() => setNotes(milestone.notes || '')}>Discard</Button>
              </div>
              {milestone.isInternal && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-xs font-semibold text-amber-700 mb-1 flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> Internal Milestone</p>
                  <p className="text-xs text-amber-600">This milestone is internal and will not be visible to the client.</p>
                </div>
              )}
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-3 tracking-wide">Comments ({(milestone as any).comments || 0})</p>
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary flex-shrink-0">S</div>
                  <div className="flex-1 border border-border rounded-xl px-3 py-2">
                    <input className="w-full text-sm bg-transparent focus:outline-none text-muted-foreground" placeholder="Add a comment..." />
                  </div>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> Comment
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Edit Drawer */}
        {showEditDrawer && (
          <EditMilestoneDrawer
            milestone={currentMilestone}
            onClose={() => setShowEditDrawer(false)}
            projects={projects}
          />
        )}

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <DeleteMilestoneConfirm
            milestone={currentMilestone}
            onConfirm={() => {
              deleteMilestone(currentMilestone.id);
              setShowDeleteConfirm(false);
              onClose();
            }}
            onCancel={() => setShowDeleteConfirm(false)}
          />
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
export function WorkMilestonesOS() {
  const { milestones, projects, tasks: allTasks, createMilestone, updateMilestone, deleteMilestone, changeMilestoneStatus } = useExecutionOS();
  const [view, setView] = useState<'list' | 'timeline'>('list');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [showAdd, setShowAdd] = useState(false);
  const [expandedMilestones, setExpandedMilestones] = useState<Set<string>>(new Set());
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

  const filtered = useMemo(() => {
    return milestones.filter(m => {
      const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.projectName.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || m.status === statusFilter;
      const matchProject = projectFilter === 'all' || m.projectId === projectFilter;
      return matchSearch && matchStatus && matchProject;
    });
  }, [milestones, search, statusFilter, projectFilter]);

  const toggleExpand = (id: string) => {
    setExpandedMilestones(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const stats = {
    total: milestones.length,
    completed: milestones.filter(m => m.status === 'Completed').length,
    inProgress: milestones.filter(m => m.status === 'In Progress').length,
    overdue: milestones.filter(m => m.status === 'Overdue').length,
    notStarted: milestones.filter(m => m.status === 'Not Started').length,
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="px-6 py-5 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" /> Milestones
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {stats.total} milestones · {stats.completed} completed · {stats.inProgress} in progress
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
              <button onClick={() => setView('list')} className={`p-1.5 rounded ${view === 'list' ? 'bg-card shadow-sm' : 'text-muted-foreground'}`}>
                <List className="w-4 h-4" />
              </button>
              <button onClick={() => setView('timeline')} className={`p-1.5 rounded ${view === 'timeline' ? 'bg-card shadow-sm' : 'text-muted-foreground'}`}>
                <BarChart3 className="w-4 h-4" />
              </button>
            </div>
            <Button onClick={() => setShowAdd(true)} size="sm">
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Milestone
            </Button>
          </div>
        </div>

        {/* KPI Row */}
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border">
          {[
            { label: 'Completed', value: stats.completed, color: 'text-green-600' },
            { label: 'In Progress', value: stats.inProgress, color: 'text-blue-600' },
            { label: 'Overdue', value: stats.overdue, color: 'text-red-500' },
            { label: 'Not Started', value: stats.notStarted, color: 'text-gray-500' },
          ].map((s, i) => (
            <div key={i} className="text-sm">
              <span className="text-muted-foreground">{s.label}: </span>
              <span className={`font-semibold ${s.color}`}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-border bg-background">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            className="w-full pl-9 pr-3 py-1.5 text-sm border border-border rounded-lg bg-background focus:outline-none"
            placeholder="Search milestones..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Overdue">Overdue</option>
        </select>
        <select
          className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background"
          value={projectFilter}
          onChange={e => setProjectFilter(e.target.value)}
        >
          <option value="all">All Projects</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {view === 'timeline' ? (
          <MilestoneTimeline milestones={filtered} projects={projects} tasks={allTasks} />
        ) : (
          <div className="p-6 space-y-3 max-w-5xl mx-auto">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Target className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>No milestones match your filters</p>
              </div>
            ) : (
              filtered.map(milestone => {
                const project = projects.find(p => p.id === milestone.projectId);
                const milestoneTasks = allTasks.filter(t => t.milestoneId === milestone.id);
                const isExpanded = expandedMilestones.has(milestone.id);
                const daysLeft = Math.ceil((new Date(milestone.endDate).getTime() - new Date().getTime()) / 86400000);

                return (
                  <div
                    key={milestone.id}
                    className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedMilestone(milestone)}
                  >
                    {/* Milestone header */}
                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        {/* Left: expand + project color */}
                        <div className="flex items-center gap-2 mt-0.5">
                          <button
                            onClick={() => toggleExpand(milestone.id)}
                            className="p-0.5 hover:bg-accent rounded transition-colors"
                          >
                            {isExpanded
                              ? <ChevronDown className="w-4 h-4 text-muted-foreground" />
                              : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                          </button>
                          <div className="w-3 h-3 rounded rotate-45" style={{ backgroundColor: project?.color || '#94a3b8' }} />
                        </div>

                        {/* Middle: content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-medium">{milestone.name}</h3>
                            <StatusBadge status={milestone.status} />
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                              <FolderKanban className="w-3.5 h-3.5" />
                              {milestone.projectName}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="w-3.5 h-3.5" />
                              {milestone.owner}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(milestone.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — {new Date(milestone.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            <span className={`flex items-center gap-1 ${daysLeft < 0 ? 'text-red-500' : daysLeft < 7 ? 'text-orange-500' : ''}`}>
                              <Clock className="w-3.5 h-3.5" />
                              {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : daysLeft === 0 ? 'Due today' : `${daysLeft}d left`}
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{ width: `${milestone.progress}%`, backgroundColor: project?.color || '#3b82f6' }}
                              />
                            </div>
                            <span className="text-sm font-semibold">{milestone.progress}%</span>
                            <span className="text-xs text-muted-foreground">
                              {milestone.completedTasks}/{milestone.taskCount} tasks
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button onClick={e => { e.stopPropagation(); }} className="p-1.5 hover:bg-accent rounded-lg"><Edit className="w-3.5 h-3.5 text-muted-foreground" /></button>
                          <button onClick={e => { e.stopPropagation(); }} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded: tasks */}
                    {isExpanded && (
                      <div className="border-t border-border bg-muted/20 p-4">
                        {milestoneTasks.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-4">No tasks in this milestone</p>
                        ) : (
                          <div className="space-y-1.5">
                            {milestoneTasks.map(task => (
                              <div key={task.id} className="flex items-center gap-3 py-2 px-3 bg-card rounded-lg border border-border">
                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${task.status === 'Closed' ? 'bg-green-500 border-green-500' : 'border-border'}`}>
                                  {task.status === 'Closed' && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                                </div>
                                <span className="text-xs font-mono text-muted-foreground w-16">{task.taskId}</span>
                                <span className={`text-sm flex-1 ${task.status === 'Closed' ? 'line-through text-muted-foreground' : ''}`}>
                                  {task.title}
                                </span>
                                <span className="text-xs text-muted-foreground">{task.assignee.split(' ')[0]}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  task.status === 'Overdue' ? 'bg-red-100 text-red-700' :
                                  task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                  task.status === 'Closed' ? 'bg-green-100 text-green-700' :
                                  'bg-gray-100 text-gray-600'
                                }`}>{task.status}</span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {showAdd && (
        <AddMilestoneDrawer
          projects={projects}
          onClose={() => setShowAdd(false)}
          onAdd={partial => {
            const newM: Omit<Milestone, 'id'> = {
              projectId: partial.projectId || '',
              projectName: partial.projectName || '',
              name: partial.name || '',
              owner: partial.owner || '',
              startDate: partial.startDate || new Date().toISOString().split('T')[0],
              endDate: partial.endDate || '',
              progress: 0, 
              status: 'Not Started',
              taskCount: 0, 
              completedTasks: 0,
              notes: partial.notes,
            };
            createMilestone(newM);
            setShowAdd(false);
          }}
        />
      )}
      {selectedMilestone && (
        <MilestoneDetailPanel milestone={selectedMilestone} onClose={() => setSelectedMilestone(null)} projects={projects} tasks={allTasks} />
      )}
    </div>
  );
}