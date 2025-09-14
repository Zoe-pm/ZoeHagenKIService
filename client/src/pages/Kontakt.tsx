import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SimpleChatbot } from "@/components/SimpleChatbot";
import { useLocation } from "wouter";
import SEOHelmet from "@/components/SEOHelmet";
import Navigation from "@/components/Navigation";
import ContactForm from "@/components/ContactForm";
import VoicebotWidget from "@/components/VoicebotWidget";
const zoePhoto = "/images/zoe-photo.jpg";

export default function Kontakt() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [, setLocation] = useLocation();

  // Automatisch zum Seitenbeginn scrollen beim Laden der Kontaktseite
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <SEOHelmet 
        title="Kontakt – Zoë's KI Service | Gespräch vereinbaren"
        description="Kontaktieren Sie Zoë's KI Service für Ihr persönliches Gespräch. Professionelle KI-Lösungen: Chatbot, Voicebot, Avatar und Wissensbot."
        keywords="Kontakt, Gespräch, Beratung, KI-Lösungen, Chatbot, Voicebot"
      />
      
      <Navigation />
      
      <main className="min-h-screen pt-20">
        {/* Hero with Photo */}
        <section className="hero-gradient py-16 px-4 sm:px-6 lg:px-8" data-testid="contact-hero">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 mb-8">
              {/* Photo at the top */}
              <div className="flex-shrink-0 order-first lg:order-last">
                <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white">
                  <img 
                    src={zoePhoto}
                    alt="Zoë Hagen - Gründerin von Zoë's KI Service"
                    className="w-full h-full object-cover object-top"
                    style={{ objectPosition: '50% 15%' }}
                    data-testid="zoe-contact-photo"
                  />
                </div>
              </div>
              
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6" data-testid="contact-title">
                  Lassen Sie uns sprechen
                </h1>
                <p className="text-xl text-white/90 mb-8" data-testid="contact-subtitle">
                  In einem unverbindlichen Gespräch finden wir heraus, welche KI-Lösung 
                  perfekt zu Ihren Bedürfnissen passt.
                </p>
                <div className="max-w-2xl mx-auto lg:mx-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white/80 text-sm">
                    <div>✓ 30 Minuten kostenlos</div>
                    <div>✓ Unverbindliche Beratung</div>
                    <div>✓ Konkrete Lösungsvorschläge</div>
                  </div>
                </div>
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


        {/* Additional Contact Info */}
        <section className="py-8 px-4 sm:px-6 lg:px-8" data-testid="contact-info-section">
          <div className="max-w-4xl mx-auto">
            <div className="glass p-8 rounded-lg text-center">
              <h2 className="text-2xl font-bold mb-6 text-primary">Weitere Information erhalten</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-4 rounded border border-primary/20 cursor-pointer hover:bg-primary/5 transition-colors flex flex-col h-full" onClick={() => setIsChatOpen(true)}>
                  <h3 className="font-semibold text-foreground mb-2">Sofortiger Support</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">
                    Nutzen Sie unseren Chatbot für schnelle Antworten auf häufige Fragen.
                  </p>
                  <Button size="sm" className="button-gradient w-full" data-testid="open-chatbot-support">
                    Los geht´s!
                  </Button>
                </div>
                <div className="glass p-4 rounded border border-primary/20 cursor-pointer hover:bg-primary/5 transition-colors flex flex-col h-full" onClick={() => setIsVoiceOpen(true)}>
                  <h3 className="font-semibold text-foreground mb-2">Mit Juna sprechen</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">
                    Sprechen Sie direkt mit Juna. Sie ist 24/7 für Sie am Start.
                  </p>
                  <Button size="sm" className="button-gradient w-full" data-testid="speak-with-juna">
                    Los geht´s!
                  </Button>
                </div>
                <div className="glass p-4 rounded border border-primary/20 cursor-pointer hover:bg-primary/5 transition-colors flex flex-col h-full" onClick={() => window.open('tel:+4917198627773')}>
                  <h3 className="font-semibold text-foreground mb-2">Einfach anrufen</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">
                    Wenn Sie lieber mit mir direkt sprechen wollen, scheuen Sie sich nicht einfach anzurufen. Ich freue mich auf Sie!
                  </p>
                  <Button size="sm" className="button-gradient w-full" data-testid="direct-call">
                    Los geht´s!
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <SimpleChatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <VoicebotWidget isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} />
    </>
  );
}