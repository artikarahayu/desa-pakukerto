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
import { umkmApi } from "@/lib/admin/umkm";
import { Umkm } from "@/schemas/umkm.schema";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { UmkmTableLoading } from "@/components/admin/umkm/UmkmLoading";

export default function UmkmListPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [umkmToDelete, setUmkmToDelete] = useState<string | null>(null);

  // Query to fetch all UMKM products
  const {
    data: umkmList,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["umkm"],
    queryFn: umkmApi.getAll,
  });

  // Mutation to delete UMKM product
  const deleteMutation = useMutation({
    mutationFn: umkmApi.delete,
    onSuccess: () => {
      toast.success("Produk UMKM berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["umkm"] });
      setDeleteDialogOpen(false);
      setUmkmToDelete(null);
    },
    onError: (error) => {
      console.error("Error deleting UMKM product:", error);
      toast.error("Gagal menghapus produk UMKM");
    },
  });

  // Handle delete UMKM product
  const handleDelete = (id: string) => {
    setUmkmToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Confirm delete UMKM product
  const confirmDelete = () => {
    if (umkmToDelete) {
      deleteMutation.mutate(umkmToDelete);
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

  // Format WhatsApp number for display
  const formatWhatsAppDisplay = (number: string) => {
    if (number.startsWith("62")) {
      return `+${number}`;
    }
    return `+62${number}`;
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">UMKM Desa</h1>
        <Button onClick={() => router.push("/admin/umkm/create")}>
          <Plus className="mr-2 h-4 w-4" /> Tambah UMKM
        </Button>
      </div>

      {error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          Error loading data. Please try again.
        </div>
      ) : isLoading ? (
        <UmkmTableLoading />
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gambar</TableHead>
                <TableHead>Nama UMKM</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>No WhatsApp</TableHead>
                <TableHead>Tanggal Dibuat</TableHead>
                <TableHead className="w-[100px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {umkmList && umkmList.length > 0 ? (
                umkmList.map((umkm: Umkm) => (
                  <TableRow key={umkm.id}>
                    <TableCell>
                      <div className="relative h-10 w-16 overflow-hidden rounded-md">
                        <Image
                          src={umkm.gambar[0]}
                          alt={umkm.nama}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{umkm.nama}</TableCell>
                    <TableCell>Rp {umkm.harga}</TableCell>
                    <TableCell>{umkm.whatsapp}</TableCell>
                    <TableCell>{formatDate(umkm.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => router.push(`/admin/umkm/${umkm.id}`)}
                          size="icon"
                          variant="secondary"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(umkm.id)}
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
                    Belum ada data produk UMKM
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
            <AlertDialogTitle>Hapus Produk UMKM</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus produk UMKM ini? Tindakan ini
              tidak dapat dibatalkan.
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
