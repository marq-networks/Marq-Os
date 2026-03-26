import { useState, useEffect } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { Button } from '../../ui/button';
import { Switch } from '../../ui/switch';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Input } from '../../ui/input';
import { Shield, Save, FileText, CheckCircle, AlertCircle, Lock, Eye, Download } from 'lucide-react';
import { toast } from 'sonner';

const STORAGE_KEY = 'workos_security_consent_privacy';

interface SecurityConsentSettings {
  // Consent Management
  requireConsent: boolean;
  consentVersion: string;
  consentText: string;
  
  // Privacy Controls
  dataMinimization: boolean;
  purposeLimitation: boolean;
  dataRetentionDays: number;
  anonymizeAfterDays: number;
  
  // User Rights
  rightToAccess: boolean;
  rightToRectification: boolean;
  rightToErasure: boolean;
  rightToPortability: boolean;
  rightToObject: boolean;
  
  // Compliance
  gdprCompliance: boolean;
  ccpaCompliance: boolean;
  encryptPersonalData: boolean;
  auditLogging: boolean;
}

const DEFAULT_SETTINGS: SecurityConsentSettings = {
  requireConsent: true,
  consentVersion: 'v2.4',
  consentText: "By using this system, you acknowledge that we collect and process your personal and work-related data in accordance with our privacy policy. You have the right to access, modify, or delete your data at any time.",
  
  dataMinimization: true,
  purposeLimitation: true,
  dataRetentionDays: 365,
  anonymizeAfterDays: 730,
  
  rightToAccess: true,
  rightToRectification: true,
  rightToErasure: true,
  rightToPortability: true,
  rightToObject: true,
  
  gdprCompliance: true,
  ccpaCompliance: true,
  encryptPersonalData: true,
  auditLogging: true,
};

