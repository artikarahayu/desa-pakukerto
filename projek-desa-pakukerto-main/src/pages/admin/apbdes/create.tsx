import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apbdesApi } from "@/lib/admin/apbdes";
import { CreateApbdesInput } from "@/schemas/apbdes.schema";
import { toast } from "sonner";
import { useRouter } from "next/router";
import AdminLayout from "@/components/layouts/AdminLayout";
import { ApbdesForm } from "@/components/admin/apbdes/ApbdesForm";
import { ApbdesFormLoading } from "@/components/admin/apbdes/ApbdesLoading";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CreateApbdesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: apbdesApi.create,
    onSuccess: () => {
      toast.success("Data APBDes berhasil ditambahkan");
      queryClient.invalidateQueries({ queryKey: ["apbdes"] });
      router.push("/admin/apbdes");
    },
    onError: (error: any) => {
      console.error("Error creating APBDes:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Gagal menambahkan data APBDes");
      }
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  // Handle form submission
  const handleSubmit = (data: CreateApbdesInput) => {
    setIsLoading(true);
    createMutation.mutate(data);
  };

  return (
    <AdminLayout>
      <div className="flex items-center gap-2 mb-4">
        <Link
          href="/admin/apbdes"
          className="flex items-center text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Kembali
        </Link>
      </div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Tambah Data APBDes</h1>
        <p className="text-muted-foreground">
          Isi formulir berikut untuk menambahkan data APBDes baru
        </p>
      </div>

      {isLoading ? (
        <ApbdesFormLoading />
      ) : (
        <ApbdesForm onSubmit={handleSubmit} isSubmitting={isLoading} />
      )}
    </AdminLayout>
  );
}
