import { AdminUserDTO } from '../dto/adminAuth.dto';
import { AdminUser, AdminRole, ROLE_NAME_MAP, ROLE_DEFINITIONS } from '../types/admin.types';

export const adminAuthMapper = {
  toDomain(dto: AdminUserDTO, customPermissions?: string[]): AdminUser {
    const rawRole = (dto.role || dto.role_name || 'TICKET_STAFF').toUpperCase();
    let role: AdminRole = 'TICKET_STAFF';

    if (rawRole.includes('SUPER') || rawRole === 'ADMIN' || rawRole === 'SUPER_ADMIN') {
      role = 'SUPER_ADMIN';
    } else if (rawRole.includes('MANAGER') || rawRole === 'CINEMA_MANAGER') {
      role = 'CINEMA_MANAGER';
    } else {
      role = 'TICKET_STAFF';
    }

    const defaultPerms = ROLE_DEFINITIONS[role]?.defaultPermissions || [];
    const permissions =
      customPermissions && customPermissions.length > 0
        ? customPermissions
        : dto.permissions && dto.permissions.length > 0
          ? dto.permissions
          : defaultPerms;

    const rawStatus = (dto.status || 'ACTIVE').toUpperCase();
    const status: 'ACTIVE' | 'DISABLED' = rawStatus === 'DISABLED' ? 'DISABLED' : 'ACTIVE';

    return {
      id: String(dto.id ?? dto.user_id ?? ''),
      email: dto.email,
      name: dto.name || dto.fullname || 'Nhân Viên CineDot',
      phone: dto.phone || 'Chưa cập nhật',
      avatarUrl: dto.avatar || dto.avatar_url,
      role,
      roleName: dto.roleName || dto.role_name || ROLE_NAME_MAP[role] || 'Nhân Viên',
      cinemaId: dto.cinemaId ?? dto.cinema_id ?? null,
      cinemaName: dto.cinemaName || dto.cinema_name || (role === 'SUPER_ADMIN' ? 'Toàn Bộ Cụm Rạp' : 'Chưa phân công'),
      permissions,
      createdAt: dto.createdAt || dto.created_at || new Date().toISOString(),
      status,
    };
  },
};
