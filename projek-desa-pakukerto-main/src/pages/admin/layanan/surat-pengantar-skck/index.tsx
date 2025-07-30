import AdminLayout from "@/components/layouts/AdminLayout";
import { SuratPengantarSKCKPDFDocument } from "@/components/pdf/SuratPengantarSKCKPDFDocument";
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
import { Badge } from "@/components/ui/badge";
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
  handleUpdateNomor,
  handleUpdateStatus,
} from "@/lib/admin/surat-helpers";
import { suratPengantarSKCKApi } from "@/lib/admin/surat-pengantar-skck";
import { SuratPengantarSKCK } from "@/schemas/surat-pengantar-skck.schema";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Clock, Download, Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "sonner";

export default function SuratPengantarSKCKAdminPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "pending" | "finish"
  >("all");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isStatusEditOpen, setIsStatusEditOpen] = useState(false);
  const [selectedSurat, setSelectedSurat] = useState<SuratPengantarSKCK | null>(
    null
  );
  const [nomorSurat, setNomorSurat] = useState("");
  const [newStatus, setNewStatus] = useState<"pending" | "finish">("pending");

  // Query to fetch surat pengantar SKCK
  const {
    data: suratList,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["surat-pengantar-skck", selectedStatus],
    queryFn: () =>
      suratPengantarSKCKApi.getAll(
        selectedStatus === "all" ? undefined : selectedStatus
      ),
  });

  // Mutation to update surat
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      suratPengantarSKCKApi.update(id, data),
    onSuccess: () => {
      toast.success("Surat berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["surat-pengantar-skck"] });
      queryClient.invalidateQueries({ queryKey: ["admin-pending-count"] });
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
    mutationFn: (id: string) => suratPengantarSKCKApi.delete(id),
    onSuccess: () => {
      toast.success("Surat berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["surat-pengantar-skck"] });
      queryClient.invalidateQueries({ queryKey: ["admin-pending-count"] });
    },
    onError: (error) => {
      console.error("Error deleting surat:", error);
      toast.error("Gagal menghapus surat");
    },
  });

  const handleViewDetail = (surat: SuratPengantarSKCK) => {
    router.push(`/admin/layanan/surat-pengantar-skck/${surat.id}`);
  };

  const handleEditNomor = (surat: SuratPengantarSKCK) => {
    setSelectedSurat(surat);
    setNomorSurat(surat.nomorSurat || "");
    setIsEditOpen(true);
  };

  const handleEditStatus = (surat: SuratPengantarSKCK) => {
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

  // Custom formatDate for Firestore timestamps
  const formatDateFirestore = (timestamp: any) => {
    if (!timestamp) return "-";

    let date;
    // Handle Firestore Timestamp object
    if (timestamp._seconds && timestamp._nanoseconds) {
      // Convert Firestore timestamp to milliseconds
      date = new Date(timestamp._seconds * 1000);
    }
    // Handle toDate() method from Firestore
    else if (timestamp.toDate && typeof timestamp.toDate === "function") {
      date = timestamp.toDate();
    }
    // Handle regular JavaScript timestamp (number)
    else {
      date = new Date(timestamp);
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.error("Invalid date from timestamp:", timestamp);
      return "-";
    }

    return formatDate(date.getTime());
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "finish":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Selesai
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  console.log(suratList?.map((surat) => surat.timestamp));

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Surat Pengantar SKCK</h1>
            <p className="text-muted-foreground">
              Kelola permohonan surat pengantar SKCK dari warga desa
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
            <CardTitle>Daftar Permohonan Surat Pengantar SKCK</CardTitle>
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
                      <TableHead>Nama Lengkap</TableHead>
                      <TableHead>NIK</TableHead>
                      <TableHead>Keperluan</TableHead>
                      <TableHead>Tanggal Pengajuan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Nomor Surat</TableHead>
                      <TableHead className="w-[200px]">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suratList && suratList.length > 0 ? (
                      suratList.map((surat: SuratPengantarSKCK) => (
                        <TableRow key={surat.id}>
                          <TableCell className="font-medium">
                            {surat.data.namaLengkap}
                          </TableCell>
                          <TableCell>{surat.data.nik}</TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {surat.data.keperluan}
                          </TableCell>
                          <TableCell>
                            {formatDateFirestore(surat.timestamp)}
                          </TableCell>
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
                                    <SuratPengantarSKCKPDFDocument
                                      data={surat}
                                    />
                                  }
                                  fileName={`surat-pengantar-skck-${surat.data.namaLengkap
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
                                      permohonan surat pengantar SKCK untuk{" "}
                                      <strong>{surat.data.namaLengkap}</strong>?
                                      Tindakan ini tidak dapat dibatalkan.
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
                        <TableCell colSpan={7} className="text-center py-8">
                          Belum ada permohonan surat pengantar SKCK
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
