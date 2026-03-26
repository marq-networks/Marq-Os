import { useState, useEffect } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Switch } from '../../ui/switch';
import { Shield, Save, X, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const STORAGE_KEY = 'workos_global_policies';

interface GlobalPolicies {
  // Data Policies
  dataRetention: number;
  enforceEncryption: boolean;
  gdprMode: boolean;
  
  // Security Policies
  requireMFA: boolean;
  passwordPolicy: boolean;
  sessionTimeout: number;
  
  // Feature Restrictions
  allowScreenshots: boolean;
  allowGPS: boolean;
  allowAPI: boolean;
  
  // Terms of Service
  tos: string;
  
  // Metadata
  lastUpdated: string;
}

const INITIAL_POLICIES: GlobalPolicies = {
  dataRetention: 24,
  enforceEncryption: true,
  gdprMode: true,
  requireMFA: true,
  passwordPolicy: true,
  sessionTimeout: 60,
  allowScreenshots: true,
  allowGPS: true,
  allowAPI: true,
  tos: 'These Terms of Service govern your use of the WorkOS platform and services. By accessing or using our platform, you agree to be bound by these terms.\n\n1. Acceptable Use: You agree to use the platform only for lawful purposes and in accordance with these Terms.\n\n2. Data Privacy: We are committed to protecting your data and maintaining compliance with all applicable privacy laws.\n\n3. Service Availability: While we strive for 99.9% uptime, we do not guarantee uninterrupted service.\n\n4. Modifications: We reserve the right to modify these terms at any time with notice to organizations.',
  lastUpdated: '2025-12-15',
};

export function S05GlobalPolicies() {
  const [policies, setPolicies] = useState<GlobalPolicies>(INITIAL_POLICIES);
  const [originalPolicies, setOriginalPolicies] = useState<GlobalPolicies>(INITIAL_POLICIES);
  const [hasChanges, setHasChanges] = useState(false);

  // Load policies from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPolicies(parsed);
        setOriginalPolicies(parsed);
      }
    } catch (error) {
      console.error('Failed to load policies:', error);
    }
  }, []);

  // Check for changes whenever policies change
  useEffect(() => {
    const changed = JSON.stringify(policies) !== JSON.stringify(originalPolicies);
    setHasChanges(changed);
  }, [policies, originalPolicies]);

  const handleSaveChanges = () => {
    if (!hasChanges) {
      toast.info('No changes to save', {
        description: 'Make some changes to the policies before saving.',
      });
      return;
    }

    // Validation
    if (policies.dataRetention < 1 || policies.dataRetention > 120) {
      toast.error('Invalid data retention period', {
        description: 'Data retention must be between 1 and 120 months.',
      });
      return;
    }

    if (policies.sessionTimeout < 5 || policies.sessionTimeout > 1440) {
      toast.error('Invalid session timeout', {
        description: 'Session timeout must be between 5 and 1440 minutes.',
      });
      return;
    }

    if (policies.tos.trim().length < 50) {
      toast.error('Terms of Service too short', {
        description: 'Terms of Service must be at least 50 characters.',
      });
      return;
    }

    try {
      const updatedPolicies = {
        ...policies,
        lastUpdated: new Date().toISOString().split('T')[0],
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPolicies));
      setPolicies(updatedPolicies);
      setOriginalPolicies(updatedPolicies);
      setHasChanges(false);

      toast.success('Global policies saved successfully!', {
        description: 'All organizations will now follow the updated policies.',
        icon: <CheckCircle className="h-4 w-4" />,
      });
    } catch (error) {
      console.error('Failed to save policies:', error);
      toast.error('Failed to save policies', {
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
      setPolicies(originalPolicies);
      toast.success('Changes discarded', {
        description: 'Policies have been reverted to the last saved state.',
      });
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Reset all policies to default values? This cannot be undone.')) {
      setPolicies(INITIAL_POLICIES);
      setOriginalPolicies(INITIAL_POLICIES);
      localStorage.removeItem(STORAGE_KEY);
      
      toast.success('Policies reset to defaults', {
        description: 'All global policies have been reset to default values.',
      });
    }
  };

  const updatePolicy = <K extends keyof GlobalPolicies>(key: K, value: GlobalPolicies[K]) => {
    setPolicies({ ...policies, [key]: value });
  };

  // Calculate KPIs
  const activePolicies = [
    policies.enforceEncryption,
    policies.gdprMode,
    policies.requireMFA,
    policies.passwordPolicy,
    policies.allowScreenshots,
    policies.allowGPS,
    policies.allowAPI,
  ].filter(Boolean).length;

  return (
    <PageLayout
      title="SUPER – S-05 – Global Policies – v2.0"
      description="Platform-wide policies and settings"
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
          title: 'Active Policies',
          value: activePolicies.toString(),
          change: `${activePolicies} of 7 enabled`,
          changeType: 'neutral',
          icon: <Shield className="h-5 w-5" />
        },
        {
          title: 'Organizations',
          value: '156',
          change: 'Under policy',
          changeType: 'neutral',
          icon: <Shield className="h-5 w-5" />
        },
        {
          title: 'Compliance',
          value: '100%',
          change: 'All orgs compliant',
          changeType: 'positive',
          icon: <Shield className="h-5 w-5" />
        },
        {
          title: 'Last Updated',
          value: new Date(policies.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          change: hasChanges ? 'Unsaved changes' : 'Up to date',
          changeType: hasChanges ? 'warning' : 'positive',
          icon: <Shield className="h-5 w-5" />
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
                You have unsaved changes. Click "Save Changes" to apply these policies across all organizations.
              </p>
            </div>
          </div>
        )}

        {/* Data Policies */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-6 font-semibold">Data Policies</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="dataRetention">Default Data Retention (months)</Label>
              <Input 
                id="dataRetention" 
                type="number" 
                min="1"
                max="120"
                value={policies.dataRetention}
                onChange={(e) => updatePolicy('dataRetention', parseInt(e.target.value) || 1)}
                className="mt-1" 
              />
              <p className="text-xs text-muted-foreground mt-1">
                Range: 1-120 months
              </p>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
              <div>
                <Label htmlFor="enforceEncryption">Enforce Data Encryption</Label>
                <p className="text-sm text-muted-foreground">Require encryption for all organizations</p>
              </div>
              <Switch 
                id="enforceEncryption" 
                checked={policies.enforceEncryption}
                onCheckedChange={(checked) => updatePolicy('enforceEncryption', checked)}
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
              <div>
                <Label htmlFor="gdprMode">GDPR Compliance Mode</Label>
                <p className="text-sm text-muted-foreground">Enable GDPR compliance features</p>
              </div>
              <Switch 
                id="gdprMode" 
                checked={policies.gdprMode}
                onCheckedChange={(checked) => updatePolicy('gdprMode', checked)}
              />
            </div>
          </div>
        </div>

        {/* Security Policies */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-6 font-semibold">Security Policies</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
              <div>
                <Label htmlFor="requireMFA">Require MFA for Admins</Label>
                <p className="text-sm text-muted-foreground">Force all org admins to use 2FA</p>
              </div>
              <Switch 
                id="requireMFA" 
                checked={policies.requireMFA}
                onCheckedChange={(checked) => updatePolicy('requireMFA', checked)}
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
              <div>
                <Label htmlFor="passwordPolicy">Enforce Strong Passwords</Label>
                <p className="text-sm text-muted-foreground">Minimum 12 characters, mixed case, numbers, symbols</p>
              </div>
              <Switch 
                id="passwordPolicy" 
                checked={policies.passwordPolicy}
                onCheckedChange={(checked) => updatePolicy('passwordPolicy', checked)}
              />
            </div>
            <div>
              <Label htmlFor="sessionTimeout">Platform Session Timeout (minutes)</Label>
              <Input 
                id="sessionTimeout" 
                type="number" 
                min="5"
                max="1440"
                value={policies.sessionTimeout}
                onChange={(e) => updatePolicy('sessionTimeout', parseInt(e.target.value) || 5)}
                className="mt-1" 
              />
              <p className="text-xs text-muted-foreground mt-1">
                Range: 5-1440 minutes (5 min - 24 hours)
              </p>
            </div>
          </div>
        </div>

        {/* Feature Restrictions */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-6 font-semibold">Feature Restrictions</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
              <div>
                <Label htmlFor="allowScreenshots">Allow Screenshot Feature</Label>
                <p className="text-sm text-muted-foreground">Let organizations enable screenshot capture</p>
              </div>
              <Switch 
                id="allowScreenshots" 
                checked={policies.allowScreenshots}
                onCheckedChange={(checked) => updatePolicy('allowScreenshots', checked)}
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
              <div>
                <Label htmlFor="allowGPS">Allow GPS Tracking</Label>
                <p className="text-sm text-muted-foreground">Let organizations use location tracking</p>
              </div>
              <Switch 
                id="allowGPS" 
                checked={policies.allowGPS}
                onCheckedChange={(checked) => updatePolicy('allowGPS', checked)}
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
              <div>
                <Label htmlFor="allowAPI">Allow API Access</Label>
                <p className="text-sm text-muted-foreground">Enable API for all organizations</p>
              </div>
              <Switch 
                id="allowAPI" 
                checked={policies.allowAPI}
                onCheckedChange={(checked) => updatePolicy('allowAPI', checked)}
              />
            </div>
          </div>
        </div>

        {/* Terms of Service */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-6 font-semibold">Terms of Service</h3>
          <div>
            <Label htmlFor="tos">Platform Terms of Service</Label>
            <Textarea 
              id="tos" 
              className="mt-2"
              rows={8}
              value={policies.tos}
              onChange={(e) => updatePolicy('tos', e.target.value)}
              placeholder="Enter the terms of service for the platform..."
            />
            <p className="text-xs text-muted-foreground mt-1">
              {policies.tos.length} characters (minimum 50 required)
            </p>
          </div>
        </div>

        {/* Info Section */}
        <div className="rounded-lg bg-muted/50 border border-border p-4">
          <p className="text-sm text-muted-foreground">
            <strong>💡 How it works:</strong> These global policies apply to all organizations on the platform. 
            Changes are highlighted with a yellow banner. Click "Save Changes" to apply updates across all 156 organizations. 
            The "Discard Changes" button reverts to the last saved state, and "Reset to Defaults" restores original values. 
            All data is saved locally in this demo.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
