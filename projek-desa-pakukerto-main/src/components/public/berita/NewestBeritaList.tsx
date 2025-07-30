import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BeritaPublicData } from "@/lib/public/berita";
import { formatDate } from "@/utils/date";
import { CalendarDays, Newspaper } from "lucide-react";

interface NewestBeritaListProps {
  beritaList: BeritaPublicData[];
  currentBeritaId?: string;
  className?: string;
  style?: React.CSSProperties;
}

const NewestBeritaList: React.FC<NewestBeritaListProps> = ({
  beritaList,
  currentBeritaId,
  className = "",
  style,
}) => {
  // Filter out current berita if ID is provided
  const filteredBerita = currentBeritaId
    ? beritaList.filter((berita) => berita.id !== currentBeritaId)
    : beritaList;

  return (
    <div
      className={`bg-backgorund rounded-3xl min-w-[250px] border border-border shadow-sm p-6 ${className}`}
      style={style}
    >
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-xl font-bold">Baca Berita Lainnya</h3>
      </div>

      {filteredBerita.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          Tidak ada berita terbaru lainnya.
        </p>
      ) : (
        <div className="space-y-6">
          {filteredBerita.map((berita, index) => (
            <div
              key={berita.id}
              className="group flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
            >
              <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden">
                <Image
                  src={berita.thumbnailUrl}
                  alt={berita.judul}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/berita/${berita.slug}`}
                  className="block text-sm group-hover:text-primary transition-colors duration-300"
                >
                  <h4 className="font-medium line-clamp-2 mb-1">
                    {berita.judul}
                  </h4>
                </Link>
                <div className="flex items-center text-xs text-muted-foreground">
                  <CalendarDays className="h-3 w-3 mr-1" />
                  <span>{formatDate(berita.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-border">
        <Link
          href="/berita"
          className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-300"
        >
          Lihat Semua Berita
        </Link>
      </div>
    </div>
  );
};

export default NewestBeritaList;
