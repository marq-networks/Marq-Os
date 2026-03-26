import { PageLayout } from '../../../shared/PageLayout';
import { StatusBadge } from '../../../shared/StatusBadge';
import { Button } from '../../../ui/button';
import { FormDrawer } from '../../../shared/FormDrawer';
import { FormField, Input, Select, APIDoc } from '../../../ui/form';
import { useToast } from '../../../ui/toast';
import { 
  Target, 
  Plus,
  ChevronDown,
  ChevronRight,
  Calendar,
  User,
  CheckSquare,
  TrendingUp
} from 'lucide-react';
import { useState } from 'react';
import { mockMilestones, mockTasks, mockProjects } from './mockData';
import { Milestone } from './types';

export function W06Milestones() {
  const { showToast } = useToast();
  const [milestones, setMilestones] = useState(mockMilestones);
  const [expandedMilestones, setExpandedMilestones] = useState<Set<string>>(new Set());
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [milestoneForm, setMilestoneForm] = useState({
    name: '',
    projectId: '',
    owner: '',
    startDate: '',
    endDate: ''
  });
  const [formErrors, setFormErrors] = useState<any>({});

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedMilestones);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedMilestones(newExpanded);
  };

  const getMilestoneTasks = (milestoneId: string) => {
    return mockTasks.filter(t => t.milestoneId === milestoneId);
  };

  const handleAdd = () => {
    setMilestoneForm({
      name: '',
      projectId: '',
      owner: '',
      startDate: '',
      endDate: ''
    });
    setFormErrors({});
    setIsAddOpen(true);
  };

  const handleEdit = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setMilestoneForm({
      name: milestone.name,
      projectId: milestone.projectId,
      owner: milestone.owner,
      startDate: milestone.startDate,
      endDate: milestone.endDate
    });
    setFormErrors({});
    setIsEditOpen(true);
  };

  const validateForm = (): boolean => {
    const errors: any = {};
    
    if (!milestoneForm.name.trim()) errors.name = 'Milestone name is required';
    if (!milestoneForm.projectId) errors.projectId = 'Project is required';
    if (!milestoneForm.owner.trim()) errors.owner = 'Owner is required';
    if (!milestoneForm.startDate) errors.startDate = 'Start date is required';
    if (!milestoneForm.endDate) errors.endDate = 'End date is required';

    if (milestoneForm.startDate && milestoneForm.endDate) {
      if (new Date(milestoneForm.endDate) < new Date(milestoneForm.startDate)) {
        errors.endDate = 'End date must be after start date';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitAdd = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const selectedProject = mockProjects.find(p => p.id === milestoneForm.projectId);

    const newMilestone: Milestone = {
      id: `m${Date.now()}`,
      projectId: milestoneForm.projectId,
      projectName: selectedProject?.name || '',
      name: milestoneForm.name,
      owner: milestoneForm.owner,
      startDate: milestoneForm.startDate,
      endDate: milestoneForm.endDate,
      progress: 0,
      status: 'Not Started',
      taskCount: 0,
      completedTasks: 0
    };

    setMilestones(prev => [...prev, newMilestone]);
    setIsSubmitting(false);
    setIsAddOpen(false);
    showToast('success', 'Milestone created', `"${newMilestone.name}" has been added successfully`);
  };

  const handleSubmitEdit = async () => {
    if (!validateForm() || !selectedMilestone) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const selectedProject = mockProjects.find(p => p.id === milestoneForm.projectId);

    setMilestones(prev => prev.map(m => 
      m.id === selectedMilestone.id 
        ? { 
            ...m, 
            name: milestoneForm.name,
            projectId: milestoneForm.projectId,
            projectName: selectedProject?.name || m.projectName,
            owner: milestoneForm.owner,
            startDate: milestoneForm.startDate,
            endDate: milestoneForm.endDate
          } 
        : m
    ));

    setIsSubmitting(false);
    setIsEditOpen(false);
    showToast('success', 'Milestone updated', 'Changes have been saved successfully');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'warning';
      case 'Overdue': return 'danger';
      default: return 'neutral';
    }
  };

  const totalMilestones = milestones.length;
  const completedMilestones = milestones.filter(m => m.status === 'Completed').length;
  const inProgressMilestones = milestones.filter(m => m.status === 'In Progress').length;
  const overdueMilestones = milestones.filter(m => m.status === 'Overdue').length;

  return (
    <>
      <PageLayout
        title="ADMIN – W-06 – Milestones – v1.3"
        description="Project milestones and delivery tracking"
        actions={
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add Milestone
          </Button>
        }
        kpis={[
          {
            title: 'Total Milestones',
            value: totalMilestones.toString(),
            change: `${mockProjects.length} projects`,
            icon: <Target className="h-5 w-5" />
          },
          {
            title: 'In Progress',
            value: inProgressMilestones.toString(),
            change: `${Math.round((inProgressMilestones / totalMilestones) * 100)}% of total`,
            icon: <TrendingUp className="h-5 w-5" />
          },
          {
            title: 'Completed',
            value: completedMilestones.toString(),
            change: `${Math.round((completedMilestones / totalMilestones) * 100)}% completion rate`,
            changeType: 'positive',
            icon: <CheckSquare className="h-5 w-5" />
          },
          {
            title: 'Overdue',
            value: overdueMilestones.toString(),
            change: overdueMilestones > 0 ? 'Needs attention' : 'All on track',
            changeType: overdueMilestones > 0 ? 'danger' : 'positive',
            icon: <Calendar className="h-5 w-5" />
          },
        ]}
      >
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 border-b border-border text-sm font-medium text-muted-foreground">
            <div className="col-span-1"></div>
            <div className="col-span-3">Milestone</div>
            <div className="col-span-2">Project</div>
            <div className="col-span-2">Owner</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1">Progress</div>
            <div className="col-span-1">Tasks</div>
            <div className="col-span-1">Actions</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border">
            {milestones.map(milestone => {
              const isExpanded = expandedMilestones.has(milestone.id);
              const tasks = getMilestoneTasks(milestone.id);
              
              return (
                <div key={milestone.id}>
                  {/* Milestone Row */}
                  <div className="grid grid-cols-12 gap-4 p-4 hover:bg-muted/30 transition-colors">
                    <div className="col-span-1 flex items-center">
                      <button
                        onClick={() => toggleExpand(milestone.id)}
                        className="p-1 hover:bg-muted rounded"
                        disabled={tasks.length === 0}
                      >
                        {tasks.length > 0 ? (
                          isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )
                        ) : (
                          <div className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    
                    <div className="col-span-3">
                      <p className="font-medium">{milestone.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(milestone.startDate).toLocaleDateString()} - {new Date(milestone.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="col-span-2 flex items-center">
                      <span className="text-sm">{milestone.projectName}</span>
                    </div>
                    
                    <div className="col-span-2 flex items-center">
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{milestone.owner}</span>
                      </div>
                    </div>
                    
                    <div className="col-span-1 flex items-center">
                      <StatusBadge type={getStatusColor(milestone.status) as any}>
                        {milestone.status}
                      </StatusBadge>
                    </div>
                    
                    <div className="col-span-1 flex items-center">
                      <div className="w-full">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium">{milestone.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all"
                            style={{ width: `${milestone.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-span-1 flex items-center">
                      <span className="text-sm">
                        {milestone.completedTasks}/{milestone.taskCount}
                      </span>
                    </div>
                    
                    <div className="col-span-1 flex items-center">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEdit(milestone)}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Tasks */}
                  {isExpanded && tasks.length > 0 && (
                    <div className="bg-muted/20 p-4 border-t border-border">
                      <div className="space-y-2">
                        {tasks.map(task => (
                          <div 
                            key={task.id} 
                            className="flex items-center justify-between p-3 bg-card rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-mono text-muted-foreground">{task.taskId}</span>
                              <span className="text-sm">{task.title}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <StatusBadge type={
                                task.priority === 'High' ? 'danger' :
                                task.priority === 'Medium' ? 'warning' : 'info'
                              }>
                                {task.priority}
                              </StatusBadge>
                              <span className="text-xs text-muted-foreground">{task.assignee}</span>
                              <StatusBadge type={
                                task.status === 'Done' ? 'success' :
                                task.status === 'In Progress' ? 'warning' : 'neutral'
                              }>
                                {task.status}
                              </StatusBadge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </PageLayout>

      {/* Add Milestone Drawer */}
      <FormDrawer
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Milestone"
        description="Create a new project milestone"
        onSubmit={handleSubmitAdd}
        submitLabel="Create Milestone"
        submitDisabled={isSubmitting}
        submitLoading={isSubmitting}
        apiDoc={
          <APIDoc
            method="POST"
            endpoint="/api/milestones"
            request={{
              name: "string",
              projectId: "uuid",
              owner: "string",
              startDate: "date",
              endDate: "date"
            }}
          />
        }
      >
        <FormField
          label="Milestone Name"
          name="name"
          error={formErrors.name}
        >
          <Input
            id="name"
            value={milestoneForm.name}
            onChange={(e) => setMilestoneForm({ ...milestoneForm, name: e.target.value })}
            placeholder="Enter milestone name..."
          />
        </FormField>

        <FormField
          label="Project"
          name="projectId"
          error={formErrors.projectId}
        >
          <Select
            id="projectId"
            value={milestoneForm.projectId}
            onChange={(e) => setMilestoneForm({ ...milestoneForm, projectId: e.target.value })}
            options={[
              { value: '', label: 'Select project...' },
              ...mockProjects.map(p => ({ value: p.id, label: p.name }))
            ]}
          />
        </FormField>

        <FormField
          label="Owner"
          name="owner"
          error={formErrors.owner}
        >
          <Input
            id="owner"
            value={milestoneForm.owner}
            onChange={(e) => setMilestoneForm({ ...milestoneForm, owner: e.target.value })}
            placeholder="Enter owner name..."
          />
        </FormField>

        <FormField
          label="Start Date"
          name="startDate"
          error={formErrors.startDate}
        >
          <Input
            id="startDate"
            type="date"
            value={milestoneForm.startDate}
            onChange={(e) => setMilestoneForm({ ...milestoneForm, startDate: e.target.value })}
          />
        </FormField>

        <FormField
          label="End Date"
          name="endDate"
          error={formErrors.endDate}
        >
          <Input
            id="endDate"
            type="date"
            value={milestoneForm.endDate}
            onChange={(e) => setMilestoneForm({ ...milestoneForm, endDate: e.target.value })}
          />
        </FormField>
      </FormDrawer>

      {/* Edit Milestone Drawer */}
      <FormDrawer
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Milestone"
        description="Update milestone details"
        onSubmit={handleSubmitEdit}
        submitLabel="Save Changes"
        submitDisabled={isSubmitting}
        submitLoading={isSubmitting}
        apiDoc={
          <APIDoc
            method="PUT"
            endpoint={`/api/milestones/${selectedMilestone?.id}`}
            request={{
              name: "string",
              projectId: "uuid",
              owner: "string",
              startDate: "date",
              endDate: "date"
            }}
          />
        }
      >
        <FormField
          label="Milestone Name"
          name="name"
          error={formErrors.name}
        >
          <Input
            id="name"
            value={milestoneForm.name}
            onChange={(e) => setMilestoneForm({ ...milestoneForm, name: e.target.value })}
            placeholder="Enter milestone name..."
          />
        </FormField>

        <FormField
          label="Project"
          name="projectId"
          error={formErrors.projectId}
        >
          <Select
            id="projectId"
            value={milestoneForm.projectId}
            onChange={(e) => setMilestoneForm({ ...milestoneForm, projectId: e.target.value })}
            options={[
              { value: '', label: 'Select project...' },
              ...mockProjects.map(p => ({ value: p.id, label: p.name }))
            ]}
          />
        </FormField>

        <FormField
          label="Owner"
          name="owner"
          error={formErrors.owner}
        >
          <Input
            id="owner"
            value={milestoneForm.owner}
            onChange={(e) => setMilestoneForm({ ...milestoneForm, owner: e.target.value })}
            placeholder="Enter owner name..."
          />
        </FormField>

        <FormField
          label="Start Date"
          name="startDate"
          error={formErrors.startDate}
        >
          <Input
            id="startDate"
            type="date"
            value={milestoneForm.startDate}
            onChange={(e) => setMilestoneForm({ ...milestoneForm, startDate: e.target.value })}
          />
        </FormField>

        <FormField
          label="End Date"
          name="endDate"
          error={formErrors.endDate}
        >
          <Input
            id="endDate"
            type="date"
            value={milestoneForm.endDate}
            onChange={(e) => setMilestoneForm({ ...milestoneForm, endDate: e.target.value })}
          />
        </FormField>
      </FormDrawer>
    </>
  );
}
