import { z } from 'zod';

// Schema for creating a new pejabat (official)
export const createStrukturSchema = z.object({
  nama: z.string().min(3, { message: 'Nama harus minimal 3 karakter' }),
  jabatan: z.string().min(3, { message: 'Jabatan harus minimal 3 karakter' }),
  foto: z.string().url({ message: 'Foto harus berupa URL valid' }),
});

// Schema for updating an existing pejabat
export const updateStrukturSchema = createStrukturSchema.partial();

// Schema for pejabat response from Firestore
export const strukturSchema = z.object({
  id: z.string(),
  nama: z.string(),
  jabatan: z.string(),
  foto: z.string().url(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

// Type definitions based on schemas
export type CreateStrukturInput = z.infer<typeof createStrukturSchema>;
export type UpdateStrukturInput = z.infer<typeof updateStrukturSchema>;
export type Struktur = z.infer<typeof strukturSchema>;
