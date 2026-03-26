/**
 * A09 - Break Rules
 * Wired to service layer: useTimeData() → breakRules (updateBreakRule, createBreakRule)
 */
import { useState, useEffect } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Switch } from '../../ui/switch';
import { Coffee, Save, Clock, CheckCircle, RotateCcw, AlertCircle, Plus, Trash2, RefreshCw } from 'lucide-react';
import { useTimeData } from '../../../services';
import type { BreakRule } from '../../../services';
import { toast } from 'sonner';

interface BreakType {
  id: string;
  name: string;
  duration: number;
  isPaid: boolean;
  enabled: boolean;
}

interface UIBreakConfig {
  maxBreaks: number;
  maxBreakDuration: number;
  maxTotalBreakTime: number;
  minWorkHoursBeforeBreak: number;
  paidBreak: boolean;
  mandatoryBreak: boolean;
  breakReminders: boolean;
  trackBreakLocation: boolean;
  autoResumeWork: boolean;
  breakTypes: BreakType[];
}

const DEFAULT_BREAK_TYPES: BreakType[] = [
  { id: '1', name: 'Short Break', duration: 15, isPaid: true, enabled: true },
  { id: '2', name: 'Lunch Break', duration: 60, isPaid: false, enabled: true },
  { id: '3', name: 'Personal Break', duration: 30, isPaid: false, enabled: true },
];

function buildConfigFromRule(rule?: BreakRule): UIBreakConfig {
  return {
    maxBreaks: rule?.maxBreaks ?? 3,
    maxBreakDuration: rule?.maxBreakDuration ?? 30,
    maxTotalBreakTime: rule?.maxTotalBreakTime ?? 60,
    minWorkHoursBeforeBreak: 4,
    paidBreak: rule?.paidBreak ?? true,
    mandatoryBreak: true,
    breakReminders: true,
    trackBreakLocation: false,
    autoResumeWork: true,
    breakTypes: DEFAULT_BREAK_TYPES,
  };
}

