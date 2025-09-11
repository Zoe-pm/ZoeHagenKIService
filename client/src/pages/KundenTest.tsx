import { useState, useEffect } from "react";
import SEOHelmet from "@/components/SEOHelmet";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SimpleChatbot } from "@/components/SimpleChatbot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ChatbotConfig {
  name: string;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  widgetSize: "small" | "medium" | "large";
  fontFamily: string;
  position: "bottom-right" | "bottom-left" | "center";
  greeting: string;
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
  greeting: string;
}

interface TestConfig {
  activeBot: "chatbot" | "voicebot";
  chatbot: ChatbotConfig;
  voicebot: VoicebotConfig;
}

interface TestSession {
  token: string;
  email: string;
  expiresAt: string;
}

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
      name: "KI-Assistent",
      primaryColor: "#3B82F6",
      backgroundColor: "#FFFFFF",
      textColor: "#1F2937",
      widgetSize: "medium",
      fontFamily: "Inter",
      position: "bottom-right",
      greeting: "Hallo! Wie kann ich Ihnen heute helfen?"
    },
    voicebot: {
      name: "Juna",
      primaryColor: "#10B981",
      backgroundColor: "#F3F4F6",
      widgetSize: "medium",
      position: "bottom-right",
      voiceSpeed: [1],
      voicePitch: [1],
      elevenLabsVoiceId: "",
      greeting: "Hallo! Ich bin Juna, Ihr Sprach-Assistent."
    }
  });
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
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

  // Auto-hide overlay when authorized
  useEffect(() => {
    if (isAuthorized) {
      setShowOverlay(false);
    }
  }, [isAuthorized]);

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
            expiresAt: data.expiresAt
          };
          setSession(sessionData);
          setIsAuthorized(true);
          setEmail(data.email);
        }
      } else {
        localStorage.removeItem('test-session');
      }
    } catch (error) {
      console.error('Session validation error:', error);
      localStorage.removeItem('test-session');
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
        name: "KI-Assistent",
        primaryColor: "#3B82F6",
        backgroundColor: "#FFFFFF",
        textColor: "#1F2937",
        widgetSize: "medium",
        fontFamily: "Inter",
        position: "bottom-right",
        greeting: "Hallo! Wie kann ich Ihnen heute helfen?"
      },
      voicebot: {
        name: "Juna",
        primaryColor: "#10B981",
        backgroundColor: "#F3F4F6",
        widgetSize: "medium",
        position: "bottom-right",
        voiceSpeed: [1],
        voicePitch: [1],
        elevenLabsVoiceId: "",
        greeting: "Hallo! Ich bin Juna, Ihr Sprach-Assistent."
      }
    });
  };

  const generateNameSuggestions = (type: "chatbot" | "voicebot") => {
    const chatbotNames = ["Alex", "Max", "Luna", "Nova", "Kai", "Zoe", "Sam", "Rio"];
    const voicebotNames = ["Juna", "Aria", "Echo", "Sage", "Vale", "Nova", "Zara", "Mira"];
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
          expiresAt: result.expiresAt
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
      const errorMessage = error?.message || "Ungültiger Code oder Email. Bitte kontaktieren Sie Zoë's KI Studio für einen gültigen Testzugang.";
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
        title="KI-Assistent Testbereich – Zoë's KI Studio"
        description="Testen Sie Ihren persönlichen KI-Assistenten und passen Sie ihn an Ihre Bedürfnisse an"
      />
      
      <Navigation />
      
      <main className="min-h-screen pt-20">
        {/* Intro-Hero */}
        <section className="hero-gradient py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Hier testen Sie Ihr digitales neues Teammitglied
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Hier konfigurieren Sie Ihr digitales neues Teammitglied. Wählen Sie Farben, Schrift, Begrüßungstext und – für die Voice-Variante – die Stimme. Änderungen sehen Sie live in der Vorschau. Mit „Speichern & Bestätigen" erhalten Sie eine Zusammenfassung per E-Mail.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white/80 text-sm max-w-2xl mx-auto">
              <div>✨ Live-Vorschau</div>
              <div>🎨 Design anpassen</div>
              <div>🗣️ Stimme testen</div>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          
          {/* Login Card - immer sichtbar */}
          <Card className="glass max-w-lg mx-auto mb-8 relative z-20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-4">🔓 Anmeldung erforderlich</CardTitle>
              <p className="text-muted-foreground mb-4">
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
                    <strong>Ihren Testcode erhalten Sie nach Auftragsvergabe.</strong>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Overlay für nicht-eingeloggte Benutzer */}
          {!isAuthorized && showOverlay && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 rounded-lg">
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-white p-8 max-w-md">
                  <div className="mb-4 text-6xl">🔒</div>
                  <h3 className="text-xl font-bold mb-4">Anmeldung erforderlich</h3>
                  <p className="text-white/90 mb-6">
                    Diese Testumgebung ist öffentlich sichtbar. Einstellungen und Tests sind erst nach Login mit Ihrem Testcode möglich.
                  </p>
                  <Button 
                    onClick={() => setShowOverlay(false)}
                    className="button-gradient"
                  >
                    Anmeldung anzeigen
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

                  {/* ElevenLabs Voice ID - Only for Voicebot */}
                  {testConfig.activeBot === "voicebot" && (
                    <div>
                      <label className="block text-sm font-medium mb-2">ElevenLabs Voice ID</label>
                      <Input
                        value={testConfig.voicebot.elevenLabsVoiceId}
                        onChange={(e) => handleVoicebotConfigChange("elevenLabsVoiceId", e.target.value)}
                        placeholder="Voice ID hier eingeben (wird noch geliefert)"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Die Voice ID erhalten Sie nach der Einrichtung von ElevenLabs
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
                          <SelectItem value="Inter">Inter</SelectItem>
                          <SelectItem value="Arial">Arial</SelectItem>
                          <SelectItem value="Helvetica">Helvetica</SelectItem>
                          <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

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

                  {isAuthorized ? (
                    <Button 
                      onClick={() => setIsChatOpen(true)}
                      className="w-full button-gradient"
                      size="lg"
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
                <CardContent className={`min-h-[500px] relative ${!isAuthorized ? 'opacity-50' : ''}`}>
                  <div 
                    className={`
                      p-4 rounded-lg border-2 border-dashed border-muted-foreground/30 min-h-[400px] relative overflow-hidden bg-white
                    `}
                  >
                    <div className="text-center text-muted-foreground py-20">
                      <p className="mb-4">Ihre Website-Vorschau</p>
                      <p className="text-sm">Der Chatbot erscheint je nach Position unten rechts, links oder zentral.</p>
                      
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
                      <div>
                        <span className="text-sm text-muted-foreground">Schriftart:</span>
                        <p className="font-medium">{testConfig.chatbot.fontFamily}</p>
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
                    Nach Bestätigung erhalten Sie automatisch eine E-Mail mit sicheren Upload-Optionen und einer Vorlage, 
                    welche Informationen wir benötigen. Die inhaltliche Befüllung erfolgt getrennt von Design & Stimme.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>

      {/* Chatbot Widget */}
      {isChatOpen && (
        <SimpleChatbot
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          authToken={session?.token}
        />
      )}
      
      <Footer />
    </>
  );
}