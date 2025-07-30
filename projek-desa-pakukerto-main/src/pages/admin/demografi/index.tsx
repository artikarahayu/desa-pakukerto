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
import { demografiApi } from "@/lib/admin/demografi";
import { Demografi } from "@/schemas/demografi.schema";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { formatDate } from "@/utils/date";
import { DemografiTableLoading } from "@/components/admin/demografi/DemografiLoading";

export default function DemografiListPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [demografiToDelete, setDemografiToDelete] = useState<string | null>(null);

  // Query to fetch all demografi data
  const {
    data: demografiList,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["demografi"],
    queryFn: demografiApi.getAll,
  });

  // Mutation to delete demografi
  const deleteMutation = useMutation({
    mutationFn: demografiApi.delete,
    onSuccess: () => {
      toast.success("Data demografi berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["demografi"] });
      setDeleteDialogOpen(false);
      setDemografiToDelete(null);
    },
    onError: (error) => {
      console.error("Error deleting demografi:", error);
      toast.error("Gagal menghapus data demografi");
    },
  });

  // Handle delete demografi
  const handleDelete = (id: string) => {
    setDemografiToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Confirm delete demografi
  const confirmDelete = () => {
    if (demografiToDelete) {
      deleteMutation.mutate(demografiToDelete);
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Data Demografi Penduduk</h1>
        <Button onClick={() => router.push("/admin/demografi/create")}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Data
        </Button>
      </div>

      {error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          Error loading data. Please try again.
        </div>
      ) : isLoading ? (
        <DemografiTableLoading />
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tahun</TableHead>
                <TableHead>Total Penduduk</TableHead>
                <TableHead>Terakhir Diperbarui</TableHead>
                <TableHead className="w-[100px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {demografiList && demografiList.length > 0 ? (
                demografiList.map((demografi: Demografi) => (
                  <TableRow key={demografi.id}>
                    <TableCell className="font-medium">
                      {demografi.tahun}
                    </TableCell>
                    <TableCell>
                      {demografi.dataGlobal.totalPenduduk.toLocaleString()} jiwa
                    </TableCell>
                    <TableCell>
                      {formatDate(demografi.lastUpdated)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          onClick={() =>
                            router.push(`/admin/demografi/${demografi.id}`)
                          }
                          size="icon"
                          variant="secondary"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(demografi.id)}
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
                  <TableCell colSpan={4} className="text-center py-4">
                    Belum ada data demografi
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
            <AlertDialogTitle>Hapus Data Demografi</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data demografi ini? Tindakan ini tidak
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
