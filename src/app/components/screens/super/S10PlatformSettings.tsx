import { useState, useEffect } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Switch } from '../../ui/switch';
import { Settings, Save, X, RotateCcw, AlertCircle, CheckCircle, Globe, Server, Mail, Shield, Bell, Palette } from 'lucide-react';
import { toast } from 'sonner';

const STORAGE_KEY = 'workos_platform_settings';

interface PlatformSettings {
  // General Settings
  platformName: string;
  platformUrl: string;
  supportEmail: string;
  contactEmail: string;
  
  // Server Settings
  apiVersion: string;
  maxRequestSize: number;
  rateLimitPerMinute: number;
  enableCORS: boolean;
  
  // Email Settings
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  emailFromName: string;
  emailFromAddress: string;
  enableEmailNotifications: boolean;
  
  // Security Settings
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordMinLength: number;
  requireMFA: boolean;
  enableIPWhitelist: boolean;
  
  // Feature Flags
  enableBetaFeatures: boolean;
  enableAnalytics: boolean;
  enableAutomation: boolean;
  maintenanceMode: boolean;
  
  // Notification Settings
  enableSlackIntegration: boolean;
  enableWebhooks: boolean;
  enableEmailAlerts: boolean;
  
  // Appearance
  primaryColor: string;
  logoUrl: string;
  faviconUrl: string;
  
  // Advanced
  debugMode: boolean;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
  cacheDuration: number;
  
  // Metadata
  lastUpdated: string;
}

const INITIAL_SETTINGS: PlatformSettings = {
  // General
  platformName: 'WorkOS Platform',
  platformUrl: 'https://workos.example.com',
  supportEmail: 'support@workos.com',
  contactEmail: 'contact@workos.com',
  
  // Server
  apiVersion: 'v2.0',
  maxRequestSize: 10,
  rateLimitPerMinute: 100,
  enableCORS: true,
  
  // Email
  smtpHost: 'smtp.workos.com',
  smtpPort: '587',
  smtpUser: 'noreply@workos.com',
  emailFromName: 'WorkOS Platform',
  emailFromAddress: 'noreply@workos.com',
  enableEmailNotifications: true,
  
  // Security
  sessionTimeout: 60,
  maxLoginAttempts: 5,
  passwordMinLength: 12,
  requireMFA: true,
  enableIPWhitelist: false,
  
  // Feature Flags
  enableBetaFeatures: false,
  enableAnalytics: true,
  enableAutomation: true,
  maintenanceMode: false,
  
  // Notifications
  enableSlackIntegration: true,
  enableWebhooks: true,
  enableEmailAlerts: true,
  
  // Appearance
  primaryColor: '#3B82F6',
  logoUrl: '/logo.png',
  faviconUrl: '/favicon.ico',
  
  // Advanced
  debugMode: false,
  logLevel: 'info',
  cacheDuration: 3600,
  
  lastUpdated: '2025-12-15',
};

