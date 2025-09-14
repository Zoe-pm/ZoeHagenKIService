import { useState, useRef } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
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
  icon,
  image,
  gradient,
  buttonText,
  onButtonClick,
  mediaType = 'image'
}: ProductCardProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoPlay = () => {
    if (videoRef.current && !isVideoPlaying) {
      setIsVideoPlaying(true);
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  const handleVideoEnd = () => {
    setIsVideoPlaying(false);
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
            className={`w-full h-36 object-cover rounded-lg mb-3 cursor-pointer ${
              id === 'avatar' ? 'object-[50%_20%]' : 
              id === 'voicebot' ? 'object-[50%_30%]' : 
              'object-center'
            }`}
            onMouseEnter={handleVideoPlay}
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
            className={`w-full h-36 object-cover rounded-lg mb-3 ${
              id === 'avatar' ? 'object-[50%_20%]' : 
              id === 'voicebot' ? 'object-[50%_30%]' : 
              'object-center'
            }`} 
            loading="lazy"
            data-testid={`product-image-${id}`}
          />
        )}
        
        <div className="text-center mb-3">
          <div className="text-3xl mb-2" data-testid={`product-icon-${id}`}>
            {icon}
          </div>
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
              <CheckCircle className="w-4 h-4 text-accent mr-2 flex-shrink-0" />
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
