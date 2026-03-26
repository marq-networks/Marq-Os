import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '../ui/button';

interface EmptyStateProps {
  icon: LucideIcon | React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  action?: React.ReactNode;
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  actionLabel, 
  onAction,
  action
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        {typeof icon === 'function' ? (
          React.createElement(icon, { className: 'h-8 w-8 text-muted-foreground' })
        ) : (
          icon
        )}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md mb-6">{description}</p>
      {action ? action : (actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      ))}
    </div>
  );
}