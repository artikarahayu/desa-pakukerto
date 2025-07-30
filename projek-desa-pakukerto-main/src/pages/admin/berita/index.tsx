import { BeritaTableLoading } from "@/components/admin/berita/BeritaLoading";
import AdminLayout from "@/components/layouts/AdminLayout";
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
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { beritaApi } from "@/lib/admin/berita";
import { Berita } from "@/schemas/berita.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "sonner";

export default function BeritaListPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [beritaToDelete, setBeritaToDelete] = useState<string | null>(null);

  // Query to fetch all berita
  const {
    data: beritaList,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["berita"],
    queryFn: beritaApi.getAll,
  });

  // Mutation to delete berita
  const deleteMutation = useMutation({
    mutationFn: beritaApi.delete,
    onSuccess: () => {
      toast.success("Berita berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["berita"] });
      setDeleteDialogOpen(false);
      setBeritaToDelete(null);
    },
    onError: (error) => {
      console.error("Error deleting berita:", error);
      toast.error("Gagal menghapus berita");
    },
  });

  // Handle delete berita
  const handleDelete = (id: string) => {
    setBeritaToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Confirm delete berita
  const confirmDelete = () => {
    if (beritaToDelete) {
      deleteMutation.mutate(beritaToDelete);
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
        <h1 className="text-2xl font-bold">Berita Desa</h1>
        <Button onClick={() => router.push("/admin/berita/create")}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Berita
        </Button>
      </div>

      {error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          Error loading data. Please try again.
        </div>
      ) : isLoading ? (
        <BeritaTableLoading />
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thumbnail</TableHead>
                <TableHead>Judul</TableHead>
                <TableHead>Tanggal Dibuat</TableHead>
                <TableHead className="w-[100px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {beritaList && beritaList.length > 0 ? (
                beritaList.map((berita: Berita) => (
                  <TableRow key={berita.id}>
                    <TableCell>
                      <div className="relative h-10 w-16 overflow-hidden rounded-md">
                        <Image
                          src={berita.thumbnail}
                          alt={berita.judul}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {berita.judul}
                    </TableCell>
                    <TableCell>{formatDate(berita.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          onClick={() =>
                            router.push(`/admin/berita/${berita.id}`)
                          }
                          size="icon"
                          variant="secondary"
                        >
                          <Pencil />
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(berita.id)}
                          size="icon"
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Belum ada data berita
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Berita</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus berita ini? Tindakan ini tidak
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
