// ═══════════════════════════════════════════════════════════════════════════
// FINANCIAL INTELLIGENCE ENGINE - MOCK DATA GENERATOR
// ═══════════════════════════════════════════════════════════════════════════
// Generates realistic mock data for all 11 engines for development and testing
// Version: 1.0 | Build: ENGINE-MOCK

import {
  DepartmentCostMatrix,
  OverheadItem,
  OverheadAllocationMatrix,
  ProjectBurnData,
  BurnRiskAlert,
  ClientProfitabilityData,
  ProfitVelocityMetrics,
  AILearningMetrics,
  FinanceEngineState,
} from './types';
import {
  computeDepartmentCostMatrix,
  createOverheadAllocationMatrix,
} from './index';

// ═══════════════════════════════════════════════════════════════════════════
// MOCK EMPLOYEES & DEPARTMENTS
// ═══════════════════════════════════════════════════════════════════════════

export const mockEmployees = [
  // Engineering (10 employees)
  { id: 'emp-001', departmentId: 'dept-eng', monthlySalary: 8000 },
  { id: 'emp-002', departmentId: 'dept-eng', monthlySalary: 7500 },
  { id: 'emp-003', departmentId: 'dept-eng', monthlySalary: 7000 },
  { id: 'emp-004', departmentId: 'dept-eng', monthlySalary: 6500 },
  { id: 'emp-005', departmentId: 'dept-eng', monthlySalary: 6000 },
  { id: 'emp-006', departmentId: 'dept-eng', monthlySalary: 5500 },
  { id: 'emp-007', departmentId: 'dept-eng', monthlySalary: 5000 },
  { id: 'emp-008', departmentId: 'dept-eng', monthlySalary: 4500 },
  { id: 'emp-009', departmentId: 'dept-eng', monthlySalary: 4000 },
  { id: 'emp-010', departmentId: 'dept-eng', monthlySalary: 3500 },
  
  // Design (5 employees)
  { id: 'emp-011', departmentId: 'dept-design', monthlySalary: 6500 },
  { id: 'emp-012', departmentId: 'dept-design', monthlySalary: 6000 },
  { id: 'emp-013', departmentId: 'dept-design', monthlySalary: 5500 },
  { id: 'emp-014', departmentId: 'dept-design', monthlySalary: 5000 },
  { id: 'emp-015', departmentId: 'dept-design', monthlySalary: 4500 },
  
  // Marketing (6 employees)
  { id: 'emp-016', departmentId: 'dept-marketing', monthlySalary: 7000 },
  { id: 'emp-017', departmentId: 'dept-marketing', monthlySalary: 6000 },
  { id: 'emp-018', departmentId: 'dept-marketing', monthlySalary: 5500 },
  { id: 'emp-019', departmentId: 'dept-marketing', monthlySalary: 5000 },
  { id: 'emp-020', departmentId: 'dept-marketing', monthlySalary: 4500 },
  { id: 'emp-021', departmentId: 'dept-marketing', monthlySalary: 4000 },
  
  // Sales (8 employees)
  { id: 'emp-022', departmentId: 'dept-sales', monthlySalary: 7500 },
  { id: 'emp-023', departmentId: 'dept-sales', monthlySalary: 7000 },
  { id: 'emp-024', departmentId: 'dept-sales', monthlySalary: 6500 },
  { id: 'emp-025', departmentId: 'dept-sales', monthlySalary: 6000 },
  { id: 'emp-026', departmentId: 'dept-sales', monthlySalary: 5500 },
  { id: 'emp-027', departmentId: 'dept-sales', monthlySalary: 5000 },
  { id: 'emp-028', departmentId: 'dept-sales', monthlySalary: 4500 },
  { id: 'emp-029', departmentId: 'dept-sales', monthlySalary: 4000 },
  
  // Operations (4 employees)
  { id: 'emp-030', departmentId: 'dept-ops', monthlySalary: 6000 },
  { id: 'emp-031', departmentId: 'dept-ops', monthlySalary: 5500 },
  { id: 'emp-032', departmentId: 'dept-ops', monthlySalary: 5000 },
  { id: 'emp-033', departmentId: 'dept-ops', monthlySalary: 4500 },
];

export const mockDepartments = [
  { id: 'dept-eng', name: 'Engineering', code: 'ENG', employeeCount: 10, monthlyRevenue: 120000 },
  { id: 'dept-design', name: 'Design', code: 'DES', employeeCount: 5, monthlyRevenue: 45000 },
  { id: 'dept-marketing', name: 'Marketing', code: 'MKT', employeeCount: 6, monthlyRevenue: 35000 },
  { id: 'dept-sales', name: 'Sales', code: 'SAL', employeeCount: 8, monthlyRevenue: 85000 },
  { id: 'dept-ops', name: 'Operations', code: 'OPS', employeeCount: 4, monthlyRevenue: 25000 },
];

