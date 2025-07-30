import React from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock, ChevronLeft, Share2 } from "lucide-react";
import PublicLayout from "@/components/layouts/PublicLayout";
import NewestBeritaList from "@/components/public/berita/NewestBeritaList";
import {
  getPublishedBerita,
  getBeritaBySlug,
  BeritaPublicData,
} from "@/lib/public/berita";
import { formatDate, calculateReadingTime } from "@/utils/date";

interface BeritaDetailPageProps {
  berita: BeritaPublicData;
  newestBerita: BeritaPublicData[];
}

const BeritaDetailPage: React.FC<BeritaDetailPageProps> = ({
  berita,
  newestBerita,
}) => {
  const readingTime = calculateReadingTime(berita.isi);

  // Share functionality
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: berita.judul,
          text: berita.excerpt,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing:", error));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("URL copied to clipboard!");
    }
  };

  return (
    <>
      <Head>
        <title>{berita.judul} - Desa Pakukerto</title>
        <meta name="description" content={berita.excerpt} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        <meta property="og:url" content={`https://www.desapakukerto.id/berita/${berita.slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={berita.judul} />
        <meta property="og:description" content={berita.excerpt} />
        <meta property="og:image" content={berita.thumbnailUrl} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="desapakukerto.id" />
        <meta property="twitter:url" content={`https://www.desapakukerto.id/berita/${berita.slug}`} />
        <meta name="twitter:title" content={berita.judul} />
        <meta name="twitter:description" content={berita.excerpt} />
        <meta name="twitter:image" content={berita.thumbnailUrl} />
      </Head>

      <PublicLayout>
        <div className="min-h-screen bg-background pb-20">
          {/* Back button */}
          <div className="px-4 pt-8 sm:px-6 lg:px-8">
            <Link
              href="/berita"
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Kembali ke Berita
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
            <article className="">
              {/* Header */}
              <header className="mb-8">
                <h1 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
                  {berita.judul}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <CalendarDays className="mr-1 h-4 w-4 text-primary" />
                    <span>{formatDate(berita.createdAt)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4 text-primary" />
                    <span>{readingTime} menit membaca</span>
                  </div>
                  <button
                    onClick={handleShare}
                    className="ml-auto flex items-center rounded-full bg-primary/10 px-3 py-1 text-primary hover:bg-primary/20 transition-colors"
                  >
                    <Share2 className="mr-1 h-4 w-4" />
                    <span>Bagikan</span>
                  </button>
                </div>
              </header>

              {/* Featured image */}
              <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-2xl">
                <Image
                  src={berita.thumbnailUrl}
                  alt={berita.judul}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Content */}
              <div
                className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-card-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl"
                dangerouslySetInnerHTML={{ __html: berita.isi }}
              />
            </article>

            {/* Related news */}
            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
              <NewestBeritaList
                beritaList={newestBerita}
                currentBeritaId={berita.id}
              />
            </div>
          </div>
        </div>
      </PublicLayout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const beritaList = await getPublishedBerita();

    const paths = beritaList.map((berita) => ({
      params: { slug: berita.slug },
    }));

    return {
      paths,
      fallback: "blocking", // Show 404 if path not found
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
    const slug = params?.slug as string;
    const berita = await getBeritaBySlug(slug);

    if (!berita) {
      return {
        notFound: true,
      };
    }

    // Get newest berita for related news section (limit to 5)
    const newestBerita = await getPublishedBerita(5);

    return {
      props: {
        berita: JSON.parse(JSON.stringify(berita)),
        newestBerita: JSON.parse(JSON.stringify(newestBerita)),
      },
      // Revalidate every 1 minutes
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error fetching berita detail:", error);
    return {
      notFound: true,
    };
  }
};

export default BeritaDetailPage;