export function SecurityConsentPrivacy() {
  const [settings, setSettings] = useState<SecurityConsentSettings>(DEFAULT_SETTINGS);
  const [originalSettings, setOriginalSettings] = useState<SecurityConsentSettings>(DEFAULT_SETTINGS);
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
      console.error('Failed to load security settings:', error);
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
    
    setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        setOriginalSettings(settings);
        setHasChanges(false);
        
        toast.success('Security & Privacy settings saved successfully!', {
          description: 'All changes have been applied.',
          icon: <CheckCircle className="h-4 w-4" />,
        });
        
        setIsSaving(false);
      } catch (error) {
        console.error('Failed to save settings:', error);
        toast.error('Failed to save settings');
        setIsSaving(false);
      }
    }, 500);
  };

  const handleDiscardChanges = () => {
    setSettings(originalSettings);
    setHasChanges(false);
    toast.info('Changes discarded');
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
      setSettings(DEFAULT_SETTINGS);
      toast.info('Settings reset to defaults. Click "Save Changes" to apply.');
    }
  };

  // Calculate compliance score
  const complianceCount = [
    settings.gdprCompliance,
    settings.ccpaCompliance,
    settings.encryptPersonalData,
    settings.auditLogging,
    settings.dataMinimization,
    settings.purposeLimitation
  ].filter(Boolean).length;
  const complianceScore = Math.round((complianceCount / 6) * 100);

  // Calculate user rights enabled
  const userRightsCount = [
    settings.rightToAccess,
    settings.rightToRectification,
    settings.rightToErasure,
    settings.rightToPortability,
    settings.rightToObject
  ].filter(Boolean).length;

  return (
    <PageLayout
      title="SECURITY – Consent & Privacy – v2.0"
      description="Manage consent policies, privacy controls, and compliance settings"
      actions={
        <div className="flex items-center gap-2">
          {hasChanges && (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDiscardChanges}
              >
                Discard
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleResetToDefaults}
              >
                Reset
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
          title: 'Compliance Score',
          value: `${complianceScore}%`,
          change: `${complianceCount}/6 enabled`,
          changeType: complianceScore >= 80 ? 'positive' : 'warning',
          icon: <Shield className="h-5 w-5" />
        },
        {
          title: 'User Rights',
          value: `${userRightsCount}/5`,
          change: 'Rights enabled',
          changeType: userRightsCount >= 4 ? 'positive' : 'warning',
          icon: <Lock className="h-5 w-5" />
        },
        {
          title: 'Consent Required',
          value: settings.requireConsent ? 'Yes' : 'No',
          change: settings.consentVersion,
          changeType: settings.requireConsent ? 'positive' : 'warning',
          icon: <FileText className="h-5 w-5" />
        },
        {
          title: 'Retention Period',
          value: `${settings.dataRetentionDays}d`,
          change: `Anonymize after ${settings.anonymizeAfterDays}d`,
          changeType: 'neutral',
          icon: <Eye className="h-5 w-5" />
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
                  You have {Object.keys(settings).length} setting changes. Click "Save Changes" to apply them.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Consent Management */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-6 font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Consent Management
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="requireConsent">Require Consent</Label>
                <p className="text-sm text-muted-foreground">Users must accept terms before accessing the system</p>
              </div>
              <Switch 
                id="requireConsent" 
                checked={settings.requireConsent}
                onCheckedChange={(checked) => setSettings({ ...settings, requireConsent: checked })}
              />
            </div>

            <div>
              <Label htmlFor="consentVersion">Consent Policy Version</Label>
              <Input
                id="consentVersion"
                value={settings.consentVersion}
                onChange={(e) => setSettings({ ...settings, consentVersion: e.target.value })}
                className="mt-2"
                placeholder="e.g., v2.4"
              />
            </div>

            <div>
              <Label htmlFor="consentText">Consent Notice Text</Label>
              <Textarea 
                id="consentText" 
                className="mt-2"
                rows={4}
                value={settings.consentText}
                onChange={(e) => setSettings({ ...settings, consentText: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Characters: {settings.consentText.length}
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Controls */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-6 font-semibold flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Privacy Controls
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="dataMinimization">Data Minimization</Label>
                <p className="text-sm text-muted-foreground">Collect only necessary data</p>
              </div>
              <Switch 
                id="dataMinimization" 
                checked={settings.dataMinimization}
                onCheckedChange={(checked) => setSettings({ ...settings, dataMinimization: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="purposeLimitation">Purpose Limitation</Label>
                <p className="text-sm text-muted-foreground">Use data only for stated purposes</p>
              </div>
              <Switch 
                id="purposeLimitation" 
                checked={settings.purposeLimitation}
                onCheckedChange={(checked) => setSettings({ ...settings, purposeLimitation: checked })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dataRetentionDays">Data Retention (days)</Label>
                <Input
                  id="dataRetentionDays"
                  type="number"
                  value={settings.dataRetentionDays}
                  onChange={(e) => setSettings({ ...settings, dataRetentionDays: parseInt(e.target.value) || 365 })}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="anonymizeAfterDays">Anonymize After (days)</Label>
                <Input
                  id="anonymizeAfterDays"
                  type="number"
                  value={settings.anonymizeAfterDays}
                  onChange={(e) => setSettings({ ...settings, anonymizeAfterDays: parseInt(e.target.value) || 730 })}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* User Rights */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-6 font-semibold flex items-center gap-2">
            <Lock className="h-5 w-5" />
            User Rights (GDPR)
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="rightToAccess">Right to Access</Label>
                <p className="text-sm text-muted-foreground">Users can view their data</p>
              </div>
              <Switch 
                id="rightToAccess" 
                checked={settings.rightToAccess}
                onCheckedChange={(checked) => setSettings({ ...settings, rightToAccess: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="rightToRectification">Right to Rectification</Label>
                <p className="text-sm text-muted-foreground">Users can correct their data</p>
              </div>
              <Switch 
                id="rightToRectification" 
                checked={settings.rightToRectification}
                onCheckedChange={(checked) => setSettings({ ...settings, rightToRectification: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="rightToErasure">Right to Erasure</Label>
                <p className="text-sm text-muted-foreground">Users can request data deletion</p>
              </div>
              <Switch 
                id="rightToErasure" 
                checked={settings.rightToErasure}
                onCheckedChange={(checked) => setSettings({ ...settings, rightToErasure: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="rightToPortability">Right to Data Portability</Label>
                <p className="text-sm text-muted-foreground">Users can export their data</p>
              </div>
              <Switch 
                id="rightToPortability" 
                checked={settings.rightToPortability}
                onCheckedChange={(checked) => setSettings({ ...settings, rightToPortability: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="rightToObject">Right to Object</Label>
                <p className="text-sm text-muted-foreground">Users can object to processing</p>
              </div>
              <Switch 
                id="rightToObject" 
                checked={settings.rightToObject}
                onCheckedChange={(checked) => setSettings({ ...settings, rightToObject: checked })}
              />
            </div>
          </div>
        </div>

        {/* Compliance */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-6 font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Compliance Standards
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="gdprCompliance">GDPR Compliance</Label>
                <p className="text-sm text-muted-foreground">European data protection regulation</p>
              </div>
              <Switch 
                id="gdprCompliance" 
                checked={settings.gdprCompliance}
                onCheckedChange={(checked) => setSettings({ ...settings, gdprCompliance: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="ccpaCompliance">CCPA Compliance</Label>
                <p className="text-sm text-muted-foreground">California consumer privacy act</p>
              </div>
              <Switch 
                id="ccpaCompliance" 
                checked={settings.ccpaCompliance}
                onCheckedChange={(checked) => setSettings({ ...settings, ccpaCompliance: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="encryptPersonalData">Encrypt Personal Data</Label>
                <p className="text-sm text-muted-foreground">Encrypt PII at rest and in transit</p>
              </div>
              <Switch 
                id="encryptPersonalData" 
                checked={settings.encryptPersonalData}
                onCheckedChange={(checked) => setSettings({ ...settings, encryptPersonalData: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="auditLogging">Audit Logging</Label>
                <p className="text-sm text-muted-foreground">Log all data access and changes</p>
              </div>
              <Switch 
                id="auditLogging" 
                checked={settings.auditLogging}
                onCheckedChange={(checked) => setSettings({ ...settings, auditLogging: checked })}
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-lg bg-muted/50 border border-border p-4">
          <h4 className="font-semibold mb-2">📊 Current Configuration Summary:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Compliance:</p>
              <p className="font-semibold">{complianceScore}% ({complianceCount}/6 standards)</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">User Rights:</p>
              <p className="font-semibold">{userRightsCount}/5 rights enabled</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Data Lifecycle:</p>
              <p className="font-semibold">Retain {settings.dataRetentionDays}d, Anonymize {settings.anonymizeAfterDays}d</p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="rounded-lg bg-blue-500/10 border border-blue-500/30 p-4">
          <p className="text-sm text-muted-foreground">
            <strong>💡 Important:</strong> All settings are saved to localStorage in this demo. 
            Changes take effect immediately after saving. For production use, these settings would be 
            stored in your database with proper audit logging and version control.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
