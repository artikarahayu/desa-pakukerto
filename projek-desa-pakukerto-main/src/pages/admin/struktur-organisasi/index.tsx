import { useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { strukturApi } from "@/lib/admin/struktur";
import { Struktur } from "@/schemas/struktur.schema";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { StrukturTableLoading } from "@/components/admin/struktur/StrukturLoading";

export default function StrukturListPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [strukturToDelete, setStrukturToDelete] = useState<string | null>(null);

  // Query to fetch all struktur
  const {
    data: strukturList,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["struktur"],
    queryFn: strukturApi.getAll,
  });

  // Mutation to delete struktur
  const deleteMutation = useMutation({
    mutationFn: strukturApi.delete,
    onSuccess: () => {
      toast.success("Data pejabat berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["struktur"] });
      setDeleteDialogOpen(false);
      setStrukturToDelete(null);
    },
    onError: (error) => {
      console.error("Error deleting struktur:", error);
      toast.error("Gagal menghapus data pejabat");
    },
  });

  // Handle delete struktur
  const handleDelete = (id: string) => {
    setStrukturToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Confirm delete struktur
  const confirmDelete = () => {
    if (strukturToDelete) {
      deleteMutation.mutate(strukturToDelete);
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
        <h1 className="text-2xl font-bold">Struktur Organisasi</h1>
        <Button onClick={() => router.push("/admin/struktur-organisasi/create")}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Pejabat
        </Button>
      </div>

      {error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          Error loading data. Please try again.
        </div>
      ) : isLoading ? (
        <StrukturTableLoading />
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Foto</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Jabatan</TableHead>
                <TableHead>Tanggal Dibuat</TableHead>
                <TableHead className="w-[100px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {strukturList && strukturList.length > 0 ? (
                strukturList.map((struktur: Struktur) => (
                  <TableRow key={struktur.id}>
                    <TableCell>
                      <div className="relative h-10 w-10 overflow-hidden rounded-full">
                        <Image
                          src={struktur.foto}
                          alt={struktur.nama}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {struktur.nama}
                    </TableCell>
                    <TableCell>{struktur.jabatan}</TableCell>
                    <TableCell>{formatDate(struktur.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          onClick={() =>
                            router.push(`/admin/struktur-organisasi/${struktur.id}`)
                          }
                          size="icon"
                          variant="secondary"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(struktur.id)}
                          size="icon"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Belum ada data pejabat
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
            <AlertDialogTitle>Hapus Data Pejabat</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data pejabat ini? Tindakan ini tidak
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
