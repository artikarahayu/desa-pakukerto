import PublicLayout from "@/components/layouts/PublicLayout";
import { GetStaticProps, NextPage } from "next";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { VillageStructureGallery } from "@/components/public/bagan-desa/village-structure-gallery";
import Head from "next/head";
import { Landmark, MapPin } from "lucide-react";
import { getAllDusunProfiles } from "@/lib/public/dusun";
import { Dusun } from "@/schemas/dusun.schema";
import DusunProfilesList from "@/components/public/dusun/DusunProfilesList";
import Marquee from "react-fast-marquee";
import SupportBySection from "@/components/public/SupportBySection";

// Define types for our data
interface ProfilDesaProps {
  visiMisi: {
    content: string;
    updatedAt?: string;
  };
  sejarah: {
    content: string;
    updatedAt?: string;
  };
  baganDesa: {
    images: string[];
    updatedAt?: string;
  };
  dusunProfiles: Dusun[];
}

const ProfilDesaPage: NextPage<ProfilDesaProps> = ({
  visiMisi,
  sejarah,
  baganDesa,
  dusunProfiles,
}) => {
  return (
    <>
      <Head>
        <title>Profil Desa Pakukerto | Kabupaten Pasuruan, Jawa Timur</title>
        <meta
          name="description"
          content="Informasi lengkap tentang Desa Pakukerto, meliputi visi & misi, sejarah desa, dan struktur organisasi desa."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta
          property="og:url"
          content="https://www.desapakukerto.id/profil-desa"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Profil Desa Pakukerto | Kabupaten Pasuruan, Jawa Timur"
        />
        <meta
          property="og:description"
          content="Informasi lengkap tentang Desa Pakukerto, meliputi visi & misi, sejarah desa, dan struktur organisasi desa."
        />
        <meta property="og:image" content="/images/hero-2.webp" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="desapakukerto.id" />
        <meta
          property="twitter:url"
          content="https://www.desapakukerto.id/profil-desa"
        />
        <meta
          name="twitter:title"
          content="Profil Desa Pakukerto | Kabupaten Pasuruan, Jawa Timur"
        />
        <meta
          name="twitter:description"
          content="Informasi lengkap tentang Desa Pakukerto, meliputi visi & misi, sejarah desa, dan struktur organisasi desa."
        />
        <meta name="twitter:image" content="/images/hero-2.webp" />
      </Head>
      <PublicLayout>
        <div className="container mx-auto py-12 px-4 pb-20">
          <div className="">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Landmark className="h-8 w-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold">
                Profil Desa Pakukerto
              </h1>
            </div>
            <p className="text-lg mb-8 text-muted-foreground text-center max-w-2xl mx-auto">
              Informasi lengkap tentang Desa Pakukerto, meliputi visi & misi,
              sejarah desa, dan struktur organisasi desa.
            </p>

            <div className="space-y-12 mt-12">
              {/* Visi & Misi Section */}
              <section
                className="scroll-mt-24 max-w-5xl mx-auto"
                id="visi-misi"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-1 bg-primary rounded-full"></div>
                  <h2 className="text-2xl md:text-3xl font-bold">
                    Visi & Misi
                  </h2>
                </div>
                <div className="bg-background p-6 md:p-8 rounded-lg border border-border shadow-sm">
                  {visiMisi.content ? (
                    <div
                      className="prose prose-lg max-w-none dark:prose-invert [&_a]:text-blue-600 [&_a]:underline [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-5"
                      dangerouslySetInnerHTML={{ __html: visiMisi.content }}
                    />
                  ) : (
                    <p className="text-muted-foreground italic">
                      Informasi visi & misi belum tersedia.
                    </p>
                  )}
                </div>
              </section>

              {/* Sejarah Desa Section */}
              <section className="scroll-mt-24 max-w-5xl mx-auto" id="sejarah">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-1 bg-primary rounded-full"></div>
                  <h2 className="text-2xl md:text-3xl font-bold">
                    Sejarah Desa
                  </h2>
                </div>
                <div className="bg-background p-6 md:p-8 rounded-lg border border-border shadow-sm">
                  {sejarah.content ? (
                    <div
                      className="prose prose-lg max-w-none dark:prose-invert [&_a]:text-blue-600 [&_a]:underline [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-5"
                      dangerouslySetInnerHTML={{ __html: sejarah.content }}
                    />
                  ) : (
                    <p className="text-muted-foreground italic">
                      Informasi sejarah desa belum tersedia.
                    </p>
                  )}
                </div>
              </section>

              {/* Bagan Desa Section */}
              <section
                className="scroll-mt-24 max-w-5xl mx-auto"
                id="bagan-desa"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-1 bg-primary rounded-full"></div>
                  <h2 className="text-2xl md:text-3xl font-bold">Bagan Desa</h2>
                </div>

                {baganDesa.images && baganDesa.images.length > 0 ? (
                  <VillageStructureGallery images={baganDesa.images} />
                ) : (
                  <div className="bg-background p-6 md:p-8 rounded-lg border border-border shadow-sm">
                    <p className="text-muted-foreground italic">
                      Bagan desa belum tersedia.
                    </p>
                  </div>
                )}
              </section>

              {/* Dusun Profiles Section */}
              <section
                className="scroll-mt-24 max-w-5xl mx-auto"
                id="dusun-profiles"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-1 bg-primary rounded-full"></div>
                  <h2 className="text-2xl md:text-3xl font-bold">
                    Profil Dusun
                  </h2>
                </div>

                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="h-5 w-5 text-primary" />
                  <p className="text-lg text-muted-foreground">
                    Informasi tentang dusun-dusun di Desa Pakukerto
                  </p>
                </div>

                <DusunProfilesList dusunList={dusunProfiles} />
              </section>

              <section
                className="scroll-mt-24 max-w-5xl mx-auto"
                id="peta-desa"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-1 bg-primary rounded-full"></div>
                  <h2 className="text-2xl md:text-3xl font-bold">Peta Desa</h2>
                </div>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15814.528484465953!2d112.69614824209309!3d-7.722560926727121!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7d6d1cb7927af%3A0x2572fe71bc723997!2sPakukerto%2C%20Kec.%20Sukorejo%2C%20Pasuruan%2C%20Jawa%20Timur!5e0!3m2!1sid!2sid!4v1753102664252!5m2!1sid!2sid"
                  width="100%"
                  height="450"
                  style={{ border: "0" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </section>

              {/* Support By Logos Section */}
              <SupportBySection />
            </div>
          </div>
        </div>
      </PublicLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps<ProfilDesaProps> = async () => {
  try {
    // Fetch visi & misi data
    const visiMisiDoc = await getDoc(doc(db, "profilDesa", "visiMisi"));
    const visiMisiData = visiMisiDoc.exists()
      ? {
          content: visiMisiDoc.data().content || "",
          updatedAt: visiMisiDoc.data().updatedAt,
        }
      : { content: "" };

    // Fetch sejarah data
    const sejarahDoc = await getDoc(doc(db, "profilDesa", "sejarah"));
    const sejarahData = sejarahDoc.exists()
      ? {
          content: sejarahDoc.data().content || "",
          updatedAt: sejarahDoc.data().updatedAt,
        }
      : { content: "" };

    // Fetch bagan desa data
    const baganDesaDoc = await getDoc(doc(db, "profilDesa", "baganDesa"));
    const baganDesaData = baganDesaDoc.exists()
      ? {
          images: baganDesaDoc.data().images || [],
          updatedAt: baganDesaDoc.data().updatedAt,
        }
      : { images: [] };

    // Fetch dusun profiles using the admin utility
    const dusunProfiles = await getAllDusunProfiles();
    // The getAllDusunProfiles function already returns properly typed data

    return {
      props: {
        visiMisi: visiMisiData,
        sejarah: sejarahData,
        baganDesa: baganDesaData,
        dusunProfiles: Array.isArray(dusunProfiles) ? dusunProfiles : [],
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error fetching profil desa data:", error);
    return {
      props: {
        visiMisi: { content: "" },
        sejarah: { content: "" },
        baganDesa: { images: [] },
        dusunProfiles: [],
      },
      revalidate: 86400,
    };
  }
};

export default ProfilDesaPage;
