import { useRouter } from "next/router";
import AdminLayout from "@/components/layouts/AdminLayout";
import GaleriForm from "@/components/admin/galeri/GaleriForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { galeriApi } from "@/lib/admin/galeri";
import { UpdateGaleriInput } from "@/schemas/galeri.schema";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { GaleriFormLoading } from "@/components/admin/galeri/GaleriLoading";

export default function EditGaleriPage() {
  const router = useRouter();
  const { id } = router.query;
  const queryClient = useQueryClient();

  // Query to fetch gallery item by ID
  const {
    data: galeri,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["galeri", id],
    queryFn: () =>
      id ? galeriApi.getById(id as string) : Promise.reject("No ID provided"),
    enabled: !!id,
  });

  // Mutation for updating gallery item
  const updateMutation = useMutation({
    mutationFn: (data: UpdateGaleriInput) =>
      galeriApi.update(id as string, data),
    onSuccess: () => {
      toast.success("Item galeri berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["galeri"] });
      queryClient.invalidateQueries({ queryKey: ["galeri", id] });
      router.push("/admin/galeri");
    },
    onError: (error) => {
      console.error("Error updating gallery item:", error);
      toast.error("Gagal memperbarui item galeri");
    },
  });

  // Handle form submission
  const handleSubmit = (data: UpdateGaleriInput) => {
    updateMutation.mutate(data);
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
          <CardTitle>Edit Item Galeri</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          {isLoading ? (
            <GaleriFormLoading />
          ) : error ? (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md">
              Error loading gallery item. Please try again.
            </div>
          ) : galeri ? (
            <GaleriForm
              initialData={{
                type: galeri.type,
                title: galeri.title,
                imageUrl: galeri.type === "image" ? galeri.imageUrl : "",
                youtubeUrl: galeri.type === "video" ? galeri.youtubeUrl : "",
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
