import { PageLayout } from '../../shared/PageLayout';
import { DataTable } from '../../shared/DataTable';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { FormDrawer } from '../../shared/FormDrawer';
import { FormField, Input, Select, TextArea } from '../../ui/form';
import { useToast } from '../../ui/toast';
import { 
  Clock, 
  Users, 
  DollarSign, 
  Filter,
  Download,
  Eye,
  Receipt,
  ArrowRight
} from 'lucide-react';
import { useState } from 'react';

interface TimeLogEntry {
  id: string;
  employee: string;
  department: string;
  date: string;
  task: string;
  project: string;
  hours: number;
  description: string;
  departmentCostRate: number;
  costValue: number;
  postedToFinance: boolean;
  billable: boolean;
}

const mockTimeLogEntries: TimeLogEntry[] = [
  {
    id: 'TL-001',
    employee: 'Michael Chen',
    department: 'Engineering',
    date: '2025-12-30',
    task: 'T-045 – API Endpoint Development',
    project: 'Platform API Rebuild',
    hours: 6.5,
    description: 'Implemented REST API endpoints for user management',
    departmentCostRate: 85,
    costValue: 552.50,
    postedToFinance: true,
    billable: true
  },
  {
    id: 'TL-002',
    employee: 'Emily Rodriguez',
    department: 'Design',
    date: '2025-12-30',
    task: 'T-012 – Homepage Redesign',
    project: 'Website Redesign',
    hours: 5.0,
    description: 'Created mobile-first responsive designs',
    departmentCostRate: 70,
    costValue: 350.00,
    postedToFinance: false,
    billable: true
  },
  {
    id: 'TL-003',
    employee: 'Sarah Johnson',
    department: 'Engineering',
    date: '2025-12-30',
    task: 'T-089 – Database Optimization',
    project: 'Platform API Rebuild',
    hours: 8.0,
    description: 'Query optimization and indexing improvements',
    departmentCostRate: 95,
    costValue: 760.00,
    postedToFinance: true,
    billable: true
  },
  {
    id: 'TL-004',
    employee: 'David Kim',
    department: 'Marketing',
    date: '2025-12-29',
    task: 'T-033 – Content Strategy',
    project: 'Q1 Marketing Campaign',
    hours: 4.5,
    description: 'Developed content calendar for Q1',
    departmentCostRate: 65,
    costValue: 292.50,
    postedToFinance: false,
    billable: false
  },
  {
    id: 'TL-005',
    employee: 'Lisa Anderson',
    department: 'HR',
    date: '2025-12-29',
    task: 'T-056 – Recruitment Planning',
    project: 'Internal Operations',
    hours: 3.5,
    description: 'Interview scheduling and candidate review',
    departmentCostRate: 60,
    costValue: 210.00,
    postedToFinance: false,
    billable: false
  },
  {
    id: 'TL-006',
    employee: 'Michael Chen',
    department: 'Engineering',
    date: '2025-12-29',
    task: 'T-067 – Security Audit',
    project: 'Platform API Rebuild',
    hours: 7.0,
    description: 'Conducted security review and penetration testing',
    departmentCostRate: 85,
    costValue: 595.00,
    postedToFinance: true,
    billable: true
  },
  {
    id: 'TL-007',
    employee: 'Emma Davis',
    department: 'Engineering',
    date: '2025-12-28',
    task: 'T-078 – Frontend Components',
    project: 'Website Redesign',
    hours: 6.0,
    description: 'Built reusable React components',
    departmentCostRate: 80,
    costValue: 480.00,
    postedToFinance: false,
    billable: true
  },
  {
    id: 'TL-008',
    employee: 'James Wilson',
    department: 'Design',
    date: '2025-12-28',
    task: 'T-091 – Brand Guidelines',
    project: 'Website Redesign',
    hours: 4.0,
    description: 'Updated brand style guide and component library',
    departmentCostRate: 70,
    costValue: 280.00,
    postedToFinance: false,
    billable: true
  }
];

