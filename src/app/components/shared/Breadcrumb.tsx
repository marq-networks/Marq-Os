import { ChevronRight } from 'lucide-react';
import { useRouter } from '../router';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const { navigate } = useRouter();

  return (
    <nav className="flex items-center gap-2 text-sm mb-4">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <div key={index} className="flex items-center gap-2">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            {item.path && !isLast ? (
              <button
                onClick={() => navigate(item.path!)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </button>
            ) : (
              <span className={isLast ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
