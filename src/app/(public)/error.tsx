'use client';

import { useEffect } from 'react';
import { ErrorState } from '@shared/ui/ErrorState';
import { logger } from '@lib/logger/logger';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error('Route-level error:', error);
  }, [error]);

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <ErrorState 
        title="Application Error"
        message="An unexpected error occurred in this section."
        onRetry={() => reset()} 
      />
    </div>
  );
}
