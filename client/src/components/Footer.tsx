import { Link } from "wouter";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer-gradient mt-20 py-8 px-4 sm:px-6 lg:px-8" role="contentinfo" data-testid="footer">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <div className="flex flex-wrap justify-center items-center gap-2 text-sm text-muted-foreground">
            <a 
              href="https://www.linkedin.com/in/zoe-bahati-hagen-53ba27257"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded px-1"
              aria-label="LinkedIn"
              data-testid="footer-linkedin"
            >
              LinkedIn
            </a>
            
            <span className="text-muted-foreground/60">•</span>
            
            <Link 
              href="/impressum" 
              className="hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded px-1"
              data-testid="footer-impressum"
            >
              Impressum
            </Link>
            
            <span className="text-muted-foreground/60">•</span>
            
            <Link 
              href="/datenschutz" 
              className="hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded px-1"
              data-testid="footer-datenschutz"
            >
              Datenschutz
            </Link>
            
            <span className="text-muted-foreground/60">•</span>
            
            <Link 
              href="/bildnachweise" 
              className="hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded px-1"
              data-testid="footer-bildnachweise"
            >
              Bildnachweise
            </Link>
            
            <span className="text-muted-foreground/60">•</span>
            
            <a 
              href="#" 
              className="hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded px-1"
              data-testid="footer-agb"
            >
              AGB
            </a>
            
            <span className="text-muted-foreground/60">•</span>
            
            <a 
              href="#" 
              className="hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded px-1"
              data-testid="footer-cookies"
            >
              Cookies
            </a>
          </div>
          
          <div className="border-t border-border mt-8 pt-6">
            <div className="space-y-2">
              <p className="text-muted-foreground" data-testid="footer-copyright">
                © 2025 Zoë Hagen KI Consulting. Alle Rechte vorbehalten. 
                Made with <Heart className="inline-block w-4 h-4 text-secondary mx-1" /> in Deutschland
              </p>
              <p className="text-sm text-muted-foreground" data-testid="footer-accessibility">
                Diese Website ist barrierefrei nach WCAG 2.1 AA gestaltet
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
