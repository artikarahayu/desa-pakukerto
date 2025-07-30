import { z } from "zod";

// Schema for creating a new surat pengantar SKCK
export const createSuratPengantarSKCKSchema = z.object({
  // Data Pemohon
  namaLengkap: z
    .string()
    .min(2, { message: "Nama lengkap harus minimal 2 karakter" }),
  nik: z
    .string()
    .regex(/^\d{16}$/, { message: "NIK harus 16 digit angka" }),
  tempatLahir: z
    .string()
    .min(2, { message: "Tempat lahir harus minimal 2 karakter" }),
  tanggalLahir: z
    .string()
    .min(1, { message: "Tanggal lahir wajib diisi" }),
  jenisKelamin: z.enum(["Laki-laki", "Perempuan"], {
    message: "Jenis kelamin harus dipilih",
  }),
  agama: z.enum([
    "Islam",
    "Kristen",
    "Katolik",
    "Hindu",
    "Buddha",
    "Konghucu",
  ], {
    message: "Agama harus dipilih",
  }),
  statusPerkawinan: z.enum([
    "Belum Kawin",
    "Kawin",
    "Cerai Hidup",
    "Cerai Mati",
  ], {
    message: "Status perkawinan harus dipilih",
  }),
  pekerjaan: z
    .string()
    .min(2, { message: "Pekerjaan harus minimal 2 karakter" }),
  alamat: z
    .string()
    .min(5, { message: "Alamat harus minimal 5 karakter" }),

  // Keperluan
  keperluan: z
    .string()
    .min(3, { message: "Keperluan harus minimal 3 karakter" }),

  // Kontak
  nomorWhatsApp: z.string().regex(/^(\+62|62|0)8[1-9][0-9]{6,9}$/, {
    message: "Nomor WhatsApp tidak valid (contoh: 08123456789)",
  }),

  // reCAPTCHA
  recaptchaToken: z
    .string()
    .min(1, { message: "Verifikasi reCAPTCHA wajib diisi" }),
});

// Schema for updating surat pengantar SKCK (admin only)
export const updateSuratPengantarSKCKSchema = z.object({
  nomorSurat: z.string().optional(),
  status: z.enum(["pending", "finish"]).optional(),
});

// Schema for surat pengantar SKCK response from Firestore
export const suratPengantarSKCKSchema = z.object({
  id: z.string(),
  jenisSurat: z.literal("surat-pengantar-skck"),
  status: z.enum(["pending", "finish"]),
  nomorSurat: z.string().optional(),
  timestamp: z.any(), // Firestore timestamp
  wa: z.string(),
  data: z.object({
    namaLengkap: z.string(),
    nik: z.string(),
    tempatLahir: z.string(),
    tanggalLahir: z.string(),
    jenisKelamin: z.string(),
    agama: z.string(),
    statusPerkawinan: z.string(),
    pekerjaan: z.string(),
    alamat: z.string(),
    keperluan: z.string(),
    nomorWhatsApp: z.string(),
  }),
});

// Type definitions based on schemas
export type CreateSuratPengantarSKCKInput = z.infer<
  typeof createSuratPengantarSKCKSchema
>;
export type UpdateSuratPengantarSKCKInput = z.infer<
  typeof updateSuratPengantarSKCKSchema
>;
export type SuratPengantarSKCK = z.infer<typeof suratPengantarSKCKSchema>;
