import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { GaleriPublicData, extractYoutubeVideoId } from "@/lib/public/galeri";
import { Youtube } from "lucide-react";

interface GaleriVideoDialogProps {
  video: GaleriPublicData;
  className?: string;
}

export function GaleriVideoDialog({ video, className }: GaleriVideoDialogProps) {
  const [open, setOpen] = useState(false);
  const youtubeId = video.youtubeUrl ? extractYoutubeVideoId(video.youtubeUrl) : null;

  if (!youtubeId) return null;

  // Generate thumbnail URL from YouTube video ID
  const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          className={`relative aspect-video rounded-lg overflow-hidden shadow-md cursor-pointer ${className}`}
          onClick={() => setOpen(true)}
        >
          {/* YouTube thumbnail */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${thumbnailUrl})` }}
          />
          
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors">
            <div className="bg-red-600 rounded-full p-3">
              <Youtube className="h-8 w-8 text-white" />
            </div>
          </div>
          
          {/* Title overlay */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
            <h3 className="text-white font-medium text-sm line-clamp-2">
              {video.title}
            </h3>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] w-[95vw] lg:max-w-5xl p-0 overflow-hidden">
        <div className="relative w-full aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
