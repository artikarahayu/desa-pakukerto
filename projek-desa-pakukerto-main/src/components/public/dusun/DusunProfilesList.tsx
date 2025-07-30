import Link from "next/link";
import Image from "next/image";
import { Dusun } from "@/schemas/dusun.schema";
import { formatDate } from "@/utils/date";
import { CalendarDays, ArrowRight, Home } from "lucide-react";

interface DusunProfilesListProps {
  dusunList: Dusun[];
}

export default function DusunProfilesList({
  dusunList,
}: DusunProfilesListProps) {
  if (!dusunList || dusunList.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">
          Belum ada profil dusun tersedia.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dusunList.map((dusun, index) => (
        <article
          key={dusun.id}
          className="group bg-background rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-border"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <Link href={`/profil-desa/${dusun.slug}`} className="block">
            {dusun.gambar && (
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={dusun.gambar}
                  alt={dusun.nama}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-foreground px-3 py-1 rounded-full text-xs font-semibold">
                    Dusun {dusun.nama}
                  </span>
                </div>
              </div>
            )}
            <div className="p-6">
              <h3 className="text-xl font-bold text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                {dusun.nama}
              </h3>
              <p className="text-card-foreground/70 mb-2 line-clamp-3 leading-relaxed">
                {dusun.isi
                  .replace(/<[^>]*>/g, " ")
                  .replace(/\s+/g, " ")
                  .trim()}
              </p>
              <div className="inline-flex items-center text-primary hover:text-accent font-semibold group-hover:translate-x-2 transition-all duration-300">
                Lihat Selengkapnya
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