export function S10PlatformSettings() {
  const [settings, setSettings] = useState<PlatformSettings>(INITIAL_SETTINGS);
  const [originalSettings, setOriginalSettings] = useState<PlatformSettings>(INITIAL_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'server' | 'email' | 'security' | 'features' | 'appearance' | 'advanced'>('general');

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings(parsed);
        setOriginalSettings(parsed);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }, []);

  // Check for changes whenever settings change
  useEffect(() => {
    const changed = JSON.stringify(settings) !== JSON.stringify(originalSettings);
    setHasChanges(changed);
  }, [settings, originalSettings]);

  const validateSettings = (): boolean => {
    // General validation
    if (!settings.platformName.trim()) {
      toast.error('Platform name is required');
      return false;
    }

    if (!settings.platformUrl.trim() || !settings.platformUrl.startsWith('http')) {
      toast.error('Valid platform URL is required (must start with http:// or https://)');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(settings.supportEmail)) {
      toast.error('Valid support email is required');
      return false;
    }

    if (!emailRegex.test(settings.contactEmail)) {
      toast.error('Valid contact email is required');
      return false;
    }

    // Server validation
    if (settings.maxRequestSize < 1 || settings.maxRequestSize > 100) {
      toast.error('Max request size must be between 1 and 100 MB');
      return false;
    }

    if (settings.rateLimitPerMinute < 10 || settings.rateLimitPerMinute > 10000) {
      toast.error('Rate limit must be between 10 and 10,000 requests per minute');
      return false;
    }

    // Security validation
    if (settings.sessionTimeout < 5 || settings.sessionTimeout > 1440) {
      toast.error('Session timeout must be between 5 and 1440 minutes');
      return false;
    }

    if (settings.maxLoginAttempts < 3 || settings.maxLoginAttempts > 10) {
      toast.error('Max login attempts must be between 3 and 10');
      return false;
    }

    if (settings.passwordMinLength < 8 || settings.passwordMinLength > 32) {
      toast.error('Password minimum length must be between 8 and 32 characters');
      return false;
    }

    return true;
  };

  const handleSaveChanges = () => {
    if (!hasChanges) {
      toast.info('No changes to save');
      return;
    }

    if (!validateSettings()) {
      return;
    }

    try {
      const updatedSettings = {
        ...settings,
        lastUpdated: new Date().toISOString().split('T')[0],
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings));
      setSettings(updatedSettings);
      setOriginalSettings(updatedSettings);
      setHasChanges(false);

      toast.success('Platform settings saved successfully!', {
        description: 'All changes have been applied to the platform.',
        icon: <CheckCircle className="h-4 w-4" />,
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings', {
        description: 'Please try again.',
      });
    }
  };

  const handleDiscardChanges = () => {
    if (!hasChanges) {
      toast.info('No changes to discard');
      return;
    }

    if (window.confirm('Discard all unsaved changes?')) {
      setSettings(originalSettings);
      toast.success('Changes discarded');
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Reset all platform settings to default values? This cannot be undone.')) {
      setSettings(INITIAL_SETTINGS);
      setOriginalSettings(INITIAL_SETTINGS);
      localStorage.removeItem(STORAGE_KEY);
      
      toast.success('Settings reset to defaults');
    }
  };

  const updateSetting = <K extends keyof PlatformSettings>(key: K, value: PlatformSettings[K]) => {
    setSettings({ ...settings, [key]: value });
  };

  const tabs = [
    { id: 'general' as const, label: 'General', icon: Globe },
    { id: 'server' as const, label: 'Server', icon: Server },
    { id: 'email' as const, label: 'Email', icon: Mail },
    { id: 'security' as const, label: 'Security', icon: Shield },
    { id: 'features' as const, label: 'Features', icon: Settings },
    { id: 'appearance' as const, label: 'Appearance', icon: Palette },
    { id: 'advanced' as const, label: 'Advanced', icon: Settings },
  ];

  return (
    <PageLayout
      title="SUPER – S-10 – Platform Settings – v2.0"
      description="Configure platform-wide settings and preferences"
      actions={
        <div className="flex items-center gap-2">
          {hasChanges && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDiscardChanges}
            >
              <X className="mr-2 h-4 w-4" />
              Discard Changes
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleResetToDefaults}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset to Defaults
          </Button>
          <Button
            onClick={handleSaveChanges}
            disabled={!hasChanges}
            className={hasChanges ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
            {hasChanges && ' *'}
          </Button>
        </div>
      }
      kpis={[
        {
          title: 'Configuration Status',
          value: hasChanges ? 'Modified' : 'Saved',
          change: hasChanges ? 'Unsaved changes' : 'Up to date',
          changeType: hasChanges ? 'warning' : 'positive',
          icon: <Settings className="h-5 w-5" />
        },
        {
          title: 'Active Features',
          value: [
            settings.enableBetaFeatures,
            settings.enableAnalytics,
            settings.enableAutomation,
          ].filter(Boolean).length.toString(),
          change: 'of 3 enabled',
          changeType: 'neutral',
          icon: <Settings className="h-5 w-5" />
        },
        {
          title: 'Security Level',
          value: settings.requireMFA ? 'High' : 'Medium',
          change: settings.requireMFA ? 'MFA enabled' : 'MFA disabled',
          changeType: settings.requireMFA ? 'positive' : 'warning',
          icon: <Shield className="h-5 w-5" />
        },
        {
          title: 'Last Updated',
          value: new Date(settings.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          change: hasChanges ? 'Unsaved' : 'Saved',
          changeType: hasChanges ? 'warning' : 'positive',
          icon: <Settings className="h-5 w-5" />
        },
      ]}
    >
      <div className="space-y-6">
        {/* Change Indicator */}
        {hasChanges && (
          <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/30 p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                You have unsaved changes. Click "Save Changes" to apply these settings across the platform.
              </p>
            </div>
          </div>
        )}

        {/* Maintenance Mode Warning */}
        {settings.maintenanceMode && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-sm font-medium text-red-900 dark:text-red-100">
                ⚠️ Maintenance Mode is ENABLED - The platform is currently inaccessible to all organizations!
              </p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-6 font-semibold">General Platform Settings</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="platformName">Platform Name *</Label>
                  <Input
                    id="platformName"
                    value={settings.platformName}
                    onChange={(e) => updateSetting('platformName', e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="platformUrl">Platform URL *</Label>
                  <Input
                    id="platformUrl"
                    type="url"
                    value={settings.platformUrl}
                    onChange={(e) => updateSetting('platformUrl', e.target.value)}
                    placeholder="https://workos.example.com"
                    className="mt-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="supportEmail">Support Email *</Label>
                    <Input
                      id="supportEmail"
                      type="email"
                      value={settings.supportEmail}
                      onChange={(e) => updateSetting('supportEmail', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactEmail">Contact Email *</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => updateSetting('contactEmail', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Server Settings */}
        {activeTab === 'server' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-6 font-semibold">Server Configuration</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="apiVersion">API Version</Label>
                  <Input
                    id="apiVersion"
                    value={settings.apiVersion}
                    onChange={(e) => updateSetting('apiVersion', e.target.value)}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Current API version identifier</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="maxRequestSize">Max Request Size (MB)</Label>
                    <Input
                      id="maxRequestSize"
                      type="number"
                      min="1"
                      max="100"
                      value={settings.maxRequestSize}
                      onChange={(e) => updateSetting('maxRequestSize', parseInt(e.target.value) || 1)}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Range: 1-100 MB</p>
                  </div>
                  <div>
                    <Label htmlFor="rateLimitPerMinute">Rate Limit (req/min)</Label>
                    <Input
                      id="rateLimitPerMinute"
                      type="number"
                      min="10"
                      max="10000"
                      value={settings.rateLimitPerMinute}
                      onChange={(e) => updateSetting('rateLimitPerMinute', parseInt(e.target.value) || 10)}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Range: 10-10,000 requests</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                  <div>
                    <Label htmlFor="enableCORS">Enable CORS</Label>
                    <p className="text-sm text-muted-foreground">Allow cross-origin requests</p>
                  </div>
                  <Switch
                    id="enableCORS"
                    checked={settings.enableCORS}
                    onCheckedChange={(checked) => updateSetting('enableCORS', checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Email Settings */}
        {activeTab === 'email' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-6 font-semibold">Email Configuration</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      value={settings.smtpHost}
                      onChange={(e) => updateSetting('smtpHost', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      value={settings.smtpPort}
                      onChange={(e) => updateSetting('smtpPort', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="smtpUser">SMTP Username</Label>
                  <Input
                    id="smtpUser"
                    value={settings.smtpUser}
                    onChange={(e) => updateSetting('smtpUser', e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emailFromName">From Name</Label>
                    <Input
                      id="emailFromName"
                      value={settings.emailFromName}
                      onChange={(e) => updateSetting('emailFromName', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emailFromAddress">From Email Address</Label>
                    <Input
                      id="emailFromAddress"
                      type="email"
                      value={settings.emailFromAddress}
                      onChange={(e) => updateSetting('emailFromAddress', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                  <div>
                    <Label htmlFor="enableEmailNotifications">Enable Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send automated emails to users</p>
                  </div>
                  <Switch
                    id="enableEmailNotifications"
                    checked={settings.enableEmailNotifications}
                    onCheckedChange={(checked) => updateSetting('enableEmailNotifications', checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-6 font-semibold">Security Configuration</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="sessionTimeout">Session Timeout (min)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      min="5"
                      max="1440"
                      value={settings.sessionTimeout}
                      onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value) || 5)}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Range: 5-1440 min</p>
                  </div>
                  <div>
                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      min="3"
                      max="10"
                      value={settings.maxLoginAttempts}
                      onChange={(e) => updateSetting('maxLoginAttempts', parseInt(e.target.value) || 3)}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Range: 3-10 attempts</p>
                  </div>
                  <div>
                    <Label htmlFor="passwordMinLength">Min Password Length</Label>
                    <Input
                      id="passwordMinLength"
                      type="number"
                      min="8"
                      max="32"
                      value={settings.passwordMinLength}
                      onChange={(e) => updateSetting('passwordMinLength', parseInt(e.target.value) || 8)}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Range: 8-32 chars</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                  <div>
                    <Label htmlFor="requireMFA">Require Multi-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Force MFA for all platform admins</p>
                  </div>
                  <Switch
                    id="requireMFA"
                    checked={settings.requireMFA}
                    onCheckedChange={(checked) => updateSetting('requireMFA', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                  <div>
                    <Label htmlFor="enableIPWhitelist">Enable IP Whitelist</Label>
                    <p className="text-sm text-muted-foreground">Restrict access to whitelisted IP addresses</p>
                  </div>
                  <Switch
                    id="enableIPWhitelist"
                    checked={settings.enableIPWhitelist}
                    onCheckedChange={(checked) => updateSetting('enableIPWhitelist', checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feature Flags */}
        {activeTab === 'features' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-6 font-semibold">Feature Flags</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                  <div>
                    <Label htmlFor="enableBetaFeatures">Enable Beta Features</Label>
                    <p className="text-sm text-muted-foreground">Allow organizations to access beta features</p>
                  </div>
                  <Switch
                    id="enableBetaFeatures"
                    checked={settings.enableBetaFeatures}
                    onCheckedChange={(checked) => updateSetting('enableBetaFeatures', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                  <div>
                    <Label htmlFor="enableAnalytics">Enable Analytics</Label>
                    <p className="text-sm text-muted-foreground">Track platform usage and analytics</p>
                  </div>
                  <Switch
                    id="enableAnalytics"
                    checked={settings.enableAnalytics}
                    onCheckedChange={(checked) => updateSetting('enableAnalytics', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                  <div>
                    <Label htmlFor="enableAutomation">Enable Automation</Label>
                    <p className="text-sm text-muted-foreground">Allow automated workflows and integrations</p>
                  </div>
                  <Switch
                    id="enableAutomation"
                    checked={settings.enableAutomation}
                    onCheckedChange={(checked) => updateSetting('enableAutomation', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-red-500/30 bg-red-500/10">
                  <div>
                    <Label htmlFor="maintenanceMode" className="text-red-600">⚠️ Maintenance Mode</Label>
                    <p className="text-sm text-red-600 font-medium">DISABLES platform access for all organizations!</p>
                  </div>
                  <Switch
                    id="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        if (window.confirm('Enable Maintenance Mode? This will make the platform inaccessible to ALL organizations!')) {
                          updateSetting('maintenanceMode', checked);
                        }
                      } else {
                        updateSetting('maintenanceMode', checked);
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-6 font-semibold">Integration Settings</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                  <div>
                    <Label htmlFor="enableSlackIntegration">Enable Slack Integration</Label>
                    <p className="text-sm text-muted-foreground">Allow organizations to connect Slack</p>
                  </div>
                  <Switch
                    id="enableSlackIntegration"
                    checked={settings.enableSlackIntegration}
                    onCheckedChange={(checked) => updateSetting('enableSlackIntegration', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                  <div>
                    <Label htmlFor="enableWebhooks">Enable Webhooks</Label>
                    <p className="text-sm text-muted-foreground">Allow webhook event subscriptions</p>
                  </div>
                  <Switch
                    id="enableWebhooks"
                    checked={settings.enableWebhooks}
                    onCheckedChange={(checked) => updateSetting('enableWebhooks', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                  <div>
                    <Label htmlFor="enableEmailAlerts">Enable Email Alerts</Label>
                    <p className="text-sm text-muted-foreground">Send platform alerts via email</p>
                  </div>
                  <Switch
                    id="enableEmailAlerts"
                    checked={settings.enableEmailAlerts}
                    onCheckedChange={(checked) => updateSetting('enableEmailAlerts', checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Appearance Settings */}
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-6 font-semibold">Platform Appearance</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-4 items-center mt-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => updateSetting('primaryColor', e.target.value)}
                      className="w-24 h-10"
                    />
                    <Input
                      type="text"
                      value={settings.primaryColor}
                      onChange={(e) => updateSetting('primaryColor', e.target.value)}
                      placeholder="#3B82F6"
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Primary brand color for the platform</p>
                </div>
                <div>
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <Input
                    id="logoUrl"
                    type="url"
                    value={settings.logoUrl}
                    onChange={(e) => updateSetting('logoUrl', e.target.value)}
                    placeholder="/logo.png"
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Path or URL to platform logo</p>
                </div>
                <div>
                  <Label htmlFor="faviconUrl">Favicon URL</Label>
                  <Input
                    id="faviconUrl"
                    type="url"
                    value={settings.faviconUrl}
                    onChange={(e) => updateSetting('faviconUrl', e.target.value)}
                    placeholder="/favicon.ico"
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Path or URL to platform favicon</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Settings */}
        {activeTab === 'advanced' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-6 font-semibold">Advanced Configuration</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                  <div>
                    <Label htmlFor="debugMode">Debug Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable verbose logging and debugging</p>
                  </div>
                  <Switch
                    id="debugMode"
                    checked={settings.debugMode}
                    onCheckedChange={(checked) => updateSetting('debugMode', checked)}
                  />
                </div>
                <div>
                  <Label htmlFor="logLevel">Log Level</Label>
                  <select
                    id="logLevel"
                    value={settings.logLevel}
                    onChange={(e) => updateSetting('logLevel', e.target.value as any)}
                    className="w-full mt-2 px-3 py-2 border border-border rounded-md bg-background"
                  >
                    <option value="error">Error (minimal)</option>
                    <option value="warn">Warning</option>
                    <option value="info">Info (recommended)</option>
                    <option value="debug">Debug (verbose)</option>
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">Controls logging verbosity</p>
                </div>
                <div>
                  <Label htmlFor="cacheDuration">Cache Duration (seconds)</Label>
                  <Input
                    id="cacheDuration"
                    type="number"
                    min="60"
                    max="86400"
                    value={settings.cacheDuration}
                    onChange={(e) => updateSetting('cacheDuration', parseInt(e.target.value) || 60)}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Range: 60-86400 seconds (1 min - 24 hours)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="rounded-lg bg-muted/50 border border-border p-4">
          <p className="text-sm text-muted-foreground">
            <strong>💡 How it works:</strong> Configure platform-wide settings using the tabs above. 
            Changes are highlighted with a yellow banner. Click "Save Changes" to apply updates. 
            The "Discard Changes" button reverts to the last saved state, and "Reset to Defaults" restores original values. 
            Maintenance Mode will disable platform access for all organizations. All data is saved locally in this demo.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
