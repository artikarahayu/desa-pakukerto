import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dusunApi } from "@/lib/admin/dusun";
import { Dusun } from "@/schemas/dusun.schema";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/utils/date";
import { toast } from "sonner";

function DusunIndexPage() {
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dusunToDelete, setDusunToDelete] = useState<Dusun | null>(null);

  // Fetch dusun profiles
  const {
    data: dusunList,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dusun"],
    queryFn: dusunApi.getAll,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => dusunApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dusun"] });
      toast.success("Profil dusun berhasil dihapus");
      setDeleteDialogOpen(false);
      setDusunToDelete(null);
    },
    onError: (error) => {
      console.error("Error deleting dusun:", error);
      toast.error("Gagal menghapus profil dusun");
    },
  });

  // Handle delete confirmation
  const handleDeleteClick = (dusun: Dusun) => {
    setDusunToDelete(dusun);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (dusunToDelete) {
      deleteMutation.mutate(dusunToDelete.id);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Profil Dusun</h1>
        <p className="text-muted-foreground mt-2">
          Kelola informasi profil dusun
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Daftar Profil Dusun</CardTitle>
          <Link href="/admin/profil-dusun/create">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Tambah Dusun
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : error ? (
            <div className="p-8 text-center text-destructive">
              Gagal memuat data dusun
            </div>
          ) : dusunList && dusunList.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Dusun</TableHead>
                    <TableHead>Gambar</TableHead>
                    <TableHead>Dibuat</TableHead>
                    <TableHead>Diperbarui</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dusunList.map((dusun) => (
                    <TableRow key={dusun.id}>
                      <TableCell className="font-medium">
                        {dusun.nama}
                      </TableCell>
                      <TableCell>
                        {dusun.gambar ? (
                          <div className="relative h-10 w-16 rounded overflow-hidden">
                            <Image
                              src={dusun.gambar}
                              alt={dusun.nama}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            Tidak ada gambar
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {formatDate(new Date(dusun.createdAt))}
                      </TableCell>
                      <TableCell>
                        {formatDate(new Date(dusun.updatedAt))}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/profil-dusun/${dusun.id}`}>
                            <Button variant="secondary" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteClick(dusun)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              Belum ada profil dusun. Klik &quot;Tambah Dusun&quot; untuk
              membuat baru.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Profil Dusun</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus profil dusun &quot;
              {dusunToDelete?.nama}&quot;? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}

export default DusunIndexPage;
