import { useEffect, useState } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { useTimeData } from '../../../services/hooks';
import { useCurrentEmployee } from '../../../services';
import {
  Clock, Play, Square, Coffee, Timer, Activity, Users,
} from 'lucide-react';

export function TimeTracking() {
  const { sessions, loading, clockIn, clockOut } = useTimeData();
  const { employeeId } = useCurrentEmployee();
  const [currentTime, setCurrentTime] = useState(new Date());

  const todayStr = new Date().toISOString().split('T')[0];
  const myActiveSession = sessions.find(s => s.employeeId === employeeId && s.status === 'Active');
  const allActiveSessions = sessions.filter(s => s.status === 'Active');
  const todaySessions = sessions.filter(s => s.employeeId === employeeId && s.date === todayStr);
  const isTracking = !!myActiveSession;

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getElapsedSeconds = () => {
    if (!myActiveSession) return 0;
    const startedAt = myActiveSession.checkInAt ? new Date(myActiveSession.checkInAt) : null;
    if (startedAt && !Number.isNaN(startedAt.getTime())) {
      return Math.max(0, Math.floor((currentTime.getTime() - startedAt.getTime()) / 1000));
    }
    const match = myActiveSession.checkIn.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return 0;
    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const meridiem = match[3].toUpperCase();
    if (meridiem === 'PM' && hours !== 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;
    const fallbackStart = new Date();
    fallbackStart.setHours(hours, minutes, 0, 0);
    return Math.max(0, Math.floor((currentTime.getTime() - fallbackStart.getTime()) / 1000));
  };

  const handleClockIn = async () => {
    if (!employeeId) return;
    await clockIn(employeeId);
  };

  const handleClockOut = async () => {
    if (myActiveSession) {
      await clockOut(myActiveSession.id);
    }
  };

  const todayTotal = todaySessions
    .filter(s => s.status === 'Completed')
    .reduce((sum, s) => sum + s.totalMinutes, 0);

  return (
    <PageLayout
      title="Time Tracking"
      description="Clock in, track hours, and monitor daily work time"
      kpis={[
        { title: 'Status', value: isTracking ? 'Clocked In' : 'Clocked Out', change: isTracking ? 'Session active' : 'Start tracking', changeType: isTracking ? 'positive' : 'neutral', icon: <Clock className="h-5 w-5" /> },
        { title: 'Today Total', value: `${Math.floor(todayTotal / 60)}h ${todayTotal % 60}m`, change: `${todaySessions.length} sessions`, changeType: 'neutral', icon: <Timer className="h-5 w-5" /> },
        { title: 'Active Now', value: allActiveSessions.length, change: 'Team members online', changeType: 'positive', icon: <Activity className="h-5 w-5" /> },
        { title: 'Avg Hours/Day', value: '8.2h', change: 'This week', changeType: 'neutral', icon: <Clock className="h-5 w-5" /> },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Timer */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <div className="mb-6">
              <div className={`inline-flex items-center justify-center h-32 w-32 rounded-full border-4 ${
                isTracking ? 'border-green-500 bg-green-500/5' : 'border-border bg-muted/30'
              }`}>
                <span className="text-4xl tabular-nums">{formatTime(getElapsedSeconds())}</span>
              </div>
            </div>
            <p className="text-muted-foreground mb-6">
              {isTracking
                ? `Clocked in at ${myActiveSession?.checkIn || 'now'}`
                : 'Click the button below to start tracking'}
            </p>
            <div className="flex items-center justify-center gap-3">
              {isTracking ? (
                <>
                  <Button variant="destructive" size="lg" onClick={handleClockOut}>
                    <Square className="mr-2 h-4 w-4" />
                    Clock Out
                  </Button>
                  <Button variant="outline" size="lg">
                    <Coffee className="mr-2 h-4 w-4" />
                    Take Break
                  </Button>
                </>
              ) : (
                <Button size="lg" onClick={handleClockIn}>
                  <Play className="mr-2 h-4 w-4" />
                  Clock In
                </Button>
              )}
            </div>
          </div>

          {/* Today's Log */}
          <div className="rounded-lg border border-border bg-card">
            <div className="p-4 border-b border-border">
              <h3 className="font-medium">Today's Time Log</h3>
              <p className="text-sm text-muted-foreground">{new Date(todayStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <div className="divide-y divide-border">
              {todaySessions.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No sessions recorded today
                </div>
              ) : (
                todaySessions.map(session => (
                  <div key={session.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-2.5 w-2.5 rounded-full ${
                        session.status === 'Active' ? 'bg-green-500 animate-pulse' :
                        session.status === 'Completed' ? 'bg-blue-500' : 'bg-yellow-500'
                      }`} />
                      <div>
                        <div className="font-medium text-sm">{session.employeeName}</div>
                        <div className="text-xs text-muted-foreground">{session.department}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">
                        {session.checkIn} — {session.checkOut || 'In progress'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {session.status === 'Active' ? 'Active' : session.duration}
                      </div>
                    </div>
                    <StatusBadge type={
                      session.status === 'Active' ? 'success' :
                      session.status === 'Completed' ? 'info' : 'warning'
                    }>
                      {session.status}
                    </StatusBadge>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Active Team Members */}
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Active Team Members
            </h3>
            <div className="space-y-3">
              {allActiveSessions.map(session => (
                <div key={session.id} className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary">
                      {session.employeeName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 border border-card" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{session.employeeName}</div>
                    <div className="text-xs text-muted-foreground">Since {session.checkIn}</div>
                  </div>
                </div>
              ))}
              {allActiveSessions.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No active sessions</p>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-medium mb-4">This Week</h3>
            <div className="space-y-3">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => {
                const hours = i < 2 ? [8.5, 9.75][i] : (i === 2 ? 0 : 0);
                const pct = (hours / 10) * 100;
                return (
                  <div key={day} className="flex items-center gap-3">
                    <span className={`text-xs w-8 ${i === 2 ? 'font-medium' : 'text-muted-foreground'}`}>{day}</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${i === 2 ? 'bg-green-500' : hours > 0 ? 'bg-primary' : 'bg-transparent'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-10 text-right">
                      {hours > 0 ? `${hours}h` : i === 2 ? 'Today' : '—'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
