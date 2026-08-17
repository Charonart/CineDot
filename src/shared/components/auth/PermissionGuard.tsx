'use client';

import React from 'react';
import { useAuthStore } from '@/shared/store/useAuthStore';

interface PermissionGuardProps {
  /**
   * The list of permissions required to render the children.
   * If `requireAll` is true, the user must have ALL of these permissions.
   * If `requireAll` is false, the user must have AT LEAST ONE of these permissions.
   */
  permissions: string[];
  
  /**
   * If true, requires all permissions in the array. Default is false (any).
   */
  requireAll?: boolean;
  
  /**
   * Optional fallback component to render if the user lacks permissions.
   */
  fallback?: React.ReactNode;
  
  children: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permissions,
  requireAll = false,
  fallback = null,
  children,
}) => {
  const { hasPermission, hasAnyPermission, isLoading } = useAuthStore();

  // Don't render anything while auth is loading initially
  if (isLoading) {
    return null;
  }

  // Check permissions
  let hasAccess = false;
  
  if (permissions.length === 0) {
    hasAccess = true;
  } else if (requireAll) {
    hasAccess = permissions.every((p) => hasPermission(p));
  } else {
    hasAccess = hasAnyPermission(permissions);
  }

  return <>{hasAccess ? children : fallback}</>;
};
