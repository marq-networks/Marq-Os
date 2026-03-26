import { ReactNode } from 'react';

interface Card3DProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * Card3D - A spatial 3D card component for the 2050 Finance Cockpit design
 * Features subtle 3D transforms, depth, and spatial positioning
 */
export function Card3D({ children, className = '', onClick }: Card3DProps) {
  return (
    <div
      className={`
        relative bg-card border border-border rounded-lg p-4
        transition-all duration-200
        hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      {children}
    </div>
  );
}
