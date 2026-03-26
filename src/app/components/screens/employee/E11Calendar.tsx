import { useState, useMemo } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { Button } from '../../ui/button';
import { Calendar, ChevronLeft, ChevronRight, Clock, Umbrella, Users, Plus } from 'lucide-react';
import { useTimeData } from '../../../services';
import type { LeaveRequest, TimeSession } from '../../../services/types';

const CURRENT_EMPLOYEE_ID = 'e1';

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];

type CalendarEvent = {
  id: string;
  date: string;
  label: string;
  type: 'leave' | 'session' | 'meeting';
  color: string;
};

const STATUS_COLORS: Record<string, string> = {
  Approved: 'bg-green-500',
  Pending:  'bg-yellow-500',
  Rejected: 'bg-red-500',
  Active:   'bg-blue-500',
  Completed:'bg-gray-400',
};

function getDatesInRange(start: string, end: string): string[] {
  const dates: string[] = [];
  const cur = new Date(start + 'T12:00:00Z');
  const endDate = new Date(end + 'T12:00:00Z');
  while (cur <= endDate) {
    dates.push(cur.toISOString().split('T')[0]);
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return dates;
}

export function E11Calendar() {
  const { leaveRequests, sessions } = useTimeData();

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState<string>(today.toISOString().split('T')[0]);

  // Build calendar events from service data
  const calendarEvents = useMemo((): CalendarEvent[] => {
    const events: CalendarEvent[] = [];

    // My leave requests
    const myLeave = leaveRequests.filter(lr => lr.employeeId === CURRENT_EMPLOYEE_ID);
    for (const lr of myLeave) {
      const dates = getDatesInRange(lr.startDate, lr.endDate);
      dates.forEach(date => {
        events.push({
          id: `lr-${lr.id}-${date}`,
          date,
          label: lr.type,
          type: 'leave',
          color: STATUS_COLORS[lr.status] || 'bg-gray-500',
        });
      });
    }

    // My work sessions
    const mySessions = sessions.filter(s => s.employeeId === CURRENT_EMPLOYEE_ID);
    for (const sess of mySessions) {
      events.push({
        id: `sess-${sess.id}`,
        date: sess.date,
        label: sess.status === 'Active' ? `Active: ${sess.checkIn}` : `${sess.duration}`,
        type: 'session',
        color: STATUS_COLORS[sess.status] || 'bg-blue-400',
      });
    }

    return events;
  }, [leaveRequests, sessions]);

  // Calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

  const cells: { date: string | null; day: number; isCurrentMonth: boolean }[] = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push({ date: null, day: prevMonthDays - firstDay + i + 1, isCurrentMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cells.push({ date: dateStr, day: d, isCurrentMonth: true });
  }
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ date: null, day: d, isCurrentMonth: false });
  }

  const getEventsForDate = (date: string | null) =>
    date ? calendarEvents.filter(e => e.date === date) : [];

  const todayStr = today.toISOString().split('T')[0];
  const selectedEvents = getEventsForDate(selected);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(v => v - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(v => v + 1); }
    else setViewMonth(m => m + 1);
  };

  // Stats
  const myLeave = leaveRequests.filter(lr => lr.employeeId === CURRENT_EMPLOYEE_ID);
  const approvedLeave = myLeave.filter(lr => lr.status === 'Approved');
  const pendingLeave = myLeave.filter(lr => lr.status === 'Pending');
  const mySessions = sessions.filter(s => s.employeeId === CURRENT_EMPLOYEE_ID);
  const activeSession = mySessions.find(s => s.status === 'Active');

  return (
    <PageLayout
      title="My Calendar"
      description="Your schedule, leave, and work sessions — wired to useTimeData()"
      actions={
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Request Leave
        </Button>
      }
      kpis={[
        {
          title: 'Leave Requests',
          value: String(myLeave.length),
          change: `${approvedLeave.length} approved`,
          changeType: 'positive',
          icon: <Umbrella className="h-5 w-5" />,
        },
        {
          title: 'Pending',
          value: String(pendingLeave.length),
          change: 'Awaiting approval',
          changeType: pendingLeave.length > 0 ? 'warning' : 'positive',
          icon: <Clock className="h-5 w-5" />,
        },
        {
          title: 'Active Session',
          value: activeSession ? 'Clocked In' : 'Not Active',
          change: activeSession ? `Since ${activeSession.checkIn}` : 'No active session',
          changeType: activeSession ? 'positive' : 'neutral',
          icon: <Clock className="h-5 w-5" />,
        },
        {
          title: 'Sessions This Month',
          value: String(mySessions.filter(s => s.date.startsWith(`${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`)).length),
          change: `${MONTHS[viewMonth]}`,
          changeType: 'neutral',
          icon: <Calendar className="h-5 w-5" />,
        },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 rounded-lg border border-border bg-card overflow-hidden">
          {/* Month navigation */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <Button variant="outline" size="sm" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3>{MONTHS[viewMonth]} {viewYear}</h3>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-border">
            {DOW.map(d => (
              <div key={d} className="py-2 text-center text-xs font-semibold text-muted-foreground">
                {d}
              </div>
            ))}
          </div>

          {/* Date cells */}
          <div className="grid grid-cols-7">
            {cells.map((cell, idx) => {
              const events = getEventsForDate(cell.date);
              const isToday = cell.date === todayStr;
              const isSelected = cell.date === selected;
              return (
                <button
                  key={idx}
                  onClick={() => cell.date && setSelected(cell.date)}
                  disabled={!cell.isCurrentMonth}
                  className={`min-h-16 p-1.5 border-b border-r border-border text-left transition-colors hover:bg-muted/20 ${
                    !cell.isCurrentMonth ? 'opacity-30' : ''
                  } ${isSelected ? 'bg-primary/10 ring-2 ring-inset ring-primary/30' : ''}`}
                >
                  <span className={`text-sm font-medium inline-flex items-center justify-center w-6 h-6 rounded-full ${
                    isToday ? 'bg-primary text-primary-foreground' : ''
                  }`}>
                    {cell.day}
                  </span>
                  <div className="mt-0.5 space-y-0.5">
                    {events.slice(0, 2).map(ev => (
                      <div key={ev.id} className={`text-xs px-1 rounded truncate text-white ${ev.color}`}>
                        {ev.label.length > 10 ? ev.label.slice(0, 9) + '…' : ev.label}
                      </div>
                    ))}
                    {events.length > 2 && (
                      <div className="text-xs text-muted-foreground px-1">+{events.length - 2} more</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Detail */}
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-3 text-sm font-semibold">
              {selected ? new Date(selected + 'T12:00:00Z').toLocaleDateString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
              }) : 'Select a date'}
            </h3>
            {selectedEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No events on this day
              </p>
            ) : (
              <div className="space-y-2">
                {selectedEvents.map(ev => (
                  <div key={ev.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${ev.color}`} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium capitalize">{ev.type}</p>
                      <p className="text-xs text-muted-foreground truncate">{ev.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming leave */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-sm font-semibold mb-3">Upcoming Leave</h3>
            {myLeave.length === 0 ? (
              <p className="text-sm text-muted-foreground">No leave requests</p>
            ) : (
              <div className="space-y-2">
                {myLeave.slice(0, 4).map(lr => (
                  <div key={lr.id} className="flex items-start gap-2">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${STATUS_COLORS[lr.status]}`} />
                    <div>
                      <p className="text-sm font-medium">{lr.type}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(lr.startDate + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        {' — '}
                        {new Date(lr.endDate + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        {' · '}{lr.days}d
                      </p>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full text-white inline-block mt-0.5 ${STATUS_COLORS[lr.status]}`}>
                        {lr.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-sm font-semibold mb-2">Legend</h3>
            <div className="space-y-1.5">
              {[
                { color: 'bg-green-500', label: 'Approved Leave' },
                { color: 'bg-yellow-500', label: 'Pending Leave' },
                { color: 'bg-blue-500', label: 'Active Session' },
                { color: 'bg-gray-400', label: 'Completed Session' },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-sm ${color}`} />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border">
        <p className="text-xs text-muted-foreground">
          <strong>Service Layer ✓</strong> — Leave requests and work sessions from <code className="font-mono">useTimeData()</code>.
          Calendar events are computed from live service data; filtered for employee ID <code className="font-mono">e1</code> (Sarah Johnson).
        </p>
      </div>
    </PageLayout>
  );
}
