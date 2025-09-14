import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Phone, Mail, Download, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useState } from 'react';


// Contact form schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name ist zu kurz').max(50, 'Name ist zu lang'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  message: z.string().min(10, 'Nachricht ist zu kurz (mindestens 10 Zeichen)').max(1000, 'Nachricht ist zu lang')
});

export default function ContactForm() {
  const { toast } = useToast();
  
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
  };

  const onSubmitContact = (data: z.infer<typeof contactSchema>) => {
    contactMutation.mutate(data);
  };

  return (
    <section id="kontakt" className="py-12 px-4 sm:px-6 lg:px-8" data-testid="contact-section">
      <div className="max-w-4xl mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="glass">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-6 text-left" data-testid="contact-form-title">
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
                <h3 className="text-xl font-semibold mb-4 text-left" data-testid="contact-info-title">
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
                <h3 className="text-xl font-semibold mb-4 text-left" data-testid="quick-actions-title">
                  Schnellstart
                </h3>
                <div className="space-y-3">
                  <Button
                    className="w-full button-gradient py-3 px-4 font-medium"
                    onClick={() => window.open('mailto:zoe-kiconsulting@pm.me', '_blank')}
                    data-testid="quick-action-demo"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    E-Mail schreiben
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