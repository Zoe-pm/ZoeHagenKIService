import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Phone, Mail, Calendar, Video, Download, Calculator } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  name: z.string().min(2, "Name muss mindestens 2 Zeichen lang sein"),
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein"),
  company: z.string().optional(),
  interest: z.string().optional(),
  message: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

const consultationSchema = z.object({
  name: z.string().min(2, "Name muss mindestens 2 Zeichen lang sein"),
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein"),
  company: z.string().optional(),
  phone: z.string().optional(),
  preferredTime: z.string().optional(),
  productInterest: z.string().optional(),
  message: z.string().optional(),
});

type ConsultationFormData = z.infer<typeof consultationSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const contactForm = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      interest: "",
      message: "",
    },
  });

  const handleContactSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const res = await apiRequest("POST", "/api/contact", data);
      const result = await res.json();
      
      if (result.success) {
        toast({
          title: "Nachricht gesendet",
          description: "Vielen Dank für Ihre Nachricht. Wir melden uns binnen 24 Stunden bei Ihnen.",
        });
        contactForm.reset();
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAction = async (action: string) => {
    toast({
      title: "Demo verfügbar",
      description: `${action} wird in Kürze verfügbar sein. Nutzen Sie gerne das Kontaktformular.`,
    });
  };

  return (
    <section id="kontakt" className="py-20 px-4 sm:px-6 lg:px-8" data-testid="contact-section">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6" data-testid="contact-title">
            Bereit für Ihren KI-Assistenten?
          </h2>
          <p className="text-xl text-muted-foreground" data-testid="contact-subtitle">
            Lassen Sie uns gemeinsam die perfekte Lösung für Ihr Unternehmen finden
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="glass">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold mb-6" data-testid="contact-form-title">
                Kostenlose Beratung buchen
              </h3>
              
              <Form {...contactForm}>
                <form onSubmit={contactForm.handleSubmit(handleContactSubmit)} className="space-y-6">
                  <FormField
                    control={contactForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ihr Name *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Max Mustermann" 
                            {...field} 
                            data-testid="contact-form-name"
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
                            placeholder="max@unternehmen.de" 
                            {...field}
                            data-testid="contact-form-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={contactForm.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unternehmen</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Mustermann GmbH" 
                            {...field}
                            data-testid="contact-form-company"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={contactForm.control}
                    name="interest"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interesse an</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="contact-form-interest">
                              <SelectValue placeholder="Bitte wählen" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="chatbot">Chatbot</SelectItem>
                            <SelectItem value="voicebot">Voicebot</SelectItem>
                            <SelectItem value="avatar">Avatar</SelectItem>
                            <SelectItem value="wissensbot">Wissensbot</SelectItem>
                            <SelectItem value="mehrere">Mehrere Lösungen</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={contactForm.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ihre Nachricht</FormLabel>
                        <FormControl>
                          <Textarea 
                            rows={4}
                            placeholder="Beschreiben Sie kurz Ihre Anforderungen..."
                            {...field}
                            data-testid="contact-form-message"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground py-3 px-6 font-medium hover:opacity-90 transition-opacity"
                    disabled={isSubmitting}
                    data-testid="contact-form-submit"
                  >
                    {isSubmitting ? "Wird gesendet..." : "Beratungstermin anfragen"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          {/* Contact Info */}
          <div className="space-y-8">
            <Card className="glass">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4" data-testid="contact-info-title">
                  Direkter Kontakt
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center" data-testid="contact-phone">
                    <Phone className="text-accent text-lg mr-4" />
                    <div>
                      <p className="font-medium">Telefon</p>
                      <p className="text-muted-foreground">+49 (0) 123 456 789</p>
                    </div>
                  </div>
                  <div className="flex items-center" data-testid="contact-email">
                    <Mail className="text-accent text-lg mr-4" />
                    <div>
                      <p className="font-medium">E-Mail</p>
                      <p className="text-muted-foreground">kontakt@ki-assistenten.de</p>
                    </div>
                  </div>
                  <div className="flex items-center" data-testid="contact-hours">
                    <Calendar className="text-accent text-lg mr-4" />
                    <div>
                      <p className="font-medium">Terminbuchung</p>
                      <p className="text-muted-foreground">Mo-Fr, 9:00-18:00 Uhr</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4" data-testid="quick-actions-title">
                  Schnellstart
                </h3>
                <div className="space-y-3">
                  <Button
                    className="w-full bg-gradient-to-r from-secondary to-accent text-secondary-foreground py-3 px-4 font-medium hover:opacity-90 transition-opacity"
                    onClick={() => handleQuickAction("15-Min Demo")}
                    data-testid="quick-action-demo"
                  >
                    <Video className="mr-2 h-4 w-4" />
                    15-Min Demo vereinbaren
                  </Button>
                  <Button
                    className="w-full bg-gradient-to-r from-accent to-primary text-accent-foreground py-3 px-4 font-medium hover:opacity-90 transition-opacity"
                    onClick={() => handleQuickAction("Produktbroschüre")}
                    data-testid="quick-action-brochure"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Produktbroschüre laden
                  </Button>
                  <Button
                    className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground py-3 px-4 font-medium hover:opacity-90 transition-opacity"
                    onClick={() => handleQuickAction("ROI-Rechner")}
                    data-testid="quick-action-calculator"
                  >
                    <Calculator className="mr-2 h-4 w-4" />
                    ROI-Rechner starten
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
