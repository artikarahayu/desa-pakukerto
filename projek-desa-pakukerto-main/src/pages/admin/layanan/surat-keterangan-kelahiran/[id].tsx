import AdminLayout from "@/components/layouts/AdminLayout";
import { SuratKelahiranPDFDocument } from "@/components/pdf/SuratKelahiranPDFDocument";
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
import { suratKelahiranApi } from "@/lib/admin/surat-kelahiran";
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
import {
  handleUpdateNomorDetail,
  handleUpdateStatusDetail,
  createWhatsAppContactHandler,
  formatDate,
  getStatusBadge,
} from "@/lib/admin/surat-helpers";

export default function SuratKelahiranDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const queryClient = useQueryClient();

  const [isEditNomorOpen, setIsEditNomorOpen] = useState(false);
  const [isEditStatusOpen, setIsEditStatusOpen] = useState(false);

  const [nomorSurat, setNomorSurat] = useState("");
  const [newStatus, setNewStatus] = useState<"pending" | "finish">("pending");

  // Query to fetch single surat kelahiran
  const {
    data: surat,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["surat-kelahiran", id],
    queryFn: async () => {
      if (!id || typeof id !== "string") return null;

      // Get all surat and find the specific one by ID
      const allSurat = await suratKelahiranApi.getAll();
      return allSurat.find((s) => s.id === id) || null;
    },
    enabled: !!id,
  });

  // Mutation to update surat
  const updateMutation = useMutation({
    mutationFn: ({ data }: { data: any }) =>
      suratKelahiranApi.update(id as string, data),
    onSuccess: () => {
      toast.success("Surat berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["surat-kelahiran"] });
      queryClient.invalidateQueries({ queryKey: ["pending-count"] });
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
    "kelahiran"
  );

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
      <Link href="/admin/layanan/surat-keterangan-kelahiran">
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
                Detail Surat Keterangan Kelahiran
              </h1>
              <p className="text-muted-foreground">
                Permohonan untuk {surat.data.namaLengkapAnak}
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
                document={<SuratKelahiranPDFDocument data={surat} />}
                fileName={`surat-kelahiran-${surat.data.namaLengkapAnak
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

        {/* Data Anak */}
        <Card>
          <CardHeader>
            <CardTitle>Data Anak</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Nama Lengkap
                </Label>
                <p className="font-medium">{surat.data.namaLengkapAnak}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Anak ke
                </Label>
                <p className="font-medium">{surat.data.anakKe}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Tempat Lahir
                </Label>
                <p className="font-medium">{surat.data.tempatLahirAnak}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Tanggal Lahir
                </Label>
                <p className="font-medium">{surat.data.tanggalLahirAnak}</p>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Alamat
              </Label>
              <p className="font-medium">{surat.data.alamatAnak}</p>
            </div>
          </CardContent>
        </Card>

        {/* Data Orang Tua */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Data Ayah */}
          <Card>
            <CardHeader>
              <CardTitle>Data Ayah</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Nama Lengkap
                </Label>
                <p className="font-medium">{surat.data.namaAyah}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  NIK
                </Label>
                <p className="font-medium">{surat.data.nikAyah}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Tempat Lahir
                </Label>
                <p className="font-medium">{surat.data.tempatLahirAyah}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Tanggal Lahir
                </Label>
                <p className="font-medium">{surat.data.tanggalLahirAyah}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Alamat
                </Label>
                <p className="font-medium">{surat.data.alamatAyah}</p>
              </div>
            </CardContent>
          </Card>

          {/* Data Ibu */}
          <Card>
            <CardHeader>
              <CardTitle>Data Ibu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Nama Lengkap
                </Label>
                <p className="font-medium">{surat.data.namaIbu}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  NIK
                </Label>
                <p className="font-medium">{surat.data.nikIbu}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Tempat Lahir
                </Label>
                <p className="font-medium">{surat.data.tempatLahirIbu}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Tanggal Lahir
                </Label>
                <p className="font-medium">{surat.data.tanggalLahirIbu}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Alamat
                </Label>
                <p className="font-medium">{surat.data.alamatIbu}</p>
              </div>
            </CardContent>
          </Card>
        </div>

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

        {/* Penolong Kelahiran */}
        <Card>
          <CardHeader>
            <CardTitle>Penolong Kelahiran</CardTitle>
            <CardDescription>
              Informasi tentang penolong kelahiran
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Nama Penolong Kelahiran
                </Label>
                <p className="font-medium">{surat.data.penolongKelahiran}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Alamat Penolong
                </Label>
                <p className="font-medium">{surat.data.alamatPenolong}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Keperluan */}
        <Card>
          <CardHeader>
            <CardTitle>Keperluan</CardTitle>
            <CardDescription>
              Tujuan pengajuan surat keterangan kelahiran
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
