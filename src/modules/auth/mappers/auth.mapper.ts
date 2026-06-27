import { AuthUserDTO, AuthSessionDTO } from '../dto/auth.dto';
import { AuthUser, AuthSession } from '../types/auth.type';

export const authMapper = {
  toAuthUser: (dto: AuthUserDTO): AuthUser => {
    return {
      id: dto.id,
      name: dto.name,
      email: dto.email,
      phone: dto.phone ?? null,
      avatarUrl: dto.avatarUrl ?? null,
      emailVerifiedAt: dto.emailVerifiedAt ?? null,
      roles: dto.roles,
      permissions: dto.permissions,
    };
  },

  toAuthSession: (dto: AuthSessionDTO): AuthSession => {
    return {
      user: authMapper.toAuthUser(dto.user),
      token: dto.token || '',
    };
  },
};
