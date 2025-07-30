import { z } from 'zod';

// Schema for creating a new berita
export const createBeritaSchema = z.object({
  judul: z.string().min(5, { message: 'Judul harus minimal 5 karakter' }),
  isi: z.string().min(10, { message: 'Isi berita harus minimal 10 karakter' }),
  thumbnail: z.string().url({ message: 'Thumbnail harus berupa URL valid' }),
});

// Schema for updating an existing berita
export const updateBeritaSchema = createBeritaSchema.partial();

// Schema for berita response from Firestore
export const beritaSchema = z.object({
  id: z.string(),
  judul: z.string(),
  slug: z.string(),
  thumbnail: z.string().url(),
  isi: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

// Type definitions based on schemas
export type CreateBeritaInput = z.infer<typeof createBeritaSchema>;
export type UpdateBeritaInput = z.infer<typeof updateBeritaSchema>;
export type Berita = z.infer<typeof beritaSchema>;
