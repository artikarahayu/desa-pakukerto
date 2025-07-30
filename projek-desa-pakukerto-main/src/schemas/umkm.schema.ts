import { z } from 'zod';

// Schema for creating a new UMKM product
export const createUmkmSchema = z.object({
  nama: z.string().min(3, { message: 'Nama produk harus minimal 3 karakter' }),
  deskripsi: z.string().min(10, { message: 'Deskripsi produk harus minimal 10 karakter' }),
  gambar: z.array(z.string().url({ message: 'Gambar harus berupa URL valid' }))
    .min(1, { message: 'Minimal harus ada 1 gambar produk' }),
  whatsapp: z.string()
    .min(10, { message: 'Nomor WhatsApp harus minimal 10 digit' })
    .regex(/^\d+$/, { message: 'Nomor WhatsApp hanya boleh berisi angka' }),
  harga: z.string().min(1, { message: 'Harga produk harus diisi' }),
});

// Schema for updating an existing UMKM product
export const updateUmkmSchema = createUmkmSchema.partial();

// Schema for UMKM product response from Firestore
export const umkmSchema = z.object({
  id: z.string(),
  nama: z.string(),
  deskripsi: z.string(),
  gambar: z.array(z.string().url()),
  whatsapp: z.string(),
  harga: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

// Type definitions based on schemas
export type CreateUmkmInput = z.infer<typeof createUmkmSchema>;
export type UpdateUmkmInput = z.infer<typeof updateUmkmSchema>;
export type Umkm = z.infer<typeof umkmSchema>;
