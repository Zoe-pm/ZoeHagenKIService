import { useState } from "react";
import { Mic, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function VoiceDemo() {
  const [isListening, setIsListening] = useState(false);
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const demoQuestions = [
    "Welche Öffnungszeiten haben Sie?",
    "Wie kann ich einen Termin buchen?",
    "Was kostet der Service?",
    "Erzählen Sie mir mehr über Ihr Unternehmen"
  ];

  const handleVoiceDemo = async (question: string) => {
    setIsLoading(true);
    try {
      const res = await apiRequest("POST", "/api/voice-demo", { question });
      const data = await res.json();
      
      if (data.success) {
        setResponse(data.response);
        
        // Use Web Speech API for text-to-speech if available
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(data.response);
          utterance.lang = 'de-DE';
          speechSynthesis.speak(utterance);
        }
      } else {
        toast({
          title: "Fehler",
          description: "Voice-Demo konnte nicht gestartet werden.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Verbindungsfehler zur Voice-Demo API.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicClick = () => {
    // Simulate voice recognition with a random demo question
    const randomQuestion = demoQuestions[Math.floor(Math.random() * demoQuestions.length)];
    handleVoiceDemo(randomQuestion);
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8" data-testid="voice-demo-section">
      <div className="max-w-4xl mx-auto">
        <Card className="glass">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-4" data-testid="voice-demo-title">
              <Volume2 className="inline-block text-secondary mr-3" />
              Voicebot sofort testen
            </h2>
            <p className="text-muted-foreground mb-6" data-testid="voice-demo-description">
              Probieren Sie unseren Voicebot direkt aus. Klicken Sie auf das Mikrofon oder eine der Demo-Fragen.
            </p>
            
            <div className="flex flex-col items-center space-y-6">
              <Button
                className={`voice-pulse bg-gradient-to-r from-secondary to-accent p-6 rounded-full text-4xl hover:scale-110 transition-transform ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleMicClick}
                disabled={isLoading}
                aria-label="Voicebot aktivieren"
                data-testid="voice-demo-mic-button"
              >
                <Mic />
              </Button>
              
              <p className="text-sm text-muted-foreground" data-testid="voice-demo-instruction">
                {isLoading ? "Verarbeitet..." : "Klicken zum Sprechen"}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full">
                <div className="glass p-4 rounded-lg">
                  <p className="text-sm mb-3 font-medium">Demo-Fragen:</p>
                  {demoQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="w-full text-left justify-start mb-2 text-xs hover:bg-accent/20"
                      onClick={() => handleVoiceDemo(question)}
                      disabled={isLoading}
                      data-testid={`voice-demo-question-${index}`}
                    >
                      "{question}"
                    </Button>
                  ))}
                </div>
                
                {response && (
                  <div className="glass p-4 rounded-lg" data-testid="voice-demo-response">
                    <p className="text-sm mb-2 font-medium">Antwort:</p>
                    <p className="text-sm text-muted-foreground">{response}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
