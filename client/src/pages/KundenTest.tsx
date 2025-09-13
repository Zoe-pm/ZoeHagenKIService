import { useState, useEffect } from "react";
import SEOHelmet from "@/components/SEOHelmet";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { TestChatbot } from "@/components/TestChatbot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { HelpCircle, Settings, Bot, MessageSquare, Mic, Palette, Layout, Volume2 } from "lucide-react";

interface ChatbotConfig {
  name: string;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  widgetSize: "small" | "medium" | "large";
  fontFamily: string;
  position: "bottom-right" | "bottom-left" | "center";
  greeting: string;
  title: string;
  subtitle: string;
}

interface VoicebotConfig {
  name: string;
  primaryColor: string;
  backgroundColor: string;
  widgetSize: "small" | "medium" | "large";
  position: "bottom-right" | "bottom-left" | "center";
  voiceSpeed: number[];
  voicePitch: number[];
  elevenLabsVoiceId: string;
  elevenLabsVoiceName: string;
  stability: number;
  similarity: number;
  speakerBoost: boolean;
  greeting: string;
  title: string;
  subtitle: string;
}

interface TestConfig {
  activeBot: "chatbot" | "voicebot";
  chatbot: ChatbotConfig & {
    logoUrl: string;
    logoPosition: string; 
    logoSize: string;
  };
  voicebot: VoicebotConfig & {
    logoUrl: string;
    logoPosition: string;
    logoSize: string;
  };
}

interface TestSession {
  token: string;
  email: string;
  expiresAt: string;
  // n8n Integration
  n8nWebhookUrl?: string;
  n8nBotName?: string;
  n8nBotGreeting?: string;
}

// 10 webfähige Schriftvarianten + Schreibschrift
const fontOptions = [
  { name: "Inter", value: "Inter", category: "Sans-Serif" },
  { name: "Roboto", value: "Roboto, sans-serif", category: "Sans-Serif" },
  { name: "Open Sans", value: "Open Sans, sans-serif", category: "Sans-Serif" },
  { name: "Lato", value: "Lato, sans-serif", category: "Sans-Serif" },
  { name: "Montserrat", value: "Montserrat, sans-serif", category: "Sans-Serif" },
  { name: "Poppins", value: "Poppins, sans-serif", category: "Sans-Serif" },
  { name: "Source Sans Pro", value: "Source Sans Pro, sans-serif", category: "Sans-Serif" },
  { name: "Nunito", value: "Nunito, sans-serif", category: "Sans-Serif" },
  { name: "Playfair Display", value: "Playfair Display, serif", category: "Serif" },
  { name: "Merriweather", value: "Merriweather, serif", category: "Serif" },
  { name: "Dancing Script", value: "Dancing Script, cursive", category: "Schreibschrift" }
];

