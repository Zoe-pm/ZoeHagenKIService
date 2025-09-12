import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, X } from 'lucide-react';

interface CalendlyWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  calendlyUrl?: string;
}

export function CalendlyWidget({ 
  isOpen, 
  onClose, 
  calendlyUrl = "https://calendly.com/zoeskistudio" 
}: CalendlyWidgetProps) {
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isOpen) {
      // Save currently focused element for restoration
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
          return;
        }
        
        if (e.key === 'Tab' && dialogRef.current) {
          const focusableElements = dialogRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          
          if (focusableElements.length === 0) return;
          
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
          
          if (e.shiftKey) {
            // Shift+Tab pressed
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            // Tab pressed
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };
      
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'unset';
      };
    } else {
      // Restore focus when closing
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="calendly-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      data-testid="calendly-backdrop"
    >
      <div 
        ref={dialogRef}
        className="relative w-full max-w-4xl h-[80vh] max-h-[600px] m-4 bg-white dark:bg-black text-black dark:text-white rounded-lg shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-primary to-primary/80 text-white">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <h3 id="calendly-title" className="font-semibold">Termin vereinbaren</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20 dark:text-white dark:hover:bg-white/20"
            data-testid="button-close-calendly"
            autoFocus
            aria-label="Schließen"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Calendly Embed */}
        <div className="h-[calc(100%-4rem)]">
          <iframe
            src={`${calendlyUrl}?embed_domain=${window.location.hostname}&embed_type=Inline`}
            width="100%"
            height="100%"
            frameBorder="0"
            title="Calendly Terminbuchung"
            data-testid="calendly-iframe"
          />
        </div>
      </div>
    </div>
  );
}

interface CalendlyButtonProps {
  onClick: () => void;
  text?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
}

export function CalendlyButton({ 
  onClick, 
  text = "Termin vereinbaren",
  variant = "default"
}: CalendlyButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      className="w-full sm:w-auto"
      data-testid="button-calendly"
    >
      <Calendar className="h-4 w-4 mr-2" />
      {text}
    </Button>
  );
}