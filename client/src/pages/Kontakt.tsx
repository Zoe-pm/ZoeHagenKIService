import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SimpleChatbot } from "@/components/SimpleChatbot";
import { useLocation } from "wouter";
import SEOHelmet from "@/components/SEOHelmet";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import ChatbotWidget from "@/components/ChatbotWidget";

export default function Kontakt() {
  const [calendlyLoaded, setCalendlyLoaded] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [, setLocation] = useLocation();
  const calendlyUrl = import.meta.env.VITE_CALENDLY_URL;

  // Automatisch zum Seitenbeginn scrollen beim Laden der Kontaktseite
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Nur Calendly laden wenn URL konfiguriert ist
    if (calendlyUrl) {
      // Calendly Script laden
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.onload = () => {
        // Calendly Widget initialisieren
        const timer = setTimeout(() => {
          if (window.Calendly) {
            window.Calendly.initInlineWidget({
              url: calendlyUrl,
              parentElement: document.getElementById('calendly-inline-widget')
            });
            setCalendlyLoaded(true);
          }
        }, 500);
        return () => clearTimeout(timer);
      };
      document.head.appendChild(script);
    }
  }, [calendlyUrl]);

  return (
    <>
      <SEOHelmet 
        title="Kontakt – Zoë's KI Studio | Erstgespräch vereinbaren"
        description="Kontaktieren Sie Zoë's KI Studio für Ihr persönliches Erstgespräch. Professionelle KI-Lösungen: Chatbot, Voicebot, Avatar und Wissensbot."
        keywords="Kontakt, Erstgespräch, Beratung, KI-Lösungen, Chatbot, Voicebot"
      />
      
      <Navigation />
      
      <main className="min-h-screen pt-20">
        {/* Hero */}
        <section className="hero-gradient py-16 px-4 sm:px-6 lg:px-8" data-testid="contact-hero">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6" data-testid="contact-title">
              Lassen Sie uns sprechen
            </h1>
            <p className="text-xl text-white/90 mb-8" data-testid="contact-subtitle">
              In einem unverbindlichen Erstgespräch finden wir heraus, welche KI-Lösung 
              perfekt zu Ihren Bedürfnissen passt.
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white/80 text-sm">
                <div>✓ 30 Minuten kostenlos</div>
                <div>✓ Unverbindliche Beratung</div>
                <div>✓ Konkrete Lösungsvorschläge</div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8" data-testid="contact-form-section">
          <div className="max-w-4xl mx-auto">
            <ContactForm />
          </div>
        </section>

        {/* Calendly Inline Widget */}
        {calendlyUrl && (
          <section className="py-12 px-4 sm:px-6 lg:px-8" data-testid="calendly-section">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4 text-primary">📅 Termin direkt buchen</h2>
                <p className="text-lg text-muted-foreground">
                  Wählen Sie einen passenden Zeitpunkt für Ihr kostenloses Erstgespräch
                </p>
              </div>
              <div className="glass p-2 rounded-lg">
                <div 
                  id="calendly-inline-widget" 
                  style={{minWidth: '320px', height: '700px'}}
                  data-testid="calendly-widget"
                ></div>
                {!calendlyLoaded && (
                  <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Kalender wird geladen...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Additional Contact Info */}
        <section className="py-8 px-4 sm:px-6 lg:px-8" data-testid="contact-info-section">
          <div className="max-w-4xl mx-auto">
            <div className="glass p-8 rounded-lg text-center">
              <h2 className="text-2xl font-bold mb-6 text-primary">Weitere Kontaktmöglichkeiten</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-4 rounded border border-primary/20 cursor-pointer hover:bg-primary/5 transition-colors" onClick={() => setIsChatOpen(true)}>
                  <h3 className="font-semibold text-foreground mb-2">Sofortiger Support</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Nutzen Sie unseren Chatbot für schnelle Antworten auf häufige Fragen.
                  </p>
                  <Button size="sm" className="bg-primary hover:bg-primary/90" data-testid="open-chatbot-support">
                    Chat starten
                  </Button>
                </div>
                <div className="glass p-4 rounded border border-primary/20 cursor-pointer hover:bg-primary/5 transition-colors" onClick={() => window.open(calendlyUrl || 'mailto:zoe-kiconsulting@pm.me?subject=Individuelle Beratung', '_blank')}>
                  <h3 className="font-semibold text-foreground mb-2">Individuelle Beratung</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Persönliches Erstgespräch für maßgeschneiderte KI-Lösungen.
                  </p>
                  <Button size="sm" className="bg-secondary hover:bg-secondary/90" data-testid="book-consultation">
                    {calendlyUrl ? 'Termin buchen' : 'E-Mail senden'}
                  </Button>
                </div>
                <div className="glass p-4 rounded border border-primary/20 cursor-pointer hover:bg-primary/5 transition-colors" onClick={() => setLocation('/kunden-test')}>
                  <h3 className="font-semibold text-foreground mb-2">Demo & Test</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Testen Sie unsere KI-Assistenten direkt auf der Konfigurationsseite.
                  </p>
                  <Button size="sm" className="bg-accent hover:bg-accent/90" data-testid="demo-test">
                    Zur Demo-Seite
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <SimpleChatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <ChatbotWidget />
      
      <Footer />
    </>
  );
}