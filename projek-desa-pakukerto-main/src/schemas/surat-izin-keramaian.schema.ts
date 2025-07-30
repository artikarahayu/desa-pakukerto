import { z } from "zod";

// Schema for creating a new surat izin keramaian
export const createSuratIzinKeramaianSchema = z.object({
  // Data Pemohon
  nama: z
    .string()
    .min(2, { message: "Nama harus minimal 2 karakter" }),
  tempatTanggalLahir: z
    .string()
    .min(5, { message: "Tempat/tanggal lahir harus minimal 5 karakter" }),
  jenisKelamin: z
    .enum(["Laki-laki", "Perempuan"], { message: "Jenis kelamin harus dipilih" }),
  agama: z
    .string()
    .min(2, { message: "Agama harus minimal 2 karakter" }),
  nik: z
    .string()
    .regex(/^\d{16}$/, { message: "NIK harus 16 digit angka" }),
  alamat: z
    .string()
    .min(5, { message: "Alamat harus minimal 5 karakter" }),
  nomorHP: z.string().regex(/^(\+62|62|0)8[1-9][0-9]{6,9}$/, {
    message: "Nomor HP tidak valid (contoh: 08123456789)",
  }),

  // Data Pelaksanaan
  hari: z
    .string()
    .min(2, { message: "Hari harus diisi" }),
  tanggal: z
    .string()
    .min(1, { message: "Tanggal wajib diisi" }),
  jamMulai: z
    .string()
    .min(1, { message: "Jam mulai wajib diisi" }),
  jamSelesai: z
    .string()
    .min(1, { message: "Jam selesai wajib diisi" }),
  jenisKeramaian: z
    .string()
    .min(3, { message: "Jenis keramaian harus minimal 3 karakter" }),
  keperluan: z
    .string()
    .min(3, { message: "Keperluan harus minimal 3 karakter" }),
  lokasi: z
    .string()
    .min(5, { message: "Lokasi harus minimal 5 karakter" }),

  // Kontak
  nomorWhatsApp: z.string().regex(/^(\+62|62|0)8[1-9][0-9]{6,9}$/, {
    message: "Nomor WhatsApp tidak valid (contoh: 08123456789)",
  }),

  // reCAPTCHA
  recaptchaToken: z
    .string()
    .min(1, { message: "Verifikasi reCAPTCHA wajib diisi" }),
});

// Schema for updating surat izin keramaian (admin only)
export const updateSuratIzinKeramaianSchema = z.object({
  nomorSurat: z.string().optional(),
  status: z.enum(["pending", "finish"]).optional(),
});

// Schema for surat izin keramaian response from Firestore
export const suratIzinKeramaianSchema = z.object({
  id: z.string(),
  jenisSurat: z.literal("surat-izin-keramaian"),
  status: z.enum(["pending", "finish"]),
  nomorSurat: z.string().optional(),
  timestamp: z.any(), // Firestore timestamp
  wa: z.string(),
  data: z.object({
    nama: z.string(),
    tempatTanggalLahir: z.string(),
    jenisKelamin: z.string(),
    agama: z.string(),
    nik: z.string(),
    alamat: z.string(),
    nomorHP: z.string(),
    hari: z.string(),
    tanggal: z.string(),
    jamMulai: z.string(),
    jamSelesai: z.string(),
    jenisKeramaian: z.string(),
    keperluan: z.string(),
    lokasi: z.string(),
    nomorWhatsApp: z.string(),
  }),
});

// Type definitions based on schemas
export type CreateSuratIzinKeramaianInput = z.infer<
  typeof createSuratIzinKeramaianSchema
>;
export type UpdateSuratIzinKeramaianInput = z.infer<
  typeof updateSuratIzinKeramaianSchema
>;
export type SuratIzinKeramaian = z.infer<typeof suratIzinKeramaianSchema>;
