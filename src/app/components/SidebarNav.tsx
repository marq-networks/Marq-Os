import { NavLink } from './router';
import { NavItem } from '../data/navigation';
import { Badge } from './ui/badge';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SidebarNavProps {
  items: NavItem[];
  currentPath: string;
  onNavigate: (path: string) => void;
  collapsed?: boolean;
}

export function SidebarNav({ items, currentPath, onNavigate, collapsed = false }: SidebarNavProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(() => {
    // Initialize with Finance expanded by default
    return new Set(['a-f01']);
  });

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentPath === item.path;
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedItems.has(item.id);
        const isChildActive = hasChildren && item.children?.some(child => currentPath === child.path);
        
        return (
          <div key={item.id}>
            <button
              onClick={() => {
                if (hasChildren) {
                  toggleExpanded(item.id);
                } else {
                  onNavigate(item.path);
                }
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                isActive || isChildActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left text-sm">{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <Badge variant="destructive" className="h-5 min-w-5 px-1.5 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                  {hasChildren && (
                    isExpanded ? 
                      <ChevronDown className="h-4 w-4 flex-shrink-0" /> : 
                      <ChevronRight className="h-4 w-4 flex-shrink-0" />
                  )}
                </>
              )}
            </button>
            
            {/* Render children if expanded */}
            {hasChildren && isExpanded && !collapsed && (
              <div className="ml-8 mt-1 space-y-1">
                {item.children?.map((child) => {
                  const ChildIcon = child.icon;
                  const isChildItemActive = currentPath === child.path;
                  
                  return (
                    <button
                      key={child.id}
                      onClick={() => onNavigate(child.path)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-1.5 text-sm transition-colors ${
                        isChildItemActive
                          ? 'bg-accent text-accent-foreground font-medium'
                          : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                      }`}
                    >
                      <ChildIcon className="h-4 w-4 flex-shrink-0" />
                      <span className="flex-1 text-left">{child.label}</span>
                      {child.badge && child.badge > 0 && (
                        <Badge variant="destructive" className="h-4 min-w-4 px-1 text-xs">
                          {child.badge}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}