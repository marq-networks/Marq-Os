// ═══════════════════════════════════════════════════════════════════════════
// ORG-F-ENGINE-09 — FINANCE ↔ WORK WIRING
// ═══════════════════════════════════════════════════════════════════════════
// Tasks & projects inject time, department, client → Cost/Burn/Margin engines
// Version: 1.0 | Build: ENGINE-09

import { WorkFinanceWiring } from './types';
import { DepartmentCostMatrix } from './types';

interface Task {
  id: string;
  projectId: string;
  assigneeDepartment: string;
  actualTime: string; // e.g., "8h 30m"
  client?: string;
}

interface Project {
  id: string;
  name: string;
  client: string;
  department: string;
}

/**
 * Parse time string to hours
 */
export function parseTimeToHours(timeString: string): number {
  const hoursMatch = timeString.match(/(\d+)h/);
  const minutesMatch = timeString.match(/(\d+)m/);

  const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
  const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;

  return hours + minutes / 60;
}

/**
 * Wire task data to finance engines
 * Injects: Time × Department Cost → Cost Engine → Burn Engine → Margin Engine
 */
export function wireTaskToFinance(
  task: Task,
  project: Project,
  departmentCostMatrix: DepartmentCostMatrix
): WorkFinanceWiring {
  const timeLogged = parseTimeToHours(task.actualTime);
  const departmentId = task.assigneeDepartment;

  // Get department cost rate
  const deptRow = departmentCostMatrix.rows.find((row) => row.departmentId === departmentId);
  const departmentCostPerHour = deptRow?.costPerHour || 0;
  const departmentName = deptRow?.departmentName || 'Unknown';

  // Calculate computed cost
  const computedCost = timeLogged * departmentCostPerHour;

  return {
    taskId: task.id,
    projectId: task.projectId,
    timeLogged,
    departmentId,
    departmentName,
    departmentCostPerHour,
    clientId: project.client,
    clientName: project.client,
    computedCost,
    routesToCostEngine: true,
    routesToBurnEngine: true,
    routesToMarginEngine: true,
    injectedAt: new Date().toISOString(),
  };
}

/**
 * Wire project to finance engines
 * Aggregates all task costs for the project
 */
export function wireProjectToFinance(
  project: Project,
  tasks: Task[],
  departmentCostMatrix: DepartmentCostMatrix
): WorkFinanceWiring {
  const projectTasks = tasks.filter((task) => task.projectId === project.id);

  // Aggregate time and cost across all tasks
  let totalTime = 0;
  let totalCost = 0;
  const departmentBreakdown: Record<string, { hours: number; cost: number }> = {};

  projectTasks.forEach((task) => {
    const wiring = wireTaskToFinance(task, project, departmentCostMatrix);
    totalTime += wiring.timeLogged;
    totalCost += wiring.computedCost;

    if (!departmentBreakdown[wiring.departmentId]) {
      departmentBreakdown[wiring.departmentId] = { hours: 0, cost: 0 };
    }
    departmentBreakdown[wiring.departmentId].hours += wiring.timeLogged;
    departmentBreakdown[wiring.departmentId].cost += wiring.computedCost;
  });

  // Use primary department (most hours)
  let primaryDepartmentId = project.department;
  let maxHours = 0;
  Object.entries(departmentBreakdown).forEach(([deptId, data]) => {
    if (data.hours > maxHours) {
      maxHours = data.hours;
      primaryDepartmentId = deptId;
    }
  });

  const deptRow = departmentCostMatrix.rows.find((row) => row.departmentId === primaryDepartmentId);

  return {
    projectId: project.id,
    timeLogged: totalTime,
    departmentId: primaryDepartmentId,
    departmentName: deptRow?.departmentName || project.department,
    departmentCostPerHour: deptRow?.costPerHour || 0,
    clientId: project.client,
    clientName: project.client,
    computedCost: totalCost,
    routesToCostEngine: true,
    routesToBurnEngine: true,
    routesToMarginEngine: true,
    injectedAt: new Date().toISOString(),
  };
}

/**
 * Batch wire multiple tasks to finance
 */
export function batchWireTasksToFinance(
  tasks: Task[],
  projects: Project[],
  departmentCostMatrix: DepartmentCostMatrix
): WorkFinanceWiring[] {
  return tasks.map((task) => {
    const project = projects.find((p) => p.id === task.projectId);
    if (!project) {
      throw new Error(`Project not found for task ${task.id}`);
    }
    return wireTaskToFinance(task, project, departmentCostMatrix);
  });
}

/**
 * Calculate total cost impact from work wiring
 */
