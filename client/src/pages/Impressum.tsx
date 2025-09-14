import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import AccessibilityBanner from "@/components/AccessibilityBanner";
import SEOHelmet from "@/components/SEOHelmet";
import { useSecureEmail } from '@/lib/emailUtils';

export default function Impressum() {
  const { handleEmailClick, displayEmail } = useSecureEmail('zoehagenkiconsulting@pm.me');
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen" data-testid="impressum-page">
      <SEOHelmet 
        title="Impressum - Zoë Hagen KI Consulting"
        description="Impressum und Kontaktdaten von Zoë Hagen KI Consulting. Alle rechtlichen Informationen zu unserem Unternehmen."
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
              <h1 className="text-4xl font-bold mb-8 gradient-text" data-testid="impressum-title">
                Impressum (Anbieterkennzeichnung nach § 5 DDG)
              </h1>
              
              <div className="space-y-8 text-muted-foreground">
                <section data-testid="company-info">
                  <div className="space-y-4">
                    <p className="text-foreground">
                      <strong>Zoë Hagen – Einzelunternehmerin (Kleinunternehmerin nach § 19 UStG)</strong><br />
                      Zoë's KI Studio / Zoë Hagen KI Consulting<br />
                      Jägerweg 28, 13503 Berlin<br />
                      E-Mail: <button onClick={() => handleEmailClick('Impressum Kontakt')} className="text-accent hover:underline">{displayEmail}</button>
                    </p>
                    
                    <p className="text-foreground">
                      <strong>Telefon:</strong> <a href="tel:+4916098627730" className="text-accent hover:underline">+49 (0) 160 98627730</a>
                    </p>
                    
                    <p className="text-foreground">
                      <strong>Verantwortlich für den Inhalt dieser Webseite:</strong><br />
                      Zoë Hagen, Jägerweg 28, 13503 Berlin.
                    </p>
                  </div>
                </section>

                <section data-testid="vsbg-info">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    Hinweis nach § 36 VSBG (Verbraucherstreitbeilegung):
                  </h2>
                  <p>
                    Ich bin weder verpflichtet noch bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle 
                    teilzunehmen.
                  </p>
                </section>

                <section data-testid="liability-info">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    Haftung für Inhalte & Links:
                  </h2>
                  <p>
                    Eigene Inhalte unterliegen den gesetzlichen Vorschriften. Für externe Links wird keine Haftung übernommen; 
                    zum Zeitpunkt der Verlinkung waren keine Rechtsverstöße erkennbar.
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