// ═══════════════════════════════════════════════════════════════════════════
// ADMIN SCREEN: A-99 — FINANCE ENGINE CONSOLE
// ═══════════════════════════════════════════════════════════════════════════
// Comprehensive monitoring and control panel for all 11 Financial Intelligence Engines
// Version: 1.0 | Build: CONSOLE-MASTER

import { useState } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { Card3D } from '../../shared/Card3D';
import { 
  Activity, 
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  DollarSign,
  BarChart3,
  Brain,
  Link2,
  MessageSquare,
  Settings,
  CheckCircle2,
} from 'lucide-react';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  generateMockFinanceEngineState, 
  mockDepartments,
  mockProjectBurnData,
  mockClientProfitability,
  mockBurnRiskAlerts,
} from '../../../engines/finance/mockData';
import { getEngineHealthStatus } from '../../../engines/finance';

export function A99EngineConsole() {
  const [engineState] = useState(() => generateMockFinanceEngineState());
  const engineHealth = getEngineHealthStatus(engineState);

  const engines = [
    {
      id: 'engine-01',
      code: 'ORG-F-ENGINE-01',
      name: 'Department Cost Matrix',
      status: 'active',
      icon: Users,
      color: '#3b82f6',
      description: 'Live cost table: salary + overhead → cost/hour → cost/minute',
      metrics: [
        { label: 'Departments', value: engineState.departmentCostMatrix?.rows.length || 0 },
        { label: 'Employees', value: engineState.departmentCostMatrix?.totalEmployees || 0 },
        { label: 'Avg Cost/Hr', value: `$${engineState.departmentCostMatrix?.averageCostPerHour.toFixed(2)}` },
      ],
    },
    {
      id: 'engine-02',
      code: 'ORG-F-ENGINE-02',
      name: 'Payroll Propagation Router',
      status: 'active',
      icon: DollarSign,
      color: '#10b981',
      description: 'Auto-explodes payroll → dept costs → salary liability → cash deductions',
      metrics: [
        { label: 'Monthly Salary', value: `$${(engineState.departmentCostMatrix?.totalMonthlySalary || 0).toLocaleString()}` },
        { label: 'Auto-Posted', value: '100%' },
        { label: 'Linked to Matrix', value: 'Yes' },
      ],
    },
    {
      id: 'engine-03',
      code: 'ORG-F-ENGINE-03',
      name: 'Overhead Allocator',
      status: 'active',
      icon: Settings,
      color: '#f59e0b',
      description: 'Auto-distributes overhead by headcount/revenue/manual/dept ratio',
      metrics: [
        { label: 'Overhead Items', value: engineState.overheadAllocation?.items.length || 0 },
        { label: 'Total/Month', value: `$${(engineState.overheadAllocation?.totalMonthlyOverhead || 0).toLocaleString()}` },
        { label: 'Rules Active', value: engineState.overheadAllocation?.items.filter(i => i.isActive).length || 0 },
      ],
    },
    {
      id: 'engine-04',
      code: 'ORG-F-ENGINE-04',
      name: 'Project Burn Risk Core',
      status: 'active',
      icon: AlertTriangle,
      color: '#ef4444',
      description: 'Live cost injection → burn risk scoring → margin drift warnings',
      metrics: [
        { label: 'Projects Tracked', value: Object.keys(engineState.projectBurnData).length },
        { label: 'High Risk', value: mockProjectBurnData.filter(p => p.burnRiskScore > 70).length },
        { label: 'Active Alerts', value: engineState.burnRiskAlerts.length },
      ],
    },
    {
      id: 'engine-05',
      code: 'ORG-F-ENGINE-05',
      name: 'Client Profitability Index',
      status: 'active',
      icon: TrendingUp,
      color: '#8b5cf6',
      description: 'Rolling profit index: revenue/cost/profit/hour → risk scoring',
      metrics: [
        { label: 'Clients Tracked', value: Object.keys(engineState.clientProfitability).length },
        { label: 'High Risk', value: mockClientProfitability.filter(c => c.riskLevel === 'high').length },
        { label: 'Avg Profit/Hr', value: `$${mockClientProfitability.reduce((s, c) => s + c.profitPerHour30d, 0) / mockClientProfitability.length || 0}` },
      ],
    },
    {
      id: 'engine-06',
      code: 'ORG-F-ENGINE-06',
      name: 'Quote Simulation Engine',
      status: 'active',
      icon: BarChart3,
      color: '#06b6d4',
      description: 'What-if quote simulator → margin calc → loss risk → recommendation',
      metrics: [
        { label: 'Simulations Run', value: '47' },
        { label: 'Avg Margin', value: '23.5%' },
        { label: 'Approved', value: '82%' },
      ],
    },
    {
      id: 'engine-07',
      code: 'ORG-F-ENGINE-07',
      name: 'What-If Sandbox',
      status: 'active',
      icon: Activity,
      color: '#ec4899',
      description: 'Simulate hiring/salary/tool/price changes → impact analysis',
      metrics: [
        { label: 'Scenarios', value: '12' },
        { label: 'Active Sims', value: '3' },
        { label: 'Confidence', value: '87%' },
      ],
    },
    {
      id: 'engine-08',
      code: 'ORG-F-ENGINE-08',
      name: 'Profit Velocity Engine',
      status: 'active',
      icon: Zap,
      color: '#eab308',
      description: 'Real-time velocity: profit/hr, burn/day, margin velocity, leakage',
      metrics: [
        { label: 'Profit/Hour', value: `$${engineState.profitVelocity?.profitPerHour.toFixed(2)}` },
        { label: 'Burn/Day', value: `$${engineState.profitVelocity?.burnPerDay.toLocaleString()}` },
        { label: 'Leakage', value: `${engineState.profitVelocity?.overheadLeakage.toFixed(1)}%` },
      ],
    },
    {
      id: 'engine-09',
      code: 'ORG-F-ENGINE-09',
      name: 'Finance ↔ Work Wiring',
      status: engineState.workWiringActive ? 'active' : 'idle',
      icon: Link2,
      color: '#14b8a6',
      description: 'Tasks/projects inject time × dept cost → Cost/Burn/Margin engines',
      metrics: [
        { label: 'Wirings Active', value: engineState.workWiringActive ? 'Yes' : 'No' },
        { label: 'Auto-Route', value: '100%' },
        { label: 'Real-time', value: 'Yes' },
      ],
    },
    {
      id: 'engine-10',
      code: 'ORG-F-ENGINE-10',
      name: 'Finance ↔ Chat Wiring',
      status: engineState.chatWiringActive ? 'active' : 'idle',
      icon: MessageSquare,
      color: '#a855f7',
      description: 'Chat actions: submit expense, trigger approval, attach evidence',
      metrics: [
        { label: 'Commands Active', value: '5' },
        { label: 'Slash Cmds', value: 'Enabled' },
        { label: 'Auto-Exec', value: 'Yes' },
      ],
    },
    {
      id: 'engine-11',
      code: 'ORG-F-ENGINE-11',
      name: 'AI Learning Loop',
      status: 'active',
      icon: Brain,
      color: '#f43f5e',
      description: 'Narrations → Learning → Confidence → Auto-classification → Review',
      metrics: [
        { label: 'Acceptance', value: `${engineState.aiLearningMetrics?.acceptanceRate.toFixed(1)}%` },
        { label: 'Avg Confidence', value: `${engineState.aiLearningMetrics?.averageConfidence.toFixed(1)}%` },
        { label: 'Improvement', value: `+${engineState.aiLearningMetrics?.monthlyImprovement.toFixed(1)}%` },
      ],
    },
  ];

  return (
    <PageLayout
      title="ADMIN – A-99 – Finance Engine Console – v1.0"
      description="Comprehensive monitoring and control panel for Financial Intelligence Engines"
      kpis={[
        {
          title: 'Engine Status',
          value: engineState.engineStatus === 'active' ? 'ACTIVE' : 'IDLE',
          icon: <Activity className="h-5 w-5" />,
          change: engineHealth.status,
          changeType: engineHealth.status === 'healthy' ? 'positive' : 'negative',
        },
        {
          title: 'Active Engines',
          value: '11/11',
          icon: <Zap className="h-5 w-5" />,
          change: '100% operational',
          changeType: 'positive',
        },
        {
          title: 'System Health',
          value: engineHealth.status.toUpperCase(),
          icon: <CheckCircle2 className="h-5 w-5" />,
          change: engineHealth.issues.length === 0 ? 'No issues' : `${engineHealth.issues.length} issues`,
          changeType: engineHealth.issues.length === 0 ? 'positive' : 'negative',
        },
        {
          title: 'Last Computation',
          value: new Date(engineState.lastFullComputation).toLocaleTimeString(),
          icon: <Activity className="h-5 w-5" />,
          change: 'Live updates',
          changeType: 'neutral',
        },
      ]}
    >
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Engine Overview</TabsTrigger>
          <TabsTrigger value="cost-matrix">Cost Matrix</TabsTrigger>
          <TabsTrigger value="burn-risk">Burn Risk</TabsTrigger>
          <TabsTrigger value="profitability">Client Profitability</TabsTrigger>
          <TabsTrigger value="velocity">Profit Velocity</TabsTrigger>
          <TabsTrigger value="ai-learning">AI Learning</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {engines.map((engine) => {
              const Icon = engine.icon;
              return (
                <Card3D key={engine.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-3 rounded-lg" 
                        style={{ backgroundColor: `${engine.color}20`, color: engine.color }}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">{engine.code}</div>
                        <h3 className="font-semibold">{engine.name}</h3>
                      </div>
                    </div>
                    <Badge variant={engine.status === 'active' ? 'default' : 'secondary'}>
                      {engine.status}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    {engine.description}
                  </p>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                    {engine.metrics.map((metric, idx) => (
                      <div key={idx}>
                        <div className="text-xs text-muted-foreground">{metric.label}</div>
                        <div className="font-semibold mt-1">{metric.value}</div>
                      </div>
                    ))}
                  </div>
                </Card3D>
              );
            })}
          </div>

          {/* System Health */}
          {engineHealth.issues.length > 0 && (
            <Card3D className="p-6 border-orange-500/20">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <h3 className="font-semibold">System Issues Detected</h3>
              </div>
              <ul className="space-y-2">
                {engineHealth.issues.map((issue, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                    {issue}
                  </li>
                ))}
              </ul>
            </Card3D>
          )}
        </TabsContent>

        {/* COST MATRIX TAB */}
        <TabsContent value="cost-matrix" className="space-y-6">
          <Card3D className="p-6">
            <h3 className="font-semibold mb-4">Department Cost Matrix</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 font-medium">Department</th>
                    <th className="text-right py-3 font-medium">Employees</th>
                    <th className="text-right py-3 font-medium">Monthly Salary</th>
                    <th className="text-right py-3 font-medium">Overhead Share</th>
                    <th className="text-right py-3 font-medium">Cost/Hour</th>
                    <th className="text-right py-3 font-medium">Cost/Minute</th>
                  </tr>
                </thead>
                <tbody>
                  {engineState.departmentCostMatrix?.rows.map((row) => (
                    <tr key={row.departmentId} className="border-b border-border/50">
                      <td className="py-3">{row.departmentName}</td>
                      <td className="text-right py-3">{row.employeeCount}</td>
                      <td className="text-right py-3">${row.monthlySalary.toLocaleString()}</td>
                      <td className="text-right py-3">${row.overheadShare.toLocaleString()}</td>
                      <td className="text-right py-3 font-semibold">${row.costPerHour.toFixed(2)}</td>
                      <td className="text-right py-3 text-muted-foreground">${row.costPerMinute.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card3D>
        </TabsContent>

        {/* BURN RISK TAB */}
        <TabsContent value="burn-risk" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockProjectBurnData.map((project) => (
              <Card3D key={project.projectId} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{project.projectName}</h3>
                    <div className="text-xs text-muted-foreground mt-1">{project.projectId}</div>
                  </div>
                  <Badge 
                    variant={
                      project.burnRiskScore > 70 ? 'destructive' : 
                      project.burnRiskScore > 50 ? 'default' : 
                      'secondary'
                    }
                  >
                    Risk: {project.burnRiskScore}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-muted-foreground">Budget</div>
                    <div className="font-semibold">${project.budget.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Total Cost</div>
                    <div className="font-semibold">${project.totalCost.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Profit Margin</div>
                    <div className="font-semibold">{project.profitMargin.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Margin Drift</div>
                    <div className={`font-semibold ${project.marginDrift < 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {project.marginDrift > 0 ? '+' : ''}{project.marginDrift.toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="text-xs text-muted-foreground mb-2">Cost Breakdown</div>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Time:</span>{' '}
                      <span className="font-semibold">${project.timeCostInjection.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Expenses:</span>{' '}
                      <span className="font-semibold">${project.expenseAllocation.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </Card3D>
            ))}
          </div>

          {/* Active Alerts */}
          {mockBurnRiskAlerts.length > 0 && (
            <Card3D className="p-6">
              <h3 className="font-semibold mb-4">Active Burn Risk Alerts</h3>
              <div className="space-y-3">
                {mockBurnRiskAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                      alert.severity === 'critical' ? 'text-red-500' :
                      alert.severity === 'high' ? 'text-orange-500' :
                      'text-yellow-500'
                    }`} />
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{alert.projectName}</div>
                      <div className="text-sm text-muted-foreground mt-1">{alert.message}</div>
                      <div className="text-xs text-muted-foreground mt-2">
                        {new Date(alert.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">Acknowledge</Button>
                  </div>
                ))}
              </div>
            </Card3D>
          )}
        </TabsContent>

        {/* CLIENT PROFITABILITY TAB */}
        <TabsContent value="profitability" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockClientProfitability.map((client) => (
              <Card3D key={client.clientId} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{client.clientName}</h3>
                    <div className="text-xs text-muted-foreground mt-1">{client.clientId}</div>
                  </div>
                  <Badge 
                    variant={
                      client.riskLevel === 'high' ? 'destructive' : 
                      client.riskLevel === 'medium' ? 'default' : 
                      'secondary'
                    }
                  >
                    {client.riskLevel.toUpperCase()}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-muted-foreground">30d Profit</div>
                    <div className="font-semibold">${client.profit30d.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">60d Profit</div>
                    <div className="font-semibold">${client.profit60d.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">90d Profit</div>
                    <div className="font-semibold">${client.profit90d.toLocaleString()}</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="text-xs text-muted-foreground mb-2">Profit per Hour</div>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">30d:</span>{' '}
                      <span className="font-semibold">${client.profitPerHour30d.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">60d:</span>{' '}
                      <span className="font-semibold">${client.profitPerHour60d.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">90d:</span>{' '}
                      <span className="font-semibold">${client.profitPerHour90d.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </Card3D>
            ))}
          </div>
        </TabsContent>

        {/* PROFIT VELOCITY TAB */}
        <TabsContent value="velocity" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card3D className="p-6">
              <div className="text-xs text-muted-foreground mb-2">Profit per Hour</div>
              <div className="text-2xl font-bold mb-1">${engineState.profitVelocity?.profitPerHour.toFixed(2)}</div>
              <div className="text-xs text-green-500">+{engineState.profitVelocity?.marginVelocity.toFixed(1)}% velocity</div>
            </Card3D>

            <Card3D className="p-6">
              <div className="text-xs text-muted-foreground mb-2">Profit per Day</div>
              <div className="text-2xl font-bold mb-1">${engineState.profitVelocity?.profitPerDay.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">≈ ${engineState.profitVelocity?.profitPerMonth.toLocaleString()}/mo</div>
            </Card3D>

            <Card3D className="p-6">
              <div className="text-xs text-muted-foreground mb-2">Burn per Day</div>
              <div className="text-2xl font-bold mb-1">${engineState.profitVelocity?.burnPerDay.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">≈ ${engineState.profitVelocity?.burnPerMonth.toLocaleString()}/mo</div>
            </Card3D>

            <Card3D className="p-6">
              <div className="text-xs text-muted-foreground mb-2">Overhead Leakage</div>
              <div className="text-2xl font-bold mb-1">{engineState.profitVelocity?.overheadLeakage.toFixed(1)}%</div>
              <div className="text-xs text-orange-500">${engineState.profitVelocity?.leakagePerDay.toFixed(0)}/day</div>
            </Card3D>
          </div>
        </TabsContent>

        {/* AI LEARNING TAB */}
        <TabsContent value="ai-learning" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card3D className="p-6">
              <div className="text-xs text-muted-foreground mb-2">Acceptance Rate</div>
              <div className="text-2xl font-bold mb-1">{engineState.aiLearningMetrics?.acceptanceRate.toFixed(1)}%</div>
              <div className="text-xs text-green-500">+{engineState.aiLearningMetrics?.monthlyImprovement.toFixed(1)}% this month</div>
            </Card3D>

            <Card3D className="p-6">
              <div className="text-xs text-muted-foreground mb-2">Average Confidence</div>
              <div className="text-2xl font-bold mb-1">{engineState.aiLearningMetrics?.averageConfidence.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">{engineState.aiLearningMetrics?.totalNarrations} narrations</div>
            </Card3D>

            <Card3D className="p-6">
              <div className="text-xs text-muted-foreground mb-2">Auto-Classified</div>
              <div className="text-2xl font-bold mb-1">{engineState.aiLearningMetrics?.autoClassified}</div>
              <div className="text-xs text-muted-foreground">{engineState.aiLearningMetrics?.manuallyReviewed} manual reviews</div>
            </Card3D>
          </div>

          <Card3D className="p-6">
            <h3 className="font-semibold mb-4">Category Accuracy</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(engineState.aiLearningMetrics?.categoryAccuracy || {}).map(([category, accuracy]) => (
                <div key={category} className="p-3 rounded-lg bg-muted/50">
                  <div className="text-xs text-muted-foreground mb-1">{category}</div>
                  <div className="text-lg font-semibold">{accuracy.toFixed(1)}%</div>
                </div>
              ))}
            </div>
          </Card3D>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
