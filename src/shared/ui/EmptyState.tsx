import { LucideIcon, Ghost } from 'lucide-react';
import { cn } from '@shared/lib/utils';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  className?: string;
}

export function EmptyState({
  title = 'No data found',
  description = 'Try adjusting your filters or search terms.',
  icon: Icon = Ghost,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
      <div className="mb-4 rounded-full bg-zinc-100 p-4 dark:bg-zinc-900">
        <Icon className="h-8 w-8 text-zinc-500" />
      </div>
      <h3 className="mb-1 text-lg font-semibold text-zinc-900 dark:text-zinc-50">{title}</h3>
      <p className="max-w-xs text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
    </div>
  );
}
