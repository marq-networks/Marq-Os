/**
 * NOTIFICATION CENTER
 * Phase 9 — Flyout panel replacing badge-only notification indicator.
 * Shows real notifications from the service layer with mark-as-read, delete, and filtering.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Bell, Check, CheckCheck, Trash2, X, Filter,
  Clock, AlertTriangle, Info, User, CreditCard, Calendar,
  ChevronRight, Inbox
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useNotificationData } from '../services';
import type { Notification } from '../services';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

type NotifFilter = 'all' | 'unread';

interface NotificationCenterProps {
  onNavigate?: (path: string) => void;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HELPERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function getNotifIcon(type?: string) {
  switch (type) {
    case 'warning': return AlertTriangle;
    case 'success': return Check;
    case 'error': return AlertTriangle;
    case 'action_required': return Clock;
    case 'info':
    default: return Info;
  }
}

function getNotifColor(type?: string) {
  switch (type) {
    case 'warning': return 'text-amber-500';
    case 'success': return 'text-emerald-500';
    case 'error': return 'text-red-500';
    case 'action_required': return 'text-blue-500';
    case 'info':
    default: return 'text-muted-foreground';
  }
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function NotificationCenter({ onNavigate }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<NotifFilter>('all');
  const panelRef = useRef<HTMLDivElement>(null);

  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationData();

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handler);
    }
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('keydown', handler);
    }
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen]);

  const filtered = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  const handleNotifClick = useCallback((notif: Notification) => {
    if (!notif.read) markAsRead(notif.id);
    // If the notification has an actionUrl, navigate
    if (notif.actionUrl && onNavigate) {
      onNavigate(notif.actionUrl);
    }
    setIsOpen(false);
  }, [markAsRead, onNavigate]);

  return (
    <div ref={panelRef} className="relative">
      {/* Trigger Button */}
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -right-1 -top-1 h-5 min-w-5 px-1 text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Flyout Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 rounded-xl border border-border bg-card shadow-2xl overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm">Notifications</span>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {unreadCount} new
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => markAllAsRead()}
                >
                  <CheckCheck className="mr-1 h-3 w-3" />
                  Read all
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1 border-b border-border px-4 py-2">
            {(['all', 'unread'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  filter === f
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/70'
                }`}
              >
                {f === 'all' ? `All (${notifications.length})` : `Unread (${unreadCount})`}
              </button>
            ))}
          </div>

          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Inbox className="h-10 w-10 mb-3 opacity-40" />
                <p className="text-sm">
                  {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                </p>
              </div>
            ) : (
              filtered.map((notif) => {
                const NIcon = getNotifIcon(notif.type);
                const iconColor = getNotifColor(notif.type);

                return (
                  <div
                    key={notif.id}
                    className={`flex items-start gap-3 px-4 py-3 border-b border-border/50 last:border-0 cursor-pointer transition-colors hover:bg-muted/30 ${
                      !notif.read ? 'bg-primary/5' : ''
                    }`}
                    onClick={() => handleNotifClick(notif)}
                  >
                    {/* Icon */}
                    <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg shrink-0 ${
                      !notif.read ? 'bg-primary/10' : 'bg-muted'
                    }`}>
                      <NIcon className={`h-4 w-4 ${iconColor}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm leading-snug ${!notif.read ? 'font-medium' : ''}`}>
                          {notif.title}
                        </p>
                        {!notif.read && (
                          <div className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                        )}
                      </div>
                      {notif.message && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {notif.message}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {timeAgo(notif.createdAt)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100">
                      {!notif.read && (
                        <button
                          className="p-1 rounded hover:bg-muted transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notif.id);
                          }}
                          title="Mark as read"
                        >
                          <Check className="h-3 w-3 text-muted-foreground" />
                        </button>
                      )}
                      <button
                        className="p-1 rounded hover:bg-destructive/10 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notif.id);
                        }}
                        title="Delete"
                      >
                        <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-border px-4 py-2">
              <button
                className="flex w-full items-center justify-center gap-1 rounded-lg py-1.5 text-xs text-primary hover:bg-primary/5 transition-colors"
                onClick={() => {
                  if (onNavigate) onNavigate('/employee/notifications');
                  setIsOpen(false);
                }}
              >
                View all notifications
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}