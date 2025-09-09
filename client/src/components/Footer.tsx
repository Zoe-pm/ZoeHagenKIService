import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="glass mt-20 py-12 px-4 sm:px-6 lg:px-8" role="contentinfo" data-testid="footer">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold gradient-text mb-4" data-testid="footer-logo">
              KI-Assistenten
            </h3>
            <p className="text-muted-foreground mb-6" data-testid="footer-description">
              Professionelle KI-Lösungen für modernen Kundenservice. 
              DSGVO-konform, einfach zu integrieren, messbare Ergebnisse.
            </p>
            <div className="flex space-x-4" data-testid="footer-social">
              <a 
                href="#" 
                className="text-muted-foreground hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded p-1" 
                aria-label="LinkedIn"
                data-testid="footer-linkedin"
              >
                <i className="fab fa-linkedin text-xl" aria-hidden="true"></i>
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded p-1" 
                aria-label="Twitter"
                data-testid="footer-twitter"
              >
                <i className="fab fa-twitter text-xl" aria-hidden="true"></i>
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded p-1" 
                aria-label="YouTube"
                data-testid="footer-youtube"
              >
                <i className="fab fa-youtube text-xl" aria-hidden="true"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4" data-testid="footer-products-title">Produkte</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/produkte/chatbot" 
                  className="text-muted-foreground hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                  data-testid="footer-chatbot"
                >
                  Chatbot
                </Link>
              </li>
              <li>
                <Link 
                  href="/produkte/voicebot" 
                  className="text-muted-foreground hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                  data-testid="footer-voicebot"
                >
                  Voicebot
                </Link>
              </li>
              <li>
                <Link 
                  href="/produkte/avatar" 
                  className="text-muted-foreground hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                  data-testid="footer-avatar"
                >
                  Avatar
                </Link>
              </li>
              <li>
                <Link 
                  href="/produkte/wissensbot" 
                  className="text-muted-foreground hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                  data-testid="footer-wissensbot"
                >
                  Wissensbot
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4" data-testid="footer-legal-title">Rechtliches</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/impressum" 
                  className="text-muted-foreground hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                  data-testid="footer-impressum"
                >
                  Impressum
                </Link>
              </li>
              <li>
                <Link 
                  href="/datenschutz" 
                  className="text-muted-foreground hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                  data-testid="footer-datenschutz"
                >
                  Datenschutz
                </Link>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                  data-testid="footer-agb"
                >
                  AGB
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                  data-testid="footer-cookies"
                >
                  Cookie-Einstellungen
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground" data-testid="footer-copyright">
              © 2024 KI-Assistenten GmbH. Alle Rechte vorbehalten. 
              Made with <Heart className="inline-block w-4 h-4 text-secondary mx-1" /> in Deutschland
            </p>
            <p className="text-sm text-muted-foreground" data-testid="footer-accessibility">
              Diese Website ist barrierefrei nach WCAG 2.1 AA gestaltet
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
