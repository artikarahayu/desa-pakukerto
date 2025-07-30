import PublicLayout from "@/components/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Head from "next/head";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <>
      <Head>
        <title>Halaman Tidak Ditemukan | Desa Pakukerto</title>
        <meta
          name="description"
          content="Halaman yang Anda cari tidak ditemukan di website Desa Pakukerto"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta property="og:url" content="https://www.desapakukerto.id/404" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Halaman Tidak Ditemukan | Desa Pakukerto"
        />
        <meta
          property="og:description"
          content="Halaman yang Anda cari tidak ditemukan di website Desa Pakukerto"
        />
        <meta property="og:image" content="/images/hero-2.webp" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="desapakukerto.id" />
        <meta
          property="twitter:url"
          content="https://www.desapakukerto.id/404"
        />
        <meta
          name="twitter:title"
          content="Halaman Tidak Ditemukan | Desa Pakukerto"
        />
        <meta
          name="twitter:description"
          content="Halaman yang Anda cari tidak ditemukan di website Desa Pakukerto"
        />
        <meta name="twitter:image" content="/images/hero-2.webp" />
      </Head>
      <PublicLayout>
        <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto">
            <div className="flex justify-center mb-6">
              <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                <AlertCircle className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-2">
              Halaman Tidak Ditemukan
            </h2>
            <p className="text-muted-foreground mb-8">
              Maaf, halaman yang Anda cari tidak ditemukan atau telah
              dipindahkan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/">Kembali ke Beranda</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/profil-desa">Profil Desa</Link>
              </Button>
            </div>
          </div>
        </div>
      </PublicLayout>
    </>
  );
}
