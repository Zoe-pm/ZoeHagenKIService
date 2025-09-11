import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Phone, Mail, Video, Download, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import zoePhoto from "@assets/Zoe_Website_1757416756555.jpg";
import { useEffect, useState } from 'react';

// Calendly global type
declare global {
  interface Window {
    Calendly: any;
  }
}

// Contact form schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name ist zu kurz').max(50, 'Name ist zu lang'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  message: z.string().min(10, 'Nachricht ist zu kurz (mindestens 10 Zeichen)').max(1000, 'Nachricht ist zu lang')
});

export default function ContactForm() {
  const { toast } = useToast();
  const [calendlyLoaded, setCalendlyLoaded] = useState(false);
  
  // Calendly Script laden
  useEffect(() => {
    if (window.Calendly) {
      setCalendlyLoaded(true);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.onload = () => {
      setCalendlyLoaded(true);
    };
    document.head.appendChild(script);
    
    return () => {
      // Cleanup: Script nicht entfernen da global benötigt
    };
  }, []);
  
  const contactForm = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      message: ''
    }
  });

  const contactMutation = useMutation({
    mutationFn: async (data: z.infer<typeof contactSchema>) => {
      return await apiRequest('POST', '/api/contact', data);
    },
    onSuccess: () => {
      toast({
        title: "Nachricht gesendet!",
        description: "Vielen Dank für Ihre Nachricht. Wir melden uns zeitnah bei Ihnen.",
      });
      contactForm.reset();
    },
    onError: () => {
      toast({
        title: "Fehler",
        description: "Nachricht konnte nicht gesendet werden. Versuchen Sie es erneut oder kontaktieren Sie uns direkt.",
        variant: "destructive"
      });
    }
  });

  const handleQuickAction = async (action: string) => {
    if (action === "Anrufen") {
      window.open('tel:+4917198627773');
      return;
    }
    
    if (action === "15-Min Demo") {
      const calendlyDemoUrl = import.meta.env.VITE_CALENDLY_DEMO_URL || import.meta.env.VITE_CALENDLY_URL;
      
      if (!calendlyDemoUrl) {
        toast({
          title: "Calendly nicht konfiguriert",
          description: "Bitte setzen Sie VITE_CALENDLY_URL in den Environment Variables für die Online-Terminbuchung.",
          variant: "destructive"
        });
        return;
      }
      
      if (!calendlyLoaded || !window.Calendly) {
        toast({
          title: "Calendly lädt...",
          description: "Bitte warten Sie einen Moment, bis Calendly vollständig geladen ist.",
        });
        // Retry nach kurzer Wartezeit
        setTimeout(() => {
          if (window.Calendly) {
            window.Calendly.initPopupWidget({ url: calendlyDemoUrl });
          } else {
            window.open(calendlyDemoUrl, '_blank');
          }
        }, 1000);
        return;
      }
      
      try {
        // Calendly Popup öffnen
        window.Calendly.initPopupWidget({
          url: calendlyDemoUrl
        });
      } catch (error) {
        console.error('Calendly Popup Error:', error);
        // Fallback zu direktem Link
        window.open(calendlyDemoUrl, '_blank');
      }
    } else {
      toast({
        title: "Demo verfügbar",
        description: `${action} wird in Kürze verfügbar sein. Kontaktieren Sie uns gerne direkt.`,
      });
    }
  };

  const onSubmitContact = (data: z.infer<typeof contactSchema>) => {
    contactMutation.mutate(data);
  };

  return (
    <section id="kontakt" className="py-12 px-4 sm:px-6 lg:px-8" data-testid="contact-section">
      <div className="max-w-4xl mx-auto">
        {/* Header mit Foto rechts ohne Überlagerung */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 mb-10">
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-3xl font-bold mb-4" data-testid="contact-title">
              Bereit für Ihren KI-Assistenten?
            </h2>
            <p className="text-muted-foreground text-lg" data-testid="contact-subtitle">
              Lassen Sie uns gemeinsam die perfekte Lösung für Ihr Unternehmen finden.
            </p>
          </div>
          
          {/* Zoë's Photo - klar rechts ohne Textüberlagerung */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white">
              <img 
                src={zoePhoto}
                alt="Zoë Hagen - Gründerin von Zoë's KI Studio"
                className="w-full h-full object-cover object-top"
                style={{ objectPosition: '50% 20%' }}
                data-testid="zoe-contact-photo"
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="glass">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-6 text-center" data-testid="contact-form-title">
                  Schreiben Sie uns eine Nachricht
                </h3>
                <Form {...contactForm}>
                  <form onSubmit={contactForm.handleSubmit(onSubmitContact)} className="space-y-6">
                    <FormField
                      control={contactForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ihr Name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Vor- und Nachname"
                              data-testid="input-contact-name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={contactForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-Mail-Adresse *</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="ihre@email.de"
                              data-testid="input-contact-email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={contactForm.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ihre Nachricht *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Beschreiben Sie Ihr Anliegen oder Ihre Fragen zu unseren KI-Assistenten..."
                              rows={6}
                              data-testid="textarea-contact-message"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full button-gradient py-4 px-6 font-medium text-lg"
                      disabled={contactMutation.isPending}
                      data-testid="button-contact-submit"
                    >
                      {contactMutation.isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                          Nachricht wird gesendet...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-3" />
                          Nachricht senden
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info & Quick Actions */}
          <div className="space-y-6">
            <Card className="glass">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-center" data-testid="contact-info-title">
                  Direkter Kontakt
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center" data-testid="contact-phone">
                    <Phone className="text-accent text-lg mr-3" />
                    <div>
                      <p className="font-medium">Telefon</p>
                      <a 
                        href="tel:+4917198627773" 
                        className="text-primary font-medium hover:underline"
                        data-testid="phone-link"
                      >
                        +49 171 9862773
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center" data-testid="contact-email">
                    <Mail className="text-accent text-lg mr-3" />
                    <div>
                      <p className="font-medium">E-Mail</p>
                      <a 
                        href="mailto:zoe-kiconsulting@pm.me" 
                        className="text-primary font-medium hover:underline"
                        data-testid="email-link"
                      >
                        zoe-kiconsulting@pm.me
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-center" data-testid="quick-actions-title">
                  Schnellstart
                </h3>
                <div className="space-y-3">
                  <Button
                    className="w-full button-gradient py-3 px-4 font-medium"
                    onClick={() => handleQuickAction("15-Min Demo")}
                    data-testid="quick-action-demo"
                  >
                    <Video className="mr-2 h-4 w-4" />
                    15-Min Demo
                  </Button>
                  <Button
                    className="w-full button-gradient py-3 px-4 font-medium"
                    onClick={() => handleQuickAction("Anrufen")}
                    data-testid="quick-action-call"
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Anrufen
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}