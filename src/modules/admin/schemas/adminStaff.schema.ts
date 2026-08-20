import { z } from 'zod';

export const createStaffSchema = z.object({
  name: z
    .string({ required_error: 'Vui lòng nhập họ và tên' })
    .min(2, 'Họ và tên phải có ít nhất 2 ký tự')
    .max(100, 'Họ và tên không được vượt quá 100 ký tự'),
  email: z
    .string({ required_error: 'Vui lòng nhập Email công việc' })
    .min(1, 'Email không được để trống')
    .email('Email không đúng định dạng'),
  password: z
    .string({ required_error: 'Vui lòng nhập mật khẩu khởi tạo' })
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  role: z.string({
    required_error: 'Vui lòng chọn vai trò phân quyền',
  }).min(1, 'Vui lòng chọn vai trò'),
  cinemaName: z.string().optional(),
  cinemaId: z.union([z.string(), z.number()]).optional().nullable(),
  phone: z
    .string()
    .regex(/^[0-9+() -]*$/, 'Số điện thoại không hợp lệ')
    .optional()
    .or(z.literal('')),
});

export type CreateStaffFormValues = z.infer<typeof createStaffSchema>;

export const updateStaffRoleSchema = z.object({
  role: z.string().min(1, 'Vui lòng chọn vai trò'),
  cinemaId: z.union([z.string(), z.number()]).optional().nullable(),
  cinemaName: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

export type UpdateStaffRoleFormValues = z.infer<typeof updateStaffRoleSchema>;
