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
import { SimpleChatbot, ChatbotButton } from "@/components/SimpleChatbot";
import { useState } from "react";

const products = [
  {
    id: "chatbot",
    title: "Chatbot – Antworten ohne Suchen",
    description: "Kund:innen bekommen sofort die richtige Antwort – rund um die Uhr. Generiert Leads und reduziert Standardanfragen.",
    features: ["Entlastet Telefon & Service-Team deutlich", "Sofortantworten 24/7", "Lead-Qualifizierung", "Terminbuchung"],
    icon: <MessageCircle className="text-primary" />,
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    gradient: "bg-gradient-to-r from-primary to-secondary",
    buttonText: "Jetzt chatten"
  },
  {
    id: "voicebot",
    title: "Voicebot – sprechen statt tippen", 
    description: "Kein lästiges Tippen mehr – einfach sprechen und sofort empathische Antworten erhalten. Nimmt Anrufe entgegen und vereinbart Termine.",
    features: ["Natürliche Sprachverarbeitung", "Anrufannahme & Rückruf", "Terminvereinbarung", "Lead-Erfassung"],
    icon: <Mic className="text-secondary" />,
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    gradient: "bg-gradient-to-r from-secondary to-accent",
    buttonText: "Sprechen Sie mit Juna"
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
  const [isChatOpen, setIsChatOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleProductButtonClick = (productId: string) => {
    if (productId === 'chatbot') {
      // Open chatbot directly
      setIsChatOpen(true);
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
                <h1 className="text-4xl md:text-6xl font-bold mb-6 fade-in" data-testid="hero-title">
                  <span className="text-white">
                    KI mit Herz & Hirn
                  </span>
                  <br />
                  <span className="text-2xl md:text-3xl text-white">– sichere, digitale Teammitglieder für Ihren Service.</span>
                </h1>
                <p className="text-xl text-white/90 mb-8 fade-in" data-testid="hero-subtitle">
                  Ihre digitalen Teammitglieder machen Service schneller, persönlicher und verlässlicher. Kein technisches Wissen nötig – wir übernehmen Einrichtung und Support.
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

            {/* Micro-Trust */}
            <section className="py-6 px-4 sm:px-6 lg:px-8" data-testid="micro-trust-section">
              <div className="max-w-4xl mx-auto">
                <ul className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center text-muted-foreground text-sm">
                  <li>• DSGVO-konform</li>
                  <li>• Barrierearm</li>
                  <li>• Hosting in der EU</li>
                  <li>• Laufender Support</li>
                </ul>
              </div>
            </section>

            {/* So arbeiten wir */}
            <section className="py-12 px-4 sm:px-6 lg:px-8" data-testid="process-section">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12 text-white">So arbeiten wir</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="relative group">
                    <div className="bg-white/95 backdrop-blur-sm p-6 rounded-lg border border-white/40 hover:bg-white/100 transition-all duration-300 h-full flex flex-col shadow-lg">
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-xl mx-auto mb-4 shadow-lg">
                        1
                      </div>
                      <h3 className="font-bold text-gray-800 mb-3 text-center text-lg">Erstgespräch</h3>
                      <p className="text-gray-600 mb-2 text-center text-sm">(30 Min.)</p>
                      <p className="text-gray-700 text-center text-sm flex-grow">Ziele & Use-Cases klären</p>
                    </div>
                    {/* Connection line */}
                    <div className="hidden lg:block absolute top-8 -right-3 w-6 h-0.5 bg-gradient-to-r from-gray-400/50 to-transparent"></div>
                  </div>
                  
                  <div className="relative group">
                    <div className="bg-white/95 backdrop-blur-sm p-6 rounded-lg border border-white/40 hover:bg-white/100 transition-all duration-300 h-full flex flex-col shadow-lg">
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold text-xl mx-auto mb-4 shadow-lg">
                        2
                      </div>
                      <h3 className="font-bold text-gray-800 mb-3 text-center text-lg">Pilot</h3>
                      <p className="text-gray-600 mb-2 text-center text-sm">(2 Wochen)</p>
                      <p className="text-gray-700 text-center text-sm flex-grow">Prototyp mit echtem Inhalt</p>
                    </div>
                    {/* Connection line */}
                    <div className="hidden lg:block absolute top-8 -right-3 w-6 h-0.5 bg-gradient-to-r from-gray-400/50 to-transparent"></div>
                  </div>
                  
                  <div className="relative group">
                    <div className="bg-white/95 backdrop-blur-sm p-6 rounded-lg border border-white/40 hover:bg-white/100 transition-all duration-300 h-full flex flex-col shadow-lg">
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold text-xl mx-auto mb-4 shadow-lg">
                        3
                      </div>
                      <h3 className="font-bold text-gray-800 mb-3 text-center text-lg">Rollout</h3>
                      <p className="text-gray-600 mb-2 text-center text-sm">&nbsp;</p>
                      <p className="text-gray-700 text-center text-sm flex-grow">Schulung, Feinschliff, Go-Live</p>
                    </div>
                    {/* Connection line */}
                    <div className="hidden lg:block absolute top-8 -right-3 w-6 h-0.5 bg-gradient-to-r from-gray-400/50 to-transparent"></div>
                  </div>
                  
                  <div className="relative group">
                    <div className="bg-white/95 backdrop-blur-sm p-6 rounded-lg border border-white/40 hover:bg-white/100 transition-all duration-300 h-full flex flex-col shadow-lg">
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-xl mx-auto mb-4 shadow-lg">
                        4
                      </div>
                      <h3 className="font-bold text-gray-800 mb-3 text-center text-lg">Support</h3>
                      <p className="text-gray-600 mb-2 text-center text-sm">&nbsp;</p>
                      <p className="text-gray-700 text-center text-sm flex-grow">Monitoring & laufende Optimierung</p>
                    </div>
                  </div>
                </div>
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

      <SimpleChatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <ChatbotButton onClick={() => setIsChatOpen(true)} />
      
      <Footer />
    </div>
  );
}
