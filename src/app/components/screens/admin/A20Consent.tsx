import { useState, useEffect } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { Button } from '../../ui/button';
import { Switch } from '../../ui/switch';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Shield, Save, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthService } from '../../../services';

const STORAGE_KEY = 'workos_consent_privacy_settings';

interface ConsentSettings {
  // Tracking Consent
  timeTracking: boolean;
  activityMonitoring: boolean;
  screenshots: boolean;
  locationTracking: boolean;
  
  // Privacy Settings
  dataExport: boolean;
  dataDeletion: boolean;
  anonymizeData: boolean;
  
  // Consent Notice
  consentText: string;
}

const DEFAULT_SETTINGS: ConsentSettings = {
  timeTracking: true,
  activityMonitoring: true,
  screenshots: false,
  locationTracking: false,
  dataExport: true,
  dataDeletion: true,
  anonymizeData: true,
  consentText: "By using this workforce management system, you consent to the collection and processing of your work-related data including time logs, activity monitoring, and performance metrics. This data is used solely for operational purposes and is protected according to our privacy policy and applicable data protection regulations."
};

export function A20Consent() {
  const [settings, setSettings] = useState<ConsentSettings>(DEFAULT_SETTINGS);
  const [originalSettings, setOriginalSettings] = useState<ConsentSettings>(DEFAULT_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
      console.error('Failed to load consent settings:', error);
      toast.error('Failed to load settings');
    }
  }, []);

  // Check for changes whenever settings change
  useEffect(() => {
    const changed = JSON.stringify(settings) !== JSON.stringify(originalSettings);
    setHasChanges(changed);
  }, [settings, originalSettings]);

  const handleSaveChanges = () => {
    setIsSaving(true);
    
    // Simulate save delay
    setTimeout(() => {
      try {
        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        
        // Update original settings to match current
        setOriginalSettings(settings);
        setHasChanges(false);
        
        // Show success message
        toast.success('Consent & Privacy settings saved successfully!', {
          description: 'All changes have been applied.',
          icon: <CheckCircle className="h-4 w-4" />,
        });
        
        setIsSaving(false);
      } catch (error) {
        console.error('Failed to save settings:', error);
        toast.error('Failed to save settings', {
          description: 'Please try again.',
        });
        setIsSaving(false);
      }
    }, 500);
  };

  const handleDiscardChanges = () => {
    setSettings(originalSettings);
    setHasChanges(false);
    toast.info('Changes discarded', {
      description: 'All unsaved changes have been reverted.',
    });
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
      setSettings(DEFAULT_SETTINGS);
      toast.info('Settings reset to defaults', {
        description: 'Click "Save Changes" to apply.',
      });
    }
  };

  // Calculate KPIs based on current settings
  const enabledTrackingCount = [
    settings.timeTracking,
    settings.activityMonitoring,
    settings.screenshots,
    settings.locationTracking
  ].filter(Boolean).length;

  const consentRate = Math.round((enabledTrackingCount / 4) * 100);
  const pendingConsent = 4 - enabledTrackingCount;

  return (
    <PageLayout
      title="ADMIN – A-20 – Consent & Privacy – v1.1"
      description="Manage consent policies and privacy settings"
      actions={
        <div className="flex items-center gap-2">
          {hasChanges && (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDiscardChanges}
              >
                Discard Changes
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleResetToDefaults}
              >
                Reset to Defaults
              </Button>
            </>
          )}
          <Button 
            onClick={handleSaveChanges}
            disabled={!hasChanges || isSaving}
            className={hasChanges ? 'animate-pulse' : ''}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      }
      kpis={[
        {
          title: 'Consent Rate',
          value: `${consentRate}%`,
          change: 'Tracking features enabled',
          changeType: consentRate >= 75 ? 'positive' : 'warning',
          icon: <Shield className="h-5 w-5" />
        },
        {
          title: 'Pending',
          value: pendingConsent.toString(),
          change: 'Features disabled',
          changeType: pendingConsent > 0 ? 'warning' : 'positive',
          icon: <FileText className="h-5 w-5" />
        },
        {
          title: 'Policy Version',
          value: 'v2.4',
          change: 'Updated Dec 2025',
          changeType: 'neutral',
          icon: <Shield className="h-5 w-5" />
        },
        {
          title: 'Compliance',
          value: settings.dataExport && settings.dataDeletion ? '100%' : '75%',
          change: settings.dataExport && settings.dataDeletion ? 'GDPR compliant' : 'Partial compliance',
          changeType: settings.dataExport && settings.dataDeletion ? 'positive' : 'warning',
          icon: <Shield className="h-5 w-5" />
        },
      ]}
    >
      <div className="space-y-6">
        {/* Unsaved Changes Warning */}
        {hasChanges && (
          <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/30 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-yellow-600 mb-1">Unsaved Changes</h4>
                <p className="text-sm text-muted-foreground">
                  You have unsaved changes. Click "Save Changes" to apply them, or "Discard Changes" to revert.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tracking Consent */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-6 font-semibold">Tracking Consent</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="timeTracking">Time Tracking</Label>
                <p className="text-sm text-muted-foreground">Track employee working hours and attendance</p>
              </div>
              <Switch 
                id="timeTracking" 
                checked={settings.timeTracking}
                onCheckedChange={(checked) => setSettings({ ...settings, timeTracking: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="activityMonitoring">Activity Monitoring</Label>
                <p className="text-sm text-muted-foreground">Monitor application usage and activity levels</p>
              </div>
              <Switch 
                id="activityMonitoring" 
                checked={settings.activityMonitoring}
                onCheckedChange={(checked) => setSettings({ ...settings, activityMonitoring: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="screenshots">Screenshot Capture</Label>
                <p className="text-sm text-muted-foreground">Take periodic screenshots during work hours</p>
              </div>
              <Switch 
                id="screenshots" 
                checked={settings.screenshots}
                onCheckedChange={(checked) => setSettings({ ...settings, screenshots: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="locationTracking">Location Tracking</Label>
                <p className="text-sm text-muted-foreground">Track employee location for clock in/out</p>
              </div>
              <Switch 
                id="locationTracking" 
                checked={settings.locationTracking}
                onCheckedChange={(checked) => setSettings({ ...settings, locationTracking: checked })}
              />
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-6 font-semibold">Privacy Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="dataExport">Employee Data Export</Label>
                <p className="text-sm text-muted-foreground">Allow employees to export their data</p>
              </div>
              <Switch 
                id="dataExport" 
                checked={settings.dataExport}
                onCheckedChange={(checked) => setSettings({ ...settings, dataExport: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="dataDeletion">Data Deletion Requests</Label>
                <p className="text-sm text-muted-foreground">Allow employees to request data deletion</p>
              </div>
              <Switch 
                id="dataDeletion" 
                checked={settings.dataDeletion}
                onCheckedChange={(checked) => setSettings({ ...settings, dataDeletion: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="anonymizeData">Anonymize Archived Data</Label>
                <p className="text-sm text-muted-foreground">Remove personal identifiers from old data</p>
              </div>
              <Switch 
                id="anonymizeData" 
                checked={settings.anonymizeData}
                onCheckedChange={(checked) => setSettings({ ...settings, anonymizeData: checked })}
              />
            </div>
          </div>
        </div>

        {/* Consent Notice */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-6 font-semibold">Consent Notice</h3>
          <div>
            <Label htmlFor="consentText">Consent Message</Label>
            <Textarea 
              id="consentText" 
              className="mt-2"
              rows={6}
              value={settings.consentText}
              onChange={(e) => setSettings({ ...settings, consentText: e.target.value })}
            />
            <p className="text-xs text-muted-foreground mt-2">
              This message will be displayed to employees when they first log in. Character count: {settings.consentText.length}
            </p>
          </div>
        </div>

        {/* Info Section */}
        <div className="rounded-lg bg-muted/50 border border-border p-4">
          <p className="text-sm text-muted-foreground">
            <strong>💡 Note:</strong> All consent and privacy settings are saved locally in this demo. 
            In production, these settings would be stored in your database and synced across the organization. 
            Changes take effect immediately upon saving and apply to all new employee sessions.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}