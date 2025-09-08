import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <nav className="glass fixed top-10 left-0 right-0 z-40" role="navigation" aria-label="Hauptnavigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <Link href="/">
                <h1 className="text-2xl font-bold gradient-text cursor-pointer" data-testid="logo">
                  KI-Assistenten
                </h1>
              </Link>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {location === "/" ? (
                  <>
                    <button 
                      onClick={() => scrollToSection('produkte')}
                      className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                      data-testid="nav-produkte"
                    >
                      Produkte
                    </button>
                    <button 
                      onClick={() => scrollToSection('vergleich')}
                      className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                      data-testid="nav-vergleich"
                    >
                      Vergleich
                    </button>
                    <button 
                      onClick={() => scrollToSection('implementation')}
                      className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                      data-testid="nav-implementation"
                    >
                      Umsetzung
                    </button>
                    <button 
                      onClick={() => scrollToSection('kontakt')}
                      className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring"
                      data-testid="nav-beratung"
                    >
                      Beratung
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/" className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring" data-testid="nav-home">
                      Startseite
                    </Link>
                    <Link href="/#kontakt" className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring" data-testid="nav-beratung-alt">
                      Beratung
                    </Link>
                  </>
                )}
              </div>
            </div>
            
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
                data-testid="mobile-menu-toggle"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="glass fixed top-26 left-0 right-0 z-30 md:hidden" data-testid="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {location === "/" ? (
              <>
                <button 
                  onClick={() => scrollToSection('produkte')}
                  className="text-muted-foreground hover:text-foreground block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                  data-testid="mobile-nav-produkte"
                >
                  Produkte
                </button>
                <button 
                  onClick={() => scrollToSection('vergleich')}
                  className="text-muted-foreground hover:text-foreground block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                  data-testid="mobile-nav-vergleich"
                >
                  Vergleich
                </button>
                <button 
                  onClick={() => scrollToSection('implementation')}
                  className="text-muted-foreground hover:text-foreground block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                  data-testid="mobile-nav-implementation"
                >
                  Umsetzung
                </button>
                <button 
                  onClick={() => scrollToSection('kontakt')}
                  className="bg-gradient-to-r from-primary to-secondary text-primary-foreground block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                  data-testid="mobile-nav-beratung"
                >
                  Beratung
                </button>
              </>
            ) : (
              <>
                <Link href="/" className="text-muted-foreground hover:text-foreground block px-3 py-2 rounded-md text-base font-medium" data-testid="mobile-nav-home">
                  Startseite
                </Link>
                <Link href="/#kontakt" className="bg-gradient-to-r from-primary to-secondary text-primary-foreground block px-3 py-2 rounded-md text-base font-medium" data-testid="mobile-nav-beratung-alt">
                  Beratung
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
