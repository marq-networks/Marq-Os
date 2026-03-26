import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  mockProjects, mockSprints, mockTaskLists, mockMilestones, mockTasks,
  mockTeamMembers, mockIssues, mockTimeLogs, mockActivityFeed,
  mockDependencies, mockSkillRatings, mockDocuments, mockBurndownSprint5, mockEmails
} from '../components/screens/work/workMockData';
import type {
  Project, Sprint, TaskList, Milestone, Task, TeamMember, Issue, TimeLog,
  TaskDependency, SkillRating, ActivityEntry, ProjectDocument, BurndownDataPoint
} from '../components/screens/work/workMockData';
import type { TaskStatus, Priority, ProjectStatus, SprintStatus, MilestoneStatus, EmailThread } from '../components/screens/work/workTypes';

// ═══════════════════════════════════════════════════════════
// EXECUTION OS CONTEXT — Global State Management
// ═══════════════════════════════════════════════════════════

interface ExecutionOSContextValue {
  // ─── State ─────────────────────────────────────────────
  projects: Project[];
  sprints: Sprint[];
  taskLists: TaskList[];
  milestones: Milestone[];
  tasks: Task[];
  teamMembers: TeamMember[];
  issues: Issue[];
  timeLogs: TimeLog[];
  activityFeed: ActivityEntry[];
  dependencies: TaskDependency[];
  skillRatings: SkillRating[];
  documents: ProjectDocument[];
  burndownData: BurndownDataPoint[];
  emails: EmailThread[];

