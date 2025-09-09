import { MessageCircle, Mic, UserCircle, Brain, Shield, Settings, Headphones, CheckCircle, Users, Zap } from "lucide-react";
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
import ChatbotWidget from "@/components/ChatbotWidget";

const products = [
  {
    id: "chatbot",
    title: "Chatbot – Antworten ohne Suchen",
    description: "Kund:innen bekommen sofort die richtige Antwort – rund um die Uhr. Generiert Leads und reduziert Standardanfragen.",
    features: ["sofortige Entlastung von Telefonklingeln und des Service-Teams", "Sofortige Antworten", "Lead-Generierung", "Terminbuchung"],
    icon: <MessageCircle className="text-primary" />,
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    gradient: "bg-gradient-to-r from-primary to-secondary",
    buttonText: "Demo testen"
  },
  {
    id: "voicebot",
    title: "Voicebot – sprechen statt tippen", 
    description: "Kein lästiges Tippen mehr – einfach sprechen und sofort empathische Antworten erhalten. Nimmt Anrufe entgegen und vereinbart Termine.",
    features: ["Natürliche Sprache", "Anruf-Entgegennahme", "Lead-Generierung"],
    icon: <Mic className="text-secondary" />,
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    gradient: "bg-gradient-to-r from-secondary to-accent",
    buttonText: "Jetzt anrufen"
  },
  {
    id: "avatar",
    title: "Avatar – Service mit Gesicht",
    description: "Persönlicher als ein Chatbot: Kund:innen haben das Gefühl, mit einem Menschen zu sprechen. Sorgt für Vertrauen.",
    features: ["Menschliche Präsenz", "Vertrauensaufbau", "Starker Eindruck"],
    icon: <UserCircle className="text-accent" />,
    image: "/images/avatar.jpg",
    gradient: "bg-gradient-to-r from-accent to-primary",
    buttonText: "Avatar erleben"
  },
  {
    id: "wissensbot",
    title: "Wissensbot – Wissen, das bleibt",
    description: "Hält internes Wissen verfügbar – auch bei Urlaub oder Teamwechsel. Erleichtert Onboarding und macht Prozesse stabil.",
    features: ["Internes Wissen", "Team-Stabilität", "Prozess-Kontinuität"],
    icon: <Brain className="text-primary" />,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
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

  const handleProductButtonClick = (productId: string) => {
    if (productId === 'chatbot') {
      // Open the n8n chatbot
      if (window.openChatbot) {
        window.openChatbot();
      }
    } else {
      // For other products, scroll to contact section
      scrollToSection('kontakt');
    }
  };

  return (
    <div className="min-h-screen" data-testid="home-page">
      <SEOHelmet 
        title="Smarter Support – digital, menschlich, effizient | Chatbot, Voicebot, Avatar & Wissensbot"
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
        <section className="hero-gradient pt-24 pb-12 px-4 sm:px-6 lg:px-8" data-testid="hero-section">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 fade-in text-white" data-testid="hero-title">
                  <span>
                    KI mit Herz & Hirn
                  </span>
                  <br />
                  <span className="text-2xl md:text-3xl">– sichere, digitale Teammitglieder für Ihren Service.</span>
                </h1>
                <p className="text-xl text-white/90 mb-8 fade-in" data-testid="hero-subtitle">
                  Unsere digitalen Teammitglieder machen Service schneller, persönlicher und verlässlicher. Kein technisches Wissen nötig – wir übernehmen Einrichtung und Support.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="button-gradient px-8 py-4 text-lg font-semibold"
                    onClick={() => scrollToSection('kontakt')}
                    data-testid="cta-primary"
                  >
                    Jetzt Erstgespräch buchen
                  </Button>
                </div>
              </div>
            </div>

            {/* Four Products Above-the-Fold */}
            <section id="produkte" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8" data-testid="products-section">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  onButtonClick={() => handleProductButtonClick(product.id)}
                />
              ))}
            </section>

            {/* Benefits */}
            <section className="py-6 px-4 sm:px-6 lg:px-8" data-testid="benefits-section">
              <div className="max-w-4xl mx-auto">
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-muted-foreground">
                  <li>• DSGVO-konform</li>
                  <li>• einfache Implementierung</li>
                  <li>• laufender Support</li>
                </ul>
              </div>
            </section>
          </div>
        </section>

        <VoiceDemo />

        {/* Central Call-to-Action */}
        <section className="py-12 px-4 sm:px-6 lg:px-8" data-testid="central-cta-section">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="glass border-primary/20">
              <CardContent className="p-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Lassen Sie uns gemeinsam herausfinden, welche Lösung zu Ihnen passt.
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Wir übernehmen die Einrichtung – Sie profitieren vom Ergebnis.
                </p>
                <Button 
                  size="lg" 
                  className="button-gradient px-12 py-6 text-xl"
                  onClick={() => scrollToSection('kontakt')}
                  data-testid="central-cta-button"
                >
                  Jetzt Erstgespräch buchen
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  15 Minuten unverbindliches Gespräch • Keine Technik-Kenntnisse nötig
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <ContactForm />
      </main>

      <Footer />
      <ChatbotWidget />
    </div>
  );
}
