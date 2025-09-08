import { MessageCircle, Mic, UserCircle, Brain, Shield, Settings, Headphones } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import AccessibilityBanner from "@/components/AccessibilityBanner";
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
    description: "24/7 Kundensupport auf Ihrer Website. Beantwortet häufige Fragen automatisch und leitet komplexe Anfragen weiter.",
    features: ["Sofortige Antworten", "Website-Integration", "Mehrsprachig"],
    icon: <MessageCircle className="text-primary" />,
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    gradient: "bg-gradient-to-r from-primary to-secondary",
    buttonText: "Demo testen"
  },
  {
    id: "voicebot",
    title: "Voicebot", 
    description: "Intelligente Telefon-Assistenz, die Anrufe entgegennimmt, weiterleitet und einfache Serviceanfragen bearbeitet.",
    features: ["Telefon-Integration", "Natürliche Sprache", "Terminbuchung"],
    icon: <Mic className="text-secondary" />,
    image: "https://images.unsplash.com/photo-1589254065878-42c9da997008?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    gradient: "bg-gradient-to-r from-secondary to-accent",
    buttonText: "Jetzt anrufen"
  },
  {
    id: "avatar",
    title: "Avatar",
    description: "Visueller KI-Assistent mit menschlichem Gesicht für persönlichere Kundeninteraktionen auf Ihrer Website.",
    features: ["Gesicht & Stimme", "Emotionale Intelligenz", "Personalisiert"],
    icon: <UserCircle className="text-accent" />,
    image: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    gradient: "bg-gradient-to-r from-accent to-primary",
    buttonText: "Avatar erleben"
  },
  {
    id: "wissensbot",
    title: "Wissensbot",
    description: "Interner KI-Assistent für Mitarbeiter-Onboarding und schnellen Zugriff auf Unternehmenswissen und Prozesse.",
    features: ["Internes Wissen", "Onboarding-Hilfe", "Prozess-Optimierung"],
    icon: <Brain className="text-primary" />,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    gradient: "bg-gradient-to-r from-primary to-accent",
    buttonText: "Mehr erfahren"
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
      
      <AccessibilityBanner />
      
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
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8" data-testid="hero-section">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 fade-in" data-testid="hero-title">
                <span className="gradient-text">
                  KI-Assistenten
                </span>
                <br />für Ihr Unternehmen
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 fade-in" data-testid="hero-subtitle">
                Verbessern Sie Ihren Kundenservice mit unseren vier professionellen KI-Lösungen. 
                DSGVO-konform, einfach zu integrieren, in nur 30 Tagen einsatzbereit.
              </p>
            </div>

            {/* Four Products Above-the-Fold */}
            <section id="produkte" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-20" data-testid="products-section">
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
        <section className="py-20 px-4 sm:px-6 lg:px-8" data-testid="about-section">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                  alt="Professionelles Team bei der Diskussion von KI-Technologie-Lösungen" 
                  className="rounded-lg shadow-2xl" 
                  loading="lazy"
                  data-testid="about-image"
                />
              </div>
              <div>
                <h2 className="text-4xl font-bold mb-6" data-testid="about-title">Über uns</h2>
                <p className="text-muted-foreground text-lg mb-6" data-testid="about-description">
                  Wir sind Ihr spezialisierter Partner für professionelle KI-Assistenten. Mit über 5 Jahren 
                  Erfahrung haben wir bereits 200+ Unternehmen dabei geholfen, ihren Kundenservice zu 
                  automatisieren und zu verbessern.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center" data-testid="about-feature-1">
                    <Shield className="text-accent text-xl mr-4" />
                    <span>100% DSGVO-konform und sicher</span>
                  </div>
                  <div className="flex items-center" data-testid="about-feature-2">
                    <Settings className="text-accent text-xl mr-4" />
                    <span>Einfache Integration in bestehende Systeme</span>
                  </div>
                  <div className="flex items-center" data-testid="about-feature-3">
                    <Headphones className="text-accent text-xl mr-4" />
                    <span>24/7 technischer Support</span>
                  </div>
                </div>
                <Card className="glass">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground" data-testid="about-tip">
                      <Mic className="inline-block text-secondary mr-2" />
                      <strong>Tipp:</strong> Fragen Sie unseren Voicebot: "Erzähl mir mehr über euer Unternehmen" 
                      - er beantwortet auch Details über uns!
                    </p>
                  </CardContent>
                </Card>
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
