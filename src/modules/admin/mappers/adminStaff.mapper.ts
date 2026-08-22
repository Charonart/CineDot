import { AdminStaffItemDTO } from '../dto/adminStaff.dto';
import { AdminStaffItem, AdminRole, ROLE_NAME_MAP, ROLE_DEFINITIONS } from '../types/admin.types';

export const adminStaffMapper = {
  toDomain(dto: AdminStaffItemDTO): AdminStaffItem {
    const rawRole = (dto.role || dto.role_name || 'STAFF').toUpperCase();
    let role: AdminRole = 'STAFF';

    if (rawRole.includes('SUPER') || rawRole === 'ADMIN' || rawRole === 'SUPER_ADMIN') {
      role = 'SUPER_ADMIN';
    } else if (rawRole.includes('MANAGER') || rawRole === 'CINEMA_MANAGER') {
      role = 'CINEMA_MANAGER';
    } else if (rawRole.includes('FNB') || rawRole === 'FNB_STAFF') {
      role = 'FNB_STAFF';
    } else if (rawRole.includes('MARKETING')) {
      role = 'MARKETING';
    } else if (rawRole.includes('ACCOUNTANT')) {
      role = 'ACCOUNTANT';
    } else if (rawRole.includes('TICKET') || rawRole === 'TICKET_STAFF') {
      role = 'TICKET_STAFF';
    } else if (rawRole.includes('CUSTOMER')) {
      role = 'CUSTOMER';
    } else {
      role = 'STAFF';
    }

    const defaultPerms = ROLE_DEFINITIONS[role]?.defaultPermissions || [];
    const permissions =
      dto.permissions && dto.permissions.length > 0 ? dto.permissions : defaultPerms;

    const rawStatus = (dto.status || 'ACTIVE').toUpperCase();
    const status: 'ACTIVE' | 'DISABLED' = rawStatus === 'DISABLED' ? 'DISABLED' : 'ACTIVE';

    const userRoles = (dto.user_roles || []).map((ur) => ({
      id: ur.id,
      roleId: ur.role_id,
      roleName: ur.role_name || '',
      scopeType: ur.scope_type,
      scopeId: ur.scope_id ?? null,
      scopeName: ur.scope_name || (ur.scope_type === 'system' ? 'Toàn hệ thống' : ''),
    }));

    // Derive cinemaName from userRoles if available
    let cinemaName = dto.cinemaName || dto.cinema_name;
    let cinemaId = dto.cinemaId ?? dto.cinema_id ?? null;
    if (!cinemaName && userRoles.length > 0) {
      const cinemaScope = userRoles.find((ur) => ur.scopeType === 'cinema');
      if (cinemaScope) {
        cinemaName = cinemaScope.scopeName;
        cinemaId = cinemaScope.scopeId ?? cinemaId;
      } else if (userRoles.some((ur) => ur.scopeType === 'system')) {
        cinemaName = 'Toàn Bộ Cụm Rạp';
      }
    }

    return {
      id: String(dto.id),
      name: dto.name || 'Nhân Viên',
      email: dto.email,
      phone: dto.phone || 'Chưa cập nhật',
      role,
      roleName: dto.roleName || dto.role_name || ROLE_NAME_MAP[role] || 'Nhân Viên',
      roles: dto.roles || [role],
      userRoles,
      cinemaId,
      cinemaName: cinemaName || (role === 'SUPER_ADMIN' ? 'Toàn Bộ Cụm Rạp' : 'Chưa phân công'),
      status,
      createdAt: dto.created_at || new Date().toLocaleDateString('vi-VN'),
      permissions,
    };
  },
};
