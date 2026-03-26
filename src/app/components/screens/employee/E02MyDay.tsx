/**
 * E02 - My Day
 * Wired to service layer: useTimeData() → sessions (clockIn, clockOut) for current employee (e1)
 * Break tracking remains local (real-time UI concern, not persisted in this phase)
 */
import { useState, useEffect } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { Button } from '../../ui/button';
import { StatusBadge } from '../../shared/StatusBadge';
import {
  CheckCircle2, Clock, Calendar, Coffee,
  StopCircle, PlayCircle, LogOut, CheckCircle, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useTimeData } from '../../../services';

const CURRENT_EMPLOYEE_ID = 'e1';

interface Break {
  id: string;
  startTime: string;
  endTime: string | null;
  duration: number; // minutes
}

export function E02MyDay() {
  const { sessions, clockIn, clockOut, loading } = useTimeData();

  // Get today's active session for current employee
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySession = sessions.find(
    s => s.employeeId === CURRENT_EMPLOYEE_ID && s.date === todayStr
  );
  const activeSession = sessions.find(
    s => s.employeeId === CURRENT_EMPLOYEE_ID && s.status === 'Active'
  );

  const isClockedIn = !!activeSession;

  // Local break tracking (UI-only, not persisted in service layer this phase)
  const [breaks, setBreaks] = useState<Break[]>([]);
  const [currentBreakId, setCurrentBreakId] = useState<string | null>(null);
  const isOnBreak = !!currentBreakId;

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isProcessing, setIsProcessing] = useState(false);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  const calculateActiveTime = (): string => {
    if (!isClockedIn || !activeSession) return '0h 0m';
    // Calculate from check-in time (approximate from session since stored as string)
    const checkInParts = activeSession.checkIn.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!checkInParts) return '—';
    let hours = parseInt(checkInParts[1]);
    const mins = parseInt(checkInParts[2]);
    const period = checkInParts[3].toUpperCase();
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    const checkInDate = new Date();
    checkInDate.setHours(hours, mins, 0, 0);
    const diffMs = currentTime.getTime() - checkInDate.getTime();
    const breakMs = breaks.reduce((t, b) => t + b.duration * 60 * 1000, 0);
    const activeMs = Math.max(0, diffMs - breakMs);
    return `${Math.floor(activeMs / 3600000)}h ${Math.floor((activeMs % 3600000) / 60000)}m`;
  };

  const totalBreakTime = (): string => {
    const mins = breaks.reduce((t, b) => t + b.duration, 0);
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const remainingBreakTime = (): string => {
    const used = breaks.reduce((t, b) => t + b.duration, 0);
    const remaining = Math.max(0, 60 - used);
    const h = Math.floor(remaining / 60);
    const m = remaining % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const handleClockIn = async () => {
    setIsProcessing(true);
    try {
      await clockIn(CURRENT_EMPLOYEE_ID);
      setBreaks([]);
      setCurrentBreakId(null);
      toast.success(`Clocked in at ${formatTime(new Date())}`, {
        icon: <Clock className="h-4 w-4" />,
      });
    } catch {
      toast.error('Failed to clock in');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClockOut = async () => {
    if (!activeSession) return;
    if (isOnBreak) {
      toast.error('Please end your break first before clocking out');
      return;
    }
    setIsProcessing(true);
    try {
      await clockOut(activeSession.id);
      toast.success(`Clocked out at ${formatTime(new Date())}. Have a great day!`, {
        icon: <LogOut className="h-4 w-4" />,
      });
    } catch {
      toast.error('Failed to clock out');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartBreak = () => {
    if (!isClockedIn) { toast.error('You must clock in first'); return; }
    if (isOnBreak) { toast.error('Already on break'); return; }
    const id = `break-${Date.now()}`;
    setBreaks(prev => [...prev, { id, startTime: formatTime(new Date()), endTime: null, duration: 0 }]);
    setCurrentBreakId(id);
    toast.success(`Break started at ${formatTime(new Date())}`, { icon: <Coffee className="h-4 w-4" /> });
  };

  const handleEndBreak = () => {
    if (!isOnBreak || !currentBreakId) { toast.error('No active break'); return; }
    const endTime = formatTime(new Date());
    setBreaks(prev =>
      prev.map(b => {
        if (b.id === currentBreakId) {
          const start = b.startTime;
          // Rough duration calc
          const now = new Date();
          const startParts = start.match(/(\d+):(\d+)\s*(AM|PM)/i);
          let durationMins = 0;
          if (startParts) {
            let h = parseInt(startParts[1]);
            const m = parseInt(startParts[2]);
            const p = startParts[3].toUpperCase();
            if (p === 'PM' && h !== 12) h += 12;
            if (p === 'AM' && h === 12) h = 0;
            const startDate = new Date();
            startDate.setHours(h, m, 0, 0);
            durationMins = Math.floor((now.getTime() - startDate.getTime()) / 60000);
          }
          return { ...b, endTime, duration: Math.max(1, durationMins) };
        }
        return b;
      })
    );
    setCurrentBreakId(null);
    toast.success('Break ended', { icon: <CheckCircle className="h-4 w-4" /> });
  };

  const todaysTasks = [
    { id: '1', time: '09:00', title: 'Daily Standup', type: 'Meeting', status: 'completed' },
    { id: '2', time: '10:00', title: 'Code Review – PR #234', type: 'Development', status: 'completed' },
    { id: '3', time: '11:30', title: 'Feature Implementation', type: 'Development', status: 'in-progress' },
    { id: '4', time: '14:00', title: 'Client Presentation', type: 'Meeting', status: 'upcoming' },
    { id: '5', time: '16:00', title: 'Documentation Update', type: 'Task', status: 'upcoming' },
  ];

  const taskStatusBadge = (status: string) => {
    if (status === 'completed') return <StatusBadge type="success">Completed</StatusBadge>;
    if (status === 'in-progress') return <StatusBadge type="warning">In Progress</StatusBadge>;
    return <StatusBadge type="neutral">Upcoming</StatusBadge>;
  };

  return (
    <PageLayout
      title="EMPLOYEE – E-02 – My Day – v3.0 [Service Layer ✓]"
      description="Today's schedule — clock in/out synced to Time service"
      actions={
        <div className="flex items-center gap-2">
          {isClockedIn ? (
            <>
              {isOnBreak ? (
                <Button variant="destructive" onClick={handleEndBreak} disabled={isProcessing}>
                  <StopCircle className="mr-2 h-4 w-4" />
                  End Break
                </Button>
              ) : (
                <Button variant="outline" onClick={handleStartBreak} disabled={isProcessing}>
                  <Coffee className="mr-2 h-4 w-4" />
                  Start Break
                </Button>
              )}
              <Button onClick={handleClockOut} disabled={isProcessing}>
                <LogOut className="mr-2 h-4 w-4" />
                Clock Out
              </Button>
            </>
          ) : (
            <Button onClick={handleClockIn} disabled={isProcessing || loading}>
              <PlayCircle className="mr-2 h-4 w-4" />
              Clock In
            </Button>
          )}
        </div>
      }
      kpis={[
        {
          title: isClockedIn ? 'Clock In' : 'Status',
          value: isClockedIn ? (activeSession?.checkIn ?? '—') : (todaySession?.checkOut ?? 'Not Started'),
          change: isClockedIn ? 'Currently working' : todaySession ? 'Day complete' : 'Not clocked in',
          changeType: isClockedIn ? 'positive' : 'neutral',
          icon: <Clock className="h-5 w-5" />,
        },
        {
          title: 'Active Time',
          value: calculateActiveTime(),
          change: isOnBreak ? 'On break' : isClockedIn ? 'Currently working' : 'Clocked out',
          changeType: isOnBreak ? 'warning' : isClockedIn ? 'positive' : 'neutral',
          icon: <CheckCircle2 className="h-5 w-5" />,
        },
        {
          title: 'Tasks',
          value: '2/5',
          change: '40% progress',
          changeType: 'neutral',
          icon: <Calendar className="h-5 w-5" />,
        },
        {
          title: 'Break Time',
          value: totalBreakTime(),
          change: `${remainingBreakTime()} remaining`,
          changeType: 'neutral',
          icon: <Coffee className="h-5 w-5" />,
        },
      ]}
    >
      <div className="space-y-6">
        {/* On Break Banner */}
        {isOnBreak && (
          <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/30 p-4">
            <div className="flex items-start gap-3">
              <Coffee className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-yellow-600 mb-1">You're on a break</h4>
                <p className="text-sm text-muted-foreground">
                  Break started at {breaks.find(b => b.id === currentBreakId)?.startTime}.
                  Click "End Break" when you're ready to resume.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Clocked Out Banner */}
        {!isClockedIn && todaySession?.checkOut && (
          <div className="rounded-lg bg-blue-500/10 border border-blue-500/30 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-600 mb-1">You're clocked out</h4>
                <p className="text-sm text-muted-foreground">
                  Clocked out at {todaySession.checkOut}. Total: {todaySession.duration}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Current Time Display */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Time</p>
              <p className="text-3xl font-bold mt-1">{formatTime(currentTime)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Status</p>
              <div className="mt-2">
                {isClockedIn ? (
                  isOnBreak ? (
                    <StatusBadge type="warning">On Break</StatusBadge>
                  ) : (
                    <StatusBadge type="success">Working</StatusBadge>
                  )
                ) : (
                  <StatusBadge type="neutral">Clocked Out</StatusBadge>
                )}
              </div>
            </div>
          </div>
          {activeSession && (
            <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
              Session ID: <code className="font-mono">{activeSession.id}</code> — Synced to Time service ✓
            </div>
          )}
        </div>

        {/* Break History */}
        {breaks.length > 0 && (
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-6 font-semibold flex items-center gap-2">
              <Coffee className="h-5 w-5" />
              Today's Breaks ({breaks.length})
            </h3>
            <div className="space-y-3">
              {breaks.map(br => (
                <div key={br.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                      <Coffee className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {br.startTime} – {br.endTime || 'In Progress'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {br.endTime ? `Duration: ${br.duration} minutes` : 'Currently on break'}
                      </p>
                    </div>
                  </div>
                  {!br.endTime && <StatusBadge type="warning">Active</StatusBadge>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Today's Timeline */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-6 font-semibold">Today's Timeline</h3>
          <div className="space-y-4">
            {todaysTasks.map(task => (
              <div key={task.id} className="flex items-center gap-4 rounded-lg border border-border p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{task.time}</span>
                    <StatusBadge type="neutral">{task.type}</StatusBadge>
                  </div>
                  <p className="mt-1 text-muted-foreground">{task.title}</p>
                </div>
                {taskStatusBadge(task.status)}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-muted/50 border border-border p-4">
          <p className="text-sm text-muted-foreground">
            <strong>💡 Clock In/Out now syncs to the Time service</strong> — your session is tracked
            in-memory and will be visible in Sessions, Activity Overview, and Analytics screens.
            Break tracking is local to this session for real-time UX.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
