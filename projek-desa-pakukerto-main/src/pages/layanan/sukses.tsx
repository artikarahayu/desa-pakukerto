import PublicLayout from "@/components/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle,
  Clock,
  MessageCircle,
  FileText,
  ArrowLeft,
} from "lucide-react";
import Head from "next/head";
import Link from "next/link";

export default function SuratSuksesPage() {
  return (
    <>
      <Head>
        <title>Permohonan Berhasil Dikirim | Desa Pakukerto</title>
        <meta
          name="description"
          content="Permohonan surat Anda berhasil dikirim dan sedang dalam proses verifikasi"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta
          property="og:url"
          content="https://www.desapakukerto.id/layanan/sukses"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Permohonan Berhasil Dikirim | Desa Pakukerto"
        />
        <meta
          property="og:description"
          content="Permohonan surat Anda berhasil dikirim dan sedang dalam proses verifikasi"
        />
        <meta property="og:image" content="/images/hero-2.webp" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="desapakukerto.id" />
        <meta
          property="twitter:url"
          content="https://www.desapakukerto.id/layanan/sukses"
        />
        <meta
          name="twitter:title"
          content="Permohonan Berhasil Dikirim | Desa Pakukerto"
        />
        <meta
          name="twitter:description"
          content="Permohonan surat Anda berhasil dikirim dan sedang dalam proses verifikasi"
        />
        <meta name="twitter:image" content="/images/hero-2.webp" />
      </Head>
      <PublicLayout>
        <div className="container mx-auto py-12 px-4 pb-20">
          <div className="max-w-2xl mx-auto">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-green-100 p-4">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Permohonan Berhasil Dikirim!
              </h1>
              <p className="text-lg text-muted-foreground">
                Terima kasih telah mengajukan permohonan surat layanan desa
              </p>
            </div>

            {/* Next Steps */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Langkah Selanjutnya</CardTitle>
                <CardDescription>
                  Apa yang akan terjadi setelah ini?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-blue-100 p-2 mt-1">
                      <span className="text-blue-600 font-semibold text-sm">
                        1
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Verifikasi Data</h4>
                      <p className="text-sm text-muted-foreground">
                        Petugas desa akan memverifikasi kelengkapan dan
                        keakuratan data yang Anda kirimkan
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-blue-100 p-2 mt-1">
                      <span className="text-blue-600 font-semibold text-sm">
                        2
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Pembuatan Surat</h4>
                      <p className="text-sm text-muted-foreground">
                        Jika data sudah lengkap dan benar, surat akan dibuatkan
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-green-100 p-2 mt-1">
                      <span className="text-green-600 font-semibold text-sm">
                        3
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Pengiriman Surat</h4>
                      <p className="text-sm text-muted-foreground">
                        Surat yang sudah jadi akan dikirim ke nomor WhatsApp
                        yang Anda berikan
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Important Notes */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-blue-500" />
                  Catatan Penting
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Waktu Pemrosesan:</strong> Biasanya membutuhkan
                    waktu 1-3 hari kerja
                  </p>
                  <p className="text-sm">
                    <strong>Notifikasi:</strong> Anda akan dihubungi melalui
                    WhatsApp jika ada informasi tambahan yang diperlukan
                  </p>
                  <p className="text-sm">
                    <strong>Pengiriman:</strong> Surat akan dikirim dalam format
                    PDF melalui WhatsApp
                  </p>
                  <p className="text-sm">
                    <strong>Pertanyaan:</strong> Jika ada pertanyaan, silakan
                    hubungi kantor desa di jam kerja
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Kembali ke Beranda
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </PublicLayout>
    </>
  );
}
