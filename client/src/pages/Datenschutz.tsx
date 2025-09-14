import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import AccessibilityBanner from "@/components/AccessibilityBanner";
import SEOHelmet from "@/components/SEOHelmet";

export default function Datenschutz() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen" data-testid="datenschutz-page">
      <SEOHelmet 
        title="Datenschutzerklärung - Zoë Hagen KI Consulting"
        description="Datenschutzerklärung von Zoë Hagen KI Consulting. Erfahren Sie, wie wir Ihre personenbezogenen Daten verarbeiten und schützen."
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
              <h1 className="text-4xl font-bold mb-8 gradient-text" data-testid="datenschutz-title">
                Datenschutzerklärung
              </h1>
              
              <div className="space-y-8 text-muted-foreground">
                <section data-testid="general-info">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    1. Datenschutz auf einen Blick
                  </h2>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Allgemeine Hinweise
                  </h3>
                  <p>
                    Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten 
                    passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie 
                    persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen 
                    Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.
                  </p>
                </section>

                <section data-testid="data-collection">
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Datenerfassung auf dieser Website
                  </h3>
                  <h4 className="text-lg font-semibold text-foreground mb-2">
                    Wer ist verantwortlich für die Datenerfassung auf dieser Website?
                  </h4>
                  <p className="mb-4">
                    Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten 
                    können Sie dem Abschnitt „Hinweis zur Verantwortlichen Stelle" in dieser Datenschutzerklärung entnehmen.
                  </p>
                  
                  <h4 className="text-lg font-semibold text-foreground mb-2">
                    Wie erfassen wir Ihre Daten?
                  </h4>
                  <p className="mb-4">
                    Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z. B. um 
                    Daten handeln, die Sie in ein Kontaktformular eingeben. Andere Daten werden automatisch oder nach Ihrer 
                    Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten 
                    (z. B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs).
                  </p>
                </section>

                <section data-testid="responsible-party">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    2. Hinweis zur verantwortlichen Stelle
                  </h2>
                  <p className="mb-4">
                    Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:
                  </p>
                  <div className="space-y-2 mb-4">
                    <p><strong>Zoë Hagen KI Consulting</strong></p>
                    <p>Zoë Hagen</p>
                    <p>Jägerweg 28</p>
                    <p>13503 Berlin</p>
                    <p>Deutschland</p>
                    <p><strong>Telefon:</strong> 01719862773</p>
                    <p><strong>E-Mail:</strong> zoe-kiconsulting@pm.me</p>
                  </div>
                  <p>
                    Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder gemeinsam mit anderen 
                    über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten (z. B. Namen, E-Mail-Adressen o. Ä.) entscheidet.
                  </p>
                </section>

                <section data-testid="data-protection-officer">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    3. Datenschutzbeauftragter
                  </h2>
                  <p className="mb-4">
                    Als kleines Unternehmen haben wir keinen gesonderten Datenschutzbeauftragten bestellt. 
                    Für Datenschutzanfragen wenden Sie sich direkt an uns über die oben genannten Kontaktdaten.
                  </p>
                </section>

                <section data-testid="data-collection-details">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    4. Datenerfassung auf dieser Website
                  </h2>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Server-Log-Dateien
                  </h3>
                  <p className="mb-4">
                    Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, 
                    die Ihr Browser automatisch an uns übermittelt. Dies sind:
                  </p>
                  <ul className="list-disc list-inside mb-4 space-y-1">
                    <li>Browsertyp und Browserversion</li>
                    <li>verwendetes Betriebssystem</li>
                    <li>Referrer URL</li>
                    <li>Hostname des zugreifenden Rechners</li>
                    <li>Uhrzeit der Serveranfrage</li>
                    <li>IP-Adresse</li>
                  </ul>
                  <p className="mb-4">
                    Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Die Erfassung dieser 
                    Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.
                  </p>

                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Kontaktformular
                  </h3>
                  <p className="mb-4">
                    Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular 
                    inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von 
                    Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
                  </p>
                  <p className="mb-4">
                    Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage 
                    mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher Maßnahmen erforderlich ist.
                  </p>
                </section>

                <section data-testid="ai-services">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    5. KI-Assistenten und Datenverarbeitung
                  </h2>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Voice-Demo und Chatbot-Interaktionen
                  </h3>
                  <p className="mb-4">
                    Bei der Nutzung unserer Voice-Demo und Chatbot-Funktionen werden Ihre Eingaben und Sprachaufnahmen 
                    verarbeitet, um Ihnen eine Demonstration unserer KI-Services zu ermöglichen. Diese Verarbeitungen erfolgen 
                    ausschließlich zu Demonstrationszwecken und werden nicht dauerhaft gespeichert.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Produktive KI-Services
                  </h3>
                  <p className="mb-4">
                    Für unsere produktiven KI-Assistenten gelten gesonderte Datenschutzvereinbarungen, die Teil Ihres 
                    Servicevertrags sind. Alle Verarbeitungen erfolgen DSGVO-konform auf EU-Servern oder in Ihren eigenen 
                    Systemen (On-Premise).
                  </p>
                </section>

                <section data-testid="rights">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    6. Ihre Rechte
                  </h2>
                  <p className="mb-4">
                    Sie haben gegenüber uns folgende Rechte hinsichtlich der Sie betreffenden personenbezogenen Daten:
                  </p>
                  <ul className="list-disc list-inside mb-4 space-y-1">
                    <li>Recht auf Auskunft</li>
                    <li>Recht auf Berichtigung oder Löschung</li>
                    <li>Recht auf Einschränkung der Verarbeitung</li>
                    <li>Recht auf Widerspruch gegen die Verarbeitung</li>
                    <li>Recht auf Datenübertragbarkeit</li>
                  </ul>
                  <p className="mb-4">
                    Sie haben zudem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer 
                    personenbezogenen Daten durch uns zu beschweren.
                  </p>
                </section>

                <section data-testid="cookies">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    7. Cookies
                  </h2>
                  <p className="mb-4">
                    Unsere Internetseiten verwenden so genannte „Cookies". Cookies sind kleine Textdateien und richten auf 
                    Ihrem Endgerät keinen Schaden an. Sie werden entweder vorübergehend für die Dauer einer Sitzung 
                    (Session-Cookies) oder dauerhaft (permanente Cookies) auf Ihrem Endgerät gespeichert.
                  </p>
                  <p className="mb-4">
                    Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert werden und 
                    Cookies nur im Einzelfall erlauben, die Annahme von Cookies für bestimmte Fälle oder generell ausschließen 
                    sowie das automatische Löschen der Cookies beim Schließen des Browsers aktivieren.
                  </p>
                </section>

                <section data-testid="external-services">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    8. Externe Dienste
                  </h2>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Google Fonts
                  </h3>
                  <p className="mb-4">
                    Diese Seite nutzt zur einheitlichen Darstellung von Schriftarten so genannte Web Fonts, die von Google 
                    bereitgestellt werden. Beim Aufruf einer Seite lädt Ihr Browser die benötigten Web Fonts in ihren 
                    Browsercache, um Texte und Schriftarten korrekt anzuzeigen.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Font Awesome
                  </h3>
                  <p className="mb-4">
                    Diese Website nutzt zur einheitlichen Darstellung von Icons Font Awesome. Font Awesome ist ein Dienst 
                    der Fonticons Inc. Beim Aufruf einer Seite lädt Ihr Browser die benötigten Icons.
                  </p>
                </section>

                <section data-testid="data-security">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    9. Datensicherheit
                  </h2>
                  <p className="mb-4">
                    Wir verwenden innerhalb des Website-Besuchs das verbreitete SSL-Verfahren (Secure Socket Layer) in 
                    Verbindung mit der jeweils höchsten Verschlüsselungsstufe, die von Ihrem Browser unterstützt wird. 
                    In der Regel handelt es sich dabei um eine 256 Bit SSL-Verschlüsselung.
                  </p>
                  <p className="mb-4">
                    Wir weisen darauf hin, dass die Datenübertragung im Internet (z. B. bei der Kommunikation per E-Mail) 
                    Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich.
                  </p>
                </section>

                <section data-testid="changes">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    10. Änderungen der Datenschutzerklärung
                  </h2>
                  <p className="mb-4">
                    Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen rechtlichen 
                    Anforderungen entspricht oder um Änderungen unserer Leistungen in der Datenschutzerklärung umzusetzen, 
                    z. B. bei der Einführung neuer Services.
                  </p>
                  <p>
                    <strong>Stand der Datenschutzerklärung:</strong> Dezember 2024
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
