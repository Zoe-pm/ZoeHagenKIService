import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import AccessibilityBanner from "@/components/AccessibilityBanner";
import SEOHelmet from "@/components/SEOHelmet";

export default function Bildnachweise() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen" data-testid="bildnachweise-page">
      <SEOHelmet 
        title="Bildnachweise - Zoë Hagen KI Consulting"
        description="Bildnachweise und Quellenangaben für alle verwendeten Bilder auf der Website von Zoë Hagen KI Consulting."
      />
      
      <AccessibilityBanner />
      <Navigation />

      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8" aria-label="Breadcrumb" data-testid="breadcrumb">
            <Link href="/" className="text-muted-foreground hover:text-accent inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zur Startseite
            </Link>
          </nav>

          <Card className="glass">
            <CardContent className="p-8">
              <h1 className="text-4xl font-bold mb-8 gradient-text" data-testid="bildnachweise-title">
                Bildnachweise
              </h1>
              
              <div className="space-y-8 text-muted-foreground">
                <section data-testid="eigene-bilder">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    Eigene Bilder
                  </h2>
                  <p className="mb-4">
                    Die folgenden Bilder sind Eigentum von Zoë Hagen KI Consulting und wurden speziell für diese Website erstellt:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li className="flex items-start">
                      <span className="text-accent mr-2">•</span>
                      <span>Porträtfotos von Zoë Hagen (Über uns, Kontakt)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-2">•</span>
                      <span>Logo und Firmenbranding</span>
                    </li>
                  </ul>
                </section>

                <section data-testid="midjourney-bilder">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    KI-generierte Bilder (Midjourney)
                  </h2>
                  <p className="mb-4">
                    Die folgenden Bilder wurden mit Hilfe von Midjourney AI erstellt und sind lizenziert für kommerzielle Nutzung:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li className="flex items-start">
                      <span className="text-accent mr-2">•</span>
                      <span>Chatbot-Produktbild: Zwei Personen am Laptop (Teamarbeit)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-2">•</span>
                      <span>Voicebot-Produktbild: Lächelnde Frau mit Headset</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-2">•</span>
                      <span>Avatar-Produktbild: Freundliche Kundenberaterin mit Headset</span>
                    </li>
                  </ul>
                  <p className="mt-4 text-sm">
                    <strong>Midjourney License:</strong> Alle mit Midjourney erstellten Bilder werden gemäß der 
                    <a href="https://docs.midjourney.com/docs/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline ml-1">
                      Midjourney Terms of Service
                    </a> verwendet.
                  </p>
                </section>

                <section data-testid="unsplash-bilder">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    Stock-Fotos (Unsplash)
                  </h2>
                  <p className="mb-4">
                    Einige Bilder stammen von Unsplash und sind unter der Unsplash License frei verwendbar:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li className="flex items-start">
                      <span className="text-accent mr-2">•</span>
                      <span>Wissensbot-Produktbild: Bücher und Wissen (Unsplash)</span>
                    </li>
                  </ul>
                  <p className="mt-4 text-sm">
                    <strong>Unsplash License:</strong> Alle Bilder von Unsplash sind unter der 
                    <a href="https://unsplash.com/license" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline ml-1">
                      Unsplash License
                    </a> lizenziert und können kostenlos für kommerzielle und private Zwecke verwendet werden.
                  </p>
                </section>

                <section data-testid="copyright-hinweis">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    Rechtlicher Hinweis
                  </h2>
                  <p>
                    Alle auf dieser Website verwendeten Bilder werden in Übereinstimmung mit den jeweiligen Lizenzbedingungen verwendet. 
                    Bei Fragen zu Bildrechten oder Lizenzierung wenden Sie sich bitte an: 
                    <a href="mailto:zoehagenkiconsulting@pm.me" className="text-accent hover:underline ml-1">
                      zoehagenkiconsulting@pm.me
                    </a>
                  </p>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

    </div>
  );
}