import React, { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { GaleriPublicData } from "@/lib/public/galeri";

interface GaleriImageDialogProps {
  image: GaleriPublicData;
  className?: string;
}

export function GaleriImageDialog({ image, className }: GaleriImageDialogProps) {
  const [open, setOpen] = useState(false);

  if (!image.imageUrl) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          className={`relative aspect-square rounded-lg overflow-hidden shadow-md cursor-pointer ${className}`}
          onClick={() => setOpen(true)}
        >
          <Image
            src={image.imageUrl}
            alt={image.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
            <h3 className="text-white font-medium text-sm line-clamp-2">
              {image.title}
            </h3>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] w-[95vw] lg:max-h-[90vh] p-0 overflow-hidden">
        <div className="relative w-full h-[40vh] lg:h-[80vh]">
          <Image
            src={image.imageUrl}
            alt={image.title}
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
