import { useState } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { Switch } from '../../ui/switch';
import { Label } from '../../ui/label';
import {
  Shield, Lock, Key, Fingerprint, Globe, AlertTriangle, CheckCircle2,
  Eye, Monitor, Wifi, Save,
} from 'lucide-react';

interface SecuritySetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  icon: typeof Shield;
  category: string;
}

const DEFAULT_SETTINGS: SecuritySetting[] = [
  { id: 's1', label: 'Two-Factor Authentication', description: 'Require 2FA for all user accounts', enabled: true, icon: Key, category: 'Authentication' },
  { id: 's2', label: 'Single Sign-On (SSO)', description: 'Enable SAML/OIDC SSO integration', enabled: true, icon: Fingerprint, category: 'Authentication' },
  { id: 's3', label: 'Password Policy Enforcement', description: 'Min 12 chars, uppercase, number, special character', enabled: true, icon: Lock, category: 'Authentication' },
  { id: 's4', label: 'Session Timeout', description: 'Auto-logout after 30 minutes of inactivity', enabled: true, icon: Monitor, category: 'Session' },
  { id: 's5', label: 'IP Whitelisting', description: 'Restrict access to approved IP ranges', enabled: false, icon: Globe, category: 'Network' },
  { id: 's6', label: 'VPN Required', description: 'Require VPN connection for remote access', enabled: false, icon: Wifi, category: 'Network' },
  { id: 's7', label: 'Data Encryption at Rest', description: 'AES-256 encryption for stored data', enabled: true, icon: Shield, category: 'Data Protection' },
  { id: 's8', label: 'TLS 1.3 Enforcement', description: 'Require TLS 1.3 for all connections', enabled: true, icon: Lock, category: 'Data Protection' },
  { id: 's9', label: 'Activity Monitoring', description: 'Log all user actions and API calls', enabled: true, icon: Eye, category: 'Monitoring' },
  { id: 's10', label: 'Anomaly Detection', description: 'AI-powered detection of unusual patterns', enabled: true, icon: AlertTriangle, category: 'Monitoring' },
];

const CATEGORIES = [...new Set(DEFAULT_SETTINGS.map(s => s.category))];

// Simulated threat log
const RECENT_THREATS = [
  { id: 't1', type: 'Failed Login', severity: 'low', description: '3 failed attempts from 192.168.1.45', time: '10 min ago', user: 'unknown' },
  { id: 't2', type: 'Unusual Access', severity: 'medium', description: 'Login from new location (São Paulo, BR)', time: '2 hours ago', user: 'david.k@company.com' },
  { id: 't3', type: 'Rate Limit', severity: 'low', description: 'API rate limit exceeded', time: '5 hours ago', user: 'api-service-account' },
];

export function SecuritySecurity() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);

  const toggle = (id: string) => {
    setSettings(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
    setHasChanges(true);
  };

  const handleSave = () => {
    setHasChanges(false);
    alert('Security settings saved successfully.');
  };

  const enabledCount = settings.filter(s => s.enabled).length;
  const securityScore = Math.round((enabledCount / settings.length) * 100);

  return (
    <PageLayout
      title="Security Settings"
      description="Configure authentication, encryption, network controls, and threat monitoring"
      actions={
        <Button onClick={handleSave} disabled={!hasChanges}>
          <Save className="mr-2 h-4 w-4" />
          {hasChanges ? 'Save Changes' : 'Saved'}
        </Button>
      }
      kpis={[
        { title: 'Security Score', value: `${securityScore}%`, change: `${enabledCount}/${settings.length} enabled`, changeType: securityScore >= 80 ? 'positive' : 'warning', icon: <Shield className="h-5 w-5" /> },
        { title: 'Auth Controls', value: settings.filter(s => s.category === 'Authentication' && s.enabled).length, change: 'of 3 enabled', changeType: 'positive', icon: <Key className="h-5 w-5" /> },
        { title: 'Recent Threats', value: RECENT_THREATS.length, change: 'Last 24 hours', changeType: RECENT_THREATS.length > 0 ? 'warning' : 'positive', icon: <AlertTriangle className="h-5 w-5" /> },
        { title: 'Encryption', value: settings.filter(s => s.category === 'Data Protection' && s.enabled).length === 2 ? 'Full' : 'Partial', changeType: 'positive', icon: <Lock className="h-5 w-5" /> },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {CATEGORIES.map(category => (
            <div key={category} className="rounded-lg border border-border bg-card p-6">
              <h3 className="font-medium mb-4">{category}</h3>
              <div className="space-y-4">
                {settings.filter(s => s.category === category).map(setting => {
                  const Icon = setting.icon;
                  return (
                    <div key={setting.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                          setting.enabled ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground'
                        }`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <Label htmlFor={setting.id} className="cursor-pointer">{setting.label}</Label>
                          <p className="text-xs text-muted-foreground">{setting.description}</p>
                        </div>
                      </div>
                      <Switch
                        id={setting.id}
                        checked={setting.enabled}
                        onCheckedChange={() => toggle(setting.id)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Threat sidebar */}
        <div className="space-y-4">
          {/* Score card */}
          <div className="rounded-lg border border-border bg-card p-6 text-center">
            <div className={`inline-flex items-center justify-center h-20 w-20 rounded-full border-4 ${
              securityScore >= 80 ? 'border-green-500 text-green-600' : 'border-yellow-500 text-yellow-600'
            }`}>
              <span className="text-2xl font-medium">{securityScore}%</span>
            </div>
            <p className="text-sm text-muted-foreground mt-3">Security Score</p>
            <p className="text-xs text-muted-foreground mt-1">{enabledCount} of {settings.length} controls enabled</p>
          </div>

          {/* Recent Threats */}
          <div className="rounded-lg border border-border bg-card">
            <div className="p-4 border-b border-border">
              <h3 className="font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                Recent Threats
              </h3>
            </div>
            <div className="divide-y divide-border">
              {RECENT_THREATS.map(threat => (
                <div key={threat.id} className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{threat.type}</span>
                    <StatusBadge type={
                      threat.severity === 'high' ? 'danger' :
                      threat.severity === 'medium' ? 'warning' : 'neutral'
                    }>
                      {threat.severity}
                    </StatusBadge>
                  </div>
                  <p className="text-xs text-muted-foreground">{threat.description}</p>
                  <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                    <span>{threat.user}</span>
                    <span>{threat.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-medium mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Lock className="h-3.5 w-3.5 mr-2" /> Force Password Reset (All)
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Monitor className="h-3.5 w-3.5 mr-2" /> Revoke All Sessions
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Shield className="h-3.5 w-3.5 mr-2" /> Run Security Audit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
