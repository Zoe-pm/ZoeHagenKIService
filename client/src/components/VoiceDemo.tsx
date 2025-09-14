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
    // Open Juna Voice Voicebot Widget directly
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
                Sprechen Sie mit Juna
              </h2>
              <p className="text-muted-foreground mb-4" data-testid="voice-demo-description">
                Juna beantwortet alle Ihre Fragen. Sie können Sie jederzeit unterbrechen oder auflegen. Ganz einfach.
              </p>
              
              <div className="flex flex-col items-center space-y-6">
                <Button
                  className="voice-pulse bg-gradient-to-r from-[#e63973] to-[#E8719A] p-6 rounded-full text-4xl hover:scale-110 transition-transform"
                  onClick={handleVoiceDemo}
                  aria-label="Juna Voicebot starten"
                  data-testid="voice-demo-mic-button"
                >
                  <Mic />
                </Button>
                
                <p className="text-sm text-muted-foreground" data-testid="voice-demo-instruction">
                  Klicken und mit Juna sprechen
                </p>
                
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Juna Voice Voicebot Widget */}
      <VoicebotWidget 
        isOpen={isVoiceOpen} 
        onClose={() => setIsVoiceOpen(false)} 
      />
    </>
  );
}