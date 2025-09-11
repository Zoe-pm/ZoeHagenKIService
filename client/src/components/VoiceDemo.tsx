import { useState } from "react";
import { Mic, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import VoicebotWidget from "@/components/VoicebotWidget";

export default function VoiceDemo() {
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const { toast } = useToast();

  const handleVoiceDemo = () => {
    // Open Zoia Voicebot Widget directly
    setIsVoiceOpen(true);
  };

  return (
    <>
      <section className="py-8 px-4 sm:px-6 lg:px-8" data-testid="voice-demo-section">
        <div className="max-w-4xl mx-auto">
          <Card className="glass">
            <CardContent className="p-4 text-center">
              <h2 className="text-2xl font-bold mb-4" data-testid="voice-demo-title">
                <Volume2 className="inline-block text-secondary mr-3" />
                Voicebot sofort testen
              </h2>
              <p className="text-muted-foreground mb-4" data-testid="voice-demo-description">
                Sprechen Sie direkt mit Zoia, unserem intelligenten Voice-Assistenten.
              </p>
              
              <div className="flex flex-col items-center space-y-6">
                <Button
                  className="voice-pulse bg-gradient-to-r from-secondary to-accent p-6 rounded-full text-4xl hover:scale-110 transition-transform"
                  onClick={handleVoiceDemo}
                  aria-label="Zoia Voicebot starten"
                  data-testid="voice-demo-mic-button"
                >
                  <Mic />
                </Button>
                
                <p className="text-sm text-muted-foreground" data-testid="voice-demo-instruction">
                  Klicken zum Sprechen mit Zoia
                </p>
                
                <div className="glass p-6 rounded-lg max-w-md">
                  <p className="text-sm mb-3 font-medium">Starten Sie das Gespräch mit:</p>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <p>"Hallo Zoia, erzählen Sie mir über Ihre Produkte"</p>
                    <p>"Wie kann ich einen Termin buchen?"</p>
                    <p>"Was kostet ein Chatbot?"</p>
                    <p>"Welche KI-Lösungen bieten Sie an?"</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Zoia Voicebot Widget */}
      <VoicebotWidget 
        isOpen={isVoiceOpen} 
        onClose={() => setIsVoiceOpen(false)} 
      />
    </>
  );
}