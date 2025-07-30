import React from "react";
import { GetStaticProps } from "next";
import Head from "next/head";
import { getGaleriByType, GaleriPublicData } from "@/lib/public/galeri";
import PublicLayout from "@/components/layouts/PublicLayout";
import { GaleriImageDialog } from "@/components/public/galeri/GaleriImageDialog";
import { GaleriVideoDialog } from "@/components/public/galeri/GaleriVideoDialog";
import { Image as ImageIcon, Youtube } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface GaleriPageProps {
  images: GaleriPublicData[];
  videos: GaleriPublicData[];
}

const GaleriPage: React.FC<GaleriPageProps> = ({ images, videos }) => {
  return (
    <>
      <Head>
        <title>Galeri - Desa Pakukerto</title>
        <meta
          name="description"
          content="Galeri foto dan video kegiatan Desa Pakukerto"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta property="og:url" content="https://www.desapakukerto.id/galeri" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Galeri - Desa Pakukerto" />
        <meta
          property="og:description"
          content="Galeri foto dan video kegiatan Desa Pakukerto"
        />
        <meta property="og:image" content="/images/hero-2.webp" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="desapakukerto.id" />
        <meta
          property="twitter:url"
          content="https://www.desapakukerto.id/galeri"
        />
        <meta name="twitter:title" content="Galeri - Desa Pakukerto" />
        <meta
          name="twitter:description"
          content="Galeri foto dan video kegiatan Desa Pakukerto"
        />
        <meta name="twitter:image" content="/images/hero-2.webp" />
      </Head>

      <PublicLayout>
        <div className="min-h-screen bg-background w-full flex flex-col lg:flex-row">
          {/* Page Header */}
          <div className="relative bg-gradient-to-b from-primary/80 to-accent py-16 text-center w-full lg:max-w-[18rem]">
            <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-center mb-4 gap-1.5">
                <ImageIcon className="h-6 w-6 text-primary-foreground" />
                <h1 className="text-2xl md:text-xl lg:text-2xl font-bold text-primary-foreground text-nowrap">
                  Galeri Desa
                </h1>
              </div>
              <p className="mt-2 text-lg text-primary-foreground/90">
                Kumpulan foto dan video kegiatan Desa Pakukerto
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="mx-auto max-w-[86rem] px-4 pt-12 sm:px-6 lg:px-8 mb-24 w-full">
            <Tabs defaultValue="images" className="w-full">
              <TabsList className="mb-8 w-full max-w-md mx-auto">
                <TabsTrigger value="images" className="flex-1">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Foto
                </TabsTrigger>
                <TabsTrigger value="videos" className="flex-1">
                  <Youtube className="h-4 w-4 mr-2" />
                  Video
                </TabsTrigger>
              </TabsList>

              {/* Images Tab */}
              <TabsContent value="images" className="mt-2">
                {images.length === 0 ? (
                  <div className="rounded-xl border border-border bg-backgorund p-12 text-center shadow-sm">
                    <h3 className="text-lg font-medium text-foreground">
                      Belum ada foto yang ditambahkan
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      Foto kegiatan desa akan segera ditambahkan.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in-up">
                    {images.map((image) => (
                      <GaleriImageDialog key={image.id} image={image} />
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Videos Tab */}
              <TabsContent value="videos" className="mt-2">
                {videos.length === 0 ? (
                  <div className="rounded-xl border border-border bg-backgorund p-12 text-center shadow-sm">
                    <h3 className="text-lg font-medium text-foreground">
                      Belum ada video yang ditambahkan
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      Video kegiatan desa akan segera ditambahkan.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-fade-in-up">
                    {videos.map((video) => (
                      <GaleriVideoDialog key={video.id} video={video} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </PublicLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  try {
    // Fetch images and videos in parallel
    const [images, videos] = await Promise.all([
      getGaleriByType("image"),
      getGaleriByType("video"),
    ]);

    return {
      props: {
        images: JSON.parse(JSON.stringify(images)),
        videos: JSON.parse(JSON.stringify(videos)),
      },
      // Revalidate every 1 minutes
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error fetching gallery items:", error);
    return {
      props: {
        images: [],
        videos: [],
      },
      revalidate: 60,
    };
  }
};

export default GaleriPage;
