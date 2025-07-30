import { useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { galeriApi } from "@/lib/admin/galeri";
import { Galeri, extractYoutubeVideoId } from "@/schemas/galeri.schema";
import { Plus, Pencil, Trash2, Image as ImageIcon, Youtube } from "lucide-react";
import Image from "next/image";
import { GaleriTableLoading } from "@/components/admin/galeri/GaleriLoading";

export default function GaleriListPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [galeriToDelete, setGaleriToDelete] = useState<string | null>(null);

  // Query to fetch all gallery items
  const {
    data: galeriList,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["galeri"],
    queryFn: galeriApi.getAll,
  });

  // Mutation to delete gallery item
  const deleteMutation = useMutation({
    mutationFn: galeriApi.delete,
    onSuccess: () => {
      toast.success("Item galeri berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["galeri"] });
      setDeleteDialogOpen(false);
      setGaleriToDelete(null);
    },
    onError: (error) => {
      console.error("Error deleting gallery item:", error);
      toast.error("Gagal menghapus item galeri");
    },
  });

  // Handle delete gallery item
  const handleDelete = (id: string) => {
    setGaleriToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Confirm delete gallery item
  const confirmDelete = () => {
    if (galeriToDelete) {
      deleteMutation.mutate(galeriToDelete);
    }
  };

  // Format date from timestamp
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Galeri</h1>
        <Button onClick={() => router.push("/admin/galeri/create")}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Item
        </Button>
      </div>

      {error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          Error loading data. Please try again.
        </div>
      ) : isLoading ? (
        <GaleriTableLoading />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {galeriList && galeriList.length > 0 ? (
            galeriList.map((item: Galeri) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="relative aspect-video w-full overflow-hidden">
                  {item.type === "image" ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <iframe
                      src={`https://www.youtube.com/embed/${extractYoutubeVideoId(item.youtubeUrl)}`}
                      title={item.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute top-0 left-0 w-full h-full"
                    ></iframe>
                  )}
                  <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm text-foreground px-2 py-1 rounded-md text-xs flex items-center">
                    {item.type === "image" ? (
                      <>
                        <ImageIcon className="h-3 w-3 mr-1" /> Gambar
                      </>
                    ) : (
                      <>
                        <Youtube className="h-3 w-3 mr-1" /> Video
                      </>
                    )}
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium line-clamp-1">{item.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(item.createdAt || 0)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => router.push(`/admin/galeri/${item.id}`)}
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(item.id)}
                        size="icon"
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-8 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground">Belum ada item galeri</p>
              <Button
                variant="link"
                onClick={() => router.push("/admin/galeri/create")}
                className="mt-2"
              >
                Tambah Item Galeri
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Item Galeri</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus item galeri ini? Tindakan ini tidak
              dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
