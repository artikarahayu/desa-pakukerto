import { useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "@/components/layouts/AdminLayout";
import BeritaForm from "@/components/admin/berita/BeritaForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { beritaApi } from "@/lib/admin/berita";
import { CreateBeritaInput } from "@/schemas/berita.schema";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { BeritaFormLoading } from "@/components/admin/berita/BeritaLoading";

export default function CreateBeritaPage() {
  const router = useRouter();

  // Mutation for creating berita
  const createMutation = useMutation({
    mutationFn: beritaApi.create,
    onSuccess: () => {
      toast.success("Berita berhasil ditambahkan");
      router.push("/admin/berita");
    },
    onError: (error) => {
      console.error("Error creating berita:", error);
      toast.error("Gagal menambahkan berita");
    },
  });

  // Handle form submission
  const handleSubmit = (data: CreateBeritaInput) => {
    createMutation.mutate(data);
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
          <CardTitle>Tambah Berita Baru</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          {createMutation.isPending ? (
            <BeritaFormLoading />
          ) : (
            <BeritaForm
              onSubmit={handleSubmit}
              isSubmitting={createMutation.isPending}
            />
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
