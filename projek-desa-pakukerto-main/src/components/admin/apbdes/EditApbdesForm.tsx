import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateApbdesSchema,
  UpdateApbdesInput,
  Apbdes,
  CreateApbdesInput,
} from "@/schemas/apbdes.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { formatRupiah, parseRupiah } from "@/utils/currency";
import { PlusCircle, Trash2 } from "lucide-react";

interface EditApbdesFormProps {
  initialData: Apbdes;
  onSubmit: (data: CreateApbdesInput) => void;
  isSubmitting: boolean;
}

export function EditApbdesForm({
  initialData,
  onSubmit,
  isSubmitting,
}: EditApbdesFormProps) {
  const [totalPendapatan, setTotalPendapatan] = useState(0);
  const [totalBelanja, setTotalBelanja] = useState(0);
  const [totalPenerimaanPembiayaan, setTotalPenerimaanPembiayaan] = useState(0);
  const [totalPengeluaranPembiayaan, setTotalPengeluaranPembiayaan] =
    useState(0);
  const [surplus, setSurplus] = useState(0);

  // Form setup with React Hook Form and Zod validation
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateApbdesInput>({
    resolver: zodResolver(updateApbdesSchema),
    defaultValues: {
      tahun: initialData.tahun,
      ringkasan: initialData.ringkasan,
      pendapatan: initialData.pendapatan,
      belanja: initialData.belanja,
      pembiayaan: initialData.pembiayaan,
    },
  });

  // Field arrays for dynamic sections
  const {
    fields: pendapatanFields,
    append: appendPendapatan,
    remove: removePendapatan,
  } = useFieldArray({
    control,
    name: "pendapatan.rincian",
  });

  const {
    fields: belanjaFields,
    append: appendBelanja,
    remove: removeBelanja,
  } = useFieldArray({
    control,
    name: "belanja.rincian",
  });

  const {
    fields: penerimaanFields,
    append: appendPenerimaan,
    remove: removePenerimaan,
  } = useFieldArray({
    control,
    name: "pembiayaan.penerimaan.rincian",
  });

  const {
    fields: pengeluaranFields,
    append: appendPengeluaran,
    remove: removePengeluaran,
  } = useFieldArray({
    control,
    name: "pembiayaan.pengeluaran.rincian",
  });

  // Watch for changes to calculate totals
  const watchPendapatan = watch("pendapatan.rincian");
  const watchBelanja = watch("belanja.rincian");
  const watchPenerimaanPembiayaan = watch("pembiayaan.penerimaan.rincian");
  const watchPengeluaranPembiayaan = watch("pembiayaan.pengeluaran.rincian");

  // Calculate totals for UI display only (actual calculations happen at submission)
  useEffect(() => {
    // Calculate total pendapatan for display
    const pendapatanTotal =
      watchPendapatan?.reduce((acc, rincian) => {
        const rincianTotal =
          rincian?.subRincian?.reduce(
            (subAcc, sub) => subAcc + (sub?.jumlah || 0),
            0
          ) || 0;
        return acc + rincianTotal;
      }, 0) || 0;

    setTotalPendapatan(pendapatanTotal);

    // Calculate total belanja for display
    const belanjaTotal =
      watchBelanja?.reduce((acc, rincian) => {
        const rincianTotal =
          rincian?.subRincian?.reduce(
            (subAcc, sub) => subAcc + (sub?.jumlah || 0),
            0
          ) || 0;
        return acc + rincianTotal;
      }, 0) || 0;

    setTotalBelanja(belanjaTotal);

    // Calculate total penerimaan pembiayaan for display
    const penerimaanTotal =
      watchPenerimaanPembiayaan?.reduce((acc, rincian) => {
        return acc + (rincian?.jumlah || 0);
      }, 0) || 0;

    setTotalPenerimaanPembiayaan(penerimaanTotal);

    // Calculate total pengeluaran pembiayaan for display
    const pengeluaranTotal =
      watchPengeluaranPembiayaan?.reduce((acc, rincian) => {
        return acc + (rincian?.jumlah || 0);
      }, 0) || 0;

    setTotalPengeluaranPembiayaan(pengeluaranTotal);

    // Calculate surplus for display
    const calculatedSurplus =
      pendapatanTotal + penerimaanTotal - belanjaTotal - pengeluaranTotal;
    setSurplus(calculatedSurplus);
  }, [
    watchPendapatan,
    watchBelanja,
    watchPenerimaanPembiayaan,
    watchPengeluaranPembiayaan,
  ]);

  const handleFormSubmit = (data: UpdateApbdesInput) => {
    // Get the current form values
    const currentFormData = watch();
    
    // Calculate all totals fresh at submission time to ensure accuracy
    const pendapatanData = currentFormData.pendapatan || initialData.pendapatan;
    const belanjaData = currentFormData.belanja || initialData.belanja;
    const pembiayaanData = currentFormData.pembiayaan || initialData.pembiayaan;
    
    // Calculate pendapatan totals
    const calculatedPendapatan = {
      ...pendapatanData,
      rincian: pendapatanData.rincian.map(rincian => {
        const rincianTotal = rincian.subRincian.reduce(
          (sum, sub) => sum + (sub.jumlah || 0), 0
        );
        return {
          ...rincian,
          jumlah: rincianTotal
        };
      })
    };
    
    const totalPendapatan = calculatedPendapatan.rincian.reduce(
      (sum, rincian) => sum + rincian.jumlah, 0
    );
    calculatedPendapatan.total = totalPendapatan;
    
    // Calculate belanja totals
    const calculatedBelanja = {
      ...belanjaData,
      rincian: belanjaData.rincian.map(rincian => {
        const rincianTotal = rincian.subRincian.reduce(
          (sum, sub) => sum + (sub.jumlah || 0), 0
        );
        return {
          ...rincian,
          jumlah: rincianTotal
        };
      })
    };
    
    const totalBelanja = calculatedBelanja.rincian.reduce(
      (sum, rincian) => sum + rincian.jumlah, 0
    );
    calculatedBelanja.total = totalBelanja;
    
    // Calculate pembiayaan totals
    const totalPenerimaan = pembiayaanData.penerimaan.rincian.reduce(
      (sum, rincian) => sum + (rincian.jumlah || 0), 0
    );
    const totalPengeluaran = pembiayaanData.pengeluaran.rincian.reduce(
      (sum, rincian) => sum + (rincian.jumlah || 0), 0
    );
    
    const calculatedPembiayaan = {
      penerimaan: {
        ...pembiayaanData.penerimaan,
        total: totalPenerimaan
      },
      pengeluaran: {
        ...pembiayaanData.pengeluaran,
        total: totalPengeluaran
      },
      surplus: totalPendapatan + totalPenerimaan - totalBelanja - totalPengeluaran
    };
    
    // Calculate ringkasan
    const calculatedRingkasan = {
      totalPendapatan,
      totalBelanja,
      totalPembiayaan: {
        penerimaan: totalPenerimaan,
        pengeluaran: totalPengeluaran
      },
      surplus: totalPendapatan + totalPenerimaan - totalBelanja - totalPengeluaran
    };
    
    // Create complete data with all calculations
    const completeData: CreateApbdesInput = {
      tahun: currentFormData.tahun || initialData.tahun,
      ringkasan: calculatedRingkasan,
      pendapatan: calculatedPendapatan,
      belanja: calculatedBelanja,
      pembiayaan: calculatedPembiayaan,
    };
    
    onSubmit(completeData);
  };

  // Helper function to add new sub-rincian
  const addSubRincian = (
    sectionName: "pendapatan" | "belanja",
    rincianIndex: number
  ) => {
    const currentSubRincian =
      watch(`${sectionName}.rincian.${rincianIndex}.subRincian`) || [];
    setValue(`${sectionName}.rincian.${rincianIndex}.subRincian`, [
      ...currentSubRincian,
      { uraian: "", jumlah: 0 },
    ]);
  };

  // Helper function to remove sub-rincian
  const removeSubRincian = (
    sectionName: "pendapatan" | "belanja",
    rincianIndex: number,
    subIndex: number
  ) => {
    const currentSubRincian =
      watch(`${sectionName}.rincian.${rincianIndex}.subRincian`) || [];
    const newSubRincian = currentSubRincian.filter(
      (_, index) => index !== subIndex
    );
    setValue(
      `${sectionName}.rincian.${rincianIndex}.subRincian`,
      newSubRincian
    );
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Tahun Input */}
      <div className="grid gap-2">
        <Label htmlFor="tahun">Tahun Anggaran</Label>
        <Controller
          name="tahun"
          control={control}
          render={({ field }) => (
            <Input
              id="tahun"
              type="number"
              placeholder="Masukkan tahun anggaran"
              {...field}
              value={field.value || ""}
              onChange={(e) => field.onChange(parseInt(e.target.value) || "")}
              className="max-w-xs"
            />
          )}
        />
        {errors.tahun && (
          <p className="text-sm text-red-500">{errors.tahun.message}</p>
        )}
      </div>

      {/* Ringkasan Card */}
      <Card>
        <CardHeader>
          <CardTitle>Ringkasan APBDes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Total Pendapatan</Label>
                <div className="text-lg font-semibold mt-1">
                  {formatRupiah(totalPendapatan)}
                </div>
              </div>
              <div>
                <Label>Total Belanja</Label>
                <div className="text-lg font-semibold mt-1">
                  {formatRupiah(totalBelanja)}
                </div>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Total Pembiayaan - Penerimaan</Label>
                <div className="text-lg font-semibold mt-1">
                  {formatRupiah(totalPenerimaanPembiayaan)}
                </div>
              </div>
              <div>
                <Label>Total Pembiayaan - Pengeluaran</Label>
                <div className="text-lg font-semibold mt-1">
                  {formatRupiah(totalPengeluaranPembiayaan)}
                </div>
              </div>
            </div>
            <Separator />
            <div>
              <Label>Surplus/Defisit</Label>
              <div
                className={`text-xl font-bold mt-1 ${
                  surplus >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatRupiah(surplus)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pendapatan Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Pendapatan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {pendapatanFields.map((field, index) => (
            <Card key={field.id} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Label>Kategori Pendapatan {index + 1}</Label>
                  {pendapatanFields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removePendapatan(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <Controller
                  name={`pendapatan.rincian.${index}.kategori`}
                  control={control}
                  render={({ field }) => (
                    <Input placeholder="Nama kategori pendapatan" {...field} />
                  )}
                />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Sub Rincian</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addSubRincian("pendapatan", index)}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Tambah Sub Rincian
                  </Button>
                </div>

                {watch(`pendapatan.rincian.${index}.subRincian`)?.map(
                  (_, subIndex) => (
                    <div
                      key={subIndex}
                      className="grid grid-cols-12 gap-2 items-end"
                    >
                      <div className="col-span-6">
                        <Label>Uraian</Label>
                        <Controller
                          name={`pendapatan.rincian.${index}.subRincian.${subIndex}.uraian`}
                          control={control}
                          render={({ field }) => (
                            <Input placeholder="Uraian pendapatan" {...field} />
                          )}
                        />
                      </div>
                      <div className="col-span-5">
                        <Label>Jumlah (Rp)</Label>
                        <Controller
                          name={`pendapatan.rincian.${index}.subRincian.${subIndex}.jumlah`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              placeholder="Rp 0"
                              {...field}
                              value={
                                field.value
                                  ? formatRupiah(field.value, false)
                                  : ""
                              }
                              onChange={(e) =>
                                field.onChange(parseRupiah(e.target.value))
                              }
                            />
                          )}
                        />
                      </div>
                      <div className="col-span-1">
                        {(watch(`pendapatan.rincian.${index}.subRincian`) || [])
                          .length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              removeSubRincian("pendapatan", index, subIndex)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          ))}
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendPendapatan({
                  kategori: "",
                  jumlah: 0,
                  subRincian: [{ uraian: "", jumlah: 0 }],
                })
              }
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Tambah Rincian
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Belanja Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Belanja
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {belanjaFields.map((field, index) => (
            <Card key={field.id} className="border-l-4 border-l-red-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Label>Kategori Belanja {index + 1}</Label>
                  {belanjaFields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBelanja(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <Controller
                  name={`belanja.rincian.${index}.kategori`}
                  control={control}
                  render={({ field }) => (
                    <Input placeholder="Nama kategori belanja" {...field} />
                  )}
                />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Sub Rincian</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addSubRincian("belanja", index)}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Tambah Sub Rincian
                  </Button>
                </div>

                {watch(`belanja.rincian.${index}.subRincian`)?.map(
                  (_, subIndex) => (
                    <div
                      key={subIndex}
                      className="grid grid-cols-12 gap-2 items-end"
                    >
                      <div className="col-span-6">
                        <Label>Uraian</Label>
                        <Controller
                          name={`belanja.rincian.${index}.subRincian.${subIndex}.uraian`}
                          control={control}
                          render={({ field }) => (
                            <Input placeholder="Uraian belanja" {...field} />
                          )}
                        />
                      </div>
                      <div className="col-span-5">
                        <Label>Jumlah (Rp)</Label>
                        <Controller
                          name={`belanja.rincian.${index}.subRincian.${subIndex}.jumlah`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              placeholder="Rp 0"
                              {...field}
                              value={
                                field.value
                                  ? formatRupiah(field.value, false)
                                  : ""
                              }
                              onChange={(e) =>
                                field.onChange(parseRupiah(e.target.value))
                              }
                            />
                          )}
                        />
                      </div>
                      <div className="col-span-1">
                        {(watch(`belanja.rincian.${index}.subRincian`) || [])
                          .length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              removeSubRincian("belanja", index, subIndex)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          ))}
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendBelanja({
                  kategori: "",
                  jumlah: 0,
                  subRincian: [{ uraian: "", jumlah: 0 }],
                })
              }
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Tambah Rincian
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pembiayaan Section */}
      <Card>
        <CardHeader>
          <CardTitle>Pembiayaan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Penerimaan */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Penerimaan</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {penerimaanFields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-12 gap-2 items-end"
                >
                  <div className="col-span-6">
                    <Label>Kategori</Label>
                    <Controller
                      name={`pembiayaan.penerimaan.rincian.${index}.kategori`}
                      control={control}
                      render={({ field }) => (
                        <Input placeholder="Kategori penerimaan" {...field} />
                      )}
                    />
                  </div>
                  <div className="col-span-5">
                    <Label>Jumlah (Rp)</Label>
                    <Controller
                      name={`pembiayaan.penerimaan.rincian.${index}.jumlah`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          placeholder="Rp 0"
                          {...field}
                          value={
                            field.value ? formatRupiah(field.value, false) : ""
                          }
                          onChange={(e) =>
                            field.onChange(parseRupiah(e.target.value))
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="col-span-1">
                    {penerimaanFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removePenerimaan(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    appendPenerimaan({
                      kategori: "",
                      jumlah: 0,
                    })
                  }
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Tambah Rincian
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pengeluaran */}
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Pengeluaran</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {pengeluaranFields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-12 gap-2 items-end"
                >
                  <div className="col-span-6">
                    <Label>Kategori</Label>
                    <Controller
                      name={`pembiayaan.pengeluaran.rincian.${index}.kategori`}
                      control={control}
                      render={({ field }) => (
                        <Input placeholder="Kategori pengeluaran" {...field} />
                      )}
                    />
                  </div>
                  <div className="col-span-5">
                    <Label>Jumlah (Rp)</Label>
                    <Controller
                      name={`pembiayaan.pengeluaran.rincian.${index}.jumlah`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          placeholder="Rp 0"
                          {...field}
                          value={
                            field.value ? formatRupiah(field.value, false) : ""
                          }
                          onChange={(e) =>
                            field.onChange(parseRupiah(e.target.value))
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="col-span-1">
                    {pengeluaranFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removePengeluaran(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    appendPengeluaran({
                      kategori: "",
                      jumlah: 0,
                    })
                  }
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Tambah Rincian
                </Button>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} className="min-w-32">
          {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
    </form>
  );
}
