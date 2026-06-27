import Link from 'next/link';
import { EmptyState } from '@shared/ui/EmptyState';
import { Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4">
      <EmptyState 
        title="404 - Page Not Found"
        description="The page you are looking for does not exist or has been moved."
        icon={Search}
      />
      <Link 
        href="/" 
        className="mt-6 rounded-lg bg-zinc-900 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Go back home
      </Link>
    </div>
  );
}
