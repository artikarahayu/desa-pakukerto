import PublicLayout from "@/components/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { getAllUmkm, getUmkmById } from "@/lib/public/umkm";
import { Umkm } from "@/schemas/umkm.schema";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Share2,
} from "lucide-react";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

interface UmkmDetailPageProps {
  umkm: Umkm;
}

const UmkmDetailPage: React.FC<UmkmDetailPageProps> = ({ umkm }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!umkm) return null;

  const { nama, gambar, deskripsi, whatsapp, harga, createdAt } = umkm;

  // Format WhatsApp URL
  const whatsappUrl = `https://wa.me/${whatsapp}?text=Halo,%20saya%20tertarik%20dengan%20produk%20${encodeURIComponent(
    nama
  )}`;

  // Handle image navigation
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === gambar.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? gambar.length - 1 : prev - 1));
  };

  // Handle share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Produk UMKM: ${nama}`,
          text: deskripsi.substring(0, 100) + "...",
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <>
      <Head>
        <title>{nama} - Produk UMKM Desa Pakukerto</title>
        <meta name="description" content={deskripsi.substring(0, 160)} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta
          property="og:url"
          content={`https://www.desapakukerto.id/umkm/${umkm.id}`}
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`${nama} - Produk UMKM Desa Pakukerto`}
        />
        <meta property="og:description" content={deskripsi.substring(0, 160)} />
        <meta property="og:image" content={gambar[0]} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="desapakukerto.id" />
        <meta
          property="twitter:url"
          content={`https://www.desapakukerto.id/umkm/${umkm.id}`}
        />
        <meta
          name="twitter:title"
          content={`${nama} - Produk UMKM Desa Pakukerto`}
        />
        <meta
          name="twitter:description"
          content={deskripsi.substring(0, 160)}
        />
        <meta name="twitter:image" content={gambar[0]} />
      </Head>

      <PublicLayout>
        <div className="min-h-screen bg-background pb-20">
          {/* Navigation */}
          <div className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-40">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <Link
                  href="/umkm"
                  className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors duration-300 group"
                >
                  <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                  Kembali ke Katalog
                </Link>
                {/* <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="inline-flex items-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Bagikan
                </Button> */}
              </div>
            </div>
          </div>

          {/* Hero Section */}
          <div className="relative">
            <div className="container mx-auto px-4 py-8 sm:py-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Image Gallery */}
                <div className="space-y-4">
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border shadow-xl">
                    <Image
                      src={gambar[currentImageIndex]}
                      alt={`${nama} - gambar ${currentImageIndex + 1}`}
                      fill
                      className="object-cover"
                      priority
                    />

                    {gambar.length > 1 && (
                      <>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full shadow-lg opacity-80 hover:opacity-100 transition-all duration-300"
                          onClick={prevImage}
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full shadow-lg opacity-80 hover:opacity-100 transition-all duration-300"
                          onClick={nextImage}
                        >
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-full">
                          {currentImageIndex + 1} / {gambar.length}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Navigation */}
                  {gambar.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {gambar.map((img, index) => (
                        <button
                          key={index}
                          className={`relative h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                            currentImageIndex === index
                              ? "ring-2 ring-primary border-primary"
                              : "border-border hover:border-primary/50"
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        >
                          <Image
                            src={img}
                            alt={`${nama} thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex flex-col space-y-6">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 leading-tight">
                      {nama}
                    </h1>
                    <div className="text-2xl font-bold text-primary mb-4">
                      Rp {harga}
                    </div>
                  </div>

                  <div className="prose prose-gray max-w-none">
                    <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                      {deskripsi}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <Button
                      asChild
                      size="lg"
                      className="gap-3 text-base font-semibold bg-green-600 hover:bg-green-700 transform hover:scale-105 transition-all duration-300"
                    >
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="h-5 w-5" />
                        Hubungi via WhatsApp
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleShare}
                      className="gap-3 text-base font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    >
                      <Share2 className="h-5 w-5" />
                      Bagikan Produk
                    </Button>
                  </div>

                  {/* Additional Info */}
                  {/* <div className="bg-backgorund border border-border rounded-xl p-6 space-y-3">
                    <h3 className="font-semibold text-lg text-foreground">
                      Informasi Produk
                    </h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        <span>Ditambahkan: {formatDate(createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-primary" />
                        <span>Kontak: WhatsApp tersedia</span>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action Section */}
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 border-t border-border">
            <div className="container mx-auto px-4 py-12 text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Tertarik dengan produk ini?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Hubungi langsung penjual melalui WhatsApp untuk informasi lebih
                lanjut dan pemesanan.
              </p>
              <Button
                asChild
                size="lg"
                className="gap-3 text-base font-semibold bg-green-600 hover:bg-green-700 transform hover:scale-105 transition-all duration-300"
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" />
                  Chat WhatsApp Sekarang
                </a>
              </Button>
            </div>
          </div>
        </div>
      </PublicLayout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const umkmProducts = await getAllUmkm();
    const paths = umkmProducts.map((umkm) => ({
      params: { id: umkm.id.toString() },
    }));

    return {
      paths,
      fallback: "blocking",
    };
  } catch (error) {
    console.error("Error generating static paths:", error);
    return {
      paths: [],
      fallback: "blocking",
    };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    if (!params?.id) {
      return { notFound: true };
    }

    const umkm = await getUmkmById(params.id as string);

    if (!umkm) {
      return { notFound: true };
    }

    return {
      props: {
        umkm: JSON.parse(JSON.stringify(umkm)),
      },
      // Revalidate every 1 minutes
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error fetching UMKM detail:", error);
    return { notFound: true };
  }
};

export default UmkmDetailPage;
