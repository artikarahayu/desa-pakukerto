import PublicLayout from "@/components/layouts/PublicLayout";
import HeroCarousel, { CarouselItem } from "@/components/public/HeroCarousel";
import SupportBySection from "@/components/public/SupportBySection";
import BeritaCard from "@/components/public/berita/BeritaCard";
import StrukturCard from "@/components/public/struktur/StrukturCard";
import UmkmCard from "@/components/public/umkm/UmkmCard";
import { Button } from "@/components/ui/button";
import { BeritaPublicData, getPublishedBerita } from "@/lib/public/berita";
import { getAllStruktur, StrukturPublicData } from "@/lib/public/struktur";
import { getFeaturedUmkm } from "@/lib/public/umkm";
import { Umkm } from "@/schemas/umkm.schema";
import { ArrowRight, Newspaper, Store, Users } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { GetStaticProps } from "next/types";

interface HomePageProps {
  latestBerita: BeritaPublicData[];
  latestUmkm: Umkm[];
  strukturOrganisasi: StrukturPublicData[];
}

// Hero carousel items
const heroItems: CarouselItem[] = [
  {
    id: "hero-1",
    imageUrl: "/images/hero-2.webp",
    title: "Selamat Datang di Website Resmi Desa Pakukerto",
    description: "Desa yang asri dengan keindahan alam dan budaya yang kaya",
    buttonText: "Tentang Kami",
    buttonLink: "/profil-desa",
  },
  {
    id: "hero-2",
    imageUrl: "/images/hero-1.webp",
    title: "Berita Terkini",
    description: "Ikuti perkembangan terbaru dari Desa Pakukerto",
    buttonText: "Baca Berita",
    buttonLink: "/berita",
  },
  {
    id: "hero-3",
    imageUrl: "/images/hero-3.webp",
    title: "Produk UMKM Unggulan",
    description:
      "Temukan berbagai produk lokal berkualitas dari UMKM Desa Pakukerto",
    buttonText: "Lihat Katalog",
    buttonLink: "/umkm",
  },
];

export default function Home({
  latestBerita,
  latestUmkm,
  strukturOrganisasi,
}: HomePageProps) {
  return (
    <>
      <Head>
        <title>Desa Pakukerto - Website Resmi</title>
        <meta
          name="description"
          content="Website Resmi Desa Pakukerto - Informasi, berita, dan produk UMKM dari Desa Pakukerto"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta
          name="description"
          content="Website Resmi Desa Pakukerto - Informasi, berita, dan produk UMKM dari Desa Pakukerto"
        />

        <meta property="og:url" content="https://www.desapakukerto.id/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Desa Pakukerto - Website Resmi" />
        <meta
          property="og:description"
          content="Website Resmi Desa Pakukerto - Informasi, berita, dan produk UMKM dari Desa Pakukerto"
        />
        <meta property="og:image" content="/images/hero-2.webp" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="desapakukerto.id" />
        <meta property="twitter:url" content="https://www.desapakukerto.id/" />
        <meta name="twitter:title" content="Desa Pakukerto - Website Resmi" />
        <meta
          name="twitter:description"
          content="Website Resmi Desa Pakukerto - Informasi, berita, dan produk UMKM dari Desa Pakukerto"
        />
        <meta name="twitter:image" content="/images/hero-2.webp" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PublicLayout>
        {/* Hero Carousel */}
        <section className="w-full">
          <div className="hidden md:block">
            <HeroCarousel items={heroItems} showControls={true} />
          </div>
          <div className="block md:hidden">
            <HeroCarousel items={heroItems} showControls={false} />
          </div>
        </section>

        {/* Struktur Organisasi Section */}
        <section className="py-16 md:px-8">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-bold">Struktur Organisasi</h2>
                </div>
                <p className="text-muted-foreground">
                  Pejabat Pemerintahan Desa Pakukerto
                </p>
              </div>
              <Button asChild variant="outline" className="group">
                <Link
                  href="/struktur-organisasi"
                  className="flex items-center gap-2"
                >
                  Lihat Semua
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>

            {strukturOrganisasi.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Belum ada data pejabat yang tersedia
                </p>
              </div>
            ) : (
              <div className="flex gap-6 overflow-auto">
                {strukturOrganisasi.map((pejabat) => (
                  <StrukturCard
                    key={pejabat.id}
                    pejabat={pejabat}
                    isHome={true}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Latest News Section */}
        <section className="py-16 bg-muted/30 md:px-8">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center gap-2 mb-2">
                  <Newspaper className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-bold">Berita Terbaru</h2>
                </div>
                <p className="text-muted-foreground">
                  Informasi dan kabar terkini dari Desa Pakukerto
                </p>
              </div>
              <Button asChild variant="outline" className="group">
                <Link href="/berita" className="flex items-center gap-2">
                  Lihat Semua Berita
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>

            {latestBerita.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Belum ada berita yang tersedia
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestBerita.map((berita, index) => (
                  <BeritaCard key={berita.id} berita={berita} index={index} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* UMKM Products Section */}
        <section className="py-16 mb-20 md:px-8">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center gap-2 mb-2">
                  <Store className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-bold">Produk UMKM</h2>
                </div>
                <p className="text-muted-foreground">
                  Produk unggulan dari UMKM Desa Pakukerto
                </p>
              </div>
              <Button asChild variant="outline" className="group">
                <Link href="/umkm" className="flex items-center gap-2">
                  Lihat Semua UMKM
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>

            {latestUmkm.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Belum ada produk UMKM yang tersedia
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestUmkm.map((product, index) => (
                  <UmkmCard key={product.id} product={product} index={index} />
                ))}
              </div>
            )}
          </div>
        </section>

        <SupportBySection />
      </PublicLayout>
    </>
  );
}

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  try {
    // Fetch latest 6 berita
    const latestBerita = await getPublishedBerita(6);

    // Fetch latest 6 UMKM products
    const latestUmkm = await getFeaturedUmkm(6);

    // Fetch 4 struktur organisasi items, sorted by createdAt (oldest first)
    const allStruktur = await getAllStruktur();
    const sortedStruktur = allStruktur
      .sort((a, b) => a.createdAt - b.createdAt)
      .slice(0, 5);

    return {
      props: {
        latestBerita: JSON.parse(JSON.stringify(latestBerita)),
        latestUmkm: JSON.parse(JSON.stringify(latestUmkm)),
        strukturOrganisasi: JSON.parse(JSON.stringify(sortedStruktur)),
      },
      // Revalidate every 10 minutes
      revalidate: 600,
    };
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    return {
      props: {
        latestBerita: [],
        latestUmkm: [],
        strukturOrganisasi: [],
      },
      revalidate: 60,
    };
  }
};
