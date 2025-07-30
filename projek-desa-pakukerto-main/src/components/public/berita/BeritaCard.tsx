import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BeritaPublicData } from "@/lib/public/berita";
import { formatDate } from "@/utils/date";
import { CalendarDays, ArrowRight } from "lucide-react";

interface BeritaCardProps {
  berita: BeritaPublicData;
  featured?: boolean;
  index?: number;
}

const BeritaCard: React.FC<BeritaCardProps> = ({
  berita,
  featured = false,
  index = 0,
}) => {
  if (featured) {
    return (
      <article
        className="group relative overflow-hidden rounded-3xl shadow-xl border border-border transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-1 bg-background"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <Link href={`/berita/${berita.slug}`} className="block">
          <div className="relative h-72 w-full sm:h-96 overflow-hidden">
            <Image
              src={berita.thumbnailUrl}
              alt={berita.judul}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <div className="mb-3 inline-block rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-foreground">
              <span className="flex items-center">
                <CalendarDays className="h-3 w-3 mr-1 text-primary" />
                {formatDate(berita.createdAt)}
              </span>
            </div>
            <h3 className="mb-3 text-2xl sm:text-3xl font-bold text-white group-hover:text-primary transition-colors duration-300">
              {berita.judul}
            </h3>
            <p className="line-clamp-2 text-base text-gray-200 mb-4">
              {berita.excerpt}
            </p>
            <div className="inline-flex items-center text-primary-foreground hover:text-primary font-semibold group-hover:translate-x-2 transition-all duration-300">
              Baca Selengkapnya
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article
      className="group bg-background rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-border"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Link href={`/berita/${berita.slug}`} className="block">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={berita.thumbnailUrl}
            alt={berita.judul}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          <div className="absolute top-4 left-4">
            <span className="bg-white/90 backdrop-blur-sm text-foreground px-3 py-1 rounded-full text-xs font-semibold">
              Berita Desa
            </span>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center text-foreground/50 text-sm mb-3">
            <CalendarDays className="h-4 w-4 mr-2 text-primary" />
            <span>{formatDate(berita.createdAt)}</span>
          </div>
          <h3 className="text-xl font-bold text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {berita.judul}
          </h3>
          <p className="text-card-foreground/70 mb-2 line-clamp-3 leading-relaxed">
            {berita.excerpt}
          </p>
          <div className="inline-flex items-center text-primary hover:text-accent font-semibold group-hover:translate-x-2 transition-all duration-300">
            Baca Selengkapnya
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </article>
  );
};

export default BeritaCard;
