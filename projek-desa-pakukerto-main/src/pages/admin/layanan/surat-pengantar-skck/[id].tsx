import AdminLayout from "@/components/layouts/AdminLayout";
import { SuratPengantarSKCKPDFDocument } from "@/components/pdf/SuratPengantarSKCKPDFDocument";
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
  createWhatsAppContactHandler,
  handleUpdateNomorDetail,
  handleUpdateStatusDetail,
} from "@/lib/admin/surat-helpers";
import { suratPengantarSKCKApi } from "@/lib/admin/surat-pengantar-skck";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Download,
  Edit,
  MessageCircle,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "sonner";

export default function SuratPengantarSKCKDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const queryClient = useQueryClient();

  const [isEditNomorOpen, setIsEditNomorOpen] = useState(false);
  const [isEditStatusOpen, setIsEditStatusOpen] = useState(false);

  const [nomorSurat, setNomorSurat] = useState("");
  const [newStatus, setNewStatus] = useState<"pending" | "finish">("pending");

  // Query to fetch single surat pengantar SKCK
  const {
    data: surat,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["surat-pengantar-skck", id],
    queryFn: async () => {
      if (!id || typeof id !== "string") return null;

      // Get all surat and find the specific one by ID
      const allSurat = await suratPengantarSKCKApi.getAll();
      return allSurat.find((s) => s.id === id) || null;
    },
    enabled: !!id,
  });

  // Mutation to update surat
  const updateMutation = useMutation({
    mutationFn: ({ data }: { data: any }) =>
      suratPengantarSKCKApi.update(id as string, data),
    onSuccess: () => {
      toast.success("Surat berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["surat-pengantar-skck"] });
      queryClient.invalidateQueries({ queryKey: ["admin-pending-count"] });
      setIsEditNomorOpen(false);
      setIsEditStatusOpen(false);
      setNomorSurat("");
    },
    onError: (error) => {
      console.error("Error updating surat:", error);
      toast.error("Gagal memperbarui surat");
    },
  });

  const handleEditNomor = () => {
    if (!surat) return;
    setNomorSurat(surat.nomorSurat || "");
    setIsEditNomorOpen(true);
  };

  const handleEditStatus = () => {
    if (!surat) return;
    setNewStatus(surat.status as "pending" | "finish");
    setIsEditStatusOpen(true);
  };

  const handleUpdateNomorLocal = () => {
    handleUpdateNomorDetail(nomorSurat, updateMutation);
  };

  const handleUpdateStatusLocal = () => {
    handleUpdateStatusDetail(newStatus, updateMutation);
  };

  const handleWhatsAppContactLocal = createWhatsAppContactHandler(
    surat,
    "skck"
  );

  const formatDate = (timestamp: any) => {
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

    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateOnly = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
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

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="text-center py-8">Loading...</div>
      </AdminLayout>
    );
  }

  if (error || !surat) {
    return (
      <AdminLayout>
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          Surat tidak ditemukan atau terjadi kesalahan.
        </div>
      </AdminLayout>
    );
  }

  console.log("surat", surat);

  return (
    <AdminLayout>
      <Link href="/admin/layanan/surat-pengantar-skck">
        <Button variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </Link>

      <div className="space-y-6 mt-2">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-2 md:items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">
                Detail Surat Pengantar SKCK
              </h1>
              <p className="text-muted-foreground">
                Permohonan untuk {surat.data.namaLengkap}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleWhatsAppContactLocal}
              variant="outline"
              className="text-green-600 hover:text-background"
            >
              <MessageCircle className="h-4 w-4 " />
              Hubungi
            </Button>
            {surat.nomorSurat && (
              <PDFDownloadLink
                document={<SuratPengantarSKCKPDFDocument data={surat} />}
                fileName={`surat-pengantar-skck-${surat.data.namaLengkap
                  .replace(/\s+/g, "-")
                  .toLowerCase()}.pdf`}
              >
                {({ loading }) => (
                  <Button disabled={loading}>
                    <Download className="h-4 w-4 mr-2" />
                    {loading ? "Generating..." : "Download PDF"}
                  </Button>
                )}
              </PDFDownloadLink>
            )}
          </div>
        </div>

        {/* Status and Nomor Surat */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status Permohonan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  {getStatusBadge(surat.status)}
                  <p className="text-sm text-muted-foreground mt-1">
                    Diajukan pada {formatDate(surat.timestamp)}
                  </p>
                </div>
                <Button onClick={handleEditStatus} variant="outline" size="sm">
                  <Edit className="h-4 w-4 " />
                  Ubah Status
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Nomor Surat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {surat.nomorSurat || "Belum ada nomor"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {surat.nomorSurat && "Nomor surat resmi"}
                  </p>
                </div>
                <Button onClick={handleEditNomor} variant="outline" size="sm">
                  <Edit className="h-4 w-4 " />
                  Edit Nomor
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Pemohon */}
        <Card>
          <CardHeader>
            <CardTitle>Data Pemohon</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Nama Lengkap
                </Label>
                <p className="font-medium">{surat.data.namaLengkap}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  NIK
                </Label>
                <p className="font-medium">{surat.data.nik}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Tempat Lahir
                </Label>
                <p className="font-medium">{surat.data.tempatLahir}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Tanggal Lahir
                </Label>
                <p className="font-medium">
                  {formatDateOnly(surat.data.tanggalLahir)}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Jenis Kelamin
                </Label>
                <p className="font-medium">{surat.data.jenisKelamin}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Agama
                </Label>
                <p className="font-medium">{surat.data.agama}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Status Perkawinan
                </Label>
                <p className="font-medium">{surat.data.statusPerkawinan}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Pekerjaan
                </Label>
                <p className="font-medium">{surat.data.pekerjaan}</p>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Alamat
              </Label>
              <p className="font-medium">{surat.data.alamat}</p>
            </div>
          </CardContent>
        </Card>

        {/* Kontak */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Kontak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{surat.wa}</span>
              <Button
                onClick={handleWhatsAppContactLocal}
                variant="outline"
                size="sm"
                className="ml-auto text-green-600 hover:text-background"
              >
                <MessageCircle className="h-4 w-4" />
                Hubungi via WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Keperluan */}
        <Card>
          <CardHeader>
            <CardTitle>Keperluan SKCK</CardTitle>
            <CardDescription>
              Tujuan pengajuan surat pengantar SKCK
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{surat.data.keperluan}</p>
          </CardContent>
        </Card>

        {/* Edit Nomor Surat Dialog */}
        <Dialog open={isEditNomorOpen} onOpenChange={setIsEditNomorOpen}>
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
              <Button
                variant="outline"
                onClick={() => setIsEditNomorOpen(false)}
              >
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
        <Dialog open={isEditStatusOpen} onOpenChange={setIsEditStatusOpen}>
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
                onClick={() => setIsEditStatusOpen(false)}
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
