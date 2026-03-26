import React, { useState } from 'react';
import { Button } from '../../ui/button';
import {
  CheckSquare, Edit, Trash2, X, Eye, Clock, MessageSquare, Paperclip,
  Plus, Check, AlertTriangle
} from 'lucide-react';
import { useExecutionOS } from '../../../contexts/ExecutionOSContext';
import type { Task, TaskStatus, Priority } from './workTypes';

// ── Task Detail Panel ─────────────────────────────────────
export function TaskDetailPanel({ task, onClose }: { task: Task; onClose: () => void }) {
  const { updateTask, deleteTask, tasks, projects } = useExecutionOS();
  const [activeTab, setActiveTab] = useState<'overview' | 'subtasks' | 'timelogs' | 'comments'>('overview');
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [description, setDescription] = useState(task.description || '');

  // Get latest task data from context
  const currentTask = tasks.find(t => t.id === task.id) || task;
  const project = projects.find(p => p.id === currentTask.projectId);

  const STATUS_OPTIONS: TaskStatus[] = ['Open', 'In Progress', 'To Be Tested', 'Ready for Deploy', 'Testing', 'Blocked', 'Overdue', 'Closed', 'Cancelled', 'Deferred'];

  const handleStatusChange = (newStatus: TaskStatus) => {
    updateTask(currentTask.id, { status: newStatus });
  };

  const statusColor: Record<TaskStatus, string> = {
    'Open': 'bg-gray-100 text-gray-700',
    'In Progress': 'bg-blue-100 text-blue-700',
    'To Be Tested': 'bg-purple-100 text-purple-700',
    'Ready for Deploy': 'bg-cyan-100 text-cyan-700',
    'Testing': 'bg-indigo-100 text-indigo-700',
    'Blocked': 'bg-red-100 text-red-700',
    'Overdue': 'bg-red-100 text-red-700',
    'Closed': 'bg-green-100 text-green-700',
    'Cancelled': 'bg-gray-100 text-gray-500',
    'Deferred': 'bg-yellow-100 text-yellow-700',
  };

  const priorityColor: Record<Priority, string> = {
    'Critical': 'bg-red-100 text-red-700 border-red-300',
    'High': 'bg-orange-100 text-orange-700 border-orange-300',
    'Medium': 'bg-blue-100 text-blue-700 border-blue-300',
    'Low': 'bg-gray-100 text-gray-600 border-gray-300',
  };

  const TABS = [
    { key: 'overview' as const, label: 'Overview', icon: Eye },
    { key: 'subtasks' as const, label: `Subtasks (${currentTask.subtasks?.length || 0})`, icon: CheckSquare },
    { key: 'timelogs' as const, label: `Time Logs (${currentTask.timeLogs?.length || 0})`, icon: Clock },
    { key: 'comments' as const, label: `Comments (${currentTask.comments || 0})`, icon: MessageSquare },
  ];

  const isOverdue = new Date(currentTask.dueDate) < new Date() && currentTask.status !== 'Closed';

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-[62vw] bg-background border-l border-border flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-card flex-shrink-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3 flex-1">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${project?.color || '#3b82f6'}20` }}
              >
                <CheckSquare className="w-5 h-5" style={{ color: project?.color || '#3b82f6' }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-mono text-muted-foreground">{currentTask.taskId}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${priorityColor[currentTask.priority]}`}>
                    {currentTask.priority}
                  </span>
                  {currentTask.billable && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-300">
                      Billable
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-semibold mb-1">{currentTask.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {currentTask.projectName} {currentTask.milestoneName && `· ${currentTask.milestoneName}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <select
                className={`text-sm px-3 py-1.5 rounded-lg border font-medium ${statusColor[currentTask.status]}`}
                value={currentTask.status}
                onChange={e => handleStatusChange(e.target.value as TaskStatus)}
              >
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <Button variant="outline" size="sm" onClick={() => setShowEditDrawer(true)}>
                <Edit className="w-3.5 h-3.5 mr-1.5" /> Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-600 hover:text-red-700 hover:border-red-300"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
              </Button>
              <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-5 gap-3">
            {[
              { label: 'Assignee', value: currentTask.assignee, sub: currentTask.assigneeDepartment, alert: false },
              {
                label: 'Due Date',
                value: new Date(currentTask.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                sub: isOverdue ? 'Overdue!' : 'On track',
                alert: isOverdue,
              },
              { label: 'Estimate', value: currentTask.estimate, sub: `Actual: ${currentTask.actualTime}`, alert: false },
              {
                label: 'Progress',
                value: `${currentTask.progress || 0}%`,
                sub: currentTask.status,
                alert: false,
              },
              {
                label: 'Attachments',
                value: currentTask.attachments || 0,
                sub: `${currentTask.evidenceCount} evidence`,
                alert: false,
              },
            ].map((k, i) => (
              <div key={i} className={`rounded-lg px-3 py-2 ${k.alert ? 'bg-red-50 border border-red-200' : 'bg-muted/40'}`}>
                <p className="text-xs text-muted-foreground">{k.label}</p>
                <p className={`font-semibold text-sm ${k.alert ? 'text-red-600' : ''}`}>{k.value}</p>
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
                {/* Task Details */}
                <div className="bg-card border border-border rounded-xl p-5">
                  <h3 className="text-sm font-semibold mb-4">Task Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Project:</span>
                      <span className="font-medium">{currentTask.projectName}</span>
                    </div>
                    {currentTask.milestoneName && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Milestone:</span>
                        <span className="font-medium">{currentTask.milestoneName}</span>
                      </div>
                    )}
                    {currentTask.sprintName && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sprint:</span>
                        <span className="font-medium">{currentTask.sprintName}</span>
                      </div>
                    )}
                    {currentTask.taskListName && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Task List:</span>
                        <span className="font-medium">{currentTask.taskListName}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created:</span>
                      <span className="font-medium">{currentTask.startDate ? new Date(currentTask.startDate).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    {currentTask.completedDate && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Completed:</span>
                        <span className="font-medium">{new Date(currentTask.completedDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    {currentTask.tags && currentTask.tags.length > 0 && (
                      <div>
                        <span className="text-muted-foreground block mb-2">Tags:</span>
                        <div className="flex flex-wrap gap-1">
                          {currentTask.tags.map((tag, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Team & Collaboration */}
                <div className="bg-card border border-border rounded-xl p-5">
                  <h3 className="text-sm font-semibold mb-4">Team & Collaboration</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Assignee</p>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                          {currentTask.assignee.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{currentTask.assignee}</p>
                          <p className="text-xs text-muted-foreground">{currentTask.assigneeDepartment}</p>
                        </div>
                      </div>
                    </div>
                    {currentTask.collaborators && currentTask.collaborators.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">Collaborators ({currentTask.collaborators.length})</p>
                        <div className="flex flex-wrap gap-2">
                          {currentTask.collaborators.map((collab, i) => (
                            <div key={i} className="flex items-center gap-2 px-2 py-1 bg-muted/40 rounded-lg">
                              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                                {collab.charAt(0)}
                              </div>
                              <span className="text-xs">{collab}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {currentTask.watchers && currentTask.watchers.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">Watchers ({currentTask.watchers.length})</p>
                        <div className="flex -space-x-2">
                          {currentTask.watchers.slice(0, 5).map((watcher, i) => (
                            <div
                              key={i}
                              className="w-7 h-7 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium"
                              title={watcher}
                            >
                              {watcher.charAt(0)}
                            </div>
                          ))}
                          {currentTask.watchers.length > 5 && (
                            <div className="w-7 h-7 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                              +{currentTask.watchers.length - 5}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="text-sm font-semibold mb-3">Description</h3>
                <textarea
                  className="w-full h-32 border border-border rounded-lg px-3 py-2 text-sm bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Add task description..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
                <div className="flex items-center gap-2 mt-2">
                  <Button size="sm" onClick={() => updateTask(currentTask.id, { description })}>
                    Save Description
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setDescription(task.description || '')}>
                    Discard
                  </Button>
                </div>
              </div>

              {/* Notes */}
              {currentTask.notes && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-xs font-semibold text-amber-700 mb-2">Notes</p>
                  <p className="text-sm text-amber-900">{currentTask.notes}</p>
                </div>
              )}

              {/* Financial Impact */}
              {(currentTask.burnAmount || currentTask.profitImpact || currentTask.costImpact) && (
                <div className="bg-card border border-border rounded-xl p-5">
                  <h3 className="text-sm font-semibold mb-4">Financial Impact</h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    {currentTask.burnAmount && (
                      <div>
                        <p className="text-muted-foreground mb-1">Burn Amount</p>
                        <p className="font-semibold">${currentTask.burnAmount.toLocaleString()}</p>
                      </div>
                    )}
                    {currentTask.profitImpact && (
                      <div>
                        <p className="text-muted-foreground mb-1">Profit Impact</p>
                        <p className="font-semibold text-green-600">${currentTask.profitImpact.toLocaleString()}</p>
                      </div>
                    )}
                    {currentTask.costImpact && (
                      <div>
                        <p className="text-muted-foreground mb-1">Cost Impact</p>
                        <p className="font-semibold text-red-600">${currentTask.costImpact.toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Subtasks ────────────────────────────────────── */}
          {activeTab === 'subtasks' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Subtasks</h3>
                <Button size="sm" variant="outline">
                  <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Subtask
                </Button>
              </div>
              {!currentTask.subtasks || currentTask.subtasks.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <CheckSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No subtasks yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {currentTask.subtasks.map(subtask => (
                    <div key={subtask.id} className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg">
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 cursor-pointer ${
                          subtask.completed ? 'bg-green-500 border-green-500' : 'border-border hover:border-primary'
                        }`}
                      >
                        {subtask.completed && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {subtask.title}
                        </p>
                        {subtask.assignee && (
                          <p className="text-xs text-muted-foreground mt-0.5">{subtask.assignee}</p>
                        )}
                      </div>
                      {subtask.dueDate && (
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {new Date(subtask.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${priorityColor[subtask.priority]}`}>
                        {subtask.priority}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Time Logs ────────────────────────────────────── */}
          {activeTab === 'timelogs' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Time Logs</h3>
                <Button size="sm" variant="outline">
                  <Plus className="w-3.5 h-3.5 mr-1.5" /> Log Time
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-muted/40 rounded-lg px-4 py-3 text-center">
                  <p className="font-semibold">{currentTask.actualTime}</p>
                  <p className="text-xs text-muted-foreground">Total Logged</p>
                </div>
                <div className="bg-muted/40 rounded-lg px-4 py-3 text-center">
                  <p className="font-semibold">{currentTask.estimate}</p>
                  <p className="text-xs text-muted-foreground">Estimated</p>
                </div>
                <div className="bg-muted/40 rounded-lg px-4 py-3 text-center">
                  <p className={`font-semibold ${parseFloat(currentTask.actualTime) > parseFloat(currentTask.estimate) ? 'text-red-600' : 'text-green-600'}`}>
                    {parseFloat(currentTask.actualTime) <= parseFloat(currentTask.estimate) ? 'On Track' : 'Over Budget'}
                  </p>
                  <p className="text-xs text-muted-foreground">Status</p>
                </div>
              </div>
              {!currentTask.timeLogs || currentTask.timeLogs.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No time logs yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {currentTask.timeLogs.map(log => (
                    <div key={log.id} className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium flex-shrink-0">
                        {log.userName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{log.userName}</p>
                        <p className="text-xs text-muted-foreground">{log.description}</p>
                      </div>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="text-sm font-mono font-semibold flex-shrink-0">{log.hours}h</span>
                      {log.billable && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 flex-shrink-0">
                          Billable
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Comments ────────────────────────────────────── */}
          {activeTab === 'comments' && (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium flex-shrink-0">
                  U
                </div>
                <div className="flex-1">
                  <textarea
                    className="w-full h-20 border border-border rounded-lg px-3 py-2 text-sm bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Add a comment..."
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <Button size="sm">
                      <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> Comment
                    </Button>
                    <Button size="sm" variant="outline">
                      <Paperclip className="w-3.5 h-3.5 mr-1.5" /> Attach
                    </Button>
                  </div>
                </div>
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-sm text-muted-foreground text-center">No comments yet</p>
              </div>
            </div>
          )}
        </div>

        {/* Edit Drawer */}
        {showEditDrawer && (
          <EditTaskDrawer task={currentTask} onClose={() => setShowEditDrawer(false)} />
        )}

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <DeleteTaskConfirm
            task={currentTask}
            onConfirm={() => {
              deleteTask(currentTask.id);
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

// ── Edit Task Drawer ──────────────────────────────────────
export function EditTaskDrawer({ task, onClose }: { task: Task; onClose: () => void }) {
  const { updateTask, projects, milestones } = useExecutionOS();
  const [form, setForm] = useState({
    title: task.title,
    projectId: task.projectId,
    milestoneId: task.milestoneId || '',
    assignee: task.assignee,
    priority: task.priority,
    status: task.status,
    dueDate: task.dueDate,
    estimate: task.estimate,
    billable: task.billable,
    description: task.description || '',
    notes: task.notes || '',
  });

  const projectMilestones = milestones.filter(m => m.projectId === form.projectId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const project = projects.find(p => p.id === form.projectId);
    const milestone = milestones.find(m => m.id === form.milestoneId);
    updateTask(task.id, {
      ...form,
      projectName: project?.name || task.projectName,
      milestoneName: milestone?.name,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-[480px] bg-background border-l border-border flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semibold flex items-center gap-2">
            <Edit className="w-4 h-4 text-primary" /> Edit Task
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-accent rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-6 space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">Task Title *</label>
            <input
              required
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Project *</label>
            <select
              required
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
              value={form.projectId}
              onChange={e => setForm({ ...form, projectId: e.target.value, milestoneId: '' })}
            >
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Milestone</label>
            <select
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
              value={form.milestoneId}
              onChange={e => setForm({ ...form, milestoneId: e.target.value })}
            >
              <option value="">No Milestone</option>
              {projectMilestones.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium block mb-1.5">Priority</label>
              <select
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
                value={form.priority}
                onChange={e => setForm({ ...form, priority: e.target.value as Priority })}
              >
                {['Critical', 'High', 'Medium', 'Low'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Status</label>
              <select
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value as TaskStatus })}
              >
                {['Open', 'In Progress', 'To Be Tested', 'Testing', 'Blocked', 'Closed', 'Cancelled'].map(s => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Assignee</label>
            <input
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
              value={form.assignee}
              onChange={e => setForm({ ...form, assignee: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium block mb-1.5">Due Date *</label>
              <input
                type="date"
                required
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
                value={form.dueDate}
                onChange={e => setForm({ ...form, dueDate: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Estimate</label>
              <input
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
                placeholder="e.g. 8h"
                value={form.estimate}
                onChange={e => setForm({ ...form, estimate: e.target.value })}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="billable"
              checked={form.billable}
              onChange={e => setForm({ ...form, billable: e.target.checked })}
              className="w-4 h-4 rounded border-border"
            />
            <label htmlFor="billable" className="text-sm font-medium">
              Billable
            </label>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Description</label>
            <textarea
              className="w-full h-24 border border-border rounded-lg px-3 py-2 text-sm bg-background resize-none"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Task description..."
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Notes</label>
            <textarea
              className="w-full h-20 border border-border rounded-lg px-3 py-2 text-sm bg-background resize-none"
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              placeholder="Internal notes..."
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1">
              Update Task
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Delete Task Confirmation ──────────────────────────────
export function DeleteTaskConfirm({
  task,
  onConfirm,
  onCancel,
}: {
  task: Task;
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
            <h3 className="font-semibold mb-1">Delete Task</h3>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete{' '}
              <span className="font-medium text-foreground">
                {task.taskId} - {task.title}
              </span>
              ? This action cannot be undone. All subtasks, time logs, and comments will also be deleted.
            </p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onConfirm} className="bg-red-600 hover:bg-red-700 text-white">
            Delete Task
          </Button>
        </div>
      </div>
    </div>
  );
}