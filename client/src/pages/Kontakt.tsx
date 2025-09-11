import { useEffect, useState } from "react";
import SEOHelmet from "@/components/SEOHelmet";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import ChatbotWidget from "@/components/ChatbotWidget";

export default function Kontakt() {
  const [calendlyLoaded, setCalendlyLoaded] = useState(false);
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
        
        {/* Terminbuchung */}
        <section className="py-12 px-4 sm:px-6 lg:px-8" data-testid="booking-section">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 text-primary">📅 {calendlyUrl ? 'Alternative Buchungsmöglichkeiten' : 'Termin buchen'}</h2>
              <p className="text-lg text-muted-foreground">
                {calendlyUrl ? 'Oder wählen Sie Ihren bevorzugten Kontaktweg' : 'Wählen Sie Ihren bevorzugten Weg für die Terminbuchung'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* E-Mail Buchung */}
              <div className="glass p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-primary">✉️ Per E-Mail buchen</h3>
                <p className="text-muted-foreground mb-4">
                  Senden Sie uns eine E-Mail mit Ihren Wunschterminen und wir melden uns schnellstmöglich zurück.
                </p>
                <div className="space-y-3">
                  <p className="text-sm"><strong>E-Mail:</strong> zoe-kiconsulting@pm.me</p>
                  <p className="text-sm"><strong>Betreff:</strong> Erstgespräch Terminanfrage</p>
                  <p className="text-sm"><strong>Antwortzeit:</strong> Binnen 24 Stunden</p>
                </div>
                <a 
                  href="mailto:zoe-kiconsulting@pm.me?subject=Erstgespräch Terminanfrage&body=Hallo Zoë,%0D%0A%0D%0AIch interessiere mich für ein kostenloses Erstgespräch.%0D%0A%0D%0AMeine Wunschtermine:%0D%0A- Termin 1: %0D%0A- Termin 2: %0D%0A- Termin 3: %0D%0A%0D%0AKurze Beschreibung meines Projekts:%0D%0A%0D%0A%0D%0AViele Grüße"
                  className="inline-block mt-4 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-medium"
                  data-testid="email-booking-button"
                >
                  E-Mail senden
                </a>
              </div>
              
              {/* Online Kalender Status */}
              <div className="glass p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-primary">🗓️ Online-Kalender</h3>
                {calendlyUrl ? (
                  <>
                    <p className="text-muted-foreground mb-4">
                      Wählen Sie einen passenden Zeitpunkt direkt in unserem Online-Kalender oben.
                    </p>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 mb-4">
                      <p className="text-sm font-medium">✓ Kalender verfügbar</p>
                      <p className="text-sm mt-1">
                        Direkte Terminbuchung ist aktiviert.
                      </p>
                    </div>
                    <a 
                      href={calendlyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-medium"
                      data-testid="calendar-booking-button"
                    >
                      Neues Fenster öffnen
                    </a>
                  </>
                ) : (
                  <>
                    <p className="text-muted-foreground mb-4">
                      Für die Aktivierung des Online-Kalenders muss die VITE_CALENDLY_URL konfiguriert werden.
                    </p>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800">
                      <p className="text-sm font-medium">⚡ Konfiguration erforderlich</p>
                      <p className="text-sm mt-1">
                        Setzen Sie VITE_CALENDLY_URL in den Environment Variables.
                      </p>
                    </div>
                    <button 
                      disabled
                      className="mt-4 bg-gray-300 text-gray-500 px-6 py-3 rounded-lg cursor-not-allowed font-medium"
                      data-testid="calendar-booking-button"
                    >
                      Konfiguration erforderlich
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Additional Contact Info */}
        <section className="py-8 px-4 sm:px-6 lg:px-8" data-testid="contact-info-section">
          <div className="max-w-4xl mx-auto">
            <div className="glass p-8 rounded-lg text-center">
              <h2 className="text-2xl font-bold mb-6 text-primary">Weitere Kontaktmöglichkeiten</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-4 rounded border border-primary/20">
                  <h3 className="font-semibold text-foreground mb-2">Sofortiger Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Nutzen Sie unseren Chatbot für schnelle Antworten auf häufige Fragen.
                  </p>
                </div>
                <div className="glass p-4 rounded border border-primary/20">
                  <h3 className="font-semibold text-foreground mb-2">Individuelle Beratung</h3>
                  <p className="text-sm text-muted-foreground">
                    Persönliches Erstgespräch für maßgeschneiderte KI-Lösungen.
                  </p>
                </div>
                <div className="glass p-4 rounded border border-primary/20">
                  <h3 className="font-semibold text-foreground mb-2">Demo & Test</h3>
                  <p className="text-sm text-muted-foreground">
                    Erleben Sie unsere KI-Assistenten live in einer persönlichen Demo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <ChatbotWidget />
      
      <Footer />
    </>
  );
}