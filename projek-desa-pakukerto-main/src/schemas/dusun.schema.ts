import { z } from "zod";

// Schema for creating a new dusun profile
export const createDusunSchema = z.object({
  nama: z.string().min(3, { message: "Nama dusun harus minimal 3 karakter" }),
  isi: z
    .string()
    .min(10, { message: "Konten dusun harus minimal 10 karakter" }),
  gambar: z.string().optional(),
});

// Schema for updating an existing dusun profile
export const updateDusunSchema = createDusunSchema.partial();

// Schema for dusun profile response from Firestore
export const dusunSchema = z.object({
  id: z.string(),
  nama: z.string(),
  slug: z.string(),
  isi: z.string(),
  gambar: z.string().optional(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

// Type definitions based on schemas
export type CreateDusunInput = z.infer<typeof createDusunSchema>;
export type UpdateDusunInput = z.infer<typeof updateDusunSchema>;
export type Dusun = z.infer<typeof dusunSchema>;

// Helper function to generate slug from name
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/--+/g, "-") // Replace multiple hyphens with single hyphen
    .trim();
}
