import { MessageCircle, Mic, UserCircle, Brain, Shield, Settings, Headphones } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
    title: "Chatbot",
    description: "24/7 Website-Assistent für Kundenfragen, Terminbuchung und Produktberatung. Sofort einsatzbereit.",
    features: ["Live-Chat Integration", "FAQ-Automatisierung", "Lead-Qualifizierung"],
    icon: <MessageCircle className="text-primary" />,
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    gradient: "bg-gradient-to-r from-primary to-secondary",
    buttonText: "Demo testen"
  },
  {
    id: "voicebot",
    title: "Voicebot", 
    description: "Intelligente Telefonzentrale mit natürlicher Spracherkennung für professionellen Kundenservice.",
    features: ["Anruf-Routing", "Terminvereinbarung", "24/7 Erreichbarkeit"],
    icon: <Mic className="text-secondary" />,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    gradient: "bg-gradient-to-r from-secondary to-accent",
    buttonText: "15-Min Gespräch"
  },
  {
    id: "avatar",
    title: "Avatar",
    description: "Digitaler Berater mit Gesicht für FAQ und Standardfragen. Antwortet auf vordefinierte Themen.",
    features: ["Visuelle Präsenz", "FAQ-Spezialist", "Einfache Einrichtung"],
    icon: <UserCircle className="text-accent" />,
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    gradient: "bg-gradient-to-r from-accent to-primary",
    buttonText: "Avatar erleben"
  },
  {
    id: "wissensbot",
    title: "Wissensbot",
    description: "Komplexer Unternehmens-Assistent mit tiefem Prozessverständnis. Braucht Interviews und individuelle Entwicklung.",
    features: ["Prozess-Integration", "Interview-Phase nötig", "Aufwendige Anpassung"],
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
        <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8" data-testid="hero-section">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 fade-in" data-testid="hero-title">
                <span className="gradient-text">
                  KI-Assistenten
                </span>
                <br />für Ihr Unternehmen
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6 fade-in" data-testid="hero-subtitle">
                Vier professionelle KI-Lösungen für modernen Kundenservice. 
                DSGVO-konform, schnelle Integration.
              </p>
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
