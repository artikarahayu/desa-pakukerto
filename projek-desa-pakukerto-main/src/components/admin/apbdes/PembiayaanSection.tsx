import { Control, Controller, UseFormSetValue } from "react-hook-form";
import {
  CreateApbdesInput,
  PembiayaanRincianItem,
} from "@/schemas/apbdes.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { formatRupiah, parseRupiah } from "@/utils/currency";
import { PlusCircle, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

interface PembiayaanSectionProps {
  control: Control<CreateApbdesInput>;
  setValue: UseFormSetValue<CreateApbdesInput>;
  errors: any;
}

// Using the type from schema
type RincianItemProps = PembiayaanRincianItem;

interface PembiayaanDataProps {
  penerimaan: {
    rincian: RincianItemProps[];
    total: number;
  };
  pengeluaran: {
    rincian: RincianItemProps[];
    total: number;
  };
  surplus: number;
}

export function PembiayaanSection({
  control,
  setValue,
}: PembiayaanSectionProps) {
  // Local state for managing pembiayaan items
  const [pembiayaanData, setPembiayaanData] = useState<PembiayaanDataProps>({
    penerimaan: {
      rincian: [
        {
          kategori: "",
          jumlah: 0,
          id: crypto.randomUUID(),
        },
      ],
      total: 0,
    },
    pengeluaran: {
      rincian: [
        {
          kategori: "",
          jumlah: 0,
          id: crypto.randomUUID(),
        },
      ],
      total: 0,
    },
    surplus: 0,
  });

  // Initialize from form values if they exist
  useEffect(() => {
    // Get the current form values for pembiayaan
    const currentPenerimaan =
      control._formValues?.pembiayaan?.penerimaan?.rincian;
    const currentPengeluaran =
      control._formValues?.pembiayaan?.pengeluaran?.rincian;

    if (
      (currentPenerimaan && currentPenerimaan.length > 0) ||
      (currentPengeluaran && currentPengeluaran.length > 0)
    ) {
      setPembiayaanData((prev) => ({
        penerimaan: {
          rincian:
            currentPenerimaan?.length > 0
              ? currentPenerimaan
              : prev.penerimaan.rincian,
          total: prev.penerimaan.total,
        },
        pengeluaran: {
          rincian:
            currentPengeluaran?.length > 0
              ? currentPengeluaran
              : prev.pengeluaran.rincian,
          total: prev.pengeluaran.total,
        },
        surplus: prev.surplus,
      }));
    }
  }, [control._formValues]);

  // Update form values when local state changes
  useEffect(() => {
    // Calculate totals
    const penerimaanTotal = pembiayaanData.penerimaan.rincian.reduce(
      (total, item) => total + (item.jumlah || 0),
      0
    );

    const pengeluaranTotal = pembiayaanData.pengeluaran.rincian.reduce(
      (total, item) => total + (item.jumlah || 0),
      0
    );

    const surplus = penerimaanTotal - pengeluaranTotal;

    // Update local state with calculated totals
    setPembiayaanData((prev) => ({
      ...prev,
      penerimaan: {
        ...prev.penerimaan,
        total: penerimaanTotal,
      },
      pengeluaran: {
        ...prev.pengeluaran,
        total: pengeluaranTotal,
      },
      surplus,
    }));

    // Update form values
    setValue(
      "pembiayaan.penerimaan.rincian",
      pembiayaanData.penerimaan.rincian
    );
    setValue("pembiayaan.penerimaan.total", penerimaanTotal);
    setValue(
      "pembiayaan.pengeluaran.rincian",
      pembiayaanData.pengeluaran.rincian
    );
    setValue("pembiayaan.pengeluaran.total", pengeluaranTotal);
    // Use the correct path for surplus that matches the schema
    setValue("pembiayaan.surplus", surplus);
  }, [
    pembiayaanData.penerimaan.rincian,
    pembiayaanData.pengeluaran.rincian,
    setValue,
  ]);

  // Penerimaan handlers
  const addPenerimaanItem = () => {
    setPembiayaanData((prev) => ({
      ...prev,
      penerimaan: {
        ...prev.penerimaan,
        rincian: [
          ...prev.penerimaan.rincian,
          {
            kategori: "",
            jumlah: 0,
            id: crypto.randomUUID(),
          },
        ],
      },
    }));
  };

  const removePenerimaanItem = (index: number) => {
    setPembiayaanData((prev) => ({
      ...prev,
      penerimaan: {
        ...prev.penerimaan,
        rincian: prev.penerimaan.rincian.filter((_, i) => i !== index),
      },
    }));
  };

  const updatePenerimaanKategori = (index: number, value: string) => {
    setPembiayaanData((prev) => ({
      ...prev,
      penerimaan: {
        ...prev.penerimaan,
        rincian: prev.penerimaan.rincian.map((item, i) =>
          i === index ? { ...item, kategori: value } : item
        ),
      },
    }));
  };

  const updatePenerimaanJumlah = (index: number, value: string) => {
    const numericValue = parseRupiah(value);
    setPembiayaanData((prev) => ({
      ...prev,
      penerimaan: {
        ...prev.penerimaan,
        rincian: prev.penerimaan.rincian.map((item, i) =>
          i === index ? { ...item, jumlah: numericValue } : item
        ),
      },
    }));
  };

  // Pengeluaran handlers
  const addPengeluaranItem = () => {
    setPembiayaanData((prev) => ({
      ...prev,
      pengeluaran: {
        ...prev.pengeluaran,
        rincian: [
          ...prev.pengeluaran.rincian,
          {
            kategori: "",
            jumlah: 0,
            id: crypto.randomUUID(),
          },
        ],
      },
    }));
  };

  const removePengeluaranItem = (index: number) => {
    setPembiayaanData((prev) => ({
      ...prev,
      pengeluaran: {
        ...prev.pengeluaran,
        rincian: prev.pengeluaran.rincian.filter((_, i) => i !== index),
      },
    }));
  };

  const updatePengeluaranKategori = (index: number, value: string) => {
    setPembiayaanData((prev) => ({
      ...prev,
      pengeluaran: {
        ...prev.pengeluaran,
        rincian: prev.pengeluaran.rincian.map((item, i) =>
          i === index ? { ...item, kategori: value } : item
        ),
      },
    }));
  };

  const updatePengeluaranJumlah = (index: number, value: string) => {
    const numericValue = parseRupiah(value);
    setPembiayaanData((prev) => ({
      ...prev,
      pengeluaran: {
        ...prev.pengeluaran,
        rincian: prev.pengeluaran.rincian.map((item, i) =>
          i === index ? { ...item, jumlah: numericValue } : item
        ),
      },
    }));
  };

  return (
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
            {pembiayaanData.penerimaan.rincian.map((item, index) => (
              <div
                key={item.id || index}
                className="grid grid-cols-12 gap-2 items-end"
              >
                <div className="col-span-6">
                  <Label>Kategori</Label>
                  <Input
                    placeholder="Kategori penerimaan"
                    value={item.kategori}
                    onChange={(e) =>
                      updatePenerimaanKategori(index, e.target.value)
                    }
                  />
                </div>
                <div className="col-span-5">
                  <Label>Jumlah (Rp)</Label>
                  <Input
                    placeholder="Rp 0"
                    value={formatRupiah(item.jumlah, false)}
                    onChange={(e) =>
                      updatePenerimaanJumlah(index, e.target.value)
                    }
                  />
                </div>
                <div className="col-span-1">
                  {pembiayaanData.penerimaan.rincian.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removePenerimaanItem(index)}
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
                onClick={addPenerimaanItem}
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
            {pembiayaanData.pengeluaran.rincian.map((item, index) => (
              <div
                key={item.id || index}
                className="grid grid-cols-12 gap-2 items-end"
              >
                <div className="col-span-6">
                  <Label>Kategori</Label>
                  <Input
                    placeholder="Kategori pengeluaran"
                    value={item.kategori}
                    onChange={(e) =>
                      updatePengeluaranKategori(index, e.target.value)
                    }
                  />
                </div>
                <div className="col-span-5">
                  <Label>Jumlah (Rp)</Label>
                  <Input
                    placeholder="Rp 0"
                    value={formatRupiah(item.jumlah, false)}
                    onChange={(e) =>
                      updatePengeluaranJumlah(index, e.target.value)
                    }
                  />
                </div>
                <div className="col-span-1">
                  {pembiayaanData.pengeluaran.rincian.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removePengeluaranItem(index)}
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
                onClick={addPengeluaranItem}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Tambah Rincian
              </Button>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
