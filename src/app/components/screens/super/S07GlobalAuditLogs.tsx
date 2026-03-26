import { useState, useEffect } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { DataTable } from '../../shared/DataTable';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { FileText, Download, Filter, X, CheckCircle, Search } from 'lucide-react';
import { toast } from 'sonner';

interface AuditLog {
  id: string;
  timestamp: string;
  org: string;
  user: string;
  action: string;
  resource: string;
  severity: 'Info' | 'Warning' | 'Critical';
  ipAddress?: string;
  details?: string;
}

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: '1', timestamp: '2025-12-31 14:45:22', org: 'Acme Corp', user: 'john@acme.com', action: 'Org Settings Updated', resource: 'Organization', severity: 'Info', ipAddress: '192.168.1.100', details: 'Updated company name' },
  { id: '2', timestamp: '2025-12-31 14:30:15', org: 'TechStart Inc', user: 'admin@techstart.com', action: 'User Created', resource: 'Users', severity: 'Info', ipAddress: '192.168.1.101', details: 'Created new employee account' },
  { id: '3', timestamp: '2025-12-31 14:15:48', org: 'MegaCorp', user: 'security@mega.com', action: 'Failed Login Attempt', resource: 'Authentication', severity: 'Warning', ipAddress: '192.168.1.102', details: 'Invalid password (3rd attempt)' },
  { id: '4', timestamp: '2025-12-31 14:00:33', org: 'Global Enterprises', user: 'admin@global.com', action: 'Plan Upgraded', resource: 'Billing', severity: 'Info', ipAddress: '192.168.1.103', details: 'Professional to Enterprise' },
  { id: '5', timestamp: '2025-12-31 13:45:10', org: 'Acme Corp', user: 'admin@acme.com', action: 'Integration Connected', resource: 'Integrations', severity: 'Info', ipAddress: '192.168.1.104', details: 'Connected Slack workspace' },
  { id: '6', timestamp: '2025-12-31 13:30:25', org: 'StartupHub', user: 'cto@startup.com', action: 'API Key Generated', resource: 'API', severity: 'Warning', ipAddress: '192.168.1.105', details: 'New API key created' },
  { id: '7', timestamp: '2025-12-31 13:15:40', org: 'Acme Corp', user: 'admin@acme.com', action: 'User Deleted', resource: 'Users', severity: 'Warning', ipAddress: '192.168.1.106', details: 'Removed inactive user' },
  { id: '8', timestamp: '2025-12-31 13:00:55', org: 'TechStart Inc', user: 'support@techstart.com', action: 'Password Reset', resource: 'Authentication', severity: 'Info', ipAddress: '192.168.1.107', details: 'User initiated password reset' },
  { id: '9', timestamp: '2025-12-31 12:45:12', org: 'MegaCorp', user: 'admin@mega.com', action: 'Data Export', resource: 'Data', severity: 'Critical', ipAddress: '192.168.1.108', details: 'Exported all employee data' },
  { id: '10', timestamp: '2025-12-31 12:30:30', org: 'Global Enterprises', user: 'john@global.com', action: 'Permission Changed', resource: 'Access Control', severity: 'Warning', ipAddress: '192.168.1.109', details: 'Granted admin access' },
];

