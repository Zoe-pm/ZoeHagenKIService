import { useState, useEffect, useCallback } from 'react';
import Vapi from '@vapi-ai/web';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, MicOff, Phone, PhoneOff, Volume2 } from 'lucide-react';

interface VoicebotWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CallState {
  isConnected: boolean;
  isConnecting: boolean;
  isMuted: boolean;
  transcript: string;
  isAssistantSpeaking: boolean;
  callDuration: number;
}

const VoicebotWidget = ({ isOpen, onClose }: VoicebotWidgetProps) => {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  
  // Initial call state
  const getInitialCallState = (): CallState => ({
    isConnected: false,
    isConnecting: false,
    isMuted: false,
    transcript: '',
    isAssistantSpeaking: false,
    callDuration: 0
  });
  
  const [callState, setCallState] = useState<CallState>(getInitialCallState());
  const [error, setError] = useState<string | null>(null);

  // Reset function to clear all state
  const resetWidget = useCallback(() => {
    setCallState(getInitialCallState());
    setError(null);
    if (vapi) {
      vapi.stop();
    }
  }, [vapi]);

  // Initialize Vapi client
  useEffect(() => {
    if (!isOpen) return;

    // Use VAPI_PUBLIC_KEY - needs VITE_ prefix for frontend access
    const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;
    
    console.log('JUNA: Initializing with key:', publicKey ? 'KEY_PROVIDED' : 'NO_KEY');
    
    if (!publicKey) {
      console.warn('JUNA: VITE_VAPI_PUBLIC_KEY not found. Voice assistant will show error.');
      setError('Voice-System benötigt API-Schlüssel Konfiguration.');
      return;
    }
    
    try {
      const vapiClient = new Vapi(publicKey);
      
      // Set up event listeners
      vapiClient.on('call-start', () => {
        console.log('JUNA: Voice call started');
        setCallState(prev => ({ 
          ...prev, 
          isConnected: true, 
          isConnecting: false 
        }));
        setError(null);
      });

      vapiClient.on('call-end', () => {
        console.log('JUNA: Voice call ended');
        setCallState(prev => ({ 
          ...prev, 
          isConnected: false, 
          isConnecting: false,
          callDuration: 0
        }));
      });

      vapiClient.on('speech-start', () => {
        console.log('JUNA: Assistant speaking');
        setCallState(prev => ({ 
          ...prev, 
          isAssistantSpeaking: true 
        }));
      });

      vapiClient.on('speech-end', () => {
        console.log('JUNA: Assistant finished speaking');
        setCallState(prev => ({ 
          ...prev, 
          isAssistantSpeaking: false 
        }));
      });

      vapiClient.on('message', (message) => {
        console.log('JUNA: Transcript update:', message);
        if (message.type === 'transcript' && message.transcript) {
          setCallState(prev => ({
            ...prev,
            transcript: prev.transcript + ' ' + message.transcript
          }));
        }
      });

      vapiClient.on('error', (error) => {
        console.error('JUNA: Voice call error:', error);
        setError('Verbindungsfehler. Bitte versuchen Sie es erneut.');
        setCallState(prev => ({ 
          ...prev, 
          isConnected: false, 
          isConnecting: false 
        }));
      });

      setVapi(vapiClient);
    } catch (err) {
      console.error('JUNA: Failed to initialize Vapi:', err);
      setError('Voice-System konnte nicht gestartet werden.');
    }

    return () => {
      if (vapi) {
        vapi.stop();
      }
    };
  }, [isOpen]);

  // Reset widget when closing
  useEffect(() => {
    if (!isOpen) {
      resetWidget();
    }
  }, [isOpen, resetWidget]);

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (callState.isConnected) {
      interval = setInterval(() => {
        setCallState(prev => ({
          ...prev,
          callDuration: prev.callDuration + 1
        }));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callState.isConnected]);

  const startCall = useCallback(async () => {
    if (!vapi) return;
    
    setCallState(prev => ({ ...prev, isConnecting: true }));
    setError(null);

    try {
      // Get Assistant ID from environment or use default inline config
      const assistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID;
      
      if (assistantId) {
        // Use pre-configured assistant from Vapi dashboard
        console.log('JUNA: Using configured assistant:', assistantId);
        await vapi.start(assistantId);
      } else {
        // Fallback to inline configuration
        console.log('JUNA: Using inline configuration (no assistant ID provided)');
        await vapi.start({
          model: {
            provider: "openai",
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: `Du bist Juna, die freundliche Voice-Assistentin von Zoë's KI Service. 
                Du hilfst Kunden bei Fragen zu unseren KI-Produkten: Chatbot, Voicebot, Avatar und Wissensbot.
                Antworte kurz, freundlich und auf Deutsch. Stelle gezielt Rückfragen um zu helfen.
                Du bist die Voice-Version - erwähne dass es auch den Text-Chatbot gibt.
                
                WICHTIG: Wenn Kunden nach einem Termin, einer Beratung, einem Gespräch oder einer Demo fragen, 
                sage ihnen freundlich: "Gerne können Sie einen Termin vereinbaren! Nutzen Sie einfach unseren 
                Online-Kalender oder sprechen Sie mit unserem Text-Chatbot - dort finden Sie den direkten 
                Terminbuchungslink." Sei proaktiv und biete Termine an, wenn es passend erscheint.`
              }
            ]
          },
          voice: {
            provider: "11labs", 
            voiceId: "sarah" // Friendly female voice
          }
        });
      }
    } catch (err) {
      console.error('JUNA: Failed to start call:', err);
      setError('Anruf konnte nicht gestartet werden. Prüfen Sie Ihr Mikrofon.');
      setCallState(prev => ({ ...prev, isConnecting: false }));
    }
  }, [vapi]);

  const endCall = useCallback(() => {
    if (vapi && callState.isConnected) {
      vapi.stop();
    }
  }, [vapi, callState.isConnected]);

  const toggleMute = useCallback(() => {
    if (vapi && callState.isConnected) {
      const newMutedState = !callState.isMuted;
      vapi.setMuted(newMutedState);
      setCallState(prev => ({ ...prev, isMuted: newMutedState }));
    }
  }, [vapi, callState.isConnected, callState.isMuted]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-4 z-40 w-80 max-w-[calc(100vw-2rem)]">
      <Card className="glass shadow-xl border border-secondary/20">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full button-gradient flex items-center justify-center">
                <Volume2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Juna</h3>
                <p className="text-sm text-muted-foreground">Voice Assistant</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
              data-testid="button-close-voice"
            >
              ✕
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Call Status */}
          <div className="mb-4 text-center">
            {callState.isConnecting && (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm text-muted-foreground">Verbinde...</span>
              </div>
            )}
            
            {callState.isConnected && (
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-600">
                    Verbunden • {formatDuration(callState.callDuration)}
                  </span>
                </div>
                
                {callState.isAssistantSpeaking && (
                  <div className="flex items-center justify-center space-x-1">
                    <span className="text-xs text-primary">🎙️ Juna spricht...</span>
                  </div>
                )}
              </div>
            )}

            {!callState.isConnected && !callState.isConnecting && (
              <p className="text-sm text-muted-foreground">
                Bereit für Ihren Sprachchat mit Juna
              </p>
            )}
          </div>


          {/* Controls */}
          <div className="flex justify-center space-x-3">
            {!callState.isConnected ? (
              <Button
                onClick={startCall}
                disabled={callState.isConnecting || !!error}
                className="button-gradient px-6"
                data-testid="button-start-voice"
              >
                <Phone className="h-4 w-4 mr-2" />
                {callState.isConnecting ? 'Verbinde...' : 'Anrufen'}
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleMute}
                  className={callState.isMuted ? 'bg-destructive/10 text-destructive' : ''}
                  data-testid="button-toggle-mute"
                >
                  {callState.isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={endCall}
                  data-testid="button-end-call"
                >
                  <PhoneOff className="h-4 w-4 mr-2" />
                  Beenden
                </Button>
              </>
            )}
          </div>

          {/* Info Text */}
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              Sprechen Sie mit Juna über unsere KI-Lösungen
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoicebotWidget;