import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Umkm } from "@/schemas/umkm.schema";
import { MessageCircle, ArrowRight } from "lucide-react";

interface UmkmCardProps {
  product: Umkm;
  index?: number;
}

const UmkmCard: React.FC<UmkmCardProps> = ({ product, index = 0 }) => {
  const { id, nama, gambar, deskripsi, whatsapp, harga, createdAt } = product;

  // Format WhatsApp URL
  const whatsappUrl = `https://wa.me/${whatsapp}?text=Halo,%20saya%20tertarik%20dengan%20produk%20${encodeURIComponent(
    nama
  )}`;

  // Truncate description
  const truncatedDescription =
    deskripsi.length > 150 ? `${deskripsi.substring(0, 150)}...` : deskripsi;

  // Handle WhatsApp button click
  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <article
      className="group bg-backgorund rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-border"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Link href={`/umkm/${id}`} className="block">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={gambar[0]}
            alt={nama}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          <div className="absolute top-4 left-4">
            <span className="bg-white/90 backdrop-blur-sm text-foreground px-3 py-1 rounded-full text-xs font-semibold">
              Produk UMKM
            </span>
          </div>
          {gambar.length > 1 && (
            <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
              +{gambar.length - 1}
            </div>
          )}
        </div>
        <div className="p-6 flex flex-col justify-between h-full">
          <h3 className="text-xl font-bold text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {nama}
          </h3>
          <div className="mb-2">
            <span className="text-lg font-semibold text-primary">
              Rp {harga}
            </span>
          </div>
          <p className="text-card-foreground/70 mb-4 line-clamp-3 leading-relaxed">
            {truncatedDescription}
          </p>
          <div className="inline-flex items-center text-primary hover:text-accent font-semibold group-hover:translate-x-2 transition-all duration-300">
            Lihat Detail
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </article>
  );
};

export default UmkmCard;
