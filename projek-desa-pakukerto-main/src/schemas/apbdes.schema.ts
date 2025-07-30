import { z } from "zod";

// Schema for sub-rincian items
const subRincianSchema = z.object({
  id: z.string().optional(),
  uraian: z.string().min(1, { message: "Uraian harus diisi" }),
  jumlah: z.number().min(0, { message: "Jumlah harus berupa angka positif" }),
});

// Schema for rincian items (with subRincian)
const rincianSchema = z.object({
  id: z.string().optional(),
  kategori: z.string().min(1, { message: "Kategori harus diisi" }),
  jumlah: z.number().min(0, { message: "Jumlah harus berupa angka positif" }),
  subRincian: z
    .array(subRincianSchema)
    .min(1, { message: "Minimal harus ada 1 sub-rincian" }),
});

// Schema for pembiayaan rincian items (without subRincian)
const pembiayaanRincianSchema = z.object({
  id: z.string().optional(),
  kategori: z.string(),
  jumlah: z.number().min(0, { message: "Jumlah harus berupa angka positif" }),
});

// Schema for pembiayaan section
const pembiayaanSectionSchema = z.object({
  total: z.number().min(0, { message: "Total harus berupa angka positif" }),
  rincian: z
    .array(pembiayaanRincianSchema)
    .min(1, { message: "Minimal harus ada 1 rincian" }),
});

// Schema for ringkasan
const ringkasanSchema = z.object({
  totalPendapatan: z
    .number()
    .min(0, { message: "Total pendapatan harus berupa angka positif" }),
  totalBelanja: z
    .number()
    .min(0, { message: "Total belanja harus berupa angka positif" }),
  totalPembiayaan: z.object({
    penerimaan: z
      .number()
      .min(0, { message: "Total penerimaan harus berupa angka positif" }),
    pengeluaran: z
      .number()
      .min(0, { message: "Total pengeluaran harus berupa angka positif" }),
  }),
  surplus: z.number(),
});

// Schema for pendapatan and belanja sections
const sectionSchema = z.object({
  total: z.number().min(0, { message: "Total harus berupa angka positif" }),
  rincian: z
    .array(rincianSchema)
    .min(1, { message: "Minimal harus ada 1 rincian" }),
});

// Schema for pembiayaan
const pembiayaanSchema = z.object({
  penerimaan: pembiayaanSectionSchema,
  pengeluaran: pembiayaanSectionSchema,
  surplus: z.number(),
});

// Schema for creating a new APBDes
export const createApbdesSchema = z.object({
  tahun: z
    .number()
    .int()
    .min(2000, { message: "Tahun harus valid" })
    .max(2100, { message: "Tahun harus valid" }),
  ringkasan: ringkasanSchema,
  pendapatan: sectionSchema,
  belanja: sectionSchema,
  pembiayaan: pembiayaanSchema,
});

// Schema for updating an existing APBDes
export const updateApbdesSchema = createApbdesSchema.partial();

// Schema for APBDes response from Firestore
export const apbdesSchema = z.object({
  id: z.string(),
  tahun: z.number(),
  lastUpdated: z.any(),
  ringkasan: ringkasanSchema,
  pendapatan: sectionSchema,
  belanja: sectionSchema,
  pembiayaan: pembiayaanSchema,
});

// Type definitions based on schemas
export type CreateApbdesInput = z.infer<typeof createApbdesSchema>;
export type UpdateApbdesInput = z.infer<typeof updateApbdesSchema>;
export type Apbdes = z.infer<typeof apbdesSchema>;

// Helper types for form arrays
export type SubRincianItem = z.infer<typeof subRincianSchema>;
export type RincianItem = z.infer<typeof rincianSchema>;
export type PembiayaanRincianItem = z.infer<typeof pembiayaanRincianSchema>;
export type PembiayaanSection = z.infer<typeof pembiayaanSectionSchema>;
export type Section = z.infer<typeof sectionSchema>;
export type Pembiayaan = z.infer<typeof pembiayaanSchema>;
export type Ringkasan = z.infer<typeof ringkasanSchema>;
