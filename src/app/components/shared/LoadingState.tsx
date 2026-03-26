import React from 'react';

export function LoadingState() {
  return (
    <div className="animate-pulse space-y-4">
      {/* KPI Skeletons */}
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-muted rounded-lg h-24" />
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <div className="h-8 bg-muted rounded w-1/4" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="h-10 bg-muted/50 rounded" />
      {/* Rows */}
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="h-16 bg-muted/30 rounded" />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg p-6 animate-pulse">
      <div className="space-y-4">
        <div className="h-6 bg-muted rounded w-1/3" />
        <div className="h-4 bg-muted rounded w-2/3" />
        <div className="h-4 bg-muted rounded w-1/2" />
      </div>
    </div>
  );
}
