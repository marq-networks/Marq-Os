import { PageLayout } from '../../shared/PageLayout';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { useToast } from '../../ui/toast';
import { 
  PieChart as PieChartIcon, 
  Download,
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Target,
  Calendar,
  X,
  Search
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface ChartData {
  label: string;
  value: number;
  color: string;
}

interface TaskAnalytics {
  task: string;
  project: string;
  estimated: number;
  actual: number;
  variance: number;
  billable: boolean;
  profit: number;
  week: number;  // Week number (1-4)
  month: string; // Month name
  quarter: string; // Q1, Q2, Q3, Q4
}

// LocalStorage key
const REPORTS_FILTERS_KEY = 'workos_work_reports_filters';

const mockTaskAnalytics: TaskAnalytics[] = [
  {
    task: 'Design user authentication',
    project: 'Mobile App Redesign',
    estimated: 8,
    actual: 5.5,
    variance: -2.5,
    billable: true,
    profit: 375,
    week: 1,
    month: 'January',
    quarter: 'Q1'
  },
  {
    task: 'Fix payment gateway bug',
    project: 'E-commerce Platform',
    estimated: 6,
    actual: 8.5,
    variance: 2.5,
    billable: true,
    profit: -250,
    week: 1,
    month: 'January',
    quarter: 'Q1'
  },
  {
    task: 'Client feedback implementation',
    project: 'Website Redesign',
    estimated: 5,
    actual: 4.5,
    variance: -0.5,
    billable: true,
    profit: 75,
    week: 2,
    month: 'January',
    quarter: 'Q1'
  },
  {
    task: 'Update API documentation',
    project: 'Platform API',
    estimated: 4,
    actual: 3.5,
    variance: -0.5,
    billable: false,
    profit: 0,
    week: 2,
    month: 'January',
    quarter: 'Q1'
  },
  {
    task: 'Mobile responsiveness fixes',
    project: 'Website Redesign',
    estimated: 3,
    actual: 3.2,
    variance: 0.2,
    billable: true,
    profit: -30,
    week: 3,
    month: 'January',
    quarter: 'Q1'
  },
  {
    task: 'Database optimization',
    project: 'E-commerce Platform',
    estimated: 10,
    actual: 9.5,
    variance: -0.5,
    billable: true,
    profit: 450,
    week: 3,
    month: 'January',
    quarter: 'Q1'
  },
  {
    task: 'UI component library',
    project: 'Mobile App Redesign',
    estimated: 12,
    actual: 14.5,
    variance: 2.5,
    billable: true,
    profit: -375,
    week: 4,
    month: 'January',
    quarter: 'Q1'
  },
  {
    task: 'Security audit',
    project: 'Platform API',
    estimated: 8,
    actual: 7.5,
    variance: -0.5,
    billable: true,
    profit: 225,
    week: 4,
    month: 'January',
    quarter: 'Q1'
  }
];

const clientBurnRate: ChartData[] = [
  { label: 'Acme Corp', value: 42, color: '#3b82f6' },
  { label: 'TechStart Inc', value: 35, color: '#10b981' },
  { label: 'Global Solutions', value: 28, color: '#f59e0b' },
  { label: 'Brand Studio', value: 15, color: '#8b5cf6' }
];

const teamLoad: ChartData[] = [
  { label: 'Sarah Johnson', value: 42, color: '#ef4444' },
  { label: 'Michael Chen', value: 38, color: '#f59e0b' },
  { label: 'Emma Davis', value: 35, color: '#10b981' },
  { label: 'David Wilson', value: 28, color: '#3b82f6' },
  { label: 'Lisa Anderson', value: 24, color: '#8b5cf6' },
  { label: 'James Martinez', value: 30, color: '#06b6d4' }
];

export function W05WorkReports() {
  const { showToast } = useToast();
  
  // Load filters from localStorage
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter'>(() => {
    try {
      const stored = localStorage.getItem(REPORTS_FILTERS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.dateRange || 'week';
      }
    } catch (error) {
      console.error('Failed to load filters from localStorage:', error);
    }
    return 'week';
  });

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    project: 'all',
    billable: 'all',
    search: ''
  });

  // Save dateRange to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem(REPORTS_FILTERS_KEY, JSON.stringify({ dateRange, filters }));
    } catch (error) {
      console.error('Failed to save filters to localStorage:', error);
    }
  }, [dateRange, filters]);

  // Filter tasks based on date range and filters
  const filteredTasks = mockTaskAnalytics.filter(task => {
    // Filter by date range
    let matchesDateRange = true;
    if (dateRange === 'week') {
      matchesDateRange = task.week === 1; // Show week 1 by default
    } else if (dateRange === 'month') {
      matchesDateRange = task.month === 'January'; // Show January by default
    } else if (dateRange === 'quarter') {
      matchesDateRange = task.quarter === 'Q1'; // Show Q1 by default
    }

    // Filter by project
    const matchesProject = filters.project === 'all' || task.project === filters.project;
    
    // Filter by billable
    const matchesBillable = filters.billable === 'all' || 
      (filters.billable === 'billable' && task.billable) ||
      (filters.billable === 'non-billable' && !task.billable);
    
    // Filter by search
    const matchesSearch = filters.search === '' ||
      task.task.toLowerCase().includes(filters.search.toLowerCase()) ||
      task.project.toLowerCase().includes(filters.search.toLowerCase());

    return matchesDateRange && matchesProject && matchesBillable && matchesSearch;
  });

  // Calculate KPIs based on filtered data
  const totalProfit = filteredTasks.reduce((sum, t) => sum + t.profit, 0);
  const totalVariance = filteredTasks.reduce((sum, t) => sum + t.variance, 0);
  const avgAccuracy = filteredTasks.length > 0 ? Math.round(
    (1 - Math.abs(totalVariance) / filteredTasks.reduce((sum, t) => sum + t.estimated, 0)) * 100
  ) : 0;
  const billableHours = filteredTasks.filter(t => t.billable).reduce((sum, t) => sum + t.actual, 0);

  // Export to CSV
  const handleExportToCSV = () => {
    const headers = [
      'Task',
      'Project',
      'Estimated Hours',
      'Actual Hours',
      'Variance',
      'Accuracy %',
      'Billable',
      'Profit',
      'Week',
      'Month',
      'Quarter'
    ];
    
    const csvData = filteredTasks.map(t => {
      const accuracy = Math.round((1 - Math.abs(t.variance) / t.estimated) * 100);
      return [
        t.task,
        t.project,
        t.estimated,
        t.actual,
        t.variance,
        accuracy,
        t.billable ? 'Yes' : 'No',
        t.profit,
        t.week,
        t.month,
        t.quarter
      ];
    });
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `\"${cell}\"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `work_reports_${dateRange}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('success', 'Export successful', `Exported ${filteredTasks.length} tasks to CSV`);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      project: 'all',
      billable: 'all',
      search: ''
    });
    showToast('success', 'Filters cleared', 'All filters have been reset');
  };

  const handleExport = (type: string) => {
    handleExportToCSV();
  };

  // Get unique projects for filter dropdown
  const uniqueProjects = Array.from(new Set(mockTaskAnalytics.map(t => t.project)));

  const activeFiltersCount = Object.values(filters).filter((v, i) => i < 2 && v !== 'all').length + (filters.search ? 1 : 0);

  const SimpleBarChart = ({ data, title }: { data: ChartData[]; title: string }) => {
    const maxValue = Math.max(...data.map(d => d.value));

    return (
      <div>
        <h4 className="font-semibold mb-4">{title}</h4>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="truncate max-w-[150px]">{item.label}</span>
                <span className="font-medium">{item.value}h</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all"
                  style={{ 
                    width: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: item.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const SimplePieChart = ({ data, title }: { data: ChartData[]; title: string }) => {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    
    return (
      <div>
        <h4 className="font-semibold mb-4">{title}</h4>
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-48 h-48">
            <svg viewBox="0 0 100 100" className="transform -rotate-90">
              {data.reduce((acc, item, index) => {
                const percentage = (item.value / total) * 100;
                const prevPercentages = data.slice(0, index).reduce((sum, d) => sum + (d.value / total) * 100, 0);
                const strokeDasharray = `${percentage} ${100 - percentage}`;
                const strokeDashoffset = -prevPercentages;

                return [
                  ...acc,
                  <circle
                    key={index}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={item.color}
                    strokeWidth="20"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                  />
                ];
              }, [] as React.ReactElement[])}
            </svg>
          </div>
        </div>
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="truncate max-w-[120px]">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{item.value}h</span>
                <span className="text-muted-foreground">
                  ({Math.round((item.value / total) * 100)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <PageLayout
      title="ADMIN – W-05 – Work Reports – v1.3"
      description="Comprehensive work analytics and insights"
      actions={
        <>
          <div className="flex items-center gap-2 border border-border rounded-lg p-1">
            <Button 
              size="sm" 
              variant={dateRange === 'week' ? 'default' : 'ghost'}
              onClick={() => setDateRange('week')}
            >
              Week
            </Button>
            <Button 
              size="sm" 
              variant={dateRange === 'month' ? 'default' : 'ghost'}
              onClick={() => setDateRange('month')}
            >
              Month
            </Button>
            <Button 
              size="sm" 
              variant={dateRange === 'quarter' ? 'default' : 'ghost'}
              onClick={() => setDateRange('quarter')}
            >
              Quarter
            </Button>
          </div>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="mr-2 h-4 w-4" />
            Filter
            {activeFiltersCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </Button>
          <Button variant="outline" onClick={() => handleExport('Detailed')}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </>
      }
      kpis={[
        {
          title: 'Total Profit',
          value: `$${totalProfit.toLocaleString()}`,
          change: totalProfit > 0 ? 'Above estimate' : 'Below estimate',
          changeType: totalProfit > 0 ? 'positive' : 'danger',
          icon: <DollarSign className="h-5 w-5" />
        },
        {
          title: 'Time Variance',
          value: `${Math.abs(totalVariance).toFixed(1)}h`,
          change: totalVariance < 0 ? 'Under estimate' : 'Over estimate',
          changeType: totalVariance < 0 ? 'positive' : 'warning',
          icon: <Clock className="h-5 w-5" />
        },
        {
          title: 'Estimate Accuracy',
          value: `${avgAccuracy}%`,
          change: avgAccuracy > 85 ? 'Excellent' : 'Needs improvement',
          changeType: avgAccuracy > 85 ? 'positive' : 'warning',
          icon: <Target className="h-5 w-5" />
        },
        {
          title: 'Billable Hours',
          value: `${billableHours.toFixed(1)}h`,
          change: 'This period',
          icon: <Calendar className="h-5 w-5" />
        },
      ]}
    >
      <div className="space-y-6">
        {/* Time vs Estimate Analysis */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold">Time vs Estimate Analysis</h3>
            <Button size="sm" variant="outline" onClick={() => handleExport('Time Analysis')}>
              <Download className="mr-2 h-3 w-3" />
              Export
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-sm">Task</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Project</th>
                  <th className="text-right py-3 px-4 font-semibold text-sm">Estimated</th>
                  <th className="text-right py-3 px-4 font-semibold text-sm">Actual</th>
                  <th className="text-right py-3 px-4 font-semibold text-sm">Variance</th>
                  <th className="text-right py-3 px-4 font-semibold text-sm">Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task, index) => {
                  const accuracy = Math.round((1 - Math.abs(task.variance) / task.estimated) * 100);
                  return (
                    <tr key={index} className="border-b border-border last:border-0">
                      <td className="py-3 px-4">
                        <div className="font-medium text-sm">{task.task}</div>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {task.project}
                      </td>
                      <td className="py-3 px-4 text-right text-sm">{task.estimated}h</td>
                      <td className="py-3 px-4 text-right text-sm font-medium">{task.actual}h</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`text-sm font-medium ${
                          task.variance < 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {task.variance > 0 ? '+' : ''}{task.variance}h
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <StatusBadge type={accuracy > 85 ? 'success' : accuracy > 70 ? 'warning' : 'danger'}>
                          {accuracy}%
                        </StatusBadge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Profit per Task */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">Profit per Task</h3>
              <Button size="sm" variant="outline" onClick={() => handleExport('Profit Analysis')}>
                <Download className="mr-2 h-3 w-3" />
                Export
              </Button>
            </div>
            <div className="space-y-4">
              {filteredTasks
                .filter(t => t.billable)
                .sort((a, b) => b.profit - a.profit)
                .map((task, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{task.task}</div>
                      <div className="text-xs text-muted-foreground">{task.project}</div>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      {task.profit >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                      )}
                      <span className={`font-semibold ${
                        task.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        ${Math.abs(task.profit)}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total Profit</span>
                <span className={`font-bold text-lg ${
                  totalProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  ${totalProfit.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Client Burn Rate */}
          <div className="bg-card border border-border rounded-lg p-6">
            <SimplePieChart data={clientBurnRate} title="Client Burn Rate" />
          </div>
        </div>

        {/* Team Load Distribution */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="grid grid-cols-2 gap-8">
            <SimpleBarChart data={teamLoad} title="Team Load Distribution" />
            
            <div>
              <h4 className="font-semibold mb-4">Weekly Summary</h4>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="font-semibold text-green-900 dark:text-green-100">
                      Top Performer
                    </span>
                  </div>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    Sarah Johnson completed 8 tasks with 95% accuracy
                  </p>
                </div>

                <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    <span className="font-semibold text-yellow-900 dark:text-yellow-100">
                      Time Management
                    </span>
                  </div>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Team finished 2.5h under total estimates this week
                  </p>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="font-semibold text-blue-900 dark:text-blue-100">
                      Revenue
                    </span>
                  </div>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    $4,250 in billable hours this week
                  </p>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">Recommendations</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Increase buffer time for bug fixes by 20%</li>
                    <li>Allocate more design review time</li>
                    <li>Consider pair programming for complex tasks</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-4">Export Reports</h3>
          <div className="grid grid-cols-4 gap-4">
            <Button variant="outline" onClick={() => handleExport('Time Analysis')}>
              <Download className="mr-2 h-4 w-4" />
              Time Analysis
            </Button>
            <Button variant="outline" onClick={() => handleExport('Profit Report')}>
              <Download className="mr-2 h-4 w-4" />
              Profit Report
            </Button>
            <Button variant="outline" onClick={() => handleExport('Client Breakdown')}>
              <Download className="mr-2 h-4 w-4" />
              Client Breakdown
            </Button>
            <Button variant="outline" onClick={() => handleExport('Team Performance')}>
              <Download className="mr-2 h-4 w-4" />
              Team Performance
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-card border border-border rounded-lg p-6 mt-6">
          <h3 className="font-semibold mb-4">Filters</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project</label>
              <select
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={filters.project}
                onChange={e => setFilters({ ...filters, project: e.target.value })}
              >
                <option value="all">All Projects</option>
                {uniqueProjects.map(project => (
                  <option key={project} value={project}>{project}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Billable</label>
              <select
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={filters.billable}
                onChange={e => setFilters({ ...filters, billable: e.target.value })}
              >
                <option value="all">All</option>
                <option value="billable">Billable</option>
                <option value="non-billable">Non-Billable</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Search</label>
              <input
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search tasks or projects"
              />
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={handleClearFilters}>
                <X className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}