import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apbdesApi } from "@/lib/admin/apbdes";
import { Apbdes } from "@/schemas/apbdes.schema";
import { formatRupiah } from "@/utils/currency";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/router";
import AdminLayout from "@/components/layouts/AdminLayout";
import { ApbdesTableLoading } from "@/components/admin/apbdes/ApbdesLoading";
import ApbdesPDFDownloadButton from "@/components/admin/apbdes/ApbdesPDFDownloadButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
import { FileDown, Pencil, Plus, Trash2 } from "lucide-react";
import { formatDate } from "@/utils/date";

export default function ApbdesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [apbdesToDelete, setApbdesToDelete] = useState<Apbdes | null>(null);

  // Fetch APBDes data
  const { data: apbdesData, isLoading } = useQuery({
    queryKey: ["apbdes"],
    queryFn: apbdesApi.getAll,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: apbdesApi.delete,
    onSuccess: () => {
      toast.success("Data APBDes berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["apbdes"] });
      setDeleteDialogOpen(false);
      setApbdesToDelete(null);
    },
    onError: (error) => {
      console.error("Error deleting APBDes:", error);
      toast.error("Gagal menghapus data APBDes");
    },
  });

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (apbdesToDelete) {
      deleteMutation.mutate(apbdesToDelete.id);
    }
  };

  // Open delete dialog
  const openDeleteDialog = (apbdes: Apbdes) => {
    setApbdesToDelete(apbdes);
    setDeleteDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Daftar APBDes</h1>
        <Button asChild>
          <Link href="/admin/apbdes/create">
            <Plus className="mr-2 h-4 w-4" />
            Tambah APBDes
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <ApbdesTableLoading />
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tahun</TableHead>
                <TableHead>Total Pendapatan</TableHead>
                <TableHead>Total Belanja</TableHead>
                <TableHead>Total Penerimaan</TableHead>
                <TableHead>Total Pengeluaran</TableHead>
                <TableHead>Surplus/Defisit</TableHead>
                <TableHead>Terakhir Diperbarui</TableHead>
                <TableHead className="w-[100px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apbdesData?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Belum ada data APBDes
                  </TableCell>
                </TableRow>
              ) : (
                apbdesData?.map((apbdes: Apbdes) => (
                  <TableRow key={apbdes.id}>
                    <TableCell className="font-medium">
                      {apbdes.tahun}
                    </TableCell>
                    <TableCell>
                      {formatRupiah(apbdes.ringkasan.totalPendapatan)}
                    </TableCell>
                    <TableCell>
                      {formatRupiah(apbdes.ringkasan.totalBelanja)}
                    </TableCell>
                    <TableCell>
                      {formatRupiah(
                        apbdes.ringkasan.totalPembiayaan.penerimaan
                      )}
                    </TableCell>
                    <TableCell>
                      {formatRupiah(
                        apbdes.ringkasan.totalPembiayaan.pengeluaran
                      )}
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          apbdes.ringkasan.surplus >= 0
                            ? "text-green-600 font-medium"
                            : "text-red-600 font-medium"
                        }
                      >
                        {formatRupiah(apbdes.ringkasan.surplus)}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(apbdes.lastUpdated)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <ApbdesPDFDownloadButton apbdes={apbdes} />
                        <Button
                          onClick={() =>
                            router.push(`/admin/apbdes/${apbdes.id}`)
                          }
                          variant="secondary"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => openDeleteDialog(apbdes)}
                          size="icon"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data APBDes tahun{" "}
              {apbdesToDelete?.tahun}? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
