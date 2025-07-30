import AdminLayout from "@/components/layouts/AdminLayout";
import { SuratKelahiranPDFDocument } from "@/components/pdf/SuratKelahiranPDFDocument";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatDate,
  getStatusBadge,
  handleUpdateNomor,
  handleUpdateStatus,
} from "@/lib/admin/surat-helpers";
import { suratKelahiranApi } from "@/lib/admin/surat-kelahiran";
import { SuratKelahiran } from "@/schemas/surat-kelahiran.schema";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "sonner";

export default function SuratKelahiranAdminPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "pending" | "finish"
  >("all");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isStatusEditOpen, setIsStatusEditOpen] = useState(false);
  const [selectedSurat, setSelectedSurat] = useState<SuratKelahiran | null>(
    null
  );
  const [nomorSurat, setNomorSurat] = useState("");
  const [newStatus, setNewStatus] = useState<"pending" | "finish">("pending");

  // Query to fetch surat kelahiran
  const {
    data: suratList,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["surat-kelahiran", selectedStatus],
    queryFn: () =>
      suratKelahiranApi.getAll(
        selectedStatus === "all" ? undefined : selectedStatus
      ),
  });

  // Mutation to update surat
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      suratKelahiranApi.update(id, data),
    onSuccess: () => {
      toast.success("Surat berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["surat-kelahiran"] });
      queryClient.invalidateQueries({ queryKey: ["pending-count"] });
      setIsEditOpen(false);
      setIsStatusEditOpen(false);
      setSelectedSurat(null);
      setNomorSurat("");
    },
    onError: (error) => {
      console.error("Error updating surat:", error);
      toast.error("Gagal memperbarui surat");
    },
  });

  // Mutation to delete surat
  const deleteMutation = useMutation({
    mutationFn: (id: string) => suratKelahiranApi.delete(id),
    onSuccess: () => {
      toast.success("Surat berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["surat-kelahiran"] });
      queryClient.invalidateQueries({ queryKey: ["pending-count"] });
    },
    onError: (error) => {
      console.error("Error deleting surat:", error);
      toast.error("Gagal menghapus surat");
    },
  });

  const handleViewDetail = (surat: SuratKelahiran) => {
    router.push(`/admin/layanan/surat-keterangan-kelahiran/${surat.id}`);
  };

  const handleEditNomor = (surat: SuratKelahiran) => {
    setSelectedSurat(surat);
    setNomorSurat(surat.nomorSurat || "");
    setIsEditOpen(true);
  };

  const handleEditStatus = (surat: SuratKelahiran) => {
    setSelectedSurat(surat);
    setNewStatus(surat.status as "pending" | "finish");
    setIsStatusEditOpen(true);
  };

  const handleUpdateNomorLocal = () => {
    handleUpdateNomor(selectedSurat, nomorSurat, updateMutation);
  };

  const handleUpdateStatusLocal = () => {
    handleUpdateStatus(selectedSurat, newStatus, updateMutation);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  console.log(suratList?.map((surat) => surat.timestamp));

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Surat Keterangan Kelahiran</h1>
            <p className="text-muted-foreground">
              Kelola permohonan surat keterangan kelahiran dari warga desa
            </p>
          </div>
        </div>

        {/* Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Permohonan</CardTitle>
            <CardDescription>
              Filter permohonan berdasarkan status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={selectedStatus}
                  onValueChange={(value: any) => setSelectedStatus(value)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="finish">Selesai</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Permohonan Surat Keterangan Kelahiran</CardTitle>
            <CardDescription>
              {suratList?.length || 0} permohonan ditemukan
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="bg-destructive/10 text-destructive p-4 rounded-md">
                Error loading data. Please try again.
              </div>
            ) : isLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <div className="border rounded-md overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Anak</TableHead>
                      <TableHead>Nama Orang Tua</TableHead>
                      <TableHead>Tanggal Pengajuan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Nomor Surat</TableHead>
                      <TableHead className="w-[200px]">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suratList && suratList.length > 0 ? (
                      suratList.map((surat: SuratKelahiran) => (
                        <TableRow key={surat.id}>
                          <TableCell className="font-medium">
                            {surat.data.namaLengkapAnak}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>Ayah: {surat.data.namaAyah}</div>
                              <div>Ibu: {surat.data.namaIbu}</div>
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(surat.timestamp)}</TableCell>
                          <TableCell>
                            <button onClick={() => handleEditStatus(surat)}>
                              {getStatusBadge(surat.status)}
                            </button>
                          </TableCell>
                          <TableCell>
                            <button
                              onClick={() => handleEditNomor(surat)}
                              className="text-left hover:underline"
                            >
                              {surat.nomorSurat || "Belum ada nomor"}
                            </button>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleViewDetail(surat)}
                                size="sm"
                                variant="outline"
                                title="Lihat Detail"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {surat.nomorSurat && (
                                <PDFDownloadLink
                                  document={
                                    <SuratKelahiranPDFDocument data={surat} />
                                  }
                                  fileName={`surat-kelahiran-${surat.data.namaLengkapAnak
                                    .replace(/\s+/g, "-")
                                    .toLowerCase()}.pdf`}
                                >
                                  {({ loading }) => (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      disabled={loading}
                                      title="Download PDF"
                                    >
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  )}
                                </PDFDownloadLink>
                              )}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-destructive hover:text-destructive"
                                    title="Hapus"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Hapus Permohonan Surat
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Apakah Anda yakin ingin menghapus
                                      permohonan surat keterangan kelahiran
                                      untuk{" "}
                                      <strong>
                                        {surat.data.namaLengkapAnak}
                                      </strong>
                                      ? Tindakan ini tidak dapat dibatalkan.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(surat.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Hapus
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Belum ada permohonan surat keterangan kelahiran
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Nomor Surat Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Edit Nomor Surat</DialogTitle>
              <DialogDescription>
                Masukkan nomor surat untuk permohonan ini
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nomorSurat">Nomor Surat</Label>
                <Input
                  id="nomorSurat"
                  value={nomorSurat}
                  onChange={(e) => setNomorSurat(e.target.value)}
                  placeholder="Contoh: 470/424.320.02/2025"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Batal
              </Button>
              <Button
                onClick={handleUpdateNomorLocal}
                disabled={updateMutation.isPending || !nomorSurat.trim()}
              >
                {updateMutation.isPending ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Status Dialog */}
        <Dialog open={isStatusEditOpen} onOpenChange={setIsStatusEditOpen}>
          <DialogContent className="max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Edit Status Permohonan</DialogTitle>
              <DialogDescription>
                Ubah status permohonan surat
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={newStatus}
                  onValueChange={(value: any) => setNewStatus(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="finish">Selesai</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsStatusEditOpen(false)}
              >
                Batal
              </Button>
              <Button
                onClick={handleUpdateStatusLocal}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
