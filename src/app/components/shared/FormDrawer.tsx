import React from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/button';

interface FormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
  submitDisabled?: boolean;
  submitLoading?: boolean;
  hideSubmit?: boolean;
  apiDoc?: React.ReactNode;
}

export function FormDrawer({
  isOpen,
  onClose,
  title,
  description,
  children,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  isSubmitting = false,
  submitDisabled = false,
  submitLoading = false,
  hideSubmit = false,
  apiDoc
}: FormDrawerProps) {
  if (!isOpen) return null;

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in"
        onClick={handleCancel}
      />
      
      {/* Drawer */}
      <div className="ml-auto relative bg-background border-l border-border w-full max-w-2xl h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-border">
          <div className="flex-1">
            <h2 className="font-semibold text-xl">{title}</h2>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <button
            onClick={handleCancel}
            className="text-muted-foreground hover:text-foreground transition-colors ml-4"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {children}

            {/* API Documentation */}
            {apiDoc && (
              <div className="pt-6 border-t border-border">
                <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                  Developer Notes
                </h4>
                {apiDoc}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-muted/20">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              {cancelLabel}
            </Button>
            {!hideSubmit && (
              <Button type="submit" disabled={isSubmitting || submitDisabled || submitLoading}>
                {isSubmitting ? 'Saving...' : submitLabel}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}