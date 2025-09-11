import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, Video, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import zoePhoto from "@assets/Zoe_Website_1757416756555.jpg";

export default function ContactForm() {
  const { toast } = useToast();

  const handleQuickAction = async (action: string) => {
    toast({
      title: "Demo verfügbar",
      description: `${action} wird in Kürze verfügbar sein. Kontaktieren Sie uns gerne direkt.`,
    });
  };

  return (
    <section id="kontakt" className="py-12 px-4 sm:px-6 lg:px-8" data-testid="contact-section">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 relative pt-4">
          {/* Zoë's Photo - oben rechts, richtig positioniert */}
          <div className="absolute -top-2 right-0 sm:right-4 w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white z-10">
            <img 
              src={zoePhoto}
              alt="Zoë Hagen - Gründerin von Zoë's KI Studio"
              className="w-full h-full object-cover object-top"
              style={{ objectPosition: '50% 20%' }}
              data-testid="zoe-contact-photo"
            />
          </div>
          
          <h2 className="text-3xl font-bold mb-4" data-testid="contact-title">
            Bereit für Ihren KI-Assistenten?
          </h2>
          <p className="text-muted-foreground" data-testid="contact-subtitle">
            Lassen Sie uns gemeinsam die perfekte Lösung für Ihr Unternehmen finden
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Info */}
          <Card className="glass">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold mb-6 text-center" data-testid="contact-info-title">
                Direkter Kontakt
              </h3>
              <div className="space-y-6">
                <div className="flex items-center" data-testid="contact-phone">
                  <Phone className="text-accent text-xl mr-4" />
                  <div>
                    <p className="font-medium text-lg">Telefon</p>
                    <a 
                      href="tel:+4917198627773" 
                      className="text-primary font-medium hover:underline text-lg"
                      data-testid="phone-link"
                    >
                      +49 171 9862773
                    </a>
                  </div>
                </div>
                <div className="flex items-center" data-testid="contact-email">
                  <Mail className="text-accent text-xl mr-4" />
                  <div>
                    <p className="font-medium text-lg">E-Mail</p>
                    <a 
                      href="mailto:zoe-kiconsulting@pm.me" 
                      className="text-primary font-medium hover:underline text-lg"
                      data-testid="email-link"
                    >
                      zoe-kiconsulting@pm.me
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="glass">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold mb-6 text-center" data-testid="quick-actions-title">
                Schnellstart
              </h3>
              <div className="space-y-4">
                <Button
                  className="w-full button-gradient py-4 px-6 font-medium text-lg"
                  onClick={() => handleQuickAction("15-Min Demo")}
                  data-testid="quick-action-demo"
                >
                  <Video className="mr-3 h-5 w-5" />
                  15-Min Demo vereinbaren
                </Button>
                <Button
                  className="w-full button-gradient py-4 px-6 font-medium text-lg"
                  onClick={() => handleQuickAction("Produktbroschüre")}
                  data-testid="quick-action-brochure"
                >
                  <Download className="mr-3 h-5 w-5" />
                  Produktbroschüre laden
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}