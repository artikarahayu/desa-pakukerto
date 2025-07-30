import { useRouter } from "next/router";
import AdminLayout from "@/components/layouts/AdminLayout";
import StrukturForm from "@/components/admin/struktur/StrukturForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { strukturApi } from "@/lib/admin/struktur";
import { CreateStrukturInput } from "@/schemas/struktur.schema";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { StrukturFormLoading } from "@/components/admin/struktur/StrukturLoading";

export default function CreateStrukturPage() {
  const router = useRouter();

  // Mutation for creating struktur
  const createMutation = useMutation({
    mutationFn: strukturApi.create,
    onSuccess: () => {
      toast.success("Data pejabat berhasil ditambahkan");
      router.push("/admin/struktur-organisasi");
    },
    onError: (error) => {
      console.error("Error creating struktur:", error);
      toast.error("Gagal menambahkan data pejabat");
    },
  });

  // Handle form submission
  const handleSubmit = (data: CreateStrukturInput) => {
    createMutation.mutate(data);
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
          <CardTitle>Tambah Pejabat Baru</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          {createMutation.isPending ? (
            <StrukturFormLoading />
          ) : (
            <StrukturForm
              onSubmit={handleSubmit}
              isSubmitting={createMutation.isPending}
            />
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
