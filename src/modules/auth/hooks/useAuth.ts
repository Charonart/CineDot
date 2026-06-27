import { useCurrentUser } from './useCurrentUser';
import { UserRole } from '../types/auth.type';

export const useAuth = () => {
  const { data: session, isLoading, isError, isFetching } = useCurrentUser();

  const user = session?.user || null;
  const isAuthenticated = !!user;
  const isUnauthenticated = !isLoading && !isAuthenticated;
  const isAuthLoading = isLoading;

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const rolesToCheck = Array.isArray(role) ? role : [role];
    return rolesToCheck.some((r) => user.roles.includes(r));
  };

  const hasPermission = (permission: string | string[]): boolean => {
    if (!user) return false;
    const permissionsToCheck = Array.isArray(permission) ? permission : [permission];
    return permissionsToCheck.some((p) => user.permissions.includes(p));
  };

  return {
    user,
    isAuthenticated,
    isUnauthenticated,
    isAuthLoading,
    hasRole,
    hasPermission,
    isError,
    isFetching,
  };
};
