import { useState, useMemo } from 'react';
import { Button } from '../../ui/button';
import {
  Calendar, ChevronLeft, ChevronRight, List,
  Target, CheckSquare, Clock, Zap, Plus,
  LayoutGrid, AlertTriangle, Tag, X, ExternalLink
} from 'lucide-react';
import { useExecutionOS } from '../../../contexts/ExecutionOSContext';
import { STATUS_CONFIG } from './workTypes';
import type { Task } from './workTypes';

type CalendarView = 'month' | 'week' | 'day' | 'agenda';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  type: 'task' | 'milestone' | 'sprint';
  color: string;
  status?: string;
  assignee?: string;
}

function buildEvents(tasks: Task[], milestones: any[], sprints: any[]): CalendarEvent[] {
  const events: CalendarEvent[] = [];

  tasks.forEach(t => {
    if (t.status !== 'Closed') {
      events.push({
        id: t.id, title: t.title, date: t.dueDate,
        type: 'task', color: t.projectColor || '#3b82f6',
        status: t.status, assignee: t.assignee,
      });
    }
  });

  milestones.forEach(m => {
    events.push({
      id: m.id, title: m.name, date: m.endDate,
      type: 'milestone', color: '#f59e0b',
      status: m.status,
    });
  });

  sprints.filter(s => s.status === 'Active' || s.status === 'Planning').forEach(s => {
    events.push({
      id: s.id, title: s.name, date: s.startDate, endDate: s.endDate,
      type: 'sprint', color: '#6366f1',
      status: s.status,
    });
  });

  return events;
}