export function S07GlobalAuditLogs() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    severity: 'all',
    resource: 'all',
    organization: '',
    dateFrom: '',
    dateTo: '',
  });
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (filters.severity !== 'all') count++;
    if (filters.resource !== 'all') count++;
    if (filters.organization) count++;
    if (filters.dateFrom) count++;
    if (filters.dateTo) count++;
    setActiveFiltersCount(count);
  }, [filters]);

  const handleApplyFilters = () => {
    setShowFilterDialog(false);
    toast.success('Filters applied', {
      description: `${activeFiltersCount} filter${activeFiltersCount !== 1 ? 's' : ''} active.`,
      icon: <CheckCircle className="h-4 w-4" />,
    });
  };

  const handleClearFilters = () => {
    setFilters({
      severity: 'all',
      resource: 'all',
      organization: '',
      dateFrom: '',
      dateTo: '',
    });
    setSearchQuery('');
    toast.success('Filters cleared', {
      description: 'All filters have been reset.',
    });
  };

  const handleExport = () => {
    try {
      const dataToExport = filteredLogs;

      if (dataToExport.length === 0) {
        toast.error('No data to export', {
          description: 'Apply different filters to see more results.',
        });
        return;
      }

      // Create CSV content
      const headers = ['Timestamp', 'Organization', 'User', 'Action', 'Resource', 'Severity', 'IP Address', 'Details'];
      const rows = dataToExport.map(log => [
        log.timestamp,
        log.org,
        log.user,
        log.action,
        log.resource,
        log.severity,
        log.ipAddress || 'N/A',
        log.details || 'N/A',
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Audit logs exported successfully!', {
        description: `${dataToExport.length} log entries exported to CSV.`,
        icon: <Download className="h-4 w-4" />,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed', {
        description: 'There was an error exporting the data. Please try again.',
      });
    }
  };

  // Filter audit logs
  const filteredLogs = auditLogs.filter(log => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        log.org.toLowerCase().includes(query) ||
        log.user.toLowerCase().includes(query) ||
        log.action.toLowerCase().includes(query) ||
        log.resource.toLowerCase().includes(query) ||
        (log.details && log.details.toLowerCase().includes(query));
      
      if (!matchesSearch) return false;
    }

    // Severity filter
    if (filters.severity !== 'all' && log.severity !== filters.severity) {
      return false;
    }

    // Resource filter
    if (filters.resource !== 'all' && log.resource !== filters.resource) {
      return false;
    }

    // Organization filter
    if (filters.organization && !log.org.toLowerCase().includes(filters.organization.toLowerCase())) {
      return false;
    }

    // Date range filter
    if (filters.dateFrom) {
      const logDate = new Date(log.timestamp);
      const fromDate = new Date(filters.dateFrom);
      if (logDate < fromDate) return false;
    }

    if (filters.dateTo) {
      const logDate = new Date(log.timestamp);
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      if (logDate > toDate) return false;
    }

    return true;
  });

  // Calculate KPIs
  const totalEvents = auditLogs.length;
  const securityEvents = auditLogs.filter(log => log.severity === 'Warning' || log.severity === 'Critical').length;
  const failedLogins = auditLogs.filter(log => log.action.includes('Failed Login')).length;
  const criticalEvents = auditLogs.filter(log => log.severity === 'Critical').length;

  // Get unique resources for filter dropdown
  const uniqueResources = Array.from(new Set(auditLogs.map(log => log.resource)));

  const columns = [
    { key: 'timestamp', header: 'Timestamp', width: '16%' },
    { key: 'org', header: 'Organization', width: '14%' },
    { key: 'user', header: 'User', width: '16%' },
    { key: 'action', header: 'Action', width: '18%' },
    { key: 'resource', header: 'Resource', width: '12%' },
    { 
      key: 'severity', 
      header: 'Severity', 
      width: '12%',
      cell: (value: string) => {
        const type = value === 'Critical' ? 'danger' : value === 'Warning' ? 'warning' : 'info';
        return <StatusBadge type={type}>{value}</StatusBadge>;
      }
    },
    {
      key: 'ipAddress',
      header: 'IP Address',
      width: '12%',
      cell: (value: any) => value || 'N/A'
    }
  ];

  return (
    <PageLayout
      title="SUPER – S-07 – Global Audit Logs – v2.0"
      description="Platform-wide activity audit trail"
      actions={
        <>
          <Button 
            variant="outline" 
            onClick={() => setShowFilterDialog(true)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filter
            {activeFiltersCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExport}
            disabled={filteredLogs.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </>
      }
      kpis={[
        {
          title: 'Total Events',
          value: totalEvents.toString(),
          change: `${filteredLogs.length} filtered`,
          changeType: 'neutral',
          icon: <FileText className="h-5 w-5" />
        },
        {
          title: 'Security Events',
          value: securityEvents.toString(),
          change: securityEvents > 0 ? 'Require review' : 'None',
          changeType: securityEvents > 0 ? 'warning' : 'positive',
          icon: <FileText className="h-5 w-5" />
        },
        {
          title: 'Failed Logins',
          value: failedLogins.toString(),
          change: 'Across all orgs',
          changeType: failedLogins > 5 ? 'warning' : 'neutral',
          icon: <FileText className="h-5 w-5" />
        },
        {
          title: 'Critical Events',
          value: criticalEvents.toString(),
          change: criticalEvents > 0 ? 'Immediate attention' : 'None',
          changeType: criticalEvents > 0 ? 'danger' : 'positive',
          icon: <FileText className="h-5 w-5" />
        },
      ]}
    >
      <div className="space-y-6">
        {/* Filter Dialog */}
        {showFilterDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowFilterDialog(false)}>
            <div 
              className="bg-card rounded-lg shadow-lg w-full max-w-2xl p-6 m-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Filter Audit Logs</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowFilterDialog(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {/* Severity Filter */}
                <div>
                  <Label htmlFor="severity">Severity Level</Label>
                  <select
                    id="severity"
                    value={filters.severity}
                    onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                    className="w-full mt-2 px-3 py-2 border border-border rounded-md bg-background"
                  >
                    <option value="all">All Severities</option>
                    <option value="Info">Info</option>
                    <option value="Warning">Warning</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                {/* Resource Filter */}
                <div>
                  <Label htmlFor="resource">Resource Type</Label>
                  <select
                    id="resource"
                    value={filters.resource}
                    onChange={(e) => setFilters({ ...filters, resource: e.target.value })}
                    className="w-full mt-2 px-3 py-2 border border-border rounded-md bg-background"
                  >
                    <option value="all">All Resources</option>
                    {uniqueResources.map(resource => (
                      <option key={resource} value={resource}>{resource}</option>
                    ))}
                  </select>
                </div>

                {/* Organization Filter */}
                <div>
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    value={filters.organization}
                    onChange={(e) => setFilters({ ...filters, organization: e.target.value })}
                    placeholder="Enter organization name..."
                    className="mt-2"
                  />
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dateFrom">Date From</Label>
                    <Input
                      id="dateFrom"
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateTo">Date To</Label>
                    <Input
                      id="dateTo"
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                </div>

                {/* Active Filters Summary */}
                {activeFiltersCount > 0 && (
                  <div className="rounded-lg bg-blue-500/10 border border-blue-500/30 p-3">
                    <p className="text-sm font-medium">
                      {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active - 
                      Showing {filteredLogs.length} of {totalEvents} logs
                    </p>
                  </div>
                )}
              </div>

              {/* Dialog Actions */}
              <div className="flex gap-2 mt-6">
                <Button variant="outline" onClick={handleClearFilters} className="flex-1">
                  Clear All
                </Button>
                <Button onClick={handleApplyFilters} className="flex-1">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by organization, user, action, resource, or details..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">Active Filters:</span>
            {filters.severity !== 'all' && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">
                Severity: {filters.severity}
                <button onClick={() => setFilters({ ...filters, severity: 'all' })}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.resource !== 'all' && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">
                Resource: {filters.resource}
                <button onClick={() => setFilters({ ...filters, resource: 'all' })}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.organization && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">
                Org: {filters.organization}
                <button onClick={() => setFilters({ ...filters, organization: '' })}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {(filters.dateFrom || filters.dateTo) && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">
                Date Range
                <button onClick={() => setFilters({ ...filters, dateFrom: '', dateTo: '' })}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            <Button variant="ghost" size="sm" onClick={handleClearFilters}>
              Clear All
            </Button>
          </div>
        )}

        {/* Audit Logs Table */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-4 font-semibold">
            Platform Activity ({filteredLogs.length} {filteredLogs.length !== totalEvents && `of ${totalEvents}`})
          </h3>
          {filteredLogs.length > 0 ? (
            <DataTable columns={columns} data={filteredLogs} />
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No audit logs found</p>
              <p className="text-sm">
                {searchQuery || activeFiltersCount > 0 
                  ? 'Try adjusting your search or filters' 
                  : 'No activity logs available'}
              </p>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="rounded-lg bg-muted/50 border border-border p-4">
          <p className="text-sm text-muted-foreground">
            <strong>💡 How it works:</strong> Search across all log fields using the search bar. 
            Click "Filter" to apply advanced filters by severity, resource type, organization, and date range. 
            Active filters are shown as badges and can be removed individually. Click "Export" to download 
            filtered logs as CSV. All audit trail data is preserved locally in this demo.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
