import { PageLayout } from '../../shared/PageLayout';
import { Button } from '../../ui/button';
import { useToast } from '../../ui/toast';
import { 
  Database, 
  Shield, 
  Download, 
  RefreshCw,
  HardDrive,
  FileText
} from 'lucide-react';

export function PF01FinancePlatformConsole() {
  const { showToast } = useToast();

  return (
    <PageLayout
      title="PLATFORM – F-01 – Finance Platform Console"
      description="Super admin controls for platform-wide finance data management"
      kpis={[
        {
          title: 'Total Organizations',
          value: '247',
          change: 'Using Finance Module',
          icon: <Database className="h-5 w-5" />
        },
        {
          title: 'Total Transactions',
          value: '1.2M',
          change: 'Across all orgs',
          icon: <FileText className="h-5 w-5" />
        },
        {
          title: 'Data Size',
          value: '28.4 GB',
          change: 'Encrypted storage',
          icon: <HardDrive className="h-5 w-5" />
        },
        {
          title: 'Last Backup',
          value: '2h ago',
          change: 'Auto-backup enabled',
          changeType: 'positive',
          icon: <Shield className="h-5 w-5" />
        },
      ]}
    >
      <div className="max-w-4xl space-y-6">
        {/* Data Retention Rules */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Retention Rules
          </h3>

          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">Platform Default Retention</p>
                <span className="text-sm text-muted-foreground">7 years</span>
              </div>
              <p className="text-xs text-muted-foreground">
                All organizations inherit 7-year retention by default (tax compliance)
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">Soft Delete Grace Period</p>
                <span className="text-sm text-muted-foreground">30 days</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Deleted transactions can be recovered within 30 days
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">Archive Older Than</p>
                <span className="text-sm text-muted-foreground">3 years</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Transactions older than 3 years are moved to cold storage
              </p>
            </div>
          </div>
        </div>

        {/* Backup & Restore */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Backup & Restore
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div>
                <p className="font-medium text-sm">Auto-Backup Status</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Daily backups at 2:00 AM UTC • Last backup: 2h ago
                </p>
              </div>
              <span className="px-3 py-1 bg-green-500/20 text-green-600 dark:text-green-400 rounded-full text-sm font-medium">
                Active
              </span>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline"
                onClick={() => showToast('info', 'Manual Backup', 'Starting backup... (Feature placeholder)')}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Run Manual Backup
              </Button>
              <Button 
                variant="outline"
                onClick={() => showToast('info', 'Restore', 'Restore wizard (Feature placeholder)')}
              >
                <Database className="mr-2 h-4 w-4" />
                Restore from Backup
              </Button>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <p className="text-sm">
                <strong>Backup Strategy:</strong> Incremental hourly, full daily, encrypted at rest, geo-replicated to 3 regions
              </p>
            </div>
          </div>
        </div>

        {/* Exportable Audit Logs */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Exportable Audit Logs
          </h3>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Export comprehensive audit logs for compliance, security review, or incident investigation
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm font-medium mb-2">Transaction Logs</p>
                <p className="text-xs text-muted-foreground mb-3">
                  All transaction create/edit/delete events
                </p>
                <Button size="sm" variant="outline">
                  <Download className="mr-2 h-3 w-3" />
                  Export
                </Button>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm font-medium mb-2">Access Logs</p>
                <p className="text-xs text-muted-foreground mb-3">
                  User authentication and authorization events
                </p>
                <Button size="sm" variant="outline">
                  <Download className="mr-2 h-3 w-3" />
                  Export
                </Button>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm font-medium mb-2">Data Export Logs</p>
                <p className="text-xs text-muted-foreground mb-3">
                  All data export and download activities
                </p>
                <Button size="sm" variant="outline">
                  <Download className="mr-2 h-3 w-3" />
                  Export
                </Button>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm font-medium mb-2">System Events</p>
                <p className="text-xs text-muted-foreground mb-3">
                  Backup, restore, maintenance activities
                </p>
                <Button size="sm" variant="outline">
                  <Download className="mr-2 h-3 w-3" />
                  Export
                </Button>
              </div>
            </div>

            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
              <p className="text-sm">
                ⚠️ <strong>Compliance Note:</strong> Audit logs are immutable and retained for 10 years minimum
              </p>
            </div>
          </div>
        </div>

        {/* Platform Statistics */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-4">Platform Statistics</h3>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold">1,247,892</p>
              <p className="text-xs text-muted-foreground mt-1">Total Transactions</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold">$2.4B</p>
              <p className="text-xs text-muted-foreground mt-1">Total Transaction Value</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold">87%</p>
              <p className="text-xs text-muted-foreground mt-1">AI Classification Rate</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
