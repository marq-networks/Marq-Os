import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useAnalyticsService, useExecutionOSService } from '../services';
import type { ActivityLogEntry, Project, Sprint, TaskList, Milestone, Task, TeamMember, Issue, TimeLog, TaskDependency, SkillRating, TaskStatus, ProjectStatus, SprintStatus, MilestoneStatus, EmailThread } from '../services';

type ActivityType =
  | 'task_completed'
  | 'task_started'
  | 'comment_added'
  | 'status_changed'
  | 'task_assigned'
  | 'milestone_reached'
  | 'sprint_started'
  | 'task_created'
  | 'task_updated'
  | 'task_deleted'
  | 'email_created'
  | 'email_deleted'
  | 'email_linked'
  | 'project_created'
  | 'project_deleted'
  | 'milestone_created'
  | 'milestone_deleted'
  | 'sprint_created'
  | 'sprint_deleted';

interface ActivityEntry {
  id: string;
  type: ActivityType;
  actor: string;
  actorInitial: string;
  message: string;
  target: string;
  projectName: string;
  projectColor: string;
  timestamp: string;
  link?: string;
}

interface ProjectDocument {
  id: string;
  projectId: string;
  projectName: string;
  name: string;
  type: 'PDF' | 'FIGMA' | 'XLSX' | 'DOCX' | 'MP4' | 'ZIP' | 'PPTX' | 'PNG';
  size: string;
  version: string;
  uploadedBy: string;
  uploadedAt: string;
  description?: string;
  tags?: string[];
  folder?: string;
}

interface BurndownDataPoint {
  day: string;
  date: string;
  ideal: number;
  actual?: number;
}

interface ExecutionOSContextValue {
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
  createTask: (task: Omit<Task, 'id'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  changeTaskStatus: (id: string, status: TaskStatus) => void;
  toggleTaskComplete: (id: string) => void;
  assignTask: (id: string, assignee: string) => void;
  bulkUpdateTasks: (ids: string[], updates: Partial<Task>) => void;
  createProject: (project: Omit<Project, 'id'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  changeProjectStatus: (id: string, status: ProjectStatus) => void;
  createMilestone: (milestone: Omit<Milestone, 'id'>) => Milestone;
  updateMilestone: (id: string, updates: Partial<Milestone>) => void;
  deleteMilestone: (id: string) => void;
  changeMilestoneStatus: (id: string, status: MilestoneStatus) => void;
  createSprint: (sprint: Omit<Sprint, 'id'>) => Sprint;
  updateSprint: (id: string, updates: Partial<Sprint>) => void;
  deleteSprint: (id: string) => void;
  changeSprintStatus: (id: string, status: SprintStatus) => void;
  addDependency: (fromTaskId: string, toTaskId: string, type: TaskDependency['type']) => void;
  removeDependency: (id: string) => void;
  addTimeLog: (timeLog: Omit<TimeLog, 'id'>) => void;
  updateTimeLog: (id: string, updates: Partial<TimeLog>) => void;
  deleteTimeLog: (id: string) => void;
  updateSkillRating: (memberId: string, skill: string, rating: SkillRating['rating']) => void;
  addActivity: (activity: Omit<ActivityEntry, 'id' | 'timestamp'>) => void;
  createEmail: (email: Omit<EmailThread, 'id'>) => EmailThread;
  updateEmail: (id: string, updates: Partial<EmailThread>) => void;
  deleteEmail: (id: string) => void;
  toggleEmailStar: (id: string) => void;
  toggleEmailRead: (id: string) => void;
  linkEmailToTask: (emailId: string, taskId: string) => void;
  linkEmailToProject: (emailId: string, projectId: string) => void;
  createTaskFromEmail: (email: EmailThread) => Task;
  refreshData: () => void;
}

const ExecutionOSContext = createContext<ExecutionOSContextValue | undefined>(undefined);

const FALLBACK_PROJECT_COLOR = '#3b82f6';

function getInitials(name: string) {
  return (name || 'S').trim().charAt(0).toUpperCase();
}

function mapActivityType(action: string): ActivityType {
  const normalized = action.toLowerCase();
  if (normalized.includes('complete')) return 'task_completed';
  if (normalized.includes('start')) return 'task_started';
  if (normalized.includes('assign')) return 'task_assigned';
  if (normalized.includes('milestone')) return 'milestone_reached';
  if (normalized.includes('sprint')) return 'sprint_started';
  if (normalized.includes('delete')) return 'task_deleted';
  if (normalized.includes('create')) return 'task_created';
  if (normalized.includes('update')) return 'task_updated';
  if (normalized.includes('status')) return 'status_changed';
  return 'task_updated';
}

function deriveTaskLists(tasks: Task[]): TaskList[] {
  const grouped = new Map<string, TaskList>();

  tasks.forEach((task, index) => {
    if (!task.taskListId || !task.taskListName) {
      return;
    }

    const existing = grouped.get(task.taskListId);
    if (existing) {
      existing.taskCount += 1;
      if (task.status === 'Closed') {
        existing.completedTasks += 1;
      }
      return;
    }

    grouped.set(task.taskListId, {
      id: task.taskListId,
      name: task.taskListName,
      projectId: task.projectId,
      milestoneId: task.milestoneId,
      sprintId: task.sprintId,
      status: task.status === 'Closed' ? 'Completed' : 'Active',
      taskCount: 1,
      completedTasks: task.status === 'Closed' ? 1 : 0,
      order: index,
    });
  });

  return [...grouped.values()].sort((a, b) => a.order - b.order);
}

function deriveBurndownData(activeSprint: Sprint | undefined, tasks: Task[]): BurndownDataPoint[] {
  if (!activeSprint) {
    return [];
  }

  const sprintTasks = tasks.filter(task => task.sprintId === activeSprint.id);
  if (!sprintTasks.length) {
    return [];
  }

  const totalPoints = sprintTasks.reduce((sum, task) => sum + (task.storyPoints || 1), 0);
  const start = new Date(activeSprint.startDate);
  const end = new Date(activeSprint.endDate);
  const days = Math.max(1, Math.floor((end.getTime() - start.getTime()) / 86400000) + 1);
  const pointsPerDay = totalPoints / days;

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const dayKey = date.toISOString().split('T')[0];
    const remaining = sprintTasks.reduce((sum, task) => {
      const taskPoints = task.storyPoints || 1;
      if (!task.completedDate || task.completedDate > dayKey) {
        return sum + taskPoints;
      }
      return sum;
    }, 0);

    return {
      day: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      date: dayKey,
      ideal: Math.max(0, Number((totalPoints - pointsPerDay * index).toFixed(1))),
      actual: remaining,
    };
  });
}

