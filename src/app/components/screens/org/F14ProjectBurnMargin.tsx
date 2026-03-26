import { PageLayout } from '../../shared/PageLayout';
import { Button } from '../../ui/button';
import { DollarSign, TrendingUp, AlertCircle, Briefcase, ExternalLink, Target, Clock } from 'lucide-react';
import { useState } from 'react';
import { FinanceSubNav } from './FinanceSubNav';

interface ProjectFinancial {
  id: string;
  name: string;
  client: string;
  budget: number;
  actual: number;
  burnRate: number;
  projectedMargin: number;
  billableHours: number;
  nonBillableHours: number;
  tasksLinked: number;
  transactionsLinked: number;
  risk: 'High' | 'Medium' | 'Low' | 'None';
  status: 'Active' | 'On Hold' | 'Completed' | 'At Risk';
}

interface LinkedTransaction {
  id: string;
  date: string;
  narration: string;
  amount: number;
  category: string;
  taskId?: string;
}

export function F14ProjectBurnMargin() {
  const [selectedProject, setSelectedProject] = useState<ProjectFinancial | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);

  // Mock data
  const projects: ProjectFinancial[] = [
    {
      id: 'PRJ-001',
      name: 'Customer Portal Redesign',
      client: 'Acme Corporation',
      budget: 150000,
      actual: 87500,
      burnRate: 58,
      projectedMargin: 35,
      billableHours: 420,
      nonBillableHours: 85,
      tasksLinked: 24,
      transactionsLinked: 12,
      risk: 'None',
      status: 'Active'
    },
    {
      id: 'PRJ-002',
      name: 'Mobile App Development',
      client: 'TechStart Inc',
      budget: 280000,
      actual: 245000,
      burnRate: 87,
      projectedMargin: 12,
      billableHours: 890,
      nonBillableHours: 145,
      tasksLinked: 38,
      transactionsLinked: 28,
      risk: 'Medium',
      status: 'Active'
    },
    {
      id: 'PRJ-003',
      name: 'Data Migration Project',
      client: 'Global Solutions Ltd',
      budget: 95000,
      actual: 102000,
      burnRate: 107,
      projectedMargin: -8,
      billableHours: 520,
      nonBillableHours: 180,
      tasksLinked: 18,
      transactionsLinked: 22,
      risk: 'High',
      status: 'At Risk'
    },
    {
      id: 'PRJ-004',
      name: 'API Integration',
      client: 'Innovation Labs',
      budget: 65000,
      actual: 42000,
      burnRate: 65,
      projectedMargin: 28,
      billableHours: 280,
      nonBillableHours: 45,
      tasksLinked: 12,
      transactionsLinked: 8,
      risk: 'Low',
      status: 'Active'
    },
    {
      id: 'PRJ-005',
      name: 'E-commerce Platform',
      client: 'Retail Co',
      budget: 320000,
      actual: 298000,
      burnRate: 93,
      projectedMargin: 8,
      billableHours: 1240,
      nonBillableHours: 220,
      tasksLinked: 52,
      transactionsLinked: 45,
      risk: 'Medium',
      status: 'Active'
    }
  ];

  const linkedTransactions: LinkedTransaction[] = [
    {
      id: 'TXN-001',
      date: '2026-01-02',
      narration: 'Cloud infrastructure costs - AWS',
      amount: 2400,
      category: 'Software Subscriptions',
      taskId: 'T-145'
    },
    {
      id: 'TXN-002',
      date: '2026-01-01',
      narration: 'Design tools license - Figma Pro',
      amount: 840,
      category: 'Software Subscriptions',
      taskId: 'T-142'
    },
    {
      id: 'TXN-003',
      date: '2025-12-28',
      narration: 'Client meeting expenses',
      amount: 450,
      category: 'Travel',
      taskId: 'T-138'
    }
  ];

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'High':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"><AlertCircle className="h-3 w-3" />High Risk</span>;
      case 'Medium':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20"><AlertCircle className="h-3 w-3" />Medium Risk</span>;
      case 'Low':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20">Low Risk</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">On Track</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <span className="px-2 py-1 rounded text-xs bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">Active</span>;
      case 'At Risk':
        return <span className="px-2 py-1 rounded text-xs bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">At Risk</span>;
      case 'On Hold':
        return <span className="px-2 py-1 rounded text-xs bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20">On Hold</span>;
      default:
        return <span className="px-2 py-1 rounded text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">Completed</span>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleViewDetails = (project: ProjectFinancial) => {
    setSelectedProject(project);
    setShowDrawer(true);
  };

  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalActual = projects.reduce((sum, p) => sum + p.actual, 0);
  const avgBurnRate = Math.round(projects.reduce((sum, p) => sum + p.burnRate, 0) / projects.length);
  const atRiskCount = projects.filter(p => p.risk === 'High' || p.risk === 'Medium').length;

  return (
    <PageLayout
      title="ORG – F-14 – Project Burn & Margin"
      description="Financial health tracking for all projects with linked transactions"
      subNav={<FinanceSubNav />}
      kpis={[
        {
          title: 'Total Budget',
          value: formatCurrency(totalBudget),
          change: `${projects.length} projects`,
          icon: <DollarSign className="h-5 w-5" />
        },
        {
          title: 'Total Actual Spend',
          value: formatCurrency(totalActual),
          change: `${avgBurnRate}% avg burn`,
          changeType: avgBurnRate > 85 ? 'warning' : 'positive',
          icon: <TrendingUp className="h-5 w-5" />
        },
        {
          title: 'At Risk Projects',
          value: atRiskCount.toString(),
          change: 'Needs attention',
          changeType: atRiskCount > 0 ? 'negative' : 'positive',
          icon: <AlertCircle className="h-5 w-5" />
        },
        {
          title: 'Active Projects',
          value: projects.filter(p => p.status === 'Active').length.toString(),
          change: 'In progress',
          icon: <Briefcase className="h-5 w-5" />
        }
      ]}
    >
      <div className="space-y-6">
        {/* Projects Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold">Project</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold">Client</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold">Budget</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold">Actual</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold">Burn %</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold">Margin %</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold">Risk</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold">Status</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr
                    key={project.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{project.name}</p>
                        <p className="text-xs text-muted-foreground">{project.id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{project.client}</td>
                    <td className="px-6 py-4 text-right font-medium">{formatCurrency(project.budget)}</td>
                    <td className="px-6 py-4 text-right font-medium">{formatCurrency(project.actual)}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-bold ${
                        project.burnRate > 100 ? 'text-red-500' :
                        project.burnRate > 85 ? 'text-orange-500' :
                        project.burnRate > 75 ? 'text-yellow-500' :
                        'text-green-500'
                      }`}>
                        {project.burnRate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-bold ${
                        project.projectedMargin < 0 ? 'text-red-500' :
                        project.projectedMargin < 15 ? 'text-orange-500' :
                        'text-green-500'
                      }`}>
                        {project.projectedMargin > 0 ? '+' : ''}{project.projectedMargin}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">{getRiskBadge(project.risk)}</td>
                    <td className="px-6 py-4 text-center">{getStatusBadge(project.status)}</td>
                    <td className="px-6 py-4 text-center">
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetails(project)}>
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold">On Track</h3>
            </div>
            <p className="text-3xl font-bold mb-1">{projects.filter(p => p.risk === 'None' || p.risk === 'Low').length}</p>
            <p className="text-sm text-muted-foreground">Projects within budget</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="font-semibold">Needs Attention</h3>
            </div>
            <p className="text-3xl font-bold mb-1">{projects.filter(p => p.risk === 'Medium').length}</p>
            <p className="text-sm text-muted-foreground">Burn rate 80-100%</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="font-semibold">Critical</h3>
            </div>
            <p className="text-3xl font-bold mb-1">{projects.filter(p => p.risk === 'High').length}</p>
            <p className="text-sm text-muted-foreground">Over budget or at risk</p>
          </div>
        </div>
      </div>

      {/* Project Detail Drawer */}
      {showDrawer && selectedProject && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end"
          onClick={() => setShowDrawer(false)}
        >
          <div
            className="w-full max-w-3xl h-full bg-background border-l border-border overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedProject.name}</h2>
                  <p className="text-sm text-muted-foreground">{selectedProject.client} • {selectedProject.id}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View in WORK
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowDrawer(false)}>
                    ✕
                  </Button>
                </div>
              </div>

              {/* Status & Risk */}
              <div className="flex gap-3">
                {getStatusBadge(selectedProject.status)}
                {getRiskBadge(selectedProject.risk)}
              </div>

              {/* Financial KPIs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Budget</p>
                  <p className="text-2xl font-bold">{formatCurrency(selectedProject.budget)}</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Actual Spend</p>
                  <p className="text-2xl font-bold">{formatCurrency(selectedProject.actual)}</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Burn Rate</p>
                  <p className={`text-2xl font-bold ${
                    selectedProject.burnRate > 100 ? 'text-red-500' :
                    selectedProject.burnRate > 85 ? 'text-orange-500' :
                    'text-green-500'
                  }`}>
                    {selectedProject.burnRate}%
                  </p>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Projected Margin</p>
                  <p className={`text-2xl font-bold ${
                    selectedProject.projectedMargin < 0 ? 'text-red-500' :
                    selectedProject.projectedMargin < 15 ? 'text-orange-500' :
                    'text-green-500'
                  }`}>
                    {selectedProject.projectedMargin > 0 ? '+' : ''}{selectedProject.projectedMargin}%
                  </p>
                </div>
              </div>

              {/* Hours Breakdown */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold mb-4">Hours Breakdown</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Billable Hours</p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">{selectedProject.billableHours}h</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Non-Billable Hours</p>
                    <p className="text-xl font-bold text-red-600 dark:text-red-400">{selectedProject.nonBillableHours}h</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${(selectedProject.billableHours / (selectedProject.billableHours + selectedProject.nonBillableHours)) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {Math.round((selectedProject.billableHours / (selectedProject.billableHours + selectedProject.nonBillableHours)) * 100)}% billable
                  </p>
                </div>
              </div>

              {/* Linked Items */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold mb-4">Linked Items</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Tasks</span>
                    </div>
                    <span className="font-semibold">{selectedProject.tasksLinked}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Transactions</span>
                    </div>
                    <span className="font-semibold">{selectedProject.transactionsLinked}</span>
                  </div>
                </div>
              </div>

              {/* Linked Transactions */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold mb-4">Recent Linked Transactions</h3>
                <div className="space-y-3">
                  {linkedTransactions.map((txn) => (
                    <div key={txn.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs text-muted-foreground">{txn.id}</span>
                          {txn.taskId && (
                            <span className="px-2 py-0.5 rounded text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                              {txn.taskId}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium">{txn.narration}</p>
                        <p className="text-xs text-muted-foreground mt-1">{txn.category} • {txn.date}</p>
                      </div>
                      <p className="text-lg font-bold text-right ml-4">{formatCurrency(txn.amount)}</p>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Transactions
                </Button>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowDrawer(false)} className="flex-1">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
