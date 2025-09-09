import { MessageCircle, Mic, UserCircle, Brain, Shield, Settings, Headphones } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import ProductCard from "@/components/ProductCard";
import VoiceDemo from "@/components/VoiceDemo";
import ComparisonTable from "@/components/ComparisonTable";
import Timeline from "@/components/Timeline";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import SEOHelmet from "@/components/SEOHelmet";

const products = [
  {
    id: "chatbot",
    title: "Chatbot – Antworten ohne Suchen",
    description: "Kund:innen bekommen sofort die richtige Antwort – rund um die Uhr. Generiert Leads, vereinbart Termine und reduziert Standardanfragen.",
    features: ["Sofortige Antworten", "Lead-Generierung", "Terminbuchung"],
    icon: <MessageCircle className="text-primary" />,
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    gradient: "bg-gradient-to-r from-primary to-secondary",
    buttonText: "Demo testen"
  },
  {
    id: "voicebot",
    title: "Voicebot – sprechen statt tippen", 
    description: "Kein lästiges Tippen mehr – einfach sprechen und sofort empathische, fundierte Antworten erhalten. Nimmt Anrufe entgegen, generiert Leads und vereinbart Termine.",
    features: ["Natürliche Sprache", "Anruf-Entgegennahme", "Lead-Generierung"],
    icon: <Mic className="text-secondary" />,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    gradient: "bg-gradient-to-r from-secondary to-accent",
    buttonText: "Jetzt anrufen"
  },
  {
    id: "avatar",
    title: "Avatar – Service mit Gesicht",
    description: "Wie ein Voicebot, nur persönlicher: Kund:innen haben das Gefühl, mit einem Menschen zu sprechen. Sorgt für Vertrauen und einen starken ersten Eindruck.",
    features: ["Menschliche Präsenz", "Vertrauensaufbau", "Starker Eindruck"],
    icon: <UserCircle className="text-accent" />,
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    gradient: "bg-gradient-to-r from-accent to-primary",
    buttonText: "Avatar erleben"
  },
  {
    id: "wissensbot",
    title: "Wissensbot – Wissen, das bleibt",
    description: "Hält internes Wissen verfügbar – auch bei Urlaub oder Wechsel im Team. Erleichtert Onboarding und macht Prozesse stabil.",
    features: ["Internes Wissen", "Team-Stabilität", "Prozess-Kontinuität"],
    icon: <Brain className="text-primary" />,
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    gradient: "bg-gradient-to-r from-primary to-accent",
    buttonText: "Beratung buchen"
  }
];

export default function Home() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen" data-testid="home-page">
      <SEOHelmet 
        title="KI-Assistenten für Ihr Unternehmen | Chatbot, Voicebot, Avatar & Wissensbot"
        description="Professionelle KI-Lösungen: Chatbot, Voicebot, Avatar und Wissensbot für besseren Kundenservice. DSGVO-konform, einfache Integration, 30 Tage Setup."
        keywords="KI Assistenten, Chatbot, Voicebot, Avatar, Wissensbot, KI Kundenservice, DSGVO konform"
      />
      
      
      {/* Skip to main content */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
        data-testid="skip-to-main"
      >
        Zum Hauptinhalt springen
      </a>
      
      <Navigation />

      {/* Hero Section */}
      <main id="main-content">
        <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8" data-testid="hero-section">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 fade-in" data-testid="hero-title">
                  <span className="gradient-text">
                    KI mit Herz & Hirn
                  </span>
                  <br />
                  <span className="text-foreground">– sicher, einfach, persönlich.</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8 fade-in" data-testid="hero-subtitle">
                  Digitale Helfer, die Service sofort leichter machen – ohne Technik-Wissen, DSGVO-konform und mit vollem Support durch uns.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-4 text-lg"
                    onClick={() => scrollToSection('kontakt')}
                    data-testid="cta-primary"
                  >
                    Jetzt Erstgespräch buchen
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-accent text-accent hover:bg-accent hover:text-accent-foreground px-8 py-4 text-lg"
                    onClick={() => scrollToSection('demo')}
                    data-testid="cta-secondary"
                  >
                    Live-Demo ansehen
                  </Button>
                </div>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                  alt="Person im Dialog mit KI-Avatar auf Bildschirm - moderne Mensch-Maschine-Interaktion" 
                  className="rounded-2xl shadow-2xl w-full" 
                  data-testid="hero-image"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-2xl"></div>
              </div>
            </div>

            {/* Four Products Above-the-Fold */}
            <section id="produkte" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12" data-testid="products-section">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  onButtonClick={() => scrollToSection('kontakt')}
                />
              ))}
            </section>
          </div>
        </section>

        <VoiceDemo />

        <ComparisonTable />

        <Timeline />

        {/* About Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8" data-testid="about-section">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                  alt="Mensch-Maschine-Interaktion: Person arbeitet mit KI-Interface am Computer" 
                  className="rounded-lg shadow-2xl" 
                  loading="lazy"
                  data-testid="about-image"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-4" data-testid="about-title">Ihre KI-Partner</h2>
                <p className="text-muted-foreground mb-6" data-testid="about-description">
                  Spezialisiert auf professionelle KI-Assistenten. 200+ erfolgreiche Implementierungen, 
                  maßgeschneiderte Lösungen für jeden Anwendungsfall.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <Shield className="text-accent text-2xl mx-auto mb-2" />
                    <span className="text-sm">DSGVO-konform</span>
                  </div>
                  <div className="text-center">
                    <Settings className="text-accent text-2xl mx-auto mb-2" />
                    <span className="text-sm">Einfache Integration</span>
                  </div>
                  <div className="text-center">
                    <Headphones className="text-accent text-2xl mx-auto mb-2" />
                    <span className="text-sm">24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ContactForm />
      </main>

      <Footer />
    </div>
  );
}