export function W04TimeLogs() {
  const { showToast } = useToast();
  const [viewMode, setViewMode] = useState<'time' | 'money'>('time');
  const [timeLogEntries, setTimeLogEntries] = useState(mockTimeLogEntries);
  const [selectedLog, setSelectedLog] = useState<TimeLogEntry | null>(null);
  const [isPostDrawerOpen, setIsPostDrawerOpen] = useState(false);

  const handlePostToFinance = async () => {
    if (!selectedLog) return;

    await new Promise(resolve => setTimeout(resolve, 1000));

    setTimeLogEntries(prev => prev.map(log =>
      log.id === selectedLog.id
        ? { ...log, postedToFinance: true }
        : log
    ));

    showToast('success', 'Posted to Finance', `${selectedLog.hours}h cost entry created in Finance Ledger (pending approval)`);
    setIsPostDrawerOpen(false);
    setSelectedLog(null);
  };

  const handlePostSelected = (log: TimeLogEntry) => {
    setSelectedLog(log);
    setIsPostDrawerOpen(true);
  };

  const totalHours = timeLogEntries.reduce((sum, log) => sum + log.hours, 0);
  const totalCost = timeLogEntries.reduce((sum, log) => sum + log.costValue, 0);
  const postedCount = timeLogEntries.filter(log => log.postedToFinance).length;
  const pendingCount = timeLogEntries.filter(log => !log.postedToFinance).length;

  const timeColumns = [
    { key: 'employee', header: 'Employee', width: '15%' },
    { key: 'department', header: 'Department', width: '12%' },
    { key: 'date', header: 'Date', width: '10%' },
    { key: 'task', header: 'Task', width: '20%' },
    { key: 'project', header: 'Project', width: '18%' },
    { 
      key: 'hours', 
      header: 'Hours', 
      width: '8%',
      cell: (value: number) => `${value.toFixed(1)}h`
    },
    { 
      key: 'postedToFinance', 
      header: 'Status', 
      width: '10%',
      cell: (value: boolean) => (
        <StatusBadge type={value ? 'success' : 'warning'}>
          {value ? 'Posted' : 'Pending'}
        </StatusBadge>
      )
    },
    {
      key: 'actions',
      header: '',
      width: '7%',
      cell: (_: any, row: TimeLogEntry) => (
        !row.postedToFinance && (
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => handlePostSelected(row)}
          >
            <Receipt className="h-3 w-3" />
          </Button>
        )
      )
    }
  ];

  const moneyColumns = [
    { key: 'employee', header: 'Employee', width: '13%' },
    { key: 'department', header: 'Department', width: '11%' },
    { 
      key: 'hours', 
      header: 'Hours', 
      width: '8%',
      cell: (value: number) => `${value.toFixed(1)}h`
    },
    { 
      key: 'departmentCostRate', 
      header: 'Dept Rate', 
      width: '10%',
      cell: (value: number) => `$${value}/h`
    },
    { 
      key: 'costValue', 
      header: 'Cost Value', 
      width: '10%',
      cell: (value: number) => (
        <span className="font-semibold">${value.toLocaleString()}</span>
      )
    },
    { key: 'task', header: 'Task', width: '15%' },
    { key: 'project', header: 'Project', width: '13%' },
    { 
      key: 'postedToFinance', 
      header: 'Posted to Finance', 
      width: '13%',
      cell: (value: boolean) => (
        <StatusBadge type={value ? 'success' : 'warning'}>
          {value ? 'Yes' : 'No'}
        </StatusBadge>
      )
    },
    {
      key: 'actions',
      header: '',
      width: '7%',
      cell: (_: any, row: TimeLogEntry) => (
        !row.postedToFinance && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handlePostSelected(row)}
          >
            Post
          </Button>
        )
      )
    }
  ];

  return (
    <PageLayout
      title="ADMIN – W-04 – Time Logs – v2.0"
      description="View time entries as hours or cost values"
      actions={
        <>
          <div className="flex items-center gap-2 mr-4">
            <Button
              size="sm"
              variant={viewMode === 'time' ? 'default' : 'outline'}
              onClick={() => setViewMode('time')}
            >
              <Clock className="mr-2 h-4 w-4" />
              View as Time
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'money' ? 'default' : 'outline'}
              onClick={() => setViewMode('money')}
            >
              <DollarSign className="mr-2 h-4 w-4" />
              View as Money
            </Button>
          </div>
          <Button size="sm" variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button size="sm" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </>
      }
      kpis={[
        {
          title: viewMode === 'time' ? 'Total Hours' : 'Total Cost',
          value: viewMode === 'time' 
            ? `${totalHours.toFixed(1)}h`
            : `$${totalCost.toLocaleString()}`,
          icon: viewMode === 'time' ? <Clock className="h-5 w-5" /> : <DollarSign className="h-5 w-5" />
        },
        {
          title: 'Time Entries',
          value: timeLogEntries.length.toString(),
          change: `${postedCount} posted`,
          changeType: 'positive',
          icon: <Eye className="h-5 w-5" />
        },
        {
          title: 'Posted to Finance',
          value: postedCount.toString(),
          change: `${pendingCount} pending`,
          changeType: pendingCount > 0 ? 'warning' : 'positive',
          icon: <Receipt className="h-5 w-5" />
        },
        {
          title: 'Avg Cost Rate',
          value: `$${Math.round(totalCost / totalHours)}/h`,
          icon: <DollarSign className="h-5 w-5" />
        }
      ]}
    >
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3>{viewMode === 'time' ? 'Time Entries' : 'Cost Breakdown'}</h3>
          {viewMode === 'money' && pendingCount > 0 && (
            <div className="text-sm text-muted-foreground">
              <span className="text-yellow-600 dark:text-yellow-400 font-semibold">{pendingCount}</span> entries pending finance posting
            </div>
          )}
        </div>
        <DataTable 
          columns={viewMode === 'time' ? timeColumns : moneyColumns} 
          data={timeLogEntries} 
        />
      </div>

      {/* Post to Finance Drawer */}
      <FormDrawer
        isOpen={isPostDrawerOpen}
        onClose={() => {
          setIsPostDrawerOpen(false);
          setSelectedLog(null);
        }}
        title="Post to Finance Ledger"
        description="Create a cost entry in the Finance Ledger"
        onSubmit={handlePostToFinance}
        submitLabel="Post to Finance"
      >
        {selectedLog && (
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Cost Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-800 dark:text-blue-200">Employee:</span>
                  <span className="font-semibold text-blue-900 dark:text-blue-100">{selectedLog.employee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-800 dark:text-blue-200">Department:</span>
                  <span className="font-semibold text-blue-900 dark:text-blue-100">{selectedLog.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-800 dark:text-blue-200">Hours Logged:</span>
                  <span className="font-semibold text-blue-900 dark:text-blue-100">{selectedLog.hours.toFixed(1)}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-800 dark:text-blue-200">Dept Cost Rate:</span>
                  <span className="font-semibold text-blue-900 dark:text-blue-100">${selectedLog.departmentCostRate}/h</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-blue-300 dark:border-blue-700">
                  <span className="text-blue-800 dark:text-blue-200 font-semibold">Total Cost:</span>
                  <span className="font-bold text-blue-900 dark:text-blue-100">${selectedLog.costValue.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <FormField label="Project" required>
              <Input value={selectedLog.project} disabled />
            </FormField>

            <FormField label="Task" required>
              <Input value={selectedLog.task} disabled />
            </FormField>

            <FormField label="Entry Type">
              <Select value="salary_cost" disabled>
                <option value="salary_cost">Salary Cost (Time Log)</option>
              </Select>
            </FormField>

            <FormField label="Billable">
              <div className="flex items-center gap-2">
                <StatusBadge type={selectedLog.billable ? 'success' : 'neutral'}>
                  {selectedLog.billable ? 'Billable' : 'Non-Billable'}
                </StatusBadge>
              </div>
            </FormField>

            <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Note:</strong> This will create a Finance Ledger entry in "Pending Approval" status. 
                Finance team must approve before it affects project burn calculations.
              </p>
            </div>
          </div>
        )}
      </FormDrawer>
    </PageLayout>
  );
}