// ═══════════════════════════════════════════════════════════════════════════
// MOCK OVERHEAD ITEMS
// ═══════════════════════════════════════════════════════════════════════════

export const mockOverheadItems: OverheadItem[] = [
  {
    id: 'oh-001',
    name: 'Office Rent',
    category: 'rent',
    monthlyAmount: 8000,
    allocationRule: 'headcount',
    isActive: true,
  },
  {
    id: 'oh-002',
    name: 'Cloud Hosting (AWS)',
    category: 'hosting',
    monthlyAmount: 3500,
    allocationRule: 'revenue',
    isActive: true,
  },
  {
    id: 'oh-003',
    name: 'Software Licenses',
    category: 'saas',
    monthlyAmount: 2500,
    allocationRule: 'headcount',
    isActive: true,
  },
  {
    id: 'oh-004',
    name: 'Utilities',
    category: 'utilities',
    monthlyAmount: 1200,
    allocationRule: 'headcount',
    isActive: true,
  },
  {
    id: 'oh-005',
    name: 'Design Tools',
    category: 'tools',
    monthlyAmount: 800,
    allocationRule: 'manual',
    manualWeights: {
      'dept-design': 0.7,
      'dept-marketing': 0.3,
    },
    isActive: true,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// GENERATE DEPARTMENT COST MATRIX
// ═══════════════════════════════════════════════════════════════════════════

export function generateMockDepartmentCostMatrix(): DepartmentCostMatrix {
  const overheadMatrix = createOverheadAllocationMatrix(mockOverheadItems, mockDepartments);
  
  const departmentAllocations: Record<string, number> = {};
  overheadMatrix.allocations.forEach((alloc) => {
    if (!departmentAllocations[alloc.departmentId]) {
      departmentAllocations[alloc.departmentId] = 0;
    }
    departmentAllocations[alloc.departmentId] += alloc.allocatedAmount;
  });

  return computeDepartmentCostMatrix(mockDepartments, mockEmployees, {
    totalMonthlyOverhead: overheadMatrix.totalMonthlyOverhead,
    departmentAllocations,
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// MOCK PROJECT BURN DATA
// ═══════════════════════════════════════════════════════════════════════════

export const mockProjectBurnData: ProjectBurnData[] = [
  {
    projectId: 'proj-001',
    projectName: 'Mobile App Redesign',
    timeCostInjection: 45000,
    expenseAllocation: 8000,
    totalCost: 53000,
    budget: 75000,
    spent: 53000,
    burnRiskScore: 35,
    marginDrift: -2.5,
    marginDriftWarning: 'low',
    profitMargin: 29.3,
    profitMarginProjected: 32,
    feedsProjectDashboard: true,
    feedsFinanceCockpit: true,
    feedsAlertsInbox: false,
    lastComputed: new Date().toISOString(),
  },
  {
    projectId: 'proj-002',
    projectName: 'E-commerce Platform',
    timeCostInjection: 89000,
    expenseAllocation: 15000,
    totalCost: 104000,
    budget: 95000,
    spent: 104000,
    burnRiskScore: 78,
    marginDrift: -18.5,
    marginDriftWarning: 'high',
    profitMargin: 8.2,
    profitMarginProjected: 25,
    feedsProjectDashboard: true,
    feedsFinanceCockpit: true,
    feedsAlertsInbox: true,
    lastComputed: new Date().toISOString(),
  },
  {
    projectId: 'proj-003',
    projectName: 'Brand Refresh Campaign',
    timeCostInjection: 28000,
    expenseAllocation: 5000,
    totalCost: 33000,
    budget: 50000,
    spent: 33000,
    burnRiskScore: 22,
    marginDrift: 1.2,
    marginDriftWarning: 'none',
    profitMargin: 34,
    profitMarginProjected: 32,
    feedsProjectDashboard: true,
    feedsFinanceCockpit: true,
    feedsAlertsInbox: false,
    lastComputed: new Date().toISOString(),
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// MOCK BURN RISK ALERTS
// ═══════════════════════════════════════════════════════════════════════════

export const mockBurnRiskAlerts: BurnRiskAlert[] = [
  {
    id: 'alert-001',
    projectId: 'proj-002',
    projectName: 'E-commerce Platform',
    type: 'budget-overrun',
    severity: 'high',
    message: 'Budget overrun: 9.5% over budget',
    currentBurn: 104000,
    projectedBurn: 115000,
    daysToOverrun: 0,
    createdAt: new Date().toISOString(),
    acknowledged: false,
  },
  {
    id: 'alert-002',
    projectId: 'proj-002',
    projectName: 'E-commerce Platform',
    type: 'margin-drift',
    severity: 'high',
    message: 'High margin drift: -18.5% deviation',
    currentBurn: 104000,
    projectedBurn: 115000,
    createdAt: new Date().toISOString(),
    acknowledged: false,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// MOCK CLIENT PROFITABILITY DATA
// ═══════════════════════════════════════════════════════════════════════════

export const mockClientProfitability: ClientProfitabilityData[] = [
  {
    clientId: 'client-001',
    clientName: 'Acme Corp',
    revenue30d: 85000,
    revenue60d: 165000,
    revenue90d: 245000,
    cost30d: 58000,
    cost60d: 115000,
    cost90d: 170000,
    profit30d: 27000,
    profit60d: 50000,
    profit90d: 75000,
    profitPerHour30d: 67.5,
    profitPerHour60d: 62.5,
    profitPerHour90d: 65.2,
    riskScore: 25,
    riskLevel: 'low',
    feedsReports: true,
    feedsQuoteChecker: true,
    feedsLeakDetection: false,
    lastComputed: new Date().toISOString(),
  },
  {
    clientId: 'client-002',
    clientName: 'TechStart Inc',
    revenue30d: 45000,
    revenue60d: 92000,
    revenue90d: 135000,
    cost30d: 42000,
    cost60d: 85000,
    cost90d: 128000,
    profit30d: 3000,
    profit60d: 7000,
    profit90d: 7000,
    profitPerHour30d: 12.5,
    profitPerHour60d: 14.5,
    profitPerHour90d: 11.5,
    riskScore: 68,
    riskLevel: 'high',
    feedsReports: true,
    feedsQuoteChecker: true,
    feedsLeakDetection: true,
    lastComputed: new Date().toISOString(),
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// MOCK PROFIT VELOCITY METRICS
// ═══════════════════════════════════════════════════════════════════════════

export const mockProfitVelocityMetrics: ProfitVelocityMetrics = {
  profitPerHour: 52.3,
  profitPerDay: 4184,
  profitPerWeek: 29288,
  profitPerMonth: 125520,
  burnPerDay: 5800,
  burnPerWeek: 40600,
  burnPerMonth: 174000,
  marginVelocity: 2.3,
  marginAcceleration: 0.5,
  overheadLeakage: 8.5,
  leakagePerDay: 493,
  feeds2050Cockpit: true,
  lastComputed: new Date().toISOString(),
  computationFrequency: 'hourly',
};

// ═══════════════════════════════════════════════════════════════════════════
// MOCK AI LEARNING METRICS
// ═══════════════════════════════════════════════════════════════════════════

export const mockAILearningMetrics: AILearningMetrics = {
  totalNarrations: 1250,
  autoClassified: 975,
  manuallyReviewed: 275,
  acceptanceRate: 78,
  averageConfidence: 82.5,
  categoryAccuracy: {
    'Office Rent': 95,
    'Utilities': 88,
    'Software': 92,
    'Travel': 85,
    'Marketing': 79,
    'Client Lunch': 74,
    'Salary': 98,
    'Equipment': 86,
  },
  monthlyImprovement: 3.2,
  lastLearningCycle: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  nextLearningCycle: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
};

// ═══════════════════════════════════════════════════════════════════════════
// GENERATE COMPLETE ENGINE STATE
// ═══════════════════════════════════════════════════════════════════════════

export function generateMockFinanceEngineState(): FinanceEngineState {
  const departmentCostMatrix = generateMockDepartmentCostMatrix();
  const overheadAllocation = createOverheadAllocationMatrix(mockOverheadItems, mockDepartments);

  const projectBurnDataMap: Record<string, ProjectBurnData> = {};
  mockProjectBurnData.forEach((project) => {
    projectBurnDataMap[project.projectId] = project;
  });

  const clientProfitabilityMap: Record<string, ClientProfitabilityData> = {};
  mockClientProfitability.forEach((client) => {
    clientProfitabilityMap[client.clientId] = client;
  });

  return {
    engineVersion: '1.0.0',
    engineStatus: 'active',
    lastFullComputation: new Date().toISOString(),
    departmentCostMatrix,
    overheadAllocation,
    profitVelocity: mockProfitVelocityMetrics,
    projectBurnData: projectBurnDataMap,
    clientProfitability: clientProfitabilityMap,
    burnRiskAlerts: mockBurnRiskAlerts,
    aiLearningMetrics: mockAILearningMetrics,
    workWiringActive: true,
    chatWiringActive: true,
  };
}
