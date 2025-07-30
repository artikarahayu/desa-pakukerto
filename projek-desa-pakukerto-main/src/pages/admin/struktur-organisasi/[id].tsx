import { useRouter } from "next/router";
import AdminLayout from "@/components/layouts/AdminLayout";
import StrukturForm from "@/components/admin/struktur/StrukturForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { strukturApi } from "@/lib/admin/struktur";
import { UpdateStrukturInput } from "@/schemas/struktur.schema";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { StrukturFormLoading } from "@/components/admin/struktur/StrukturLoading";

export default function EditStrukturPage() {
  const router = useRouter();
  const { id } = router.query;
  const queryClient = useQueryClient();

  // Query to fetch struktur by ID
  const {
    data: struktur,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["struktur", id],
    queryFn: () =>
      id ? strukturApi.getById(id as string) : Promise.reject("No ID provided"),
    enabled: !!id,
  });

  // Mutation for updating struktur
  const updateMutation = useMutation({
    mutationFn: (data: UpdateStrukturInput) =>
      strukturApi.update(id as string, data),
    onSuccess: () => {
      toast.success("Data pejabat berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["struktur"] });
      queryClient.invalidateQueries({ queryKey: ["struktur", id] });
      router.push("/admin/struktur-organisasi");
    },
    onError: (error) => {
      console.error("Error updating struktur:", error);
      toast.error("Gagal memperbarui data pejabat");
    },
  });

  // Handle form submission
  const handleSubmit = (data: UpdateStrukturInput) => {
    updateMutation.mutate(data);
  };

  return (
    <AdminLayout>
      <div className="flex items-center gap-2 mb-4">
        <Link
          href="/admin/struktur-organisasi"
          className="flex items-center text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Kembali
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Data Pejabat</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          {isLoading ? (
            <StrukturFormLoading />
          ) : error ? (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md">
              Error loading data. Please try again.
            </div>
          ) : struktur ? (
            <StrukturForm
              initialData={{
                nama: struktur.nama,
                jabatan: struktur.jabatan,
                foto: struktur.foto,
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
