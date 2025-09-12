import { Link } from "wouter";

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
            
            <span className="text-muted-foreground/60">•</span>
            
            <span 
              className="hover:text-accent transition-colors cursor-default px-1"
              data-testid="footer-copyright"
            >
              © 2025 Zoë Hagen KI Consulting
            </span>
            
            <span className="text-muted-foreground/60">•</span>
            
            <span 
              className="hover:text-accent transition-colors cursor-default px-1"
              data-testid="footer-accessibility"
            >
              Barrierefreiheit
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
