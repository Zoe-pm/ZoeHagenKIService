import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { Shield, Settings, Headphones, CheckCircle, Users, Zap, Volume2, VolumeX, Play, Pause } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import ProductCard from "@/components/ProductCard";
import ComparisonTable from "@/components/ComparisonTable";
import Timeline from "@/components/Timeline";
import ContactForm from "@/components/ContactForm";
import SEOHelmet from "@/components/SEOHelmet";

// Lazy load heavy components to optimize bundle size
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
    gradient: "bg-gradient-to-r from-[#e63973] to-[#E8719A]",
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
    gradient: "bg-gradient-to-r from-[#F5A1C1] to-[#e63973]",
    buttonText: "Avatar erleben",
    mediaType: "video" as const
  },
  {
    id: "wissensbot",
    title: "Wissen, das bleibt - Wissensbot",
    description: "Hält internes Wissen verfügbar – auch bei Urlaub oder Teamwechsel. Erleichtert Onboarding und macht Prozesse stabil.",
    features: ["Internes Wissen", "Team-Stabilität", "Prozess-Kontinuität", "Onboarding leicht gemacht"],
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    gradient: "bg-gradient-to-r from-[#e63973] to-[#F5A1C1]",
    buttonText: "Gespräch vereinbaren"
  }
];

