import { PageLayout } from '../../shared/PageLayout';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Switch } from '../../ui/switch';
import { Settings, Save, Building } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

export function A30Settings() {
  return (
    <PageLayout
      title="ADMIN – A-30 – Org Settings – v1.1"
      description="Organization settings and preferences"
      actions={
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      }
      kpis={[
        {
          title: 'Organization',
          value: 'Acme Corp',
          icon: <Building className="h-5 w-5" />
        },
        {
          title: 'Total Users',
          value: '52',
          icon: <Settings className="h-5 w-5" />
        },
        {
          title: 'Active Since',
          value: 'Jan 2024',
          icon: <Building className="h-5 w-5" />
        },
        {
          title: 'Subscription',
          value: 'Enterprise',
          icon: <Settings className="h-5 w-5" />
        },
      ]}
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-6">Organization Details</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="orgName">Organization Name</Label>
              <Input id="orgName" defaultValue="Acme Corp" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="orgEmail">Contact Email</Label>
              <Input id="orgEmail" type="email" defaultValue="admin@acme.com" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="orgPhone">Phone Number</Label>
              <Input id="orgPhone" defaultValue="+1 (555) 123-4567" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="orgAddress">Address</Label>
              <Textarea id="orgAddress" className="mt-1" rows={3} defaultValue="123 Business St, San Francisco, CA 94102" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-6">Regional Settings</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Select defaultValue="pst">
                <SelectTrigger id="timezone" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                  <SelectItem value="mst">Mountain Time (MT)</SelectItem>
                  <SelectItem value="cst">Central Time (CT)</SelectItem>
                  <SelectItem value="est">Eastern Time (ET)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dateFormat">Date Format</Label>
              <Select defaultValue="mdy">
                <SelectTrigger id="dateFormat" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                  <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                  <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select defaultValue="usd">
                <SelectTrigger id="currency" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD ($)</SelectItem>
                  <SelectItem value="eur">EUR (€)</SelectItem>
                  <SelectItem value="gbp">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="language">Language</Label>
              <Select defaultValue="en">
                <SelectTrigger id="language" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-6">Features</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableScreenshots">Screenshot Capture</Label>
                <p className="text-sm text-muted-foreground">Enable screenshot monitoring</p>
              </div>
              <Switch id="enableScreenshots" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableGPS">GPS Tracking</Label>
                <p className="text-sm text-muted-foreground">Track employee location</p>
              </div>
              <Switch id="enableGPS" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableMobile">Mobile App Access</Label>
                <p className="text-sm text-muted-foreground">Allow mobile app usage</p>
              </div>
              <Switch id="enableMobile" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableAPI">API Access</Label>
                <p className="text-sm text-muted-foreground">Enable API integrations</p>
              </div>
              <Switch id="enableAPI" defaultChecked />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
