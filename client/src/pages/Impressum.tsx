import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AccessibilityBanner from "@/components/AccessibilityBanner";
import SEOHelmet from "@/components/SEOHelmet";

export default function Impressum() {
  return (
    <div className="min-h-screen" data-testid="impressum-page">
      <SEOHelmet 
        title="Impressum - KI-Assistenten GmbH"
        description="Impressum und Kontaktdaten der KI-Assistenten GmbH. Alle rechtlichen Informationen zu unserem Unternehmen."
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
                Impressum
              </h1>
              
              <div className="space-y-8 text-muted-foreground">
                <section data-testid="company-info">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    Angaben gemäß § 5 TMG
                  </h2>
                  <div className="space-y-2">
                    <p><strong>KI-Assistenten GmbH</strong></p>
                    <p>Musterstraße 123</p>
                    <p>12345 Berlin</p>
                    <p>Deutschland</p>
                  </div>
                </section>

                <section data-testid="contact-info">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    Kontakt
                  </h2>
                  <div className="space-y-2">
                    <p><strong>Telefon:</strong> +49 (0) 123 456 789</p>
                    <p><strong>E-Mail:</strong> kontakt@ki-assistenten.de</p>
                    <p><strong>Website:</strong> www.ki-assistenten.de</p>
                  </div>
                </section>

                <section data-testid="business-info">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    Registereintrag
                  </h2>
                  <div className="space-y-2">
                    <p><strong>Registergericht:</strong> Amtsgericht Berlin-Charlottenburg</p>
                    <p><strong>Registernummer:</strong> HRB 123456 B</p>
                  </div>
                </section>

                <section data-testid="management-info">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    Vertretungsberechtigter Geschäftsführer
                  </h2>
                  <p>Dr. Max Mustermann</p>
                </section>

                <section data-testid="vat-info">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    Umsatzsteuer-ID
                  </h2>
                  <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz: DE123456789</p>
                </section>

                <section data-testid="professional-info">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    Berufsbezeichnung und berufsrechtliche Regelungen
                  </h2>
                  <div className="space-y-2">
                    <p><strong>Berufsbezeichnung:</strong> IT-Dienstleister</p>
                    <p><strong>Zuständige Kammer:</strong> IHK Berlin</p>
                    <p><strong>Verliehen durch:</strong> Deutschland</p>
                  </div>
                </section>

                <section data-testid="editorial-info">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    Redaktionell verantwortlich
                  </h2>
                  <div className="space-y-2">
                    <p>Dr. Max Mustermann</p>
                    <p>KI-Assistenten GmbH</p>
                    <p>Musterstraße 123</p>
                    <p>12345 Berlin</p>
                  </div>
                </section>

                <section data-testid="dispute-resolution">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    EU-Streitschlichtung
                  </h2>
                  <p>
                    Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
                    <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline ml-1">
                      https://ec.europa.eu/consumers/odr/
                    </a>
                  </p>
                  <p className="mt-2">
                    Unsere E-Mail-Adresse finden Sie oben im Impressum.
                  </p>
                </section>

                <section data-testid="consumer-dispute">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    Verbraucherstreitbeilegung/Universalschlichtungsstelle
                  </h2>
                  <p>
                    Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
                    Verbraucherschlichtungsstelle teilzunehmen.
                  </p>
                </section>

                <section data-testid="liability-content">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    Haftung für Inhalte
                  </h2>
                  <p>
                    Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den 
                    allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht 
                    unter der Verpflichtung, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach 
                    Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                  </p>
                  <p className="mt-4">
                    Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen 
                    Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt 
                    der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden 
                    Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
                  </p>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
