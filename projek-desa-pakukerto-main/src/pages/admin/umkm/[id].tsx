import { useRouter } from "next/router";
import AdminLayout from "@/components/layouts/AdminLayout";
import UmkmForm from "@/components/admin/umkm/UmkmForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { umkmApi } from "@/lib/admin/umkm";
import { UpdateUmkmInput } from "@/schemas/umkm.schema";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { UmkmFormLoading } from "@/components/admin/umkm/UmkmLoading";

export default function EditUmkmPage() {
  const router = useRouter();
  const { id } = router.query;
  const queryClient = useQueryClient();

  // Query to fetch UMKM product by ID
  const {
    data: umkm,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["umkm", id],
    queryFn: () =>
      id ? umkmApi.getById(id as string) : Promise.reject("No ID provided"),
    enabled: !!id,
  });

  // Mutation for updating UMKM product
  const updateMutation = useMutation({
    mutationFn: (data: UpdateUmkmInput) =>
      umkmApi.update(id as string, data),
    onSuccess: () => {
      toast.success("Produk UMKM berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["umkm"] });
      queryClient.invalidateQueries({ queryKey: ["umkm", id] });
      router.push("/admin/umkm");
    },
    onError: (error) => {
      console.error("Error updating UMKM product:", error);
      toast.error("Gagal memperbarui produk UMKM");
    },
  });

  // Handle form submission
  const handleSubmit = (data: UpdateUmkmInput) => {
    // Format WhatsApp number if needed
    let whatsapp = data.whatsapp;
    if (whatsapp && !whatsapp.startsWith("62")) {
      whatsapp = `62${whatsapp}`;
    }
    
    updateMutation.mutate({
      ...data,
      whatsapp
    });
  };

  return (
    <AdminLayout>
      <div className="flex items-center gap-2 mb-4">
        <Link
          href="/admin/umkm"
          className="flex items-center text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Kembali
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Produk UMKM</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          {isLoading ? (
            <UmkmFormLoading />
          ) : error ? (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md">
              Error loading produk UMKM. Please try again.
            </div>
          ) : umkm ? (
            <UmkmForm
              initialData={{
                nama: umkm.nama,
                deskripsi: umkm.deskripsi,
                gambar: umkm.gambar,
                whatsapp: umkm.whatsapp,
                harga: umkm.harga,
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
