// ═══════════════════════════════════════════════════════
// EXECUTION OS — Complete Type System v2.0
// ═══════════════════════════════════════════════════════

// 10-Status Color-Coded System (Zoho Projects-inspired)
export type TaskStatus =
  | 'Open'
  | 'In Progress'
  | 'To Be Tested'
  | 'Reopen'
  | 'On Hold'
  | "Won't Fix"
  | 'Waiting'
  | 'Closed'
  | 'Overdue'
  | 'Pending Review';

export type Priority = 'Critical' | 'High' | 'Medium' | 'Low' | 'None';
export type ProjectStatus = 'Active' | 'On Hold' | 'Completed' | 'At Risk' | 'Cancelled';
export type SprintStatus = 'Planning' | 'Active' | 'Completed' | 'Cancelled';
export type MilestoneStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Overdue';
export type IssueStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed' | "Won't Fix";
export type IssueSeverity = 'Critical' | 'Major' | 'Minor' | 'Trivial';

export interface Project {
  id: string;
  name: string;
  code: string;
  client: string;
  department: string;
  status: ProjectStatus;
  priority: Priority;
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
  color: string;
  billingModel?: 'Fixed' | 'Hourly' | 'Retainer';
  billableDefault?: boolean;
  currency?: string;
  projectedMargin?: number;
  billableHours?: number;
  nonBillableHours?: number;
  taskCount: number;
  openTaskCount: number;
  milestoneCount: number;
  openIssueCount: number;
  sprintCount: number;
}

export interface Sprint {
  id: string;
  name: string;
  projectId: string;
  projectName: string;
  status: SprintStatus;
  startDate: string;
  endDate: string;
  goal?: string;
  velocity?: number;
  storyPoints: number;
  completedPoints: number;
  taskCount: number;
  completedTasks: number;
}

export interface TaskList {
  id: string;
  name: string;
  projectId: string;
  milestoneId?: string;
  sprintId?: string;
  status: 'Active' | 'Completed';
  taskCount: number;
  completedTasks: number;
  order: number;
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
  status: MilestoneStatus;
  taskCount: number;
  completedTasks: number;
  isInternal?: boolean;
  notes?: string;
  budget?: number;
  spent?: number;
}

export interface SubTask {
  id: string;
  title: string;
  status: TaskStatus;
  assignee?: string;
  dueDate?: string;
  priority: Priority;
  completed: boolean;
}

export interface Task {
  id: string;
  taskId: string;
  title: string;
  projectId: string;
  projectName: string;
  projectColor?: string;
  milestoneId?: string;
  milestoneName?: string;
  sprintId?: string;
  sprintName?: string;
  taskListId?: string;
  taskListName?: string;
  parentTaskId?: string;
  assignee: string;
  collaborators?: string[];
  assigneeDepartment: string;
  status: TaskStatus;
  priority: Priority;
  startDate?: string;
  dueDate: string;
  completedDate?: string;
  estimate: string;
  estimatedHours?: number;
  actualTime: string;
  actualHours?: number;
  progress?: number;
  billable: boolean;
  hasEvidence: boolean;
  evidenceCount: number;
  tags?: string[];
  description?: string;
  notes?: string;
  subtasks?: SubTask[];
  timeLogs?: TimeLog[];
  watchers?: string[];
  attachments?: number;
  comments?: number;
  burnAmount?: number;
  profitImpact?: number;
  costImpact?: number;
  approvalStatus?: 'Pending Approval' | 'Approved' | 'Rejected';
  submittedByEmployee?: boolean;
  submittedBy?: string;
  storyPoints?: number;
  client?: string;
}

export interface Issue {
  id: string;
  issueId: string;
  title: string;
  projectId: string;
  projectName: string;
  status: IssueStatus;
  severity: IssueSeverity;
  assignee: string;
  reporter: string;
  dueDate: string;
  createdAt: string;
  description?: string;
  linkedTaskId?: string;
  module?: string;
  reproducible?: 'Always' | 'Sometimes' | 'Rarely' | 'Unable';
  comments?: number;
}

export interface TimeLog {
  id: string;
  taskId: string;
  date: string;
  duration: string;
  hours: number;
  description: string;
  loggedBy: string;
  billable: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  department: string;
  role: string;
  currentLoad: number;
  capacity: number;
  assignedTasks: number;
  completedTasks: number;
  skills?: string[];
  availability?: number;
}

// ─── View & Filter Types ─────────────────────────────────
export type ViewMode = 'list' | 'board' | 'gantt' | 'calendar' | 'sprint' | 'dependency';
export type GroupBy = 'none' | 'milestone' | 'assignee' | 'status' | 'priority' | 'sprint' | 'tasklist';
export type SortBy = 'dueDate' | 'priority' | 'status' | 'assignee' | 'created' | 'title';

