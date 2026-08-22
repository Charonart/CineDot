import { AdminUserDTO } from '../dto/adminAuth.dto';
import { AdminUser, AdminRole, ROLE_NAME_MAP, ROLE_DEFINITIONS } from '../types/admin.types';

export const adminAuthMapper = {
  /**
   * Chuyển đổi dữ liệu User DTO sang AdminUser domain entity.
   * Trả về null nếu tài khoản không có vai trò Quản trị / Nhân sự (ví dụ: customer).
   */
  toDomain(dto?: AdminUserDTO | null, customPermissions?: string[]): AdminUser | null {
    if (!dto) return null;

    const rawRole = (
      dto.role ||
      dto.role_name ||
      (typeof (dto as any).role === 'object' ? (dto as any).role?.name : '') ||
      ''
    ).toString().toUpperCase().trim();

    // Phân loại vai trò Quản trị / Nhân sự hợp lệ
    let role: AdminRole | null = null;

    if (
      rawRole === 'SUPER_ADMIN' ||
      rawRole === 'SUPERADMIN' ||
      rawRole === 'ADMIN' ||
      rawRole === 'SYSTEM_ADMIN' ||
      rawRole.includes('SUPER')
    ) {
      role = 'SUPER_ADMIN';
    } else if (
      rawRole === 'CINEMA_MANAGER' ||
      rawRole === 'MANAGER' ||
      rawRole.includes('MANAGER')
    ) {
      role = 'CINEMA_MANAGER';
    } else if (rawRole === 'MARKETING') {
      role = 'MARKETING';
    } else if (rawRole === 'ACCOUNTANT') {
      role = 'ACCOUNTANT';
    } else if (rawRole === 'FNB_STAFF') {
      role = 'FNB_STAFF';
    } else if (
      rawRole === 'TICKET_STAFF' ||
      rawRole === 'SCANNER' ||
      rawRole === 'CASHIER'
    ) {
      role = 'TICKET_STAFF';
    } else if (rawRole === 'STAFF') {
      role = 'STAFF';
    } else {
      // Bất kỳ vai trò nào khác (CUSTOMER, USER, GUEST, rỗng) đều bị từ chối quyền Admin
      return null;
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
      email: dto.email || '',
      name: dto.name || dto.fullname || 'Quản Trị Viên CineDot',
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
