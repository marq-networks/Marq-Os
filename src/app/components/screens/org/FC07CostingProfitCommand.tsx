import { PageLayout } from '../../shared/PageLayout';
import { Card3D } from '../../shared/Card3D';
import { DataTable } from '../../shared/DataTable';
import { Breadcrumb } from '../../shared/Breadcrumb';
import { FinanceTopTabs } from '../../../finance/components/FinanceTopTabs';
import { useToast } from '../../ui/toast';
import { TrendingUp, DollarSign, AlertTriangle, Calculator } from 'lucide-react';

export function FC07CostingProfitCommand() {
  const { showToast } = useToast();

  const departmentRates = [
    { department: 'Engineering', hourlyRate: 85.00, overheadAllocation: '35%', employees: 4 },
    { department: 'Design', hourlyRate: 75.00, overheadAllocation: '30%', employees: 2 },
    { department: 'Sales', hourlyRate: 65.00, overheadAllocation: '25%', employees: 3 },
    { department: 'Operations', hourlyRate: 55.00, overheadAllocation: '20%', employees: 2 },
    { department: 'Admin', hourlyRate: 45.00, overheadAllocation: '15%', employees: 1 }
  ];

  const profitAnalysis = [
    { project: 'Project Apollo', revenue: 125000, cost: 82000, profit: 43000, margin: '34.4%', status: 'healthy' },
    { project: 'Project Nova', revenue: 85000, cost: 68000, profit: 17000, margin: '20.0%', status: 'watch' },
    { project: 'Project Mars', revenue: 65000, cost: 58000, profit: 7000, margin: '10.8%', status: 'risk' },
    { project: 'Project Zeus', revenue: 95000, cost: 52000, profit: 43000, margin: '45.3%', status: 'healthy' }
  ];

  const rateColumns = [
    { key: 'department', header: 'Department' },
    { 
      key: 'hourlyRate', 
      header: 'Hourly Rate',
      cell: (v: number) => `$${v.toFixed(2)}/hr`
    },
    { key: 'overheadAllocation', header: 'Overhead' },
    { key: 'employees', header: 'Employees' },
    {
      key: 'actions',
      header: '',
      cell: () => (
        <button
          onClick={() => showToast('Edit rate - Creates audit log', 'info')}
          className="px-3 py-1 bg-card border border-border rounded text-xs hover:bg-accent"
        >
          Edit
        </button>
      )
    }
  ];

  const profitColumns = [
    { key: 'project', header: 'Project' },
    { 
      key: 'revenue', 
      header: 'Revenue',
      cell: (v: number) => `$${v.toLocaleString()}`
    },
    { 
      key: 'cost', 
      header: 'Cost',
      cell: (v: number) => `$${v.toLocaleString()}`
    },
    { 
      key: 'profit', 
      header: 'Profit',
      cell: (v: number) => (
        <span className={v > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
          ${v.toLocaleString()}
        </span>
      )
    },
    { 
      key: 'margin', 
      header: 'Margin',
      cell: (v: string, row: any) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{v}</span>
          {row.status === 'risk' && <AlertTriangle className="h-4 w-4 text-orange-500" />}
        </div>
      )
    },
    {
      key: 'actions',
      header: '',
      cell: () => (
        <button
          onClick={() => showToast('Opening detailed profit breakdown', 'info')}
          className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs hover:bg-primary/90"
        >
          Details
        </button>
      )
    }
  ];

  return (
    <PageLayout
      title="ORG – FC-07 – Costing & Profit Command"
      description="Department cost rates, overhead allocation, and profit intelligence"
      kpis={[
        {
          title: 'Average Profit Margin',
          value: '27.6%',
          icon: <TrendingUp className="h-5 w-5" />
        },
        {
          title: 'Total Profit (YTD)',
          value: '$110,000',
          icon: <DollarSign className="h-5 w-5" />
        },
        {
          title: 'Projects at Risk',
          value: '1',
          icon: <AlertTriangle className="h-5 w-5" />
        }
      ]}
    >
      <Breadcrumb items={[
        { label: 'Finance', path: '/org/finance/cockpit' },
        { label: 'Costing & Profit' }
      ]} />
      <FinanceTopTabs />
      <div className="space-y-6">
        {/* Department Cost Rates */}
        <Card3D>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Department Cost Rates</h3>
            <button
              onClick={() => showToast('Bulk update rates', 'info')}
              className="px-4 py-2 bg-card border border-border rounded-lg text-sm hover:bg-accent"
            >
              Bulk Update
            </button>
          </div>
          <DataTable columns={rateColumns} data={departmentRates} />
          <div className="mt-4 p-3 bg-accent/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Rates include base salary + benefits + overhead allocation. 
              Used for project costing and quote profit checks.
            </p>
          </div>
        </Card3D>

        {/* Profit Analysis */}
        <Card3D>
          <h3 className="font-semibold mb-4">Project Profit Analysis</h3>
          <DataTable columns={profitColumns} data={profitAnalysis} />
        </Card3D>

        {/* What-If Simulator */}
        <Card3D>
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="h-5 w-5" />
            <h3 className="font-semibold">Quote Profit Check & What-If Simulator</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Quote Amount</label>
              <input
                type="number"
                placeholder="Enter quote amount"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Estimated Hours</label>
              <input
                type="number"
                placeholder="Enter hours"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Department</label>
              <select className="w-full px-3 py-2 rounded-lg border border-border bg-background">
                <option>Engineering</option>
                <option>Design</option>
                <option>Sales</option>
                <option>Operations</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Team Size</label>
              <input
                type="number"
                placeholder="Number of people"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background"
              />
            </div>
          </div>
          <button
            onClick={() => showToast('Profit projection: $12,450 (28.3% margin)', 'success')}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90"
          >
            Calculate Profit Projection
          </button>
        </Card3D>

        {/* Profit Leakage Detection */}
        <Card3D>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <h3 className="font-semibold">Profit Leakage Detection</h3>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <p className="text-sm font-medium text-orange-600">
                Project Mars: Margin dropped from 22% to 10.8% in last 30 days
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Cost overrun detected. Review time logs and expense allocations.
              </p>
            </div>
            <div className="p-3 bg-accent/50 rounded-lg">
              <p className="text-sm">No other profit leakage detected in active projects</p>
            </div>
          </div>
        </Card3D>

        {/* Info */}
        <div className="bg-accent/50 border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Costing Intelligence:</strong> Real-time profit tracking with department-level cost rates, 
            overhead allocation, quote profit checks, and automated leakage detection. 
            All rate changes are audit logged.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}