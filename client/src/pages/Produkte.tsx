import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Mic, UserCircle, Brain, ArrowRight, CheckCircle } from "lucide-react";
import Navigation from "@/components/Navigation";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import { SimpleChatbot, ChatbotButton } from "@/components/SimpleChatbot";

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

export default function Produkte() {
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
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-32">
        {/* Hero Section */}
        <section className="hero-gradient py-20 px-4 sm:px-6 lg:px-8" data-testid="products-hero-section">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-anthracite">
              Unsere KI-Lösungen
            </h1>
            <p className="text-xl md:text-2xl text-anthracite/80 mb-8 max-w-3xl mx-auto">
              Vier innovative KI-Assistenten, die Ihren Service revolutionieren – 
              von der ersten Kundenanfrage bis zum perfekten Abschluss.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-anthracite/70">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-accent" />
                <span>24/7 verfügbar</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-accent" />
                <span>Keine Technik-Kenntnisse nötig</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-accent" />
                <span>Komplett-Setup inklusive</span>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8" id="produkte" data-testid="products-grid-section">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Die richtige Lösung für jeden Bedarf
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Wählen Sie aus vier spezialisierten KI-Assistenten – oder kombinieren Sie mehrere für maximale Effizienz.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {products.map((product, index) => (
                <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 glass border-primary/20 flex flex-col" data-testid={`product-card-${product.id}`}>
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img 
                        src={product.image} 
                        alt={product.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        data-testid={`product-image-${product.id}`}
                      />
                      <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                        {product.icon}
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col h-full">
                      <h3 className="text-2xl font-bold mb-3" data-testid={`product-title-${product.id}`}>
                        {product.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 text-base leading-relaxed" data-testid={`product-description-${product.id}`}>
                        {product.description}
                      </p>
                      
                      <div className="space-y-2 mb-6 flex-grow">
                        {product.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2" data-testid={`product-feature-${product.id}-${idx}`}>
                            <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <Button 
                        className={`w-full ${product.gradient} text-white font-semibold group-hover:opacity-90 transition-opacity mt-auto`}
                        onClick={() => handleProductButtonClick(product.id)}
                        data-testid={`product-button-${product.id}`}
                      >
                        {product.buttonText}
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/5 to-secondary/5" data-testid="products-cta-section">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="glass border-primary/20">
              <CardContent className="p-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Bereit für Ihr Service-Update?
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Lassen Sie uns herausfinden, welche Lösung für Sie am besten passt.
                </p>
                <Button 
                  size="lg" 
                  className="button-gradient px-12 py-6 text-xl"
                  onClick={() => scrollToSection('kontakt')}
                  data-testid="products-cta-button"
                >
                  Los geht's!
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  15 Minuten unverbindliches Gespräch • Individuelle Empfehlung • Keine Technik-Kenntnisse nötig
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