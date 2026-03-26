/**
 * AC02 - CHANNEL MANAGEMENT
 * Wired to service layer: useCommunicationData() → channels, createChannel, archiveChannel
 */

import { useState } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { DataTable } from '../../shared/DataTable';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { FormDrawer } from '../../shared/FormDrawer';
import { FormField, Input, Select, TextArea, APIDoc } from '../../ui/form';
import {
  MessageSquare,
  Plus,
  Users,
  Hash,
  Lock,
  Globe,
  Edit,
  Archive,
  CheckCircle,
} from 'lucide-react';
import { useCommunicationData } from '../../../services';
import type { Channel, ChannelType } from '../../../services';
import { toast } from 'sonner';

type ChannelForm = {
  name: string;
  type: ChannelType;
  description: string;
};

export function AC02ChannelManagement() {
  const { channels, createChannel, archiveChannel, loading } = useCommunicationData();
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState<ChannelForm>({
    name: '',
    type: 'public',
    description: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<ChannelForm>>({});

  const validate = (): boolean => {
    const errors: Partial<ChannelForm> = {};
    if (!form.name.trim()) errors.name = 'Channel name is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenAdd = () => {
    setForm({ name: '', type: 'public', description: '' });
    setFormErrors({});
    setIsAddOpen(true);
  };

  const handleOpenEdit = (ch: Channel) => {
    setSelectedChannel(ch);
    setForm({ name: ch.name, type: ch.type, description: ch.description ?? '' });
    setFormErrors({});
    setIsEditOpen(true);
  };

  const handleSubmitAdd = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await createChannel({
        name: form.name.toLowerCase().replace(/\s+/g, '-'),
        type: form.type,
        description: form.description,
        createdBy: 'u2',
        memberCount: 1,
        members: ['u2'],
        unreadCount: 0,
        pinned: false,
        archived: false,
      });
      setIsAddOpen(false);
      toast.success(`Channel #${form.name} created`);
    } catch {
      toast.error('Failed to create channel');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit just shows a toast since updateChannel would need to be added to the hook
  const handleSubmitEdit = async () => {
    if (!validate() || !selectedChannel) return;
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 600));
    setIsSubmitting(false);
    setIsEditOpen(false);
    toast.success('Channel updated (wire updateChannel() to hook for live edit)');
  };

  const handleArchive = async (id: string, name: string) => {
    try {
      await archiveChannel(id);
      toast.success(`#${name} archived`);
    } catch {
      toast.error('Failed to archive channel');
    }
  };

  const activeChannels = channels.filter(c => !c.archived);
  const publicCount = channels.filter(c => c.type === 'public').length;
  const privateCount = channels.filter(c => c.type === 'private').length;
  const directCount = channels.filter(c => c.type === 'direct').length;

  const getTypeIcon = (type: ChannelType) => {
    if (type === 'private') return <Lock className="h-4 w-4 text-muted-foreground" />;
    if (type === 'direct') return <Users className="h-4 w-4 text-muted-foreground" />;
    return <Hash className="h-4 w-4 text-muted-foreground" />;
  };

  const getTypeBadge = (type: ChannelType) => {
    const map: Record<ChannelType, 'info' | 'success' | 'warning'> = {
      public: 'success',
      private: 'warning',
      direct: 'info',
    };
    return <StatusBadge type={map[type]}>{type}</StatusBadge>;
  };

  const columns = [
    {
      key: 'name',
      header: 'Channel',
      width: '28%',
      cell: (value: string, ch: Channel) => (
        <div className="flex items-center gap-2">
          {getTypeIcon(ch.type)}
          <div>
            <p className="font-medium">#{value}</p>
            {ch.description && (
              <p className="text-xs text-muted-foreground">{ch.description}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      width: '14%',
      cell: (value: ChannelType) => getTypeBadge(value),
    },
    {
      key: 'memberCount',
      header: 'Members',
      width: '12%',
      cell: (value: number) => (
        <div className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{value}</span>
        </div>
      ),
    },
    {
      key: 'lastMessage',
      header: 'Last Message',
      width: '22%',
      cell: (value: string | undefined) =>
        value ? (
          <span className="text-sm text-muted-foreground line-clamp-1">{value}</span>
        ) : (
          <span className="text-xs text-muted-foreground italic">No messages yet</span>
        ),
    },
    {
      key: 'archived',
      header: 'Status',
      width: '12%',
      cell: (value: boolean) => (
        <StatusBadge type={value ? 'neutral' : 'success'}>
          {value ? 'Archived' : 'Active'}
        </StatusBadge>
      ),
    },
    {
      key: 'id',
      header: '',
      width: '12%',
      cell: (_: any, ch: Channel) => (
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2"
            onClick={() => handleOpenEdit(ch)}
          >
            <Edit className="h-3.5 w-3.5" />
          </Button>
          {!ch.archived && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-yellow-600"
              onClick={() => handleArchive(ch.id, ch.name)}
            >
              <Archive className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const drawerFields = (
    <>
      <FormField label="Channel Name" name="name" error={formErrors.name}>
        <Input
          id="name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          placeholder="e.g., team-engineering"
        />
      </FormField>
      <FormField label="Channel Type" name="type">
        <Select
          id="type"
          value={form.type}
          onChange={e => setForm({ ...form, type: e.target.value as ChannelType })}
          options={[
            { value: 'public', label: 'Public — anyone can join' },
            { value: 'private', label: 'Private — invite only' },
            { value: 'direct', label: 'Direct — 1:1 or small group' },
          ]}
        />
      </FormField>
      <FormField label="Description" name="description">
        <TextArea
          id="description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          placeholder="What is this channel for?"
          rows={2}
        />
      </FormField>
    </>
  );

  return (
    <>
      <PageLayout
        title="Channel Management"
        description="Create, configure, and manage organization communication channels"
        actions={
          <Button onClick={handleOpenAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Create Channel
          </Button>
        }
        kpis={[
          {
            title: 'Total Channels',
            value: String(channels.length),
            change: `${activeChannels.length} active`,
            changeType: 'positive',
            icon: <MessageSquare className="h-5 w-5" />,
          },
          {
            title: 'Public',
            value: String(publicCount),
            icon: <Globe className="h-5 w-5" />,
          },
          {
            title: 'Private',
            value: String(privateCount),
            icon: <Lock className="h-5 w-5" />,
          },
          {
            title: 'Direct',
            value: String(directCount),
            icon: <Users className="h-5 w-5" />,
          },
        ]}
      >
        {loading ? (
          <div className="flex items-center justify-center h-40 text-muted-foreground">
            Loading channels…
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card">
            <DataTable columns={columns} data={channels} />
          </div>
        )}
      </PageLayout>

      {/* Create Channel Drawer */}
      <FormDrawer
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Create Channel"
        description="Add a new communication channel to the organization"
        onSubmit={handleSubmitAdd}
        submitLabel="Create Channel"
        submitDisabled={isSubmitting}
        submitLoading={isSubmitting}
        apiDoc={
          <APIDoc
            method="POST"
            endpoint="/api/communication/channels"
            request={{ name: 'string', type: "'public' | 'private' | 'direct'", description: 'string' }}
          />
        }
      >
        {drawerFields}
      </FormDrawer>

      {/* Edit Channel Drawer */}
      <FormDrawer
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Channel"
        description={`Editing #${selectedChannel?.name}`}
        onSubmit={handleSubmitEdit}
        submitLabel="Save Changes"
        submitDisabled={isSubmitting}
        submitLoading={isSubmitting}
        apiDoc={
          <APIDoc
            method="PATCH"
            endpoint={`/api/communication/channels/${selectedChannel?.id}`}
            request={{ name: 'string', type: "'public' | 'private' | 'direct'", description: 'string' }}
          />
        }
      >
        {drawerFields}
      </FormDrawer>
    </>
  );
}
