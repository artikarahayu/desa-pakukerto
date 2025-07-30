import { useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "@/components/layouts/AdminLayout";
import UmkmForm from "@/components/admin/umkm/UmkmForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { umkmApi } from "@/lib/admin/umkm";
import { CreateUmkmInput } from "@/schemas/umkm.schema";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { UmkmFormLoading } from "@/components/admin/umkm/UmkmLoading";

export default function CreateUmkmPage() {
  const router = useRouter();

  // Mutation for creating UMKM product
  const createMutation = useMutation({
    mutationFn: umkmApi.create,
    onSuccess: () => {
      toast.success("Produk UMKM berhasil ditambahkan");
      router.push("/admin/umkm");
    },
    onError: (error) => {
      console.error("Error creating UMKM product:", error);
      toast.error("Gagal menambahkan produk UMKM");
    },
  });

  // Handle form submission
  const handleSubmit = (data: CreateUmkmInput) => {
    // Format WhatsApp number if needed
    let whatsapp = data.whatsapp;
    if (!whatsapp.startsWith("62")) {
      whatsapp = `62${whatsapp}`;
    }
    
    createMutation.mutate({
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
          <CardTitle>Tambah Produk UMKM Baru</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          {createMutation.isPending ? (
            <UmkmFormLoading />
          ) : (
            <UmkmForm
              onSubmit={handleSubmit}
              isSubmitting={createMutation.isPending}
            />
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
