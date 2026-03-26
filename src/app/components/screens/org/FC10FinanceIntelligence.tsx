import { PageLayout } from '../../shared/PageLayout';
import { Card3D } from '../../shared/Card3D';
import { StatusBadge } from '../../shared/StatusBadge';
import { Breadcrumb } from '../../shared/Breadcrumb';
import { FinanceTopTabs } from '../../../finance/components/FinanceTopTabs';
import { useToast } from '../../ui/toast';
import { useState } from 'react';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Sparkles, 
  Zap, 
  Settings,
  Plus,
  Play,
  Save,
  Download,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  BarChart3,
  PieChart,
  DollarSign,
  Calendar,
  Building,
  Users,
  FileText,
  Filter,
  RefreshCw,
  Lightbulb,
  Shield,
  GitBranch
} from 'lucide-react';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FC10 FINANCE INTELLIGENCE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * AI-Powered Finance Intelligence Hub
 * 
 * FEATURES:
 * - AI Financial Analysis & Pattern Detection
 * - Scenario Builder (Projects, Future Projections, Properties)
 * - Custom Pattern Creator
 * - Rule Engine for Organizational Finance Policies
 * - AI Model Integration Hub
 * - Predictive Analytics & Forecasting
 */

interface Scenario {
  id: string;
  name: string;
  type: 'project' | 'property' | 'market' | 'custom';
  status: 'draft' | 'running' | 'completed';
  confidence: number;
  revenue: number;
  cost: number;
  duration: number;
  aiInsights: string;
  createdAt: string;
}

interface Rule {
  id: string;
  name: string;
  category: 'approval' | 'spending' | 'compliance' | 'reporting';
  status: 'active' | 'inactive';
  priority: 'high' | 'medium' | 'low';
  condition: string;
  action: string;
  appliedCount: number;
}

interface Pattern {
  id: string;
  name: string;
  type: 'revenue' | 'expense' | 'cashflow' | 'custom';
  frequency: string;
  accuracy: number;
  lastDetected: string;
  nextPredicted: string;
}