// ── Day Cell ──────────────────────────────────────────────
function DayCell({ date, events, isToday, isCurrentMonth }: {
  date: Date;
  events: CalendarEvent[];
  isToday: boolean;
  isCurrentMonth: boolean;
}) {
  const [showAll, setShowAll] = useState(false);
  const maxShow = 3;
  const shown = showAll ? events : events.slice(0, maxShow);
  const extra = events.length - maxShow;

  return (
    <div className={`min-h-[100px] p-1.5 border-r border-b border-border ${isCurrentMonth ? 'bg-card' : 'bg-muted/20'}`}>
      <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs mb-1 ${
        isToday ? 'bg-primary text-primary-foreground font-bold' : isCurrentMonth ? '' : 'text-muted-foreground/50'
      }`}>
        {date.getDate()}
      </div>

      <div className="space-y-0.5">
        {shown.map(event => (
          <div
            key={event.id}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs cursor-pointer hover:opacity-80 truncate"
            style={{ backgroundColor: `${event.color}20`, borderLeft: `2px solid ${event.color}` }}
            title={event.title}
          >
            {event.type === 'milestone' && <Target className="w-2.5 h-2.5 flex-shrink-0" style={{ color: event.color }} />}
            {event.type === 'sprint' && <Zap className="w-2.5 h-2.5 flex-shrink-0" style={{ color: event.color }} />}
            {event.type === 'task' && <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: event.color }} />}
            <span className="truncate" style={{ color: event.color }}>{event.title}</span>
          </div>
        ))}
        {!showAll && extra > 0 && (
          <button
            onClick={() => setShowAll(true)}
            className="text-xs text-muted-foreground hover:text-foreground px-1"
          >
            +{extra} more
          </button>
        )}
      </div>
    </div>
  );
}

// Assign deterministic hour slots to events so they spread across the day
function getEventHour(event: CalendarEvent): number {
  if (event.type === 'sprint') return 9;
  if (event.type === 'milestone') return 17;
  // Spread tasks across hours 9-16 based on a hash of their id
  const hash = event.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return 9 + (hash % 8);
}

// ── Week View ─────────────────────────────────────────────
function WeekView({ weekStart, events }: { weekStart: Date; events: CalendarEvent[] }) {
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    days.push(d);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const hours = Array.from({ length: 11 }, (_, i) => i + 8); // 8am to 6pm

  const eventsForDayHour = (day: Date, hour: number) => {
    const dateStr = day.toISOString().split('T')[0];
    return events.filter(e => {
      const onThisDay = e.date === dateStr || e.endDate === dateStr;
      return onThisDay && getEventHour(e) === hour;
    });
  };

  const eventsForDay = (day: Date) => {
    const dateStr = day.toISOString().split('T')[0];
    return events.filter(e => e.date === dateStr || e.endDate === dateStr);
  };

  return (
    <div className="overflow-auto h-full">
      {/* Day headers */}
      <div className="grid grid-cols-8 border-b border-border sticky top-0 bg-card z-10">
        <div className="border-r border-border p-2 w-16" />
        {days.map((day, i) => {
          const isToday = day.getTime() === today.getTime();
          const dayEventCount = eventsForDay(day).length;
          return (
            <div key={i} className={`border-r border-border p-2 text-center ${isToday ? 'bg-primary/5' : ''}`}>
              <p className="text-xs text-muted-foreground">
                {day.toLocaleDateString('en-US', { weekday: 'short' })}
              </p>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto mt-0.5 ${isToday ? 'bg-primary text-primary-foreground' : ''}`}>
                <p className={`text-sm font-medium ${isToday ? '' : ''}`}>
                  {day.getDate()}
                </p>
              </div>
              {dayEventCount > 0 && (
                <div className="flex justify-center gap-0.5 mt-1">
                  {eventsForDay(day).slice(0, 4).map((e, j) => (
                    <div key={j} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: e.color }} />
                  ))}
                  {dayEventCount > 4 && <span className="text-xs text-muted-foreground">+{dayEventCount - 4}</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Time grid */}
      <div>
        {hours.map(hour => (
          <div key={hour} className="grid grid-cols-8 border-b border-border/30" style={{ minHeight: 56 }}>
            <div className="border-r border-border px-2 py-1 text-xs text-muted-foreground text-right w-16 pt-1.5">
              {hour < 12 ? `${hour}am` : hour === 12 ? '12pm' : `${hour - 12}pm`}
            </div>
            {days.map((day, i) => {
              const isToday = day.getTime() === today.getTime();
              const slotEvents = eventsForDayHour(day, hour);
              return (
                <div key={i} className={`border-r border-border/30 p-1 relative ${isToday ? 'bg-primary/[0.03]' : ''}`}>
                  {/* Half-hour tick */}
                  <div className="absolute left-0 right-0 top-1/2 border-t border-border/20" />
                  {slotEvents.map(event => (
                    <div
                      key={event.id}
                      className="rounded px-1.5 py-1 text-xs mb-0.5 truncate cursor-pointer hover:opacity-90 transition-opacity"
                      style={{
                        backgroundColor: `${event.color}18`,
                        borderLeft: `3px solid ${event.color}`,
                      }}
                      title={event.title}
                    >
                      <div className="flex items-center gap-1">
                        {event.type === 'milestone' && <span className="text-amber-500">◆</span>}
                        {event.type === 'sprint' && <span style={{ color: event.color }}>⚡</span>}
                        <span className="truncate" style={{ color: event.color }}>{event.title}</span>
                      </div>
                      {event.assignee && (
                        <p className="text-xs opacity-70 truncate">{event.assignee.split(' ')[0]}</p>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Day View ──────────────────────────────────────────────
function DayView({ date, events }: { date: Date; events: CalendarEvent[] }) {
  const dateStr = date.toISOString().split('T')[0];
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const isToday = date.getTime() === today.getTime();

  const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 7am–8pm

  const dayEvents = events.filter(e => e.date === dateStr || e.endDate === dateStr);
  const allDay = dayEvents.filter(e => e.type === 'sprint');
  const timed = dayEvents.filter(e => e.type !== 'sprint');

  const getHourEvents = (hour: number) =>
    timed.filter(e => getEventHour(e) === hour);

  // Group by hour: count events per hour for density indicator
  const eventsByHour = HOURS.reduce((acc, h) => {
    acc[h] = getHourEvents(h);
    return acc;
  }, {} as Record<number, CalendarEvent[]>);

  const totalTasks = timed.filter(e => e.type === 'task').length;
  const totalMilestones = timed.filter(e => e.type === 'milestone').length;

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Day Header */}
      <div className={`px-6 py-3 border-b border-border flex items-center justify-between ${isToday ? 'bg-primary/5' : ''}`}>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            {date.toLocaleDateString('en-US', { weekday: 'long' })}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isToday ? 'bg-primary text-primary-foreground' : ''}`}>
              <span className="font-bold">{date.getDate()}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {totalTasks > 0 && (
            <span className="flex items-center gap-1">
              <CheckSquare className="w-3.5 h-3.5 text-blue-500" /> {totalTasks} task{totalTasks !== 1 ? 's' : ''}
            </span>
          )}
          {totalMilestones > 0 && (
            <span className="flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-amber-500" /> {totalMilestones} milestone{totalMilestones !== 1 ? 's' : ''}
            </span>
          )}
          {totalTasks === 0 && totalMilestones === 0 && (
            <span className="text-muted-foreground/60">No events today</span>
          )}
        </div>
      </div>

      {/* All-day / Sprint events */}
      {allDay.length > 0 && (
        <div className="px-4 py-2 border-b border-border bg-muted/20">
          <p className="text-xs text-muted-foreground mb-1.5">All-day</p>
          <div className="flex flex-wrap gap-2">
            {allDay.map(e => (
              <div
                key={e.id}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: e.color }}
              >
                <Zap className="w-3 h-3" />
                {e.title}
                {e.endDate && (
                  <span className="text-xs opacity-75 ml-1">
                    {e.date} → {e.endDate}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hour grid */}
      <div className="flex-1">
        {HOURS.map(hour => {
          const slotEvents = eventsByHour[hour] || [];
          const isCurrentHour = isToday && new Date().getHours() === hour;
          return (
            <div
              key={hour}
              className={`flex border-b border-border/40 min-h-[64px] ${isCurrentHour ? 'bg-primary/[0.03]' : ''}`}
            >
              {/* Time column */}
              <div className="w-16 flex-shrink-0 px-3 pt-2 text-xs text-muted-foreground text-right border-r border-border/50">
                <span className={isCurrentHour ? 'text-primary font-medium' : ''}>
                  {hour < 12 ? `${hour}am` : hour === 12 ? '12pm' : `${hour - 12}pm`}
                </span>
              </div>

              {/* Events column */}
              <div className="flex-1 px-3 py-1 relative">
                {isCurrentHour && (
                  <div className="absolute left-0 right-0 top-0 h-0.5 bg-primary/40" />
                )}
                {slotEvents.length === 0 ? (
                  <div className="h-full w-full" />
                ) : (
                  <div className="space-y-1">
                    {slotEvents.map(event => {
                      const isOverdue = event.type === 'task' && new Date(event.date) < today && event.status !== 'Closed';
                      const statusCfg = event.status ? STATUS_CONFIG[event.status as Task['status']] : null;
                      return (
                        <div
                          key={event.id}
                          className="flex items-start gap-2.5 rounded-xl px-3 py-2.5 cursor-pointer hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: `${event.color}18`, borderLeft: `3px solid ${event.color}` }}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              {event.type === 'milestone' && <Target className="w-3.5 h-3.5 flex-shrink-0" style={{ color: event.color }} />}
                              {event.type === 'task' && (
                                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: event.color }} />
                              )}
                              <span className="text-xs font-medium truncate" style={{ color: event.color }}>
                                {event.title}
                              </span>
                              {isOverdue && (
                                <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full flex-shrink-0">Overdue</span>
                              )}
                              {statusCfg && event.type === 'task' && (
                                <span className={`text-xs px-1.5 py-0.5 rounded flex-shrink-0 ${statusCfg.bg} ${statusCfg.color}`}>
                                  {statusCfg.label}
                                </span>
                              )}
                            </div>
                            {event.assignee && (
                              <p className="text-xs text-muted-foreground mt-0.5">{event.assignee}</p>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground flex-shrink-0 capitalize">{event.type}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Upcoming Panel ────────────────────────────────────────
function UpcomingPanel({ events }: { events: CalendarEvent[] }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = events
    .filter(e => {
      const d = new Date(e.date);
      return d >= today && d <= new Date(today.getTime() + 14 * 86400000);
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 15);

  const grouped: Record<string, CalendarEvent[]> = {};
  upcoming.forEach(e => {
    const key = e.date;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(e);
  });

  return (
    <div className="w-64 border-l border-border flex flex-col">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold">Upcoming (14 days)</h3>
      </div>
      <div className="flex-1 overflow-auto">
        {Object.entries(grouped).length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">Nothing upcoming</p>
        ) : (
          Object.entries(grouped).map(([dateStr, dayEvents]) => {
            const date = new Date(dateStr);
            const isToday = date.getTime() === today.getTime();
            const isTomorrow = date.getTime() === today.getTime() + 86400000;
            const daysAway = Math.ceil((date.getTime() - today.getTime()) / 86400000);

            return (
              <div key={dateStr} className="px-4 py-3 border-b border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold">
                    {isToday ? 'Today' : isTomorrow ? 'Tomorrow' : date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
                  {isToday && <span className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">Today</span>}
                  {!isToday && <span className="text-xs text-muted-foreground">in {daysAway}d</span>}
                </div>
                <div className="space-y-1">
                  {dayEvents.map(event => (
                    <div key={event.id} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: event.color }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs truncate">{event.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">{event.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ── Event Detail Modal ────────────────────────────────────
function EventDetailModal({ event, onClose, tasks, milestones }: { event: CalendarEvent; onClose: () => void; tasks: any[]; milestones: any[] }) {
  const task = event.type === 'task' ? tasks.find(t => t.id === event.id) : null;
  const milestone = event.type === 'milestone' ? milestones.find(m => m.id === event.id) : null;
  const sprint = null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/40" onClick={onClose}>
      <div
        className="bg-card border border-border rounded-2xl shadow-2xl w-[480px] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header strip */}
        <div className="h-2" style={{ backgroundColor: event.color }} />
        <div className="px-5 py-4 border-b border-border">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              {event.type === 'milestone' && <Target className="w-5 h-5 flex-shrink-0" style={{ color: event.color }} />}
              {event.type === 'sprint' && <Zap className="w-5 h-5 flex-shrink-0" style={{ color: event.color }} />}
              {event.type === 'task' && <CheckSquare className="w-5 h-5 flex-shrink-0" style={{ color: event.color }} />}
              <div>
                <h3 className="font-semibold">{event.title}</h3>
                <p className="text-xs text-muted-foreground capitalize">{event.type}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-accent rounded-lg ml-2 flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-3">
          {/* Task details */}
          {task && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/40 rounded-lg p-2.5">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="text-sm font-medium mt-0.5">{task.status}</p>
                </div>
                <div className="bg-muted/40 rounded-lg p-2.5">
                  <p className="text-xs text-muted-foreground">Priority</p>
                  <p className="text-sm font-medium mt-0.5">{task.priority}</p>
                </div>
                <div className="bg-muted/40 rounded-lg p-2.5">
                  <p className="text-xs text-muted-foreground">Assignee</p>
                  <p className="text-sm font-medium mt-0.5">{task.assignee}</p>
                </div>
                <div className="bg-muted/40 rounded-lg p-2.5">
                  <p className="text-xs text-muted-foreground">Estimate</p>
                  <p className="text-sm font-medium mt-0.5">{task.estimate}</p>
                </div>
              </div>
              <div className="bg-muted/40 rounded-lg p-2.5">
                <p className="text-xs text-muted-foreground">Project</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: task.projectColor }} />
                  <p className="text-sm font-medium">{task.projectName}</p>
                </div>
              </div>
              {task.description && (
                <div className="bg-muted/40 rounded-lg p-2.5">
                  <p className="text-xs text-muted-foreground mb-1">Description</p>
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                </div>
              )}
              {task.subtasks && task.subtasks.length > 0 && (
                <div className="bg-muted/40 rounded-lg p-2.5">
                  <p className="text-xs text-muted-foreground mb-2">Sub-tasks ({task.subtasks.filter(s => s.completed).length}/{task.subtasks.length})</p>
                  <div className="space-y-1">
                    {task.subtasks.map(st => (
                      <div key={st.id} className="flex items-center gap-2 text-xs">
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${st.completed ? 'bg-green-500 border-green-500' : 'border-border'}`}>
                          {st.completed && <span className="text-white text-xs">✓</span>}
                        </div>
                        <span className={st.completed ? 'line-through text-muted-foreground' : ''}>{st.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Milestone details */}
          {milestone && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/40 rounded-lg p-2.5">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="text-sm font-medium mt-0.5">{milestone.status}</p>
                </div>
                <div className="bg-muted/40 rounded-lg p-2.5">
                  <p className="text-xs text-muted-foreground">Progress</p>
                  <p className="text-sm font-medium mt-0.5">{milestone.progress}%</p>
                </div>
                <div className="bg-muted/40 rounded-lg p-2.5">
                  <p className="text-xs text-muted-foreground">Owner</p>
                  <p className="text-sm font-medium mt-0.5">{milestone.owner}</p>
                </div>
                <div className="bg-muted/40 rounded-lg p-2.5">
                  <p className="text-xs text-muted-foreground">Tasks</p>
                  <p className="text-sm font-medium mt-0.5">{milestone.completedTasks}/{milestone.taskCount}</p>
                </div>
              </div>
              <div className="bg-muted/40 rounded-lg p-2.5">
                <p className="text-xs text-muted-foreground mb-1">Project</p>
                <p className="text-sm font-medium">{milestone.projectName}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${milestone.progress}%`, backgroundColor: event.color }} />
                </div>
                <span className="text-xs font-medium">{milestone.progress}%</span>
              </div>
            </>
          )}

          {/* Sprint details */}
          {sprint && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/40 rounded-lg p-2.5">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="text-sm font-medium mt-0.5">{sprint.status}</p>
                </div>
                <div className="bg-muted/40 rounded-lg p-2.5">
                  <p className="text-xs text-muted-foreground">Velocity</p>
                  <p className="text-sm font-medium mt-0.5">{sprint.completedPoints}/{sprint.storyPoints} pts</p>
                </div>
                <div className="bg-muted/40 rounded-lg p-2.5">
                  <p className="text-xs text-muted-foreground">Start</p>
                  <p className="text-sm font-medium mt-0.5">{new Date(sprint.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                </div>
                <div className="bg-muted/40 rounded-lg p-2.5">
                  <p className="text-xs text-muted-foreground">End</p>
                  <p className="text-sm font-medium mt-0.5">{new Date(sprint.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                </div>
              </div>
              {sprint.goal && (
                <div className="bg-muted/40 rounded-lg p-2.5">
                  <p className="text-xs text-muted-foreground mb-1">Sprint Goal</p>
                  <p className="text-sm">{sprint.goal}</p>
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${sprint.storyPoints > 0 ? Math.round((sprint.completedPoints / sprint.storyPoints) * 100) : 0}%`, backgroundColor: event.color }} />
                </div>
                <span className="text-xs font-medium">{sprint.storyPoints > 0 ? Math.round((sprint.completedPoints / sprint.storyPoints) * 100) : 0}%</span>
              </div>
            </>
          )}

          {/* Date */}
          <div className="flex items-center gap-2 pt-1 border-t border-border text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {event.endDate && event.endDate !== event.date
                ? `${new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} → ${new Date(event.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                : new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Agenda View ───────────────────────────────────────────
function AgendaView({ events, onEventClick }: { events: CalendarEvent[]; onEventClick: (e: CalendarEvent) => void }) {
  const today = new Date(); today.setHours(0, 0, 0, 0);

  // Build 60 days of upcoming events
  const upcoming = [...events]
    .filter(e => {
      const d = new Date(e.date); d.setHours(0, 0, 0, 0);
      return d >= today;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const grouped: Record<string, CalendarEvent[]> = {};
  upcoming.forEach(e => {
    if (!grouped[e.date]) grouped[e.date] = [];
    grouped[e.date].push(e);
  });

  const TYPE_ICON: Record<string, any> = { task: CheckSquare, milestone: Target, sprint: Zap };
  const TYPE_LABEL: Record<string, string> = { task: 'Task', milestone: 'Milestone', sprint: 'Sprint' };

  if (Object.keys(grouped).length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <Calendar className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p>No upcoming events</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-3xl mx-auto py-6 px-4 space-y-1">
        {Object.entries(grouped).map(([dateStr, dayEvents]) => {
          const date = new Date(dateStr);
          const isToday = date.getTime() === today.getTime();
          const isTomorrow = date.getTime() === today.getTime() + 86400000;
          const daysAway = Math.round((date.getTime() - today.getTime()) / 86400000);
          const isThisWeek = daysAway > 0 && daysAway < 7;

          return (
            <div key={dateStr} className="flex gap-5">
              {/* Date column */}
              <div className={`w-24 flex-shrink-0 pt-3 text-right ${isToday ? 'text-primary' : ''}`}>
                <p className={`text-xs font-medium uppercase tracking-wide ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                  {isToday ? 'Today' : isTomorrow ? 'Tomorrow' : date.toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
                <p className={`text-2xl font-bold leading-tight ${isToday ? 'text-primary' : ''}`}>{date.getDate()}</p>
                <p className="text-xs text-muted-foreground">{date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}</p>
                {!isToday && daysAway > 0 && (
                  <p className="text-xs text-muted-foreground mt-0.5">in {daysAway}d</p>
                )}
              </div>

              {/* Events */}
              <div className="flex-1 py-2 space-y-1.5 border-l border-border pl-5">
                {isToday && <div className="w-2 h-2 rounded-full bg-primary -ml-6 mt-3.5 float-left" />}
                {dayEvents.map(event => {
                  const TypeIcon = TYPE_ICON[event.type];
                  const isOverdue = event.type === 'task' && new Date(event.date) < new Date() && event.status !== 'Closed';
                  return (
                    <button
                      key={event.id}
                      onClick={() => onEventClick(event)}
                      className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all bg-card"
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${event.color}20` }}>
                        <TypeIcon className="w-4 h-4" style={{ color: event.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{event.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs capitalize text-muted-foreground">{TYPE_LABEL[event.type]}</span>
                          {event.assignee && (
                            <>
                              <span className="text-muted-foreground/40">·</span>
                              <span className="text-xs text-muted-foreground">{event.assignee.split(' ')[0]}</span>
                            </>
                          )}
                          {event.endDate && event.endDate !== event.date && (
                            <>
                              <span className="text-muted-foreground/40">·</span>
                              <span className="text-xs text-muted-foreground">ends {new Date(event.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            </>
                          )}
                        </div>
                      </div>
                      {isOverdue && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full flex-shrink-0">Overdue</span>
                      )}
                      {event.status && event.type === 'task' && (
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded flex-shrink-0">{event.status}</span>
                      )}
                      <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: event.color }} />
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
export function WorkCalendarOS() {
  const { tasks, milestones, sprints } = useExecutionOS();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calView, setCalView] = useState<CalendarView>('month');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const events = useMemo(() => buildEvents(tasks, milestones, sprints), [tasks, milestones, sprints]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Month navigation
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const prevWeek = () => { const d = new Date(currentDate); d.setDate(d.getDate() - 7); setCurrentDate(d); };
  const nextWeek = () => { const d = new Date(currentDate); d.setDate(d.getDate() + 7); setCurrentDate(d); };
  const prevDay = () => { const d = new Date(currentDate); d.setDate(d.getDate() - 1); setCurrentDate(d); };
  const nextDay = () => { const d = new Date(currentDate); d.setDate(d.getDate() + 1); setCurrentDate(d); };

  // Build month grid
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDow = firstDay.getDay();

  const calDays: Date[] = [];
  for (let i = 0; i < startDow; i++) {
    calDays.push(new Date(year, month, -startDow + i + 1));
  }
  for (let d = 1; d <= lastDay.getDate(); d++) {
    calDays.push(new Date(year, month, d));
  }
  while (calDays.length % 7 !== 0) {
    calDays.push(new Date(year, month + 1, calDays.length - lastDay.getDate() - startDow + 1));
  }

  // Week start (for week view)
  const weekStart = new Date(currentDate);
  weekStart.setDate(currentDate.getDate() - currentDate.getDay());

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(e => e.date === dateStr);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-card flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" /> Calendar
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {events.filter(e => e.type === 'task').length} tasks · {events.filter(e => e.type === 'milestone').length} milestones · {events.filter(e => e.type === 'sprint').length} active sprints
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Legend */}
          <div className="flex items-center gap-3 mr-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Tasks
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Milestones
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Sprints
            </span>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
            <button onClick={() => setCalView('month')} className={`px-2.5 py-1.5 rounded text-xs ${calView === 'month' ? 'bg-card shadow-sm' : 'text-muted-foreground'}`}>
              Month
            </button>
            <button onClick={() => setCalView('week')} className={`px-2.5 py-1.5 rounded text-xs ${calView === 'week' ? 'bg-card shadow-sm' : 'text-muted-foreground'}`}>
              Week
            </button>
            <button onClick={() => setCalView('day')} className={`px-2.5 py-1.5 rounded text-xs ${calView === 'day' ? 'bg-card shadow-sm' : 'text-muted-foreground'}`}>
              Day
            </button>
            <button onClick={() => setCalView('agenda')} className={`px-2.5 py-1.5 rounded text-xs ${calView === 'agenda' ? 'bg-card shadow-sm' : 'text-muted-foreground'}`}>
              Agenda
            </button>
          </div>

          <Button variant="outline" size="sm">
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Event
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-4 px-6 py-3 border-b border-border bg-background">
        <button
          onClick={calView === 'month' ? prevMonth : calView === 'week' ? prevWeek : prevDay}
          className="p-1.5 hover:bg-accent rounded-lg transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h2 className="text-base font-semibold">
          {calView === 'month'
            ? currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            : calView === 'week'
            ? `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — ${new Date(weekStart.getTime() + 6 * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
            : calView === 'agenda'
            ? 'Upcoming Events'
            : currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
          }
        </h2>
        <button
          onClick={calView === 'month' ? nextMonth : calView === 'week' ? nextWeek : nextDay}
          className="p-1.5 hover:bg-accent rounded-lg transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => setCurrentDate(new Date())}
          className="text-xs px-2.5 py-1 border border-border rounded-lg hover:bg-accent transition-colors"
        >
          Today
        </button>
        {calView === 'day' && (
          <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d, i) => {
              const dayDate = new Date(today);
              dayDate.setDate(today.getDate() - today.getDay() + i + 1);
              const isSelected = dayDate.toISOString().split('T')[0] === currentDate.toISOString().split('T')[0];
              const dayEvents = events.filter(e => e.date === dayDate.toISOString().split('T')[0]);
              return (
                <button
                  key={d}
                  onClick={() => setCurrentDate(new Date(dayDate))}
                  className={`flex flex-col items-center px-2 py-1 rounded-lg transition-colors ${isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
                >
                  <span>{d}</span>
                  <span>{dayDate.getDate()}</span>
                  {dayEvents.length > 0 && !isSelected && (
                    <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Calendar Grid + Upcoming Panel */}
      <div className="flex flex-1 overflow-hidden">
        {calView === 'agenda' ? (
          <AgendaView events={events} onEventClick={setSelectedEvent} />
        ) : (
          <>
            <div className="flex-1 overflow-hidden">
              {calView === 'month' && (
                <div className="flex flex-col h-full">
                  <div className="grid grid-cols-7 border-b border-border">
                    {DOW.map(d => (
                      <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-2 border-r border-border last:border-0">
                        {d}
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 overflow-auto">
                    <div className="grid grid-cols-7">
                      {calDays.map((date, i) => {
                        const dateStr = date.toISOString().split('T')[0];
                        const dayEvents = getEventsForDate(date);
                        const isToday = date.getTime() === today.getTime();
                        const isCurrentMonth = date.getMonth() === month;
                        return (
                          <DayCell
                            key={i}
                            date={date}
                            events={dayEvents}
                            isToday={isToday}
                            isCurrentMonth={isCurrentMonth}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
              {calView === 'week' && <WeekView weekStart={weekStart} events={events} />}
              {calView === 'day' && <DayView date={currentDate} events={events} />}
            </div>
            <UpcomingPanel events={events} />
          </>
        )}
      </div>

      {selectedEvent && (
        <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} tasks={tasks} milestones={milestones} />
      )}
    </div>
  );
}