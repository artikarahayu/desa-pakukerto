import { Control, Controller, UseFormSetValue } from "react-hook-form";
import { CreateApbdesInput } from "@/schemas/apbdes.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRupiah, parseRupiah } from "@/utils/currency";
import { PlusCircle, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

interface RincianSectionProps {
  title: string;
  control: Control<CreateApbdesInput>;
  setValue: UseFormSetValue<CreateApbdesInput>;
  errors: any;
  sectionName: "pendapatan" | "belanja";
}

interface SubRincianItemProps {
  uraian: string;
  jumlah: number;
}

interface RincianItemProps {
  kategori: string;
  jumlah: number;
  subRincian: SubRincianItemProps[];
}

export function RincianSection({
  title,
  control,
  setValue,
  errors,
  sectionName,
}: RincianSectionProps) {
  // Local state for managing rincian items
  const [rincianItems, setRincianItems] = useState<RincianItemProps[]>([
    {
      kategori: "",
      jumlah: 0,
      subRincian: [{ uraian: "", jumlah: 0 }],
    },
  ]);

  // Initialize from form values if they exist
  useEffect(() => {
    // Get the current form values for this section
    const currentValues = control._formValues[sectionName]?.rincian;
    if (currentValues && currentValues.length > 0) {
      setRincianItems(currentValues);
    }
  }, [control._formValues, sectionName]);

  // Update form values when local state changes
  useEffect(() => {
    setValue(`${sectionName}.rincian`, rincianItems);

    // Calculate total for the section
    const sectionTotal = rincianItems.reduce(
      (acc, item) => acc + (item.jumlah || 0),
      0
    );
    setValue(`${sectionName}.total`, sectionTotal);
  }, [rincianItems, setValue, sectionName]);

  // Add a new rincian item
  const addRincianItem = () => {
    setRincianItems([
      ...rincianItems,
      {
        kategori: "",
        jumlah: 0,
        subRincian: [{ uraian: "", jumlah: 0 }],
      },
    ]);
  };

  // Remove a rincian item
  const removeRincianItem = (index: number) => {
    const newItems = [...rincianItems];
    newItems.splice(index, 1);
    setRincianItems(newItems);
  };

  // Update a rincian item's kategori
  const updateRincianKategori = (index: number, value: string) => {
    const newItems = [...rincianItems];
    newItems[index].kategori = value;
    setRincianItems(newItems);
  };

  // Add a sub rincian item
  const addSubRincianItem = (rincianIndex: number) => {
    const newItems = [...rincianItems];
    newItems[rincianIndex].subRincian.push({ uraian: "", jumlah: 0 });
    setRincianItems(newItems);
  };

  // Remove a sub rincian item
  const removeSubRincianItem = (rincianIndex: number, subIndex: number) => {
    const newItems = [...rincianItems];
    newItems[rincianIndex].subRincian.splice(subIndex, 1);
    setRincianItems(newItems);
  };

  // Update a sub rincian item's uraian
  const updateSubRincianUraian = (
    rincianIndex: number,
    subIndex: number,
    value: string
  ) => {
    const newItems = [...rincianItems];
    newItems[rincianIndex].subRincian[subIndex].uraian = value;
    setRincianItems(newItems);
  };

  // Update a sub rincian item's jumlah and recalculate totals
  const updateSubRincianJumlah = (
    rincianIndex: number,
    subIndex: number,
    value: number
  ) => {
    const newItems = [...rincianItems];
    newItems[rincianIndex].subRincian[subIndex].jumlah = value;

    // Recalculate the total for this rincian
    const total = newItems[rincianIndex].subRincian.reduce(
      (acc, item) => acc + (item.jumlah || 0),
      0
    );
    newItems[rincianIndex].jumlah = total;

    setRincianItems(newItems);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {rincianItems.map((rincian, rincianIndex) => (
          <Card
            key={rincianIndex}
            className={`border-l-4 ${
              sectionName === "pendapatan"
                ? "border-l-blue-500"
                : "border-l-red-500"
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Label>
                  Kategori {title} {rincianIndex + 1}
                </Label>
                {rincianItems.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRincianItem(rincianIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Input
                placeholder={`Nama kategori ${title.toLowerCase()}`}
                value={rincian.kategori}
                onChange={(e) =>
                  updateRincianKategori(rincianIndex, e.target.value)
                }
              />
              {errors[sectionName]?.rincian?.[rincianIndex]?.kategori && (
                <p className="text-sm text-red-500">
                  {
                    errors[sectionName]?.rincian?.[rincianIndex]?.kategori
                      ?.message
                  }
                </p>
              )}
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Sub Rincian</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addSubRincianItem(rincianIndex)}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Tambah Sub Rincian
                </Button>
              </div>

              {rincian.subRincian.map((subRincian, subRincianIndex) => (
                <div
                  key={`${rincianIndex}-${subRincianIndex}`}
                  className="grid grid-cols-12 gap-2 items-end"
                >
                  <div className="col-span-6">
                    <Label>Uraian</Label>
                    <Input
                      placeholder={`Uraian ${title.toLowerCase()}`}
                      value={subRincian.uraian}
                      onChange={(e) =>
                        updateSubRincianUraian(
                          rincianIndex,
                          subRincianIndex,
                          e.target.value
                        )
                      }
                    />
                    {errors[sectionName]?.rincian?.[rincianIndex]?.subRincian?.[
                      subRincianIndex
                    ]?.uraian && (
                      <p className="text-sm text-red-500">
                        {
                          errors[sectionName]?.rincian?.[rincianIndex]
                            ?.subRincian?.[subRincianIndex]?.uraian?.message
                        }
                      </p>
                    )}
                  </div>
                  <div className="col-span-5">
                    <Label>Jumlah (Rp)</Label>
                    <Input
                      placeholder="Rp 0"
                      value={
                        subRincian.jumlah
                          ? formatRupiah(subRincian.jumlah, false)
                          : ""
                      }
                      onChange={(e) => {
                        const value = parseRupiah(e.target.value);
                        updateSubRincianJumlah(
                          rincianIndex,
                          subRincianIndex,
                          value
                        );
                      }}
                    />
                    {errors[sectionName]?.rincian?.[rincianIndex]?.subRincian?.[
                      subRincianIndex
                    ]?.jumlah && (
                      <p className="text-sm text-red-500">
                        {
                          errors[sectionName]?.rincian?.[rincianIndex]
                            ?.subRincian?.[subRincianIndex]?.jumlah?.message
                        }
                      </p>
                    )}
                  </div>
                  <div className="col-span-1">
                    {rincian.subRincian.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          removeSubRincianItem(rincianIndex, subRincianIndex)
                        }
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
                  onClick={() => addRincianItem()}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Tambah Rincian
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Hidden field controllers to connect with React Hook Form */}
        {rincianItems.map((rincian, rincianIndex) => (
          <div key={`controller-${rincianIndex}`} className="hidden">
            <Controller
              name={`${sectionName}.rincian.${rincianIndex}.kategori`}
              control={control}
              defaultValue={rincian.kategori}
              render={({ field }) => <input type="hidden" {...field} />}
            />
            <Controller
              name={`${sectionName}.rincian.${rincianIndex}.jumlah`}
              control={control}
              defaultValue={rincian.jumlah}
              render={({ field }) => <input type="hidden" {...field} />}
            />
            {rincian.subRincian.map((subRincian, subRincianIndex) => (
              <div key={`controller-${rincianIndex}-${subRincianIndex}`}>
                <Controller
                  name={`${sectionName}.rincian.${rincianIndex}.subRincian.${subRincianIndex}.uraian`}
                  control={control}
                  defaultValue={subRincian.uraian}
                  render={({ field }) => <input type="hidden" {...field} />}
                />
                <Controller
                  name={`${sectionName}.rincian.${rincianIndex}.subRincian.${subRincianIndex}.jumlah`}
                  control={control}
                  defaultValue={subRincian.jumlah}
                  render={({ field }) => <input type="hidden" {...field} />}
                />
              </div>
            ))}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
