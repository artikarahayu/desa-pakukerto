import PublicLayout from "@/components/layouts/PublicLayout";
import { VillageStructureGallery } from "@/components/public/bagan-desa/village-structure-gallery";
import StrukturCard from "@/components/public/struktur/StrukturCard";
import { db } from "@/lib/firebase";
import { getAllStruktur, StrukturPublicData } from "@/lib/public/struktur";
import { doc, getDoc } from "firebase/firestore";
import { GetStaticProps } from "next";
import Head from "next/head";

interface StrukturPageProps {
  pejabatList: StrukturPublicData[];
  baganDesa: {
    images: string[];
    updatedAt?: string;
  };
}

export default function StrukturPage({
  pejabatList,
  baganDesa,
}: StrukturPageProps) {
  return (
    <>
      <Head>
        <title>Struktur Organisasi - Desa Pakukerto</title>
        <meta
          name="description"
          content="Struktur Organisasi Pemerintahan Desa Pakukerto"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta
          property="og:url"
          content="https://www.desapakukerto.id/struktur-organisasi"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Struktur Organisasi - Desa Pakukerto"
        />
        <meta
          property="og:description"
          content="Struktur Organisasi Pemerintahan Desa Pakukerto"
        />
        <meta property="og:image" content="/images/hero-2.webp" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="desapakukerto.id" />
        <meta
          property="twitter:url"
          content="https://www.desapakukerto.id/struktur-organisasi"
        />
        <meta
          name="twitter:title"
          content="Struktur Organisasi - Desa Pakukerto"
        />
        <meta
          name="twitter:description"
          content="Struktur Organisasi Pemerintahan Desa Pakukerto"
        />
        <meta name="twitter:image" content="/images/hero-2.webp" />
      </Head>
      <PublicLayout>
        <div className="container mx-auto py-12 px-4 pb-20 max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Struktur Organisasi
          </h1>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Struktur Organisasi dan Tata Kerja Pemerintahan Desa Pakukerto
          </p>

          {/* Bagan Desa Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-1 bg-primary rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-bold">Bagan Desa</h2>
            </div>
            <div className="bg-backgorund p-6 md:p-8 rounded-lg border border-border shadow-sm">
              <VillageStructureGallery
                images={baganDesa.images || []}
                title="Struktur Organisasi Desa Pakukerto"
                emptyMessage="Gambar struktur organisasi desa belum tersedia."
              />
            </div>
          </section>

          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-1 bg-primary rounded-full"></div>
            <h2 className="text-2xl md:text-3xl font-bold">
              Pejabat Pemerintah Desa
            </h2>
          </div>

          {/* Grid Pejabat */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {pejabatList?.length > 0 ? (
              pejabatList.map((pejabat, index) => (
                <StrukturCard
                  key={pejabat.id}
                  pejabat={pejabat}
                  index={index}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">
                  Belum ada data pejabat yang tersedia.
                </p>
              </div>
            )}
          </div>
        </div>
      </PublicLayout>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const strukturList = await getAllStruktur();
  const sortedStruktur = strukturList.sort((a, b) => a.createdAt - b.createdAt);
  // Fetch bagan desa data
  const baganDesaDoc = await getDoc(doc(db, "profilDesa", "baganDesa"));
  const baganDesaData = baganDesaDoc.exists()
    ? {
        images: baganDesaDoc.data().images || [],
        updatedAt: baganDesaDoc.data().updatedAt,
      }
    : { images: [] };

  return {
    props: {
      pejabatList: JSON.parse(JSON.stringify(sortedStruktur)),
      baganDesa: baganDesaData,
    },
    // Revalidate every 1 hour
    revalidate: 3600,
  };
};
