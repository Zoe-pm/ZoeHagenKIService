import { useEffect } from "react";
import SEOHelmet from "@/components/SEOHelmet";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import ChatbotWidget from "@/components/ChatbotWidget";

export default function Kontakt() {
  // Automatisch zum Seitenbeginn scrollen beim Laden der Kontaktseite
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Calendly Widget initialisieren
    const timer = setTimeout(() => {
      if (window.Calendly) {
        window.Calendly.initInlineWidget({
          url: 'https://calendly.com/zoe-kiconsulting',
          parentElement: document.getElementById('calendly-inline-widget')
        });
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

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

        {/* Calendly Terminbuchung */}
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