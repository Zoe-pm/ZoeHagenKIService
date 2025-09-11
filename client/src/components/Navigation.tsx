import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import logoImage from "@assets/logo_zoe_ki_1757417595587.jpg";

export default function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="glass fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-background/80" role="navigation" aria-label="Hauptnavigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-3">
                <img 
                  src={logoImage} 
                  alt="Zoë Hagen KI Consulting Logo" 
                  className="h-12 w-auto cursor-pointer" 
                  data-testid="logo"
                />
                <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent" data-testid="company-name">
                  Zoë's KI Studio
                </span>
              </Link>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {/* Immer gleiche Menüführung ohne Hervorhebung */}
                <Link href="/" className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring" data-testid="nav-home">
                  Startseite
                </Link>
                {location === "/" && (
                  <button 
                    onClick={() => scrollToSection('produkte')}
                    className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                    data-testid="nav-produkte"
                  >
                    Produkte
                  </button>
                )}
                <Link href="/ueber-uns" className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring" data-testid="nav-ueber-uns">
                  Über uns
                </Link>
                <Link href="/test" className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring" data-testid="nav-test">
                  Testbereich
                </Link>
                <Link href="/kontakt" className="button-gradient px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring" data-testid="nav-kontakt">
                  Kontakt
                </Link>
              </div>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
                data-testid="mobile-menu-button"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass backdrop-blur-md bg-background/95">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link 
                href="/" 
                className="text-muted-foreground hover:text-foreground block px-3 py-2 rounded-md text-base font-medium transition-colors"
                data-testid="mobile-nav-home"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Startseite
              </Link>
              {location === "/" && (
                <button 
                  onClick={() => scrollToSection('produkte')}
                  className="text-muted-foreground hover:text-foreground block px-3 py-2 rounded-md text-base font-medium transition-colors w-full text-left"
                  data-testid="mobile-nav-produkte"
                >
                  Produkte
                </button>
              )}
              <Link 
                href="/ueber-uns" 
                className="text-muted-foreground hover:text-foreground block px-3 py-2 rounded-md text-base font-medium transition-colors"
                data-testid="mobile-nav-ueber-uns"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Über uns
              </Link>
              <Link 
                href="/test" 
                className="text-muted-foreground hover:text-foreground block px-3 py-2 rounded-md text-base font-medium transition-colors"
                data-testid="mobile-nav-test"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Testbereich
              </Link>
              <Link 
                href="/kontakt" 
                className="button-gradient block px-3 py-2 rounded-md text-base font-medium transition-colors"
                data-testid="mobile-nav-kontakt"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Kontakt
              </Link>
            </div>
          </div>
        )}
      </nav>
      
      {/* Spacer for fixed navigation */}
      <div className="h-16"></div>
    </>
  );
}