/**
 * COMMAND PALETTE (Cmd+K / Ctrl+K)
 * Phase 9 — Global search across screens, actions, and quick navigation.
 * Keyboard-driven, filterable, with recent items tracking.
 */
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  Search, ArrowRight, Clock, Star, Hash, Zap, Users, Briefcase,
  Calendar, CreditCard, Shield, BarChart3, MessageSquare, Bell,
  Settings, FileText, ChevronRight, Command, CornerDownLeft
} from 'lucide-react';
import { useRouter } from './router';
import { NAV_MANIFEST, type NavItem, type Role } from '../nav/navManifest';
import { getActiveRole } from '../state/roleStore';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

type ResultCategory = 'navigation' | 'action' | 'recent';

interface SearchResult {
  id: string;
  label: string;
  description?: string;
  category: ResultCategory;
  icon: any;
  path?: string;
  action?: () => void;
  domain?: string;
  keywords?: string[];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DOMAIN ICON MAP
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const DOMAIN_ICONS: Record<string, any> = {
  work: Briefcase,
  people: Users,
  time: Clock,
  finance: CreditCard,
  communication: MessageSquare,
  analytics: BarChart3,
  security_compliance: Shield,
  platform: Settings,
  integrations: FileText,
  admin: BarChart3,
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RECENT ITEMS PERSISTENCE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const RECENT_KEY = 'workos_cmd_recent';
const MAX_RECENT = 8;

function getRecentItems(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
  } catch { return []; }
}

function addRecentItem(path: string) {
  const items = getRecentItems().filter(p => p !== path);
  items.unshift(path);
  localStorage.setItem(RECENT_KEY, JSON.stringify(items.slice(0, MAX_RECENT)));
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BUILD SEARCHABLE INDEX FROM NAV MANIFEST
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function flattenNav(items: NavItem[], role: Role, parentDomain?: string): SearchResult[] {
  const results: SearchResult[] = [];

  for (const item of items) {
    if (!item.roles.includes(role)) continue;

    const domain = parentDomain || item.key;
    const DomainIcon = DOMAIN_ICONS[domain] || item.icon || Hash;

    if (item.path) {
      results.push({
        id: `nav-${item.path}`,
        label: item.label,
        description: item.path,
        category: 'navigation',
        icon: item.icon || DomainIcon,
        path: item.path,
        domain,
        keywords: [item.label.toLowerCase(), item.key, item.path],
      });
    }

    if (item.children) {
      results.push(...flattenNav(item.children, role, domain));
    }
  }

  return results;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// QUICK ACTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function buildQuickActions(navigate: (p: string) => void, role: Role): SearchResult[] {
  const actions: SearchResult[] = [
    {
      id: 'action-new-task',
      label: 'Create New Task',
      description: 'Add a task to your work queue',
      category: 'action',
      icon: Zap,
      path: '/work/tasks',
      keywords: ['create', 'new', 'task', 'add'],
    },
    {
      id: 'action-clock-in',
      label: 'Clock In / Out',
      description: 'Start or end your work session',
      category: 'action',
      icon: Clock,
      path: role === 'employee' ? '/employee/my-day' : '/time/tracking',
      keywords: ['clock', 'in', 'out', 'time', 'start', 'end'],
    },
    {
      id: 'action-view-notifications',
      label: 'View Notifications',
      description: 'Check your unread notifications',
      category: 'action',
      icon: Bell,
      path: role === 'employee' ? '/employee/notifications' : '/admin/notifications',
      keywords: ['notifications', 'alerts', 'unread'],
    },
  ];

  if (role === 'org_admin' || role === 'platform_admin') {
    actions.push(
      {
        id: 'action-add-employee',
        label: 'Add Employee',
        description: 'Create a new employee record',
        category: 'action',
        icon: Users,
        path: '/people/employees',
        keywords: ['add', 'employee', 'new', 'hire', 'user'],
      },
      {
        id: 'action-approve-leave',
        label: 'Approve Leave Requests',
        description: 'Review pending leave approvals',
        category: 'action',
        icon: Calendar,
        path: '/time/leave-approvals',
        keywords: ['approve', 'leave', 'request', 'vacation', 'pto'],
      },
      {
        id: 'action-view-analytics',
        label: 'View Live Activity',
        description: 'See real-time employee activity',
        category: 'action',
        icon: BarChart3,
        path: '/analytics/live-activity',
        keywords: ['live', 'activity', 'real-time', 'analytics'],
      },
      {
        id: 'action-finance-cockpit',
        label: 'Finance Cockpit',
        description: 'Go to Finance command center',
        category: 'action',
        icon: CreditCard,
        path: '/org/finance/cockpit',
        keywords: ['finance', 'cockpit', 'money', 'billing'],
      },
    );
  }

  return actions;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FUZZY SEARCH
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function fuzzyMatch(query: string, target: string): boolean {
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  if (t.includes(q)) return true;
  // simple character-by-character fuzzy
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
  }
  return qi === q.length;
}

function scoreResult(query: string, result: SearchResult): number {
  const q = query.toLowerCase();
  const label = result.label.toLowerCase();

  // Exact match at start
  if (label.startsWith(q)) return 100;
  // Word boundary match
  if (label.includes(q)) return 80;
  // Path match
  if (result.path?.includes(q)) return 60;
  // Keyword match
  if (result.keywords?.some(k => k.includes(q))) return 50;
  // Fuzzy match
  if (fuzzyMatch(q, label)) return 30;
  return 0;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const { navigate } = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const role = getActiveRole();

  // Build search index
  const allResults = useMemo(() => {
    const navResults = flattenNav(NAV_MANIFEST, role);
    const actions = buildQuickActions(navigate, role);
    return [...actions, ...navResults];
  }, [role, navigate]);

  // Build recent items
  const recentResults = useMemo(() => {
    const recentPaths = getRecentItems();
    return recentPaths
      .map(path => allResults.find(r => r.path === path))
      .filter(Boolean)
      .map(r => ({ ...r!, id: `recent-${r!.path}`, category: 'recent' as ResultCategory }));
  }, [allResults]);

  // Filter results
  const filteredResults = useMemo(() => {
    if (!query.trim()) {
      // Show recent + top actions when no query
      const sections: SearchResult[] = [];
      if (recentResults.length > 0) {
        sections.push(...recentResults.slice(0, 5));
      }
      const actions = allResults.filter(r => r.category === 'action').slice(0, 5);
      sections.push(...actions);
      return sections;
    }

    return allResults
      .map(r => ({ result: r, score: scoreResult(query, r) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 15)
      .map(({ result }) => result);
  }, [query, allResults, recentResults]);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keep selected index in bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredResults.length]);

  // Scroll selected into view
  useEffect(() => {
    const el = listRef.current?.children[selectedIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  const handleSelect = useCallback((result: SearchResult) => {
    if (result.path) {
      addRecentItem(result.path);
      navigate(result.path);
    }
    if (result.action) {
      result.action();
    }
    onClose();
  }, [navigate, onClose]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, filteredResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        handleSelect(filteredResults[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  }, [filteredResults, selectedIndex, handleSelect, onClose]);

  if (!isOpen) return null;

  const getCategoryLabel = (cat: ResultCategory) => {
    switch (cat) {
      case 'recent': return 'Recent';
      case 'action': return 'Quick Actions';
      case 'navigation': return 'Navigation';
    }
  };

  const getCategoryIcon = (cat: ResultCategory) => {
    switch (cat) {
      case 'recent': return Clock;
      case 'action': return Zap;
      case 'navigation': return ArrowRight;
    }
  };

  // Group by category for display
  let lastCategory: ResultCategory | null = null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Palette */}
      <div className="fixed left-1/2 top-[20%] z-50 w-full max-w-xl -translate-x-1/2 rounded-xl border border-border bg-card shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search screens, actions, or type a command..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-border bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-80 overflow-y-auto py-2">
          {filteredResults.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No results found for "{query}"
            </div>
          )}

          {filteredResults.map((result, index) => {
            const showHeader = result.category !== lastCategory;
            lastCategory = result.category;
            const Icon = result.icon;
            const CatIcon = getCategoryIcon(result.category);

            return (
              <div key={result.id}>
                {showHeader && (
                  <div className="flex items-center gap-2 px-4 pt-3 pb-1">
                    <CatIcon className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {getCategoryLabel(result.category)}
                    </span>
                  </div>
                )}
                <button
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                    index === selectedIndex
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => handleSelect(result)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg shrink-0 ${
                    index === selectedIndex
                      ? 'bg-primary/20'
                      : 'bg-muted'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{result.label}</p>
                    {result.description && (
                      <p className="text-xs text-muted-foreground truncate">{result.description}</p>
                    )}
                  </div>
                  {index === selectedIndex && (
                    <div className="flex items-center gap-1 shrink-0">
                      <CornerDownLeft className="h-3 w-3 text-muted-foreground" />
                    </div>
                  )}
                  {result.category === 'navigation' && index !== selectedIndex && (
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border bg-muted px-1 py-0.5">
                <span className="text-[10px]">&#8593;&#8595;</span>
              </kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border bg-muted px-1 py-0.5">
                <span className="text-[10px]">&#9166;</span>
              </kbd>
              Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border bg-muted px-1 py-0.5">esc</kbd>
              Close
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Command className="h-3 w-3" /> K to toggle
          </span>
        </div>
      </div>
    </>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GLOBAL KEYBOARD HOOK
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(prev => !prev),
  };
}
