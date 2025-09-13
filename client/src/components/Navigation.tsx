import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";

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

  // Styling für normale Links
  const normalLinkClass = "text-white/80 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white";
  
  // Styling für aktuelle Seite
  const activeLinkClass = "px-3 py-2 rounded-md text-sm font-medium font-semibold text-[#5DADE2] bg-white shadow-md";

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#5DADE2]" role="navigation" aria-label="Hauptnavigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <span className="text-lg font-medium text-white" data-testid="company-name">
                  Zoë Hagen Ki Consulting
                </span>
              </Link>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {/* Alle Links gleich, nur aktuelle Seite hervorheben */}
                <Link 
                  href="/" 
                  className={location === "/" ? activeLinkClass : normalLinkClass}
                  data-testid="nav-home"
                >
                  Start
                </Link>
                <Link 
                  href="/ueber-uns" 
                  className={location === "/ueber-uns" ? activeLinkClass : normalLinkClass}
                  data-testid="nav-ueber-uns"
                >
                  Über uns
                </Link>
                <Link 
                  href="/kontakt" 
                  className={location === "/kontakt" ? activeLinkClass : normalLinkClass}
                  data-testid="nav-kontakt"
                >
                  Kontakt
                </Link>
                <Link 
                  href="/test" 
                  className={location === "/test" ? activeLinkClass : normalLinkClass}
                  data-testid="nav-test"
                >
                  Spielwiese für Kunden
                </Link>
                <Link 
                  href="/admin" 
                  className={location === "/admin" ? activeLinkClass : normalLinkClass}
                  data-testid="nav-admin"
                >
                  Admin
                </Link>
              </div>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
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
          <div className="md:hidden bg-[#5DADE2]">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link 
                href="/" 
                className={`${location === "/" ? "bg-white text-[#5DADE2] font-semibold shadow-md" : "text-white/80 hover:text-white"} block px-3 py-2 rounded-md text-base font-medium transition-colors`}
                data-testid="mobile-nav-home"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Start
              </Link>
              <Link 
                href="/ueber-uns" 
                className={`${location === "/ueber-uns" ? "bg-white text-[#5DADE2] font-semibold shadow-md" : "text-white/80 hover:text-white"} block px-3 py-2 rounded-md text-base font-medium transition-colors`}
                data-testid="mobile-nav-ueber-uns"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Über uns
              </Link>
              <Link 
                href="/kontakt" 
                className={`${location === "/kontakt" ? "bg-white text-[#5DADE2] font-semibold shadow-md" : "text-white/80 hover:text-white"} block px-3 py-2 rounded-md text-base font-medium transition-colors`}
                data-testid="mobile-nav-kontakt"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Kontakt
              </Link>
              <Link 
                href="/test" 
                className={`${location === "/test" ? "bg-white text-[#5DADE2] font-semibold shadow-md" : "text-white/80 hover:text-white"} block px-3 py-2 rounded-md text-base font-medium transition-colors`}
                data-testid="mobile-nav-test"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Spielwiese für Kunden
              </Link>
              <Link 
                href="/admin" 
                className={`${location === "/admin" ? "bg-white text-[#5DADE2] font-semibold shadow-md" : "text-white/80 hover:text-white"} block px-3 py-2 rounded-md text-base font-medium transition-colors`}
                data-testid="mobile-nav-admin"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin
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