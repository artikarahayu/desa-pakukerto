import React from "react";
import { GetStaticProps } from "next";
import Head from "next/head";
import BeritaCard from "@/components/public/berita/BeritaCard";
import { getPublishedBerita, BeritaPublicData } from "@/lib/public/berita";
import PublicLayout from "@/components/layouts/PublicLayout";
import { FileText } from "lucide-react";

interface BeritaPageProps {
  beritaList: BeritaPublicData[];
}

const BeritaPage: React.FC<BeritaPageProps> = ({ beritaList }) => {
  return (
    <>
      <Head>
        <title>Berita Desa - Desa Pakukerto</title>
        <meta
          name="description"
          content="Berita dan informasi terbaru dari Desa Pakukerto"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta property="og:url" content="https://www.desapakukerto.id/berita" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Berita Desa - Desa Pakukerto" />
        <meta
          property="og:description"
          content="Berita dan informasi terbaru dari Desa Pakukerto"
        />
        <meta property="og:image" content="/images/hero-2.webp" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="desapakukerto.id" />
        <meta
          property="twitter:url"
          content="https://www.desapakukerto.id/berita"
        />
        <meta name="twitter:title" content="Berita Desa - Desa Pakukerto" />
        <meta
          name="twitter:description"
          content="Berita dan informasi terbaru dari Desa Pakukerto"
        />
        <meta name="twitter:image" content="/images/hero-2.webp" />
      </Head>

      <PublicLayout>
        <div className="min-h-screen bg-background w-full flex flex-col lg:flex-row">
          {/* Page Header */}
          <div className="relative bg-gradient-to-b from-primary/80 to-accent py-16 text-center w-full lg:max-w-[18rem]">
            <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-center mb-4 gap-1.5">
                <FileText className="h-6 w-6 text-primary-foreground" />
                <h1 className="text-2xl md:text-xl lg:text-2xl font-bold text-primary-foreground text-nowrap">
                  Berita Desa
                </h1>
              </div>
              <p className="mt-2 text-lg text-primary-foreground/90">
                Informasi dan berita terbaru dari Desa Pakukerto
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="mx-auto max-w-[86rem] px-4 pt-12 sm:px-6 lg:px-8 mb-24">
            {beritaList.length === 0 ? (
              <div className="rounded-xl border border-border bg-backgorund p-12 text-center shadow-sm">
                <h3 className="text-lg font-medium text-foreground">
                  Belum ada berita yang dipublikasikan
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Berita dan informasi terbaru akan segera ditambahkan.
                </p>
              </div>
            ) : (
              <div className="space-y-12">
                {/* Featured news */}
                {beritaList.length > 0 && (
                  <div className="animate-fade-in-up">
                    <BeritaCard berita={beritaList[0]} featured={true} />
                  </div>
                )}

                {/* News grid */}
                {beritaList.length > 1 && (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in-up">
                    {beritaList.slice(1).map((berita, index) => (
                      <BeritaCard
                        key={berita.id}
                        berita={berita}
                        index={index}
                      />
                    ))}
                  </div>
                )}
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
    const beritaList = await getPublishedBerita();

    return {
      props: {
        beritaList: JSON.parse(JSON.stringify(beritaList)),
      },
      // Revalidate every 1 minutes
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error fetching berita:", error);
    return {
      props: {
        beritaList: [],
      },
      revalidate: 60,
    };
  }
};

export default BeritaPage;
