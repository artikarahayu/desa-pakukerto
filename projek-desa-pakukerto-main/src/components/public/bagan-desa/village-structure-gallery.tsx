import React, { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface VillageStructureGalleryProps {
  images: string[];
  title?: string;
  emptyMessage?: string;
  className?: string;
}

export function VillageStructureGallery({
  images,
  title = "Bagan Desa",
  emptyMessage = "Gambar bagan desa belum tersedia.",
  className,
}: VillageStructureGalleryProps) {
  const [openImageIndex, setOpenImageIndex] = useState<number | null>(null);

  return (
    <div className={className}>
      {images && images.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {images.map((imageUrl, index) => (
            <Dialog
              key={index}
              open={openImageIndex === index}
              onOpenChange={(open) => {
                if (!open) setOpenImageIndex(null);
              }}
            >
              <DialogTrigger asChild>
                <div
                  className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-md cursor-pointer"
                  onClick={() => setOpenImageIndex(index)}
                >
                  <Image
                    src={imageUrl}
                    alt={`${title} ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] w-[95vw] lg:max-h-[90vh] p-0 overflow-hidden">
                <div className="relative w-full h-[40vh] lg:h-[80vh]">
                  <Image
                    src={imageUrl}
                    alt={`${title} ${index + 1}`}
                    fill
                    sizes="100vw"
                    className="object-contain"
                    priority
                  />
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground italic text-center py-12">
          {emptyMessage}
        </p>
      )}
    </div>
  );
}
