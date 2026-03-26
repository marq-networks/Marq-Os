/**
 * AT01 - FINES & PENALTIES MANAGEMENT
 * Wired to service layer: useTimeData() → fines (Fine from services/types.ts)
 */

import { useState } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { DataTable } from '../../shared/DataTable';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import {
  AlertTriangle,
  DollarSign,
  FileText,
  TrendingUp,
  Search,
  Download,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  Users,
  Plus,
} from 'lucide-react';
import { useTimeData } from '../../../services';
import type { Fine } from '../../../services';
import { toast } from 'sonner';

export function AT01Fines() {
  const { fines, waiveFine, createFine, loading } = useTimeData();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Derived filter values
  const departments = Array.from(new Set(fines.map(f => f.department))).sort();
  const types = Array.from(new Set(fines.map(f => f.type))).sort();

  const filteredFines = fines.filter(fine => {
    const matchesStatus = filterStatus === 'all' || fine.status === filterStatus;
    const matchesDepartment = filterDepartment === 'all' || fine.department === filterDepartment;
    const matchesType = filterType === 'all' || fine.type === filterType;
    const matchesSearch =
      searchQuery === '' ||
      fine.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fine.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fine.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesDepartment && matchesType && matchesSearch;
  });

  // KPI aggregations
  const totalAmount = fines.reduce((sum, f) => sum + f.amount, 0);
  const pendingFines = fines.filter(f => f.status === 'Active').length;
  const collectedFines = fines.filter(f => f.status === 'Paid').length;
  const waivedFines = fines.filter(f => f.status === 'Waived').length;

  const getStatusBadge = (status: string) => {
    const map: Record<string, 'success' | 'warning' | 'error' | 'info' | 'neutral'> = {
      Paid: 'success',
      Active: 'warning',
      Waived: 'info',
      Disputed: 'error',
    };
    return <StatusBadge type={map[status] ?? 'neutral'}>{status}</StatusBadge>;
  };

  const getTypeBadge = (type: string) => {
    const map: Record<string, 'error' | 'warning' | 'info' | 'neutral'> = {
      'Late Arrival': 'warning',
      'Early Departure': 'warning',
      Absent: 'error',
      'Break Violation': 'info',
      'Policy Violation': 'error',
    };
    return <StatusBadge type={map[type] ?? 'neutral'}>{type}</StatusBadge>;
  };

  const handleWaiveSelected = async () => {
    if (selectedRows.length === 0) return;
    try {
      await Promise.all(
        selectedRows.map(id =>
          waiveFine(id, 'admin@company.com', 'Bulk waiver approved by management'),
        ),
      );
      toast.success(`Waived ${selectedRows.length} fine(s)`);
      setSelectedRows([]);
    } catch {
      toast.error('Failed to waive fines');
    }
  };

  const handleViewDetails = (fine: Fine) => {
    toast.info(`Fine ${fine.id} — ${fine.employeeName} — ${fine.type} — $${fine.amount}`);
  };

  const columns = [
    {
      key: 'id',
      header: 'Fine ID',
      width: '9%',
      cell: (value: string) => (
        <span className="font-mono text-xs font-medium">{value.slice(-6).toUpperCase()}</span>
      ),
    },
    {
      key: 'employeeName',
      header: 'Employee',
      width: '16%',
      cell: (value: string, row: Fine) => (
        <div>
          <div className="font-medium text-sm">{value}</div>
          <div className="text-xs text-muted-foreground">{row.department}</div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Violation',
      width: '16%',
      cell: (value: string) => getTypeBadge(value),
    },
    {
      key: 'description',
      header: 'Description',
      width: '20%',
      cell: (value: string) => (
        <span className="text-xs text-muted-foreground line-clamp-2">{value}</span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      width: '9%',
      cell: (value: number, row: Fine) => (
        <span className="font-semibold text-destructive">
          {row.currency} {value.toFixed(2)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '10%',
      cell: (value: string) => getStatusBadge(value),
    },
    {
      key: 'date',
      header: 'Date',
      width: '10%',
      cell: (value: string) => (
        <span className="text-sm">{new Date(value).toLocaleDateString()}</span>
      ),
    },
    {
      key: 'issuedBy',
      header: 'Issued By',
      width: '8%',
      cell: (value: string) => (
        <span className="text-xs text-muted-foreground">{value}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: '7%',
      cell: (_: any, row: Fine) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewDetails(row)}
            className="h-7 px-2"
          >
            <Eye className="h-3 w-3" />
          </Button>
          {row.status === 'Active' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                await waiveFine(row.id, 'admin@company.com', 'Manually waived');
                toast.success('Fine waived');
              }}
              className="h-7 px-2 text-blue-600"
            >
              <CheckCircle className="h-3 w-3" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <PageLayout
      title="Fines & Penalties Management"
      description="Track and manage time violation fines across the organization"
      actions={
        <div className="flex items-center gap-2">
          {selectedRows.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleWaiveSelected}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Waive Selected ({selectedRows.length})
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button
            size="sm"
            onClick={() => toast.info('Issue Fine modal — wire to createFine()')}
          >
            <Plus className="mr-2 h-4 w-4" />
            Issue Fine
          </Button>
        </div>
      }
      kpis={[
        {
          title: 'Total Fines',
          value: String(fines.length),
          change: `${pendingFines} active`,
          changeType: pendingFines > 0 ? 'negative' : 'neutral',
          icon: <AlertTriangle className="h-5 w-5" />,
        },
        {
          title: 'Total Amount',
          value: `$${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 0 })}`,
          change: `${collectedFines} collected`,
          changeType: 'neutral',
          icon: <DollarSign className="h-5 w-5" />,
        },
        {
          title: 'Pending',
          value: String(pendingFines),
          change: 'Awaiting resolution',
          changeType: pendingFines > 0 ? 'negative' : 'positive',
          icon: <Clock className="h-5 w-5" />,
        },
        {
          title: 'Waived',
          value: String(waivedFines),
          change: 'Management discretion',
          changeType: 'neutral',
          icon: <FileText className="h-5 w-5" />,
        },
      ]}
    >
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            className="pl-8 pr-3 py-1.5 rounded-md border border-border bg-background text-sm w-full focus:outline-none focus:ring-1 focus:ring-ring"
            placeholder="Search by name, ID, department…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="rounded-md border border-border bg-background text-sm px-2.5 py-1.5 focus:outline-none"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Paid">Paid</option>
          <option value="Waived">Waived</option>
          <option value="Disputed">Disputed</option>
        </select>
        <select
          className="rounded-md border border-border bg-background text-sm px-2.5 py-1.5 focus:outline-none"
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
        >
          <option value="all">All Violations</option>
          {types.map(t => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          className="rounded-md border border-border bg-background text-sm px-2.5 py-1.5 focus:outline-none"
          value={filterDepartment}
          onChange={e => setFilterDepartment(e.target.value)}
        >
          <option value="all">All Departments</option>
          {departments.map(d => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40 text-muted-foreground">
          Loading fines…
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card">
          <DataTable
            columns={columns}
            data={filteredFines}
            selectable
            selectedRows={selectedRows}
            onRowSelect={setSelectedRows}
          />
          {filteredFines.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <CheckCircle className="h-10 w-10 mb-2 text-green-500" />
              <p>No fines match your current filters.</p>
            </div>
          )}
        </div>
      )}
    </PageLayout>
  );
}