export default function KundenTest() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [email, setEmail] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [session, setSession] = useState<TestSession | null>(null);
  const [authError, setAuthError] = useState<string>("");
  const [testConfig, setTestConfig] = useState<TestConfig>({
    activeBot: "chatbot",
    chatbot: {
      name: "Wie soll ihr neues Teammitglied heißen?",
      primaryColor: "#fdff06",
      backgroundColor: "#cbffb3",
      textColor: "#1F2937",
      widgetSize: "medium",
      fontFamily: "Merriweather, serif",
      position: "center",
      greeting: "Hallo! Wie kann ich Ihnen heute helfen?",
      title: "Willkommen!",
      subtitle: "24/7 erreichbar",
      logoUrl: "",
      logoPosition: "top-left",
      logoSize: "large"
    },
    voicebot: {
      name: "Kira",
      primaryColor: "#10B981",
      backgroundColor: "#F3F4F6",
      widgetSize: "medium",
      position: "bottom-right",
      voiceSpeed: [1],
      voicePitch: [1],
      elevenLabsVoiceId: "",
      elevenLabsVoiceName: "Voice auswählen...",
      stability: 0.5,
      similarity: 0.75,
      speakerBoost: false,
      greeting: "Hallo! Ich bin Kira, Ihr KI-Ratgeber.",
      title: "Immer für Sie da.",
      subtitle: "Womit kann ich helfen?",
      logoUrl: "",
      logoPosition: "top-left",
      logoSize: "medium"
    }
  });
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [availableVoices, setAvailableVoices] = useState<{id: string, name: string, category: string, labels: any}[]>([]);
  const [isLoadingVoices, setIsLoadingVoices] = useState(false);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);
  const { toast } = useToast();

  // Check for existing session on mount
  useEffect(() => {
    const savedSession = localStorage.getItem('test-session');
    if (savedSession) {
      try {
        const sessionData: TestSession = JSON.parse(savedSession);
        const expiresAt = new Date(sessionData.expiresAt);
        
        if (expiresAt > new Date()) {
          validateSession(sessionData.token);
        } else {
          localStorage.removeItem('test-session');
        }
      } catch (error) {
        localStorage.removeItem('test-session');
      }
    }
  }, []);
  
  // Periodic session revalidation to auto-logout deleted test codes
  useEffect(() => {
    if (!isAuthorized || !session?.token) return;
    
    const revalidationInterval = setInterval(async () => {
      await validateSession(session.token);
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(revalidationInterval);
  }, [isAuthorized, session?.token]);

  // Auto-hide overlay when authorized
  useEffect(() => {
    if (isAuthorized) {
      setShowOverlay(false);
    }
  }, [isAuthorized]);

  // Load available voices when authorized and voicebot is selected
  useEffect(() => {
    if (isAuthorized && testConfig.activeBot === "voicebot" && availableVoices.length === 0) {
      loadAvailableVoices();
    }
  }, [isAuthorized, testConfig.activeBot]);

  // Load voice preferences when session is available
  useEffect(() => {
    if (isAuthorized && session?.token && session?.email) {
      loadVoicePreferences();
    }
  }, [isAuthorized, session?.token, session?.email]);

  // Update voice name when voices are loaded or voice ID changes
  useEffect(() => {
    if (availableVoices.length > 0 && testConfig.voicebot.elevenLabsVoiceId) {
      const voice = availableVoices.find(v => v.id === testConfig.voicebot.elevenLabsVoiceId);
      if (voice && voice.name !== testConfig.voicebot.elevenLabsVoiceName) {
        setTestConfig(prev => ({
          ...prev,
          voicebot: {
            ...prev.voicebot,
            elevenLabsVoiceName: voice.name
          }
        }));
      }
    }
  }, [availableVoices, testConfig.voicebot.elevenLabsVoiceId]);

  const loadAvailableVoices = async () => {
    try {
      setIsLoadingVoices(true);
      const response = await fetch('/api/tts/elevenlabs/voices');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.voices) {
          setAvailableVoices(data.voices);
        } else {
          console.warn('ElevenLabs API responded but no voices available');
          toast({
            title: "Stimmen nicht verfügbar",
            description: "ElevenLabs API antwortet, aber keine Stimmen verfügbar.",
            variant: "destructive",
          });
        }
      } else {
        console.warn('Could not load ElevenLabs voices');
        toast({
          title: "Fehler beim Laden",
          description: "ElevenLabs Stimmen konnten nicht geladen werden.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.warn('Failed to load voices:', error);
      toast({
        title: "Verbindungsfehler",
        description: "Konnte nicht mit ElevenLabs verbinden.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingVoices(false);
    }
  };

  const saveVoicePreferences = async () => {
    if (!session?.token || !session?.email) return;

    setIsSavingPreferences(true);
    try {
      const response = await fetch('/api/test-config/voice-prefs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.token}`,
        },
        body: JSON.stringify({
          sessionToken: session.token,
          email: session.email,
          elevenLabsVoiceId: testConfig.voicebot.elevenLabsVoiceId,
          stability: testConfig.voicebot.stability,
          similarity: testConfig.voicebot.similarity,
          speakerBoost: testConfig.voicebot.speakerBoost,
          speed: testConfig.voicebot.voiceSpeed[0],
        }),
      });

      if (response.ok) {
        toast({
          title: "Einstellungen gespeichert",
          description: "Ihre Voice-Einstellungen wurden erfolgreich gespeichert.",
        });
      } else {
        toast({
          title: "Fehler",
          description: "Voice-Einstellungen konnten nicht gespeichert werden.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.warn('Failed to save voice preferences:', error);
      toast({
        title: "Fehler",
        description: "Verbindungsfehler beim Speichern der Einstellungen.",
        variant: "destructive",
      });
    } finally {
      setIsSavingPreferences(false);
    }
  };

  const loadVoicePreferences = async () => {
    if (!session?.token || !session?.email) return;

    try {
      const response = await fetch(`/api/test-config/voice-prefs?email=${encodeURIComponent(session.email)}`, {
        headers: {
          'Authorization': `Bearer ${session.token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.preferences) {
          const prefs = data.preferences;
          setTestConfig(prev => ({
            ...prev,
            voicebot: {
              ...prev.voicebot,
              elevenLabsVoiceId: prefs.elevenLabsVoiceId || prev.voicebot.elevenLabsVoiceId,
              stability: prefs.stability !== undefined ? parseFloat(prefs.stability) : prev.voicebot.stability,
              similarity: prefs.similarity !== undefined ? parseFloat(prefs.similarity) : prev.voicebot.similarity,
              speakerBoost: prefs.speakerBoost !== undefined ? prefs.speakerBoost : prev.voicebot.speakerBoost,
              voiceSpeed: prefs.speed !== undefined ? [parseFloat(prefs.speed)] : prev.voicebot.voiceSpeed,
              elevenLabsVoiceName: (() => {
                // Try to resolve voice name from availableVoices
                const voice = availableVoices.find(v => v.id === prefs.elevenLabsVoiceId);
                return voice?.name || prev.voicebot.elevenLabsVoiceName;
              })(),
            }
          }));
        }
      }
    } catch (error) {
      console.warn('Failed to load voice preferences:', error);
    }
  };

  const validateSession = async (token: string) => {
    try {
      const response = await fetch('/api/test-session', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const sessionData: TestSession = {
            token,
            email: data.email,
            expiresAt: data.expiresAt,
            // Include n8n configuration from API response
            n8nWebhookUrl: data.n8nWebhookUrl,
            n8nBotName: data.n8nBotName,
            n8nBotGreeting: data.n8nBotGreeting
          };
          setSession(sessionData);
          setIsAuthorized(true);
          setEmail(data.email);
          
          // Update localStorage with refreshed session including n8n config
          localStorage.setItem('test-session', JSON.stringify(sessionData));
        }
      } else {
        // Session invalid or deleted - force logout
        handleLogout();
      }
    } catch (error) {
      console.error('Session validation error:', error);
      handleLogout();
    }
  };

  const handleChatbotConfigChange = (key: keyof ChatbotConfig, value: any) => {
    setTestConfig(prev => ({
      ...prev,
      chatbot: {
        ...prev.chatbot,
        [key]: value
      }
    }));
  };

  const handleVoicebotConfigChange = (key: keyof VoicebotConfig, value: any) => {
    setTestConfig(prev => ({
      ...prev,
      voicebot: {
        ...prev.voicebot,
        [key]: value
      }
    }));
  };

  const handleActiveBotChange = (bot: "chatbot" | "voicebot") => {
    setTestConfig(prev => ({
      ...prev,
      activeBot: bot
    }));
  };

  const resetConfig = () => {
    setTestConfig({
      activeBot: "chatbot",
      chatbot: {
        name: "Kira",
        primaryColor: "#3B82F6",
        backgroundColor: "#FFFFFF",
        textColor: "#1F2937",
        widgetSize: "medium",
        fontFamily: "Inter",
        position: "bottom-right",
        greeting: "Hallo! Womit kann ich helfen?",
        title: "Willkommen!",
        subtitle: "Ich helfe Ihnen gerne weiter",
        logoUrl: "",
        logoPosition: "top-left",
        logoSize: "medium"
      },
      voicebot: {
        name: "Juna Voice",
        primaryColor: "#10B981",
        backgroundColor: "#F3F4F6",
        widgetSize: "medium",
        position: "bottom-right",
        voiceSpeed: [1],
        voicePitch: [1],
        elevenLabsVoiceId: "",
        elevenLabsVoiceName: "Voice auswählen...",
        stability: 0.5,
        similarity: 0.75,
        speakerBoost: false,
        greeting: "Hallo! Ich bin Juna Voice, Ihr Sprach-Assistent.",
        title: "Sprachassistent",
        subtitle: "Sprechen Sie mit mir!",
        logoUrl: "",
        logoPosition: "top-left",
        logoSize: "medium"
      }
    });
  };

  const generateNameSuggestions = (type: "chatbot" | "voicebot") => {
    const chatbotNames = ["Alex", "Max", "Luna", "Nova", "Kai", "Sam", "Rio"];
    const voicebotNames = ["Aria", "Echo", "Sage", "Vale", "Nova", "Zara", "Mira"];
    return type === "chatbot" ? chatbotNames : voicebotNames;
  };

  const handleAccessRequest = async () => {
    if (!email.trim() || !accessCode.trim()) {
      setAuthError("Bitte Email und Zugriffscode eingeben");
      return;
    }

    setIsValidating(true);
    setAuthError("");
    
    try {
      const response = await apiRequest('POST', '/api/test-access', {
        email: email.trim(),
        accessCode: accessCode.trim()
      });

      const result = await response.json();

      if (result.success) {
        const sessionData: TestSession = {
          token: result.token,
          email: email.trim(),
          expiresAt: result.expiresAt,
          // n8n Integration from API response
          n8nWebhookUrl: result.n8nWebhookUrl,
          n8nBotName: result.n8nBotName,
          n8nBotGreeting: result.n8nBotGreeting
        };
        
        setSession(sessionData);
        setIsAuthorized(true);
        
        // Save session to localStorage
        localStorage.setItem('test-session', JSON.stringify(sessionData));
        
        toast({
          title: "🎉 Zugang gewährt!",
          description: "Sie können jetzt den Chatbot testen.",
        });
      }
    } catch (error: any) {
      const errorMessage = error?.message || "Ungültiger Code oder Email. Bitte kontaktieren Sie Zoë's KI Service für einen gültigen Testzugang.";
      setAuthError(errorMessage);
      
      toast({
        title: "❌ Zugang verweigert",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleLogout = () => {
    setSession(null);
    setIsAuthorized(false);
    setEmail("");
    setAccessCode("");
    setAuthError("");
    localStorage.removeItem('test-session');
    
    toast({
      title: "Abgemeldet",
      description: "Sie wurden erfolgreich abgemeldet.",
    });
  };

  return (
    <>
      <SEOHelmet 
        title="KI-Assistent Testbereich – Zoë's KI Service"
        description="Testen Sie Ihren persönlichen KI-Assistenten und passen Sie ihn an Ihre Bedürfnisse an"
      />
      
      <Navigation />
      
      <main className="min-h-screen pt-20">
        {/* Intro-Hero */}
        <section className="hero-gradient py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Wir bieten full Service- Sie können sich hier gern inspirieren lassen.
            </h1>
            <p className="text-xl text-white/90 mb-6">
              Sie können alles uns überlassen. Oder nach Auftragsvergabe Ihr neues Teammitglied selbst gestalten. Wählen Sie Farben, Schrift, Begrüßungstext und – für die Voice-Variante – die Stimme. 
              
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-8 border border-white/20">
              <p className="text-white/95 text-sm">
                <strong>💡 Hinweis:</strong> Alle gezeigten Anpassungen sind Beispiele. Nach unserem Gespräch können wir weitere individuelle Anpassungen problemlos umsetzen – von erweiterten Funktionen bis hin zu speziellen Design-Anforderungen.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white/80 text-sm max-w-2xl mx-auto">
              <div>✨ Live-Vorschau</div>
              <div>🎨 Design anpassen</div>
              <div>🗣️ Stimme testen</div>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          
          {/* Login Card - immer sichtbar */}
          <Card className="glass max-w-lg mx-auto mb-8 relative z-20 border-2 border-primary/20 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-4 text-primary">🔐 Testbereich-Anmeldung</CardTitle>
              <p className="text-foreground mb-4 font-medium">
                Diese Testumgebung ist öffentlich sichtbar. Einstellungen und Tests sind erst nach Login mit Ihrem Testcode möglich.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {authError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{authError}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-2">Testcode eingeben</label>
                <Input 
                  type="text"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="Testcode hier eingeben"
                  data-testid="access-code-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">E-Mail eingeben</label>
                <Input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ihre@email.de"
                  data-testid="email-input"
                />
              </div>
              
              {!isAuthorized ? (
                <Button 
                  onClick={handleAccessRequest}
                  disabled={!email || !accessCode || isValidating}
                  className="w-full button-gradient"
                  data-testid="unlock-chatbot"
                >
                  {isValidating ? "Wird geprüft..." : "🤖 Zugang freischalten"}
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-green-700 font-medium">✅ Zugang freigeschaltet!</p>
                    <p className="text-sm text-green-600 mt-1">Sie können jetzt alle Funktionen testen.</p>
                  </div>
                  <Button 
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full"
                    data-testid="logout-button"
                  >
                    🔒 Abmelden
                  </Button>
                </div>
              )}
              
              {/* Honeypot field - hidden */}
              <input
                type="text"
                name="website"
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />
              
              <div className="space-y-3">
                <div className="p-3 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                  <p className="text-sm text-amber-700">
                    <strong>Zum Schutz vor Missbrauch setzen wir eine kurze Sicherheitsprüfung ein.</strong> Nach erfolgreichem Login werden alle Funktionen freigeschaltet.
                  </p>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <p className="text-sm text-blue-700">
                    <strong>Das Training des Chatbots erfolgt durch uns nach Testcode-Vergabe.</strong>
                  </p>
                </div>
                
              </div>
            </CardContent>
          </Card>
          
          {/* Subtle Teasing Overlay für nicht-eingeloggte Benutzer */}
          {!isAuthorized && showOverlay && (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 backdrop-blur-[1px] z-10 rounded-lg">
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-foreground p-6 max-w-sm bg-background/70 rounded-xl border border-primary/20 shadow-md">
                  <div className="mb-4 text-5xl">✨</div>
                  <h3 className="text-xl font-bold mb-3 text-primary">Ihr KI-Assistent wartet</h3>
                  <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                    Mit Ihrem persönlichen Testcode können Sie alle Einstellungen live ausprobieren und Ihren perfekten KI-Assistenten konfigurieren.
                  </p>
                  <Button 
                    onClick={() => setShowOverlay(false)}
                    className="button-gradient px-6 py-2"
                    size="default"
                  >
                    🚀 Jetzt einloggen
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Konfiguration */}
            <div className="lg:col-span-1">
              <Card className="glass sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    🎛️ Live-Anpassungen
                    <Button variant="outline" size="sm" onClick={resetConfig}>
                      Reset
                    </Button>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Sehen Sie sofort, wie Ihre Änderungen wirken
                  </p>
                </CardHeader>
                <fieldset disabled={!isAuthorized} className={!isAuthorized ? 'opacity-50' : ''}>
                <CardContent className="space-y-6">
                  
                  {/* Bot Type Switcher */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Bot-Typ</label>
                    <Select value={testConfig.activeBot} onValueChange={(value: any) => handleActiveBotChange(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Bot-Typ wählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chatbot">💬 Chatbot</SelectItem>
                        <SelectItem value="voicebot">🎤 Voicebot</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Bot Name with Suggestions */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Bot-Name</label>
                    <div className="space-y-2">
                      <Input
                        value={testConfig.activeBot === "chatbot" ? testConfig.chatbot.name : testConfig.voicebot.name}
                        onChange={(e) => {
                          if (testConfig.activeBot === "chatbot") {
                            handleChatbotConfigChange("name", e.target.value);
                          } else {
                            handleVoicebotConfigChange("name", e.target.value);
                          }
                        }}
                        placeholder="Bot-Name eingeben"
                      />
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-muted-foreground mr-2">Vorschläge:</span>
                        {generateNameSuggestions(testConfig.activeBot).slice(0, 4).map((name) => (
                          <Badge 
                            key={name}
                            variant="outline" 
                            className="cursor-pointer text-xs hover:bg-primary hover:text-primary-foreground"
                            onClick={() => {
                              if (testConfig.activeBot === "chatbot") {
                                handleChatbotConfigChange("name", name);
                              } else {
                                handleVoicebotConfigChange("name", name);
                              }
                            }}
                          >
                            {name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Primary Color */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Primärfarbe</label>
                    <Input
                      type="color"
                      value={testConfig.activeBot === "chatbot" ? testConfig.chatbot.primaryColor : testConfig.voicebot.primaryColor}
                      onChange={(e) => {
                        if (testConfig.activeBot === "chatbot") {
                          handleChatbotConfigChange("primaryColor", e.target.value);
                        } else {
                          handleVoicebotConfigChange("primaryColor", e.target.value);
                        }
                      }}
                    />
                  </div>

                  {/* Position */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Position</label>
                    <Select 
                      value={testConfig.activeBot === "chatbot" ? testConfig.chatbot.position : testConfig.voicebot.position} 
                      onValueChange={(value: any) => {
                        if (testConfig.activeBot === "chatbot") {
                          handleChatbotConfigChange("position", value);
                        } else {
                          handleVoicebotConfigChange("position", value);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Position wählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bottom-right">Unten rechts</SelectItem>
                        <SelectItem value="bottom-left">Unten links</SelectItem>
                        <SelectItem value="center">Zentral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Widget Size */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Widget-Größe</label>
                    <Select 
                      value={testConfig.activeBot === "chatbot" ? testConfig.chatbot.widgetSize : testConfig.voicebot.widgetSize} 
                      onValueChange={(value: any) => {
                        if (testConfig.activeBot === "chatbot") {
                          handleChatbotConfigChange("widgetSize", value);
                        } else {
                          handleVoicebotConfigChange("widgetSize", value);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Größe wählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Klein</SelectItem>
                        <SelectItem value="medium">Mittel</SelectItem>
                        <SelectItem value="large">Groß</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Voice Speed - Only for Voicebot */}
                  {testConfig.activeBot === "voicebot" && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Sprachgeschwindigkeit: {testConfig.voicebot.voiceSpeed[0]}x
                      </label>
                      <Slider
                        value={testConfig.voicebot.voiceSpeed}
                        onValueChange={(value) => handleVoicebotConfigChange("voiceSpeed", value)}
                        max={2}
                        min={0.5}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                  )}

                  {/* Voice Pitch - Only for Voicebot */}
                  {testConfig.activeBot === "voicebot" && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Stimmlage: {testConfig.voicebot.voicePitch[0]}x
                      </label>
                      <Slider
                        value={testConfig.voicebot.voicePitch}
                        onValueChange={(value) => handleVoicebotConfigChange("voicePitch", value)}
                        max={2}
                        min={0.5}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                  )}

                  {/* Voice Selection - Only for Voicebot */}
                  {testConfig.activeBot === "voicebot" && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Stimme auswählen</label>
                      <Select 
                        value={testConfig.voicebot.elevenLabsVoiceId} 
                        onValueChange={(value) => {
                          const selectedVoice = availableVoices.find(v => v.id === value);
                          handleVoicebotConfigChange("elevenLabsVoiceId", value);
                          handleVoicebotConfigChange("elevenLabsVoiceName", selectedVoice?.name || "Voice auswählen...");
                        }}
                        data-testid="select-voice"
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={isLoadingVoices ? "Lade Stimmen..." : testConfig.voicebot.elevenLabsVoiceName} />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingVoices ? (
                            <SelectItem value="" disabled>Lade Stimmen...</SelectItem>
                          ) : availableVoices.length > 0 ? (
                            availableVoices.map((voice) => (
                              <SelectItem key={voice.id} value={voice.id}>
                                <div className="flex items-center gap-2">
                                  <span>{voice.name}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {voice.labels?.gender || 'unbekannt'}
                                  </Badge>
                                  {voice.labels?.language && (
                                    <Badge variant="secondary" className="text-xs">
                                      {voice.labels.language}
                                    </Badge>
                                  )}
                                </div>
                              </SelectItem>
                            ))
                          ) : (
                            <>
                              <SelectItem value="" disabled>Keine Stimmen verfügbar</SelectItem>
                              <div className="px-3 py-2 text-xs text-muted-foreground">
                                <p>Bitte überprüfen Sie Ihre ElevenLabs API-Konfiguration</p>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={loadAvailableVoices}
                                  className="mt-1 h-6 px-2 text-xs"
                                >
                                  Erneut versuchen
                                </Button>
                              </div>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Voice Stability - Only for Voicebot */}
                  {testConfig.activeBot === "voicebot" && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Stimmstabilität: {(testConfig.voicebot.stability * 100).toFixed(0)}%
                      </label>
                      <Slider
                        value={[testConfig.voicebot.stability]}
                        onValueChange={(value) => handleVoicebotConfigChange("stability", value[0])}
                        max={1}
                        min={0}
                        step={0.01}
                        className="w-full"
                        data-testid="slider-stability"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Niedrig = ausdrucksvoller, Hoch = gleichmäßiger
                      </p>
                    </div>
                  )}

                  {/* Voice Similarity - Only for Voicebot */}
                  {testConfig.activeBot === "voicebot" && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Stimmähnlichkeit: {(testConfig.voicebot.similarity * 100).toFixed(0)}%
                      </label>
                      <Slider
                        value={[testConfig.voicebot.similarity]}
                        onValueChange={(value) => handleVoicebotConfigChange("similarity", value[0])}
                        max={1}
                        min={0}
                        step={0.01}
                        className="w-full"
                        data-testid="slider-similarity"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Wie nah die Stimme am Original bleiben soll
                      </p>
                    </div>
                  )}

                  {/* Speaker Boost - Only for Voicebot */}
                  {testConfig.activeBot === "voicebot" && (
                    <div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={testConfig.voicebot.speakerBoost}
                          onChange={(e) => handleVoicebotConfigChange("speakerBoost", e.target.checked)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                          data-testid="checkbox-speaker-boost"
                        />
                        <span className="text-sm font-medium">Speaker Boost aktivieren</span>
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Verbessert die Stimmqualität, braucht mehr Rechenzeit
                      </p>
                    </div>
                  )}

                  {/* Save Voice Settings - Only for Voicebot */}
                  {testConfig.activeBot === "voicebot" && (
                    <div className="pt-4 border-t">
                      <Button 
                        onClick={saveVoicePreferences}
                        disabled={isSavingPreferences || !testConfig.voicebot.elevenLabsVoiceId}
                        className="w-full"
                        variant="outline"
                        data-testid="button-save-voice-settings"
                      >
                        <Volume2 className="w-4 h-4 mr-2" />
                        {isSavingPreferences ? "Speichere..." : "Voice-Einstellungen speichern"}
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        {!testConfig.voicebot.elevenLabsVoiceId ? 
                          "Wählen Sie zuerst eine Stimme aus" : 
                          "Ihre Stimm-Präferenzen werden für diese Session gespeichert"
                        }
                      </p>
                    </div>
                  )}

                  {/* Background Color - Only for Chatbot */}
                  {testConfig.activeBot === "chatbot" && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Hintergrundfarbe</label>
                      <Input
                        type="color"
                        value={testConfig.chatbot.backgroundColor}
                        onChange={(e) => handleChatbotConfigChange("backgroundColor", e.target.value)}
                      />
                    </div>
                  )}

                  {/* Text Color - Only for Chatbot */}
                  {testConfig.activeBot === "chatbot" && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Textfarbe</label>
                      <Input
                        type="color"
                        value={testConfig.chatbot.textColor}
                        onChange={(e) => handleChatbotConfigChange("textColor", e.target.value)}
                      />
                    </div>
                  )}

                  {/* Font Family - Only for Chatbot */}
                  {testConfig.activeBot === "chatbot" && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Schriftart</label>
                      <Select value={testConfig.chatbot.fontFamily} onValueChange={(value: any) => handleChatbotConfigChange("fontFamily", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Schriftart wählen" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* Sans-Serif Gruppe */}
                          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-b">Sans-Serif</div>
                          {fontOptions.filter(font => font.category === "Sans-Serif").map((font) => (
                            <SelectItem key={font.value} value={font.value}>
                              <span style={{ fontFamily: font.value }}>{font.name}</span>
                            </SelectItem>
                          ))}
                          
                          {/* Serif Gruppe */}
                          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-b border-t">Serif</div>
                          {fontOptions.filter(font => font.category === "Serif").map((font) => (
                            <SelectItem key={font.value} value={font.value}>
                              <span style={{ fontFamily: font.value }}>{font.name}</span>
                            </SelectItem>
                          ))}
                          
                          {/* Schreibschrift Gruppe */}
                          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-b border-t">Schreibschrift</div>
                          {fontOptions.filter(font => font.category === "Schreibschrift").map((font) => (
                            <SelectItem key={font.value} value={font.value}>
                              <span style={{ fontFamily: font.value }}>{font.name}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Titel</label>
                    <Input
                      value={testConfig.activeBot === "chatbot" ? testConfig.chatbot.title : testConfig.voicebot.title}
                      onChange={(e) => {
                        if (testConfig.activeBot === "chatbot") {
                          handleChatbotConfigChange("title", e.target.value);
                        } else {
                          handleVoicebotConfigChange("title", e.target.value);
                        }
                      }}
                      placeholder="z.B. Willkommen!"
                      data-testid="input-bot-title"
                    />
                  </div>

                  {/* Subtitle */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Untertitel</label>
                    <Input
                      value={testConfig.activeBot === "chatbot" ? testConfig.chatbot.subtitle : testConfig.voicebot.subtitle}
                      onChange={(e) => {
                        if (testConfig.activeBot === "chatbot") {
                          handleChatbotConfigChange("subtitle", e.target.value);
                        } else {
                          handleVoicebotConfigChange("subtitle", e.target.value);
                        }
                      }}
                      placeholder="z.B. Ich helfe Ihnen gerne weiter"
                      data-testid="input-bot-subtitle"
                    />
                  </div>

                  {/* Logo Upload */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Firmenlogo (optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const logoUrl = event.target?.result as string;
                            if (testConfig.activeBot === "chatbot") {
                              setTestConfig(prev => ({ ...prev, chatbot: { ...prev.chatbot, logoUrl } }));
                            } else {
                              setTestConfig(prev => ({ ...prev, voicebot: { ...prev.voicebot, logoUrl } }));
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      data-testid="input-logo"
                    />
                    {(testConfig.activeBot === "chatbot" ? testConfig.chatbot.logoUrl : testConfig.voicebot.logoUrl) && (
                      <div className="mt-2">
                        <img 
                          src={testConfig.activeBot === "chatbot" ? testConfig.chatbot.logoUrl : testConfig.voicebot.logoUrl}
                          alt="Logo Vorschau"
                          className="h-12 w-auto border rounded"
                        />
                      </div>
                    )}
                  </div>

                  {/* Logo Position */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Logo Position
                    </label>
                    <Select 
                      value={testConfig.activeBot === "chatbot" ? testConfig.chatbot.logoPosition : testConfig.voicebot.logoPosition}
                      onValueChange={(value) => {
                        if (testConfig.activeBot === "chatbot") {
                          setTestConfig(prev => ({ ...prev, chatbot: { ...prev.chatbot, logoPosition: value } }));
                        } else {
                          setTestConfig(prev => ({ ...prev, voicebot: { ...prev.voicebot, logoPosition: value } }));
                        }
                      }}
                      data-testid="select-logo-position"
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="top-left">Oben Links</SelectItem>
                        <SelectItem value="top-right">Oben Rechts</SelectItem>
                        <SelectItem value="top-center">Oben Mitte</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Logo Size */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Logo Größe
                    </label>
                    <Select 
                      value={testConfig.activeBot === "chatbot" ? testConfig.chatbot.logoSize : testConfig.voicebot.logoSize}
                      onValueChange={(value) => {
                        if (testConfig.activeBot === "chatbot") {
                          setTestConfig(prev => ({ ...prev, chatbot: { ...prev.chatbot, logoSize: value } }));
                        } else {
                          setTestConfig(prev => ({ ...prev, voicebot: { ...prev.voicebot, logoSize: value } }));
                        }
                      }}
                      data-testid="select-logo-size"
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Klein (24px)</SelectItem>
                        <SelectItem value="medium">Mittel (32px)</SelectItem>
                        <SelectItem value="large">Groß (48px)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Custom Greeting */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Begrüßungstext</label>
                    <textarea
                      value={testConfig.activeBot === "chatbot" ? testConfig.chatbot.greeting : testConfig.voicebot.greeting}
                      onChange={(e) => {
                        if (testConfig.activeBot === "chatbot") {
                          handleChatbotConfigChange("greeting", e.target.value);
                        } else {
                          handleVoicebotConfigChange("greeting", e.target.value);
                        }
                      }}
                      className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      rows={3}
                      placeholder="Ihre persönliche Begrüßung..."
                    />
                  </div>

                  {/* Test & Save Buttons */}
                  <div className="pt-6 border-t border-border/50 space-y-3">
                    {isAuthorized ? (
                      <Button 
                        onClick={() => setIsChatOpen(true)}
                        className="w-full bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 text-white font-semibold py-3 text-lg shadow-lg"
                        size="lg"
                        data-testid="button-test-bot"
                      >
                        🤖 {testConfig.activeBot === "chatbot" ? "Chatbot" : "Voicebot"} testen
                      </Button>
                    ) : (
                      <Button 
                        disabled
                        className="w-full opacity-50 cursor-not-allowed"
                        size="lg"
                      >
                        🔒 Anmeldung erforderlich
                      </Button>
                    )}

                    <Button
                      onClick={async () => {
                        if (!session) {
                          toast({
                            title: "❌ Fehler",
                            description: "Keine gültige Session gefunden. Bitte loggen Sie sich erneut ein.",
                            variant: "destructive"
                          });
                          return;
                        }

                        try {
                          setIsValidating(true);
                          
                          const response = await apiRequest('POST', '/api/test-config', {
                            email: session.email,
                            sessionToken: session.token,
                            config: testConfig
                          });

                          const data = await response.json();

                          if (response.ok && data.success) {
                            toast({
                              title: "✅ Konfiguration gespeichert!",
                              description: `Ihre Einstellungen wurden erfolgreich übermittelt. Referenz: ${data.referenceId}. Sie erhalten eine Zusammenfassung per E-Mail.`,
                            });
                          } else {
                            throw new Error(data.message || 'Unbekannter Fehler');
                          }
                        } catch (error) {
                          console.error('Config save error:', error);
                          toast({
                            title: "❌ Speichern fehlgeschlagen",
                            description: "Es gab einen Fehler beim Speichern Ihrer Konfiguration. Bitte versuchen Sie es erneut.",
                            variant: "destructive"
                          });
                        } finally {
                          setIsValidating(false);
                        }
                      }}
                      disabled={!isAuthorized || isValidating}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-2 shadow-md disabled:opacity-50"
                      size="default"
                      data-testid="button-save-config"
                    >
                      {isValidating ? "💾 Wird gespeichert..." : "💾 Konfiguration speichern & abschicken"}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Sie erhalten eine detaillierte Zusammenfassung per E-Mail
                    </p>
                  </div>

                </CardContent>
                </fieldset>
              </Card>
            </div>

            {/* Live Preview */}
            <div className="lg:col-span-2">
              <Card className="glass">
                <CardHeader>
                  <CardTitle>📱 Live-Vorschau</CardTitle>
                  <p className="text-muted-foreground">
                    So wird Ihr Chatbot auf der Website erscheinen:
                  </p>
                </CardHeader>
                <CardContent className={`min-h-[300px] relative ${!isAuthorized ? 'opacity-50' : ''}`}>
                  <div 
                    className={`
                      p-4 rounded-lg border-2 border-dashed border-muted-foreground/30 min-h-[250px] relative overflow-hidden bg-white
                    `}
                  >
                    <div className="text-center text-muted-foreground py-12">
                      <p className="mb-4">TEST-Bot Vorschau</p>
                      <p className="text-sm">Klicken Sie auf die Bubble um Ihren {testConfig.activeBot === "chatbot" ? "Chatbot" : "Voicebot"} zu testen.</p>
                      
                      {/* Simulierter Bot Button */}
                      <div 
                        className={`
                          fixed rounded-full w-16 h-16 flex items-center justify-center text-white font-bold text-xl shadow-lg cursor-pointer z-10
                          ${(testConfig.activeBot === "chatbot" ? testConfig.chatbot.position : testConfig.voicebot.position) === 'bottom-right' ? 'bottom-4 right-4' : 
                            (testConfig.activeBot === "chatbot" ? testConfig.chatbot.position : testConfig.voicebot.position) === 'bottom-left' ? 'bottom-4 left-4' : 
                            'bottom-4 left-1/2 transform -translate-x-1/2'}
                        `}
                        style={{
                          backgroundColor: testConfig.activeBot === "chatbot" ? testConfig.chatbot.primaryColor : testConfig.voicebot.primaryColor
                        }}
                        onClick={() => isAuthorized && setIsChatOpen(true)}
                      >
                        {testConfig.activeBot === "chatbot" ? "💬" : "🎤"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Configuration Overview */}
              <Card className="glass mt-6">
                <CardHeader>
                  <CardTitle>📊 Konfiguration im Überblick</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Bot-Typ:</span>
                      <p className="font-medium">{testConfig.activeBot === "chatbot" ? "💬 Chatbot" : "🎤 Voicebot"}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Name:</span>
                      <p className="font-medium">{testConfig.activeBot === "chatbot" ? testConfig.chatbot.name : testConfig.voicebot.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Titel:</span>
                      <p className="font-medium">{testConfig.activeBot === "chatbot" ? testConfig.chatbot.title : testConfig.voicebot.title}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Untertitel:</span>
                      <p className="font-medium">{testConfig.activeBot === "chatbot" ? testConfig.chatbot.subtitle : testConfig.voicebot.subtitle}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Position:</span>
                      <p className="font-medium">{testConfig.activeBot === "chatbot" ? testConfig.chatbot.position : testConfig.voicebot.position}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Widget-Größe:</span>
                      <p className="font-medium">{testConfig.activeBot === "chatbot" ? testConfig.chatbot.widgetSize : testConfig.voicebot.widgetSize}</p>
                    </div>
                    {testConfig.activeBot === "voicebot" && (
                      <>
                        <div>
                          <span className="text-sm text-muted-foreground">Sprachgeschwindigkeit:</span>
                          <p className="font-medium">{testConfig.voicebot.voiceSpeed[0]}x</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Stimmlage:</span>
                          <p className="font-medium">{testConfig.voicebot.voicePitch[0]}x</p>
                        </div>
                      </>
                    )}
                    {testConfig.activeBot === "chatbot" && (
                      <>
                        <div>
                          <span className="text-sm text-muted-foreground">Schriftart:</span>
                          <p className="font-medium">{testConfig.chatbot.fontFamily}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Hintergrundfarbe:</span>
                          <div className="flex items-center gap-2 mt-1">
                            <div 
                              className="w-4 h-4 rounded border" 
                              style={{ backgroundColor: testConfig.chatbot.backgroundColor }}
                            ></div>
                            <p className="font-medium text-sm">{testConfig.chatbot.backgroundColor}</p>
                          </div>
                        </div>
                      </>
                    )}
                    {testConfig.activeBot === "voicebot" && testConfig.voicebot.elevenLabsVoiceId && (
                      <div>
                        <span className="text-sm text-muted-foreground">ElevenLabs Voice ID:</span>
                        <p className="font-medium">{testConfig.voicebot.elevenLabsVoiceId || "Nicht gesetzt"}</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <span className="text-sm text-muted-foreground">Primärfarbe:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div 
                        className="w-4 h-4 rounded border" 
                        style={{ backgroundColor: testConfig.activeBot === "chatbot" ? testConfig.chatbot.primaryColor : testConfig.voicebot.primaryColor }}
                      ></div>
                      <p className="font-medium text-sm">{testConfig.activeBot === "chatbot" ? testConfig.chatbot.primaryColor : testConfig.voicebot.primaryColor}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-sm text-muted-foreground">Begrüßung:</span>
                    <p className="font-medium mt-1 p-2 bg-muted rounded text-sm">{testConfig.activeBot === "chatbot" ? testConfig.chatbot.greeting : testConfig.voicebot.greeting}</p>
                  </div>
                  
                  {/* Logo Einstellungen */}
                  {(testConfig.activeBot === "chatbot" ? testConfig.chatbot.logoUrl : testConfig.voicebot.logoUrl) && (
                    <div className="mt-4">
                      <span className="text-sm text-muted-foreground">Logo:</span>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center gap-3">
                          <img 
                            src={testConfig.activeBot === "chatbot" ? testConfig.chatbot.logoUrl : testConfig.voicebot.logoUrl}
                            alt="Firmenlogo Vorschau"
                            className="h-8 w-auto border rounded"
                          />
                          <div className="text-sm">
                            <div>Position: {testConfig.activeBot === "chatbot" ? testConfig.chatbot.logoPosition : testConfig.voicebot.logoPosition}</div>
                            <div>Größe: {testConfig.activeBot === "chatbot" ? testConfig.chatbot.logoSize : testConfig.voicebot.logoSize}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Content-Lieferungs-Hinweis */}
          <section className="mt-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <Card className="glass">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-4 text-primary">
                    📄 Wichtiger Hinweis zur inhaltlichen Befüllung
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Die fachlichen Inhalte (z. B. FAQs, Produktinfos, Prozesse, Dokumente) stellen Sie uns separat bereit. 
                    Das Training der KI erfolgt durch uns und getrennt von Design & Stimme.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>

      {/* TEST-Chatbot Widget */}
      {isChatOpen && (
        <TestChatbot
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          authToken={session?.token}
          config={testConfig}
          n8nWebhookUrl={session?.n8nWebhookUrl}
          n8nBotName={session?.n8nBotName}
          n8nBotGreeting={session?.n8nBotGreeting}
        />
      )}
      
      <Footer />
    </>
  );
}