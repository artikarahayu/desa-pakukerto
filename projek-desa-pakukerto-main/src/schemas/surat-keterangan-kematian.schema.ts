import { z } from "zod";

// Schema for creating a new surat keterangan kematian
export const createSuratKeteranganKematianSchema = z.object({
  // Data Pelapor
  namaPelapor: z
    .string()
    .min(2, { message: "Nama pelapor harus minimal 2 karakter" }),
  nikPelapor: z
    .string()
    .regex(/^\d{16}$/, { message: "NIK pelapor harus 16 digit angka" }),
  alamatPelapor: z
    .string()
    .min(5, { message: "Alamat pelapor harus minimal 5 karakter" }),
  statusPelapor: z
    .string()
    .min(2, { message: "Status/hubungan pelapor harus diisi" }),

  // Data Almarhum/Almarhumah
  namaLengkap: z
    .string()
    .min(2, { message: "Nama lengkap almarhum/almarhumah harus minimal 2 karakter" }),
  nik: z
    .string()
    .regex(/^\d{16}$/, { message: "NIK almarhum/almarhumah harus 16 digit angka" }),
  nomorKartuKeluarga: z
    .string()
    .min(1, { message: "Nomor kartu keluarga wajib diisi" }),
  tempatLahir: z
    .string()
    .min(2, { message: "Tempat lahir harus minimal 2 karakter" }),
  tanggalLahir: z
    .string()
    .min(1, { message: "Tanggal lahir wajib diisi" }),
  jenisKelamin: z.enum(["Laki-Laki", "Perempuan"], {
    message: "Jenis kelamin harus dipilih",
  }),
  agama: z
    .string()
    .min(1, { message: "Agama wajib diisi" }),
  statusPerkawinan: z
    .string()
    .min(1, { message: "Status perkawinan wajib diisi" }),
  pekerjaan: z
    .string()
    .min(1, { message: "Pekerjaan wajib diisi" }),
  alamat: z
    .string()
    .min(5, { message: "Alamat harus minimal 5 karakter" }),

  // Data Kematian
  hariTanggalMeninggal: z
    .string()
    .min(1, { message: "Hari tanggal meninggal wajib diisi" }),
  // Tempat Kematian (detailed location)
  provinsiKematian: z
    .string()
    .min(2, { message: "Provinsi tempat kematian harus diisi" }),
  kabupatenKematian: z
    .string()
    .min(2, { message: "Kabupaten/Kota tempat kematian harus diisi" }),
  kecamatanKematian: z
    .string()
    .min(2, { message: "Kecamatan tempat kematian harus diisi" }),
  desaKematian: z
    .string()
    .min(2, { message: "Desa tempat kematian harus diisi" }),
  sebabKematian: z
    .string()
    .min(3, { message: "Sebab kematian harus minimal 3 karakter" }),

  // Keperluan
  keperluan: z
    .string()
    .min(5, { message: "Keperluan harus minimal 5 karakter" }),

  // Kontak
  nomorWhatsApp: z.string().regex(/^(\+62|62|0)8[1-9][0-9]{6,9}$/, {
    message: "Nomor WhatsApp tidak valid (contoh: 08123456789)",
  }),

  // reCAPTCHA
  recaptchaToken: z
    .string()
    .min(1, { message: "Verifikasi reCAPTCHA wajib diisi" }),
});

// Schema for updating surat keterangan kematian (admin only)
export const updateSuratKeteranganKematianSchema = z.object({
  nomorSurat: z.string().optional(),
  status: z.enum(["pending", "finish"]).optional(),
});

// Schema for surat keterangan kematian response from Firestore
export const suratKeteranganKematianSchema = z.object({
  id: z.string(),
  jenisSurat: z.literal("surat-keterangan-kematian"),
  status: z.enum(["pending", "finish"]),
  nomorSurat: z.string().optional(),
  timestamp: z.any(), // Firestore timestamp
  wa: z.string(),
  data: z.object({
    namaPelapor: z.string(),
    nikPelapor: z.string(),
    alamatPelapor: z.string(),
    statusPelapor: z.string(),
    namaLengkap: z.string(),
    nik: z.string(),
    nomorKartuKeluarga: z.string(),
    tempatLahir: z.string(),
    tanggalLahir: z.string(),
    jenisKelamin: z.string(),
    agama: z.string(),
    statusPerkawinan: z.string(),
    pekerjaan: z.string(),
    alamat: z.string(),
    hariTanggalMeninggal: z.string(),
    provinsiKematian: z.string(),
    kabupatenKematian: z.string(),
    kecamatanKematian: z.string(),
    desaKematian: z.string(),
    sebabKematian: z.string(),
    keperluan: z.string(),
    nomorWhatsApp: z.string(),
  }),
});

// Type definitions based on schemas
export type CreateSuratKeteranganKematianInput = z.infer<
  typeof createSuratKeteranganKematianSchema
>;
export type UpdateSuratKeteranganKematianInput = z.infer<
  typeof updateSuratKeteranganKematianSchema
>;
export type SuratKeteranganKematian = z.infer<typeof suratKeteranganKematianSchema>;
