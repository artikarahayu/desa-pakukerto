import { z } from "zod";

// Schema for creating a new surat keterangan
export const createSuratKeteranganSchema = z.object({
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
  jenisKelamin: z.enum(["Laki-laki", "Perempuan"]),
  agama: z.enum(["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"]),
  statusPerkawinan: z.enum(["Belum Kawin", "Kawin", "Cerai Hidup", "Cerai Mati"]),
  pekerjaan: z
    .string()
    .min(2, { message: "Pekerjaan harus minimal 2 karakter" }),
  alamat: z
    .string()
    .min(5, { message: "Alamat harus minimal 5 karakter" }),

  // Keterangan (dynamic array)
  keterangan: z.array(z.string().min(1, { message: "Keterangan tidak boleh kosong" }))
    .min(1, { message: "Minimal harus ada 1 keterangan" }),

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

// Schema for updating surat keterangan (admin only)
export const updateSuratKeteranganSchema = z.object({
  nomorSurat: z.string().optional(),
  status: z.enum(["pending", "finish"]).optional(),
});

// Schema for surat keterangan response from Firestore
export const suratKeteranganSchema = z.object({
  id: z.string(),
  jenisSurat: z.literal("surat-keterangan"),
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
    keterangan: z.array(z.string()),
    keperluan: z.string(),
    nomorWhatsApp: z.string(),
  }),
});

// Type definitions based on schemas
export type CreateSuratKeteranganInput = z.infer<
  typeof createSuratKeteranganSchema
>;
export type UpdateSuratKeteranganInput = z.infer<
  typeof updateSuratKeteranganSchema
>;
export type SuratKeterangan = z.infer<typeof suratKeteranganSchema>;
