import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";

const timelineSteps = [
  {
    number: "1",
    title: "Beratung & Konzept",
    description: "Unverbindliches Gespräch zur Analyse Ihrer Anforderungen und Auswahl der optimalen KI-Lösung.",
    duration: "1-2 Tage",
    color: "text-primary"
  },
  {
    number: "2", 
    title: "Training & Anpassung",
    description: "Wir trainieren die KI mit Ihren Daten, Prozessen und entwickeln die passenden Dialoge.",
    duration: "1-2 Wochen",
    color: "text-secondary"
  },
  {
    number: "3",
    title: "Integration & Testing",
    description: "Technische Integration in Ihre bestehenden Systeme und ausgiebige Tests mit Ihrem Team.",
    duration: "1 Woche",
    color: "text-accent"
  },
  {
    number: "4",
    title: "Go-Live & Support",
    description: "Produktiver Start mit kontinuierlichem Monitoring und 30 Tage kostenlosem Premium-Support.",
    duration: "1 Tag + laufend",
    color: "text-primary"
  }
];

export default function Timeline() {
  return (
    <section id="implementation" className="py-12 px-4 sm:px-6 lg:px-8" data-testid="timeline-section">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4" data-testid="timeline-title">
            In 4 einfachen Schritten zur KI-Lösung
          </h2>
          <p className="text-muted-foreground" data-testid="timeline-subtitle">
            Von der Beratung bis zum Go-Live in nur 30 Tagen
          </p>
        </div>
        
        <div className="relative">
          {/* Timeline line */}
          <div 
            className="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary to-accent" 
            aria-hidden="true"
          />
          
          <div className="space-y-12">
            {timelineSteps.map((step, index) => (
              <div key={index} className="relative flex items-start" data-testid={`timeline-step-${index}`}>
                <div className="glass w-16 h-16 rounded-full flex items-center justify-center mr-6 relative z-10">
                  <span className={`text-2xl font-bold ${step.color}`}>
                    {step.number}
                  </span>
                </div>
                <Card className="glass flex-1">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2" data-testid={`timeline-step-title-${index}`}>
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground mb-3" data-testid={`timeline-step-description-${index}`}>
                      {step.description}
                    </p>
                    <p className="text-sm text-accent font-medium" data-testid={`timeline-step-duration-${index}`}>
                      Dauer: {step.duration}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
        
        {/* What we need from customer */}
        <Card className="glass mt-16">
          <CardContent className="p-8">
            <h3 className="text-2xl font-semibold mb-4 flex items-center" data-testid="requirements-title">
              <ClipboardList className="text-secondary mr-3" />
              Was wir von Ihnen brauchen
            </h3>
            <p className="text-muted-foreground text-lg" data-testid="requirements-description">
              <strong>Für einen reibungslosen Start benötigen wir:</strong> Ihre häufigsten Kundenfragen, 
              Zugang zu bestehenden FAQ-Dokumenten, technische Kontaktperson für die Integration 
              und etwa 2-3 Stunden Ihrer Zeit für Abstimmungstermine während der Implementierung.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
