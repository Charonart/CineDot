import { z } from 'zod';

export const authUserSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Họ tên không được để trống'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
  emailVerifiedAt: z.string().nullable().optional(),
  roles: z.array(z.enum(['customer', 'staff', 'admin'])).optional().default(['customer']),
  permissions: z.array(z.string()).optional().default([]),
});

export const authSessionSchema = z.object({
  user: authUserSchema,
});

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email không được để trống').email('Email không hợp lệ'),
  password: z.string().min(1, 'Mật khẩu không được để trống').min(8, 'Mật khẩu phải từ 8 ký tự').max(64, 'Mật khẩu quá dài'),
  remember: z.boolean().optional(),
});

export const registerSchema = z.object({
  name: z.string().trim().min(1, 'Họ tên không được để trống'),
  email: z.string().trim().min(1, 'Email không được để trống').email('Email không hợp lệ'),
  phone: z.string().trim().optional().or(z.literal('')),
  password: z.string().min(1, 'Mật khẩu không được để trống').min(8, 'Mật khẩu phải từ 8 ký tự').max(64, 'Mật khẩu quá dài'),
  passwordConfirmation: z.string().min(1, 'Xác nhận mật khẩu không được để trống'),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['passwordConfirmation'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, 'Email không được để trống').email('Email không hợp lệ'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Mã xác thực không hợp lệ'),
  email: z.string().trim().min(1, 'Email không được để trống').email('Email không hợp lệ'),
  password: z.string().min(1, 'Mật khẩu không được để trống').min(8, 'Mật khẩu phải từ 8 ký tự').max(64, 'Mật khẩu quá dài'),
  passwordConfirmation: z.string().min(1, 'Xác nhận mật khẩu không được để trống'),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['passwordConfirmation'],
});
