// ═══════════════════════════════════════════════════════════════════════════
// FINANCIAL INTELLIGENCE ENGINE - TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════
// Powers the entire platform's profit intelligence system
// Version: 1.0 | Build: ENGINE-CORE

// ═══════════════════════════════════════════════════════════════════════════
// ORG-F-ENGINE-01 — Department Cost Matrix
// ═══════════════════════════════════════════════════════════════════════════

export interface DepartmentCostRow {
  departmentId: string;
  departmentName: string;
  departmentCode: string;
  employeeCount: number;
  monthlySalary: number;
  overheadShare: number;
  costPerHour: number;
  costPerMinute: number;
  // Live computation metadata
  lastUpdated: string;
  salaryChangeDetected: boolean;
  teamChangeDetected: boolean;
  overheadChangeDetected: boolean;
}

export interface DepartmentCostMatrix {
  rows: DepartmentCostRow[];
  totalMonthlySalary: number;
  totalOverhead: number;
  totalEmployees: number;
  averageCostPerHour: number;
  lastComputed: string;
  autoUpdateEnabled: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// ORG-F-ENGINE-02 — Payroll Impact Router
// ═══════════════════════════════════════════════════════════════════════════

export interface PayrollImpactEntry {
  id: string;
  payrollId: string;
  employeeId: string;
  employeeName: string;
  departmentId: string;
  departmentName: string;
  grossSalary: number;
  deductions: number;
  netSalary: number;
  processedAt: string;
  // Auto-generated ledger entries
  departmentCostEntryId?: string;
  salaryLiabilityEntryId?: string;
  cashDeductionEntryId?: string;
  linkedToCostMatrix: boolean;
}

export interface PayrollPropagationResult {
  payrollId: string;
  totalGross: number;
  totalNet: number;
  totalDeductions: number;
  departmentCostEntries: number;
  salaryLiabilityEntries: number;
  cashDeductionEntries: number;
  costMatrixUpdated: boolean;
  ledgerEntriesCreated: string[];
  propagatedAt: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// ORG-F-ENGINE-03 — Overhead Allocation Router
// ═══════════════════════════════════════════════════════════════════════════

export type OverheadAllocationRule = 'headcount' | 'revenue' | 'manual' | 'department-ratio';

export interface OverheadItem {
  id: string;
  name: string;
  category: 'tools' | 'hosting' | 'rent' | 'saas' | 'utilities' | 'other';
  monthlyAmount: number;
  allocationRule: OverheadAllocationRule;
  manualWeights?: Record<string, number>; // departmentId -> weight
  isActive: boolean;
}

export interface OverheadAllocationEntry {
  overheadItemId: string;
  overheadItemName: string;
  departmentId: string;
  departmentName: string;
  allocatedAmount: number;
  allocationPercentage: number;
  rule: OverheadAllocationRule;
  computedAt: string;
}

export interface OverheadAllocationMatrix {
  items: OverheadItem[];
  allocations: OverheadAllocationEntry[];
  totalMonthlyOverhead: number;
  feedsInto: {
    costPerMinute: boolean;
    projectBurn: boolean;
    profitVelocity: boolean;
  };
  lastAllocated: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// ORG-F-ENGINE-04 — Project Burn Risk Core
// ═══════════════════════════════════════════════════════════════════════════

export interface ProjectBurnData {
  projectId: string;
  projectName: string;
  // Live cost injection
  timeCostInjection: number; // time × department cost
  expenseAllocation: number;
  totalCost: number;
  budget: number;
  spent: number;
  // Risk scoring
  burnRiskScore: number; // 0-100
  marginDrift: number; // percentage
  marginDriftWarning: 'none' | 'low' | 'medium' | 'high' | 'critical';
  profitMargin: number;
  profitMarginProjected: number;
  // Feeds
  feedsProjectDashboard: boolean;
  feedsFinanceCockpit: boolean;
  feedsAlertsInbox: boolean;
  lastComputed: string;
}

export interface BurnRiskAlert {
  id: string;
  projectId: string;
  projectName: string;
  type: 'budget-overrun' | 'margin-drift' | 'cost-spike' | 'burn-rate-high';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  currentBurn: number;
  projectedBurn: number;
  daysToOverrun?: number;
  createdAt: string;
  acknowledged: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// ORG-F-ENGINE-05 — Client Profitability Index
// ═══════════════════════════════════════════════════════════════════════════

export interface ClientProfitabilityData {
  clientId: string;
  clientName: string;
  // Rolling metrics (30/60/90 days)
  revenue30d: number;
  revenue60d: number;
  revenue90d: number;
  cost30d: number;
  cost60d: number;
  cost90d: number;
  profit30d: number;
  profit60d: number;
  profit90d: number;
  profitPerHour30d: number;
  profitPerHour60d: number;
  profitPerHour90d: number;
  // Risk scoring
  riskScore: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high';
  // Feeds
  feedsReports: boolean;
  feedsQuoteChecker: boolean;
  feedsLeakDetection: boolean;
  lastComputed: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// ORG-F-ENGINE-06 — Quote Simulation Engine
// ═══════════════════════════════════════════════════════════════════════════

export interface QuoteSimulationInput {
  quoteAmount: number;
  departments: Array<{ departmentId: string; hours: number }>;
  clientId?: string;
  projectDuration?: number; // days
  additionalExpenses?: number;
}

export interface QuoteSimulationOutput {
  quoteAmount: number;
  totalCost: number;
  expectedMargin: number;
  marginPercentage: number;
  profitPerHour: number;
  lossRisk: 'none' | 'low' | 'medium' | 'high';
  recommendation: 'approve' | 'review' | 'reject';
  breakdown: {
    departmentCosts: Array<{
      departmentId: string;
      departmentName: string;
      hours: number;
      costPerHour: number;
      totalCost: number;
    }>;
    overheadAllocation: number;
    expenses: number;
    profit: number;
  };
  // Comparison with client history (if available)
  clientHistoricalMargin?: number;
  clientComparison?: 'better' | 'similar' | 'worse';
  simulatedAt: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// ORG-F-ENGINE-07 — Sandbox Reality Emulator
// ═══════════════════════════════════════════════════════════════════════════

export type WhatIfScenarioType = 'hiring' | 'salary-change' | 'tool-change' | 'price-change';

export interface WhatIfScenario {
  id: string;
  type: WhatIfScenarioType;
  name: string;
  description: string;
  inputs: {
    hiring?: {
      departmentId: string;
      count: number;
      salaryPerPerson: number;
    };
    salaryChange?: {
      departmentId?: string;
      employeeId?: string;
      newSalary: number;
      changePercentage?: number;
    };
    toolChange?: {
      toolName: string;
      newMonthlyCost: number;
      oldMonthlyCost?: number;
    };
    priceChange?: {
      serviceType: string;
      newRate: number;
      changePercentage: number;
    };
  };
  createdAt: string;
}

export interface WhatIfOutput {
  scenarioId: string;
  scenarioName: string;
  // Impact analysis
  marginDrift: number; // percentage change
  burnChange: number; // absolute change
  netProfitShift: number; // absolute change
  costPerHourChange: number;
  // Before/After comparison
  before: {
    totalMonthlyCost: number;
    costPerHour: number;
    monthlyProfit: number;
    marginPercentage: number;
  };
  after: {
    totalMonthlyCost: number;
    costPerHour: number;
    monthlyProfit: number;
    marginPercentage: number;
  };
  recommendation: string;
  computedAt: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// ORG-F-ENGINE-08 — Profit Velocity Engine
// ═══════════════════════════════════════════════════════════════════════════

export interface ProfitVelocityMetrics {
  // Real-time velocity
  profitPerHour: number;
  profitPerDay: number;
  profitPerWeek: number;
  profitPerMonth: number;
  // Burn metrics
  burnPerDay: number;
  burnPerWeek: number;
  burnPerMonth: number;
  // Margin velocity
  marginVelocity: number; // rate of margin change
  marginAcceleration: number; // rate of velocity change
  // Leakage detection
  overheadLeakage: number; // percentage
  leakagePerDay: number;
  // Feeds 2050 cockpit
  feeds2050Cockpit: boolean;
  lastComputed: string;
  computationFrequency: 'realtime' | 'hourly' | 'daily';
}

// ═══════════════════════════════════════════════════════════════════════════
// ORG-F-ENGINE-09 — Finance ↔ Work Wiring
// ═══════════════════════════════════════════════════════════════════════════

export interface WorkFinanceWiring {
  taskId?: string;
  projectId?: string;
  // Injected data
  timeLogged: number; // hours
  departmentId: string;
  departmentName: string;
  departmentCostPerHour: number;
  clientId?: string;
  clientName?: string;
  // Computed outputs
  computedCost: number; // time × cost/hour
  // Routing targets
  routesToCostEngine: boolean;
  routesToBurnEngine: boolean;
  routesToMarginEngine: boolean;
  injectedAt: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// ORG-F-ENGINE-10 — Finance ↔ Chat Wiring
// ═══════════════════════════════════════════════════════════════════════════

export type ChatFinanceAction =
  | 'submit-expense'
  | 'trigger-approval'
  | 'attach-evidence'
  | 'create-task'
  | 'view-burn-alert';

export interface ChatFinanceCommand {
  commandType: ChatFinanceAction;
  channelId: string;
  messageId: string;
  triggeredBy: string;
  payload: {
    expenseAmount?: number;
    expenseNarration?: string;
    approvalType?: string;
    evidenceUrl?: string;
    taskTitle?: string;
    projectId?: string;
  };
  executedAt: string;
  result?: {
    success: boolean;
    message: string;
    entityId?: string;
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// ORG-F-ENGINE-11 — AI Learning Loop
// ═══════════════════════════════════════════════════════════════════════════

export interface AILearningData {
  narration: string;
  suggestedCategory: string;
  confidenceScore: number; // 0-100
  userAction: 'accepted' | 'modified' | 'rejected';
  actualCategory?: string;
  timestamp: string;
}

export interface AILearningMetrics {
  totalNarrations: number;
  autoClassified: number;
  manuallyReviewed: number;
  acceptanceRate: number; // percentage
  averageConfidence: number;
  categoryAccuracy: Record<string, number>; // category -> accuracy %
  monthlyImprovement: number; // percentage change
  lastLearningCycle: string;
  nextLearningCycle: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// UNIFIED ENGINE STATE
// ═══════════════════════════════════════════════════════════════════════════

export interface FinanceEngineState {
  // Engine status
  engineVersion: string;
  engineStatus: 'active' | 'idle' | 'error';
  lastFullComputation: string;
  
  // Core engines
  departmentCostMatrix?: DepartmentCostMatrix;
  overheadAllocation?: OverheadAllocationMatrix;
  profitVelocity?: ProfitVelocityMetrics;
  
  // Cached data
  projectBurnData: Record<string, ProjectBurnData>;
  clientProfitability: Record<string, ClientProfitabilityData>;
  
  // Active alerts
  burnRiskAlerts: BurnRiskAlert[];
  
  // AI learning
  aiLearningMetrics?: AILearningMetrics;
  
  // Wiring status
  workWiringActive: boolean;
  chatWiringActive: boolean;
}