export default function Home() {
  const [, setLocation] = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Video state management für UX-Spezifikation
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [delayComplete, setDelayComplete] = useState(false);
  const [playedOnce, setPlayedOnce] = useState(false);
  const [startedWithSound, setStartedWithSound] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  // Automatisch zum Seitenbeginn scrollen beim Laden der Startseite
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // 2-Sekunden Verzögerung vor Video-Start (UX-Spezifikation)
  useEffect(() => {
    const timer = setTimeout(async () => {
      setDelayComplete(true);
      
      if (videoRef.current && !playedOnce) {
        // Primärpfad: Autoplay mit Ton versuchen
        try {
          videoRef.current.muted = false;
          await videoRef.current.play();
          // Autoplay mit Ton erfolgreich
          setIsPlaying(true);
          setIsMuted(false);
          setStartedWithSound(true);
          setPlayedOnce(true);
        } catch (error) {
          // Fallback: Stumm starten
          try {
            videoRef.current.muted = true;
            await videoRef.current.play();
            setIsPlaying(true);
            setIsMuted(true);
            setStartedWithSound(false);
            setPlayedOnce(true);
            setAutoplayBlocked(false);
          } catch (fallbackError) {
            // Autoplay komplett blockiert
            setAutoplayBlocked(true);
          }
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [playedOnce]);

  // Debug logging für Video-Zustand
  useEffect(() => {
    console.log('Video state:', { 
      isPlaying, 
      isMuted, 
      delayComplete, 
      playedOnce, 
      startedWithSound,
      autoplayBlocked 
    });
  }, [isPlaying, isMuted, delayComplete, playedOnce, startedWithSound, autoplayBlocked]);

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

  // Play/Pause Handler (UX-Spezifikation: unten rechts)
  const handlePlayPause = async () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      // Pausieren
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      // Erste Interaktion nach stummem Fallback oder blockiertem Autoplay?
      const isFirstInteraction = autoplayBlocked || (!startedWithSound && playedOnce);
      
      if (isFirstInteraction) {
        // Zurück auf 0:00 und mit Ton starten (UX-Spezifikation)
        videoRef.current.currentTime = 0;
        videoRef.current.muted = false;
        setIsMuted(false);
        
        try {
          await videoRef.current.play();
          setIsPlaying(true);
          setStartedWithSound(true);
          setPlayedOnce(true);
          setAutoplayBlocked(false);
        } catch (error) {
          console.error('First interaction play failed:', error);
        }
      } else {
        // Normales Abspielen
        try {
          await videoRef.current.play();
          setIsPlaying(true);
          setPlayedOnce(true);
        } catch (error) {
          console.error('Play failed:', error);
        }
      }
    }
  };

  // Ton-Handler (UX-Spezifikation: bei nachträglichem Einschalten auf 0:00 springen)
  const handleMuteToggle = async () => {
    if (!videoRef.current) return;
    
    if (isMuted) {
      // Erste Interaktion nach blockiertem Autoplay oder stummem Fallback?
      const isFirstInteraction = autoplayBlocked || (!startedWithSound && !playedOnce) || (!startedWithSound && playedOnce);
      
      if (isFirstInteraction) {
        // Erste Interaktion: auf 0:00 springen und mit Ton starten (UX-Spezifikation)
        videoRef.current.currentTime = 0;
        videoRef.current.muted = false;
        setIsMuted(false);
        
        try {
          await videoRef.current.play();
          setIsPlaying(true);
          setStartedWithSound(true);
          setPlayedOnce(true);
          setAutoplayBlocked(false);
        } catch (error) {
          console.error('First interaction with sound failed:', error);
        }
      } else {
        // Normal unmuten (Video lief bereits mit Ton)
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    } else {
      // Ton ausschalten
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const handleVideoLoadedMetadata = () => {
    console.log('Video metadata loaded');
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  const handleVideoCanPlay = () => {
    console.log('Video can play');
    // Video ist bereit - Controls können angezeigt werden wenn nötig
    setShowControls(!autoplayBlocked && delayComplete);
  };

  // Ende-Verhalten (UX-Spezifikation: zurück auf Startframe)
  const handleVideoEnded = () => {
    if (videoRef.current) {
      // Sofort zurück auf Frame 0 und pausieren
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
      setIsPlaying(false);
      // Ton bleibt eingeschaltet für nächstes Abspielen
      setShowControls(true);
    }
  };

  const handleVideoWaiting = () => {
    // Retry on stall
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(console.error);
      }
    }, 1000);
  };

  const handleVideoError = (error: any) => {
    console.log('Video error occurred:', error);
    // Handle video error gracefully - could show fallback image or retry
    if (videoRef.current) {
      // Reset video to try again
      videoRef.current.load();
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

            {/* Video Section - Between Hero and Products */}
            <section className="py-16 px-4 sm:px-6 lg:px-8" data-testid="video-section">
              <div className="max-w-4xl mx-auto text-center relative">
                <video
                  ref={videoRef}
                  className="w-full h-auto aspect-video cursor-pointer"
                  muted
                  playsInline
                  preload="metadata"
                  poster="/images/zoe-image.jpg"
                  onClick={handlePlayPause}
                  onLoadedMetadata={handleVideoLoadedMetadata}
                  onCanPlay={handleVideoCanPlay}
                  onEnded={handleVideoEnded}
                  onWaiting={handleVideoWaiting}
                  onStalled={handleVideoWaiting}
                  onError={handleVideoError}
                  data-testid="hero-video"
                >
                  <source src="/videos/new-video.mp4" type="video/mp4; codecs=&quot;avc1.42E01E, mp4a.40.2&quot;" />
                  <source src="/images/avatar.mp4" type="video/mp4" />
                  <span className="sr-only">Video wird geladen...</span>
                </video>
                
                {/* Dezente Controls unten rechts (UX-Spezifikation) */}
                {(showControls || autoplayBlocked || (!isPlaying && delayComplete)) && (
                  <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                    {/* Ton-Button (klein, über Play/Pause) */}
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={handleMuteToggle}
                      className="bg-black/50 hover:bg-black/70 text-white border-0 backdrop-blur-sm w-8 h-8"
                      aria-label={isMuted ? "Ton einschalten" : "Ton ausschalten"}
                      data-testid="button-mute-toggle"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                    
                    {/* Play/Pause-Button (Hauptsteuerung) */}
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={handlePlayPause}
                      className="bg-black/50 hover:bg-black/70 text-white border-0 backdrop-blur-sm w-10 h-10"
                      aria-label={isPlaying ? "Video pausieren" : "Video abspielen"}
                      data-testid="button-play-pause"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </Button>
                  </div>
                )}
                
                {/* Delay Countdown */}
                {!delayComplete && (
                  <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-md text-sm backdrop-blur-sm">
                    Video startet in 2s...
                  </div>
                )}
              </div>
            </section>

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
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#e63973] to-[#C54C75] text-white font-bold text-xl mx-auto mb-4 shadow-xl transform transition-transform duration-300 hover:scale-110">
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
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#e63973] to-[#C54C75] text-white font-bold text-xl mx-auto mb-4 shadow-xl transform transition-transform duration-300 hover:scale-110">
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
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#e63973] to-[#C54C75] text-white font-bold text-xl mx-auto mb-4 shadow-xl transform transition-transform duration-300 hover:scale-110">
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
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#e63973] to-[#C54C75] text-white font-bold text-xl mx-auto mb-4 shadow-xl transform transition-transform duration-300 hover:scale-110">
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


        {/* Central Call-to-Action */}
        <section className="py-12 px-4 sm:px-6 lg:px-8" data-testid="central-cta-section">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="glass border-primary/20">
              <CardContent className="p-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  Lassen Sie uns gemeinsam herausfinden, welche Lösung zu Ihnen passt.
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Wir übernehmen die Einrichtung – Sie profitieren vom Ergebnis.
                </p>
                <Link href="/kontakt">
                  <Button 
                    size="lg" 
                    className="button-gradient px-8 py-4 text-lg"
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
      
    </div>
  );
}
