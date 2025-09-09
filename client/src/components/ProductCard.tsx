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
  onButtonClick
}: ProductCardProps) {
  return (
    <Card className="glass hover-lift focus-within:ring-2 focus-within:ring-ring fade-in" data-testid={`product-card-${id}`}>
      <CardContent className="p-6">
        <img 
          src={image} 
          alt={`${title} Interface-Darstellung`}
          className="w-full h-48 object-cover rounded-lg mb-4" 
          loading="lazy"
          data-testid={`product-image-${id}`}
        />
        
        <div className="text-center mb-4">
          <div className="text-4xl mb-3" data-testid={`product-icon-${id}`}>
            {icon}
          </div>
          <h2 className="text-2xl font-semibold mb-2" data-testid={`product-title-${id}`}>
            {title}
          </h2>
        </div>
        
        <p className="text-muted-foreground mb-4" data-testid={`product-description-${id}`}>
          {description}
        </p>
        
        <div className="space-y-2 mb-6 text-sm">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center" data-testid={`product-feature-${id}-${index}`}>
              <CheckCircle className="w-4 h-4 text-accent mr-2 flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
        
        <Button
          className="w-full button-gradient py-3 px-4 font-medium"
          onClick={onButtonClick}
          data-testid={`product-button-${id}`}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}
