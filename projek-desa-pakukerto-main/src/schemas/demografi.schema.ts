import { z } from "zod";

// Schema for global data
const dataGlobalSchema = z.object({
  totalPenduduk: z
    .number()
    .int()
    .min(0, { message: "Total penduduk harus berupa angka positif" }),
  jumlahKepalaKeluarga: z
    .number()
    .int()
    .min(0, { message: "Jumlah kepala keluarga harus berupa angka positif" }),
  jumlahLakiLaki: z
    .number()
    .int()
    .min(0, { message: "Jumlah laki-laki harus berupa angka positif" }),
  jumlahPerempuan: z
    .number()
    .int()
    .min(0, { message: "Jumlah perempuan harus berupa angka positif" }),
});

// Schema for kelompok dusun
const dataKelompokDusunItemSchema = z.object({
  kelompokDusun: z.string().min(1, { message: "Dusun harus diisi" }),
  lakiLaki: z
    .number()
    .int()
    .min(0, { message: "Jumlah laki-laki harus berupa angka positif" }),
  perempuan: z
    .number()
    .int()
    .min(0, { message: "Jumlah perempuan harus berupa angka positif" }),
  total: z
    .number()
    .int()
    .min(0, { message: "Total harus berupa angka positif" }),
});

// Schema for dusun
const dataDusunItemSchema = z.object({
  namaDusun: z.string().min(1, { message: "Nama dusun harus diisi" }),
  jumlah: z
    .number()
    .int()
    .min(0, { message: "Jumlah harus berupa angka positif" }),
});

// Schema for pendidikan
const dataPendidikanItemSchema = z.object({
  tingkatPendidikan: z
    .string()
    .min(1, { message: "Tingkat pendidikan harus diisi" }),
  jumlah: z
    .number()
    .int()
    .min(0, { message: "Jumlah harus berupa angka positif" }),
});

// Schema for pekerjaan
const dataPekerjaanItemSchema = z.object({
  jenisPekerjaan: z.string().min(1, { message: "Jenis pekerjaan harus diisi" }),
  jumlah: z
    .number()
    .int()
    .min(0, { message: "Jumlah harus berupa angka positif" }),
});

// Schema for wajib pilih
const dataWajibPilihItemSchema = z.object({
  tahunPilih: z
    .number()
    .int()
    .min(2000, { message: "Tahun harus valid" })
    .max(2100, { message: "Tahun harus valid" }),
  jumlah: z
    .number()
    .int()
    .min(0, { message: "Jumlah harus berupa angka positif" }),
});

// Schema for perkawinan
const dataPerkawinanItemSchema = z.object({
  statusPerkawinan: z
    .string()
    .min(1, { message: "Status perkawinan harus diisi" }),
  jumlah: z
    .number()
    .int()
    .min(0, { message: "Jumlah harus berupa angka positif" }),
});

// Schema for agama
const dataAgamaItemSchema = z.object({
  namaAgama: z.string().min(1, { message: "Nama agama harus diisi" }),
  jumlah: z
    .number()
    .int()
    .min(0, { message: "Jumlah harus berupa angka positif" }),
});

// Schema for creating a new demografi
export const createDemografiSchema = z.object({
  tahun: z
    .number()
    .int()
    .min(2000, { message: "Tahun harus valid" })
    .max(2100, { message: "Tahun harus valid" }),
  dataGlobal: dataGlobalSchema,
  dataKelompokDusun: z
    .array(dataKelompokDusunItemSchema)
    .min(1, { message: "Minimal harus ada 1 kelompok dusun" }),
  dataDusun: z
    .array(dataDusunItemSchema)
    .min(1, { message: "Minimal harus ada 1 dusun" }),
  dataPendidikan: z
    .array(dataPendidikanItemSchema)
    .min(1, { message: "Minimal harus ada 1 tingkat pendidikan" }),
  dataPekerjaan: z
    .array(dataPekerjaanItemSchema)
    .min(1, { message: "Minimal harus ada 1 jenis pekerjaan" }),
  dataWajibPilih: z.array(dataWajibPilihItemSchema),
  dataPerkawinan: z
    .array(dataPerkawinanItemSchema)
    .min(1, { message: "Minimal harus ada 1 status perkawinan" }),
  dataAgama: z
    .array(dataAgamaItemSchema)
    .min(1, { message: "Minimal harus ada 1 agama" }),
});

// Schema for updating an existing demografi
export const updateDemografiSchema = createDemografiSchema.partial();

// Schema for demografi response from Firestore
export const demografiSchema = z.object({
  id: z.string(),
  tahun: z.number(),
  lastUpdated: z.any(),
  dataGlobal: dataGlobalSchema,
  dataKelompokDusun: z.array(dataKelompokDusunItemSchema),
  dataDusun: z.array(dataDusunItemSchema),
  dataPendidikan: z.array(dataPendidikanItemSchema),
  dataPekerjaan: z.array(dataPekerjaanItemSchema),
  dataWajibPilih: z.array(dataWajibPilihItemSchema),
  dataPerkawinan: z.array(dataPerkawinanItemSchema),
  dataAgama: z.array(dataAgamaItemSchema),
});

// Type definitions based on schemas
export type CreateDemografiInput = z.infer<typeof createDemografiSchema>;
export type UpdateDemografiInput = z.infer<typeof updateDemografiSchema>;
export type Demografi = z.infer<typeof demografiSchema>;

// Helper types for form arrays
export type DataKelompokDusunItem = z.infer<typeof dataKelompokDusunItemSchema>;
export type DataDusunItem = z.infer<typeof dataDusunItemSchema>;
export type DataPendidikanItem = z.infer<typeof dataPendidikanItemSchema>;
export type DataPekerjaanItem = z.infer<typeof dataPekerjaanItemSchema>;
export type DataWajibPilihItem = z.infer<typeof dataWajibPilihItemSchema>;
export type DataPerkawinanItem = z.infer<typeof dataPerkawinanItemSchema>;
export type DataAgamaItem = z.infer<typeof dataAgamaItemSchema>;
