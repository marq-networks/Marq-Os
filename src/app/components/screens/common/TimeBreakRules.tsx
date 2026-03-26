import { useState } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { StatusBadge } from '../../shared/StatusBadge';
import { FormDrawer } from '../../shared/FormDrawer';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { useTimeData, usePeopleData } from '../../../services/hooks';
import {
  Coffee, Clock, Plus, Pencil, Shield, Users, Settings,
} from 'lucide-react';
import type { BreakRule, WorkdayRule } from '../../../services/types';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function TimeBreakRules() {
  const { breakRules, workdayRules, loading } = useTimeData();
  const { departments } = usePeopleData();
  const [tab, setTab] = useState<'breaks' | 'workday'>('breaks');

  return (
    <PageLayout
      title="Break & Workday Rules"
      description="Configure break policies, workday schedules, and time tracking rules"
      kpis={[
        { title: 'Break Policies', value: breakRules.length, change: `${breakRules.filter(r => r.isDefault).length} default`, changeType: 'neutral', icon: <Coffee className="h-5 w-5" /> },
        { title: 'Workday Schedules', value: workdayRules.length, change: `${workdayRules.filter(r => r.isDefault).length} default`, changeType: 'neutral', icon: <Clock className="h-5 w-5" /> },
        { title: 'Departments Covered', value: departments.length, change: 'All departments', changeType: 'positive', icon: <Users className="h-5 w-5" /> },
        { title: 'Policies Active', value: breakRules.length + workdayRules.length, change: 'Total active rules', changeType: 'neutral', icon: <Settings className="h-5 w-5" /> },
      ]}
    >
      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-border">
        <button
          onClick={() => setTab('breaks')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === 'breaks' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Coffee className="inline h-4 w-4 mr-1.5" />Break Policies
        </button>
        <button
          onClick={() => setTab('workday')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === 'workday' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Clock className="inline h-4 w-4 mr-1.5" />Workday Schedules
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : tab === 'breaks' ? (
        <div className="space-y-4">
          {breakRules.map(rule => (
            <div key={rule.id} className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <Coffee className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{rule.name}</h3>
                      {rule.isDefault && <StatusBadge type="info">Default</StatusBadge>}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Applies to: {rule.appliesTo.includes('all')
                        ? 'All departments'
                        : rule.appliesTo.map(id => departments.find(d => d.id === id)?.name || id).join(', ')}
                    </p>
                  </div>
                </div>
                <button className="p-2 rounded-md hover:bg-muted text-muted-foreground">
                  <Pencil className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-md bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">Max Breaks</p>
                  <p className="text-lg font-medium">{rule.maxBreaks}</p>
                  <p className="text-xs text-muted-foreground">per day</p>
                </div>
                <div className="rounded-md bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">Max Per Break</p>
                  <p className="text-lg font-medium">{rule.maxBreakDuration}m</p>
                  <p className="text-xs text-muted-foreground">minutes</p>
                </div>
                <div className="rounded-md bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">Total Break Time</p>
                  <p className="text-lg font-medium">{rule.maxTotalBreakTime}m</p>
                  <p className="text-xs text-muted-foreground">per day</p>
                </div>
                <div className="rounded-md bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">Paid Break</p>
                  <p className="text-lg font-medium">{rule.paidBreak ? 'Yes' : 'No'}</p>
                  <p className="text-xs text-muted-foreground">{rule.paidBreak ? 'Compensated' : 'Unpaid'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {workdayRules.map(rule => (
            <div key={rule.id} className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{rule.name}</h3>
                      {rule.isDefault && <StatusBadge type="info">Default</StatusBadge>}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Applies to: {rule.appliesTo.includes('all')
                        ? 'All departments'
                        : rule.appliesTo.map(id => departments.find(d => d.id === id)?.name || id).join(', ')}
                    </p>
                  </div>
                </div>
                <button className="p-2 rounded-md hover:bg-muted text-muted-foreground">
                  <Pencil className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="rounded-md bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">Start Time</p>
                  <p className="text-lg font-medium">{rule.startTime}</p>
                </div>
                <div className="rounded-md bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">End Time</p>
                  <p className="text-lg font-medium">{rule.endTime}</p>
                </div>
                <div className="rounded-md bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">Grace Period</p>
                  <p className="text-lg font-medium">{rule.gracePeriodMinutes}m</p>
                </div>
                <div className="rounded-md bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">Timezone</p>
                  <p className="text-sm font-medium">{rule.timezone.split('/')[1]?.replace('_', ' ') || rule.timezone}</p>
                </div>
              </div>

              {/* Working days visualization */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Working Days</p>
                <div className="flex gap-2">
                  {DAYS.map((day, i) => (
                    <div
                      key={day}
                      className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-medium ${
                        rule.workingDays.includes(i)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
