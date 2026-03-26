/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DYNAMIC SIDEBAR - Role-Based Navigation
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Renders navigation dynamically based on active role from navManifest.ts
 * Single source of truth for all sidebar navigation.
 */

import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { useRouter } from './router';
import { useCurrentRole } from './DevRoleSwitcher';
import { getNavForRole } from '../nav/getNavForRole';
import type { NavItem } from '../nav/navManifest';

export function DynamicSidebar() {
  const { currentPath, navigate } = useRouter();
  const [activeRole] = useCurrentRole();
  const [expandedDomains, setExpandedDomains] = useState<string[]>([]);
  
  // Get sidebar items for current role from navManifest
  const sidebarItems = getNavForRole(activeRole);
  
  // Auto-expand domain containing current path (only when path changes)
  useEffect(() => {
    const currentDomain = sidebarItems.find(domain => 
      domain.children?.some(child => child.path === currentPath)
    );
    if (currentDomain && !expandedDomains.includes(currentDomain.key)) {
      setExpandedDomains(prev => [...prev, currentDomain.key]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPath]); // Only re-run when currentPath changes
  
  const toggleDomain = (domainKey: string) => {
    setExpandedDomains(prev => 
      prev.includes(domainKey) 
        ? prev.filter(key => key !== domainKey)
        : [...prev, domainKey]
    );
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">Navigation</h2>
      </div>
      
      {/* Sidebar Items */}
      <nav className="flex-1 overflow-y-auto py-2">
        <div className="space-y-1 px-2">
          {sidebarItems.map((item) => {
            const isFlat = !item.children || item.children.length === 0;
            const isDomainExpanded = expandedDomains.includes(item.key);
            const hasChildren = item.children && item.children.length > 0;
            
            // Render flat item (for employees)
            if (isFlat && item.path) {
              const isActive = currentPath === item.path;
              const Icon = item.icon;
              
              return (
                <button
                  key={item.key}
                  onClick={() => navigate(item.path!)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${ 
                    isActive
                      ? 'bg-accent text-accent-foreground font-medium'
                      : 'hover:bg-accent/50 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
                  <span className="text-sm flex-1">{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            }
            
            // Render domain with children (for admins)
            return (
              <div key={item.key} className="space-y-0.5">
                {/* Domain Header */}
                <button
                  onClick={() => hasChildren && toggleDomain(item.key)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-left transition-colors ${
                    hasChildren 
                      ? 'hover:bg-accent cursor-pointer' 
                      : 'cursor-default'
                  }`}
                >
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide flex-1">
                    {item.label}
                  </span>
                  {hasChildren && (
                    isDomainExpanded ? (
                      <ChevronDown className="h-3 w-3 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                    )
                  )}
                </button>
                
                {/* Domain Children */}
                {isDomainExpanded && hasChildren && (
                  <div className="ml-2 space-y-0.5">
                    {item.children!.map((child) => {
                      const isActive = currentPath === child.path;
                      const ChildIcon = child.icon;
                      
                      return (
                        <button
                          key={child.key}
                          onClick={() => child.path && navigate(child.path)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors group ${
                            isActive
                              ? 'bg-accent text-accent-foreground'
                              : 'hover:bg-accent/50 text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {ChildIcon && <ChildIcon className="h-4 w-4 flex-shrink-0" />}
                          <span className="text-sm flex-1">{child.label}</span>
                          {child.badge && child.badge > 0 && (
                            <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
                              {child.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>
    </div>
  );
}