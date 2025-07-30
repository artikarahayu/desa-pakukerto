import { z } from "zod";

// Base schema for gallery items
const galeriBaseSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
});

// Schema for image type gallery items
const galeriImageSchema = galeriBaseSchema.extend({
  type: z.literal("image"),
  imageUrl: z.string().url("URL gambar tidak valid"),
});

// Schema for YouTube video type gallery items
const galeriVideoSchema = galeriBaseSchema.extend({
  type: z.literal("video"),
  youtubeUrl: z
    .string()
    .url("URL YouTube tidak valid")
    .regex(
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})(\S*)?$/,
      "URL YouTube tidak valid"
    ),
});

// Union type for gallery items
export const galeriSchema = z.discriminatedUnion("type", [
  galeriImageSchema,
  galeriVideoSchema,
]);

// Schema for creating a new gallery item
export const createGaleriSchema = galeriSchema;
export type CreateGaleriInput = z.infer<typeof createGaleriSchema>;

// Partial schemas for updating gallery items
const updateGaleriImageSchema = galeriImageSchema.partial();
const updateGaleriVideoSchema = galeriVideoSchema.partial();

// Schema for updating an existing gallery item
export const updateGaleriSchema = z.discriminatedUnion("type", [
  updateGaleriImageSchema.extend({ type: z.literal("image") }),
  updateGaleriVideoSchema.extend({ type: z.literal("video") }),
]);
export type UpdateGaleriInput = z.infer<typeof updateGaleriSchema>;

// Type for gallery item with ID
export type Galeri = z.infer<typeof galeriSchema> & {
  id: string;
};

// Helper function to extract YouTube video ID from URL
export function extractYoutubeVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
