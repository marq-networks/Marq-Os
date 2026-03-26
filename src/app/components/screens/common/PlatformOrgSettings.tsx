import { useState, useEffect } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Switch } from '../../ui/switch';
import { Label } from '../../ui/label';
import {
  Building2, Globe, Bell, Palette, Clock, Save, Upload, Users,
} from 'lucide-react';

interface OrgSettings {
  orgName: string;
  domain: string;
  timezone: string;
  dateFormat: string;
  language: string;
  logo: string;
  primaryColor: string;
  // Notification preferences
  emailNotifications: boolean;
  slackNotifications: boolean;
  weeklyDigest: boolean;
  // Features
  timeTracking: boolean;
  screenshots: boolean;
  activityMonitoring: boolean;
  finesSystem: boolean;
}

const DEFAULT_SETTINGS: OrgSettings = {
  orgName: 'Acme Corp',
  domain: 'acme-corp',
  timezone: 'America/New_York',
  dateFormat: 'MM/DD/YYYY',
  language: 'en',
  logo: '',
  primaryColor: '#6366f1',
  emailNotifications: true,
  slackNotifications: false,
  weeklyDigest: true,
  timeTracking: true,
  screenshots: true,
  activityMonitoring: true,
  finesSystem: true,
};

export function PlatformOrgSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);

  const update = <K extends keyof OrgSettings>(key: K, value: OrgSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    setHasChanges(false);
    alert('Organization settings saved successfully.');
  };

  return (
    <PageLayout
      title="Organization Settings"
      description="Configure your organization's profile, preferences, and feature toggles"
      actions={
        <Button onClick={handleSave} disabled={!hasChanges}>
          <Save className="mr-2 h-4 w-4" />
          {hasChanges ? 'Save Changes' : 'Saved'}
        </Button>
      }
      kpis={[
        { title: 'Organization', value: settings.orgName, change: settings.domain, changeType: 'neutral', icon: <Building2 className="h-5 w-5" /> },
        { title: 'Timezone', value: settings.timezone.split('/')[1]?.replace('_', ' ') || settings.timezone, changeType: 'neutral', icon: <Clock className="h-5 w-5" /> },
        { title: 'Features On', value: [settings.timeTracking, settings.screenshots, settings.activityMonitoring, settings.finesSystem].filter(Boolean).length, change: 'of 4', changeType: 'positive', icon: <Users className="h-5 w-5" /> },
        { title: 'Language', value: 'English', changeType: 'neutral', icon: <Globe className="h-5 w-5" /> },
      ]}
    >
      <div className="space-y-6">
        {/* General Info */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5" /> General Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Organization Name</Label>
              <Input value={settings.orgName} onChange={e => update('orgName', e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label>Subdomain</Label>
              <div className="flex items-center gap-1 mt-1.5">
                <Input value={settings.domain} onChange={e => update('domain', e.target.value)} />
                <span className="text-sm text-muted-foreground whitespace-nowrap">.workos.app</span>
              </div>
            </div>
            <div>
              <Label>Logo</Label>
              <div className="mt-1.5 flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-medium">
                  {settings.orgName.substring(0, 2).toUpperCase()}
                </div>
                <Button variant="outline" size="sm">
                  <Upload className="h-3.5 w-3.5 mr-1.5" /> Upload
                </Button>
              </div>
            </div>
            <div>
              <Label>Brand Color</Label>
              <div className="flex items-center gap-2 mt-1.5">
                <input
                  type="color"
                  value={settings.primaryColor}
                  onChange={e => update('primaryColor', e.target.value)}
                  className="h-9 w-9 rounded border border-input cursor-pointer"
                />
                <Input value={settings.primaryColor} onChange={e => update('primaryColor', e.target.value)} className="flex-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Locale */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5" /> Locale & Regional
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Timezone</Label>
              <select
                value={settings.timezone}
                onChange={e => update('timezone', e.target.value)}
                className="w-full h-9 mt-1.5 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="America/New_York">Eastern (New York)</option>
                <option value="America/Chicago">Central (Chicago)</option>
                <option value="America/Denver">Mountain (Denver)</option>
                <option value="America/Los_Angeles">Pacific (Los Angeles)</option>
                <option value="Europe/London">GMT (London)</option>
                <option value="Europe/Berlin">CET (Berlin)</option>
                <option value="Asia/Tokyo">JST (Tokyo)</option>
              </select>
            </div>
            <div>
              <Label>Date Format</Label>
              <select
                value={settings.dateFormat}
                onChange={e => update('dateFormat', e.target.value)}
                className="w-full h-9 mt-1.5 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
            <div>
              <Label>Language</Label>
              <select
                value={settings.language}
                onChange={e => update('language', e.target.value)}
                className="w-full h-9 mt-1.5 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="ar">Arabic</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5" /> Notification Preferences
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-xs text-muted-foreground">Send notifications via email</p>
              </div>
              <Switch checked={settings.emailNotifications} onCheckedChange={v => update('emailNotifications', v)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Slack Integration</Label>
                <p className="text-xs text-muted-foreground">Post notifications to Slack</p>
              </div>
              <Switch checked={settings.slackNotifications} onCheckedChange={v => update('slackNotifications', v)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Weekly Digest</Label>
                <p className="text-xs text-muted-foreground">Send weekly summary email</p>
              </div>
              <Switch checked={settings.weeklyDigest} onCheckedChange={v => update('weeklyDigest', v)} />
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Palette className="h-5 w-5" /> Feature Toggles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'timeTracking' as const, label: 'Time Tracking', desc: 'Clock in/out and session management' },
              { key: 'screenshots' as const, label: 'Screenshot Monitoring', desc: 'Periodic screenshot capture' },
              { key: 'activityMonitoring' as const, label: 'Activity Monitoring', desc: 'Keystroke and mouse tracking' },
              { key: 'finesSystem' as const, label: 'Fines System', desc: 'Automated violation fines' },
            ].map(feature => (
              <div key={feature.key} className="flex items-center justify-between rounded-lg bg-muted/20 p-4">
                <div>
                  <Label>{feature.label}</Label>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </div>
                <Switch checked={settings[feature.key]} onCheckedChange={v => update(feature.key, v)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
