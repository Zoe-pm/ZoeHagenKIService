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

const products = [
  {
    id: "chatbot",
    title: "Chatbot – Antworten ohne Suchen",
    description: "Kund:innen bekommen sofort die richtige Antwort – rund um die Uhr. Generiert Leads und reduziert Standardanfragen.",
    features: ["Sofortige Antworten", "Lead-Generierung", "Terminbuchung"],
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
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
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
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
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
              <div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 fade-in" data-testid="hero-title">
                  <span className="gradient-text">
                    KI mit Herz & Hirn
                  </span>
                  <br />
                  <span className="text-foreground text-2xl md:text-3xl">– sichere, digitale Teammitglieder für Ihren Service.</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8 fade-in" data-testid="hero-subtitle">
                  Unsere digitalen Teammitglieder machen Service schneller, persönlicher und verlässlicher. Kein technisches Wissen nötig – wir übernehmen Einrichtung und Support.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
            </div>

            {/* Four Products Above-the-Fold */}
            <section id="produkte" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8" data-testid="products-section">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  onButtonClick={() => scrollToSection('kontakt')}
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

        {/* Visual Showcase */}
        <section id="demo" className="py-12 px-4 sm:px-6 lg:px-8" data-testid="visual-showcase-section">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">So sieht das im Einsatz aus</h2>
              <p className="text-muted-foreground">Echte Anwendungen unserer KI-Assistenten in verschiedenen Unternehmen</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="relative group">
                <img 
                  src="https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                  alt="Mitarbeiter nutzt Chatbot am Computer für Kundensupport" 
                  className="rounded-lg shadow-lg w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-semibold">Website-Chatbot</h3>
                  <p className="text-sm opacity-90">24/7 Kundensupport ohne Pausen</p>
                </div>
              </div>
              
              <div className="relative group">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                  alt="Geschäftsfrau führt Telefonat mit Voicebot-Unterstützung" 
                  className="rounded-lg shadow-lg w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-semibold">Voicebot-Zentrale</h3>
                  <p className="text-sm opacity-90">Intelligente Anrufweiterleitung</p>
                </div>
              </div>
              
              <div className="relative group">
                <img 
                  src="https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                  alt="Avatar-Interface auf Tablet zeigt menschliches Gesicht" 
                  className="rounded-lg shadow-lg w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-semibold">Avatar-Beratung</h3>
                  <p className="text-sm opacity-90">Persönlicher Kundenberater</p>
                </div>
              </div>
              
              <div className="relative group">
                <img 
                  src="https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                  alt="Team nutzt Wissensbot für Onboarding neuer Mitarbeiter" 
                  className="rounded-lg shadow-lg w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-semibold">Wissensbot-Training</h3>
                  <p className="text-sm opacity-90">Schnelles Mitarbeiter-Onboarding</p>
                </div>
              </div>
              
              <div className="relative group">
                <img 
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                  alt="Büro mit mehreren Bildschirmen zeigt KI-Dashboard" 
                  className="rounded-lg shadow-lg w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-semibold">KI-Dashboard</h3>
                  <p className="text-sm opacity-90">Zentrale Steuerung aller Bots</p>
                </div>
              </div>
              
              <div className="relative group">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                  alt="Teammeetung zur Integration von KI-Systemen" 
                  className="rounded-lg shadow-lg w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-semibold">Integration & Support</h3>
                  <p className="text-sm opacity-90">Persönliche Betreuung durch unser Team</p>
                </div>
              </div>
            </div>
          </div>
        </section>

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
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-12 py-6 text-xl"
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
    </div>
  );
}
