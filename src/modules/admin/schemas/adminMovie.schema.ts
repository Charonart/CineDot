import { z } from 'zod';

// Helper regex to validate TMDB relative path (e.g. /z8OWDTR7pQuZi7jkEuR7yMXRrQt.jpg) or full URL
const isTmdbPathOrUrl = (val: string) => {
  if (!val) return false;
  if (val.startsWith('/') && (val.endsWith('.jpg') || val.endsWith('.png') || val.endsWith('.webp') || val.length > 5)) {
    return true;
  }
  return /^https?:\/\/.+/i.test(val);
};

export const createMovieSchema = z.object({
  title: z
    .string({ required_error: 'Vui lòng nhập tên phim' })
    .min(1, 'Tên phim không được để trống')
    .max(255, 'Tên phim không vượt quá 255 ký tự'),
  originalTitle: z.string().max(255).optional(),
  overview: z.string().optional(),
  releaseDate: z
    .string({ required_error: 'Vui lòng chọn ngày khởi chiếu' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Ngày khởi chiếu phải theo định dạng YYYY-MM-DD'),
  originalLanguage: z.string().default('vi'),
  adult: z.boolean().default(false),
  popularity: z.number().min(0).default(0),
  durationMinutes: z
    .number({ required_error: 'Vui lòng nhập thời lượng phim (phút)' })
    .min(1, 'Thời lượng tối thiểu 1 phút')
    .max(600, 'Thời lượng không hợp lệ'),
  status: z.enum(['now_showing', 'upcoming', 'ended', 'coming_soon', 'stopped'], {
    required_error: 'Vui lòng chọn trạng thái phim',
  }),
  genreIds: z.array(z.number()).min(1, 'Vui lòng chọn ít nhất một thể loại phim'),
  posterPath: z
    .string({ required_error: 'Vui lòng nhập mã Poster TMDB hoặc URL' })
    .min(1, 'Poster không được để trống')
    .refine(
      (val) => isTmdbPathOrUrl(val),
      'Poster phải là mã đường dẫn TMDB (VD: /z8OWDTR7pQuZi7jkEuR7yMXRrQt.jpg) hoặc URL hợp lệ'
    ),
  backdropPath: z
    .string()
    .refine(
      (val) => !val || isTmdbPathOrUrl(val),
      'Backdrop phải là mã đường dẫn TMDB (VD: /kkcwhgSFd81QDlXo8ytrpHPQjhy.jpg) hoặc URL hợp lệ'
    )
    .optional()
    .or(z.literal('')),
  trailerUrl: z
    .string()
    .url('Đường dẫn Trailer YouTube không hợp lệ')
    .optional()
    .or(z.literal('')),
});

export type CreateMovieFormValues = z.infer<typeof createMovieSchema>;

export const updateMovieSchema = createMovieSchema.partial();
export type UpdateMovieFormValues = z.infer<typeof updateMovieSchema>;

export const tmdbSearchSchema = z.object({
  query: z.string().min(1, 'Vui lòng nhập từ khóa tìm kiếm phim TMDB'),
});
export type TmdbSearchFormValues = z.infer<typeof tmdbSearchSchema>;
