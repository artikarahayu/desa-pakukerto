import { useRouter } from "next/router";
import AdminLayout from "@/components/layouts/AdminLayout";
import DemografiForm from "@/components/admin/demografi/DemografiForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { demografiApi } from "@/lib/admin/demografi";
import { CreateDemografiInput } from "@/schemas/demografi.schema";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { DemografiFormLoading } from "@/components/admin/demografi/DemografiLoading";

export default function CreateDemografiPage() {
  const router = useRouter();

  // Mutation for creating demografi
  const createMutation = useMutation({
    mutationFn: demografiApi.create,
    onSuccess: () => {
      toast.success("Data demografi berhasil ditambahkan");
      router.push("/admin/demografi");
    },
    onError: (error) => {
      console.error("Error creating demografi:", error);
      toast.error("Gagal menambahkan data demografi");
    },
  });

  // Handle form submission
  const handleSubmit = (data: CreateDemografiInput) => {
    createMutation.mutate(data);
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
          <CardTitle>Tambah Data Demografi Baru</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          {createMutation.isPending ? (
            <DemografiFormLoading />
          ) : (
            <DemografiForm
              onSubmit={handleSubmit}
              isSubmitting={createMutation.isPending}
            />
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
