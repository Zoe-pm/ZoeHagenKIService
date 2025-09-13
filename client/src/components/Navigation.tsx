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
  const normalLinkClass = "text-white/90 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors";
  
  // Styling für aktuelle Seite
  const activeLinkClass = "px-3 py-2 rounded-md text-sm font-medium font-semibold text-[#A7C7E7] bg-white shadow-md";

  return (
    <>
      <nav className="fixed top-4 right-4 z-40" role="navigation" aria-label="Hauptnavigation">
        <div className="hidden md:block">
          <div className="bg-[#A7C7E7] rounded-lg shadow-lg px-4 py-2">
            <div className="flex items-center space-x-4">
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
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <div className="bg-[#A7C7E7] rounded-lg shadow-lg p-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white/90 hover:text-white focus:outline-none"
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

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed top-16 right-4 bg-[#A7C7E7] rounded-lg shadow-lg">
            <div className="px-4 py-2 space-y-1">
              <Link 
                href="/" 
                className={`${location === "/" ? "bg-white text-[#A7C7E7] font-semibold shadow-md" : "text-white/90 hover:text-white"} block px-3 py-2 rounded-md text-base font-medium transition-colors`}
                data-testid="mobile-nav-home"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Start
              </Link>
              <Link 
                href="/ueber-uns" 
                className={`${location === "/ueber-uns" ? "bg-white text-[#A7C7E7] font-semibold shadow-md" : "text-white/90 hover:text-white"} block px-3 py-2 rounded-md text-base font-medium transition-colors`}
                data-testid="mobile-nav-ueber-uns"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Über uns
              </Link>
              <Link 
                href="/kontakt" 
                className={`${location === "/kontakt" ? "bg-white text-[#A7C7E7] font-semibold shadow-md" : "text-white/90 hover:text-white"} block px-3 py-2 rounded-md text-base font-medium transition-colors`}
                data-testid="mobile-nav-kontakt"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Kontakt
              </Link>
              <Link 
                href="/test" 
                className={`${location === "/test" ? "bg-white text-[#A7C7E7] font-semibold shadow-md" : "text-white/90 hover:text-white"} block px-3 py-2 rounded-md text-base font-medium transition-colors`}
                data-testid="mobile-nav-test"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Spielwiese für Kunden
              </Link>
              <Link 
                href="/admin" 
                className={`${location === "/admin" ? "bg-white text-[#A7C7E7] font-semibold shadow-md" : "text-white/90 hover:text-white"} block px-3 py-2 rounded-md text-base font-medium transition-colors`}
                data-testid="mobile-nav-admin"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin
              </Link>
            </div>
          </div>
        )}
      </nav>
      
    </>
  );
}