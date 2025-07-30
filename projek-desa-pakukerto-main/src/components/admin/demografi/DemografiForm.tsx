import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createDemografiSchema,
  CreateDemografiInput,
} from "@/schemas/demografi.schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";

interface DemografiFormProps {
  initialData?: CreateDemografiInput;
  onSubmit: (data: CreateDemografiInput) => void;
  isSubmitting: boolean;
}

export default function DemografiForm({
  initialData,
  onSubmit,
  isSubmitting,
}: DemografiFormProps) {
  const [isMounted, setIsMounted] = useState(false);

  // Default values for empty arrays
  const defaultKelompokUmur = [
    { kelompokUmur: "0-5 tahun", lakiLaki: 0, perempuan: 0, total: 0 },
  ];
  const defaultDusun = [{ namaDusun: "", jumlah: 0 }];
  const defaultPendidikan = [{ tingkatPendidikan: "", jumlah: 0 }];
  const defaultPekerjaan = [{ jenisPekerjaan: "", jumlah: 0 }];
  const defaultWajibPilih = [
    { tahunPilih: new Date().getFullYear(), jumlah: 0 },
  ];
  const defaultPerkawinan = [{ statusPerkawinan: "", jumlah: 0 }];
  const defaultAgama = [{ namaAgama: "", jumlah: 0 }];

  // React Hook Form with Zod validation
  const form = useForm<CreateDemografiInput>({
    resolver: zodResolver(createDemografiSchema),
    defaultValues: initialData || {
      tahun: new Date().getFullYear(),
      dataGlobal: {
        totalPenduduk: 0,
        jumlahKepalaKeluarga: 0,
        jumlahLakiLaki: 0,
        jumlahPerempuan: 0,
      },
      dataKelompokDusun: defaultKelompokUmur,
      dataDusun: defaultDusun,
      dataPendidikan: defaultPendidikan,
      dataPekerjaan: defaultPekerjaan,
      dataWajibPilih: defaultWajibPilih,
      dataPerkawinan: defaultPerkawinan,
      dataAgama: defaultAgama,
    },
  });

  // Field arrays for dynamic fields
  const kelompokDusunrray = useFieldArray({
    control: form.control,
    name: "dataKelompokDusun",
  });

  const dusunArray = useFieldArray({
    control: form.control,
    name: "dataDusun",
  });

  const pendidikanArray = useFieldArray({
    control: form.control,
    name: "dataPendidikan",
  });

  const pekerjaanArray = useFieldArray({
    control: form.control,
    name: "dataPekerjaan",
  });

  const wajibPilihArray = useFieldArray({
    control: form.control,
    name: "dataWajibPilih",
  });

  const perkawinanArray = useFieldArray({
    control: form.control,
    name: "dataPerkawinan",
  });

  const agamaArray = useFieldArray({
    control: form.control,
    name: "dataAgama",
  });

  // Set isMounted to true on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate total for dusun by jenis kelamin
  const calculateTotal = (index: number) => {
    const lakiLaki = form.watch(`dataKelompokDusun.${index}.lakiLaki`) || 0;
    const perempuan = form.watch(`dataKelompokDusun.${index}.perempuan`) || 0;
    const total = lakiLaki + perempuan;

    form.setValue(`dataKelompokDusun.${index}.total`, total);
  };

  // Handle form submission
  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });

  // Don't render form on server side
  if (!isMounted) {
    return null;
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Tahun */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Informasi Dasar</h3>
          <FormField
            control={form.control}
            name="tahun"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tahun Data</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Masukkan tahun"
                    disabled={isSubmitting}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    onWheel={(e) => {
                      e.currentTarget.blur();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        {/* Data Global */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Data Global</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="dataGlobal.totalPenduduk"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Penduduk</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Masukkan total penduduk"
                      disabled={isSubmitting}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      onWheel={(e) => {
                        e.currentTarget.blur();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dataGlobal.jumlahKepalaKeluarga"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah Kepala Keluarga</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Masukkan jumlah kepala keluarga"
                      disabled={isSubmitting}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      onWheel={(e) => {
                        e.currentTarget.blur();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dataGlobal.jumlahLakiLaki"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah Laki-laki</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Masukkan jumlah laki-laki"
                      disabled={isSubmitting}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      onWheel={(e) => {
                        e.currentTarget.blur();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dataGlobal.jumlahPerempuan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah Perempuan</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Masukkan jumlah perempuan"
                      disabled={isSubmitting}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      onWheel={(e) => {
                        e.currentTarget.blur();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Data Jenis Kelamin Dusun */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Data Jenis Kelamin Dusun</h3>
          <div className="space-y-4">
            {kelompokDusunrray.fields.map((field, index) => (
              <Card key={field.id}>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name={`dataKelompokDusun.${index}.kelompokDusun`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Dusun</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Contoh: Mojolengko"
                              disabled={isSubmitting}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`dataKelompokDusun.${index}.lakiLaki`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Laki-laki</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Jumlah laki-laki"
                              disabled={isSubmitting}
                              {...field}
                              onChange={(e) => {
                                field.onChange(parseInt(e.target.value));
                                calculateTotal(index);
                              }}
                              onWheel={(e) => {
                                e.currentTarget.blur();
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`dataKelompokDusun.${index}.perempuan`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Perempuan</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Jumlah perempuan"
                              disabled={isSubmitting}
                              {...field}
                              onChange={(e) => {
                                field.onChange(parseInt(e.target.value));
                                calculateTotal(index);
                              }}
                              onWheel={(e) => {
                                e.currentTarget.blur();
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`dataKelompokDusun.${index}.total`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Total"
                              disabled={true}
                              {...field}
                              onWheel={(e) => {
                                e.currentTarget.blur();
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => kelompokDusunrray.remove(index)}
                      disabled={
                        kelompokDusunrray.fields.length <= 1 || isSubmitting
                      }
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Hapus
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                kelompokDusunrray.append({
                  kelompokDusun: "",
                  lakiLaki: 0,
                  perempuan: 0,
                  total: 0,
                })
              }
              disabled={isSubmitting}
            >
              <Plus className="h-4 w-4 mr-1" /> Tambah Kelompok Umur
            </Button>
          </div>
        </div>

        <Separator />

        {/* Data Dusun */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Data Jumlah Penduduk Dusun</h3>
          <div className="space-y-4">
            {dusunArray.fields.map((field, index) => (
              <Card key={field.id}>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`dataDusun.${index}.namaDusun`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Dusun</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Masukkan nama dusun"
                              disabled={isSubmitting}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`dataDusun.${index}.jumlah`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jumlah Penduduk</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Masukkan jumlah penduduk"
                              disabled={isSubmitting}
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
                              }
                              onWheel={(e) => {
                                e.currentTarget.blur();
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => dusunArray.remove(index)}
                      disabled={dusunArray.fields.length <= 1 || isSubmitting}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Hapus
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => dusunArray.append({ namaDusun: "", jumlah: 0 })}
              disabled={isSubmitting}
            >
              <Plus className="h-4 w-4 mr-1" /> Tambah Dusun
            </Button>
          </div>
        </div>

        <Separator />

        {/* Data Pendidikan */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Data Pendidikan</h3>
          <div className="space-y-4">
            {pendidikanArray.fields.map((field, index) => (
              <Card key={field.id}>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`dataPendidikan.${index}.tingkatPendidikan`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tingkat Pendidikan</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Contoh: SD, SMP, SMA, dll"
                              disabled={isSubmitting}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`dataPendidikan.${index}.jumlah`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jumlah</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Masukkan jumlah"
                              disabled={isSubmitting}
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
                              }
                              onWheel={(e) => {
                                e.currentTarget.blur();
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => pendidikanArray.remove(index)}
                      disabled={
                        pendidikanArray.fields.length <= 1 || isSubmitting
                      }
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Hapus
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                pendidikanArray.append({ tingkatPendidikan: "", jumlah: 0 })
              }
              disabled={isSubmitting}
            >
              <Plus className="h-4 w-4 mr-1" /> Tambah Tingkat Pendidikan
            </Button>
          </div>
        </div>

        <Separator />

        {/* Data Pekerjaan */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Data Pekerjaan</h3>
          <div className="space-y-4">
            {pekerjaanArray.fields.map((field, index) => (
              <Card key={field.id}>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`dataPekerjaan.${index}.jenisPekerjaan`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jenis Pekerjaan</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Contoh: Petani, Guru, dll"
                              disabled={isSubmitting}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`dataPekerjaan.${index}.jumlah`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jumlah</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Masukkan jumlah"
                              disabled={isSubmitting}
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
                              }
                              onWheel={(e) => {
                                e.currentTarget.blur();
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => pekerjaanArray.remove(index)}
                      disabled={
                        pekerjaanArray.fields.length <= 1 || isSubmitting
                      }
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Hapus
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                pekerjaanArray.append({ jenisPekerjaan: "", jumlah: 0 })
              }
              disabled={isSubmitting}
            >
              <Plus className="h-4 w-4 mr-1" /> Tambah Jenis Pekerjaan
            </Button>
          </div>
        </div>

        <Separator />

        {/* Data Wajib Pilih */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Data Wajib Pilih</h3>
          <div className="space-y-4">
            {wajibPilihArray.fields.map((field, index) => (
              <Card key={field.id}>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`dataWajibPilih.${index}.tahunPilih`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tahun Pemilihan</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Masukkan tahun pemilihan"
                              disabled={isSubmitting}
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
                              }
                              onWheel={(e) => {
                                e.currentTarget.blur();
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`dataWajibPilih.${index}.jumlah`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jumlah Wajib Pilih</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Masukkan jumlah wajib pilih"
                              disabled={isSubmitting}
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
                              }
                              onWheel={(e) => {
                                e.currentTarget.blur();
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => wajibPilihArray.remove(index)}
                      disabled={
                        wajibPilihArray.fields.length <= 1 || isSubmitting
                      }
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Hapus
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                wajibPilihArray.append({
                  tahunPilih: new Date().getFullYear(),
                  jumlah: 0,
                })
              }
              disabled={isSubmitting}
            >
              <Plus className="h-4 w-4 mr-1" /> Tambah Data Wajib Pilih
            </Button>
          </div>
        </div>

        <Separator />

        {/* Data Perkawinan */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Data Status Perkawinan</h3>
          <div className="space-y-4">
            {perkawinanArray.fields.map((field, index) => (
              <Card key={field.id}>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`dataPerkawinan.${index}.statusPerkawinan`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status Perkawinan</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Contoh: Kawin, Belum Kawin, dll"
                              disabled={isSubmitting}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`dataPerkawinan.${index}.jumlah`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jumlah</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Masukkan jumlah"
                              disabled={isSubmitting}
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
                              }
                              onWheel={(e) => {
                                e.currentTarget.blur();
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => perkawinanArray.remove(index)}
                      disabled={
                        perkawinanArray.fields.length <= 1 || isSubmitting
                      }
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Hapus
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                perkawinanArray.append({ statusPerkawinan: "", jumlah: 0 })
              }
              disabled={isSubmitting}
            >
              <Plus className="h-4 w-4 mr-1" /> Tambah Status Perkawinan
            </Button>
          </div>
        </div>

        <Separator />

        {/* Data Agama */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Data Agama</h3>
          <div className="space-y-4">
            {agamaArray.fields.map((field, index) => (
              <Card key={field.id}>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`dataAgama.${index}.namaAgama`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Agama</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Contoh: Islam, Kristen, dll"
                              disabled={isSubmitting}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`dataAgama.${index}.jumlah`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jumlah</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Masukkan jumlah"
                              disabled={isSubmitting}
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
                              }
                              onWheel={(e) => {
                                e.currentTarget.blur();
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => agamaArray.remove(index)}
                      disabled={agamaArray.fields.length <= 1 || isSubmitting}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Hapus
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => agamaArray.append({ namaAgama: "", jumlah: 0 })}
              disabled={isSubmitting}
            >
              <Plus className="h-4 w-4 mr-1" /> Tambah Agama
            </Button>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan Data"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
