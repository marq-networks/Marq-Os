/**
 * E09 - EMPLOYEE NOTIFICATIONS
 * Wired to service layer: useNotificationData()
 */

import { PageLayout } from '../../shared/PageLayout';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Check,
  Trash2,
  Filter,
  Info,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { useNotificationData } from '../../../services';
import type { Notification, NotificationType } from '../../../services';
import { useState } from 'react';
import { toast } from 'sonner';

type FilterType = 'all' | 'unread' | NotificationType;

export function E09Notifications() {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationData();

  const [filter, setFilter] = useState<FilterType>('all');

  const filtered = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.type === filter;
  });

  const getIcon = (type: NotificationType) => {
    const map: Record<NotificationType, React.ReactNode> = {
      success: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
      error: <AlertCircle className="h-5 w-5 text-red-500" />,
      info: <Info className="h-5 w-5 text-blue-500" />,
      action_required: <Zap className="h-5 w-5 text-purple-500" />,
    };
    return map[type] ?? <Bell className="h-5 w-5 text-muted-foreground" />;
  };

  const getBadgeType = (type: NotificationType) => {
    const map: Record<NotificationType, 'success' | 'warning' | 'error' | 'info' | 'neutral'> = {
      success: 'success',
      warning: 'warning',
      error: 'error',
      info: 'info',
      action_required: 'info',
    };
    return map[type] ?? 'neutral';
  };

  const handleMarkRead = async (id: string) => {
    await markAsRead(id);
  };

  const handleDelete = async (id: string) => {
    await deleteNotification(id);
    toast.success('Notification removed');
  };

  const handleMarkAll = async () => {
    await markAllAsRead();
    toast.success('All notifications marked as read');
  };

  const formatTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const filterButtons: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Unread', value: 'unread' },
    { label: 'Action Required', value: 'action_required' },
    { label: 'Info', value: 'info' },
    { label: 'Success', value: 'success' },
    { label: 'Warning', value: 'warning' },
  ];

  return (
    <PageLayout
      title="Notifications"
      description="Stay up to date with your latest updates and alerts"
      actions={
        unreadCount > 0 ? (
          <Button variant="outline" size="sm" onClick={handleMarkAll}>
            <Check className="mr-2 h-4 w-4" />
            Mark All Read
          </Button>
        ) : undefined
      }
      kpis={[
        {
          title: 'Total',
          value: String(notifications.length),
          icon: <Bell className="h-5 w-5" />,
        },
        {
          title: 'Unread',
          value: String(unreadCount),
          changeType: unreadCount > 0 ? 'negative' : 'positive',
          icon: <AlertCircle className="h-5 w-5" />,
        },
        {
          title: 'Action Required',
          value: String(notifications.filter(n => n.type === 'action_required').length),
          changeType:
            notifications.filter(n => n.type === 'action_required' && !n.read).length > 0
              ? 'negative'
              : 'neutral',
          icon: <Zap className="h-5 w-5" />,
        },
        {
          title: 'Read',
          value: String(notifications.filter(n => n.read).length),
          changeType: 'positive',
          icon: <CheckCircle2 className="h-5 w-5" />,
        },
      ]}
    >
      {/* Filter tabs */}
      <div className="flex items-center gap-1 mb-4 flex-wrap">
        {filterButtons.map(btn => (
          <button
            key={btn.value}
            onClick={() => setFilter(btn.value)}
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              filter === btn.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            {btn.label}
            {btn.value === 'unread' && unreadCount > 0 && (
              <span className="ml-1.5 bg-red-500 text-white text-xs rounded-full px-1.5">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      {loading ? (
        <div className="flex items-center justify-center h-40 text-muted-foreground">
          Loading notifications…
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
          <Bell className="h-10 w-10 mb-2" />
          <p>No notifications here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(notification => (
            <div
              key={notification.id}
              className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                !notification.read
                  ? 'border-primary/30 bg-primary/5'
                  : 'border-border bg-card'
              }`}
            >
              {/* Icon */}
              <div className="shrink-0 mt-0.5">{getIcon(notification.type)}</div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{notification.title}</span>
                      <StatusBadge type={getBadgeType(notification.type)}>
                        {notification.type.replace('_', ' ')}
                      </StatusBadge>
                      {!notification.read && (
                        <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTime(notification.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-blue-600"
                    onClick={() => handleMarkRead(notification.id)}
                    title="Mark as read"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-destructive"
                  onClick={() => handleDelete(notification.id)}
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
