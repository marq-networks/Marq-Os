// WORK Module Type Definitions - v1.3

export interface Project {
  id: string;
  name: string;
  client: string;
  department: string;
  status: 'Active' | 'On Hold' | 'Completed' | 'At Risk';
  priority: 'High' | 'Medium' | 'Low';
  startDate: string;
  endDate: string;
  progress: number;
  budget: number;
  spent: number;
  burnRate: number;
  profitRisk: 'High' | 'Medium' | 'Low' | 'None';
  team: string[];
  teamLead: string;
  description?: string;
  // Financial wiring fields
  billingModel?: 'Fixed' | 'Hourly' | 'Retainer';
  billableDefault?: boolean;
  financeTracking?: boolean;
  currency?: string;
  projectedMargin?: number;
  billableHours?: number;
  nonBillableHours?: number;
}

export interface Milestone {
  id: string;
  projectId: string;
  projectName: string;
  name: string;
  owner: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Overdue';
  taskCount: number;
  completedTasks: number;
}

export interface Task {
  id: string;
  taskId: string; // Display ID like T-001
  title: string;
  projectId: string;
  projectName: string;
  milestoneId?: string;
  milestoneName?: string;
  assignee: string;
  assigneeDepartment: string;
  status: 'To Do' | 'In Progress' | 'Done' | 'Pending Approval' | 'Approved' | 'Rejected';
  approvalStatus?: 'Pending Approval' | 'Approved' | 'Rejected';
  priority: 'High' | 'Medium' | 'Low';
  startDate?: string;
  dueDate: string;
  estimate: string;
  actualTime: string;
  billable: boolean;
  hasEvidence: boolean;
  evidenceCount: number;
  burnAmount?: number;
  profitImpact?: number;
  submittedByEmployee?: boolean;
  submittedBy?: string;
  description?: string;
  subtasks?: Subtask[];
  timeLogs?: TimeLog[];
  evidenceTimeline?: Evidence[];
  // Financial wiring fields
  client?: string;
  costImpact?: number;
  estimatedHours?: number;
  actualHours?: number;
  departmentCostRate?: number;
  calculatedCost?: number;
  invoiceReady?: boolean;
  linkedExpenses?: number;
  linkedReceipts?: number;
  linkedTransactions?: number;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  assignee?: string;
}

export interface TimeLog {
  id: string;
  date: string;
  duration: string;
  description: string;
  loggedBy: string;
}

export interface Evidence {
  id: string;
  type: 'Screenshot' | 'Document' | 'Link' | 'Note';
  title: string;
  uploadedBy: string;
  uploadedAt: string;
  url?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  department: string;
  role: string;
  currentLoad: number; // percentage
  capacity: number; // hours per week
  assignedTasks: number;
  completedTasks: number;
}

export type GroupByOption = 'milestone' | 'assignee' | 'status' | 'project';
export type FilterOption = {
  projects: string[];
  milestones: string[];
  assignees: string[];
  teams: string[];
  statuses: string[];
  priorities: string[];
  billableOnly: boolean;
  overdueOnly: boolean;
  bottomUpOnly: boolean;
  evidenceMissing: boolean;
  burnRiskOnly: boolean;
};