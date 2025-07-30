import { useRouter } from "next/router";
import AdminLayout from "@/components/layouts/AdminLayout";
import DemografiForm from "@/components/admin/demografi/DemografiForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { demografiApi } from "@/lib/admin/demografi";
import { UpdateDemografiInput } from "@/schemas/demografi.schema";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { DemografiFormLoading } from "@/components/admin/demografi/DemografiLoading";

export default function EditDemografiPage() {
  const router = useRouter();
  const { id } = router.query;
  const queryClient = useQueryClient();

  // Query to fetch demografi by ID
  const {
    data: demografi,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["demografi", id],
    queryFn: () =>
      id
        ? demografiApi.getById(id as string)
        : Promise.reject("No ID provided"),
    enabled: !!id,
  });

  // Mutation for updating demografi
  const updateMutation = useMutation({
    mutationFn: (data: UpdateDemografiInput) =>
      demografiApi.update(id as string, data),
    onSuccess: () => {
      toast.success("Data demografi berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["demografi"] });
      queryClient.invalidateQueries({ queryKey: ["demografi", id] });
      router.push("/admin/demografi");
    },
    onError: (error) => {
      console.error("Error updating demografi:", error);
      toast.error("Gagal memperbarui data demografi");
    },
  });

  // Handle form submission
  const handleSubmit = (data: UpdateDemografiInput) => {
    updateMutation.mutate(data);
  };

  return (
    <AdminLayout>
      <div className="flex items-center gap-2 mb-4">
        <Link
          href="/admin/demografi"
          className="flex items-center text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Kembali
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Data Demografi</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          {isLoading ? (
            <DemografiFormLoading />
          ) : error ? (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md">
              Error loading data demografi. Please try again.
            </div>
          ) : demografi ? (
            <DemografiForm
              initialData={{
                tahun: demografi.tahun,
                dataGlobal: demografi.dataGlobal,
                dataKelompokDusun: demografi.dataKelompokDusun,
                dataDusun: demografi.dataDusun,
                dataPendidikan: demografi.dataPendidikan,
                dataPekerjaan: demografi.dataPekerjaan,
                dataWajibPilih: demografi.dataWajibPilih,
                dataPerkawinan: demografi.dataPerkawinan,
                dataAgama: demografi.dataAgama,
              }}
              onSubmit={handleSubmit}
              isSubmitting={updateMutation.isPending}
            />
          ) : null}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
