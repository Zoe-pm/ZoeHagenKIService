import { useState, useEffect, lazy, Suspense } from "react";
import { Shield, Settings, Headphones, CheckCircle, Users, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import ProductCard from "@/components/ProductCard";
import ComparisonTable from "@/components/ComparisonTable";
import Timeline from "@/components/Timeline";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import SEOHelmet from "@/components/SEOHelmet";

// Lazy load heavy components to optimize bundle size
const VoiceDemo = lazy(() => import("@/components/VoiceDemo"));
const ChatbotWidget = lazy(() => import("@/components/ChatbotWidget"));
// Using public images for better build performance
const voicebotImage = "/images/voicebot.png";
const avatarVideo = "/images/avatar.mp4";
const chatbotImage = "/images/chatbot.webp";

const products = [
  {
    id: "chatbot",
    title: "Antwort ohne Suchen - Chatbot",
    description: "Kund:innen bekommen sofort die richtige Antwort – rund um die Uhr. Reduziert Ihre E-Mails und nimmt Ihnen Standardanfragen einfach ab.",
    features: ["Entlastet Telefon & Service-Team deutlich", "Sofortantworten 24/7", "Schafft Ihnen Zeit für Ihre eigentlichen Aufgaben", "Terminbuchung"],
    image: chatbotImage,
    gradient: "bg-gradient-to-r from-[#B8436A] to-[#E8719A]",
    buttonText: "hier ausprobieren"
  },
  {
    id: "voicebot",
    title: "Sprechen statt Tippen - Voicebot",
    description: "Einfach Sprechen und sofort empathische Antworten erhalten. Nimmt mehrere Anrufe und Anfragen gleichzeitig entgegen und vereinbart auf Wunsch Termine, sammelt Kundenfeedback u.v.m.",
    features: ["Sprechen wie mit einem Menschen", "Einbindung in Website und über Telefon möglich", "Kein: Drücken Sie die eins... mehr", "Schnelle, intelligente, freundliche Antworten auf Fragen Ihrer Kunden", "Jederzeit erreichbar"],
    image: voicebotImage,
    gradient: "bg-gradient-to-r from-[#E8719A] to-[#F5A1C1]",
    buttonText: "Sprechen Sie mit Juna"
  },
  {
    id: "avatar",
    title: "Service mit Gesicht - Avatar",
    description: "Persönlicher als ein Chatbot: Kund:innen haben das Gefühl, mit einem Menschen zu sprechen. Sorgt für Vertrauen.",
    features: ["Menschliche Präsenz", "Vertrauensaufbau", "Starker Eindruck", "Schnelle, intelligente, freundliche Antworten auf Fragen Ihrer Kunden", "Jederzeit erreichbar"],
    image: avatarVideo,
    gradient: "bg-gradient-to-r from-[#F5A1C1] to-[#B8436A]",
    buttonText: "Avatar erleben",
    mediaType: "video" as const
  },
  {
    id: "wissensbot",
    title: "Wissen, das bleibt - Wissensbot",
    description: "Hält internes Wissen verfügbar – auch bei Urlaub oder Teamwechsel. Erleichtert Onboarding und macht Prozesse stabil.",
    features: ["Internes Wissen", "Team-Stabilität", "Prozess-Kontinuität", "Onboarding leicht gemacht"],
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    gradient: "bg-gradient-to-r from-[#B8436A] to-[#F5A1C1]",
    buttonText: "Gespräch vereinbaren"
  }
];

export default function Home() {
  const [, setLocation] = useLocation();

  // Automatisch zum Seitenbeginn scrollen beim Laden der Startseite
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleProductButtonClick = (productId: string) => {
    if (productId === 'chatbot') {
      // Use custom event to trigger chatbot opening
      window.dispatchEvent(new CustomEvent('open-chat'));
    } else if (productId === 'voicebot') {
      // Use custom event to trigger voicebot opening  
      window.dispatchEvent(new CustomEvent('open-voice'));
    } else {
      // For other products, navigate to contact page
      setLocation('/kontakt');
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
                <h1 className="text-4xl md:text-6xl font-bold mb-6 fade-in text-left" data-testid="hero-title">
                  <span className="text-white">
                    KI mit Herz & Hirn
                  </span>
                  <br />
                </h1>
                <p className="text-xl text-white/90 mb-8 fade-in" data-testid="hero-subtitle">
                  Ihr Service wird schneller, persönlicher und verlässlicher. Kein technisches Wissen nötig – wir übernehmen Einrichtung und Support.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                </div>
              </div>
            </div>

            {/* Four Products Above-the-Fold */}
            <section id="produkte" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 mb-8" data-testid="products-section">
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
                <h2 className="text-3xl font-bold text-left mb-12 text-white">So arbeiten wir</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="relative group">
                    <div className="glass p-6 rounded-lg hover-lift transition-all duration-300 h-full flex flex-col shadow-lg">
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#B8436A] to-[#C54C75] text-white font-bold text-xl mx-auto mb-4 shadow-xl transform transition-transform duration-300 hover:scale-110">
                        1
                      </div>
                      <h3 className="font-bold text-white mb-3 text-center text-lg">Gespräch</h3>
                      <p className="text-white/70 mb-2 text-center text-sm">(30 Min.)</p>
                      <p className="text-white/90 text-center text-sm flex-grow">Ziele & Use-Cases klären</p>
                    </div>
                    {/* Connection line */}
                    <div className="hidden lg:block absolute top-8 -right-3 w-6 h-0.5 bg-gradient-to-r from-gray-400/50 to-transparent"></div>
                  </div>
                  
                  <div className="relative group">
                    <div className="glass p-6 rounded-lg hover-lift transition-all duration-300 h-full flex flex-col shadow-lg">
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#B8436A] to-[#C54C75] text-white font-bold text-xl mx-auto mb-4 shadow-xl transform transition-transform duration-300 hover:scale-110">
                        2
                      </div>
                      <h3 className="font-bold text-white mb-3 text-center text-lg">Pilot</h3>
                      <p className="text-white/70 mb-2 text-center text-sm">(2 Wochen)</p>
                      <p className="text-white/90 text-center text-sm flex-grow">Prototyp mit echtem Inhalt</p>
                    </div>
                    {/* Connection line */}
                    <div className="hidden lg:block absolute top-8 -right-3 w-6 h-0.5 bg-gradient-to-r from-gray-400/50 to-transparent"></div>
                  </div>
                  
                  <div className="relative group">
                    <div className="glass p-6 rounded-lg hover-lift transition-all duration-300 h-full flex flex-col shadow-lg">
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#B8436A] to-[#C54C75] text-white font-bold text-xl mx-auto mb-4 shadow-xl transform transition-transform duration-300 hover:scale-110">
                        3
                      </div>
                      <h3 className="font-bold text-white mb-3 text-center text-lg">Rollout</h3>
                      <p className="text-white/70 mb-2 text-center text-sm">(1 Woche)</p>
                      <p className="text-white/90 text-center text-sm flex-grow">Schulung, Feinschliff, Go-Live</p>
                    </div>
                    {/* Connection line */}
                    <div className="hidden lg:block absolute top-8 -right-3 w-6 h-0.5 bg-gradient-to-r from-gray-400/50 to-transparent"></div>
                  </div>
                  
                  <div className="relative group">
                    <div className="glass p-6 rounded-lg hover-lift transition-all duration-300 h-full flex flex-col shadow-lg">
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#B8436A] to-[#C54C75] text-white font-bold text-xl mx-auto mb-4 shadow-xl transform transition-transform duration-300 hover:scale-110">
                        4
                      </div>
                      <h3 className="font-bold text-white mb-3 text-center text-lg">Support</h3>
                      <p className="text-white/70 mb-2 text-center text-sm">(Laufend)</p>
                      <p className="text-white/90 text-center text-sm flex-grow">Monitoring & laufende Optimierung</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>

        <Suspense fallback={<div className="h-32 bg-muted animate-pulse rounded-lg"></div>}>
          <VoiceDemo />
        </Suspense>

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
                <Link href="/kontakt">
                  <Button 
                    size="lg" 
                    className="button-gradient px-12 py-6 text-xl"
                    data-testid="central-cta-button"
                  >
                    Gespräch vereinbaren
                  </Button>
                </Link>
                <p className="text-sm text-muted-foreground mt-4">
                  15 Minuten unverbindliches Gespräch • Keine Technik-Kenntnisse nötig
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

      </main>

      {/* Bot Widgets werden jetzt in App.tsx gerendert für bessere Verfügbarkeit */}
      
      <Footer />
    </div>
  );
}
