import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
                {location === "/" ? (
                  <>
                    <button 
                      onClick={() => scrollToSection('produkte')}
                      className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                      data-testid="nav-produkte"
                    >
                      Produkte
                    </button>
                    <Link href="/ueber-uns" className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring" data-testid="nav-ueber-uns">
                      Über uns
                    </Link>
                    <Link href="/test" className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring" data-testid="nav-test">
                      Testbereich
                    </Link>
                    <Link href="/kontakt" className="button-gradient px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring" data-testid="nav-kontakt">
                      Kontakt
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/" className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring" data-testid="nav-home">
                      Startseite
                    </Link>
                    <Link href="/ueber-uns" className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring" data-testid="nav-ueber-uns-alt">
                      Über uns
                    </Link>
                    <Link href="/test" className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring" data-testid="nav-test-alt">
                      Testbereich
                    </Link>
                    <Link href="/kontakt" className="button-gradient px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring" data-testid="nav-kontakt-alt">
                      Kontakt
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
        <div className="glass fixed top-16 left-0 right-0 z-30 md:hidden backdrop-blur-md bg-background/95" data-testid="mobile-menu">
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
                <Link href="/ueber-uns" className="text-muted-foreground hover:text-foreground block px-3 py-2 rounded-md text-base font-medium" data-testid="mobile-nav-ueber-uns">
                  Über uns
                </Link>
                <Link href="/test" className="text-muted-foreground hover:text-foreground block px-3 py-2 rounded-md text-base font-medium" data-testid="mobile-nav-test">
                  Testbereich
                </Link>
                <Link href="/kontakt" className="button-gradient block px-3 py-2 rounded-md text-base font-medium" data-testid="mobile-nav-kontakt">
                  Kontakt
                </Link>
              </>
            ) : (
              <>
                <Link href="/" className="text-muted-foreground hover:text-foreground block px-3 py-2 rounded-md text-base font-medium" data-testid="mobile-nav-home">
                  Startseite
                </Link>
                <Link href="/ueber-uns" className="text-muted-foreground hover:text-foreground block px-3 py-2 rounded-md text-base font-medium" data-testid="mobile-nav-ueber-uns-alt">
                  Über uns
                </Link>
                <Link href="/test" className="text-muted-foreground hover:text-foreground block px-3 py-2 rounded-md text-base font-medium" data-testid="mobile-nav-test-alt">
                  Testbereich
                </Link>
                <Link href="/kontakt" className="button-gradient block px-3 py-2 rounded-md text-base font-medium" data-testid="mobile-nav-kontakt-alt">
                  Kontakt
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
