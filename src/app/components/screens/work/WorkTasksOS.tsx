import { useState, useMemo, useRef } from 'react';
import { Button } from '../../ui/button';
import {
  CheckSquare, Plus, Search, LayoutGrid, List, BarChart3,
  ChevronDown, ChevronRight, X, Clock, Calendar, Check, Edit, Trash2,
  MessageSquare, Paperclip, SlidersHorizontal, Download, Timer,
  Target, Zap, DollarSign, Tag, AlertTriangle, Flag, ExternalLink,
  Kanban, GitMerge, GitBranch, ArrowRight, Share2, Link2
} from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useExecutionOS } from '../../../contexts/ExecutionOSContext';
import {
  STATUS_CONFIG, PRIORITY_CONFIG, ALL_STATUSES, ALL_PRIORITIES,
} from './workTypes';
import type { Task, TaskStatus, Priority, ViewMode, GroupBy, FilterState, TaskDependency } from './workTypes';

// ── Helpers ───────────────────────────────────────────────
function StatusBadge({ status }: { status: TaskStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const icons: Record<Priority, string> = {
    Critical: '🔴', High: '🟠', Medium: '🟡', Low: '🔵', None: '⚪'
  };
  const cfg = PRIORITY_CONFIG[priority];
  return (
    <span className={`text-xs px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.color}`}>
      {icons[priority]} {cfg.label}
    </span>
  );
}

function StatusDropdown({ current, onChange }: { current: TaskStatus; onChange: (s: TaskStatus) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const cfg = STATUS_CONFIG[current];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={e => { e.stopPropagation(); setOpen(!open); }}
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${cfg.bg} ${cfg.color} border ${cfg.border} hover:opacity-80`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
        {cfg.label}
        <ChevronDown className="w-2.5 h-2.5" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-44 bg-card border border-border rounded-xl shadow-xl z-50 py-1">
          {ALL_STATUSES.map(s => {
            const c = STATUS_CONFIG[s];
            return (
              <button
                key={s}
                onClick={e => { e.stopPropagation(); onChange(s); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-accent transition-colors ${s === current ? 'font-medium' : ''}`}
              >
                <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                {c.label}
                {s === current && <Check className="w-3 h-3 ml-auto" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Meta Field (used in detail panel) ────────────────────
function MetaField({ label, value, dot, avatar, highlight, mono }: {
  label: string; value: string; dot?: string; avatar?: boolean;
  highlight?: boolean; mono?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <div className="flex items-center gap-1.5">
        {dot && <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: dot }} />}
        {avatar && (
          <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary flex-shrink-0">
            {value.charAt(0)}
          </div>
        )}
        <span className={`text-xs font-medium truncate ${highlight ? 'text-red-500' : ''} ${mono ? 'font-mono' : ''}`}>
          {value}
        </span>
      </div>
    </div>
  );
}

// ── Task Row (List View) ──────────────────────────────────
function TaskRow({
  task, depth = 0, onStatusChange, onDelete, expanded, onToggleExpand, onSelect
}: {
  task: Task;
  depth?: number;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
  expanded: boolean;
  onToggleExpand: (id: string) => void;
  onSelect: (task: Task) => void;
}) {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Closed';
  const hasSubtasks = (task.subtasks?.length ?? 0) > 0;
  const indent = depth * 20;

  return (
    <>
      <div
        className="flex items-center gap-2 px-3 py-2 hover:bg-accent/40 transition-colors group border-b border-border/40 last:border-0 cursor-pointer"
        style={{ paddingLeft: `${12 + indent}px` }}
        onClick={() => onSelect(task)}
      >
        {/* Expand / checkbox column */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {hasSubtasks ? (
            <button
              onClick={e => { e.stopPropagation(); onToggleExpand(task.id); }}
              className="p-0.5 rounded hover:bg-accent"
            >
              {expanded
                ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
            </button>
          ) : (
            <div className="w-5" />
          )}
          <button
            onClick={e => { e.stopPropagation(); onStatusChange(task.id, task.status === 'Closed' ? 'Open' : 'Closed'); }}
            className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
              task.status === 'Closed' ? 'bg-green-500 border-green-500' : 'border-border hover:border-primary'
            }`}
          >
            {task.status === 'Closed' && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
          </button>
        </div>

        {/* Project color dot + task ID */}
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: task.projectColor || '#94a3b8' }} />
        <span className="text-xs text-muted-foreground font-mono flex-shrink-0 w-16">{task.taskId}</span>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <span className={`text-sm ${task.status === 'Closed' ? 'line-through text-muted-foreground' : ''}`}>
            {task.title}
          </span>
          {task.tags && task.tags.length > 0 && (
            <span className="ml-2 text-xs text-muted-foreground">
              {task.tags.slice(0, 2).map(t => `#${t}`).join(' ')}
            </span>
          )}
        </div>

        {/* Metadata columns */}
        <div className="flex items-center gap-3 flex-shrink-0 text-xs" onClick={e => e.stopPropagation()}>
          <StatusDropdown current={task.status} onChange={s => onStatusChange(task.id, s)} />
          <PriorityBadge priority={task.priority} />

          <span className="text-muted-foreground w-24 text-center truncate">{task.assignee.split(' ')[0]}</span>

          <span className={`w-20 text-right ${isOverdue ? 'text-red-500' : 'text-muted-foreground'}`}>
            {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>

          <span className="text-muted-foreground w-12 text-right">{task.estimate}</span>

          {task.billable && (
            <span className="text-green-600 text-xs">$</span>
          )}

          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
            <button onClick={() => onSelect(task)} className="p-1 hover:bg-accent rounded"><ExternalLink className="w-3 h-3 text-muted-foreground" /></button>
            <button onClick={() => onDelete(task.id)} className="p-1 hover:bg-red-50 rounded">
              <Trash2 className="w-3 h-3 text-red-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Subtasks */}
      {expanded && hasSubtasks && task.subtasks!.map(st => (
        <div
          key={st.id}
          className="flex items-center gap-2 px-3 py-1.5 hover:bg-accent/30 border-b border-border/40 bg-muted/20"
          style={{ paddingLeft: `${12 + indent + 32}px` }}
        >
          <button
            className={`w-3.5 h-3.5 rounded border-2 flex-shrink-0 ${st.completed ? 'bg-green-500 border-green-500' : 'border-border'}`}
          >
            {st.completed && <Check className="w-2 h-2 text-white" strokeWidth={3} />}
          </button>
          <span className={`text-xs flex-1 ${st.completed ? 'line-through text-muted-foreground' : ''}`}>
            {st.title}
          </span>
          <span className={`text-xs px-1.5 py-0.5 rounded ${STATUS_CONFIG[st.status].bg} ${STATUS_CONFIG[st.status].color}`}>
            {st.status}
          </span>
          {st.assignee && <span className="text-xs text-muted-foreground">{st.assignee.split(' ')[0]}</span>}
        </div>
      ))}
    </>
  );
}

// ── Drag and Drop Types ───────────────────────────────────
const DRAG_TYPE = 'TASK_CARD';

interface DragItem {
  id: string;
  taskId: string;
  status: TaskStatus;
}

// ── Draggable Task Card ───────────────────────────────────
function DraggableTaskCard({ 
  task, 
  status, 
  onSelect 
}: { 
  task: Task; 
  status: TaskStatus; 
  onSelect: (task: Task) => void;
}) {
  const [{ isDragging }, drag] = useDrag<DragItem, void, { isDragging: boolean }>({
    type: DRAG_TYPE,
    item: { id: task.id, taskId: task.taskId, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const isOverdue = new Date(task.dueDate) < new Date() && status !== 'Closed';

  return (
    <div
      ref={drag}
      onClick={() => onSelect(task)}
      className={`bg-card border border-border rounded-xl p-3 shadow-sm hover:shadow-md transition-all cursor-move group ${
        isDragging ? 'opacity-50 rotate-2 scale-105' : ''
      }`}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs text-muted-foreground font-mono">{task.taskId}</span>
        <PriorityBadge priority={task.priority} />
      </div>
      <p className="text-sm font-medium mb-2 leading-snug">{task.title}</p>
      <div className="flex items-center gap-1.5 mb-2">
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: task.projectColor }} />
        <span className="text-xs text-muted-foreground truncate">{task.projectName}</span>
      </div>
      {task.subtasks && task.subtasks.length > 0 && (
        <div className="flex items-center gap-1 mb-2">
          <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${Math.round((task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100)}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground">
            {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
          </span>
        </div>
      )}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center font-medium text-xs">
          {task.assignee.charAt(0)}
        </div>
        <span className={isOverdue ? 'text-red-500' : ''}>
          {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
        <div className="flex items-center gap-1.5">
          {task.comments ? <span className="flex items-center gap-0.5"><MessageSquare className="w-3 h-3" />{task.comments}</span> : null}
          {task.billable && <span className="text-green-600">$</span>}
        </div>
      </div>
    </div>
  );
}

// ── Board Column ──────────────────────────────────────────
function BoardColumn({ status, tasks, onStatusChange, onSelect }: {
  status: TaskStatus;
  tasks: Task[];
  onStatusChange: (id: string, status: TaskStatus) => void;
  onSelect: (task: Task) => void;
}) {
  const cfg = STATUS_CONFIG[status];
  const BOARD_STATUSES: TaskStatus[] = ['Open', 'In Progress', 'To Be Tested', 'Pending Review', 'Closed'];
  if (!BOARD_STATUSES.includes(status)) return null;

  const [{ isOver, canDrop }, drop] = useDrop<DragItem, void, { isOver: boolean; canDrop: boolean }>({
    accept: DRAG_TYPE,
    drop: (item) => {
      if (item.status !== status) {
        onStatusChange(item.id, status);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div className="flex flex-col w-64 flex-shrink-0">
      <div className={`flex items-center justify-between px-3 py-2 rounded-t-lg ${cfg.bg} border ${cfg.border}`}>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
          <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white/60 ${cfg.color}`}>
          {tasks.length}
        </span>
      </div>
      <div 
        ref={drop}
        className={`flex-1 bg-muted/30 border border-t-0 border-border rounded-b-lg p-2 space-y-2 min-h-[400px] transition-all ${
          isOver && canDrop ? 'bg-primary/10 border-primary ring-2 ring-primary/20' : ''
        }`}
      >
        {tasks.map(task => (
          <DraggableTaskCard
            key={task.id}
            task={task}
            status={status}
            onSelect={onSelect}
          />
        ))}
        <button className="w-full py-2 text-xs text-muted-foreground hover:text-foreground border-2 border-dashed border-border rounded-xl hover:border-primary transition-colors flex items-center justify-center gap-1">
          <Plus className="w-3 h-3" /> Add task
        </button>
      </div>
    </div>
  );
}

// ── Gantt View ────────────────────────────────────────────
function GanttView({ tasks }: { tasks: Task[] }) {
  const today = new Date();
  const startDate = new Date(Math.min(...tasks.map(t => new Date(t.startDate || t.dueDate).getTime())));
  const endDate = new Date(Math.max(...tasks.map(t => new Date(t.dueDate).getTime())));
  startDate.setDate(startDate.getDate() - 2);
  endDate.setDate(endDate.getDate() + 7);

  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / 86400000);
  const dayWidth = 28;

  const weeks: { label: string; days: number }[] = [];
  let cursor = new Date(startDate);
  while (cursor <= endDate) {
    const weekStart = new Date(cursor);
    weeks.push({ label: `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`, days: 7 });
    cursor.setDate(cursor.getDate() + 7);
  }

  const getTaskLeft = (task: Task) => {
    const start = new Date(task.startDate || task.dueDate);
    start.setDate(start.getDate() - (task.estimatedHours ? Math.ceil(task.estimatedHours / 8) : 1));
    const days = Math.max(0, Math.ceil((start.getTime() - startDate.getTime()) / 86400000));
    return days * dayWidth;
  };

  const getTaskWidth = (task: Task) => {
    const durationDays = task.estimatedHours ? Math.max(1, Math.ceil(task.estimatedHours / 8)) : 2;
    return Math.max(durationDays * dayWidth, 40);
  };

  const todayLeft = Math.ceil((today.getTime() - startDate.getTime()) / 86400000) * dayWidth;

  return (
    <div className="overflow-auto">
      <div style={{ minWidth: `${300 + totalDays * dayWidth}px` }}>
        {/* Header */}
        <div className="flex border-b border-border sticky top-0 bg-card z-10">
          <div className="w-72 flex-shrink-0 px-4 py-2 text-xs font-semibold text-muted-foreground border-r border-border">
            Task
          </div>
          <div className="flex" style={{ width: `${totalDays * dayWidth}px` }}>
            {weeks.map((w, i) => (
              <div key={i} className="border-r border-border px-2 py-2 text-xs text-muted-foreground"
                style={{ width: `${w.days * dayWidth}px` }}>
                {w.label}
              </div>
            ))}
          </div>
        </div>

        {/* Tasks */}
        {tasks.map(task => (
          <div key={task.id} className="flex items-center border-b border-border/50 hover:bg-accent/20">
            {/* Task label */}
            <div className="w-72 flex-shrink-0 px-4 py-2 flex items-center gap-2 border-r border-border">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: task.projectColor }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{task.title}</p>
                <p className="text-xs text-muted-foreground">{task.assignee.split(' ')[0]}</p>
              </div>
              <StatusBadge status={task.status} />
            </div>

            {/* Gantt bar area */}
            <div className="relative" style={{ width: `${totalDays * dayWidth}px`, height: 40 }}>
              {/* Today line */}
              <div className="absolute top-0 bottom-0 w-0.5 bg-red-400 opacity-60 z-10" style={{ left: todayLeft }} />
              {/* Background bar (total) */}
              <div
                className="absolute top-1/2 -translate-y-1/2 h-5 rounded-full"
                style={{
                  left: getTaskLeft(task),
                  width: getTaskWidth(task),
                  backgroundColor: `${task.projectColor || '#3b82f6'}30`,
                  border: `1px solid ${task.projectColor || '#3b82f6'}60`,
                }}
              >
                {/* Progress fill */}
                {task.progress !== undefined && (
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${task.progress}%`,
                      backgroundColor: task.projectColor || '#3b82f6',
                      opacity: task.status === 'Closed' ? 0.5 : 0.85,
                    }}
                  />
                )}
                <span className="absolute inset-0 flex items-center px-2 text-xs font-medium"
                  style={{ color: task.projectColor || '#3b82f6' }}>
                  {task.taskId}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Task Detail Panel ─────────────────────────────────────
function TaskDetailPanel({ task, onClose, onStatusChange, timeLogs, activityFeed }: {
  task: Task;
  onClose: () => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  timeLogs: any[];
  activityFeed: any[];
}) {
  const [detailTab, setDetailTab] = useState<'overview' | 'timelogs' | 'activity'>('overview');
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Closed';
  const completedSubtasks = task.subtasks?.filter(s => s.completed).length ?? 0;
  const totalSubtasks = task.subtasks?.length ?? 0;
  const taskTimeLogs = timeLogs.filter(tl => tl.taskId === task.id);
  const totalLogged = taskTimeLogs.reduce((s, tl) => s + tl.hours, 0);
  const relatedActivity = activityFeed.filter(a =>
    a.target.toLowerCase().includes(task.title.slice(0, 15).toLowerCase())
  );

  const approvalColors: Record<string, string> = {
    'Approved': 'bg-green-100 text-green-700',
    'Pending Approval': 'bg-amber-100 text-amber-700',
    'Rejected': 'bg-red-100 text-red-700',
  };

  return (
    <div className="w-[420px] flex-shrink-0 bg-card border-l border-border flex flex-col h-full overflow-hidden shadow-xl">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border bg-card">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h2 className="font-semibold leading-snug flex-1 text-sm">{task.title}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-accent rounded-lg flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">{task.taskId}</span>
          <StatusDropdown current={task.status} onChange={s => onStatusChange(task.id, s)} />
          <PriorityBadge priority={task.priority} />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap mt-2">
          {task.billable && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">💰 Billable</span>}
          {isOverdue && <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">⏰ Overdue</span>}
          {task.approvalStatus && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${approvalColors[task.approvalStatus] || 'bg-muted text-muted-foreground'}`}>
              {task.approvalStatus}
            </span>
          )}
          {task.hasEvidence && <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">📎 Evidence ({task.evidenceCount})</span>}
        </div>
      </div>

      {/* Progress bar */}
      {task.progress !== undefined && task.progress > 0 && (
        <div className="px-5 py-2.5 border-b border-border/50 bg-muted/20">
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Progress</span>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${task.progress}%`, backgroundColor: task.projectColor || '#3b82f6' }}
              />
            </div>
            <span className="text-xs font-semibold">{task.progress}%</span>
          </div>
        </div>
      )}

      {/* Metadata grid */}
      <div className="px-5 py-3 border-b border-border/50 grid grid-cols-2 gap-x-4 gap-y-3">
        <MetaField label="Project" value={task.projectName} dot={task.projectColor} />
        <MetaField label="Assignee" value={task.assignee} avatar />
        <MetaField
          label="Due Date"
          value={new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          highlight={isOverdue}
        />
        {task.startDate && (
          <MetaField
            label="Start Date"
            value={new Date(task.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
        )}
        <MetaField label="Estimate" value={task.estimate} />
        <MetaField label="Time Logged" value={`${totalLogged > 0 ? totalLogged.toFixed(1) : task.actualTime}`} />
        {task.milestoneName && <MetaField label="Milestone" value={task.milestoneName} />}
        {task.sprintName && <MetaField label="Sprint" value={task.sprintName} />}
        {task.taskListName && <MetaField label="Task List" value={task.taskListName} />}
        {task.storyPoints !== undefined && <MetaField label="Story Points" value={`${task.storyPoints} pts`} />}
        {task.client && <MetaField label="Client" value={task.client} />}
        <MetaField label="Department" value={task.assigneeDepartment} />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border px-1 bg-card">
        {(['overview', 'timelogs', 'activity'] as const).map(t => (
          <button
            key={t}
            onClick={() => setDetailTab(t)}
            className={`px-4 py-2.5 text-xs capitalize border-b-2 transition-colors whitespace-nowrap ${
              detailTab === t ? 'border-primary text-primary font-medium' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t === 'timelogs' ? 'Time Logs' : t.charAt(0).toUpperCase() + t.slice(1)}
            {t === 'timelogs' && timeLogs.length > 0 && (
              <span className="ml-1 text-xs bg-muted text-muted-foreground px-1 rounded">{timeLogs.length}</span>
            )}
            {t === 'overview' && totalSubtasks > 0 && (
              <span className="ml-1 text-xs bg-muted text-muted-foreground px-1 rounded">{completedSubtasks}/{totalSubtasks}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        {/* ── Overview ────────────────── */}
        {detailTab === 'overview' && (
          <div className="p-5 space-y-5">
            {/* Description */}
            {task.description && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Description</p>
                <p className="text-sm text-muted-foreground leading-relaxed bg-muted/40 rounded-xl p-3">{task.description}</p>
              </div>
            )}

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {task.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Subtasks */}
            {task.subtasks && task.subtasks.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Subtasks</p>
                  <span className="text-xs text-muted-foreground">{completedSubtasks}/{totalSubtasks} done</span>
                </div>
                <div className="mb-3 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0}%` }}
                  />
                </div>
                <div className="space-y-1.5">
                  {task.subtasks.map(st => {
                    const stCfg = STATUS_CONFIG[st.status];
                    return (
                      <div key={st.id} className="flex items-center gap-2.5 py-1.5 px-3 rounded-lg hover:bg-accent/50 bg-muted/20 border border-border/50">
                        <div className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center ${st.completed ? 'bg-green-500 border-green-500' : 'border-border'}`}>
                          {st.completed && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                        </div>
                        <span className={`text-xs flex-1 ${st.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {st.title}
                        </span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${stCfg.bg} ${stCfg.color}`}>{st.status}</span>
                        {st.assignee && (
                          <span className="text-xs text-muted-foreground w-12 text-right">{st.assignee.split(' ')[0]}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Attachments & Comments stats */}
            {(task.comments || task.attachments) ? (
              <div className="flex gap-4 pt-1">
                {task.comments ? (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {task.comments} comment{task.comments !== 1 ? 's' : ''}
                  </div>
                ) : null}
                {task.attachments ? (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Paperclip className="w-3.5 h-3.5" />
                    {task.attachments} attachment{task.attachments !== 1 ? 's' : ''}
                  </div>
                ) : null}
              </div>
            ) : null}

            {/* Burn & Profit */}
            {(task.burnAmount || task.profitImpact) ? (
              <div className="grid grid-cols-2 gap-3 pt-1">
                {task.burnAmount ? (
                  <div className="bg-muted/40 rounded-xl p-3">
                    <p className="text-xs text-muted-foreground">Burn Amount</p>
                    <p className="text-sm font-semibold">${task.burnAmount.toLocaleString()}</p>
                  </div>
                ) : null}
                {task.profitImpact !== undefined ? (
                  <div className={`rounded-xl p-3 ${task.profitImpact >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                    <p className="text-xs text-muted-foreground">Profit Impact</p>
                    <p className={`text-sm font-semibold ${task.profitImpact >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                      {task.profitImpact >= 0 ? '+' : ''}${task.profitImpact}
                    </p>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        )}

        {/* ── Time Logs ───────────────── */}
        {detailTab === 'timelogs' && (
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Time Logs</p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  {totalLogged.toFixed(1)}h logged
                </span>
                {task.estimatedHours && (
                  <span className="text-xs text-muted-foreground">/ {task.estimatedHours}h est.</span>
                )}
              </div>
            </div>

            {/* Progress vs estimate */}
            {task.estimatedHours && (
              <div className="mb-4">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${totalLogged > task.estimatedHours ? 'bg-red-400' : 'bg-blue-500'}`}
                    style={{ width: `${Math.min((totalLogged / task.estimatedHours) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round((totalLogged / task.estimatedHours) * 100)}% of estimate used
                  {totalLogged > task.estimatedHours && <span className="text-red-500 ml-1">(over budget)</span>}
                </p>
              </div>
            )}

            {timeLogs.length === 0 ? (
              <div className="text-center py-8">
                <Timer className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">No time logged yet</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {timeLogs.map(tl => (
                  <div key={tl.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-xl border border-border/50">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium leading-snug">{tl.description}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                          {tl.loggedBy.charAt(0)}
                        </div>
                        <span className="text-xs text-muted-foreground">{tl.loggedBy.split(' ')[0]}</span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">{new Date(tl.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        {tl.billable && (
                          <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">$</span>
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-semibold flex-shrink-0 text-primary">{tl.duration}</span>
                  </div>
                ))}
              </div>
            )}

            <button className="mt-4 w-full flex items-center justify-center gap-2 text-xs text-primary border border-primary/30 rounded-xl py-2 hover:bg-primary/5 transition-colors">
              <Timer className="w-3.5 h-3.5" /> Log Time
            </button>
          </div>
        )}

        {/* ── Activity ──────────────────── */}
        {detailTab === 'activity' && (
          <div className="p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Recent Activity</p>
            {relatedActivity.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">No recent activity for this task</p>
                <p className="text-xs text-muted-foreground mt-1">Activity will appear here as the team works on it</p>
              </div>
            ) : (
              <div className="space-y-3">
                {relatedActivity.map(activity => (
                  <div key={activity.id} className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-xs font-medium text-primary">
                      {activity.actorInitial}
                    </div>
                    <div className="flex-1 bg-muted/30 rounded-xl p-2.5">
                      <p className="text-xs">
                        <span className="font-medium">{activity.actor.split(' ')[0]}</span>
                        {' '}<span className="text-muted-foreground">{activity.message}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(activity.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Mock comment composer */}
            <div className="mt-4 flex gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-xs font-medium text-white flex-shrink-0">S</div>
              <div className="flex-1 border border-border rounded-xl px-3 py-2 text-xs text-muted-foreground bg-background cursor-text hover:border-primary/50 transition-colors">
                Add a comment...
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sprint Board View ─────────────────────────────────────
const SPRINT_BOARD_STATUSES: TaskStatus[] = ['Open', 'In Progress', 'To Be Tested', 'Pending Review', 'Closed'];

function SprintMiniCard({ task, onSelect }: { task: Task; onSelect: (t: Task) => void }) {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Closed';

  const [{ isDragging }, drag] = useDrag<DragItem, void, { isDragging: boolean }>({
    type: DRAG_TYPE,
    item: { id: task.id, taskId: task.taskId, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      onClick={() => onSelect(task)}
      className={`bg-card border border-border rounded-xl p-2.5 hover:shadow-md hover:border-primary/30 transition-all cursor-move text-xs ${
        isDragging ? 'opacity-50 rotate-1 scale-105' : ''
      }`}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-muted-foreground font-mono">{task.taskId}</span>
        <PriorityBadge priority={task.priority} />
      </div>
      <p className="font-medium leading-snug mb-2">{task.title}</p>
      <div className="flex items-center gap-1.5 mb-1.5">
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: task.projectColor || '#94a3b8' }} />
        <span className="text-muted-foreground truncate flex-1">{task.projectName}</span>
      </div>
      {task.subtasks && task.subtasks.length > 0 && (
        <div className="flex items-center gap-1 mb-1.5">
          <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${Math.round((task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100)}%` }} />
          </div>
          <span className="text-muted-foreground">{task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}</span>
        </div>
      )}
      <div className="flex items-center justify-between mt-1">
        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center font-medium text-primary">{task.assignee.charAt(0)}</div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          {task.storyPoints !== undefined && <span className="bg-muted px-1.5 py-0.5 rounded">{task.storyPoints}pt</span>}
          <span className={isOverdue ? 'text-red-500 font-medium' : ''}>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
      </div>
    </div>
  );
}

function SprintBoardView({ tasks, onStatusChange, onSelect }: {
  tasks: Task[];
  onStatusChange: (id: string, s: TaskStatus) => void;
  onSelect: (t: Task) => void;
}) {
  const [selectedSprintId, setSelectedSprintId] = useState<string>('all');

  const allSprints: any[] = [];
  const visibleSprints = selectedSprintId === 'all'
    ? allSprints.filter(s => s.status === 'Active' || s.status === 'Planning')
    : allSprints.filter(s => s.id === selectedSprintId);

  const unsprintedActiveTasks = tasks.filter(t => !t.sprintId && t.status !== 'Closed');

  const sprintStatusColors: Record<string, string> = {
    'Active': 'bg-green-100 text-green-700 border-green-200',
    'Planning': 'bg-blue-100 text-blue-700 border-blue-200',
    'Completed': 'bg-gray-100 text-gray-600 border-gray-200',
    'Cancelled': 'bg-red-100 text-red-600 border-red-200',
  };

  return (
    <div className="flex flex-col gap-5 p-4 overflow-auto h-full">
      {/* Sprint selector */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium text-muted-foreground">Sprint view:</span>
        <button
          onClick={() => setSelectedSprintId('all')}
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
            selectedSprintId === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/50'
          }`}
        >
          Active & Planning ({allSprints.filter(s => s.status === 'Active' || s.status === 'Planning').length})
        </button>
        {allSprints.map(s => (
          <button
            key={s.id}
            onClick={() => setSelectedSprintId(s.id)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors flex items-center gap-1.5 ${
              selectedSprintId === s.id ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/50'
            }`}
          >
            {s.name}
            <span className={`text-xs px-1.5 py-0.5 rounded-full border ${selectedSprintId === s.id ? 'bg-white/20 text-white border-white/30' : sprintStatusColors[s.status]}`}>
              {s.status}
            </span>
          </button>
        ))}
      </div>

      {/* Sprint swim lanes */}
      {visibleSprints.map(sprint => {
        const sprintTasks = tasks.filter(t => t.sprintId === sprint.id);
        const pct = sprint.storyPoints > 0 ? Math.round((sprint.completedPoints / sprint.storyPoints) * 100) : 0;
        const daysLeft = Math.ceil((new Date(sprint.endDate).getTime() - Date.now()) / 86400000);
        const isActive = sprint.status === 'Active';
        const pointsRemaining = sprint.storyPoints - sprint.completedPoints;
        const daysLeftClamped = Math.max(1, daysLeft);
        const weekdaysLeft = Math.max(1, Math.ceil(daysLeftClamped * (5 / 7)));
        const velocityNeeded = Math.round(pointsRemaining / weekdaysLeft);

        return (
          <div key={sprint.id} className={`rounded-2xl border overflow-hidden ${isActive ? 'border-blue-300' : 'border-border'}`}>
            {/* Sprint header */}
            <div className={`px-5 py-3.5 flex flex-wrap items-center gap-4 justify-between ${isActive ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' : 'bg-muted/50'}`}>
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 flex-shrink-0" />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold">{sprint.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${isActive ? 'bg-white/20 text-white border-white/30' : sprintStatusColors[sprint.status]}`}>{sprint.status}</span>
                  </div>
                  <p className={`text-xs mt-0.5 ${isActive ? 'text-blue-100' : 'text-muted-foreground'}`}>
                    {sprint.projectName} · {new Date(sprint.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(sprint.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-5 text-xs">
                {[
                  { label: 'Points', value: `${sprint.completedPoints}/${sprint.storyPoints}` },
                  { label: 'Done', value: `${pct}%` },
                  { label: 'Tasks', value: `${sprint.completedTasks}/${sprint.taskCount}` },
                  { label: isActive ? 'Days Left' : 'Sprint', value: isActive ? (daysLeft > 0 ? `${daysLeft}d` : 'Ended') : sprint.status },
                ].map((k, i) => (
                  <div key={i} className="text-center">
                    <p className="font-bold">{k.value}</p>
                    <p className={isActive ? 'text-blue-200' : 'text-muted-foreground'}>{k.label}</p>
                  </div>
                ))}
                <div className="w-28">
                  <div className={`h-2 rounded-full overflow-hidden ${isActive ? 'bg-white/25' : 'bg-muted'}`}>
                    <div className={`h-full rounded-full ${isActive ? 'bg-white' : 'bg-primary'}`} style={{ width: `${pct}%` }} />
                  </div>
                  {isActive && daysLeft > 0 && (
                    <p className={`text-xs mt-0.5 ${velocityNeeded > 8 ? 'text-red-300' : 'text-blue-200'}`}>
                      {velocityNeeded}pt/day needed
                    </p>
                  )}
                </div>
              </div>
            </div>

            {sprint.goal && (
              <div className={`px-5 py-2 border-b text-xs flex items-center gap-2 ${isActive ? 'border-blue-200 bg-blue-50/50 text-blue-700' : 'border-border bg-muted/30 text-muted-foreground'}`}>
                <Target className="w-3.5 h-3.5 flex-shrink-0" />
                <span><span className="font-medium">Goal:</span> {sprint.goal}</span>
              </div>
            )}

            {/* Kanban columns */}
            <div className="flex gap-3 p-4 overflow-x-auto bg-background/50">
              {SPRINT_BOARD_STATUSES.map(status => {
                const cfg = STATUS_CONFIG[status];
                const colTasks = sprintTasks.filter(t => t.status === status);
                const colPoints = colTasks.reduce((s, t) => s + (t.storyPoints || 0), 0);

                // eslint-disable-next-line react-hooks/rules-of-hooks
                const [{ isOver, canDrop }, drop] = useDrop<DragItem, void, { isOver: boolean; canDrop: boolean }>({
                  accept: DRAG_TYPE,
                  drop: (item) => {
                    if (item.status !== status) {
                      onStatusChange(item.id, status);
                    }
                  },
                  collect: (monitor) => ({
                    isOver: monitor.isOver(),
                    canDrop: monitor.canDrop(),
                  }),
                });

                return (
                  <div key={status} className="flex flex-col w-52 flex-shrink-0">
                    <div className={`flex items-center justify-between px-2.5 py-1.5 rounded-t-lg ${cfg.bg} border ${cfg.border}`}>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-bold ${cfg.color}`}>{colTasks.length}</span>
                        {colPoints > 0 && <span className="text-xs text-muted-foreground">{colPoints}pt</span>}
                      </div>
                    </div>
                    <div 
                      ref={drop}
                      className={`flex-1 bg-muted/30 border border-t-0 border-border rounded-b-lg p-2 space-y-1.5 min-h-[140px] transition-all ${
                        isOver && canDrop ? 'bg-primary/10 border-primary ring-2 ring-primary/20' : ''
                      }`}
                    >
                      {colTasks.map(task => (
                        <SprintMiniCard key={task.id} task={task} onSelect={onSelect} />
                      ))}
                      {colTasks.length === 0 && (
                        <div className="flex items-center justify-center h-14 text-xs text-muted-foreground/40">Empty</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Backlog */}
      {selectedSprintId === 'all' && unsprintedActiveTasks.length > 0 && (
        <div className="rounded-2xl border border-dashed border-border overflow-hidden">
          <div className="px-5 py-3 bg-muted/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitMerge className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium text-sm">Backlog</span>
              <span className="text-xs text-muted-foreground">— not assigned to any sprint</span>
              <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{unsprintedActiveTasks.length}</span>
            </div>
            <span className="text-xs text-muted-foreground">{unsprintedActiveTasks.reduce((s, t) => s + (t.storyPoints || 0), 0)}pt total</span>
          </div>
          <div className="flex gap-3 p-4 overflow-x-auto bg-muted/10">
            {SPRINT_BOARD_STATUSES.map(status => {
              const cfg = STATUS_CONFIG[status];
              const colTasks = unsprintedActiveTasks.filter(t => t.status === status);
              if (colTasks.length === 0) return null;

              // eslint-disable-next-line react-hooks/rules-of-hooks
              const [{ isOver, canDrop }, drop] = useDrop<DragItem, void, { isOver: boolean; canDrop: boolean }>({
                accept: DRAG_TYPE,
                drop: (item) => {
                  if (item.status !== status) {
                    onStatusChange(item.id, status);
                  }
                },
                collect: (monitor) => ({
                  isOver: monitor.isOver(),
                  canDrop: monitor.canDrop(),
                }),
              });

              return (
                <div key={status} className="flex flex-col w-52 flex-shrink-0">
                  <div className={`flex items-center justify-between px-2.5 py-1.5 rounded-t-lg ${cfg.bg} border ${cfg.border}`}>
                    <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
                    <span className={`text-xs font-bold ${cfg.color}`}>{colTasks.length}</span>
                  </div>
                  <div 
                    ref={drop}
                    className={`flex-1 bg-muted/20 border border-t-0 border-border rounded-b-lg p-2 space-y-1.5 transition-all ${
                      isOver && canDrop ? 'bg-primary/10 border-primary ring-2 ring-primary/20' : ''
                    }`}
                  >
                    {colTasks.map(task => (
                      <SprintMiniCard key={task.id} task={task} onSelect={onSelect} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Dependency View ───────────────────────────────────────
function DependencyView({ tasks, dependencies, onSelect }: {
  tasks: Task[];
  dependencies: TaskDependency[];
  onSelect: (t: Task) => void;
}) {
  const [selectedType, setSelectedType] = useState<'all' | 'blocks' | 'relates_to'>('all');

  const taskMap = new Map(tasks.map(t => [t.id, t]));

  const visibleDeps = selectedType === 'all'
    ? dependencies
    : dependencies.filter(d => d.type === selectedType);

  const blockedTaskIds = new Set(
    dependencies.filter(d => d.type === 'blocks').map(d => d.toTaskId)
  );
  const blockingTaskIds = new Set(
    dependencies.filter(d => d.type === 'blocks').map(d => d.fromTaskId)
  );
  const blockedCount = blockedTaskIds.size;
  const criticalCount = tasks.filter(t => blockedTaskIds.has(t.id) && t.priority === 'Critical').length;

  // Build dependency chains (for chain visualization)
  const chains: Task[][] = [];
  const visited = new Set<string>();
  const buildChain = (taskId: string, chain: Task[]): void => {
    if (visited.has(taskId)) return;
    visited.add(taskId);
    const task = taskMap.get(taskId);
    if (task) chain.push(task);
    const downstream = dependencies.filter(d => d.fromTaskId === taskId && d.type === 'blocks').map(d => d.toTaskId);
    downstream.forEach(next => buildChain(next, chain));
  };
  // Find chain roots (tasks not blocked by any other task)
  const roots = [...blockingTaskIds].filter(id => !blockedTaskIds.has(id));
  roots.forEach(root => {
    const chain: Task[] = [];
    buildChain(root, chain);
    if (chain.length > 1) chains.push(chain);
    visited.clear();
  });

  const typeColors = {
    blocks:     'bg-red-100 text-red-700 border-red-300',
    relates_to: 'bg-blue-100 text-blue-700 border-blue-300',
    duplicates: 'bg-gray-100 text-gray-600 border-gray-300',
  };
  const typeLabel = { blocks: '🔴 Blocks', relates_to: '🔵 Relates To', duplicates: '⚪ Duplicates' };

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Summary strip */}
      <div className="grid grid-cols-4 gap-4 p-4 border-b border-border bg-muted/20">
        {[
          { label: 'Total Links',  value: dependencies.length,  color: 'text-foreground', icon: Link2 },
          { label: 'Blocking',     value: dependencies.filter(d => d.type === 'blocks').length, color: 'text-red-500', icon: AlertTriangle },
          { label: 'Tasks Blocked', value: blockedCount,         color: 'text-orange-500', icon: GitBranch },
          { label: 'Critical Blocked', value: criticalCount,    color: 'text-red-600', icon: Flag },
        ].map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className="bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-3">
              <Icon className={`w-5 h-5 ${k.color} flex-shrink-0`} />
              <div>
                <p className={`text-xl font-semibold ${k.color}`}>{k.value}</p>
                <p className="text-xs text-muted-foreground">{k.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-6 p-4 overflow-auto flex-1">
        {/* Left: Dependency Chains */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* Type filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Show:</span>
            {(['all', 'blocks', 'relates_to'] as const).map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  selectedType === type ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/50'
                }`}
              >
                {type === 'all' ? `All (${dependencies.length})` :
                 type === 'blocks' ? `Blocks (${dependencies.filter(d => d.type === 'blocks').length})` :
                 `Relates To (${dependencies.filter(d => d.type === 'relates_to').length})`}
              </button>
            ))}
          </div>

          {/* Blocking Chains */}
          {chains.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Share2 className="w-4 h-4 text-red-500" /> Blocking Chains
                <span className="text-xs text-muted-foreground font-normal">Critical paths through your tasks</span>
              </h3>
              {chains.map((chain, ci) => (
                <div key={ci} className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center gap-0 flex-wrap">
                    {chain.map((task, ti) => {
                      const cfg = STATUS_CONFIG[task.status];
                      const isBlocked = blockedTaskIds.has(task.id);
                      return (
                        <div key={task.id} className="flex items-center gap-0">
                          <div
                            onClick={() => onSelect(task)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer hover:shadow-md transition-all group ${
                              isBlocked ? 'border-red-200 bg-red-50' : 'border-border bg-muted/30'
                            }`}
                          >
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: task.projectColor || '#94a3b8' }} />
                            <div>
                              <p className="text-xs font-mono text-muted-foreground">{task.taskId}</p>
                              <p className="text-xs font-medium max-w-[160px] truncate group-hover:text-primary">{task.title}</p>
                              <span className={`text-xs px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                            </div>
                            {isBlocked && <AlertTriangle className="w-3 h-3 text-red-500 flex-shrink-0" />}
                          </div>
                          {ti < chain.length - 1 && (
                            <div className="flex items-center px-1">
                              <div className="w-6 h-0.5 bg-red-400" />
                              <ArrowRight className="w-3 h-3 text-red-400 -ml-1" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* All Dependencies Table */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-muted-foreground" /> All Dependencies
            </h3>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="grid grid-cols-[1fr_80px_1fr_100px] gap-0 bg-muted/50 px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border">
                <span>From Task</span>
                <span className="text-center">Type</span>
                <span>To Task</span>
                <span className="text-right">Status</span>
              </div>
              {visibleDeps.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground text-sm">No dependencies found</div>
              ) : (
                visibleDeps.map(dep => {
                  const from = taskMap.get(dep.fromTaskId);
                  const to = taskMap.get(dep.toTaskId);
                  if (!from || !to) return null;
                  const toCfg = STATUS_CONFIG[to.status];
                  return (
                    <div key={dep.id} className="grid grid-cols-[1fr_80px_1fr_100px] gap-0 px-4 py-2.5 border-b border-border/50 hover:bg-accent/30 transition-colors items-center">
                      {/* From task */}
                      <button className="flex items-center gap-2 text-left group" onClick={() => onSelect(from)}>
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: from.projectColor || '#94a3b8' }} />
                        <div className="min-w-0">
                          <p className="text-xs font-mono text-muted-foreground">{from.taskId}</p>
                          <p className="text-xs font-medium truncate group-hover:text-primary">{from.title}</p>
                        </div>
                      </button>
                      {/* Type badge */}
                      <div className="flex justify-center">
                        <span className={`text-xs px-2 py-1 rounded-full border ${typeColors[dep.type]}`}>
                          {dep.type === 'blocks' ? '→ blocks' : '↔ relates'}
                        </span>
                      </div>
                      {/* To task */}
                      <button className="flex items-center gap-2 text-left group" onClick={() => onSelect(to)}>
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: to.projectColor || '#94a3b8' }} />
                        <div className="min-w-0">
                          <p className="text-xs font-mono text-muted-foreground">{to.taskId}</p>
                          <p className="text-xs font-medium truncate group-hover:text-primary">{to.title}</p>
                        </div>
                      </button>
                      {/* Status */}
                      <div className="flex justify-end">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${toCfg.bg} ${toCfg.color}`}>{toCfg.label}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right: Blocked Tasks Summary */}
        <div className="w-72 flex-shrink-0 space-y-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" /> Blocked Tasks
            </h3>
            {blockedCount === 0 ? (
              <p className="text-xs text-green-600 flex items-center gap-1.5">
                <Check className="w-3 h-3" /> No blocked tasks!
              </p>
            ) : (
              <div className="space-y-2">
                {[...blockedTaskIds].map(id => {
                  const task = taskMap.get(id);
                  if (!task) return null;
                  const cfg = STATUS_CONFIG[task.status];
                  const blockers = dependencies.filter(d => d.toTaskId === id && d.type === 'blocks')
                    .map(d => taskMap.get(d.fromTaskId))
                    .filter(Boolean) as Task[];
                  return (
                    <div
                      key={id}
                      onClick={() => onSelect(task)}
                      className="p-3 bg-red-50 border border-red-200 rounded-xl cursor-pointer hover:border-red-400 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-muted-foreground">{task.taskId}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                      </div>
                      <p className="text-xs font-medium leading-snug">{task.title}</p>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {blockers.map(b => (
                          <span key={b.id} className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded border border-red-200">
                            Blocked by: {b.taskId}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-500" /> Blocking Tasks
            </h3>
            <div className="space-y-2">
              {[...blockingTaskIds].map(id => {
                const task = taskMap.get(id);
                if (!task) return null;
                const blocksCount = dependencies.filter(d => d.fromTaskId === id && d.type === 'blocks').length;
                const cfg = STATUS_CONFIG[task.status];
                return (
                  <div
                    key={id}
                    onClick={() => onSelect(task)}
                    className="p-2.5 bg-muted/30 border border-border rounded-xl cursor-pointer hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono text-muted-foreground">{task.taskId}</span>
                      <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full">blocks {blocksCount}</span>
                    </div>
                    <p className="text-xs font-medium truncate">{task.title}</p>
                    <span className={`text-xs px-1.5 py-0.5 rounded mt-1 inline-block ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Create Task Modal ─────────────────────────────────────
function CreateTaskModal({ onClose, onAdd, projects, milestones, sprints, teamMembers }: {
  onClose: () => void;
  onAdd: (task: Omit<Task, 'id'>) => void;
  projects: any[];
  milestones: any[];
  sprints: any[];
  teamMembers: any[];
}) {
  const [form, setForm] = useState({
    title: '', projectId: 'p1', assignee: 'Sarah Chen', priority: 'Medium' as Task['priority'],
    status: 'Open' as TaskStatus, dueDate: '', estimate: '2h', description: '',
    billable: true, milestoneId: '', sprintId: '', tags: '',
  });
  const [done, setDone] = useState(false);
  const [newTask, setNewTask] = useState<Task | null>(null);

  const project = projects.find(p => p.id === form.projectId);
  const TEAM = teamMembers.map(m => m.name);
  const projectMilestones = milestones.filter(m => m.projectId === form.projectId);
  const projectSprints = sprints.filter(s => s.projectId === form.projectId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.dueDate) return;
    const taskIdPrefix = project?.code || 'TSK';
    const taskIdNum = Math.floor(Math.random() * 900) + 100;
    const task: Omit<Task, 'id'> = {
      taskId: `${taskIdPrefix}-${taskIdNum}`,
      title: form.title.trim(),
      projectId: form.projectId, projectName: project?.name || '',
      projectColor: project?.color,
      milestoneId: form.milestoneId || undefined,
      milestoneName: milestones.find(m => m.id === form.milestoneId)?.name,
      sprintId: form.sprintId || undefined,
      sprintName: sprints.find(s => s.id === form.sprintId)?.name,
      assignee: form.assignee, assigneeDepartment: teamMembers.find(m => m.name === form.assignee)?.department || 'General',
      status: form.status, priority: form.priority,
      dueDate: form.dueDate,
      estimate: form.estimate, estimatedHours: parseFloat(form.estimate) || 2,
      actualTime: '0h', actualHours: 0,
      progress: 0, billable: form.billable,
      hasEvidence: false, evidenceCount: 0,
      description: form.description || undefined,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      comments: 0, attachments: 0,
      approvalStatus: 'Approved',
      storyPoints: 2,
    };
    onAdd(task);
    setDone(true);
  };

  const priorityColors: Record<string, string> = {
    Critical: 'bg-red-500', High: 'bg-orange-500', Medium: 'bg-yellow-400', Low: 'bg-blue-400', None: 'bg-gray-300',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-black/40" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-[600px] max-h-[80vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-card">
          <h2 className="font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" /> Create New Task
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-accent rounded-lg"><X className="w-4 h-4" /></button>
        </div>

        {done && newTask ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Check className="w-7 h-7 text-green-600" strokeWidth={3} />
            </div>
            <h3 className="font-semibold text-lg mb-1">Task Created!</h3>
            <p className="text-sm text-muted-foreground mb-1">
              <span className="font-medium text-foreground">{newTask.title}</span>
            </p>
            <p className="text-xs text-muted-foreground">{newTask.taskId} · {newTask.projectName} · Due {new Date(newTask.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
            <div className="flex gap-2 justify-center mt-6">
              <Button onClick={() => { setDone(false); setForm({ title: '', projectId: 'p1', assignee: 'Sarah Chen', priority: 'Medium', status: 'Open', dueDate: '', estimate: '2h', description: '', billable: true, milestoneId: '', sprintId: '', tags: '' }); }}>
                <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Another
              </Button>
              <Button variant="outline" onClick={onClose}>Done</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Title */}
            <div>
              <label className="text-sm font-medium block mb-1.5">Task Title *</label>
              <input
                autoFocus required
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="What needs to be done?"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Project */}
              <div>
                <label className="text-sm font-medium block mb-1.5">Project *</label>
                <select className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background"
                  value={form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value, milestoneId: '', sprintId: '' })}>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.code} — {p.name}</option>)}
                </select>
                {project && <div className="flex items-center gap-1.5 mt-1.5"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: project.color }} /><span className="text-xs text-muted-foreground">{project.client}</span></div>}
              </div>

              {/* Assignee */}
              <div>
                <label className="text-sm font-medium block mb-1.5">Assignee *</label>
                <select className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background"
                  value={form.assignee} onChange={e => setForm({ ...form, assignee: e.target.value })}>
                  {TEAM.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="text-sm font-medium block mb-1.5">Priority</label>
                <div className="flex gap-1.5 flex-wrap">
                  {(['Critical', 'High', 'Medium', 'Low', 'None'] as const).map(p => (
                    <button
                      key={p} type="button"
                      onClick={() => setForm({ ...form, priority: p })}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1 ${
                        form.priority === p ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/50'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${priorityColors[p]}`} />
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="text-sm font-medium block mb-1.5">Status</label>
                <select className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background"
                  value={form.status} onChange={e => setForm({ ...form, status: e.target.value as TaskStatus })}>
                  {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="text-sm font-medium block mb-1.5">Due Date *</label>
                <input required type="date" className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background"
                  value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
              </div>

              {/* Estimate */}
              <div>
                <label className="text-sm font-medium block mb-1.5">Estimate</label>
                <select className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background"
                  value={form.estimate} onChange={e => setForm({ ...form, estimate: e.target.value })}>
                  {['1h', '2h', '3h', '4h', '6h', '8h', '10h', '12h', '16h', '20h'].map(e => <option key={e}>{e}</option>)}
                </select>
              </div>

              {/* Milestone */}
              <div>
                <label className="text-sm font-medium block mb-1.5">Milestone</label>
                <select className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background"
                  value={form.milestoneId} onChange={e => setForm({ ...form, milestoneId: e.target.value })}>
                  <option value="">None</option>
                  {projectMilestones.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>

              {/* Sprint */}
              <div>
                <label className="text-sm font-medium block mb-1.5">Sprint</label>
                <select className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background"
                  value={form.sprintId} onChange={e => setForm({ ...form, sprintId: e.target.value })}>
                  <option value="">None / Backlog</option>
                  {projectSprints.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium block mb-1.5">Description</label>
              <textarea
                className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                rows={3} placeholder="Task description (optional)"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </div>

            {/* Tags + Billable row */}
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium block mb-1.5">Tags (comma-separated)</label>
                <input
                  className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background focus:outline-none"
                  placeholder="design, api, bug"
                  value={form.tags}
                  onChange={e => setForm({ ...form, tags: e.target.value })}
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer pb-2">
                <input type="checkbox" checked={form.billable} onChange={e => setForm({ ...form, billable: e.target.checked })} className="rounded" />
                <span className="text-sm">Billable</span>
              </label>
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-1" disabled={!form.title.trim() || !form.dueDate}>
                <Plus className="w-3.5 h-3.5 mr-1.5" /> Create Task
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Filter Panel ──────────────────────────────────────────
function FilterPanel({
  filter, onChange, onClose, tasks, milestones, sprints, projectsData
}: {
  filter: FilterState;
  onChange: (f: FilterState) => void;
  onClose: () => void;
  tasks: Task[];
  milestones: any[];
  sprints: any[];
  projectsData: any[];
}) {
  const projects = [...new Set(tasks.map(t => t.projectName))];
  const assignees = [...new Set(tasks.map(t => t.assignee))];
  const allTags = [...new Set(tasks.flatMap(t => t.tags || []))];
  const milestoneNames = [...new Set(milestones.map(m => m.name))];
  const sprintNames = [...new Set(sprints.map(s => s.name))];
  const departments = [...new Set(tasks.map(t => t.assigneeDepartment))];
  const approvalOptions = ['Approved', 'Pending Approval', 'Rejected'];

  const toggle = (field: keyof FilterState, value: string) => {
    const arr = filter[field] as string[];
    onChange({
      ...filter,
      [field]: arr.includes(value) ? arr.filter((v: string) => v !== value) : [...arr, value]
    });
  };

  const activeCount = [
    filter.projects.length, filter.statuses.length, filter.priorities.length,
    filter.assignees.length, filter.tags.length, filter.milestones.length,
    filter.sprints.length, filter.departments.length,
    filter.billableOnly, filter.overdueOnly, filter.evidenceMissing, filter.myTasksOnly,
    filter.dateFrom, filter.dateTo, filter.storyPointsMin, filter.storyPointsMax,
    filter.hasAttachments, filter.hasComments,
    (filter.approvalStatus?.length ?? 0) > 0,
  ].filter(Boolean).length;

  return (
    <div className="w-72 bg-card border-l border-border flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="text-sm font-semibold">Filters</span>
          {activeCount > 0 && (
            <span className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">{activeCount}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* AND/OR Logic */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            {(['AND', 'OR'] as const).map(l => (
              <button
                key={l}
                onClick={() => onChange({ ...filter, logic: l })}
                className={`text-xs px-2 py-0.5 rounded transition-colors ${filter.logic === l ? 'bg-card shadow-sm font-medium' : 'text-muted-foreground'}`}
              >
                {l}
              </button>
            ))}
          </div>
          <button onClick={onClose} className="p-1 hover:bg-accent rounded">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {/* Search */}
        <div className="px-4 py-3 border-b border-border">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
            <input
              className="w-full pl-7 pr-3 py-1.5 text-sm border border-border rounded-lg bg-background focus:outline-none"
              placeholder="Search tasks..."
              value={filter.search}
              onChange={e => onChange({ ...filter, search: e.target.value })}
            />
          </div>
        </div>

        {/* Status */}
        <div className="px-4 py-3 border-b border-border">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
            Status
          </label>
          <div className="flex flex-wrap gap-1.5">
            {ALL_STATUSES.map(s => {
              const cfg = STATUS_CONFIG[s];
              const active = filter.statuses.includes(s);
              return (
                <button
                  key={s}
                  onClick={() => toggle('statuses', s)}
                  className={`text-xs px-2 py-1 rounded-full border transition-all ${
                    active ? `${cfg.bg} ${cfg.color} ${cfg.border}` : 'border-border text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Priority */}
        <div className="px-4 py-3 border-b border-border">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
            Priority
          </label>
          <div className="flex flex-wrap gap-1.5">
            {ALL_PRIORITIES.map(p => {
              const cfg = PRIORITY_CONFIG[p];
              const active = filter.priorities.includes(p);
              return (
                <button
                  key={p}
                  onClick={() => toggle('priorities', p)}
                  className={`text-xs px-2 py-1 rounded-full border transition-all ${
                    active ? `${cfg.bg} ${cfg.color} ${cfg.border}` : 'border-border text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects */}
        <div className="px-4 py-3 border-b border-border">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
            Project
          </label>
          <div className="space-y-1">
            {projects.map(p => {
              const project = projectsData.find(pr => pr.name === p);
              return (
                <label key={p} className="flex items-center gap-2 cursor-pointer hover:bg-accent/50 rounded px-1 py-0.5">
                  <input
                    type="checkbox"
                    checked={filter.projects.includes(p)}
                    onChange={() => toggle('projects', p)}
                    className="rounded border-border"
                  />
                  {project && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: project.color }} />}
                  <span className="text-sm">{p}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Assignees */}
        <div className="px-4 py-3 border-b border-border">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
            Assignee
          </label>
          <div className="space-y-1 max-h-32 overflow-auto">
            {assignees.map(a => (
              <label key={a} className="flex items-center gap-2 cursor-pointer hover:bg-accent/50 rounded px-1 py-0.5">
                <input
                  type="checkbox"
                  checked={filter.assignees.includes(a)}
                  onChange={() => toggle('assignees', a)}
                  className="rounded border-border"
                />
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                  {a.charAt(0)}
                </div>
                <span className="text-sm">{a}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div className="px-4 py-3 border-b border-border">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
            Milestone
          </label>
          <div className="space-y-1 max-h-32 overflow-auto">
            {milestoneNames.map(m => (
              <label key={m} className="flex items-center gap-2 cursor-pointer hover:bg-accent/50 rounded px-1 py-0.5">
                <input
                  type="checkbox"
                  checked={filter.milestones.includes(m)}
                  onChange={() => toggle('milestones', m)}
                  className="rounded border-border"
                />
                <Target className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                <span className="text-sm truncate">{m}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sprints */}
        <div className="px-4 py-3 border-b border-border">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
            Sprint
          </label>
          <div className="space-y-1">
            {sprintNames.map(s => (
              <label key={s} className="flex items-center gap-2 cursor-pointer hover:bg-accent/50 rounded px-1 py-0.5">
                <input
                  type="checkbox"
                  checked={filter.sprints.includes(s)}
                  onChange={() => toggle('sprints', s)}
                  className="rounded border-border"
                />
                <Zap className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                <span className="text-sm truncate">{s}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Departments */}
        <div className="px-4 py-3 border-b border-border">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
            Department
          </label>
          <div className="flex flex-wrap gap-1.5">
            {departments.map(d => (
              <button
                key={d}
                onClick={() => toggle('departments', d)}
                className={`text-xs px-2 py-1 rounded-full border transition-all ${
                  filter.departments.includes(d)
                    ? 'bg-primary/10 text-primary border-primary/30'
                    : 'border-border text-muted-foreground hover:border-primary/50'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Due Date Range */}
        <div className="px-4 py-3 border-b border-border">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
            Due Date Range
          </label>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">From</label>
              <input
                type="date"
                className="w-full border border-border rounded-lg px-2 py-1.5 text-xs bg-background focus:outline-none"
                value={filter.dateFrom || ''}
                onChange={e => onChange({ ...filter, dateFrom: e.target.value || undefined })}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">To</label>
              <input
                type="date"
                className="w-full border border-border rounded-lg px-2 py-1.5 text-xs bg-background focus:outline-none"
                value={filter.dateTo || ''}
                onChange={e => onChange({ ...filter, dateTo: e.target.value || undefined })}
              />
            </div>
          </div>
        </div>

        {/* Story Points */}
        <div className="px-4 py-3 border-b border-border">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
            Story Points
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={20}
              placeholder="Min"
              className="w-full border border-border rounded-lg px-2 py-1.5 text-xs bg-background focus:outline-none"
              value={filter.storyPointsMin ?? ''}
              onChange={e => onChange({ ...filter, storyPointsMin: e.target.value ? Number(e.target.value) : undefined })}
            />
            <span className="text-xs text-muted-foreground">–</span>
            <input
              type="number"
              min={0}
              max={20}
              placeholder="Max"
              className="w-full border border-border rounded-lg px-2 py-1.5 text-xs bg-background focus:outline-none"
              value={filter.storyPointsMax ?? ''}
              onChange={e => onChange({ ...filter, storyPointsMax: e.target.value ? Number(e.target.value) : undefined })}
            />
          </div>
        </div>

        {/* Approval Status */}
        <div className="px-4 py-3 border-b border-border">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
            Approval Status
          </label>
          <div className="flex flex-wrap gap-1.5">
            {approvalOptions.map(a => (
              <button
                key={a}
                onClick={() => {
                  const arr = filter.approvalStatus || [];
                  onChange({ ...filter, approvalStatus: arr.includes(a) ? arr.filter(x => x !== a) : [...arr, a] });
                }}
                className={`text-xs px-2 py-1 rounded-full border transition-all ${
                  (filter.approvalStatus || []).includes(a)
                    ? a === 'Approved' ? 'bg-green-100 text-green-700 border-green-300'
                      : a === 'Rejected' ? 'bg-red-100 text-red-700 border-red-300'
                      : 'bg-amber-100 text-amber-700 border-amber-300'
                    : 'border-border text-muted-foreground hover:border-primary/50'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="px-4 py-3 border-b border-border">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-1.5">
            {allTags.slice(0, 15).map(tag => (
              <button
                key={tag}
                onClick={() => toggle('tags', tag)}
                className={`text-xs px-2 py-0.5 rounded-full border transition-all ${
                  filter.tags.includes(tag)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border text-muted-foreground hover:border-primary/50'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Flags (Boolean) */}
        <div className="px-4 py-3 space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
            Quick Filters
          </label>
          {[
            { key: 'billableOnly',    label: 'Billable only',        icon: '💰' },
            { key: 'overdueOnly',     label: 'Overdue only',         icon: '⏰' },
            { key: 'evidenceMissing', label: 'Missing evidence',     icon: '📎' },
            { key: 'myTasksOnly',     label: 'My tasks only',        icon: '👤' },
            { key: 'hasAttachments',  label: 'Has attachments',      icon: '🗂️' },
            { key: 'hasComments',     label: 'Has comments',         icon: '💬' },
          ].map(({ key, label, icon }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer hover:bg-accent/50 rounded px-1 py-1">
              <input
                type="checkbox"
                checked={!!filter[key as keyof FilterState]}
                onChange={() => onChange({ ...filter, [key]: !filter[key as keyof FilterState] })}
                className="rounded border-border"
              />
              <span className="text-sm">{icon} {label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear */}
      <div className="px-4 py-3 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => onChange({
            search: '', projects: [], milestones: [], sprints: [], assignees: [],
            statuses: [], priorities: [], tags: [], billableOnly: false,
            overdueOnly: false, evidenceMissing: false, myTasksOnly: false,
            departments: [], logic: 'AND',
            dateFrom: undefined, dateTo: undefined,
            storyPointsMin: undefined, storyPointsMax: undefined,
            hasAttachments: undefined, hasComments: undefined,
            approvalStatus: [],
          })}
        >
          Clear All Filters
        </Button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
const INITIAL_FILTER: FilterState = {
  search: '', projects: [], milestones: [], sprints: [], assignees: [],
  statuses: [], priorities: [], tags: [], billableOnly: false,
  overdueOnly: false, evidenceMissing: false, myTasksOnly: false,
  departments: [], logic: 'AND',
  dateFrom: undefined, dateTo: undefined,
  storyPointsMin: undefined, storyPointsMax: undefined,
  hasAttachments: undefined, hasComments: undefined,
  approvalStatus: [],
};

export function WorkTasksOS() {
  const {
    tasks,
    projects,
    milestones,
    sprints,
    teamMembers,
    dependencies,
    timeLogs,
    activityFeed,
    createTask,
    updateTask,
    deleteTask,
    changeTaskStatus,
    bulkUpdateTasks,
    addDependency,
    removeDependency,
  } = useExecutionOS();
  
  const [view, setView] = useState<ViewMode>('list');
  const [groupBy, setGroupBy] = useState<GroupBy>('none');
  const [filter, setFilter] = useState<FilterState>(INITIAL_FILTER);
  const [showFilter, setShowFilter] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['all', 'Open', 'In Progress', 'To Be Tested', 'Pending Review', 'Overdue', 'Reopen']));
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());

  // Apply filters (18+ field filter engine)
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const dueMs = new Date(task.dueDate).getTime();
      const checks = [
        // Core text search
        !filter.search || task.title.toLowerCase().includes(filter.search.toLowerCase()) || task.taskId.toLowerCase().includes(filter.search.toLowerCase()),
        // Multi-select filters
        filter.projects.length === 0 || filter.projects.includes(task.projectName),
        filter.milestones.length === 0 || filter.milestones.includes(task.milestoneName || ''),
        filter.sprints.length === 0 || filter.sprints.includes(task.sprintName || ''),
        filter.assignees.length === 0 || filter.assignees.includes(task.assignee),
        filter.departments.length === 0 || filter.departments.includes(task.assigneeDepartment),
        filter.statuses.length === 0 || filter.statuses.includes(task.status),
        filter.priorities.length === 0 || filter.priorities.includes(task.priority),
        filter.tags.length === 0 || filter.tags.some(t => task.tags?.includes(t)),
        // Approval status
        !filter.approvalStatus?.length || filter.approvalStatus.includes(task.approvalStatus || ''),
        // Boolean quick filters
        !filter.billableOnly || task.billable,
        !filter.overdueOnly || (new Date(task.dueDate) < new Date() && task.status !== 'Closed'),
        !filter.evidenceMissing || (!task.hasEvidence && task.billable),
        !filter.myTasksOnly || task.assignee === 'Sarah Chen',
        !filter.hasAttachments || (task.attachments !== undefined && task.attachments > 0),
        !filter.hasComments || (task.comments !== undefined && task.comments > 0),
        // Date range
        !filter.dateFrom || dueMs >= new Date(filter.dateFrom).getTime(),
        !filter.dateTo || dueMs <= new Date(filter.dateTo).getTime(),
        // Story points range
        filter.storyPointsMin === undefined || (task.storyPoints !== undefined && task.storyPoints >= filter.storyPointsMin),
        filter.storyPointsMax === undefined || (task.storyPoints !== undefined && task.storyPoints <= filter.storyPointsMax),
      ];

      return filter.logic === 'AND' ? checks.every(Boolean) : checks.some(Boolean);
    });
  }, [tasks, filter]);

  // Group tasks
  const groupedTasks = useMemo(() => {
    if (groupBy === 'none') return { 'All Tasks': filteredTasks };

    return filteredTasks.reduce((acc, task) => {
      const key =
        groupBy === 'status' ? task.status :
        groupBy === 'priority' ? task.priority :
        groupBy === 'assignee' ? task.assignee :
        groupBy === 'milestone' ? (task.milestoneName || 'No Milestone') :
        groupBy === 'sprint' ? (task.sprintName || 'No Sprint') :
        groupBy === 'tasklist' ? (task.taskListName || 'No Task List') : 'All';

      if (!acc[key]) acc[key] = [];
      acc[key].push(task);
      return acc;
    }, {} as Record<string, Task[]>);
  }, [filteredTasks, groupBy]);

  const handleStatusChange = (id: string, status: TaskStatus) => {
    changeTaskStatus(id, status);
    if (selectedTask?.id === id) {
      const updatedTask = tasks.find(t => t.id === id);
      if (updatedTask) {
        setSelectedTask({ ...updatedTask, status });
      }
    }
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
    if (selectedTask?.id === id) setSelectedTask(null);
  };

  const handleAddTask = (task: Omit<Task, 'id'>) => {
    createTask(task);
    setShowCreateModal(false);
  };

  const toggleTask = (id: string) => {
    setExpandedTasks(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleGroup = (key: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const BOARD_STATUSES: TaskStatus[] = ['Open', 'In Progress', 'To Be Tested', 'Pending Review', 'Closed'];

  const activeFilterCount = [
    filter.projects.length, filter.statuses.length, filter.priorities.length,
    filter.assignees.length, filter.tags.length, filter.milestones.length,
    filter.sprints.length, filter.departments.length,
    filter.billableOnly, filter.overdueOnly, filter.evidenceMissing, filter.myTasksOnly,
    filter.hasAttachments, filter.hasComments,
    filter.dateFrom, filter.dateTo,
    filter.storyPointsMin !== undefined, filter.storyPointsMax !== undefined,
    (filter.approvalStatus?.length ?? 0) > 0,
  ].filter(Boolean).length;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-card flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-primary" />
            Tasks
          </h1>
          <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
            <span>{filteredTasks.length} tasks</span>
            <span>·</span>
            <span className="text-blue-600">{filteredTasks.filter(t => t.status === 'In Progress').length} in progress</span>
            <span>·</span>
            <span className="text-red-500">{filteredTasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'Closed').length} overdue</span>
            <span>·</span>
            <span className="text-green-600">{filteredTasks.filter(t => t.billable).length} billable</span>
            <span>·</span>
            <span>{filteredTasks.reduce((s, t) => s + (t.estimatedHours || 0), 0).toFixed(0)}h estimated</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-3.5 h-3.5 mr-1.5" /> Export
          </Button>
          <Button size="sm" onClick={() => setShowCreateModal(true)}>
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Task
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 px-6 py-2.5 border-b border-border bg-background">
        {/* View switcher */}
        <div className="flex items-center gap-0.5 bg-muted p-1 rounded-lg">
          {([
            { key: 'list',       Icon: List,       label: 'List' },
            { key: 'board',      Icon: LayoutGrid, label: 'Board' },
            { key: 'gantt',      Icon: BarChart3,  label: 'Gantt' },
            { key: 'sprint',     Icon: Kanban,     label: 'Sprint' },
            { key: 'dependency', Icon: GitBranch,  label: 'Dependencies' },
          ] as const).map(({ key, Icon, label }) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs transition-colors ${
                view === key ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        <div className="h-5 w-px bg-border" />

        {/* Group By */}
        <div className="flex items-center gap-1.5 text-sm">
          <span className="text-xs text-muted-foreground">Group:</span>
          <select
            className="text-xs border border-border rounded px-2 py-1 bg-background focus:outline-none"
            value={groupBy}
            onChange={e => setGroupBy(e.target.value as GroupBy)}
          >
            <option value="none">None</option>
            <option value="status">Status</option>
            <option value="priority">Priority</option>
            <option value="assignee">Assignee</option>
            <option value="milestone">Milestone</option>
            <option value="sprint">Sprint</option>
            <option value="tasklist">Task List</option>
          </select>
        </div>

        {/* Filter Button */}
        <button
          onClick={() => { setShowFilter(!showFilter); if (selectedTask) setSelectedTask(null); }}
          className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
            activeFilterCount > 0
              ? 'border-primary text-primary bg-primary/5'
              : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/50'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs w-4 h-4 rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Selected task indicator */}
        {selectedTask && (
          <div className="flex items-center gap-2 ml-2 text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-lg border border-primary/20">
            <span className="font-mono">{selectedTask.taskId}</span>
            <button onClick={() => setSelectedTask(null)}>
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Quick Search */}
        <div className="relative ml-auto">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            className="pl-8 pr-3 py-1.5 text-xs border border-border rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-primary/30 w-48"
            placeholder="Quick search..."
            value={filter.search}
            onChange={e => setFilter({ ...filter, search: e.target.value })}
          />
        </div>
      </div>

      {/* Main Content + Panels */}
      <div className="flex-1 flex overflow-hidden">
        {/* Content */}
        <div className="flex-1 overflow-auto">
          {view === 'list' && (
            <div>
              {/* Column Headers */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 border-b border-border text-xs text-muted-foreground uppercase tracking-wide sticky top-0 z-10">
                <div className="w-6" />
                <div className="w-4" />
                <div className="w-4" />
                <div className="w-16 font-semibold">ID</div>
                <div className="flex-1 font-semibold">Title</div>
                <div className="w-28 text-center font-semibold">Status</div>
                <div className="w-24 text-center font-semibold">Priority</div>
                <div className="w-24 text-center font-semibold">Assignee</div>
                <div className="w-20 text-right font-semibold">Due Date</div>
                <div className="w-12 text-right font-semibold">Est.</div>
                <div className="w-6" />
                <div className="w-14" />
              </div>

              {Object.entries(groupedTasks).map(([groupKey, groupTasks]) => {
                const isExpanded = expandedGroups.has(groupKey);
                const isStatusGroup = ALL_STATUSES.includes(groupKey as TaskStatus);
                const groupCfg = isStatusGroup ? STATUS_CONFIG[groupKey as TaskStatus] : null;

                return (
                  <div key={groupKey}>
                    {groupBy !== 'none' && (
                      <button
                        onClick={() => toggleGroup(groupKey)}
                        className="w-full flex items-center gap-2 px-3 py-2 bg-muted/30 hover:bg-muted/50 border-b border-border transition-colors text-left"
                      >
                        {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
                        {groupCfg && <span className={`w-2 h-2 rounded-full ${groupCfg.dot}`} />}
                        <span className="text-sm font-semibold">{groupKey}</span>
                        <span className="text-xs text-muted-foreground">({groupTasks.length})</span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {groupTasks.reduce((s, t) => s + (t.estimatedHours || 0), 0).toFixed(0)}h est. ·{' '}
                          {groupTasks.filter(t => t.billable).length} billable
                        </span>
                      </button>
                    )}
                    {isExpanded && groupTasks.map(task => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDelete}
                        expanded={expandedTasks.has(task.id)}
                        onToggleExpand={toggleTask}
                        onSelect={t => { setSelectedTask(t); setShowFilter(false); }}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          {view === 'board' && (
            <DndProvider backend={HTML5Backend}>
              <div className="flex gap-4 p-6 overflow-x-auto h-full items-start">
                {BOARD_STATUSES.map(status => (
                  <BoardColumn
                    key={status}
                    status={status}
                    tasks={filteredTasks.filter(t => t.status === status)}
                    onStatusChange={handleStatusChange}
                    onSelect={t => { setSelectedTask(t); setShowFilter(false); }}
                  />
                ))}
              </div>
            </DndProvider>
          )}

          {view === 'gantt' && (
            <div className="p-4">
              <GanttView tasks={filteredTasks.filter(t => t.status !== 'Closed')} />
            </div>
          )}

          {view === 'sprint' && (
            <DndProvider backend={HTML5Backend}>
              <SprintBoardView
                tasks={filteredTasks}
                onStatusChange={handleStatusChange}
                onSelect={t => { setSelectedTask(t); setShowFilter(false); }}
              />
            </DndProvider>
          )}

          {view === 'dependency' && (
            <DependencyView
              tasks={tasks}
              dependencies={mockDependencies}
              onSelect={t => { setSelectedTask(t); setShowFilter(false); }}
            />
          )}
        </div>

        {/* Filter Sidebar */}
        {showFilter && (
          <FilterPanel
            filter={filter}
            onChange={setFilter}
            onClose={() => setShowFilter(false)}
            tasks={tasks}
            milestones={milestones}
            sprints={sprints}
            projectsData={projects}
          />
        )}

        {/* Task Detail Panel */}
        {selectedTask && !showFilter && (
          <TaskDetailPanel
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onStatusChange={handleStatusChange}
            timeLogs={timeLogs}
            activityFeed={activityFeed}
          />
        )}
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          onAdd={handleAddTask}
          projects={projects}
          milestones={milestones}
          sprints={sprints}
          teamMembers={teamMembers}
        />
      )}
    </div>
  );
}
