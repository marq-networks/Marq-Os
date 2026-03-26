/**
 * E05 - Employee Leave
 * Wired to service layer: useTimeData() → leaveRequests (filtered to e1) + submitLeaveRequest + cancelLeave
 * Also: time.getLeaveBalances('e1') via useEffect
 */
import { useState, useEffect } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { DataTable } from '../../shared/DataTable';
import { StatusBadge, StatusType } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Umbrella, Plus, Calendar, CheckCircle, X, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useTimeData, useTimeService } from '../../../services';
import type { LeaveBalance, LeaveType } from '../../../services';

const CURRENT_EMPLOYEE_ID = 'e1';
const CURRENT_EMPLOYEE_NAME = 'Sarah Johnson';
const CURRENT_DEPARTMENT = 'Product';

export function E05Leave() {
  const { leaveRequests, submitLeaveRequest, cancelLeave, loading, refresh } = useTimeData();
  const timeService = useTimeService();

  // Filter to current employee
  const myLeave = leaveRequests.filter(lr => lr.employeeId === CURRENT_EMPLOYEE_ID);

  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Vacation' as LeaveType,
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Load leave balances from service
  useEffect(() => {
    timeService.getLeaveBalances(CURRENT_EMPLOYEE_ID).then(setLeaveBalances).catch(() => {});
  }, [timeService]);

  const vacationBalance = leaveBalances.find(b => b.type === 'Vacation');
  const sickBalance = leaveBalances.find(b => b.type === 'Sick Leave');

  const calculateDays = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const diffTime = new Date(end).getTime() - new Date(start).getTime();
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return days > 0 ? days : 0;
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.startDate) errors.startDate = 'Start date is required';
    if (!formData.endDate) errors.endDate = 'End date is required';
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        errors.endDate = 'End date must be after start date';
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(formData.startDate) < today) {
        errors.startDate = 'Start date cannot be in the past';
      }
    }
    if (!formData.reason || formData.reason.trim().length < 10) {
      errors.reason = 'Reason must be at least 10 characters';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitRequest = async () => {
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }
    const days = calculateDays(formData.startDate, formData.endDate);
    setIsSubmitting(true);
    try {
      await submitLeaveRequest({
        employeeId: CURRENT_EMPLOYEE_ID,
        employeeName: CURRENT_EMPLOYEE_NAME,
        department: CURRENT_DEPARTMENT,
        type: formData.type,
        startDate: formData.startDate,
        endDate: formData.endDate,
        days,
        reason: formData.reason,
      });
      toast.success(`${formData.type} request for ${days} day${days !== 1 ? 's' : ''} submitted!`);
      setShowRequestDialog(false);
      resetForm();
    } catch {
      toast.error('Failed to submit leave request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    const request = myLeave.find(r => r.id === requestId);
    if (!request) return;
    if (request.status !== 'Pending') {
      toast.error('Only pending requests can be cancelled');
      return;
    }
    try {
      await cancelLeave(requestId);
      toast.success('Leave request cancelled');
    } catch {
      toast.error('Failed to cancel request');
    }
  };

  const resetForm = () => {
    setFormData({ type: 'Vacation', startDate: '', endDate: '', reason: '' });
    setFormErrors({});
  };

  const columns = [
    { key: 'type', header: 'Type', width: '15%' },
    { key: 'startDate', header: 'Start Date', width: '12%' },
    { key: 'endDate', header: 'End Date', width: '12%' },
    { key: 'days', header: 'Days', width: '8%' },
    {
      key: 'status',
      header: 'Status',
      width: '12%',
      cell: (value: string) => {
        const type: StatusType = value === 'Approved' ? 'success' : value === 'Pending' ? 'warning' : 'danger';
        return <StatusBadge type={type}>{value}</StatusBadge>;
      },
    },
    { key: 'reason', header: 'Reason', width: '25%' },
    {
      key: 'submittedAt',
      header: 'Submitted',
      width: '10%',
      cell: (value: string) => value ? new Date(value).toLocaleDateString() : '—',
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '6%',
      cell: (_: any, row: any) =>
        row.status === 'Pending' ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCancelRequest(row.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-4 w-4" />
          </Button>
        ) : null,
    },
  ];

  const tableData = myLeave.map(lr => ({
    id: lr.id,
    type: lr.type,
    startDate: lr.startDate,
    endDate: lr.endDate,
    days: lr.days,
    status: lr.status,
    reason: lr.reason,
    submittedAt: lr.submittedAt,
    actions: null,
  }));

  const upcomingLeave = myLeave
    .filter(r => r.status === 'Approved' && new Date(r.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0];

  const pendingCount = myLeave.filter(r => r.status === 'Pending').length;
  const approvedCount = myLeave.filter(r => r.status === 'Approved').length;
  const usedDays = myLeave.filter(r => r.status === 'Approved').reduce((s, r) => s + r.days, 0);

  return (
    <PageLayout
      title="EMPLOYEE – E-05 – Leave – v3.0 [Service Layer ✓]"
      description="Manage your leave requests and balance — live data from Time service"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={refresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={() => { setShowRequestDialog(true); resetForm(); }}>
            <Plus className="mr-2 h-4 w-4" />
            Request Leave
          </Button>
        </div>
      }
      kpis={[
        {
          title: 'Annual Leave',
          value: vacationBalance ? `${vacationBalance.remaining} days` : '—',
          change: 'Remaining',
          changeType: (vacationBalance?.remaining ?? 10) > 5 ? 'positive' : 'warning',
          icon: <Umbrella className="h-5 w-5" />,
        },
        {
          title: 'Sick Leave',
          value: sickBalance ? `${sickBalance.remaining} days` : '—',
          change: 'Remaining',
          changeType: (sickBalance?.remaining ?? 5) > 3 ? 'positive' : 'warning',
          icon: <Calendar className="h-5 w-5" />,
        },
        {
          title: 'Used This Year',
          value: `${usedDays} days`,
          change: `${approvedCount} approved, ${pendingCount} pending`,
          changeType: 'neutral',
          icon: <Umbrella className="h-5 w-5" />,
        },
        {
          title: 'Next Leave',
          value: upcomingLeave
            ? new Date(upcomingLeave.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : 'None',
          change: upcomingLeave
            ? `${upcomingLeave.days} days ${upcomingLeave.type.toLowerCase()}`
            : 'No upcoming leave',
          changeType: upcomingLeave ? 'positive' : 'neutral',
          icon: <Calendar className="h-5 w-5" />,
        },
      ]}
    >
      <div className="space-y-6">
        {/* Request Leave Modal */}
        {showRequestDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowRequestDialog(false)}>
            <div
              className="bg-card rounded-lg shadow-lg w-full max-w-md p-6 m-4 max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Request Leave</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowRequestDialog(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="leaveType">Leave Type *</Label>
                  <select
                    id="leaveType"
                    value={formData.type}
                    onChange={e => setFormData(p => ({ ...p, type: e.target.value as LeaveType }))}
                    className="w-full mt-2 px-3 py-2 border border-border rounded-md bg-background"
                  >
                    <option value="Vacation">Vacation</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Personal">Personal</option>
                    <option value="Parental">Parental</option>
                    <option value="Bereavement">Bereavement</option>
                    <option value="Unpaid">Unpaid</option>
                  </select>
                  {formErrors.type && (
                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />{formErrors.type}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={e => setFormData(p => ({ ...p, startDate: e.target.value }))}
                    className="mt-2"
                  />
                  {formErrors.startDate && (
                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />{formErrors.startDate}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={e => setFormData(p => ({ ...p, endDate: e.target.value }))}
                    className="mt-2"
                  />
                  {formErrors.endDate && (
                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />{formErrors.endDate}
                    </p>
                  )}
                </div>

                {formData.startDate && formData.endDate && (
                  <div className="rounded-lg bg-blue-500/10 border border-blue-500/30 p-3">
                    <p className="text-sm font-medium">
                      Total Days: <span className="text-lg font-bold">{calculateDays(formData.startDate, formData.endDate)}</span>
                    </p>
                  </div>
                )}

                <div>
                  <Label htmlFor="reason">Reason *</Label>
                  <Textarea
                    id="reason"
                    value={formData.reason}
                    onChange={e => setFormData(p => ({ ...p, reason: e.target.value }))}
                    placeholder="Please provide a reason for your leave request..."
                    className="mt-2"
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground mt-1">{formData.reason.length} chars (min 10)</p>
                  {formErrors.reason && (
                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />{formErrors.reason}
                    </p>
                  )}
                </div>

                {/* Balance Info */}
                {leaveBalances.length > 0 && (
                  <div className="rounded-lg bg-muted/50 border border-border p-3">
                    <p className="text-sm font-semibold mb-2">Available Balance:</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {leaveBalances.map(b => (
                        <div key={b.type}>
                          <span className="text-muted-foreground">{b.type}:</span>
                          <span className="font-semibold ml-2">{b.remaining} days</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-6">
                <Button variant="outline" onClick={() => setShowRequestDialog(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSubmitRequest} disabled={isSubmitting} className="flex-1">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Submitting…' : 'Submit Request'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Leave Table */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-4 font-semibold">My Leave Requests ({myLeave.length})</h3>
          {loading ? (
            <div className="py-12 text-center text-muted-foreground">Loading leave requests…</div>
          ) : myLeave.length > 0 ? (
            <DataTable columns={columns} data={tableData} />
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Umbrella className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No leave requests yet</p>
              <p className="text-sm">Click "Request Leave" to submit your first leave request.</p>
            </div>
          )}
        </div>

        <div className="rounded-lg bg-muted/50 border border-border p-4">
          <p className="text-sm text-muted-foreground">
            <strong>💡 How it works:</strong> Submit leave requests via the button above. Your manager reviews
            them and approves/rejects. Cancel pending requests using the ✕ button. All data syncs via the service layer.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
