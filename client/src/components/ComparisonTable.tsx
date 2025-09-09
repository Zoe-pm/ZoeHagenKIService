import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

const comparisonData = [
  {
    feature: "Einsatzbereich",
    chatbot: "Website",
    voicebot: "Telefon",
    avatar: "Website",
    wissensbot: "Intern"
  },
  {
    feature: "Kommunikation",
    chatbot: "Text",
    voicebot: "Sprache",
    avatar: "Video + Audio",
    wissensbot: "Text"
  },
  {
    feature: "Zielgruppe",
    chatbot: "Website-Besucher",
    voicebot: "Anrufer",
    avatar: "Premium-Kunden",
    wissensbot: "Mitarbeiter"
  },
  {
    feature: "Implementierung",
    chatbot: "2 Wochen",
    voicebot: "3 Wochen",
    avatar: "4 Wochen",
    wissensbot: "2 Wochen"
  },
  {
    feature: "Preis ab",
    chatbot: "299€/Monat",
    voicebot: "599€/Monat",
    avatar: "899€/Monat",
    wissensbot: "399€/Monat"
  }
];

export default function ComparisonTable() {
  return (
    <section id="vergleich" className="py-12 px-4 sm:px-6 lg:px-8" data-testid="comparison-section">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4" data-testid="comparison-title">
            Welcher KI-Assistent passt zu Ihnen?
          </h2>
          <p className="text-muted-foreground" data-testid="comparison-subtitle">
            Vergleichen Sie die vier Lösungen auf einen Blick
          </p>
        </div>
        
        <Card className="glass">
          <CardContent className="p-6 overflow-x-auto">
            <Table data-testid="comparison-table">
              <TableHeader>
                <TableRow className="border-b border-border">
                  <TableHead className="text-left py-4 px-4 font-semibold">
                    Feature
                  </TableHead>
                  <TableHead className="text-center py-4 px-4 font-semibold text-primary">
                    Chatbot
                  </TableHead>
                  <TableHead className="text-center py-4 px-4 font-semibold text-secondary">
                    Voicebot
                  </TableHead>
                  <TableHead className="text-center py-4 px-4 font-semibold text-accent">
                    Avatar
                  </TableHead>
                  <TableHead className="text-center py-4 px-4 font-semibold text-primary">
                    Wissensbot
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonData.map((row, index) => (
                  <TableRow key={index} className="border-b border-border" data-testid={`comparison-row-${index}`}>
                    <TableCell className="py-4 px-4 font-medium">
                      {row.feature}
                    </TableCell>
                    <TableCell className="py-4 px-4 text-center">
                      {row.chatbot}
                    </TableCell>
                    <TableCell className="py-4 px-4 text-center">
                      {row.voicebot}
                    </TableCell>
                    <TableCell className="py-4 px-4 text-center">
                      {row.avatar}
                    </TableCell>
                    <TableCell className="py-4 px-4 text-center">
                      {row.wissensbot}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
