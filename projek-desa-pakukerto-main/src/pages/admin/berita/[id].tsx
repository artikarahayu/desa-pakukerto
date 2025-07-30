import { useRouter } from "next/router";
import AdminLayout from "@/components/layouts/AdminLayout";
import BeritaForm from "@/components/admin/berita/BeritaForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { beritaApi } from "@/lib/admin/berita";
import { UpdateBeritaInput } from "@/schemas/berita.schema";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { BeritaFormLoading } from "@/components/admin/berita/BeritaLoading";

export default function EditBeritaPage() {
  const router = useRouter();
  const { id } = router.query;
  const queryClient = useQueryClient();

  // Query to fetch berita by ID
  const {
    data: berita,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["berita", id],
    queryFn: () =>
      id ? beritaApi.getById(id as string) : Promise.reject("No ID provided"),
    enabled: !!id,
  });

  // Mutation for updating berita
  const updateMutation = useMutation({
    mutationFn: (data: UpdateBeritaInput) =>
      beritaApi.update(id as string, data),
    onSuccess: () => {
      toast.success("Berita berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["berita"] });
      queryClient.invalidateQueries({ queryKey: ["berita", id] });
      router.push("/admin/berita");
    },
    onError: (error) => {
      console.error("Error updating berita:", error);
      toast.error("Gagal memperbarui berita");
    },
  });

  // Handle form submission
  const handleSubmit = (data: UpdateBeritaInput) => {
    updateMutation.mutate(data);
  };

  return (
    <AdminLayout>
      <div className="flex items-center gap-2 mb-4">
        <Link
          href="/admin/berita"
          className="flex items-center text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Kembali
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Berita</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          {isLoading ? (
            <BeritaFormLoading />
          ) : error ? (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md">
              Error loading berita. Please try again.
            </div>
          ) : berita ? (
            <BeritaForm
              initialData={{
                judul: berita.judul,
                thumbnail: berita.thumbnail,
                isi: berita.isi,
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
