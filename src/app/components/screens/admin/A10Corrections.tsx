import { useState, useEffect } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  DollarSign, 
  Filter, 
  Download,
  Search,
  X,
  Clock,
  Calendar
} from 'lucide-react';
import { useTimeData } from '../../../services';

interface Correction {
  id: string;
  employee: string;
  date: string;
  type: string;
  originalTime: string;
  correctedTime: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  suggestFine: boolean;
  fineAmount?: number;
}

export function A10Corrections() {
  const { corrections: serviceCorrections, approveCorrection, rejectCorrection, loading } = useTimeData();

  // Map service data → local UI shape
  const [corrections, setCorrections] = useState<Correction[]>([]);
  
  useEffect(() => {
    const mapped: Correction[] = serviceCorrections.map(c => ({
      id: c.id,
      employee: c.employeeName,
      date: c.date,
      type: c.correctedCheckIn !== c.originalCheckIn ? 'Late Clock In' : 'Missed Clock Out',
      originalTime: c.originalCheckIn + ' - ' + c.originalCheckOut,
      correctedTime: c.correctedCheckIn + ' - ' + c.correctedCheckOut,
      reason: c.reason,
      status: c.status,
      suggestFine: c.status === 'Pending' && c.correctedCheckIn !== c.originalCheckIn,
      fineAmount: c.status === 'Pending' && c.correctedCheckIn !== c.originalCheckIn ? 15.00 : undefined,
    }));
    setCorrections(mapped);
  }, [serviceCorrections]);

  // Selection and filter states
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Show success message
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  // Handle checkbox selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const pendingIds = filteredCorrections
        .filter(c => c.status === 'Pending')
        .map(c => c.id);
      setSelectedIds(pendingIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    }
  };

  // Approve selected corrections
  const handleApproveSelected = () => {
    if (selectedIds.length === 0) {
      alert('Please select at least one correction to approve');
      return;
    }

    setCorrections(prev =>
      prev.map(correction =>
        selectedIds.includes(correction.id)
          ? { ...correction, status: 'Approved' as const }
          : correction
      )
    );

    showSuccess(`Successfully approved ${selectedIds.length} correction${selectedIds.length > 1 ? 's' : ''}!`);
    setSelectedIds([]);
  };

  // Reject selected corrections
  const handleRejectSelected = () => {
    if (selectedIds.length === 0) {
      alert('Please select at least one correction to reject');
      return;
    }

    const confirmReject = window.confirm(
      `Are you sure you want to reject ${selectedIds.length} correction${selectedIds.length > 1 ? 's' : ''}?`
    );

    if (confirmReject) {
      setCorrections(prev =>
        prev.map(correction =>
          selectedIds.includes(correction.id)
            ? { ...correction, status: 'Rejected' as const }
            : correction
        )
      );

      showSuccess(`Successfully rejected ${selectedIds.length} correction${selectedIds.length > 1 ? 's' : ''}!`);
      setSelectedIds([]);
    }
  };

  // Create fine for correction
  const handleCreateFine = (correction: Correction) => {
    alert(`Opening fine creation for ${correction.employee} - $${correction.fineAmount?.toFixed(2)}\n\nThis would integrate with the Fines Management system (AT01Fines.tsx)`);
    showSuccess(`Fine created for ${correction.employee}`);
  };

  // Export to CSV
  const handleExportToCSV = () => {
    const headers = ['Employee', 'Date', 'Type', 'Original Time', 'Corrected Time', 'Reason', 'Status', 'Fine Suggested', 'Fine Amount'];
    
    const csvData = filteredCorrections.map(correction => [
      correction.employee,
      correction.date,
      correction.type,
      correction.originalTime,
      correction.correctedTime,
      correction.reason,
      correction.status,
      correction.suggestFine ? 'Yes' : 'No',
      correction.fineAmount ? `$${correction.fineAmount.toFixed(2)}` : 'N/A'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `time_corrections_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showSuccess(`Exported ${filteredCorrections.length} corrections to CSV!`);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setFilterStatus('all');
    setFilterType('all');
    alert('All filters have been cleared');
  };

  // Filter corrections
  const filteredCorrections = corrections.filter(correction => {
    const matchesSearch = searchQuery === '' ||
      correction.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      correction.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      correction.reason.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || correction.status === filterStatus;
    const matchesType = filterType === 'all' || correction.type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate statistics
  const pendingCount = corrections.filter(c => c.status === 'Pending').length;
  const approvedTodayCount = corrections.filter(c => {
    const today = new Date().toISOString().split('T')[0];
    return c.status === 'Approved' && c.date.includes(today);
  }).length;
  const thisMonthCount = corrections.length;
  const approvedThisMonth = corrections.filter(c => c.status === 'Approved').length;
  const finesSuggested = corrections.filter(c => c.suggestFine && c.status === 'Pending').length;

  // Get unique types for filter
  const correctionTypes = Array.from(new Set(corrections.map(c => c.type))).sort();

  // Check if any filters are active
  const hasActiveFilters = searchQuery !== '' || filterStatus !== 'all' || filterType !== 'all';

  // Check if all pending are selected
  const pendingCorrections = filteredCorrections.filter(c => c.status === 'Pending');
  const allPendingSelected = pendingCorrections.length > 0 && 
    pendingCorrections.every(c => selectedIds.includes(c.id));

  return (
    <PageLayout
      title="ADMIN – A-10 – Corrections & Approvals – v2.0"
      description="Review and approve time log corrections"
      actions={
        <>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter className="mr-2 h-4 w-4" />
            {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
            {hasActiveFilters && (
              <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {[searchQuery !== '', filterStatus !== 'all', filterType !== 'all'].filter(Boolean).length}
              </span>
            )}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportToCSV}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRejectSelected}
            disabled={selectedIds.length === 0}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Reject Selected ({selectedIds.length})
          </Button>
          <Button 
            size="sm"
            onClick={handleApproveSelected}
            disabled={selectedIds.length === 0}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Approve Selected ({selectedIds.length})
          </Button>
        </>
      }
      kpis={[
        {
          title: 'Pending',
          value: pendingCount.toString(),
          change: 'Require review',
          changeType: pendingCount > 0 ? 'warning' : 'neutral',
          icon: <Clock className="h-5 w-5" />
        },
        {
          title: 'Approved Today',
          value: approvedTodayCount.toString(),
          change: 'Today',
          changeType: 'positive',
          icon: <CheckCircle className="h-5 w-5" />
        },
        {
          title: 'This Month',
          value: thisMonthCount.toString(),
          change: `${approvedThisMonth} approved, ${pendingCount} pending`,
          changeType: 'neutral',
          icon: <Calendar className="h-5 w-5" />
        },
        {
          title: 'Fine Suggestions',
          value: finesSuggested.toString(),
          change: 'Pending review',
          changeType: finesSuggested > 0 ? 'warning' : 'neutral',
          icon: <DollarSign className="h-5 w-5" />
        },
      ]}
    >
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800 p-4 animate-in slide-in-from-top">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="font-medium text-green-900 dark:text-green-100">
              {successMessage}
            </span>
          </div>
        </div>
      )}

      {/* Filter Panel */}
      {isFilterOpen && (
        <div className="mb-6 rounded-lg border border-border bg-card p-6 shadow-lg animate-in slide-in-from-top">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Corrections
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
              >
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFilterOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search employee, type, reason..."
                  className="w-full rounded-md border border-border bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Correction Type</label>
              <select
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                {correctionTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium">Active Filters:</span>
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm">
                    Search: "{searchQuery}"
                    <button onClick={() => setSearchQuery('')} className="hover:text-primary">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filterStatus !== 'all' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm">
                    Status: {filterStatus}
                    <button onClick={() => setFilterStatus('all')} className="hover:text-primary">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filterType !== 'all' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm">
                    Type: {filterType}
                    <button onClick={() => setFilterType('all')} className="hover:text-primary">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Fine Suggestions Alert */}
      {finesSuggested > 0 && (
        <div className="mb-6 rounded-lg border border-warning/50 bg-warning/5 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-warning mb-2">
                Fine Suggestions Available
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                {finesSuggested} correction{finesSuggested > 1 ? 's' : ''} may warrant fines based on violation rules. Review and create fines as needed.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Corrections Table */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Correction Requests
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({filteredCorrections.length} {filteredCorrections.length === 1 ? 'correction' : 'corrections'})
            </span>
          </h3>
          {selectedIds.length > 0 && (
            <span className="text-sm text-primary font-medium">
              {selectedIds.length} selected
            </span>
          )}
        </div>

        {/* Table Header */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={allPendingSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-border"
                    disabled={pendingCorrections.length === 0}
                  />
                </th>
                <th className="text-left p-3 text-sm font-medium">Employee</th>
                <th className="text-left p-3 text-sm font-medium">Date</th>
                <th className="text-left p-3 text-sm font-medium">Type</th>
                <th className="text-left p-3 text-sm font-medium">Original</th>
                <th className="text-left p-3 text-sm font-medium">Corrected</th>
                <th className="text-left p-3 text-sm font-medium">Reason</th>
                <th className="text-left p-3 text-sm font-medium">Status</th>
                <th className="text-left p-3 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCorrections.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12">
                    <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium mb-2">No corrections found</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Try adjusting your filters
                    </p>
                    <Button onClick={resetFilters} size="sm">
                      Clear Filters
                    </Button>
                  </td>
                </tr>
              ) : (
                filteredCorrections.map((correction) => (
                  <tr key={correction.id} className="border-b border-border hover:bg-muted/50">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(correction.id)}
                        onChange={(e) => handleSelectOne(correction.id, e.target.checked)}
                        className="rounded border-border"
                        disabled={correction.status !== 'Pending'}
                      />
                    </td>
                    <td className="p-3 text-sm font-medium">{correction.employee}</td>
                    <td className="p-3 text-sm">{correction.date}</td>
                    <td className="p-3 text-sm">
                      <div className="flex items-center gap-2">
                        {correction.type}
                        {correction.suggestFine && (
                          <StatusBadge type="warning">
                            <DollarSign className="h-3 w-3 mr-1" />
                            Fine
                          </StatusBadge>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-sm">{correction.originalTime}</td>
                    <td className="p-3 text-sm font-medium text-primary">{correction.correctedTime}</td>
                    <td className="p-3 text-sm text-muted-foreground">{correction.reason}</td>
                    <td className="p-3">
                      <StatusBadge
                        type={
                          correction.status === 'Approved' ? 'success' :
                          correction.status === 'Pending' ? 'warning' : 'error'
                        }
                      >
                        {correction.status}
                      </StatusBadge>
                    </td>
                    <td className="p-3">
                      {correction.suggestFine && correction.status === 'Pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCreateFine(correction)}
                          className="h-7 text-xs"
                        >
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Create Fine
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-4 p-3 rounded-md bg-muted/50 border border-border">
        <p className="text-xs text-muted-foreground">
          <strong>How to use:</strong> Select corrections using checkboxes, then click "Approve Selected" or "Reject Selected" to process multiple corrections at once.
          Corrections marked with a "Fine" badge indicate violations that may warrant penalties.
        </p>
      </div>
    </PageLayout>
  );
}