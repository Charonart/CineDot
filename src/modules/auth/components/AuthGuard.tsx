"use client";

import React, { useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types/auth.type';
import { appRoutes } from '@/shared/routes/appRoutes';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  requiredPermissions?: string[];
  fallback?: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requiredRoles,
  requiredPermissions,
  fallback,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isAuthLoading: isLoading, isFetching, hasRole, hasPermission } = useAuth();

  const currentPath = searchParams && searchParams.toString()
    ? `${pathname}?${searchParams.toString()}`
    : pathname || '';

  useEffect(() => {
    if (!isLoading && !isFetching && !user) {
      router.replace(appRoutes.login(currentPath));
    }
  }, [isLoading, isFetching, user, currentPath, router]);

  if (isLoading) {
    return (
      fallback || (
        <div className="auth-guard-loading">
          <Loader2 className="animate-spin" size={36} />
          <span>Đang xác thực thông tin...</span>
          <style dangerouslySetInnerHTML={{ __html: `
            .auth-guard-loading {
              min-height: 50vh;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              gap: 16px;
              color: #495057;
              font-size: 15px;
              font-weight: 500;
            }
            .animate-spin {
              animation: spin 1s linear infinite;
              color: #4F46E5;
            }
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}} />
        </div>
      )
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRoles && requiredRoles.length > 0 && !hasRole(requiredRoles)) {
    return (
      <div className="auth-guard-forbidden">
        <h2>Quyền truy cập bị từ chối</h2>
        <p>Tài khoản của bạn không có vai trò phù hợp để truy cập trang này.</p>
        <style dangerouslySetInnerHTML={{ __html: `
          .auth-guard-forbidden {
            padding: 80px 20px;
            text-align: center;
            color: #C53030;
          }
          .auth-guard-forbidden h2 {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 8px;
          }
          .auth-guard-forbidden p {
            color: #6C757D;
            font-size: 14.5px;
          }
        `}} />
      </div>
    );
  }

  if (requiredPermissions && requiredPermissions.length > 0 && !hasPermission(requiredPermissions)) {
    return (
      <div className="auth-guard-forbidden">
        <h2>Yêu cầu quyền truy cập</h2>
        <p>Tài khoản của bạn không có đủ quyền hạn để thực hiện thao tác này.</p>
        <style dangerouslySetInnerHTML={{ __html: `
          .auth-guard-forbidden {
            padding: 80px 20px;
            text-align: center;
            color: #C53030;
          }
          .auth-guard-forbidden h2 {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 8px;
          }
          .auth-guard-forbidden p {
            color: #6C757D;
            font-size: 14.5px;
          }
        `}} />
      </div>
    );
  }

  return <>{children}</>;
};