function mapActivityFeed(entries: ActivityLogEntry[], tasks: Task[], projects: Project[]): ActivityEntry[] {
  return entries.map(entry => {
    const relatedTask = tasks.find(task => task.title === entry.target || task.id === entry.target);
    const relatedProject = projects.find(project => project.name === entry.target || project.id === entry.target)
      || (relatedTask ? projects.find(project => project.id === relatedTask.projectId) : undefined);

    return {
      id: entry.id,
      type: mapActivityType(entry.action),
      actor: entry.userName,
      actorInitial: getInitials(entry.userName),
      message: entry.details || entry.action,
      target: entry.target,
      projectName: relatedProject?.name || relatedTask?.projectName || 'Execution OS',
      projectColor: relatedProject?.color || relatedTask?.projectColor || FALLBACK_PROJECT_COLOR,
      timestamp: entry.timestamp,
    };
  });
}

export function ExecutionOSProvider({ children }: { children: ReactNode }) {
  const executionOS = useExecutionOSService();
  const analytics = useAnalyticsService();
  const [projects, setProjects] = useState<Project[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityEntry[]>([]);
  const [dependencies, setDependencies] = useState<TaskDependency[]>([]);
  const [skillRatings, setSkillRatings] = useState<SkillRating[]>([]);
  const [documents] = useState<ProjectDocument[]>([]);
  const [emails, setEmails] = useState<EmailThread[]>([]);

  const loadData = useCallback(async () => {
    const [
      projectsResponse,
      sprintsResponse,
      milestonesResponse,
      tasksResponse,
      teamMembersResponse,
      issuesResponse,
      timeLogsResponse,
    ] = await Promise.all([
      executionOS.getProjects(),
      executionOS.getSprints(),
      executionOS.getMilestones(),
      executionOS.getTasks(),
      executionOS.getTeamMembers(),
      executionOS.getIssues(),
      executionOS.getTimeLogs(),
    ]);

    const loadedProjects = projectsResponse.data;
    const loadedSprints = sprintsResponse.data;
    const loadedMilestones = milestonesResponse.data;
    const loadedTasks = tasksResponse.data;
    const loadedTeamMembers = teamMembersResponse.data;
    const loadedIssues = issuesResponse.data;
    const loadedTimeLogs = timeLogsResponse.data;
    const loadedTaskLists = deriveTaskLists(loadedTasks);
    const loadedSkillRatings = loadedTeamMembers.flatMap(member =>
      (member.skills || []).map(skill => ({
        memberId: member.id,
        memberName: member.name,
        skill,
        rating: 0 as SkillRating['rating'],
      })),
    );

    setProjects(loadedProjects);
    setSprints(loadedSprints);
    setMilestones(loadedMilestones);
    setTasks(loadedTasks);
    setTaskLists(loadedTaskLists);
    setTeamMembers(loadedTeamMembers);
    setIssues(loadedIssues);
    setTimeLogs(loadedTimeLogs);
    setSkillRatings(loadedSkillRatings);

    const dependencyMatrix = await Promise.all(
      loadedTasks.map(task => executionOS.getDependencies(task.id).catch(() => [])),
    );
    setDependencies(dependencyMatrix.flat());

    try {
      const activityLog = await analytics.getActivityLog();
      setActivityFeed(mapActivityFeed(activityLog.data, loadedTasks, loadedProjects));
    } catch {
      setActivityFeed([]);
    }
  }, [analytics, executionOS]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const addActivity = useCallback((activity: Omit<ActivityEntry, 'id' | 'timestamp'>) => {
    const nextActivity: ActivityEntry = {
      ...activity,
      id: `a-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setActivityFeed(prev => [nextActivity, ...prev].slice(0, 100));
  }, []);

  const createTask = useCallback((taskData: Omit<Task, 'id'>): Task => {
    const nextTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
    };
    setTasks(prev => {
      const nextTasks = [...prev, nextTask];
      setTaskLists(deriveTaskLists(nextTasks));
      return nextTasks;
    });
    addActivity({
      type: 'task_created',
      actor: 'Current User',
      actorInitial: 'C',
      message: 'created task',
      target: nextTask.title,
      projectName: nextTask.projectName,
      projectColor: nextTask.projectColor || FALLBACK_PROJECT_COLOR,
    });
    void executionOS.createTask(taskData).then(loadData).catch(loadData);
    return nextTask;
  }, [addActivity, executionOS, loadData]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    const currentTask = tasks.find(task => task.id === id);
    setTasks(prev => {
      const nextTasks = prev.map(task => task.id === id ? { ...task, ...updates } : task);
      setTaskLists(deriveTaskLists(nextTasks));
      return nextTasks;
    });
    if (currentTask && updates.status) {
      addActivity({
        type: 'status_changed',
        actor: 'Current User',
        actorInitial: 'C',
        message: `changed status to ${updates.status}`,
        target: currentTask.title,
        projectName: currentTask.projectName,
        projectColor: currentTask.projectColor || FALLBACK_PROJECT_COLOR,
      });
    }
    void executionOS.updateTask(id, updates).then(loadData).catch(loadData);
  }, [addActivity, executionOS, loadData, tasks]);

  const deleteTask = useCallback((id: string) => {
    const currentTask = tasks.find(task => task.id === id);
    setTasks(prev => {
      const nextTasks = prev.filter(task => task.id !== id);
      setTaskLists(deriveTaskLists(nextTasks));
      return nextTasks;
    });
    if (currentTask) {
      addActivity({
        type: 'task_deleted',
        actor: 'Current User',
        actorInitial: 'C',
        message: 'deleted task',
        target: currentTask.title,
        projectName: currentTask.projectName,
        projectColor: currentTask.projectColor || FALLBACK_PROJECT_COLOR,
      });
    }
    void executionOS.deleteTask(id).then(loadData).catch(loadData);
  }, [addActivity, executionOS, loadData, tasks]);

  const changeTaskStatus = useCallback((id: string, status: TaskStatus) => {
    updateTask(id, { status });
  }, [updateTask]);

  const toggleTaskComplete = useCallback((id: string) => {
    const currentTask = tasks.find(task => task.id === id);
    if (!currentTask) {
      return;
    }
    changeTaskStatus(id, currentTask.status === 'Closed' ? 'Open' : 'Closed');
  }, [changeTaskStatus, tasks]);

  const assignTask = useCallback((id: string, assignee: string) => {
    const currentTask = tasks.find(task => task.id === id);
    updateTask(id, { assignee });
    if (currentTask) {
      addActivity({
        type: 'task_assigned',
        actor: 'Current User',
        actorInitial: 'C',
        message: `assigned to ${assignee}`,
        target: currentTask.title,
        projectName: currentTask.projectName,
        projectColor: currentTask.projectColor || FALLBACK_PROJECT_COLOR,
      });
    }
  }, [addActivity, tasks, updateTask]);

  const bulkUpdateTasks = useCallback((ids: string[], updates: Partial<Task>) => {
    setTasks(prev => {
      const nextTasks = prev.map(task => ids.includes(task.id) ? { ...task, ...updates } : task);
      setTaskLists(deriveTaskLists(nextTasks));
      return nextTasks;
    });
    addActivity({
      type: 'task_updated',
      actor: 'Current User',
      actorInitial: 'C',
      message: `bulk updated ${ids.length} tasks`,
      target: 'Multiple tasks',
      projectName: 'Execution OS',
      projectColor: FALLBACK_PROJECT_COLOR,
    });
    void Promise.all(ids.map(id => executionOS.updateTask(id, updates))).then(loadData).catch(loadData);
  }, [addActivity, executionOS, loadData]);

  const createProject = useCallback((projectData: Omit<Project, 'id'>): Project => {
    const nextProject: Project = {
      ...projectData,
      id: `project-${Date.now()}`,
    };
    setProjects(prev => [...prev, nextProject]);
    addActivity({
      type: 'project_created',
      actor: 'Current User',
      actorInitial: 'C',
      message: 'created project',
      target: nextProject.name,
      projectName: nextProject.name,
      projectColor: nextProject.color,
    });
    void executionOS.createProject(projectData).then(loadData).catch(loadData);
    return nextProject;
  }, [addActivity, executionOS, loadData]);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(project => project.id === id ? { ...project, ...updates } : project));
    void executionOS.updateProject(id, updates).then(loadData).catch(loadData);
  }, [executionOS, loadData]);

  const deleteProject = useCallback((id: string) => {
    const currentProject = projects.find(project => project.id === id);
    setProjects(prev => prev.filter(project => project.id !== id));
    if (currentProject) {
      addActivity({
        type: 'project_deleted',
        actor: 'Current User',
        actorInitial: 'C',
        message: 'deleted project',
        target: currentProject.name,
        projectName: currentProject.name,
        projectColor: currentProject.color,
      });
    }
    void executionOS.deleteProject(id).then(loadData).catch(loadData);
  }, [addActivity, executionOS, loadData, projects]);

  const changeProjectStatus = useCallback((id: string, status: ProjectStatus) => {
    updateProject(id, { status });
  }, [updateProject]);

  const createMilestone = useCallback((milestoneData: Omit<Milestone, 'id'>): Milestone => {
    const nextMilestone: Milestone = {
      ...milestoneData,
      id: `milestone-${Date.now()}`,
    };
    setMilestones(prev => [...prev, nextMilestone]);
    addActivity({
      type: 'milestone_created',
      actor: 'Current User',
      actorInitial: 'C',
      message: 'created milestone',
      target: nextMilestone.name,
      projectName: nextMilestone.projectName,
      projectColor: FALLBACK_PROJECT_COLOR,
    });
    void executionOS.createMilestone(milestoneData).then(loadData).catch(loadData);
    return nextMilestone;
  }, [addActivity, executionOS, loadData]);

  const updateMilestone = useCallback((id: string, updates: Partial<Milestone>) => {
    setMilestones(prev => prev.map(milestone => milestone.id === id ? { ...milestone, ...updates } : milestone));
    void executionOS.updateMilestone(id, updates).then(loadData).catch(loadData);
  }, [executionOS, loadData]);

  const deleteMilestone = useCallback((id: string) => {
    const currentMilestone = milestones.find(milestone => milestone.id === id);
    setMilestones(prev => prev.filter(milestone => milestone.id !== id));
    if (currentMilestone) {
      addActivity({
        type: 'milestone_deleted',
        actor: 'Current User',
        actorInitial: 'C',
        message: 'deleted milestone',
        target: currentMilestone.name,
        projectName: currentMilestone.projectName,
        projectColor: FALLBACK_PROJECT_COLOR,
      });
    }
    void executionOS.deleteMilestone(id).then(loadData).catch(loadData);
  }, [addActivity, executionOS, loadData, milestones]);

  const changeMilestoneStatus = useCallback((id: string, status: MilestoneStatus) => {
    updateMilestone(id, { status });
  }, [updateMilestone]);

  const createSprint = useCallback((sprintData: Omit<Sprint, 'id'>): Sprint => {
    const nextSprint: Sprint = {
      ...sprintData,
      id: `sprint-${Date.now()}`,
    };
    setSprints(prev => [...prev, nextSprint]);
    addActivity({
      type: 'sprint_created',
      actor: 'Current User',
      actorInitial: 'C',
      message: 'created sprint',
      target: nextSprint.name,
      projectName: nextSprint.projectName,
      projectColor: FALLBACK_PROJECT_COLOR,
    });
    void executionOS.createSprint(sprintData).then(loadData).catch(loadData);
    return nextSprint;
  }, [addActivity, executionOS, loadData]);

  const updateSprint = useCallback((id: string, updates: Partial<Sprint>) => {
    setSprints(prev => prev.map(sprint => sprint.id === id ? { ...sprint, ...updates } : sprint));
    void executionOS.updateSprint(id, updates).then(loadData).catch(loadData);
  }, [executionOS, loadData]);

  const deleteSprint = useCallback((id: string) => {
    const currentSprint = sprints.find(sprint => sprint.id === id);
    setSprints(prev => prev.filter(sprint => sprint.id !== id));
    if (currentSprint) {
      addActivity({
        type: 'sprint_deleted',
        actor: 'Current User',
        actorInitial: 'C',
        message: 'deleted sprint',
        target: currentSprint.name,
        projectName: currentSprint.projectName,
        projectColor: FALLBACK_PROJECT_COLOR,
      });
    }
  }, [addActivity, sprints]);

  const changeSprintStatus = useCallback((id: string, status: SprintStatus) => {
    updateSprint(id, { status });
  }, [updateSprint]);

  const addDependency = useCallback((fromTaskId: string, toTaskId: string, type: TaskDependency['type']) => {
    const nextDependency: TaskDependency = {
      id: `dependency-${Date.now()}`,
      fromTaskId,
      toTaskId,
      type,
    };
    setDependencies(prev => [...prev, nextDependency]);
    void executionOS.addDependency(nextDependency).then(loadData).catch(loadData);
  }, [executionOS, loadData]);

  const removeDependency = useCallback((id: string) => {
    const currentDependency = dependencies.find(dependency => dependency.id === id);
    setDependencies(prev => prev.filter(dependency => dependency.id !== id));
    if (!currentDependency) {
      return;
    }
    void executionOS.removeDependency(currentDependency.fromTaskId, currentDependency.toTaskId).then(loadData).catch(loadData);
  }, [dependencies, executionOS, loadData]);

  const addTimeLog = useCallback((timeLogData: Omit<TimeLog, 'id'>) => {
    const nextLog: TimeLog = {
      ...timeLogData,
      id: `timelog-${Date.now()}`,
    };
    setTimeLogs(prev => [...prev, nextLog]);
    void executionOS.createTimeLog(timeLogData).then(loadData).catch(loadData);
  }, [executionOS, loadData]);

  const updateTimeLog = useCallback((id: string, updates: Partial<TimeLog>) => {
    setTimeLogs(prev => prev.map(log => log.id === id ? { ...log, ...updates } : log));
  }, []);

  const deleteTimeLog = useCallback((id: string) => {
    setTimeLogs(prev => prev.filter(log => log.id !== id));
  }, []);

  const updateSkillRating = useCallback((memberId: string, skill: string, rating: SkillRating['rating']) => {
    setSkillRatings(prev => {
      const existing = prev.find(item => item.memberId === memberId && item.skill === skill);
      if (existing) {
        return prev.map(item => item.memberId === memberId && item.skill === skill ? { ...item, rating } : item);
      }
      const member = teamMembers.find(item => item.id === memberId);
      return [
        ...prev,
        {
          memberId,
          memberName: member?.name || 'Unknown',
          skill,
          rating,
        },
      ];
    });
  }, [teamMembers]);

  const createEmail = useCallback((emailData: Omit<EmailThread, 'id'>): EmailThread => {
    const nextEmail: EmailThread = {
      ...emailData,
      id: `email-${Date.now()}`,
    };
    setEmails(prev => [...prev, nextEmail]);
    addActivity({
      type: 'email_created',
      actor: 'Current User',
      actorInitial: 'C',
      message: 'created email',
      target: nextEmail.subject,
      projectName: nextEmail.projectName || 'Inbox',
      projectColor: FALLBACK_PROJECT_COLOR,
    });
    return nextEmail;
  }, [addActivity]);

  const updateEmail = useCallback((id: string, updates: Partial<EmailThread>) => {
    setEmails(prev => prev.map(email => email.id === id ? { ...email, ...updates } : email));
  }, []);

  const deleteEmail = useCallback((id: string) => {
    const currentEmail = emails.find(email => email.id === id);
    setEmails(prev => prev.filter(email => email.id !== id));
    if (currentEmail) {
      addActivity({
        type: 'email_deleted',
        actor: 'Current User',
        actorInitial: 'C',
        message: 'deleted email',
        target: currentEmail.subject,
        projectName: currentEmail.projectName || 'Inbox',
        projectColor: FALLBACK_PROJECT_COLOR,
      });
    }
  }, [addActivity, emails]);

  const toggleEmailStar = useCallback((id: string) => {
    const currentEmail = emails.find(email => email.id === id);
    if (currentEmail) {
      updateEmail(id, { starred: !currentEmail.starred });
    }
  }, [emails, updateEmail]);

  const toggleEmailRead = useCallback((id: string) => {
    const currentEmail = emails.find(email => email.id === id);
    if (currentEmail) {
      updateEmail(id, { unread: !currentEmail.unread });
    }
  }, [emails, updateEmail]);

  const linkEmailToTask = useCallback((emailId: string, taskId: string) => {
    const currentTask = tasks.find(task => task.id === taskId);
    updateEmail(emailId, { taskId, taskName: currentTask?.title });
  }, [tasks, updateEmail]);

  const linkEmailToProject = useCallback((emailId: string, projectId: string) => {
    const currentProject = projects.find(project => project.id === projectId);
    updateEmail(emailId, { projectId, projectName: currentProject?.name });
  }, [projects, updateEmail]);

  const createTaskFromEmail = useCallback((email: EmailThread): Task => {
    const currentProject = email.projectId
      ? projects.find(project => project.id === email.projectId)
      : projects[0];
    return createTask({
      taskId: `EMAIL-${Date.now().toString().slice(-4)}`,
      title: email.subject,
      description: email.body || email.preview,
      projectId: email.projectId || currentProject?.id || '',
      projectName: email.projectName || currentProject?.name || 'Inbox',
      projectColor: currentProject?.color || FALLBACK_PROJECT_COLOR,
      assignee: email.from,
      assigneeDepartment: currentProject?.department || 'General',
      status: 'Open',
      priority: 'Medium',
      dueDate: new Date(Date.now() + 604800000).toISOString().split('T')[0],
      estimate: '2h',
      estimatedHours: 2,
      actualTime: '0h',
      actualHours: 0,
      billable: true,
      hasEvidence: false,
      evidenceCount: 0,
    });
  }, [createTask, projects]);

  const refreshData = useCallback(() => {
    void loadData();
  }, [loadData]);

  const burndownData = useMemo(
    () => deriveBurndownData(sprints.find(sprint => sprint.status === 'Active') || sprints[0], tasks),
    [sprints, tasks],
  );

  const value = useMemo<ExecutionOSContextValue>(() => ({
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
  }), [
    activityFeed,
    addActivity,
    addDependency,
    addTimeLog,
    assignTask,
    bulkUpdateTasks,
    burndownData,
    changeMilestoneStatus,
    changeProjectStatus,
    changeSprintStatus,
    changeTaskStatus,
    createEmail,
    createMilestone,
    createProject,
    createSprint,
    createTask,
    createTaskFromEmail,
    deleteEmail,
    deleteMilestone,
    deleteProject,
    deleteSprint,
    deleteTask,
    dependencies,
    documents,
    emails,
    issues,
    linkEmailToProject,
    linkEmailToTask,
    milestones,
    projects,
    refreshData,
    removeDependency,
    skillRatings,
    sprints,
    taskLists,
    tasks,
    teamMembers,
    timeLogs,
    toggleEmailRead,
    toggleEmailStar,
    toggleTaskComplete,
    updateEmail,
    updateMilestone,
    updateProject,
    updateSkillRating,
    updateSprint,
    updateTask,
    updateTimeLog,
  ]);

  return <ExecutionOSContext.Provider value={value}>{children}</ExecutionOSContext.Provider>;
}

export function useExecutionOS() {
  const context = useContext(ExecutionOSContext);
  if (!context) {
    throw new Error('useExecutionOS must be used within ExecutionOSProvider');
  }
  return context;
}