export interface FilterState {
  search: string;
  projects: string[];
  milestones: string[];
  sprints: string[];
  assignees: string[];
  statuses: TaskStatus[];
  priorities: Priority[];
  tags: string[];
  billableOnly: boolean;
  overdueOnly: boolean;
  evidenceMissing: boolean;
  myTasksOnly: boolean;
  departments: string[];
  logic: 'AND' | 'OR';
  // ── Extended fields (18+ filter panel) ──────────────────
  dateFrom?: string;
  dateTo?: string;
  storyPointsMin?: number;
  storyPointsMax?: number;
  hasAttachments?: boolean;
  hasComments?: boolean;
  approvalStatus?: string[];
}

// ─── Status & Priority Config ─────────────────────────────
export const STATUS_CONFIG: Record<TaskStatus, {
  label: string;
  color: string;
  bg: string;
  border: string;
  dot: string;
}> = {
  'Open':           { label: 'Open',           color: 'text-slate-600',  bg: 'bg-slate-100',  border: 'border-slate-300', dot: 'bg-slate-400' },
  'In Progress':    { label: 'In Progress',    color: 'text-blue-700',   bg: 'bg-blue-100',   border: 'border-blue-300',  dot: 'bg-blue-500'  },
  'To Be Tested':   { label: 'To Be Tested',   color: 'text-purple-700', bg: 'bg-purple-100', border: 'border-purple-300',dot: 'bg-purple-500'},
  'Reopen':         { label: 'Reopen',         color: 'text-orange-700', bg: 'bg-orange-100', border: 'border-orange-300',dot: 'bg-orange-500'},
  'On Hold':        { label: 'On Hold',        color: 'text-yellow-700', bg: 'bg-yellow-100', border: 'border-yellow-300',dot: 'bg-yellow-500'},
  "Won't Fix":      { label: "Won't Fix",      color: 'text-gray-500',   bg: 'bg-gray-50',    border: 'border-gray-200',  dot: 'bg-gray-300'  },
  'Waiting':        { label: 'Waiting',        color: 'text-sky-700',    bg: 'bg-sky-100',    border: 'border-sky-300',   dot: 'bg-sky-500'   },
  'Closed':         { label: 'Closed',         color: 'text-green-700',  bg: 'bg-green-100',  border: 'border-green-300', dot: 'bg-green-500' },
  'Overdue':        { label: 'Overdue',        color: 'text-red-700',    bg: 'bg-red-100',    border: 'border-red-300',   dot: 'bg-red-500'   },
  'Pending Review': { label: 'Pending Review', color: 'text-amber-700',  bg: 'bg-amber-100',  border: 'border-amber-300', dot: 'bg-amber-500' },
};

export const PRIORITY_CONFIG: Record<Priority, {
  color: string;
  bg: string;
  border: string;
  label: string;
}> = {
  'Critical': { color: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-200',    label: 'Critical' },
  'High':     { color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', label: 'High'     },
  'Medium':   { color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200', label: 'Medium'   },
  'Low':      { color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200',   label: 'Low'      },
  'None':     { color: 'text-gray-400',   bg: 'bg-gray-50',   border: 'border-gray-200',   label: 'None'     },
};

export const PROJECT_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316',
];

export const ALL_STATUSES: TaskStatus[] = [
  'Open', 'In Progress', 'To Be Tested', 'Reopen',
  'On Hold', "Won't Fix", 'Waiting', 'Closed', 'Overdue', 'Pending Review',
];

export const ALL_PRIORITIES: Priority[] = ['Critical', 'High', 'Medium', 'Low', 'None'];

// ─── Task Dependencies ────────────────────────────────────
export interface TaskDependency {
  id: string;
  fromTaskId: string;   // The blocking task (this task blocks the other)
  toTaskId: string;     // The blocked task (this task is blocked by fromTask)
  type: 'blocks' | 'relates_to' | 'duplicates';
}

// ─── Skill Rating ─────────────────────────────────────────
export interface SkillRating {
  memberId: string;
  memberName: string;
  skill: string;
  rating: 0 | 1 | 2 | 3 | 4 | 5; // 0=none, 1=novice, 5=expert
}

export const SKILL_CATEGORIES = [
  'React/Frontend', 'Backend/API', 'UI/UX Design', 'DevOps/Infra',
  'Testing/QA', 'Project Mgmt', 'Data/Analytics', 'Security',
];

// ─── Email / Communication ────────────────────────────────
export interface EmailThread {
  id: string;
  from: string;
  fromEmail: string;
  subject: string;
  preview: string;
  body?: string;
  date: string;
  unread: boolean;
  starred: boolean;
  tags?: string[];
  attachments?: number;
  projectId?: string;
  projectName?: string;
  taskId?: string;
  taskName?: string;
  replies?: number;
  folder?: 'inbox' | 'sent' | 'drafts' | 'archived' | 'trash';
  replyTo?: string;
  cc?: string[];
  bcc?: string[];
}