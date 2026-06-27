import { WifiOff } from 'lucide-react';
import { cn } from '@shared/lib/utils';

export function OfflineState({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
      <div className="mb-4 rounded-full bg-zinc-100 p-4 dark:bg-zinc-900">
        <WifiOff className="h-8 w-8 text-zinc-500" />
      </div>
      <h3 className="mb-1 text-lg font-semibold text-zinc-900 dark:text-zinc-50">No internet connection</h3>
      <p className="max-w-xs text-sm text-zinc-500 dark:text-zinc-400">
        Please check your network settings and try again.
      </p>
    </div>
  );
}
