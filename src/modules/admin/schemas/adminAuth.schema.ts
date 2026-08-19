import { z } from 'zod';

export const adminLoginSchema = z.object({
  email: z
    .string({ required_error: 'Vui lòng nhập Email công việc' })
    .min(1, 'Email không được để trống')
    .email('Email không đúng định dạng'),
  password: z
    .string({ required_error: 'Vui lòng nhập Mật khẩu quản trị' })
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

export type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;
