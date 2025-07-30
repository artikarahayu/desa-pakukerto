import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createApbdesSchema, CreateApbdesInput } from "@/schemas/apbdes.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { formatRupiah } from "@/utils/currency";
import { RincianSection } from "./RincianSection";
import { PembiayaanSection } from "./PembiayaanSection";

interface ApbdesFormProps {
  initialData?: any;
  onSubmit: (data: CreateApbdesInput) => void;
  isSubmitting: boolean;
}

export function ApbdesForm({
  initialData,
  onSubmit,
  isSubmitting,
}: ApbdesFormProps) {
  const [totalPendapatan, setTotalPendapatan] = useState(0);
  const [totalBelanja, setTotalBelanja] = useState(0);
  const [totalPenerimaanPembiayaan, setTotalPenerimaanPembiayaan] = useState(0);
  const [totalPengeluaranPembiayaan, setTotalPengeluaranPembiayaan] =
    useState(0);
  const [surplus, setSurplus] = useState(0);

  // Default values for new APBDes
  const defaultValues: CreateApbdesInput = {
    tahun: new Date().getFullYear(),
    ringkasan: {
      totalPendapatan: 0,
      totalBelanja: 0,
      totalPembiayaan: {
        penerimaan: 0,
        pengeluaran: 0,
      },
      surplus: 0,
    },
    pendapatan: {
      total: 0,
      rincian: [
        {
          kategori: "Pendapatan Asli Desa",
          jumlah: 0,
          subRincian: [
            {
              uraian: "Hasil Usaha",
              jumlah: 0,
            },
          ],
        },
      ],
    },
    belanja: {
      total: 0,
      rincian: [
        {
          kategori: "Bidang Penyelenggaraan Pemerintahan Desa",
          jumlah: 0,
          subRincian: [
            {
              uraian:
                "Penyelenggaraan Belanja Siltap, Tunjangan dan Operasional Pemerintahan Desa",
              jumlah: 0,
            },
          ],
        },
      ],
    },
    pembiayaan: {
      penerimaan: {
        total: 0,
        rincian: [
          {
            kategori: "SILPA Tahun Sebelumnya",
            jumlah: 0,
          },
        ],
      },
      pengeluaran: {
        total: 0,
        rincian: [
          {
            kategori: "Penyertaan Modal Desa",
            jumlah: 0,
          },
        ],
      },
      surplus: 0,
    },
  };

  // Form setup with React Hook Form and Zod validation
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateApbdesInput>({
    resolver: zodResolver(createApbdesSchema),
    defaultValues: initialData || defaultValues,
  });

  // Watch for changes to calculate totals
  const watchPendapatan = watch("pendapatan.rincian");
  const watchBelanja = watch("belanja.rincian");
  const watchPenerimaanPembiayaan = watch("pembiayaan.penerimaan.rincian");
  const watchPengeluaranPembiayaan = watch("pembiayaan.pengeluaran.rincian");

  // Calculate totals when form values change
  useEffect(() => {
    // Calculate total pendapatan
    const pendapatanTotal =
      watchPendapatan?.reduce((acc, rincian) => {
        const rincianTotal = rincian.subRincian.reduce(
          (subAcc, sub) => subAcc + (sub.jumlah || 0),
          0
        );
        return acc + rincianTotal;
      }, 0) || 0;

    setTotalPendapatan(pendapatanTotal);
    setValue("pendapatan.total", pendapatanTotal);
    setValue("ringkasan.totalPendapatan", pendapatanTotal);

    // Calculate total belanja
    const belanjaTotal =
      watchBelanja?.reduce((acc, rincian) => {
        const rincianTotal = rincian.subRincian.reduce(
          (subAcc, sub) => subAcc + (sub.jumlah || 0),
          0
        );
        return acc + rincianTotal;
      }, 0) || 0;

    setTotalBelanja(belanjaTotal);
    setValue("belanja.total", belanjaTotal);
    setValue("ringkasan.totalBelanja", belanjaTotal);

    // Calculate total penerimaan pembiayaan
    const penerimaanTotal =
      watchPenerimaanPembiayaan?.reduce((acc, rincian) => {
        return acc + (rincian.jumlah || 0);
      }, 0) || 0;

    setTotalPenerimaanPembiayaan(penerimaanTotal);
    setValue("pembiayaan.penerimaan.total", penerimaanTotal);
    setValue("ringkasan.totalPembiayaan.penerimaan", penerimaanTotal);

    // Calculate total pengeluaran pembiayaan
    const pengeluaranTotal =
      watchPengeluaranPembiayaan?.reduce((acc, rincian) => {
        return acc + (rincian.jumlah || 0);
      }, 0) || 0;

    setTotalPengeluaranPembiayaan(pengeluaranTotal);
    setValue("pembiayaan.pengeluaran.total", pengeluaranTotal);
    setValue("ringkasan.totalPembiayaan.pengeluaran", pengeluaranTotal);

    // Calculate surplus/defisit
    const calculatedSurplus =
      pendapatanTotal - belanjaTotal + penerimaanTotal - pengeluaranTotal;
    setSurplus(calculatedSurplus);
    setValue("ringkasan.surplus", calculatedSurplus);
  }, [
    watchPendapatan,
    watchBelanja,
    watchPenerimaanPembiayaan,
    watchPengeluaranPembiayaan,
    setValue,
  ]);

  // Submit handler
  const handleFormSubmit = (data: CreateApbdesInput) => {
    onSubmit(data);
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
      <RincianSection
        title="Pendapatan"
        control={control}
        setValue={setValue}
        errors={errors}
        sectionName="pendapatan"
      />

      {/* Belanja Section */}
      <RincianSection
        title="Belanja"
        control={control}
        setValue={setValue}
        errors={errors}
        sectionName="belanja"
      />

      {/* Pembiayaan Section */}
      <PembiayaanSection
        control={control}
        setValue={setValue}
        errors={errors}
      />

      {/* Submit Button */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" disabled={isSubmitting}>
          Batal
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </form>
  );
}
