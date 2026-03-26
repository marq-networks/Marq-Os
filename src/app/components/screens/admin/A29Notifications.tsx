import { PageLayout } from '../../shared/PageLayout';
import { Button } from '../../ui/button';
import { Switch } from '../../ui/switch';
import { Label } from '../../ui/label';
import { Bell, Save } from 'lucide-react';

export function A29Notifications() {
  return (
    <PageLayout
      title="ADMIN – A-29 – Notifications – v1.1"
      description="Configure notification settings and preferences"
      actions={
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      }
      kpis={[
        {
          title: 'Active Rules',
          value: '12',
          icon: <Bell className="h-5 w-5" />
        },
        {
          title: 'Sent Today',
          value: '156',
          change: 'Notifications',
          changeType: 'neutral',
          icon: <Bell className="h-5 w-5" />
        },
        {
          title: 'Email Open Rate',
          value: '68%',
          icon: <Bell className="h-5 w-5" />
        },
        {
          title: 'In-App Clicks',
          value: '89%',
          icon: <Bell className="h-5 w-5" />
        },
      ]}
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-6">System Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="newUsers">New User Registration</Label>
                <p className="text-sm text-muted-foreground">Notify when new users join</p>
              </div>
              <Switch id="newUsers" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="failedLogins">Failed Login Attempts</Label>
                <p className="text-sm text-muted-foreground">Alert on suspicious login activity</p>
              </div>
              <Switch id="failedLogins" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="systemUpdates">System Updates</Label>
                <p className="text-sm text-muted-foreground">Notify about platform updates</p>
              </div>
              <Switch id="systemUpdates" defaultChecked />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-6">Approval Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="leaveRequests">Leave Requests</Label>
                <p className="text-sm text-muted-foreground">Notify managers of new leave requests</p>
              </div>
              <Switch id="leaveRequests" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="timeCorrections">Time Corrections</Label>
                <p className="text-sm text-muted-foreground">Alert when corrections need approval</p>
              </div>
              <Switch id="timeCorrections" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="overtimeApproval">Overtime Approval</Label>
                <p className="text-sm text-muted-foreground">Notify when overtime requires approval</p>
              </div>
              <Switch id="overtimeApproval" defaultChecked />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-6">Team Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dailyDigest">Daily Digest</Label>
                <p className="text-sm text-muted-foreground">Send daily summary to managers</p>
              </div>
              <Switch id="dailyDigest" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="weeklyReport">Weekly Report</Label>
                <p className="text-sm text-muted-foreground">Send weekly performance reports</p>
              </div>
              <Switch id="weeklyReport" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="milestones">Milestone Achievements</Label>
                <p className="text-sm text-muted-foreground">Celebrate team achievements</p>
              </div>
              <Switch id="milestones" defaultChecked />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-6">Delivery Channels</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotif">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Send notifications via email</p>
              </div>
              <Switch id="emailNotif" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="inAppNotif">In-App Notifications</Label>
                <p className="text-sm text-muted-foreground">Show notifications in the app</p>
              </div>
              <Switch id="inAppNotif" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="slackNotif">Slack Integration</Label>
                <p className="text-sm text-muted-foreground">Send notifications to Slack</p>
              </div>
              <Switch id="slackNotif" />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
