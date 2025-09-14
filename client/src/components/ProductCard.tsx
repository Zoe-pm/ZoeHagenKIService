import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  features: string[];
  image: string;
  gradient: string;
  buttonText: string;
  onButtonClick?: () => void;
  mediaType?: 'image' | 'video';
}

export default function ProductCard({
  id,
  title,
  description,
  features,
  image,
  gradient,
  buttonText,
  onButtonClick,
  mediaType = 'image'
}: ProductCardProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [imageHeight, setImageHeight] = useState('240px');
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const updateImageHeight = () => {
      if (window.innerWidth <= 640) {
        setImageHeight('180px');
      } else if (window.innerWidth <= 1024) {
        setImageHeight('200px');
      } else {
        setImageHeight('240px');
      }
    };

    updateImageHeight();
    window.addEventListener('resize', updateImageHeight);
    return () => window.removeEventListener('resize', updateImageHeight);
  }, []);

  // Intersection Observer für Autoplay (nur einmal)
  useEffect(() => {
    if (!videoRef.current || mediaType !== 'video') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        // Only auto-play once when first entering viewport
        if (entry.isIntersecting && !isVideoPlaying && !hasAutoPlayed) {
          handleVideoPlay();
          setHasAutoPlayed(true);
        } else if (!entry.isIntersecting && isVideoPlaying) {
          // Video pausieren wenn es aus dem viewport geht
          if (videoRef.current) {
            videoRef.current.pause();
            setIsVideoPlaying(false);
          }
        }
      },
      { threshold: 0.5 } // Video startet wenn 50% sichtbar sind
    );

    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, [mediaType, isVideoPlaying, hasAutoPlayed]);

  const handleVideoPlay = () => {
    if (videoRef.current && !isVideoPlaying) {
      setIsVideoPlaying(true);
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(console.error);
    }
  };

  const handleVideoEnd = () => {
    setIsVideoPlaying(false);
    // Video stops after playing once and only restarts on click
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <Card className="glass hover-lift focus-within:ring-2 focus-within:ring-ring fade-in h-full flex flex-col" data-testid={`product-card-${id}`}>
      <CardContent className="p-4 flex flex-col h-full">
        {mediaType === 'video' ? (
          <video 
            ref={videoRef}
            src={image} 
            className={`w-full object-cover rounded-lg mb-3 cursor-pointer responsive-face-media ${
              id === 'avatar' ? 'face-focus-avatar' : 
              id === 'voicebot' ? 'face-focus-voicebot' : 
              'object-center'
            }`}
            style={{ height: imageHeight }}
            onClick={handleVideoPlay}
            onEnded={handleVideoEnd}
            muted
            playsInline
            data-testid={`product-video-${id}`}
          />
        ) : (
          <img 
            src={image} 
            alt={`${title} Interface-Darstellung`}
            className={`w-full object-cover rounded-lg mb-3 responsive-face-media ${
              id === 'avatar' ? 'face-focus-avatar' : 
              id === 'voicebot' ? 'face-focus-voicebot' : 
              'object-center'
            }`}
            style={{ height: imageHeight }} 
            loading="lazy"
            data-testid={`product-image-${id}`}
          />
        )}
        
        <div className="text-left mb-3">
          <h2 className="text-xl font-semibold mb-2" data-testid={`product-title-${id}`}>
            {title}
          </h2>
        </div>
        
        <p className="text-muted-foreground mb-3 text-sm" data-testid={`product-description-${id}`}>
          {description}
        </p>
        
        <div className="space-y-1 mb-4 text-sm flex-grow">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center" data-testid={`product-feature-${id}-${index}`}>
              <span className="w-4 h-4 text-[#B8436A] mr-2 flex-shrink-0">✓</span>
              <span>{feature}</span>
            </div>
          ))}
        </div>
        
        <Button
          className="w-full button-gradient py-4 px-6 font-semibold text-base rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          onClick={onButtonClick}
          data-testid={`product-button-${id}`}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}
