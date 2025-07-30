import PublicLayout from "@/components/layouts/PublicLayout";
import DusunSidebar from "@/components/public/dusun/DusunSidebar";
import { Card, CardContent } from "@/components/ui/card";
import {
  getAllDusunProfiles,
  getAllDusunSlugs,
  getDusunProfileBySlug,
} from "@/lib/public/dusun";
import { Dusun } from "@/schemas/dusun.schema";
import { ChevronLeft } from "lucide-react";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { ParsedUrlQuery } from "querystring";

interface DusunDetailPageProps {
  dusun: Dusun;
  allDusun: Dusun[];
}

interface IParams extends ParsedUrlQuery {
  slug: string;
}

export default function DusunDetailPage({
  dusun,
  allDusun,
}: DusunDetailPageProps) {
  // Extract first paragraph of content for meta description
  const getMetaDescription = () => {
    if (!dusun?.isi) return "Profil dusun di Desa Pakukerto";
    const strippedHtml = dusun.isi.replace(/<[^>]+>/g, " ");
    const firstParagraph = strippedHtml.substring(0, 160);
    return firstParagraph;
  };
  if (!dusun) {
    return (
      <>
        <Head>
          <title>Dusun Tidak Ditemukan - Desa Pakukerto</title>
          <meta name="description" content="Profil dusun tidak ditemukan" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <PublicLayout>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">
              Profil Dusun Tidak Ditemukan
            </h1>
            <p>Maaf, profil dusun yang Anda cari tidak ditemukan.</p>
          </div>
        </PublicLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{dusun.nama} - Desa Pakukerto</title>
        <meta name="description" content={getMetaDescription()} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta
          property="og:url"
          content={`https://www.desapakukerto.id/profil-desa/${dusun.slug}`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${dusun.nama} - Desa Pakukerto`} />
        <meta property="og:description" content={getMetaDescription()} />
        <meta
          property="og:image"
          content={dusun.gambar || "/images/hero-1.webp"}
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="desapakukerto.id" />
        <meta
          property="twitter:url"
          content={`https://www.desapakukerto.id/profil-desa/${dusun.slug}`}
        />
        <meta name="twitter:title" content={`${dusun.nama} - Desa Pakukerto`} />
        <meta name="twitter:description" content={getMetaDescription()} />
        <meta
          name="twitter:image"
          content={dusun.gambar || "/images/hero-1.webp"}
        />
      </Head>
      <PublicLayout>
        <div className="min-h-screen bg-background pb-20">
          {/* Back button */}
          <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
            <Link
              href="/profil-desa"
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Kembali ke Profil Desa
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 gap-6">
            {/* Main Content */}
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">{dusun.nama}</h1>

              {dusun.gambar && (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <Image
                    src={dusun.gambar}
                    alt={dusun.nama}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              <Card>
                <CardContent>
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: dusun.isi }}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <DusunSidebar dusunList={allDusun} currentDusunId={dusun.id} />
            </div>
          </div>
        </div>
      </PublicLayout>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const slugs = await getAllDusunSlugs();

    const paths = slugs.map((slug) => ({
      params: { slug },
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

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params as IParams;

  try {
    const dusun = await getDusunProfileBySlug(slug);
    const allDusun = await getAllDusunProfiles();

    if (!dusun) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        dusun,
        allDusun,
      },
      revalidate: 60, // ISR: revalidate every 60 seconds
    };
  } catch (error) {
    console.error(`Error fetching dusun profile for slug ${slug}:`, error);
    return {
      notFound: true,
    };
  }
};
