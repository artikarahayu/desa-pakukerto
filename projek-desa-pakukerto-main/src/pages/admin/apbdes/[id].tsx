import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apbdesApi } from "@/lib/admin/apbdes";
import { CreateApbdesInput } from "@/schemas/apbdes.schema";
import { toast } from "sonner";
import { useRouter } from "next/router";
import AdminLayout from "@/components/layouts/AdminLayout";
import { ApbdesFormLoading } from "@/components/admin/apbdes/ApbdesLoading";
import { EditApbdesForm } from "@/components/admin/apbdes/EditApbdesForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditApbdesPage() {
  const router = useRouter();
  const { id } = router.query;
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch APBDes data
  const { data: apbdesData, isLoading } = useQuery({
    queryKey: ["apbdes", id],
    queryFn: () => (id ? apbdesApi.getById(id as string) : null),
    enabled: !!id,
    staleTime: 0, // Always get fresh data
    refetchOnMount: true, // Refetch when component mounts
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: CreateApbdesInput) =>
      apbdesApi.update(id as string, data),
    onSuccess: () => {
      toast.success("Data APBDes berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["apbdes"] });
      router.push("/admin/apbdes");
    },
    onError: (error: any) => {
      console.error("Error updating APBDes:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Gagal memperbarui data APBDes");
      }
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  // Handle form submission
  const handleSubmit = (data: CreateApbdesInput) => {
    setIsSubmitting(true);
    updateMutation.mutate(data);
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
        <h1 className="text-2xl font-bold">Edit Data APBDes</h1>
        <p className="text-muted-foreground">
          Perbarui data APBDes tahun {apbdesData?.tahun}
        </p>
      </div>

      {isLoading ? (
        <ApbdesFormLoading />
      ) : (
        <EditApbdesForm
          initialData={apbdesData}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </AdminLayout>
  );
}
