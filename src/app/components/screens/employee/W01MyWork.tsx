import { PageLayout } from '../../shared/PageLayout';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { FormDrawer } from '../../shared/FormDrawer';
import { FormField, TextArea, Input, Select, APIDoc } from '../../ui/form';
import { useToast } from '../../ui/toast';
import { 
  CheckSquare, 
  Play, 
  Check, 
  Clock, 
  AlertCircle,
  FileText,
  Link as LinkIcon,
  TrendingUp,
  Calendar,
  Plus,
  DollarSign
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { mockTasks as initialMockTasks, mockProjects } from '../admin/work/mockData';
import type { Task } from '../admin/work/types';

// LocalStorage key
const TASKS_STORAGE_KEY = 'workos_my_tasks';

export function W01MyWork() {
  const { showToast } = useToast();
  
  // Initialize tasks from localStorage or use mock data
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const stored = localStorage.getItem(TASKS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialMockTasks;
      }
    } catch (error) {
      console.error('Failed to load tasks from localStorage:', error);
    }
    return initialMockTasks;
  });
  
  // Save to localStorage whenever tasks change
  useEffect(() => {
    try {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Failed to save tasks to localStorage:', error);
    }
  }, [tasks]);
  
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [notes, setNotes] = useState('');

  // Add Task Form States
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);
  const [newTaskForm, setNewTaskForm] = useState({
    title: '',
    project: '',
    priority: 'Medium' as 'High' | 'Medium' | 'Low',
    dueDate: '',
    estimate: '',
    billable: false,
    description: ''
  });
  const [taskFormErrors, setTaskFormErrors] = useState<any>({});

  const todayTasks = tasks.filter(t => {
    const today = new Date().toISOString().split('T')[0];
    const dueDate = new Date(t.dueDate).toISOString().split('T')[0];
    return dueDate === today && t.status !== 'Done';
  });

  const upcomingTasks = tasks.filter(t => {
    const today = new Date();
    const dueDate = new Date(t.dueDate);
    return dueDate > today && t.status !== 'Done';
  }).slice(0, 3);

  const overdueTasks = tasks.filter(t => {
    const today = new Date();
    const dueDate = new Date(t.dueDate);
    return dueDate < today && t.status !== 'Done';
  });

  const inProgressTasks = tasks.filter(t => t.status === 'In Progress');

  const pendingApprovalTasks = tasks.filter(t => t.status === 'Pending Approval' || t.approvalStatus === 'Pending Approval');

  const allMyTasks = tasks.filter(t => t.status !== 'Done').sort((a, b) => {
    // Sort by due date
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const handleStartTask = (task: Task) => {
    setTasks(prev => prev.map(t => 
      t.id === task.id ? { ...t, status: 'In Progress' } : t
    ));
    showToast('success', 'Task started', `Timer started for "${task.title}"`);
  };

  const handleMarkDone = (task: Task) => {
    setTasks(prev => prev.map(t => 
      t.id === task.id ? { ...t, status: 'Done', progress: 100 } : t
    ));
    showToast('success', 'Task completed', `"${task.title}" marked as done`);
  };

  const handleViewDetails = (task: Task) => {
    setSelectedTask(task);
    setIsDetailOpen(true);
  };

  const handleAddNote = (task: Task) => {
    setSelectedTask(task);
    setNotes(task.notes || '');
    setIsNotesOpen(true);
  };

  const handleSaveNote = () => {
    if (selectedTask) {
      setTasks(prev => prev.map(t => 
        t.id === selectedTask.id ? { ...t, notes } : t
      ));
      showToast('success', 'Note saved', 'Task notes updated successfully');
    }
    setIsNotesOpen(false);
  };

  const validateNewTask = (): boolean => {
    const errors: any = {};
    
    if (!newTaskForm.title.trim()) errors.title = 'Task name is required';
    if (!newTaskForm.dueDate) errors.dueDate = 'Due date is required';
    if (!newTaskForm.estimate.trim()) errors.estimate = 'Estimate is required';
    if (!newTaskForm.description.trim()) errors.description = 'Description is required';

    setTaskFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitNewTask = async () => {
    if (!validateNewTask()) return;

    // Prevent duplicate submissions
    if (isSubmittingTask) return;

    setIsSubmittingTask(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newTask: Task = {
        id: Date.now().toString(),
        taskId: `T-${Date.now().toString().slice(-3)}`,
        title: newTaskForm.title,
        projectId: '0',
        projectName: newTaskForm.project || 'Unassigned',
        assignee: 'Current User',
        assigneeDepartment: 'Unknown',
        status: 'Pending Approval',
        approvalStatus: 'Pending Approval',
        priority: newTaskForm.priority,
        dueDate: newTaskForm.dueDate,
        estimate: newTaskForm.estimate,
        actualTime: '0h',
        billable: newTaskForm.billable,
        hasEvidence: false,
        evidenceCount: 0,
        submittedByEmployee: true,
        submittedBy: 'Current User',
        description: newTaskForm.description
      };

      setTasks(prev => [...prev, newTask]);
      
      // Reset form
      setNewTaskForm({
        title: '',
        project: '',
        priority: 'Medium',
        dueDate: '',
        estimate: '',
        billable: false,
        description: ''
      });
      
      // Clear errors
      setTaskFormErrors({});
      
      // Close drawer
      setIsAddTaskOpen(false);

      showToast('success', 'Task submitted for approval', 'Your manager will review this task request');
    } catch (error) {
      showToast('error', 'Submission failed', 'Please try again');
    } finally {
      setIsSubmittingTask(false);
    }
  };

  const handleCloseAddTaskDrawer = () => {
    // Reset form when closing
    setNewTaskForm({
      title: '',
      project: '',
      priority: 'Medium',
      dueDate: '',
      estimate: '',
      billable: false,
      description: ''
    });
    setTaskFormErrors({});
    setIsSubmittingTask(false);
    setIsAddTaskOpen(false);
  };

  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));
    showToast('success', 'Task deleted', `"${taskToDelete?.title}" has been removed`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'danger';
      case 'Medium': return 'warning';
      case 'Low': return 'info';
      default: return 'neutral';
    }
  };

  const totalEstimate = tasks.filter(t => t.status !== 'Done').reduce((sum, t) => {
    const estimate = t.estimate || '0h';
    return sum + parseFloat(estimate.replace('h', '') || '0');
  }, 0);

  const totalLogged = tasks.reduce((sum, t) => {
    const timeStr = t.actualTime || '0h';
    const hours = parseFloat(timeStr.replace('h', '').replace('m', '').split(' ')[0] || '0');
    const mins = parseFloat(timeStr.split(' ')[1]?.replace('m', '') || '0');
    return sum + hours + (mins / 60);
  }, 0);

  const TaskCard = ({ task }: { task: Task }) => {
    const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Done';
    
    return (
      <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium mb-1 truncate">{task.title}</h4>
            <p className="text-sm text-muted-foreground">{task.projectName}</p>
          </div>
          <StatusBadge type={getPriorityColor(task.priority) as any}>
            {task.priority}
          </StatusBadge>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span className={isOverdue ? 'text-red-500 font-medium' : ''}>
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{task.actualTime} / {task.estimate}</span>
          </div>
          {task.billable && (
            <span className="text-green-600 dark:text-green-400 font-medium">Billable</span>
          )}
        </div>

        {/* Progress Bar */}
        {task.status === 'In Progress' && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{task.progress || 0}%</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all"
                style={{ width: `${task.progress || 0}%` }}
              />
            </div>
          </div>
        )}

        {/* Evidence Links */}
        {task.evidenceCount > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
            <LinkIcon className="h-3 w-3" />
            <span>{task.evidenceCount} evidence item{task.evidenceCount > 1 ? 's' : ''}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          {task.status === 'To Do' && (
            <Button size="sm" onClick={() => handleStartTask(task)} className="flex-1">
              <Play className="h-3 w-3 mr-1" />
              Start Task
            </Button>
          )}
          {task.status === 'In Progress' && (
            <Button size="sm" onClick={() => handleMarkDone(task)} className="flex-1">
              <Check className="h-3 w-3 mr-1" />
              Mark Done
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => handleViewDetails(task)}>
            Details
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleAddNote(task)}>
            <FileText className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleDeleteTask(task.id)}>
            Delete
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <PageLayout
        title="EMPLOYEE – W-01 – My Work – v1.3"
        description="Your personal execution cockpit"
        actions={
          <Button onClick={() => setIsAddTaskOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add My Task
          </Button>
        }
        kpis={[
          {
            title: 'Today\'s Tasks',
            value: todayTasks.length.toString(),
            change: `${todayTasks.length} due today`,
            changeType: todayTasks.length > 0 ? 'warning' : 'positive',
            icon: <CheckSquare className="h-5 w-5" />
          },
          {
            title: 'In Progress',
            value: inProgressTasks.length.toString(),
            change: `${Math.round(inProgressTasks.reduce((sum, t) => sum + t.progress, 0) / (inProgressTasks.length || 1))}% avg progress`,
            icon: <TrendingUp className="h-5 w-5" />
          },
          {
            title: 'Overdue',
            value: overdueTasks.length.toString(),
            change: overdueTasks.length > 0 ? 'Needs attention' : 'All caught up',
            changeType: overdueTasks.length > 0 ? 'danger' : 'positive',
            icon: <AlertCircle className="h-5 w-5" />
          },
          {
            title: 'Time Logged',
            value: `${totalLogged.toFixed(1)}h`,
            change: `${totalEstimate.toFixed(1)}h remaining`,
            icon: <Clock className="h-5 w-5" />
          },
        ]}
      >
        <div className="grid grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="col-span-8 space-y-6">
            {/* Overdue Tasks */}
            {overdueTasks.length > 0 && (
              <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <h3 className="font-semibold text-red-900 dark:text-red-100">
                    Overdue Tasks ({overdueTasks.length})
                  </h3>
                </div>
                <div className="space-y-3">
                  {overdueTasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            )}

            {/* Today's Tasks */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold mb-4">Today's Tasks ({todayTasks.length})</h3>
              {todayTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No tasks due today. Great job staying on schedule! 🎉
                </p>
              ) : (
                <div className="space-y-3">
                  {todayTasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming Tasks */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold mb-4">Upcoming Tasks</h3>
              <div className="space-y-3">
                {upcomingTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>

            {/* All My Tasks */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">All My Tasks ({allMyTasks.length})</h3>
                {pendingApprovalTasks.length > 0 && (
                  <StatusBadge type="warning">
                    {pendingApprovalTasks.length} Pending Approval
                  </StatusBadge>
                )}
              </div>
              {allMyTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No active tasks. Click "Add My Task" to create one!
                </p>
              ) : (
                <div className="space-y-3">
                  {allMyTasks.map(task => (
                    <div key={task.id} className="relative">
                      {(task.status === 'Pending Approval' || task.approvalStatus === 'Pending Approval') && (
                        <div className="absolute -top-2 -right-2 z-10">
                          <StatusBadge type="warning">
                            Pending
                          </StatusBadge>
                        </div>
                      )}
                      <TaskCard task={task} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-span-4 space-y-6">
            {/* In Progress Summary */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold mb-4">In Progress</h3>
              {inProgressTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tasks in progress</p>
              ) : (
                <div className="space-y-4">
                  {inProgressTasks.map(task => (
                    <div key={task.id} className="pb-4 border-b border-border last:border-0 last:pb-0">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-medium truncate flex-1">{task.title}</p>
                        <span className="text-xs text-muted-foreground ml-2">{task.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Tasks</span>
                  <span className="font-medium">{tasks.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Completed</span>
                  <span className="font-medium text-green-600">
                    {tasks.filter(t => t.status === 'Done').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Billable Tasks</span>
                  <span className="font-medium">
                    {tasks.filter(t => t.billable && t.status !== 'Done').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Completion Rate</span>
                  <span className="font-medium">
                    {Math.round((tasks.filter(t => t.status === 'Done').length / tasks.length) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>

      {/* Task Detail Drawer */}
      {selectedTask && (
        <FormDrawer
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={selectedTask.title}
          description={selectedTask.projectName}
          onSubmit={() => setIsDetailOpen(false)}
          submitLabel="Close"
          apiDoc={
            <APIDoc
              method="GET"
              endpoint={`/api/tasks/${selectedTask.id}`}
              response={{
                id: "uuid",
                title: "string",
                projectName: "string",
                status: "To Do | In Progress | Done",
                actualTime: "string",
                evidenceCount: "number",
                approvalStatus: "Approved | Pending | Rejected"
              }}
            />
          }
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <StatusBadge type={
                  selectedTask.status === 'Done' ? 'success' :
                  selectedTask.status === 'In Progress' ? 'warning' : 'neutral'
                }>
                  {selectedTask.status}
                </StatusBadge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Priority</p>
                <StatusBadge type={getPriorityColor(selectedTask.priority) as any}>
                  {selectedTask.priority}
                </StatusBadge>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Due Date</p>
              <p className="font-medium">{new Date(selectedTask.dueDate).toLocaleDateString('en-US', { 
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
              })}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Estimate</p>
                <p className="font-medium">{selectedTask.estimate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Time Logged</p>
                <p className="font-medium">{selectedTask.actualTime}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Progress</p>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-1">
                <div 
                  className="h-full bg-primary"
                  style={{ width: `${selectedTask.progress || 0}%` }}
                />
              </div>
              <p className="text-sm font-medium">{selectedTask.progress || 0}% Complete</p>
            </div>

            {selectedTask.description && (
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm font-medium mb-2">Notes</p>
                <p className="text-sm text-muted-foreground">{selectedTask.description}</p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium mb-2">Evidence</p>
              <p className="text-sm text-muted-foreground">
                {selectedTask.evidenceCount} evidence item{selectedTask.evidenceCount !== 1 ? 's' : ''} linked to this task
              </p>
            </div>
          </div>
        </FormDrawer>
      )}

      {/* Notes Drawer */}
      <FormDrawer
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        title="Add Task Notes"
        description="Document your progress and thoughts"
        onSubmit={handleSaveNote}
        submitLabel="Save Notes"
      >
        <FormField
          label="Task Notes"
          name="notes"
          helperText="Notes are private and help track your work progress"
        >
          <TextArea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about this task..."
            rows={8}
          />
        </FormField>
      </FormDrawer>

      {/* Add Task Drawer */}
      <FormDrawer
        isOpen={isAddTaskOpen}
        onClose={handleCloseAddTaskDrawer}
        title="Add My Task"
        description="Create a new task for yourself"
        onSubmit={handleSubmitNewTask}
        submitLabel="Submit Task"
        submitDisabled={isSubmittingTask}
        submitLoading={isSubmittingTask}
      >
        <FormField
          label="Task Title"
          name="title"
          error={taskFormErrors.title}
        >
          <Input
            id="title"
            value={newTaskForm.title}
            onChange={(e) => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
            placeholder="Enter task title..."
          />
        </FormField>

        <FormField
          label="Project"
          name="project"
        >
          <Select
            id="project"
            value={newTaskForm.project}
            onChange={(e) => setNewTaskForm({ ...newTaskForm, project: e.target.value })}
            options={mockProjects.map(p => ({ value: p.name, label: p.name }))}
          />
        </FormField>

        <FormField
          label="Priority"
          name="priority"
        >
          <Select
            id="priority"
            value={newTaskForm.priority}
            onChange={(e) => setNewTaskForm({ ...newTaskForm, priority: e.target.value as 'High' | 'Medium' | 'Low' })}
            options={[
              { value: 'High', label: 'High' },
              { value: 'Medium', label: 'Medium' },
              { value: 'Low', label: 'Low' }
            ]}
          />
        </FormField>

        <FormField
          label="Due Date"
          name="dueDate"
          error={taskFormErrors.dueDate}
        >
          <Input
            id="dueDate"
            type="date"
            value={newTaskForm.dueDate}
            onChange={(e) => setNewTaskForm({ ...newTaskForm, dueDate: e.target.value })}
          />
        </FormField>

        <FormField
          label="Estimate"
          name="estimate"
          error={taskFormErrors.estimate}
        >
          <Input
            id="estimate"
            value={newTaskForm.estimate}
            onChange={(e) => setNewTaskForm({ ...newTaskForm, estimate: e.target.value })}
            placeholder="Enter estimate (e.g., 4h)..."
          />
        </FormField>

        <FormField
          label="Billable"
          name="billable"
        >
          <Select
            id="billable"
            value={newTaskForm.billable ? 'Yes' : 'No'}
            onChange={(e) => setNewTaskForm({ ...newTaskForm, billable: e.target.value === 'Yes' })}
            options={[
              { value: 'Yes', label: 'Yes' },
              { value: 'No', label: 'No' }
            ]}
          />
        </FormField>

        <FormField
          label="Description"
          name="description"
          error={taskFormErrors.description}
        >
          <TextArea
            id="description"
            value={newTaskForm.description}
            onChange={(e) => setNewTaskForm({ ...newTaskForm, description: e.target.value })}
            placeholder="Enter task description..."
            rows={4}
          />
        </FormField>
      </FormDrawer>
    </>
  );
}