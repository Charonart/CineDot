'use client';

import { Suspense } from 'react';
import { AuthGuard } from '@/modules/auth/components/AuthGuard';
import { ProfileLayout } from './ProfileLayout';
import { ProfileSkeleton } from './ProfileSkeleton';

/**
 * ProfilePageClient
 * Client boundary wrapper that hosts AuthGuard (a Client Component)
 * while keeping the parent page.tsx as a Server Component for metadata.
 */
export function ProfilePageClient() {
  return (
    <AuthGuard fallback={<ProfileSkeleton />}>
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileLayout />
      </Suspense>
    </AuthGuard>
  );
}
