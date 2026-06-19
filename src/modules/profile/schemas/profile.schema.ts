import { z } from 'zod';

// ─── Membership Tier ────────────────────────────────────────────────────────

export const membershipTierSchema = z.enum(['Standard', 'VIP', 'VVIP']);

// ─── Ticket Status ───────────────────────────────────────────────────────────

export const ticketStatusSchema = z.enum(['UPCOMING', 'COMPLETED', 'CANCELLED']);

// ─── User Profile DTO Schema ─────────────────────────────────────────────────

export const userProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().nullable().optional(),
  avatar: z.string().nullable().optional(),
  membershipTier: membershipTierSchema,
  totalPoints: z.number().min(0).default(0),
});

// ─── Ticket History DTO Schema ────────────────────────────────────────────────

export const ticketHistorySchema = z.object({
  id: z.string(),
  bookingId: z.string(),
  movieTitle: z.string(),
  posterPath: z.string(),
  cinemaName: z.string(),
  roomName: z.string(),
  seatLabels: z.array(z.string()),
  showtimeStart: z.string(), // ISO 8601
  totalAmount: z.number().min(0),
  status: ticketStatusSchema,
  qrCodeString: z.string(),
});

export const ticketHistoryListSchema = z.array(ticketHistorySchema);

// ─── Profile Update Form Schema (Strict Validation) ──────────────────────────

/**
 * Zod schema for the AccountForm update request.
 * Email is excluded — it is read-only and never submitted.
 */
export const profileUpdateFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(100, 'Tên không được vượt quá 100 ký tự')
    .trim(),
  phone: z
    .string()
    .regex(
      /^(0[3-9])\d{8}$/,
      'Số điện thoại không hợp lệ (VD: 0901234567)',
    )
    .optional()
    .or(z.literal('')),
});

export type ProfileUpdateFormValues = z.infer<typeof profileUpdateFormSchema>;
