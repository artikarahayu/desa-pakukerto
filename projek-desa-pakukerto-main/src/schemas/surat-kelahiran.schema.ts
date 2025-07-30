import { z } from "zod";

// Schema for creating a new surat keterangan kelahiran
export const createSuratKelahiranSchema = z.object({
  // Data Anak
  namaLengkapAnak: z
    .string()
    .min(2, { message: "Nama lengkap anak harus minimal 2 karakter" }),
  anakKe: z.number().min(1, { message: "Anak ke harus minimal 1" }),
  tempatLahirAnak: z
    .string()
    .min(2, { message: "Tempat lahir anak harus minimal 2 karakter" }),
  tanggalLahirAnak: z
    .string()
    .min(1, { message: "Tanggal lahir anak wajib diisi" }),
  alamatAnak: z
    .string()
    .min(5, { message: "Alamat anak harus minimal 5 karakter" }),

  // Data Ibu
  namaIbu: z.string().min(2, { message: "Nama ibu harus minimal 2 karakter" }),
  nikIbu: z
    .string()
    .regex(/^\d{16}$/, { message: "NIK ibu harus 16 digit angka" }),
  tempatLahirIbu: z
    .string()
    .min(2, { message: "Tempat lahir ibu harus minimal 2 karakter" }),
  tanggalLahirIbu: z
    .string()
    .min(1, { message: "Tanggal lahir ibu wajib diisi" }),
  alamatIbu: z
    .string()
    .min(5, { message: "Alamat ibu harus minimal 5 karakter" }),

  // Data Ayah
  namaAyah: z
    .string()
    .min(2, { message: "Nama ayah harus minimal 2 karakter" }),
  nikAyah: z
    .string()
    .regex(/^\d{16}$/, { message: "NIK ayah harus 16 digit angka" }),
  tempatLahirAyah: z
    .string()
    .min(2, { message: "Tempat lahir ayah harus minimal 2 karakter" }),
  tanggalLahirAyah: z
    .string()
    .min(1, { message: "Tanggal lahir ayah wajib diisi" }),
  alamatAyah: z
    .string()
    .min(5, { message: "Alamat ayah harus minimal 5 karakter" }),

  // Kontak
  nomorWhatsApp: z.string().regex(/^(\+62|62|0)8[1-9][0-9]{6,9}$/, {
    message: "Nomor WhatsApp tidak valid (contoh: 08123456789)",
  }),

  // Penolong Kelahiran
  penolongKelahiran: z.string().min(2, { message: "Penolong kelahiran harus minimal 2 karakter" }),
  alamatPenolong: z.string().min(5, { message: "Alamat penolong harus minimal 5 karakter" }),

  // Keperluan
  keperluan: z.string().min(3, { message: "Keperluan harus minimal 3 karakter" }),

  // reCAPTCHA
  recaptchaToken: z
    .string()
    .min(1, { message: "Verifikasi reCAPTCHA wajib diisi" }),
});

// Schema for updating surat kelahiran (admin only)
export const updateSuratKelahiranSchema = z.object({
  nomorSurat: z.string().optional(),
  status: z.enum(["pending", "finish"]).optional(),
});

// Schema for surat kelahiran response from Firestore
export const suratKelahiranSchema = z.object({
  id: z.string(),
  jenisSurat: z.literal("surat-keterangan-kelahiran"),
  status: z.enum(["pending", "finish"]),
  nomorSurat: z.string().optional(),
  timestamp: z.any(), // Firestore timestamp
  wa: z.string(),
  data: z.object({
    namaLengkapAnak: z.string(),
    anakKe: z.number(),
    tempatLahirAnak: z.string(),
    tanggalLahirAnak: z.string(),
    alamatAnak: z.string(),
    namaIbu: z.string(),
    nikIbu: z.string(),
    tempatLahirIbu: z.string(),
    tanggalLahirIbu: z.string(),
    alamatIbu: z.string(),
    namaAyah: z.string(),
    nikAyah: z.string(),
    tempatLahirAyah: z.string(),
    tanggalLahirAyah: z.string(),
    alamatAyah: z.string(),
    nomorWhatsApp: z.string(),
    penolongKelahiran: z.string(),
    alamatPenolong: z.string(),
    keperluan: z.string(),
  }),
});

// Type definitions based on schemas
export type CreateSuratKelahiranInput = z.infer<
  typeof createSuratKelahiranSchema
>;
export type UpdateSuratKelahiranInput = z.infer<
  typeof updateSuratKelahiranSchema
>;
export type SuratKelahiran = z.infer<typeof suratKelahiranSchema>;
