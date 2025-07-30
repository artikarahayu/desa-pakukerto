import { useRouter } from "next/router";
import AdminLayout from "@/components/layouts/AdminLayout";
import GaleriForm from "@/components/admin/galeri/GaleriForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { galeriApi } from "@/lib/admin/galeri";
import { CreateGaleriInput } from "@/schemas/galeri.schema";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { GaleriFormLoading } from "@/components/admin/galeri/GaleriLoading";

export default function CreateGaleriPage() {
  const router = useRouter();

  // Mutation for creating gallery item
  const createMutation = useMutation({
    mutationFn: galeriApi.create,
    onSuccess: () => {
      toast.success("Item galeri berhasil ditambahkan");
      router.push("/admin/galeri");
    },
    onError: (error) => {
      console.error("Error creating gallery item:", error);
      toast.error("Gagal menambahkan item galeri");
    },
  });

  // Handle form submission
  const handleSubmit = (data: CreateGaleriInput) => {
    createMutation.mutate(data);
  };

  return (
    <AdminLayout>
      <div className="flex items-center gap-2 mb-4">
        <Link
          href="/admin/galeri"
          className="flex items-center text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Kembali
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tambah Item Galeri Baru</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          {createMutation.isPending ? (
            <GaleriFormLoading />
          ) : (
            <GaleriForm
              onSubmit={handleSubmit}
              isSubmitting={createMutation.isPending}
            />
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
