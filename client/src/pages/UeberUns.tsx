import { useEffect } from "react";
import SEOHelmet from "@/components/SEOHelmet";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ChatbotWidget from "@/components/ChatbotWidget";
import zoeImage from "@assets/Zoe_Website_1757416756555.jpg";

export default function UeberUns() {
  // Automatisch zum Seitenbeginn scrollen
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <SEOHelmet 
        title="Über uns – Zoë Hagen KI Consulting"
        description="KI mit Herz & Hirn: Wir kombinieren klare Umsetzung mit verlässlichem Support – von schnellen Chatbots bis zu Wissenslösungen für Unternehmen."
        keywords="Zoë Hagen, KI Consulting, Über uns, Team, Gründerin"
      />
      
      <Navigation />
      
      <main className="min-h-screen pt-20">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 pt-6 pb-6" data-testid="hero-section">
          <div className="grid gap-6 lg:grid-cols-2 items-center">
            <div className="relative aspect-[3/4] w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto lg:mx-0 overflow-hidden rounded-lg shadow-lg">
              <img
                src={zoeImage}
                alt="Zoë Hagen, Gründerin, Portrait im Büro"
                className="w-full h-full object-cover"
                loading="eager"
                data-testid="zoe-portrait"
              />
            </div>
            <div className="text-center lg:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-4" data-testid="main-title">
                <span className="text-white">
                  KI mit Herz & Hirn
                </span>
                <span className="text-white"> – von Menschen für Menschen</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed" data-testid="intro-text">
                Ich bin Zoë Hagen, Gründerin von Zoë's KI Studio.
                Meine Mission: KI so gestalten, dass sie Unternehmen entlastet, Abläufe vereinfacht
                und Menschen mehr Freiraum gibt – verständlich, sicher und persönlich.
              </p>
              <div>
                <a
                  href="/#kontakt"
                  role="button"
                  className="inline-flex items-center rounded-md button-gradient px-6 py-3 font-medium shadow-lg"
                  data-testid="contact-cta"
                >
                  Jetzt Kontakt aufnehmen
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Wer wir sind */}
        <section className="mx-auto max-w-6xl px-4 py-4" data-testid="who-we-are-section">
          <div className="glass p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-primary">Herz & Hirn: verständlich, sicher, persönlich</h2>
            <p className="text-muted-foreground leading-relaxed">
              Ich verbinde klare Umsetzung mit einem systemischen Blick auf Prozesse und Menschen.
              Ziel ist immer ein Service, der sich leicht anfühlt und verlässlich funktioniert – ohne Hürden
              und ohne Fachsprache. Lösungen sollen im Alltag helfen, nicht beschäftigen.
            </p>
          </div>
        </section>

        {/* Team / Netzwerk */}
        <section className="mx-auto max-w-6xl px-4 py-4" data-testid="team-section">
          <div className="glass p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-primary">Ein starkes Team an meiner Seite</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Wir sind ein Team, das nicht nur KI-Lösungen entwickelt, sondern auch die passende digitale Infrastruktur bereitstellt. 
              So kombinieren wir innovative KI-Tools mit professionellem Webdesign, sicherem Betrieb und Barrierefreiheit – für digitale 
              Lösungen, die wirklich nachhaltig und zukunftsfähig sind.
            </p>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="glass p-4 rounded border border-primary/20">
                <h3 className="font-semibold text-primary mb-2">Webdesign & UX</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Gemeinsam mit der Webdesign-Firma <a 
                    href="https://www.krawall-frankfurt.de/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                    data-testid="krawall-link"
                  >Krawall aus Frankfurt</a> bieten wir modernes, professionelles Webdesign. 
                  Lisa Erwall sorgt für individuell designte, benutzerfreundliche und barrierefreie Websites, die auf allen Geräten überzeugen.
                </p>
              </div>
              
              <div className="glass p-4 rounded border border-primary/20">
                <h3 className="font-semibold text-primary mb-2">Hosting & Security</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  <a 
                    href="https://www.erpa-web.de/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                    data-testid="patrick-weber-link"
                  >Patrick Weber</a> kümmert sich um DSGVO-konformes Hosting, Datenschutz und IT-Security, 
                  damit deine Website jederzeit sicher und zuverlässig läuft.
                </p>
              </div>
            </div>
            
            <div className="mt-4 glass p-4 rounded border border-pink-300">
              <h3 className="font-semibold text-pink-600 mb-2">Enterprise Lösungen</h3>
              <p className="text-sm text-muted-foreground">
                Für größere Enterprise Lösungen kooperieren wir mit <a 
                  href="https://web.aiconiq.io/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:underline font-medium"
                  data-testid="aiconiq-link"
                >AICONIQ.io</a> und entwickeln 
                agentische KI-Lösungen für komplexe Unternehmensanforderungen.
              </p>
            </div>
          </div>
        </section>

        {/* Werte / Anspruch */}
        <section className="mx-auto max-w-6xl px-4 py-4" data-testid="values-section">
          <div className="glass p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-primary">Unser Anspruch</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="glass p-4 rounded border border-primary/20" data-testid="value-personal">
                <p className="font-medium text-foreground">Persönlich & nahbar</p>
                <p className="text-sm text-muted-foreground">Zusammenarbeit auf Augenhöhe</p>
              </div>
              <div className="glass p-4 rounded border border-primary/20" data-testid="value-clear">
                <p className="font-medium text-foreground">Klar & verständlich</p>
                <p className="text-sm text-muted-foreground">keine Fachsprache, keine Hürden</p>
              </div>
              <div className="glass p-4 rounded border border-primary/20" data-testid="value-innovative">
                <p className="font-medium text-foreground">Innovativ & zuverlässig</p>
                <p className="text-sm text-muted-foreground">sofort nutzbar und nachhaltig</p>
              </div>
              <div className="glass p-4 rounded border border-primary/20" data-testid="value-gdpr">
                <p className="font-medium text-foreground">DSGVO-konform</p>
                <p className="text-sm text-muted-foreground">Sicherheit und Datenschutz zuerst</p>
              </div>
            </div>
          </div>
        </section>

        {/* Abschluss-CTA */}
        <section className="mx-auto max-w-6xl px-4 pb-8" data-testid="final-cta-section">
          <div className="glass p-6 rounded-lg text-center border border-primary/20">
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Ob Chatbot, Voicebot, Avatar oder Wissenslösung: Wir begleiten Sie von der Idee
              bis zur Umsetzung – und bleiben als Partner an Ihrer Seite.
            </p>
            <a
              href="/#kontakt"
              role="button"
              className="inline-flex items-center rounded-md button-gradient px-6 py-3 font-medium shadow-lg"
              data-testid="consultation-cta"
            >
              Erstgespräch vereinbaren
            </a>
          </div>
        </section>
      </main>
      
      <ChatbotWidget />
      
      <Footer />
    </>
  );
}