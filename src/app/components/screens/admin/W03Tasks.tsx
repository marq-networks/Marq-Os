import { PageLayout } from '../../shared/PageLayout';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { FormDrawer } from '../../shared/FormDrawer';
import { FormField, Input, Select, TextArea, APIDoc } from '../../ui/form';
import { useToast } from '../../ui/toast';
import {
  CheckSquare,
  Plus,
  List,
  LayoutGrid,
  Calendar as CalendarIcon,
  Filter,
  Download,
  Edit,
  Link as LinkIcon,
  Clock,
  AlertCircle,
  DollarSign,
  CheckCircle,
  XCircle,
  FileText,
  User,
  Target,
  X,
  Search
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { mockTasks, mockMilestones, mockProjects } from './work/mockData';
import { Task, GroupByOption } from './work/types';

// LocalStorage key
const TASKS_STORAGE_KEY = 'workos_admin_tasks';

export function W03Tasks() {
  const { showToast } = useToast();
  
  // Initialize tasks from localStorage or use mock data
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const stored = localStorage.getItem(TASKS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : mockTasks;
      }
    } catch (error) {
      console.error('Failed to load tasks from localStorage:', error);
    }
    return mockTasks;
  });

  // Save to localStorage whenever tasks change
  useEffect(() => {
    try {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Failed to save tasks to localStorage:', error);
    }
  }, [tasks]);

  const [activeTab, setActiveTab] = useState<'all' | 'submitted'>('all');
  const [groupBy, setGroupBy] = useState<GroupByOption>('milestone');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailTab, setDetailTab] = useState<'details' | 'subtasks' | 'timeLogs' | 'evidence' | 'notes' | 'approval' | 'costFinance'>('details');

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    project: 'all',
    assignee: 'all'
  });

  // Export to CSV
  const handleExportToCSV = () => {
    const dataToExport = activeTab === 'all' ? filteredApprovedTasks : filteredSubmittedTasks;
    
    if (dataToExport.length === 0) {
      showToast('warning', 'No data to export', 'There are no tasks matching your filters');
      return;
    }

    // CSV Headers
    const headers = [
      'Task ID',
      'Title',
      'Project',
      'Milestone',
      'Assignee',
      'Status',
      'Priority',
      'Start Date',
      'Due Date',
      'Estimate',
      'Actual Time',
      'Billable',
      'Approval Status'
    ];

    // CSV Rows
    const rows = dataToExport.map(task => [
      task.taskId,
      task.title,
      task.projectName,
      task.milestoneName || 'No Milestone',
      task.assignee,
      task.status,
      task.priority,
      task.startDate || '',
      task.dueDate,
      task.estimate,
      task.actualTime,
      task.billable ? 'Yes' : 'No',
      task.approvalStatus || 'Approved'
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `tasks_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('success', 'Export successful', `Exported ${dataToExport.length} tasks to CSV`);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      priority: 'all',
      project: 'all',
      assignee: 'all'
    });
  };

  // Count active filters
  const activeFiltersCount = Object.entries(filters).filter(
    ([key, value]) => key !== 'search' && value !== 'all'
  ).length + (filters.search ? 1 : 0);

  const handleApprove = async (task: Task) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setTasks(prev => prev.map(t => 
      t.id === task.id 
        ? { ...t, approvalStatus: 'Approved', status: 'To Do' }
        : t
    ));
    
    showToast('success', 'Task approved', `"${task.title}" has been approved and added to the task pool`);
  };

  const handleReject = async (task: Task) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setTasks(prev => prev.map(t => 
      t.id === task.id 
        ? { ...t, approvalStatus: 'Rejected', status: 'Rejected' }
        : t
    ));
    
    showToast('warning', 'Task rejected', `"${task.title}" has been rejected and excluded from performance metrics`);
  };

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setDetailTab('details');
    setIsDetailOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Done': return 'success';
      case 'In Progress': return 'warning';
      case 'Rejected': return 'danger';
      case 'Pending Approval': return 'info';
      default: return 'neutral';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'danger';
      case 'Medium': return 'warning';
      case 'Low': return 'info';
      default: return 'neutral';
    }
  };

  const submittedTasks = tasks.filter(t => t.approvalStatus === 'Pending Approval' && t.submittedByEmployee);
  const approvedTasks = tasks.filter(t => t.approvalStatus === 'Approved');

  const groupTasks = (tasksToGroup: Task[]) => {
    const grouped: { [key: string]: Task[] } = {};

    tasksToGroup.forEach(task => {
      let key = '';
      
      switch (groupBy) {
        case 'milestone':
          key = task.milestoneName || 'No Milestone';
          break;
        case 'assignee':
          key = task.assignee;
          break;
        case 'status':
          key = task.status;
          break;
        case 'project':
          key = task.projectName;
          break;
      }

      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(task);
    });

    return grouped;
  };

  const renderTaskRow = (task: Task, showApprovalActions: boolean = false) => (
    <div key={task.id} className="grid grid-cols-12 gap-4 p-4 hover:bg-muted/30 transition-colors border-b border-border">
      <div className="col-span-1 flex items-center">
        <span className="text-xs font-mono text-muted-foreground">{task.taskId}</span>
      </div>
      
      <div className="col-span-2 flex items-center">
        <div>
          <p className="font-medium text-sm">{task.title}</p>
          {task.submittedByEmployee && (
            <p className="text-xs text-muted-foreground mt-0.5">
              Self-submitted {task.submittedBy && `by ${task.submittedBy}`}
            </p>
          )}
        </div>
      </div>
      
      <div className="col-span-1 flex items-center text-sm">{task.projectName}</div>
      
      <div className="col-span-1 flex items-center text-sm">{task.milestoneName || '-'}</div>
      
      <div className="col-span-1 flex items-center">
        <div className="flex items-center gap-1.5">
          <User className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">{task.assignee}</span>
        </div>
      </div>
      
      <div className="col-span-1 flex items-center">
        <StatusBadge type={getStatusColor(task.status) as any}>{task.status}</StatusBadge>
      </div>
      
      <div className="col-span-1 flex items-center">
        <StatusBadge type={getPriorityColor(task.priority) as any}>{task.priority}</StatusBadge>
      </div>
      
      <div className="col-span-1 flex items-center text-sm">
        {task.startDate ? new Date(task.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-'}
      </div>
      
      <div className="col-span-1 flex items-center text-sm">
        {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </div>
      
      <div className="col-span-1 flex items-center">
        <div className="text-sm">
          <p className="font-medium">{task.estimate}</p>
          <p className="text-xs text-muted-foreground">{task.actualTime}</p>
        </div>
      </div>
      
      <div className="col-span-1 flex items-center justify-end gap-2">
        {showApprovalActions ? (
          <>
            <Button size="sm" variant="outline" onClick={() => handleApprove(task)}>
              <CheckCircle className="h-3 w-3 mr-1" />
              Approve
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleReject(task)}>
              <XCircle className="h-3 w-3 mr-1" />
              Reject
            </Button>
          </>
        ) : (
          <Button size="sm" variant="outline" onClick={() => handleViewTask(task)}>
            View
          </Button>
        )}
      </div>
    </div>
  );

  const displayTasks = activeTab === 'all' ? approvedTasks : submittedTasks;
  const groupedTasks = activeTab === 'all' ? groupTasks(displayTasks) : null;

  const totalTasks = tasks.filter(t => t.approvalStatus === 'Approved').length;
  const completedTasks = tasks.filter(t => t.status === 'Done' && t.approvalStatus === 'Approved').length;
  const overdueTasks = tasks.filter(t => {
    const today = new Date();
    const dueDate = new Date(t.dueDate);
    return dueDate < today && t.status !== 'Done' && t.approvalStatus === 'Approved';
  }).length;

  // Filtered tasks based on active filters
  const filteredApprovedTasks = approvedTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = filters.status === 'all' || task.status === filters.status;
    const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;
    const matchesProject = filters.project === 'all' || task.projectName === filters.project;
    const matchesAssignee = filters.assignee === 'all' || task.assignee === filters.assignee;
    return matchesSearch && matchesStatus && matchesPriority && matchesProject && matchesAssignee;
  });

  const filteredSubmittedTasks = submittedTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = filters.status === 'all' || task.status === filters.status;
    const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;
    const matchesProject = filters.project === 'all' || task.projectName === filters.project;
    const matchesAssignee = filters.assignee === 'all' || task.assignee === filters.assignee;
    return matchesSearch && matchesStatus && matchesPriority && matchesProject && matchesAssignee;
  });

  // Use filtered tasks for display
  const displayedApprovedTasks = activeTab === 'all' ? filteredApprovedTasks : [];
  const displayedSubmittedTasks = activeTab === 'submitted' ? filteredSubmittedTasks : [];
  const finalDisplayTasks = activeTab === 'all' ? filteredApprovedTasks : filteredSubmittedTasks;
  const groupedFilteredTasks = activeTab === 'all' ? groupTasks(filteredApprovedTasks) : null;

  return (
    <>
      <PageLayout
        title="ADMIN – W-03 – Tasks – v1.3"
        description="Zoho-style task management with grouping and approval workflow"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="mr-2 h-4 w-4" />
              Filters {activeFiltersCount > 0 && <span className="text-sm text-red-500">({activeFiltersCount})</span>}
            </Button>
            <Button variant="outline" onClick={handleExportToCSV}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
        }
        kpis={[
          {
            title: 'Total Tasks',
            value: totalTasks.toString(),
            change: `${tasks.length} including pending`,
            icon: <CheckSquare className="h-5 w-5" />
          },
          {
            title: 'Completed',
            value: completedTasks.toString(),
            change: `${Math.round((completedTasks / totalTasks) * 100)}% completion rate`,
            changeType: 'positive',
            icon: <CheckCircle className="h-5 w-5" />
          },
          {
            title: 'Overdue',
            value: overdueTasks.toString(),
            change: overdueTasks > 0 ? 'Needs attention' : 'All on track',
            changeType: overdueTasks > 0 ? 'danger' : 'positive',
            icon: <AlertCircle className="h-5 w-5" />
          },
          {
            title: 'Pending Approval',
            value: submittedTasks.length.toString(),
            change: 'Employee submitted',
            changeType: submittedTasks.length > 0 ? 'warning' : 'neutral',
            icon: <Clock className="h-5 w-5" />
          },
        ]}
      >
        {/* Tabs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-muted-foreground hover:text-foreground'
              }`}
            >
              All Tasks ({approvedTasks.length})
            </button>
            <button
              onClick={() => setActiveTab('submitted')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'submitted'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-muted-foreground hover:text-foreground'
              }`}
            >
              Employee Submitted ({submittedTasks.length})
            </button>
          </div>

          {activeTab === 'all' && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Group by:</span>
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value as GroupByOption)}
                className="px-3 py-2 bg-card border border-border rounded-lg text-sm"
              >
                <option value="milestone">Milestone</option>
                <option value="assignee">Assignee</option>
                <option value="status">Status</option>
                <option value="project">Project</option>
              </select>
            </div>
          )}
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-card border border-border rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-muted-foreground">Apply Filters</h4>
              <Button size="sm" variant="outline" onClick={handleClearFilters}>
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Search</p>
                <Input
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  placeholder="Search tasks..."
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm"
                >
                  <option value="all">All</option>
                  <option value="Done">Done</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Pending Approval">Pending Approval</option>
                </select>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Priority</p>
                <select
                  value={filters.priority}
                  onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm"
                >
                  <option value="all">All</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Project</p>
                <select
                  value={filters.project}
                  onChange={(e) => setFilters({ ...filters, project: e.target.value })}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm"
                >
                  <option value="all">All</option>
                  {mockProjects.map(project => (
                    <option key={project.name} value={project.name}>{project.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Assignee</p>
                <select
                  value={filters.assignee}
                  onChange={(e) => setFilters({ ...filters, assignee: e.target.value })}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm"
                >
                  <option value="all">All</option>
                  {Array.from(new Set(mockTasks.map(task => task.assignee))).map(assignee => (
                    <option key={assignee} value={assignee}>{assignee}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 border-b border-border text-xs font-medium text-muted-foreground">
            <div className="col-span-1">ID</div>
            <div className="col-span-2">Task</div>
            <div className="col-span-1">Project</div>
            <div className="col-span-1">{activeTab === 'submitted' ? 'Reason' : 'Milestone'}</div>
            <div className="col-span-1">{activeTab === 'submitted' ? 'Submitted By' : 'Owner'}</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1">Priority</div>
            <div className="col-span-1">Start</div>
            <div className="col-span-1">Due</div>
            <div className="col-span-1">Est/Act</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {/* Table Body */}
          {activeTab === 'all' && groupedFilteredTasks ? (
            <div>
              {Object.entries(groupedFilteredTasks).map(([groupName, groupTasks]) => (
                <div key={groupName}>
                  <div className="p-3 bg-muted/30 border-b border-border">
                    <div className="flex items-center gap-2">
                      {groupBy === 'milestone' && <Target className="h-4 w-4 text-muted-foreground" />}
                      {groupBy === 'assignee' && <User className="h-4 w-4 text-muted-foreground" />}
                      {groupBy === 'status' && <CheckSquare className="h-4 w-4 text-muted-foreground" />}
                      {groupBy === 'project' && <FileText className="h-4 w-4 text-muted-foreground" />}
                      <span className="font-medium text-sm">{groupName}</span>
                      <span className="text-xs text-muted-foreground">({groupTasks.length})</span>
                    </div>
                  </div>
                  {groupTasks.map(task => renderTaskRow(task))}
                </div>
              ))}
            </div>
          ) : activeTab === 'submitted' ? (
            <div>
              {submittedTasks.length === 0 ? (
                <div className="p-12 text-center">
                  <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="font-medium mb-1">No pending submissions</p>
                  <p className="text-sm text-muted-foreground">Employee-submitted tasks will appear here for approval</p>
                </div>
              ) : (
                submittedTasks.map(task => renderTaskRow(task, true))
              )}
            </div>
          ) : null}
        </div>
      </PageLayout>

      {/* Task Detail Drawer */}
      <FormDrawer
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={selectedTask?.title || 'Task Details'}
        description={selectedTask?.projectName || ''}
        hideSubmit
      >
        {selectedTask && (
          <>
            {/* Detail Tabs */}
            <div className="flex gap-2 border-b border-border mb-6 -mx-6 px-6 overflow-x-auto">
              {[
                { id: 'details', label: 'Details' },
                { id: 'subtasks', label: 'Subtasks' },
                { id: 'timeLogs', label: 'Time Logs' },
                { id: 'evidence', label: 'Evidence' },
                { id: 'notes', label: 'Notes' },
                { id: 'approval', label: 'Approval' },
                { id: 'costFinance', label: 'Cost & Finance' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setDetailTab(tab.id as any)}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    detailTab === tab.id
                      ? 'border-primary text-foreground'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {detailTab === 'details' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Task ID</p>
                    <p className="font-mono text-sm">{selectedTask.taskId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <StatusBadge type={getStatusColor(selectedTask.status) as any}>
                      {selectedTask.status}
                    </StatusBadge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Priority</p>
                    <StatusBadge type={getPriorityColor(selectedTask.priority) as any}>
                      {selectedTask.priority}
                    </StatusBadge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Assignee</p>
                    <p className="font-medium">{selectedTask.assignee}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Project</p>
                    <p className="font-medium">{selectedTask.projectName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Milestone</p>
                    <p className="font-medium">{selectedTask.milestoneName || 'None'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Due Date</p>
                    <p className="font-medium">{new Date(selectedTask.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Estimate</p>
                    <p className="font-medium">{selectedTask.estimate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Actual Time</p>
                    <p className="font-medium">{selectedTask.actualTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Billable</p>
                    <StatusBadge type={selectedTask.billable ? 'info' : 'neutral'}>
                      {selectedTask.billable ? 'Yes' : 'No'}
                    </StatusBadge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Evidence</p>
                    <p className="font-medium">{selectedTask.evidenceCount} items</p>
                  </div>
                  {selectedTask.burnAmount && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Burn Amount</p>
                      <p className="font-medium">${selectedTask.burnAmount}</p>
                    </div>
                  )}
                </div>
                {selectedTask.description && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Description</p>
                    <p className="text-sm p-3 bg-muted/50 rounded-lg">{selectedTask.description}</p>
                  </div>
                )}
              </div>
            )}

            {detailTab === 'subtasks' && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground text-center py-8">
                  No subtasks yet
                </p>
              </div>
            )}

            {detailTab === 'timeLogs' && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground text-center py-8">
                  No time logs yet
                </p>
              </div>
            )}

            {detailTab === 'evidence' && (
              <div className="space-y-2">
                {selectedTask.hasEvidence ? (
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium">{selectedTask.evidenceCount} evidence items</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No evidence uploaded yet
                  </p>
                )}
              </div>
            )}

            {detailTab === 'notes' && (
              <div className="space-y-2">
                {selectedTask.notes ? (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm">{selectedTask.notes}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No notes yet
                  </p>
                )}
              </div>
            )}

            {detailTab === 'approval' && (
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Approval Status</p>
                    <StatusBadge type={
                      selectedTask.approvalStatus === 'Approved' ? 'success' :
                      selectedTask.approvalStatus === 'Rejected' ? 'danger' : 'warning'
                    }>
                      {selectedTask.approvalStatus || 'Approved'}
                    </StatusBadge>
                  </div>
                  {selectedTask.submittedByEmployee && (
                    <>
                      <p className="text-sm text-muted-foreground mb-1">Submitted by</p>
                      <p className="font-medium mb-3">{selectedTask.submittedBy}</p>
                      <p className="text-sm text-muted-foreground mb-1">Reason</p>
                      <p className="text-sm">{selectedTask.description || 'No reason provided'}</p>
                    </>
                  )}
                </div>
                {selectedTask.approvalStatus === 'Approved' && (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <CheckCircle className="h-4 w-4" />
                      <p className="text-sm font-medium">This task counts toward performance metrics</p>
                    </div>
                  </div>
                )}
                {selectedTask.approvalStatus === 'Rejected' && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                      <XCircle className="h-4 w-4" />
                      <p className="text-sm font-medium">This task is excluded from performance metrics</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {detailTab === 'costFinance' && (
              <div className="space-y-6">
                {/* Live Cost Panels */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Actual Task Cost */}
                  <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Actual Task Cost</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      ${(selectedTask.calculatedCost || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-blue-800 dark:text-blue-200 mt-1">
                      Based on actual time logged
                    </p>
                  </div>

                  {/* Linked Expenses */}
                  <div className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">Linked Expenses Cost</p>
                    </div>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                      ${(selectedTask.linkedExpenses || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-purple-800 dark:text-purple-200 mt-1">
                      {selectedTask.linkedReceipts || 0} receipts attached
                    </p>
                  </div>

                  {/* Salary Cost from Time Logs */}
                  <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <p className="text-sm font-semibold text-green-900 dark:text-green-100">Salary Cost (Time Logs)</p>
                    </div>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                      ${(selectedTask.calculatedCost || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-green-800 dark:text-green-200 mt-1">
                      {selectedTask.actualTime} at ${selectedTask.departmentCostRate || 75}/h
                    </p>
                  </div>

                  {/* Task Margin */}
                  <div className={`border rounded-lg p-4 ${
                    selectedTask.billable 
                      ? 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800'
                      : 'bg-muted/50 border-border'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Target className={`h-4 w-4 ${
                        selectedTask.billable
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-muted-foreground'
                      }`} />
                      <p className={`text-sm font-semibold ${
                        selectedTask.billable
                          ? 'text-yellow-900 dark:text-yellow-100'
                          : 'text-muted-foreground'
                      }`}>
                        Task Margin
                      </p>
                    </div>
                    {selectedTask.billable ? (
                      <>
                        <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                          ${(selectedTask.profitImpact || 0).toLocaleString()}
                        </p>
                        <p className="text-xs text-yellow-800 dark:text-yellow-200 mt-1">
                          Billable task margin projection
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-2xl font-bold text-muted-foreground">N/A</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Non-billable task
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Total Task Impact on Project Burn */}
                <div className="bg-card border border-border rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    Project Burn Impact
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">Salary Cost</span>
                      <span className="font-semibold">${(selectedTask.calculatedCost || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">Linked Expenses</span>
                      <span className="font-semibold">${(selectedTask.linkedExpenses || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-border">
                      <span className="text-sm font-semibold">Total Burn Contribution</span>
                      <span className="font-bold text-lg">
                        ${((selectedTask.calculatedCost || 0) + (selectedTask.linkedExpenses || 0)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Finance Evidence */}
                <div className="bg-card border border-border rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Finance Evidence
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                      <span className="text-muted-foreground">Linked Expenses</span>
                      <span className="font-medium">{selectedTask.linkedExpenses ? '1 expense' : 'None'}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                      <span className="text-muted-foreground">Linked Receipts</span>
                      <span className="font-medium">{selectedTask.linkedReceipts || 0} receipts</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                      <span className="text-muted-foreground">Posted Finance Entries</span>
                      <span className="font-medium">{selectedTask.linkedTransactions || 0} entries</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="w-full mt-4">
                    <Download className="h-3 w-3 mr-2" />
                    Export Finance Evidence
                  </Button>
                </div>

                {/* Auto Update Note */}
                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Live Sync:</strong> These values automatically contribute to project burn calculations in real-time. 
                    All cost movements are audit logged and require approval before affecting finance ledger.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </FormDrawer>
    </>
  );
}