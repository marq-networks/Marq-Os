import { useState, ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Search, Bell, User, Settings, Building2, LogOut, Moon, Sun, Command } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';
import type { RoleKey } from '../../state/roleStore';
import { CommandPalette, useCommandPalette } from '../CommandPalette';
import { NotificationCenter } from '../NotificationCenter';

interface AppShellProps {
  children: ReactNode;
  sidebarContent: ReactNode;
  currentUser?: {
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
  currentOrg?: {
    name: string;
    logo?: string;
  };
  organizations?: Array<{ id: string; name: string; logo?: string }>;
  notificationCount?: number;
  onOrgSwitch?: (orgId: string) => void;
  activeRole?: RoleKey;
  onRoleChange?: (role: RoleKey) => void;
  onLogout?: () => void;
}

export function AppShell({ 
  children, 
  sidebarContent, 
  currentUser,
  currentOrg,
  organizations = [],
  notificationCount = 0,
  onOrgSwitch,
  activeRole = 'employee',
  onRoleChange,
  onLogout
}: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const cmdPalette = useCommandPalette();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside 
        className={`flex flex-col border-r border-border bg-card transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Building2 className="h-5 w-5" />
              </div>
              <span className="font-semibold">WorkOS</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="h-8 w-8"
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Org Switcher */}
        {!sidebarCollapsed && currentOrg && organizations.length > 0 && (
          <div className="border-b border-border p-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex w-full items-center justify-start gap-2 rounded-lg border border-border bg-background px-3 py-2 hover:bg-accent hover:text-accent-foreground">
                  <Building2 className="h-4 w-4" />
                  <span className="truncate">{currentOrg.name}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Switch Organization</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {organizations.map(org => (
                  <DropdownMenuItem 
                    key={org.id}
                    onClick={() => onOrgSwitch?.(org.id)}
                  >
                    <Building2 className="mr-2 h-4 w-4" />
                    {org.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Sidebar Navigation */}
        <div className="flex-1 overflow-y-auto p-3">
          {sidebarContent}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
          {/* Search */}
          <div className="flex flex-1 items-center gap-4">
            <button
              onClick={cmdPalette.open}
              className="relative flex w-96 items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground hover:bg-accent/50 transition-colors"
            >
              <Search className="h-4 w-4" />
              <span>Search screens, actions...</span>
              <kbd className="ml-auto hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-xs">
                <Command className="h-3 w-3" />K
              </kbd>
            </button>
          </div>

          {/* Operating Mode Switcher */}
          {onRoleChange && (
            <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
              <button
                onClick={() => onRoleChange('employee')}
                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeRole === 'employee'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                Employee
              </button>
              <button
                onClick={() => onRoleChange('org_admin')}
                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeRole === 'org_admin'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                Org Admin
              </button>
              <button
                onClick={() => onRoleChange('platform_admin')}
                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeRole === 'platform_admin'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                Platform Admin
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Notifications — replaced with NotificationCenter */}
            <NotificationCenter onNavigate={(path) => {
              // Access navigate via a simple event — the AppContent handles it
              const event = new CustomEvent('workos-navigate', { detail: { path } });
              window.dispatchEvent(event);
            }} />

            {/* Profile Menu */}
            {currentUser && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="hidden flex-col items-start md:flex">
                      <span className="text-sm">{currentUser.name}</span>
                      <span className="text-xs text-muted-foreground">{currentUser.role}</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{currentUser.name}</span>
                      <span className="font-normal text-muted-foreground">{currentUser.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onClick={onLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-background">
          {children}
        </main>
      </div>

      {/* Command Palette */}
      <CommandPalette isOpen={cmdPalette.isOpen} onClose={cmdPalette.close} />
    </div>
  );
}