export function calculateWorkCostImpact(
  wirings: WorkFinanceWiring[]
): {
  totalCost: number;
  totalHours: number;
  departmentBreakdown: Record<string, { hours: number; cost: number; departmentName: string }>;
  clientBreakdown: Record<string, { hours: number; cost: number; clientName: string }>;
} {
  let totalCost = 0;
  let totalHours = 0;
  const departmentBreakdown: Record<string, { hours: number; cost: number; departmentName: string }> = {};
  const clientBreakdown: Record<string, { hours: number; cost: number; clientName: string }> = {};

  wirings.forEach((wiring) => {
    totalCost += wiring.computedCost;
    totalHours += wiring.timeLogged;

    // Department breakdown
    if (!departmentBreakdown[wiring.departmentId]) {
      departmentBreakdown[wiring.departmentId] = {
        hours: 0,
        cost: 0,
        departmentName: wiring.departmentName,
      };
    }
    departmentBreakdown[wiring.departmentId].hours += wiring.timeLogged;
    departmentBreakdown[wiring.departmentId].cost += wiring.computedCost;

    // Client breakdown
    if (wiring.clientId && wiring.clientName) {
      if (!clientBreakdown[wiring.clientId]) {
        clientBreakdown[wiring.clientId] = {
          hours: 0,
          cost: 0,
          clientName: wiring.clientName,
        };
      }
      clientBreakdown[wiring.clientId].hours += wiring.timeLogged;
      clientBreakdown[wiring.clientId].cost += wiring.computedCost;
    }
  });

  return {
    totalCost,
    totalHours,
    departmentBreakdown,
    clientBreakdown,
  };
}

/**
 * Track cost changes over time
 */
export function trackCostChanges(
  previousWirings: WorkFinanceWiring[],
  currentWirings: WorkFinanceWiring[]
): {
  costIncrease: number;
  hoursIncrease: number;
  percentageChange: number;
  newTasks: number;
  updatedTasks: number;
} {
  const previousImpact = calculateWorkCostImpact(previousWirings);
  const currentImpact = calculateWorkCostImpact(currentWirings);

  const costIncrease = currentImpact.totalCost - previousImpact.totalCost;
  const hoursIncrease = currentImpact.totalHours - previousImpact.totalHours;
  const percentageChange = previousImpact.totalCost > 0
    ? (costIncrease / previousImpact.totalCost) * 100
    : 0;

  const previousTaskIds = new Set(previousWirings.map((w) => w.taskId).filter(Boolean));
  const currentTaskIds = new Set(currentWirings.map((w) => w.taskId).filter(Boolean));

  const newTasks = [...currentTaskIds].filter((id) => !previousTaskIds.has(id)).length;
  const updatedTasks = [...currentTaskIds].filter((id) => previousTaskIds.has(id)).length;

  return {
    costIncrease,
    hoursIncrease,
    percentageChange,
    newTasks,
    updatedTasks,
  };
}

/**
 * Identify high-cost tasks
 */
export function identifyHighCostTasks(
  wirings: WorkFinanceWiring[],
  threshold: number = 1000
): Array<WorkFinanceWiring & { rank: number }> {
  const highCostWirings = wirings
    .filter((w) => w.taskId && w.computedCost >= threshold)
    .sort((a, b) => b.computedCost - a.computedCost);

  return highCostWirings.map((wiring, index) => ({
    ...wiring,
    rank: index + 1,
  }));
}

/**
 * Calculate department utilization
 */
export function calculateDepartmentUtilization(
  wirings: WorkFinanceWiring[],
  departmentCostMatrix: DepartmentCostMatrix,
  workingHoursPerMonth: number = 160
): Record<string, {
  departmentName: string;
  actualHours: number;
  capacity: number; // based on employee count
  utilization: number; // percentage
  cost: number;
}> {
  const impact = calculateWorkCostImpact(wirings);
  const utilization: Record<string, any> = {};

  Object.entries(impact.departmentBreakdown).forEach(([deptId, data]) => {
    const deptRow = departmentCostMatrix.rows.find((row) => row.departmentId === deptId);
    const capacity = deptRow ? deptRow.employeeCount * workingHoursPerMonth : 0;
    const utilizationPercentage = capacity > 0 ? (data.hours / capacity) * 100 : 0;

    utilization[deptId] = {
      departmentName: data.departmentName,
      actualHours: data.hours,
      capacity,
      utilization: utilizationPercentage,
      cost: data.cost,
    };
  });

  return utilization;
}

/**
 * Generate work-finance wiring summary
 */
export function generateWiringSummary(
  wirings: WorkFinanceWiring[]
): {
  totalWirings: number;
  tasksWired: number;
  projectsWired: number;
  totalCost: number;
  totalHours: number;
  averageCostPerHour: number;
  topDepartment: { id: string; name: string; cost: number };
  topClient: { id: string; name: string; cost: number } | null;
} {
  const impact = calculateWorkCostImpact(wirings);
  const tasksWired = wirings.filter((w) => w.taskId).length;
  const projectsWired = wirings.filter((w) => w.projectId && !w.taskId).length;
  const averageCostPerHour = impact.totalHours > 0 ? impact.totalCost / impact.totalHours : 0;

  // Find top department
  let topDepartment = { id: '', name: '', cost: 0 };
  Object.entries(impact.departmentBreakdown).forEach(([deptId, data]) => {
    if (data.cost > topDepartment.cost) {
      topDepartment = { id: deptId, name: data.departmentName, cost: data.cost };
    }
  });

  // Find top client
  let topClient: { id: string; name: string; cost: number } | null = null;
  Object.entries(impact.clientBreakdown).forEach(([clientId, data]) => {
    if (!topClient || data.cost > topClient.cost) {
      topClient = { id: clientId, name: data.clientName, cost: data.cost };
    }
  });

  return {
    totalWirings: wirings.length,
    tasksWired,
    projectsWired,
    totalCost: impact.totalCost,
    totalHours: impact.totalHours,
    averageCostPerHour,
    topDepartment,
    topClient,
  };
}
