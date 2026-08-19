'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAdminAuthStore } from '../../store/useAdminAuthStore';
import { PermissionSlug } from '../../types/rbac.types';
import { ShieldAlert, ArrowLeft, Home, QrCode } from 'lucide-react';

interface RoutePermissionConfig {
  pathPrefix: string;
  requiredPermission: PermissionSlug | string;
  allowedRoles?: string[];
  exact?: boolean;
}

const ROUTE_PERMISSIONS: RoutePermissionConfig[] = [
  { pathPrefix: '/admin/users-staff', requiredPermission: 'staff.manage', allowedRoles: ['SUPER_ADMIN'] },
  { pathPrefix: '/admin/vouchers', requiredPermission: 'vouchers.manage', allowedRoles: ['SUPER_ADMIN'] },
  { pathPrefix: '/admin/settings', requiredPermission: 'settings.manage', allowedRoles: ['SUPER_ADMIN'] },
  { pathPrefix: '/admin/movies/genres', requiredPermission: 'movies.genres.manage', allowedRoles: ['SUPER_ADMIN'] },
  { pathPrefix: '/admin/movies/reviews', requiredPermission: 'reviews.view' },
  { pathPrefix: '/admin/movies', requiredPermission: 'movies.view' },
  { pathPrefix: '/admin/cinemas', requiredPermission: 'cinemas.view' },
  { pathPrefix: '/admin/showtimes', requiredPermission: 'showtimes.view' },
  { pathPrefix: '/admin/tickets', requiredPermission: 'bookings.view' },
  { pathPrefix: '/admin/concessions', requiredPermission: 'concessions.view' },
  { pathPrefix: '/admin/ticket-scanner', requiredPermission: 'tickets.scan' },
];

export const AdminRouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { adminUser, hasPermission, isInitialized, isAuthenticated } = useAdminAuthStore();

  // If on login route or not initialized yet, let layout handle it
  if (pathname === '/admin/login' || !isInitialized || !isAuthenticated || !adminUser) {
    return <>{children}</>;
  }

  // Find matching route rule
  const matchedRule = ROUTE_PERMISSIONS.find((rule) => {
    if (rule.exact) {
      return pathname === rule.pathPrefix;
    }
    return pathname.startsWith(rule.pathPrefix);
  });

  // If rule exists, check permission
  if (matchedRule) {
    const hasRoleAccess = matchedRule.allowedRoles
      ? matchedRule.allowedRoles.includes(adminUser.role)
      : true;
    const hasPermAccess = hasPermission(matchedRule.requiredPermission);

    if (!hasRoleAccess || !hasPermAccess) {
      return (
        <div className="w-full min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 rounded-3xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mb-6 shadow-lg shadow-rose-500/10">
            <ShieldAlert className="w-10 h-10" />
          </div>

          <span className="text-[11px] font-extrabold uppercase tracking-widest text-rose-600 bg-rose-50 px-3.5 py-1 rounded-full border border-rose-100 mb-2">
            403 • FORBIDDEN ACCESS
          </span>

          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
            Truy Cập Bị Từ Chối
          </h2>

          <p className="text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
            Tài khoản của bạn với vai trò{' '}
            <strong className="text-slate-800 font-bold">{adminUser.roleName}</strong> không có
            quyền thực hiện thao tác hoặc truy cập vào màn hình này.
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="px-5 py-2.5 rounded-2xl bg-white border border-gray-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay Lại</span>
            </button>

            {adminUser.role === 'TICKET_STAFF' ? (
              <button
                onClick={() => router.push('/admin/ticket-scanner')}
                className="px-5 py-2.5 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-[#7C6FE8]/25 transition-all cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>Đến Cổng Soát Vé</span>
              </button>
            ) : (
              <button
                onClick={() => router.push('/admin')}
                className="px-5 py-2.5 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-[#7C6FE8]/25 transition-all cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Về Dashboard</span>
              </button>
            )}
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};
