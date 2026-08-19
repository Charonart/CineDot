import { z } from 'zod';

export const createGenreSchema = z.object({
  genreName: z
    .string({ required_error: 'Vui lòng nhập tên thể loại phim' })
    .min(2, 'Tên thể loại tối thiểu 2 ký tự')
    .max(100, 'Tên thể loại không vượt quá 100 ký tự'),
});

export type CreateGenreFormValues = z.infer<typeof createGenreSchema>;

export const updateGenreSchema = createGenreSchema;
export type UpdateGenreFormValues = z.infer<typeof updateGenreSchema>;
