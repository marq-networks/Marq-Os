/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COMING SOON - Placeholder for Unimplemented Screens
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useRouter } from '../router';
import { useCurrentRole } from '../DevRoleSwitcher';
import { getDefaultRouteForRole } from '../../nav/getNavForRole';

interface ComingSoonProps {
  /** Page title */
  title: string;
  
  /** Short description of what this page will contain */
  description: string;
  
  /** Optional related module path to navigate to */
  relatedModulePath?: string;
  
  /** Optional related module label */
  relatedModuleLabel?: string;
}

export function ComingSoon({
  title,
  description,
  relatedModulePath,
  relatedModuleLabel = 'Related Module',
}: ComingSoonProps) {
  const { navigate } = useRouter();
  const [activeRole] = useCurrentRole();
  const isDev = import.meta.env.DEV;
  
  const handleBackToDashboard = () => {
    const defaultRoute = getDefaultRouteForRole(activeRole);
    navigate(defaultRoute);
  };
  
  const handleGoToRelated = () => {
    if (relatedModulePath) {
      navigate(relatedModulePath);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Dev Warning Banner */}
      {isDev && (
        <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-6 py-3">
          <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span className="font-medium text-sm">
              DEV MODE: This module is not implemented yet
            </span>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <svg
                className="h-10 w-10 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
          </div>
          
          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-foreground">
              {title}
            </h1>
            
            {/* Status Badge */}
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 text-sm font-medium">
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Status: Coming Soon
              </span>
            </div>
          </div>
          
          {/* Description */}
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            {description}
          </p>
          
          {/* Actions */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={handleBackToDashboard}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
            
            {relatedModulePath && (
              <button
                onClick={handleGoToRelated}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background hover:bg-accent transition-colors font-medium"
              >
                Go to {relatedModuleLabel}
                <ExternalLink className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {/* Additional Info */}
          <div className="pt-8 text-sm text-muted-foreground">
            <p>
              This feature is planned for a future release. Check back soon!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