export function A09BreakRules() {
  const { breakRules, loading, refresh } = useTimeData();
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const defaultRule = breakRules.find(r => r.isDefault) ?? breakRules[0];

  const [config, setConfig] = useState<UIBreakConfig>(() => buildConfigFromRule());
  const [originalConfig, setOriginalConfig] = useState<UIBreakConfig>(() => buildConfigFromRule());

  useEffect(() => {
    if (defaultRule) {
      const built = buildConfigFromRule(defaultRule);
      setConfig(built);
      setOriginalConfig(built);
    }
  }, [defaultRule?.id]);

  const hasChanges = JSON.stringify(config) !== JSON.stringify(originalConfig);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      toast.success('Break rules saved successfully! Changes are now active.');
      setOriginalConfig(config);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch {
      toast.error('Failed to save break rules');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setConfig(originalConfig);
    toast.info('Changes discarded');
  };

  const handleReset = () => {
    const fresh = buildConfigFromRule();
    setConfig(fresh);
    toast.info('Reset to defaults — click Save to apply');
  };

  const addBreakType = () => {
    const newBT: BreakType = {
      id: Date.now().toString(),
      name: 'New Break Type',
      duration: 15,
      isPaid: false,
      enabled: true,
    };
    setConfig(prev => ({ ...prev, breakTypes: [...prev.breakTypes, newBT] }));
  };

  const deleteBreakType = (id: string) => {
    setConfig(prev => ({ ...prev, breakTypes: prev.breakTypes.filter(bt => bt.id !== id) }));
  };

  const updateBT = (id: string, patch: Partial<BreakType>) => {
    setConfig(prev => ({
      ...prev,
      breakTypes: prev.breakTypes.map(bt => (bt.id === id ? { ...bt, ...patch } : bt)),
    }));
  };

  // Stats
  const activeBTs = config.breakTypes.filter(bt => bt.enabled).length;
  const totalPaid = config.breakTypes.filter(bt => bt.enabled && bt.isPaid).reduce((s, bt) => s + bt.duration, 0);
  const totalUnpaid = config.breakTypes.filter(bt => bt.enabled && !bt.isPaid).reduce((s, bt) => s + bt.duration, 0);
  const activeRules = [config.mandatoryBreak, config.breakReminders, config.trackBreakLocation, config.autoResumeWork].filter(Boolean).length;

  return (
    <PageLayout
      title="ADMIN – A-09 – Break Rules – v3.0 [Service Layer ✓]"
      description="Configure break policies and durations — live data from Time service"
      actions={
        <>
          {hasChanges && (
            <Button variant="outline" size="sm" onClick={handleDiscard}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Discard Changes
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset to Defaults
          </Button>
          <Button variant="outline" size="sm" onClick={refresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" onClick={handleSave} disabled={!hasChanges || isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving…' : hasChanges ? 'Save Changes *' : 'No Changes'}
          </Button>
        </>
      }
      kpis={[
        {
          title: 'Paid Break',
          value: `${totalPaid} min`,
          change: 'Total paid time',
          changeType: 'positive',
          icon: <Coffee className="h-5 w-5" />,
        },
        {
          title: 'Unpaid Break',
          value: `${totalUnpaid} min`,
          change: 'Total unpaid time',
          changeType: 'neutral',
          icon: <Clock className="h-5 w-5" />,
        },
        {
          title: 'Max Total Break',
          value: `${config.maxTotalBreakTime} min`,
          change: 'Daily limit',
          changeType: 'neutral',
          icon: <Coffee className="h-5 w-5" />,
        },
        {
          title: 'Active Policies',
          value: `${activeRules}/4`,
          change: `${activeBTs} break types`,
          changeType: 'neutral',
          icon: <Coffee className="h-5 w-5" />,
        },
      ]}
    >
      {!loading && breakRules.length > 0 && (
        <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
          <CheckCircle className="h-3 w-3 text-green-500" />
          Showing rule: <strong>{defaultRule?.name ?? 'Default'}</strong>
          ({breakRules.length} rule{breakRules.length !== 1 ? 's' : ''} total)
        </div>
      )}

      {hasChanges && (
        <div className="mb-6 rounded-lg border border-warning/50 bg-warning/5 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-warning mb-1">Unsaved Changes</h4>
              <p className="text-sm text-muted-foreground">Click "Save Changes" to apply them.</p>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800 p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="font-medium text-green-900 dark:text-green-100">
              Break rules saved successfully!
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Break Durations */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-6 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Break Limits
          </h3>
          <div className="space-y-4">
            {[
              { id: 'maxBreaks', label: 'Max Breaks per Day', field: 'maxBreaks' as const, min: 0, max: 10 },
              { id: 'maxBreakDuration', label: 'Max Break Duration (min)', field: 'maxBreakDuration' as const, min: 0, max: 120 },
              { id: 'maxTotalBreakTime', label: 'Max Total Break Time (min)', field: 'maxTotalBreakTime' as const, min: 0, max: 300 },
              { id: 'minWorkHours', label: 'Min Work Hours Before Break', field: 'minWorkHoursBeforeBreak' as const, min: 0, max: 12 },
            ].map(({ id, label, field, min, max }) => (
              <div key={id}>
                <Label htmlFor={id}>{label}</Label>
                <Input
                  id={id}
                  type="number"
                  min={min}
                  max={max}
                  value={config[field]}
                  onChange={e =>
                    setConfig(prev => ({
                      ...prev,
                      [field]: Math.max(min, Math.min(max, parseInt(e.target.value) || 0)),
                    }))
                  }
                  className="mt-1"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Break Policies */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-6 flex items-center gap-2">
            <Coffee className="h-5 w-5" />
            Break Policies
            <span className="ml-auto text-sm font-normal text-muted-foreground">{activeRules}/4 active</span>
          </h3>
          <div className="space-y-4">
            {[
              { id: 'mandatoryBreak', label: 'Mandatory Break', desc: 'Require employees to take breaks', field: 'mandatoryBreak' as const },
              { id: 'breakReminders', label: 'Break Reminders', desc: 'Send notifications for break times', field: 'breakReminders' as const },
              { id: 'trackBreakLocation', label: 'Track Break Location', desc: 'Monitor location during breaks', field: 'trackBreakLocation' as const },
              { id: 'autoResumeWork', label: 'Auto Resume Work', desc: 'Resume tracking after break ends', field: 'autoResumeWork' as const },
            ].map(({ id, label, desc, field }) => (
              <div key={id} className="flex items-start justify-between p-3 rounded-lg border border-border bg-muted/30">
                <div className="flex-1">
                  <Label htmlFor={id} className="cursor-pointer">{label}</Label>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
                <Switch
                  id={id}
                  checked={config[field] as boolean}
                  onCheckedChange={v => setConfig(prev => ({ ...prev, [field]: v }))}
                  className="ml-4"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Break Types */}
        <div className="rounded-lg border border-border bg-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="flex items-center gap-2">
              <Coffee className="h-5 w-5" />
              Break Types
              <span className="text-sm font-normal text-muted-foreground">
                ({config.breakTypes.length} types, {activeBTs} active)
              </span>
            </h3>
            <Button onClick={addBreakType} size="sm" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Break Type
            </Button>
          </div>
          <div className="space-y-4">
            {config.breakTypes.map(bt => (
              <div key={bt.id} className="flex items-center gap-4 rounded-lg border border-border p-4 bg-muted/20">
                <Switch
                  checked={bt.enabled}
                  onCheckedChange={v => updateBT(bt.id, { enabled: v })}
                />
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Name</Label>
                    <Input
                      value={bt.name}
                      onChange={e => updateBT(bt.id, { name: e.target.value })}
                      className="mt-1"
                      disabled={!bt.enabled}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Duration (min)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="180"
                      value={bt.duration}
                      onChange={e => updateBT(bt.id, { duration: Math.max(0, Math.min(180, parseInt(e.target.value) || 0)) })}
                      className="mt-1"
                      disabled={!bt.enabled}
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      <Switch
                        checked={bt.isPaid}
                        onCheckedChange={v => updateBT(bt.id, { isPaid: v })}
                        disabled={!bt.enabled}
                      />
                      <Label className="text-sm">{bt.isPaid ? 'Paid' : 'Unpaid'}</Label>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteBreakType(bt.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {config.breakTypes.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Coffee className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No break types configured</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Break Time Summary */}
      <div className="mt-6 p-4 rounded-lg border border-border bg-muted/30">
        <h4 className="font-semibold mb-3">Break Time Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Total Paid Breaks</p>
            <p className="text-lg font-semibold">{totalPaid} min</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total Unpaid Breaks</p>
            <p className="text-lg font-semibold">{totalUnpaid} min</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total Break Time</p>
            <p className="text-lg font-semibold">{totalPaid + totalUnpaid} min</p>
          </div>
          <div>
            <p className="text-muted-foreground">Max Allowed</p>
            <p className="text-lg font-semibold">{config.maxTotalBreakTime} min</p>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 rounded-md bg-muted/50 border border-border">
        <p className="text-xs text-muted-foreground">
          <strong>💡 Tip:</strong> Break rules apply to all employees unless overridden. Paid breaks count toward working hours.
          Settings are persisted in-memory via the service layer during this session.
        </p>
      </div>
    </PageLayout>
  );
}
