'use client';

import { logger } from '@lib/logger/logger';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
          <h1 className="mb-4 text-4xl font-bold">Critical System Error</h1>
          <p className="mb-8 text-zinc-500">A fatal error occurred. Please try restarting the application.</p>
          <button
            onClick={() => {
              logger.error('Critical Error:', error);
              reset();
            }}
            className="rounded-lg bg-zinc-900 px-6 py-2 text-white"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
