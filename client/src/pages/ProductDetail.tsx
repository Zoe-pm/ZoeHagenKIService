import { useParams, Link } from "wouter";
import { ArrowLeft, CheckCircle, Clock, Users, Target, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AccessibilityBanner from "@/components/AccessibilityBanner";
import SEOHelmet from "@/components/SEOHelmet";
import voicebotImage from "@assets/u8673192784_blonde_lchelnde_Frau_di_ein_die_Kamera_spricht_un_7db33a1d-9271-459b-b39e-442590c15639_1_1757680774037.png";

const productData: { [key: string]: any } = {
  chatbot: {
    name: "Chatbot",
    description: "24/7 automatisierter Kundensupport für Ihre Website",
    price: "ab 299€/Monat",
    implementationTime: "2 Wochen",
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
    keyFacts: [
      "Zweck: Automatisierte Kundenbetreuung rund um die Uhr",
      "Zielgruppe: Website-Besucher und Interessenten",
      "Kanal: Website-Integration via Widget",
      "Integrationen: CRM, E-Mail-Marketing, Support-Tickets",
      "Implementierung: 2 Wochen durchschnittlich",
      "Datenschutz: EU-Server, DSGVO-konform",
      "Messgrößen: Antwortzeit, Lösungsquote, Kundenzufriedenheit"
    ],
    useCases: [
      "FAQ-Beantwortung",
      "Terminbuchung",
      "Produktberatung",
      "Lead-Qualifizierung",
      "Support-Ticket-Weiterleitung"
    ],
    targetAudience: "Online-Shops, Dienstleister, B2B-Unternehmen",
    notSuitableFor: "Komplexe Beratungsprodukte ohne standardisierte Prozesse",
    metrics: [
      "Reduzierung der Antwortzeit um 90%",
      "Steigerung der Kundenzufriedenheit um 35%",
      "Automatisierung von 70% aller Standardanfragen"
    ],
    faqs: [
      {
        question: "Wie lange dauert die Integration?",
        answer: "Die Integration dauert typischerweise 1-2 Wochen, abhängig von der Komplexität Ihrer Anforderungen und bestehenden Systeme."
      },
      {
        question: "Welche Sprachen werden unterstützt?",
        answer: "Standardmäßig Deutsch und Englisch. Weitere Sprachen können auf Anfrage integriert werden."
      },
      {
        question: "Kann der Chatbot mit unserem CRM verbunden werden?",
        answer: "Ja, wir bieten Integrationen für die meisten gängigen CRM-Systeme wie Salesforce, HubSpot, Pipedrive und viele mehr."
      },
      {
        question: "Was passiert bei komplexen Anfragen?",
        answer: "Der Chatbot erkennt komplexe Anfragen und leitet diese automatisch an Ihre Mitarbeiter weiter, inklusive aller bisherigen Gesprächsverläufe."
      }
    ]
  },
  voicebot: {
    name: "Voicebot",
    description: "Intelligente Telefon-Assistenz für professionellen Kundenservice",
    price: "ab 599€/Monat",
    implementationTime: "3 Wochen",
    image: voicebotImage,
    keyFacts: [
      "Zweck: Automatisierte Telefon-Kundenbetreuung",
      "Zielgruppe: Anrufer und Bestandskunden",
      "Kanal: Telefonanlage und VoIP-Systeme",
      "Integrationen: PBX-Anlagen, CRM, Kalendersysteme",
      "Implementierung: 3 Wochen durchschnittlich",
      "Datenschutz: Verschlüsselte Übertragung, DSGVO-konform",
      "Messgrößen: First-Call-Resolution, Wartezeit, Weiterleitung-Rate"
    ],
    useCases: [
      "Anrufannahme und -weiterleitung",
      "Terminvereinbarung",
      "Statusabfragen",
      "Einfache Bestellprozesse",
      "After-Hours-Service"
    ],
    targetAudience: "Serviceunternehmen, Arztpraxen, Handwerksbetriebe",
    notSuitableFor: "Branchen mit sehr emotionalen oder sensiblen Gesprächsinhalten",
    metrics: [
      "Reduzierung der Wartezeit um 80%",
      "Erhöhung der Erreichbarkeit auf 24/7",
      "Automatisierung von 60% aller Anrufe"
    ],
    faqs: [
      {
        question: "Funktioniert der Voicebot mit unserer bestehenden Telefonanlage?",
        answer: "Ja, wir unterstützen die meisten modernen PBX-Anlagen und VoIP-Systeme. Eine Kompatibilitätsprüfung erfolgt im Beratungsgespräch."
      },
      {
        question: "Wie natürlich klingt die Stimme?",
        answer: "Wir verwenden hochmoderne TTS-Technologie mit natürlich klingenden deutschen Stimmen. Auf Wunsch können auch individuelle Stimmen trainiert werden."
      },
      {
        question: "Was passiert bei Verständnisproblemen?",
        answer: "Der Voicebot erkennt Verständnisprobleme und kann nachfragen oder das Gespräch an einen menschlichen Mitarbeiter weiterleiten."
      },
      {
        question: "Können Termine direkt gebucht werden?",
        answer: "Ja, durch die Integration mit Kalendersystemen können Termine in Echtzeit geprüft und gebucht werden."
      }
    ]
  },
  avatar: {
    name: "Avatar",
    description: "Visueller KI-Assistent für persönliche Kundeninteraktionen",
    price: "ab 899€/Monat",
    implementationTime: "4 Wochen",
    image: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
    keyFacts: [
      "Zweck: Personalisierte visuelle Kundenbetreuung",
      "Zielgruppe: Premium-Kunden und Beratungsinteressenten",
      "Kanal: Website-Integration mit Video-Interface",
      "Integrationen: CRM, Produktkataloge, Beratungstools",
      "Implementierung: 4 Wochen durchschnittlich",
      "Datenschutz: Sichere Video-Übertragung, DSGVO-konform",
      "Messgrößen: Engagement-Rate, Conversion-Rate, Session-Dauer"
    ],
    useCases: [
      "Premium-Produktberatung",
      "Virtuelle Showrooms",
      "Onboarding neuer Kunden",
      "Interaktive Produktpräsentationen",
      "Personalisierte Empfehlungen"
    ],
    targetAudience: "Luxusmarken, Beratungsintensive Produkte, B2B-Sales",
    notSuitableFor: "Einfache Standardprodukte ohne Beratungsbedarf",
    metrics: [
      "Steigerung der Conversion-Rate um 45%",
      "Verlängerung der Website-Verweildauer um 200%",
      "Erhöhung der Kundenzufriedenheit um 40%"
    ],
    faqs: [
      {
        question: "Kann der Avatar individuell angepasst werden?",
        answer: "Ja, Aussehen, Stimme und Persönlichkeit des Avatars können vollständig an Ihr Branding angepasst werden."
      },
      {
        question: "Welche technischen Anforderungen gibt es?",
        answer: "Der Avatar läuft in modernen Webbrowsern mit WebRTC-Unterstützung. Eine Internetverbindung und Kamera/Mikrofon sind erforderlich."
      },
      {
        question: "Kann der Avatar Emotionen erkennen?",
        answer: "Ja, durch fortschrittliche KI kann der Avatar Gesichtsausdrücke und Stimmlagen analysieren und entsprechend reagieren."
      },
      {
        question: "Wie realistisch sieht der Avatar aus?",
        answer: "Wir verwenden photorealistische 3D-Technologie. Der Avatar ist als KI erkennbar, wirkt aber sehr menschlich und professionell."
      }
    ]
  },
  wissensbot: {
    name: "Wissensbot",
    description: "Interner KI-Assistent für Mitarbeiter und Wissensdatenbanken",
    price: "ab 399€/Monat",
    implementationTime: "2 Wochen",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
    keyFacts: [
      "Zweck: Interne Wissensvermittlung und Mitarbeiter-Support",
      "Zielgruppe: Mitarbeiter, neue Kollegen, interne Teams",
      "Kanal: Intranet, Slack, Microsoft Teams",
      "Integrationen: Confluence, SharePoint, interne Wikis",
      "Implementierung: 2 Wochen durchschnittlich",
      "Datenschutz: On-Premise oder sichere Cloud, höchste Sicherheit",
      "Messgrößen: Wissensabruf-Zeit, Onboarding-Dauer, Mitarbeiterzufriedenheit"
    ],
    useCases: [
      "Mitarbeiter-Onboarding",
      "Prozess-Dokumentation",
      "HR-Anfragen",
      "IT-Support Level 1",
      "Compliance-Training"
    ],
    targetAudience: "Mittlere und große Unternehmen, Wissensintensive Branchen",
    notSuitableFor: "Kleine Teams unter 20 Mitarbeitern ohne komplexe Prozesse",
    metrics: [
      "Reduzierung der Onboarding-Zeit um 50%",
      "Steigerung der Wissensabruf-Effizienz um 70%",
      "Entlastung der HR-Abteilung um 40%"
    ],
    faqs: [
      {
        question: "Wie sicher sind unsere internen Daten?",
        answer: "Höchste Sicherheitsstandards mit On-Premise-Option oder zertifizierten EU-Servern. Alle Daten bleiben in Ihrem Unternehmen."
      },
      {
        question: "Kann der Bot mit unserem Intranet verbunden werden?",
        answer: "Ja, wir bieten Integrationen für alle gängigen Intranet-Lösungen und können bestehende Wissensdatenbanken einbinden."
      },
      {
        question: "Wie aktuell sind die Informationen?",
        answer: "Der Wissensbot synchronisiert sich automatisch mit Ihren Datenquellen und lernt kontinuierlich aus neuen Dokumenten."
      },
      {
        question: "Können verschiedene Abteilungen unterschiedliche Zugriffe haben?",
        answer: "Ja, wir implementieren rollenbasierte Zugriffskontrollen entsprechend Ihrer Organisationsstruktur."
      }
    ]
  }
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = id ? productData[id] : null;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Produkt nicht gefunden</h1>
          <Link href="/">
            <Button>Zurück zur Startseite</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" data-testid={`product-detail-${id}`}>
      <SEOHelmet 
        title={`${product.name} - KI-Assistenten | Professionelle KI-Lösung`}
        description={`${product.description}. ${product.price}, Implementierung in ${product.implementationTime}. DSGVO-konform und einfach zu integrieren.`}
        keywords={`${product.name}, KI Assistent, ${product.targetAudience}, DSGVO konform`}
      />
      
      <AccessibilityBanner />
      <Navigation />

      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8" aria-label="Breadcrumb" data-testid="breadcrumb">
            <Link href="/" className="text-muted-foreground hover:text-accent inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zur Startseite
            </Link>
          </nav>

          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h1 className="text-5xl font-bold mb-6 gradient-text" data-testid="product-title">
                {product.name}
              </h1>
              <p className="text-xl text-muted-foreground mb-6" data-testid="product-description">
                {product.description}
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <Badge variant="secondary" className="text-lg px-4 py-2" data-testid="product-price">
                  {product.price}
                </Badge>
                <Badge variant="outline" className="text-lg px-4 py-2" data-testid="product-implementation">
                  <Clock className="mr-2 h-4 w-4" />
                  {product.implementationTime}
                </Badge>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-secondary text-primary-foreground"
                  data-testid="product-demo-button"
                >
                  Kostenlose Demo
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  data-testid="product-consultation-button"
                >
                  Beratungstermin
                </Button>
              </div>
            </div>
            
            <div>
              <img 
                src={product.image}
                alt={`${product.name} Interface und Anwendung`}
                className="rounded-lg shadow-2xl w-full"
                data-testid="product-hero-image"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Key Facts */}
              <Card className="glass" data-testid="key-facts-section">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <CheckCircle className="mr-3 text-accent" />
                    Key Facts
                  </h2>
                  <div className="grid grid-cols-1 gap-3">
                    {product.keyFacts.map((fact: string, index: number) => (
                      <div key={index} className="flex items-start" data-testid={`key-fact-${index}`}>
                        <CheckCircle className="mr-3 mt-0.5 h-4 w-4 text-accent flex-shrink-0" />
                        <span className="text-sm">{fact}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Use Cases */}
              <Card className="glass" data-testid="use-cases-section">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <Target className="mr-3 text-secondary" />
                    Anwendungsfälle
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.useCases.map((useCase: string, index: number) => (
                      <div key={index} className="glass p-4 rounded-lg" data-testid={`use-case-${index}`}>
                        <p className="font-medium">{useCase}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Target Audience */}
              <Card className="glass" data-testid="target-audience-section">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <Users className="mr-3 text-primary" />
                    Für wen ist das geeignet?
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-accent mb-2">Ideal für:</h3>
                      <p className="text-muted-foreground">{product.targetAudience}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-destructive mb-2">Nicht geeignet für:</h3>
                      <p className="text-muted-foreground">{product.notSuitableFor}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Metrics */}
              <Card className="glass" data-testid="metrics-section">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Metriken, die wir verbessern</h2>
                  <div className="grid grid-cols-1 gap-4">
                    {product.metrics.map((metric: string, index: number) => (
                      <div key={index} className="flex items-center glass p-4 rounded-lg" data-testid={`metric-${index}`}>
                        <CheckCircle className="mr-3 text-accent h-5 w-5" />
                        <span className="font-medium">{metric}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* FAQ */}
              <Card className="glass" data-testid="faq-section">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <MessageCircle className="mr-3 text-secondary" />
                    Häufige Fragen
                  </h2>
                  
                  <Accordion type="single" collapsible className="w-full">
                    {product.faqs.map((faq: any, index: number) => (
                      <AccordionItem key={index} value={`item-${index}`} data-testid={`faq-item-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* CTA Card */}
              <Card className="glass sticky top-32" data-testid="cta-card">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Jetzt starten</h3>
                  <div className="space-y-4">
                    <Button 
                      className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground"
                      data-testid="sidebar-demo-button"
                    >
                      Kostenlose Demo
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      data-testid="sidebar-consultation-button"
                    >
                      Beratungstermin
                    </Button>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-border">
                    <h4 className="font-medium mb-3">Oder direkt kontaktieren:</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>📞 +49 (0) 123 456 789</p>
                      <p>✉️ kontakt@ki-assistenten.de</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Implementation Timeline */}
              <Card className="glass" data-testid="implementation-timeline">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Implementierung</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Beratung & Konzept</span>
                      <span className="text-muted-foreground">1-2 Tage</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Training & Setup</span>
                      <span className="text-muted-foreground">1-2 Wochen</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Integration & Test</span>
                      <span className="text-muted-foreground">1 Woche</span>
                    </div>
                    <div className="flex justify-between font-semibold pt-2 border-t border-border">
                      <span>Go-Live</span>
                      <span className="text-accent">{product.implementationTime}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
