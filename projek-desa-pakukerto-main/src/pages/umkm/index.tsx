import React from "react";
import { GetStaticProps } from "next";
import Head from "next/head";
import UmkmCard from "@/components/public/umkm/UmkmCard";
import { getAllUmkm } from "@/lib/public/umkm";
import { Umkm } from "@/schemas/umkm.schema";
import { Store } from "lucide-react";
import PublicLayout from "@/components/layouts/PublicLayout";

interface UmkmCatalogPageProps {
  umkmProducts: Umkm[];
}

const UmkmCatalogPage: React.FC<UmkmCatalogPageProps> = ({ umkmProducts }) => {
  console.log(umkmProducts);
  return (
    <>
      <Head>
        <title>Katalog Produk UMKM - Desa Pakukerto</title>
        <meta
          name="description"
          content="Temukan berbagai produk unggulan dari UMKM Desa Pakukerto"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta property="og:url" content="https://www.desapakukerto.id/umkm" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Katalog Produk UMKM - Desa Pakukerto"
        />
        <meta
          property="og:description"
          content="Temukan berbagai produk unggulan dari UMKM Desa Pakukerto"
        />
        <meta property="og:image" content="/images/hero-2.webp" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="desapakukerto.id" />
        <meta
          property="twitter:url"
          content="https://www.desapakukerto.id/umkm"
        />
        <meta
          name="twitter:title"
          content="Katalog Produk UMKM - Desa Pakukerto"
        />
        <meta
          name="twitter:description"
          content="Temukan berbagai produk unggulan dari UMKM Desa Pakukerto"
        />
        <meta name="twitter:image" content="/images/hero-2.webp" />
      </Head>

      <PublicLayout>
        <div className="min-h-screen bg-background w-full flex flex-col lg:flex-row">
          {/* Page Header */}
          <div className="relative bg-gradient-to-b from-primary/80 to-accent py-16 text-center w-full lg:max-w-[18rem]">
            <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-center mb-4 gap-1.5">
                <Store className="h-6 w-6 text-primary-foreground" />
                <h1 className="text-2xl md:text-xl lg:text-2xl font-bold text-primary-foreground">
                  Produk UMKM
                </h1>
              </div>
              <p className="mt-2 text-lg text-primary-foreground/90">
                Temukan berbagai produk unggulan dari UMKM Desa Pakukerto
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="mx-auto max-w-[86rem] px-4 pt-12 sm:px-6 lg:px-8 mb-24">
            {umkmProducts.length === 0 ? (
              <div className="rounded-xl border border-border bg-backgorund p-12 text-center shadow-sm">
                <Store className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground">
                  Belum Ada Produk UMKM
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Produk UMKM akan segera ditambahkan. Silakan kunjungi kembali
                  nanti.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 animate-fade-in-up">
                {umkmProducts.map((product, index) => (
                  <UmkmCard key={product.id} product={product} index={index} />
                ))}
              </div>
            )}
          </div>
        </div>
      </PublicLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  try {
    const umkmProducts = await getAllUmkm();

    return {
      props: {
        umkmProducts: JSON.parse(JSON.stringify(umkmProducts)),
      },
      // Revalidate every 1 minutes (60 seconds)
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error fetching UMKM products:", error);
    return {
      props: {
        umkmProducts: [],
      },
      revalidate: 60,
    };
  }
};

export default UmkmCatalogPage;
