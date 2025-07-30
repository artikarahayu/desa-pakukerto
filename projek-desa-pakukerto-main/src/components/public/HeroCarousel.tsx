import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CarouselItem {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
}

interface HeroCarouselProps {
  items: CarouselItem[];
  autoPlayInterval?: number; // in milliseconds
  showControls?: boolean;
  showIndicators?: boolean;
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({
  items,
  autoPlayInterval = 5000, // Default 5 seconds
  showControls = true,
  showIndicators = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Handle next slide
  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
  }, [items.length]);

  // Handle previous slide
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  // Go to specific slide
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    // Reset auto-play timer when manually changing slides
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 100);
  };

  // Auto-play effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isAutoPlaying && items.length > 1) {
      interval = setInterval(nextSlide, autoPlayInterval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoPlaying, nextSlide, autoPlayInterval, items.length]);

  // Pause auto-play when user interacts with controls
  const handleControlClick = (callback: () => void) => {
    setIsAutoPlaying(false);
    callback();
    setTimeout(() => setIsAutoPlaying(true), 3000); // Resume after 3 seconds
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full overflow-hidden">
      {/* Carousel container */}
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] w-full">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Image */}
            <div className="relative h-full w-full">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                priority={index === 0}
                className="object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="container mx-auto px-4 md:px-8">
                <div className="max-w-3xl mx-auto text-center">
                  <h2
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 animate-fade-in-up"
                    style={{ animationDelay: "200ms" }}
                  >
                    {item.title}
                  </h2>
                  <p
                    className="text-base sm:text-lg md:text-xl text-white/90 mb-6 animate-fade-in-up"
                    style={{ animationDelay: "400ms" }}
                  >
                    {item.description}
                  </p>
                  {item.buttonText && item.buttonLink && (
                    <Button
                      asChild
                      size="lg"
                      className="animate-fade-in-up"
                      style={{ animationDelay: "600ms" }}
                    >
                      <Link href={item.buttonLink}>{item.buttonText}</Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      {showControls && items.length > 1 && (
        <>
          <button
            onClick={() => handleControlClick(prevSlide)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 backdrop-blur-sm transition-all duration-300"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={() => handleControlClick(nextSlide)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 backdrop-blur-sm transition-all duration-300"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && items.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-primary"
                  : "w-2 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroCarousel;