  // ─── Task Actions ──────────────────────────────────────
  createTask: (task: Omit<Task, 'id'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  changeTaskStatus: (id: string, status: TaskStatus) => void;
  toggleTaskComplete: (id: string) => void;
  assignTask: (id: string, assignee: string) => void;
  bulkUpdateTasks: (ids: string[], updates: Partial<Task>) => void;

  // ─── Project Actions ───────────────────────────────────
  createProject: (project: Omit<Project, 'id'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  changeProjectStatus: (id: string, status: ProjectStatus) => void;

  // ─── Milestone Actions ─────────────────────────────────
  createMilestone: (milestone: Omit<Milestone, 'id'>) => Milestone;
  updateMilestone: (id: string, updates: Partial<Milestone>) => void;
  deleteMilestone: (id: string) => void;
  changeMilestoneStatus: (id: string, status: MilestoneStatus) => void;

  // ─── Sprint Actions ────────────────────────────────────
  createSprint: (sprint: Omit<Sprint, 'id'>) => Sprint;
  updateSprint: (id: string, updates: Partial<Sprint>) => void;
  deleteSprint: (id: string) => void;
  changeSprintStatus: (id: string, status: SprintStatus) => void;

  // ─── Dependency Actions ────────────────────────────────
  addDependency: (fromTaskId: string, toTaskId: string, type: TaskDependency['type']) => void;
  removeDependency: (id: string) => void;

  // ─── Time Log Actions ──────────────────────────────────
  addTimeLog: (timeLog: Omit<TimeLog, 'id'>) => void;
  updateTimeLog: (id: string, updates: Partial<TimeLog>) => void;
  deleteTimeLog: (id: string) => void;

  // ─── Skill Rating Actions ──────────────────────────────
  updateSkillRating: (memberId: string, skill: string, rating: SkillRating['rating']) => void;

  // ─── Activity Feed Actions ─────────────────────────────
  addActivity: (activity: Omit<ActivityEntry, 'id' | 'timestamp'>) => void;

  // ─── Email Actions ─────────────────────────────────────
  createEmail: (email: Omit<EmailThread, 'id'>) => EmailThread;
  updateEmail: (id: string, updates: Partial<EmailThread>) => void;
  deleteEmail: (id: string) => void;
  toggleEmailStar: (id: string) => void;
  toggleEmailRead: (id: string) => void;
  linkEmailToTask: (emailId: string, taskId: string) => void;
  linkEmailToProject: (emailId: string, projectId: string) => void;
  createTaskFromEmail: (email: EmailThread) => Task;

  // ─── Utility Actions ───────────────────────────────────
  refreshData: () => void;
}

const ExecutionOSContext = createContext<ExecutionOSContextValue | undefined>(undefined);

// ─── Provider Component ───────────────────────────────────
export function ExecutionOSProvider({ children }: { children: ReactNode }) {
  // Initialize state with mock data
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [sprints, setSprints] = useState<Sprint[]>(mockSprints);
  const [taskLists, setTaskLists] = useState<TaskList[]>(mockTaskLists);
  const [milestones, setMilestones] = useState<Milestone[]>(mockMilestones);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [issues, setIssues] = useState<Issue[]>(mockIssues);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>(mockTimeLogs);
  const [activityFeed, setActivityFeed] = useState<ActivityEntry[]>(mockActivityFeed);
  const [dependencies, setDependencies] = useState<TaskDependency[]>(mockDependencies);
  const [skillRatings, setSkillRatings] = useState<SkillRating[]>(mockSkillRatings);
  const [documents, setDocuments] = useState<ProjectDocument[]>(mockDocuments);
  const [burndownData] = useState<BurndownDataPoint[]>(mockBurndownSprint5);
  const [emails, setEmails] = useState<EmailThread[]>(mockEmails);

  // ═══════════════════════════════════════════════════════
  // TASK ACTIONS
  // ═══════════════════════════════════════════════════════

  const createTask = useCallback((taskData: Omit<Task, 'id'>): Task => {
    const newTask: Task = {
      ...taskData,
      id: `t${Date.now()}`,
    };
    setTasks(prev => [...prev, newTask]);
    addActivity({
      type: 'task_created',
      actor: 'Current User',
      actorInitial: 'C',
      message: 'created task',
      target: newTask.title,
      projectName: newTask.projectName,
      projectColor: newTask.projectColor || '#3b82f6',
    });
    return newTask;
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, ...updates } : task
    ));
    const task = tasks.find(t => t.id === id);
    if (task && updates.status) {
      addActivity({
        type: 'status_changed',
        actor: 'Current User',
        actorInitial: 'C',
        message: `changed status to ${updates.status}`,
        target: task.title,
        projectName: task.projectName,
        projectColor: task.projectColor || '#3b82f6',
      });
    }
  }, [tasks]);

  const deleteTask = useCallback((id: string) => {
    const task = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(t => t.id !== id));
    if (task) {
      addActivity({
        type: 'task_deleted',
        actor: 'Current User',
        actorInitial: 'C',
        message: 'deleted task',
        target: task.title,
        projectName: task.projectName,
        projectColor: task.projectColor || '#3b82f6',
      });
    }
  }, [tasks]);

  const changeTaskStatus = useCallback((id: string, status: TaskStatus) => {
    updateTask(id, { status });
  }, [updateTask]);

  const toggleTaskComplete = useCallback((id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      const newStatus: TaskStatus = task.status === 'Closed' ? 'Open' : 'Closed';
      changeTaskStatus(id, newStatus);
    }
  }, [tasks, changeTaskStatus]);

  const assignTask = useCallback((id: string, assignee: string) => {
    updateTask(id, { assignee });
    const task = tasks.find(t => t.id === id);
    if (task) {
      addActivity({
        type: 'task_assigned',
        actor: 'Current User',
        actorInitial: 'C',
        message: `assigned to ${assignee}`,
        target: task.title,
        projectName: task.projectName,
        projectColor: task.projectColor || '#3b82f6',
      });
    }
  }, [tasks, updateTask]);

  const bulkUpdateTasks = useCallback((ids: string[], updates: Partial<Task>) => {
    setTasks(prev => prev.map(task =>
      ids.includes(task.id) ? { ...task, ...updates } : task
    ));
    addActivity({
      type: 'task_updated',
      actor: 'Current User',
      actorInitial: 'C',
      message: `bulk updated ${ids.length} tasks`,
      target: 'Multiple tasks',
      projectName: 'System',
      projectColor: '#3b82f6',
    });
  }, []);

  // ═══════════════════════════════════════════════════════
  // PROJECT ACTIONS
  // ═══════════════════════════════════════════════════════

  const createProject = useCallback((projectData: Omit<Project, 'id'>): Project => {
    const newProject: Project = {
      ...projectData,
      id: `p${Date.now()}`,
    };
    setProjects(prev => [...prev, newProject]);
    addActivity({
      type: 'project_created',
      actor: 'Current User',
      actorInitial: 'C',
      message: 'created project',
      target: newProject.name,
      projectName: newProject.client,
      projectColor: newProject.color,
    });
    return newProject;
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(project =>
      project.id === id ? { ...project, ...updates } : project
    ));
  }, []);

  const deleteProject = useCallback((id: string) => {
    const project = projects.find(p => p.id === id);
    setProjects(prev => prev.filter(p => p.id !== id));
    if (project) {
      addActivity({
        type: 'project_deleted',
        actor: 'Current User',
        actorInitial: 'C',
        message: 'deleted project',
        target: project.name,
        projectName: project.client,
        projectColor: project.color,
      });
    }
  }, [projects]);

  const changeProjectStatus = useCallback((id: string, status: ProjectStatus) => {
    updateProject(id, { status });
  }, [updateProject]);

  // ═══════════════════════════════════════════════════════
  // MILESTONE ACTIONS
  // ═══════════════════════════════════════════════════════

  const createMilestone = useCallback((milestoneData: Omit<Milestone, 'id'>): Milestone => {
    const newMilestone: Milestone = {
      ...milestoneData,
      id: `m${Date.now()}`,
    };
    setMilestones(prev => [...prev, newMilestone]);
    addActivity({
      type: 'milestone_created',
      actor: 'Current User',
      actorInitial: 'C',
      message: 'created milestone',
      target: newMilestone.name,
      projectName: newMilestone.projectName,
      projectColor: '#3b82f6',
    });
    return newMilestone;
  }, []);

  const updateMilestone = useCallback((id: string, updates: Partial<Milestone>) => {
    setMilestones(prev => prev.map(milestone =>
      milestone.id === id ? { ...milestone, ...updates } : milestone
    ));
  }, []);

  const deleteMilestone = useCallback((id: string) => {
    const milestone = milestones.find(m => m.id === id);
    setMilestones(prev => prev.filter(m => m.id !== id));
    if (milestone) {
      addActivity({
        type: 'milestone_deleted',
        actor: 'Current User',
        actorInitial: 'C',
        message: 'deleted milestone',
        target: milestone.name,
        projectName: milestone.projectName,
        projectColor: '#3b82f6',
      });
    }
  }, [milestones]);

  const changeMilestoneStatus = useCallback((id: string, status: MilestoneStatus) => {
    updateMilestone(id, { status });
  }, [updateMilestone]);

  // ═══════════════════════════════════════════════════════
  // SPRINT ACTIONS
  // ═══════════════════════════════════════════════════════

  const createSprint = useCallback((sprintData: Omit<Sprint, 'id'>): Sprint => {
    const newSprint: Sprint = {
      ...sprintData,
      id: `s${Date.now()}`,
    };
    setSprints(prev => [...prev, newSprint]);
    addActivity({
      type: 'sprint_created',
      actor: 'Current User',
      actorInitial: 'C',
      message: 'created sprint',
      target: newSprint.name,
      projectName: newSprint.projectName,
      projectColor: '#3b82f6',
    });
    return newSprint;
  }, []);

  const updateSprint = useCallback((id: string, updates: Partial<Sprint>) => {
    setSprints(prev => prev.map(sprint =>
      sprint.id === id ? { ...sprint, ...updates } : sprint
    ));
  }, []);

  const deleteSprint = useCallback((id: string) => {
    const sprint = sprints.find(s => s.id === id);
    setSprints(prev => prev.filter(s => s.id !== id));
    if (sprint) {
      addActivity({
        type: 'sprint_deleted',
        actor: 'Current User',
        actorInitial: 'C',
        message: 'deleted sprint',
        target: sprint.name,
        projectName: sprint.projectName,
        projectColor: '#3b82f6',
      });
    }
  }, [sprints]);

  const changeSprintStatus = useCallback((id: string, status: SprintStatus) => {
    updateSprint(id, { status });
  }, [updateSprint]);

  // ═══════════════════════════════════════════════════════
  // DEPENDENCY ACTIONS
  // ═══════════════════════════════════════════════════════

  const addDependency = useCallback((fromTaskId: string, toTaskId: string, type: TaskDependency['type']) => {
    const newDep: TaskDependency = {
      id: `dep${Date.now()}`,
      fromTaskId,
      toTaskId,
      type,
    };
    setDependencies(prev => [...prev, newDep]);
  }, []);

  const removeDependency = useCallback((id: string) => {
    setDependencies(prev => prev.filter(d => d.id !== id));
  }, []);

  // ═══════════════════════════════════════════════════════
  // TIME LOG ACTIONS
  // ═══════════════════════════════════════════════════════

  const addTimeLog = useCallback((timeLogData: Omit<TimeLog, 'id'>) => {
    const newLog: TimeLog = {
      ...timeLogData,
      id: `tl${Date.now()}`,
    };
    setTimeLogs(prev => [...prev, newLog]);
    const task = tasks.find(t => t.id === timeLogData.taskId);
    if (task) {
      addActivity({
        type: 'time_logged',
        user: timeLogData.loggedBy,
        action: `logged ${timeLogData.duration} on "${task.title}"`,
        target: task.projectName,
      });
    }
  }, [tasks]);

  const updateTimeLog = useCallback((id: string, updates: Partial<TimeLog>) => {
    setTimeLogs(prev => prev.map(log =>
      log.id === id ? { ...log, ...updates } : log
    ));
  }, []);

  const deleteTimeLog = useCallback((id: string) => {
    setTimeLogs(prev => prev.filter(l => l.id !== id));
  }, []);

  // ═══════════════════════════════════════════════════════
  // SKILL RATING ACTIONS
  // ═══════════════════════════════════════════════════════

  const updateSkillRating = useCallback((memberId: string, skill: string, rating: SkillRating['rating']) => {
    setSkillRatings(prev => {
      const existing = prev.find(sr => sr.memberId === memberId && sr.skill === skill);
      if (existing) {
        return prev.map(sr =>
          sr.memberId === memberId && sr.skill === skill
            ? { ...sr, rating }
            : sr
        );
      } else {
        const member = teamMembers.find(m => m.id === memberId);
        return [...prev, {
          memberId,
          memberName: member?.name || 'Unknown',
          skill,
          rating,
        }];
      }
    });
  }, [teamMembers]);

  // ═══════════════════════════════════════════════════════
  // ACTIVITY FEED ACTIONS
  // ═══════════════════════════════════════════════════════

  const addActivity = useCallback((activityData: Omit<ActivityEntry, 'id' | 'timestamp'>) => {
    const newActivity: ActivityEntry = {
      ...activityData,
      id: `a${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setActivityFeed(prev => [newActivity, ...prev].slice(0, 100)); // Keep last 100 activities
  }, []);

  // ═══════════════════════════════════════════════════════
  // EMAIL ACTIONS
  // ═══════════════════════════════════════════════════════

  const createEmail = useCallback((emailData: Omit<EmailThread, 'id'>): EmailThread => {
    const newEmail: EmailThread = {
      ...emailData,
      id: `e${Date.now()}`,
    };
    setEmails(prev => [...prev, newEmail]);
    addActivity({
      type: 'email_created',
      actor: 'Current User',
      actorInitial: 'C',
      message: 'created email',
      target: newEmail.subject,
      projectName: newEmail.projectName || 'General',
      projectColor: '#3b82f6',
    });
    return newEmail;
  }, []);

  const updateEmail = useCallback((id: string, updates: Partial<EmailThread>) => {
    setEmails(prev => prev.map(email =>
      email.id === id ? { ...email, ...updates } : email
    ));
  }, []);

  const deleteEmail = useCallback((id: string) => {
    const email = emails.find(e => e.id === id);
    setEmails(prev => prev.filter(e => e.id !== id));
    if (email) {
      addActivity({
        type: 'email_deleted',
        actor: 'Current User',
        actorInitial: 'C',
        message: 'deleted email',
        target: email.subject,
        projectName: email.projectName || 'General',
        projectColor: '#3b82f6',
      });
    }
  }, [emails]);

  const toggleEmailStar = useCallback((id: string) => {
    updateEmail(id, { starred: !emails.find(e => e.id === id)?.starred });
  }, [emails, updateEmail]);

  const toggleEmailRead = useCallback((id: string) => {
    updateEmail(id, { unread: !emails.find(e => e.id === id)?.unread });
  }, [emails, updateEmail]);

  const linkEmailToTask = useCallback((emailId: string, taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    updateEmail(emailId, { taskId, taskName: task?.title });
    const email = emails.find(e => e.id === emailId);
    if (email && task) {
      addActivity({
        type: 'email_linked',
        actor: 'Current User',
        actorInitial: 'C',
        message: `linked email to task`,
        target: task.title,
        projectName: task.projectName,
        projectColor: task.projectColor || '#3b82f6',
      });
    }
  }, [emails, tasks, updateEmail]);

  const linkEmailToProject = useCallback((emailId: string, projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    updateEmail(emailId, { projectId, projectName: project?.name });
    const email = emails.find(e => e.id === emailId);
    if (email && project) {
      addActivity({
        type: 'email_linked',
        actor: 'Current User',
        actorInitial: 'C',
        message: `linked email to project`,
        target: project.name,
        projectName: project.client,
        projectColor: project.color,
      });
    }
  }, [emails, projects, updateEmail]);

  const createTaskFromEmail = useCallback((email: EmailThread): Task => {
    const project = email.projectId ? projects.find(p => p.id === email.projectId) : projects[0];
    const newTask: Task = {
      id: `t${Date.now()}`,
      taskId: `EMAIL-${Date.now().toString().slice(-4)}`,
      title: email.subject,
      description: email.body || email.preview,
      projectId: email.projectId || project?.id || 'p1',
      projectName: email.projectName || project?.name || 'General',
      projectColor: project?.color || '#3b82f6',
      assignee: email.from,
      assigneeDepartment: 'Product',
      status: 'Open',
      priority: 'Medium',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      estimate: '2h',
      estimatedHours: 2,
      actualTime: '0h',
      actualHours: 0,
      billable: true,
      hasEvidence: false,
      evidenceCount: 0,
    };
    setTasks(prev => [...prev, newTask]);
    addActivity({
      type: 'task_created',
      actor: 'Current User',
      actorInitial: 'C',
      message: 'created task from email',
      target: newTask.title,
      projectName: newTask.projectName,
      projectColor: newTask.projectColor || '#3b82f6',
    });
    return newTask;
  }, [projects]);

  // ═══════════════════════════════════════════════════════
  // UTILITY ACTIONS
  // ═══════════════════════════════════════════════════════

  const refreshData = useCallback(() => {
    setProjects(mockProjects);
    setSprints(mockSprints);
    setTaskLists(mockTaskLists);
    setMilestones(mockMilestones);
    setTasks(mockTasks);
    setTeamMembers(mockTeamMembers);
    setIssues(mockIssues);
    setTimeLogs(mockTimeLogs);
    setActivityFeed(mockActivityFeed);
    setDependencies(mockDependencies);
    setSkillRatings(mockSkillRatings);
    setDocuments(mockDocuments);
  }, []);

  // ═══════════════════════════════════════════════════════
  // CONTEXT VALUE
  // ═══════════════════════════════════════════════════════

  const value: ExecutionOSContextValue = {
    // State
    projects,
    sprints,
    taskLists,
    milestones,
    tasks,
    teamMembers,
    issues,
    timeLogs,
    activityFeed,
    dependencies,
    skillRatings,
    documents,
    burndownData,
    emails,

    // Actions
    createTask,
    updateTask,
    deleteTask,
    changeTaskStatus,
    toggleTaskComplete,
    assignTask,
    bulkUpdateTasks,

    createProject,
    updateProject,
    deleteProject,
    changeProjectStatus,

    createMilestone,
    updateMilestone,
    deleteMilestone,
    changeMilestoneStatus,

    createSprint,
    updateSprint,
    deleteSprint,
    changeSprintStatus,

    addDependency,
    removeDependency,

    addTimeLog,
    updateTimeLog,
    deleteTimeLog,

    updateSkillRating,

    addActivity,

    createEmail,
    updateEmail,
    deleteEmail,
    toggleEmailStar,
    toggleEmailRead,
    linkEmailToTask,
    linkEmailToProject,
    createTaskFromEmail,

    refreshData,
  };

  return (
    <ExecutionOSContext.Provider value={value}>
      {children}
    </ExecutionOSContext.Provider>
  );
}

// ─── Hook to use context ──────────────────────────────────
export function useExecutionOS() {
  const context = useContext(ExecutionOSContext);
  if (!context) {
    throw new Error('useExecutionOS must be used within ExecutionOSProvider');
  }
  return context;
}