export function FC10FinanceIntelligence() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'scenarios' | 'patterns' | 'rules' | 'ai-hub'>('overview');
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false);
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [isPatternModalOpen, setIsPatternModalOpen] = useState(false);

  // Mock data - Real implementation would fetch from state/API
  const [scenarios, setScenarios] = useState<Scenario[]>([
    {
      id: 'S001',
      name: 'Q1 2026 Expansion',
      type: 'project',
      status: 'running',
      confidence: 87,
      revenue: 450000,
      cost: 280000,
      duration: 90,
      aiInsights: 'High success probability based on historical Q1 performance',
      createdAt: '2026-02-10'
    },
    {
      id: 'S002',
      name: 'New Office Property',
      type: 'property',
      status: 'draft',
      confidence: 72,
      revenue: 0,
      cost: 1200000,
      duration: 365,
      aiInsights: 'Market conditions favorable, financing options optimal',
      createdAt: '2026-02-09'
    },
    {
      id: 'S003',
      name: 'Product Launch - Asia',
      type: 'market',
      status: 'completed',
      confidence: 94,
      revenue: 2400000,
      cost: 850000,
      duration: 180,
      aiInsights: 'Exceeded projections by 18%, recommend replication strategy',
      createdAt: '2025-11-15'
    }
  ]);

  const [rules, setRules] = useState<Rule[]>([
    {
      id: 'R001',
      name: 'Auto-approve expenses under $500',
      category: 'approval',
      status: 'active',
      priority: 'medium',
      condition: 'Amount < $500 AND Category = Operating',
      action: 'Auto-approve',
      appliedCount: 247
    },
    {
      id: 'R002',
      name: 'Flag international payments >$10k',
      category: 'compliance',
      status: 'active',
      priority: 'high',
      condition: 'Amount > $10000 AND International = true',
      action: 'Require CFO approval',
      appliedCount: 12
    },
    {
      id: 'R003',
      name: 'Monthly budget variance alert',
      category: 'reporting',
      status: 'active',
      priority: 'high',
      condition: 'Monthly burn > Budget * 1.1',
      action: 'Alert finance team + Generate report',
      appliedCount: 3
    },
    {
      id: 'R004',
      name: 'Vendor payment discount capture',
      category: 'spending',
      status: 'active',
      priority: 'medium',
      condition: 'Payment due within 10 days AND Discount available',
      action: 'Prioritize payment',
      appliedCount: 89
    }
  ]);

  const [patterns, setPatterns] = useState<Pattern[]>([
    {
      id: 'P001',
      name: 'End-of-Month Revenue Spike',
      type: 'revenue',
      frequency: 'Monthly',
      accuracy: 91,
      lastDetected: '2026-01-31',
      nextPredicted: '2026-02-28'
    },
    {
      id: 'P002',
      name: 'Quarterly Software Renewals',
      type: 'expense',
      frequency: 'Quarterly',
      accuracy: 96,
      lastDetected: '2026-01-15',
      nextPredicted: '2026-04-15'
    },
    {
      id: 'P003',
      name: 'Friday Expense Submissions',
      type: 'cashflow',
      frequency: 'Weekly',
      accuracy: 84,
      lastDetected: '2026-02-07',
      nextPredicted: '2026-02-14'
    }
  ]);

  const aiMetrics = {
    modelsActive: 3,
    predictionsToday: 127,
    accuracy: 89,
    rulesTriggered: 34,
    patternsDetected: 8,
    scenariosAnalyzed: 15
  };

  const handleRunScenario = (id: string) => {
    const scenario = scenarios.find(s => s.id === id);
    if (scenario) {
      setScenarios(scenarios.map(s => 
        s.id === id ? { ...s, status: 'running' as const } : s
      ));
      showToast('Scenario analysis started', 'success');
      
      // Simulate completion after 3 seconds
      setTimeout(() => {
        setScenarios(prev => prev.map(s => 
          s.id === id ? { ...s, status: 'completed' as const } : s
        ));
        showToast('Scenario analysis completed', 'success');
      }, 3000);
    }
  };

  const handleToggleRule = (id: string) => {
    setRules(rules.map(r => 
      r.id === id 
        ? { ...r, status: r.status === 'active' ? 'inactive' : 'active' } 
        : r
    ));
    showToast('Rule status updated', 'success');
  };

  return (
    <PageLayout
      title="Finance Intelligence"
      description="AI-powered financial analysis, scenario planning, pattern detection, and rule automation"
    >
      <Breadcrumb items={[
        { label: 'Finance', path: '/org/finance/cockpit' },
        { label: 'Intelligence' }
      ]} />
      <FinanceTopTabs />
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <Card3D className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Brain className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">AI Models</p>
              <p className="text-xl font-bold">{aiMetrics.modelsActive}</p>
            </div>
          </div>
        </Card3D>

        <Card3D className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Sparkles className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Predictions</p>
              <p className="text-xl font-bold">{aiMetrics.predictionsToday}</p>
            </div>
          </div>
        </Card3D>

        <Card3D className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Target className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Accuracy</p>
              <p className="text-xl font-bold">{aiMetrics.accuracy}%</p>
            </div>
          </div>
        </Card3D>

        <Card3D className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <Zap className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Rules Fired</p>
              <p className="text-xl font-bold">{aiMetrics.rulesTriggered}</p>
            </div>
          </div>
        </Card3D>

        <Card3D className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-pink-500/10">
              <GitBranch className="h-5 w-5 text-pink-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Scenarios</p>
              <p className="text-xl font-bold">{scenarios.length}</p>
            </div>
          </div>
        </Card3D>

        <Card3D className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10">
              <TrendingUp className="h-5 w-5 text-cyan-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Patterns</p>
              <p className="text-xl font-bold">{patterns.length}</p>
            </div>
          </div>
        </Card3D>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b border-border pb-2">
        {[
          { key: 'overview', label: 'Overview', icon: BarChart3 },
          { key: 'scenarios', label: 'Scenario Builder', icon: GitBranch },
          { key: 'patterns', label: 'Pattern Detection', icon: TrendingUp },
          { key: 'rules', label: 'Rule Engine', icon: Shield },
          { key: 'ai-hub', label: 'AI Models', icon: Brain }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.key
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent text-muted-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <Card3D>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  Intelligence Overview
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Real-time AI analysis of your financial data
                </p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
                <RefreshCw className="h-4 w-4" />
                Refresh Analysis
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold">Strong Signals</h4>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">•</span>
                    <span>Revenue velocity up 23% month-over-month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">•</span>
                    <span>Expense efficiency improved by 15%</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">•</span>
                    <span>Cash runway extended to 18 months</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-orange-500/5 border border-orange-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <h4 className="font-semibold">Watch Areas</h4>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">•</span>
                    <span>Q1 marketing spend 8% over budget</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">•</span>
                    <span>3 high-value invoices aging past 45 days</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">•</span>
                    <span>Seasonal revenue dip predicted in 30 days</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card3D>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button 
              onClick={() => setActiveTab('scenarios')}
              className="p-4 rounded-lg border border-border hover:border-primary hover:bg-accent transition-colors text-left"
            >
              <GitBranch className="h-6 w-6 text-blue-600 mb-2" />
              <h4 className="font-semibold mb-1">Run Scenario</h4>
              <p className="text-xs text-muted-foreground">Model future outcomes</p>
            </button>

            <button 
              onClick={() => setActiveTab('patterns')}
              className="p-4 rounded-lg border border-border hover:border-primary hover:bg-accent transition-colors text-left"
            >
              <TrendingUp className="h-6 w-6 text-green-600 mb-2" />
              <h4 className="font-semibold mb-1">Find Patterns</h4>
              <p className="text-xs text-muted-foreground">Discover trends</p>
            </button>

            <button 
              onClick={() => setActiveTab('rules')}
              className="p-4 rounded-lg border border-border hover:border-primary hover:bg-accent transition-colors text-left"
            >
              <Shield className="h-6 w-6 text-purple-600 mb-2" />
              <h4 className="font-semibold mb-1">Create Rule</h4>
              <p className="text-xs text-muted-foreground">Automate decisions</p>
            </button>

            <button 
              onClick={() => setActiveTab('ai-hub')}
              className="p-4 rounded-lg border border-border hover:border-primary hover:bg-accent transition-colors text-left"
            >
              <Brain className="h-6 w-6 text-pink-600 mb-2" />
              <h4 className="font-semibold mb-1">AI Models</h4>
              <p className="text-xs text-muted-foreground">Train & optimize</p>
            </button>
          </div>
        </div>
      )}

      {/* TAB: Scenario Builder */}
      {activeTab === 'scenarios' && (
        <div className="space-y-6">
          <Card3D>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <GitBranch className="h-5 w-5 text-blue-600" />
                  Scenario Builder
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Model projects, properties, market conditions, and custom scenarios
                </p>
              </div>
              <button 
                onClick={() => setIsScenarioModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <Plus className="h-4 w-4" />
                New Scenario
              </button>
            </div>

            <div className="space-y-3">
              {scenarios.map(scenario => (
                <div 
                  key={scenario.id}
                  className="p-4 rounded-lg border border-border hover:border-primary transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold">{scenario.name}</h4>
                        <StatusBadge type={
                          scenario.status === 'running' ? 'warning' :
                          scenario.status === 'completed' ? 'success' : 'default'
                        }>
                          {scenario.status.toUpperCase()}
                        </StatusBadge>
                        <span className="text-xs text-muted-foreground">
                          {scenario.type.charAt(0).toUpperCase() + scenario.type.slice(1)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Revenue</p>
                          <p className="font-semibold text-green-600">
                            ${scenario.revenue.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Cost</p>
                          <p className="font-semibold text-red-600">
                            ${scenario.cost.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Duration</p>
                          <p className="font-semibold">{scenario.duration} days</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Confidence</p>
                          <p className="font-semibold text-blue-600">{scenario.confidence}%</p>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
                        <p className="text-xs font-semibold text-purple-600 mb-1">
                          <Brain className="h-3 w-3 inline mr-1" />
                          AI INSIGHT
                        </p>
                        <p className="text-sm">{scenario.aiInsights}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      {scenario.status === 'draft' && (
                        <button 
                          onClick={() => handleRunScenario(scenario.id)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                        >
                          <Play className="h-3 w-3" />
                          Run
                        </button>
                      )}
                      <button className="flex items-center gap-2 px-3 py-1.5 bg-accent text-sm rounded hover:bg-accent/80">
                        <FileText className="h-3 w-3" />
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card3D>
        </div>
      )}

      {/* TAB: Pattern Detection */}
      {activeTab === 'patterns' && (
        <div className="space-y-6">
          <Card3D>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Pattern Detection
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  AI-discovered patterns in your financial data
                </p>
              </div>
              <button 
                onClick={() => setIsPatternModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                <Plus className="h-4 w-4" />
                Create Custom Pattern
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {patterns.map(pattern => (
                <div 
                  key={pattern.id}
                  className="p-4 rounded-lg border border-border hover:border-primary transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{pattern.name}</h4>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-0.5 rounded bg-accent">
                          {pattern.type.toUpperCase()}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {pattern.frequency}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Accuracy</span>
                      <span className="font-semibold text-green-600">{pattern.accuracy}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Last Detected</span>
                      <span className="font-semibold">{pattern.lastDetected}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Next Predicted</span>
                      <span className="font-semibold text-blue-600">{pattern.nextPredicted}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-accent rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${pattern.accuracy}%` }}
                        />
                      </div>
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card3D>
        </div>
      )}

      {/* TAB: Rule Engine */}
      {activeTab === 'rules' && (
        <div className="space-y-6">
          <Card3D>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-600" />
                  Finance Rule Engine
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Automated rules that govern your organization's finance operations
                </p>
              </div>
              <button 
                onClick={() => setIsRuleModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
              >
                <Plus className="h-4 w-4" />
                Create Rule
              </button>
            </div>

            <div className="space-y-3">
              {rules.map(rule => (
                <div 
                  key={rule.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    rule.status === 'active' 
                      ? 'border-green-500/30 bg-green-500/5' 
                      : 'border-border bg-accent/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold">{rule.name}</h4>
                        <StatusBadge type={rule.status === 'active' ? 'success' : 'default'}>
                          {rule.status.toUpperCase()}
                        </StatusBadge>
                        <span className="text-xs px-2 py-0.5 rounded bg-accent">
                          {rule.category.toUpperCase()}
                        </span>
                        <StatusBadge type={
                          rule.priority === 'high' ? 'error' :
                          rule.priority === 'medium' ? 'warning' : 'info'
                        }>
                          {rule.priority.toUpperCase()}
                        </StatusBadge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                          <p className="text-xs font-semibold text-blue-600 mb-1">CONDITION</p>
                          <p className="text-sm font-mono">{rule.condition}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                          <p className="text-xs font-semibold text-green-600 mb-1">ACTION</p>
                          <p className="text-sm font-mono">{rule.action}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          Applied {rule.appliedCount} times
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <button 
                        onClick={() => handleToggleRule(rule.id)}
                        className={`px-3 py-1.5 text-sm rounded ${
                          rule.status === 'active'
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                      >
                        {rule.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button className="px-3 py-1.5 bg-accent text-sm rounded hover:bg-accent/80">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card3D>
        </div>
      )}

      {/* TAB: AI Hub */}
      {activeTab === 'ai-hub' && (
        <div className="space-y-6">
          <Card3D>
            <div className="mb-6">
              <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                <Brain className="h-5 w-5 text-pink-600" />
                AI Model Integration Hub
              </h3>
              <p className="text-sm text-muted-foreground">
                Connect and configure AI models for financial intelligence
              </p>
            </div>

            <div className="space-y-4">
              {/* Active Models */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border border-green-500/30 bg-green-500/5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      <h4 className="font-semibold">GPT-4 Finance</h4>
                    </div>
                    <StatusBadge type="success">ACTIVE</StatusBadge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Accuracy</span>
                      <span className="font-semibold">94%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Requests Today</span>
                      <span className="font-semibold">247</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cost</span>
                      <span className="font-semibold">$12.50</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-green-500/30 bg-green-500/5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      <h4 className="font-semibold">Claude Opus</h4>
                    </div>
                    <StatusBadge type="success">ACTIVE</StatusBadge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Accuracy</span>
                      <span className="font-semibold">91%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Requests Today</span>
                      <span className="font-semibold">89</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cost</span>
                      <span className="font-semibold">$8.20</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-blue-500/30 bg-blue-500/5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                      <h4 className="font-semibold">Custom Model</h4>
                    </div>
                    <StatusBadge type="info">TRAINING</StatusBadge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">67%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Data Points</span>
                      <span className="font-semibold">12,450</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ETA</span>
                      <span className="font-semibold">2 hours</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Model Configuration */}
              <div className="p-4 rounded-lg bg-accent/30 border border-border">
                <h4 className="font-semibold mb-4">Model Configuration</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Primary Model</label>
                    <select className="w-full px-3 py-2 rounded-lg border border-border bg-background">
                      <option>GPT-4 Finance</option>
                      <option>Claude Opus</option>
                      <option>Custom Model</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Fallback Model</label>
                    <select className="w-full px-3 py-2 rounded-lg border border-border bg-background">
                      <option>Claude Opus</option>
                      <option>GPT-4 Finance</option>
                      <option>None</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <button className="px-4 py-2 rounded-lg border border-border hover:bg-accent">
                    Reset
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
                    Save Configuration
                  </button>
                </div>
              </div>
            </div>
          </Card3D>
        </div>
      )}

      {/* Info Footer */}
      <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
        <p className="text-xs text-muted-foreground flex items-start gap-2">
          <Sparkles className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
          <span>
            <strong className="text-purple-600">Finance Intelligence</strong> uses AI to analyze patterns, 
            run scenarios, detect risks, and automate decisions. All models are continuously trained on your 
            organization's financial data while maintaining complete privacy and security.
          </span>
        </p>
      </div>
    </PageLayout>
  );
}