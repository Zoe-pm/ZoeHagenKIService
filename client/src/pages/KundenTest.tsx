import { useState, useEffect } from "react";
import SEOHelmet from "@/components/SEOHelmet";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SimpleChatbot } from "@/components/SimpleChatbot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface TestConfig {
  theme: "light" | "dark" | "blue" | "green";
  position: "bottom-right" | "bottom-left" | "center";
  voiceSpeed: number[];
  voicePitch: number[];
  greeting: string;
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
    theme: "blue",
    position: "bottom-right",
    voiceSpeed: [1],
    voicePitch: [1],
    greeting: "Hallo! Wie kann ich Ihnen heute helfen?"
  });
  const [isChatOpen, setIsChatOpen] = useState(false);
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

  const handleConfigChange = (key: keyof TestConfig, value: any) => {
    setTestConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetConfig = () => {
    setTestConfig({
      theme: "blue",
      position: "bottom-right", 
      voiceSpeed: [1],
      voicePitch: [1],
      greeting: "Hallo! Wie kann ich Ihnen heute helfen?"
    });
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
              🚀 Ihr KI-Assistent wartet auf Sie
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Entdecken Sie, wie Ihr persönlicher Chatbot aussehen und klingen wird. 
              Testen Sie verschiedene Designs, Stimmen und Begrüßungen – 
              <span className="font-semibold"> alles live und interaktiv!</span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white/80 text-sm max-w-2xl mx-auto">
              <div>✨ Live-Vorschau</div>
              <div>🎨 Design anpassen</div>
              <div>🗣️ Stimme testen</div>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {!isAuthorized ? (
            /* Authentifizierung für Chatbot-Zugang */
            <Card className="glass max-w-lg mx-auto mb-8">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-4">🔓 Chatbot freischalten</CardTitle>
                <p className="text-muted-foreground">
                  Sie können alle Einstellungen sehen und anpassen. 
                  Für den Chat benötigen Sie einen Testcode.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {authError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{authError}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-2">Email-Adresse</label>
                  <Input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ihre@email.de"
                    data-testid="email-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Testcode</label>
                  <Input 
                    type="text"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    placeholder="ZKS-DEMO-2024"
                    data-testid="access-code-input"
                  />
                </div>
                <Button 
                  onClick={handleAccessRequest}
                  disabled={!email || !accessCode || isValidating}
                  className="w-full button-gradient"
                  data-testid="unlock-chatbot"
                >
                  {isValidating ? "Wird geprüft..." : "🤖 Chatbot freischalten"}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Noch keinen Testcode? <a href="/kontakt" className="text-primary hover:underline">Jetzt anfordern</a>
                </p>
              </CardContent>
            </Card>
          ) : (
            /* Authentifiziert - Zeige Logout Option */
            <Card className="glass max-w-lg mx-auto mb-8">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-4">✅ Zugang gewährt</CardTitle>
                <p className="text-muted-foreground">
                  Sie sind als {session?.email} angemeldet und können den Chatbot testen.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full"
                  data-testid="logout-button"
                >
                  🔒 Abmelden
                </Button>
              </CardContent>
            </Card>
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
                <CardContent className="space-y-6">
                  
                  {/* Design Theme */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Design-Theme</label>
                    <Select value={testConfig.theme} onValueChange={(value: any) => handleConfigChange('theme', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Theme wählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Hell</SelectItem>
                        <SelectItem value="dark">Dunkel</SelectItem>
                        <SelectItem value="blue">Blau (Standard)</SelectItem>
                        <SelectItem value="green">Grün</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Position */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Position</label>
                    <Select value={testConfig.position} onValueChange={(value: any) => handleConfigChange('position', value)}>
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

                  {/* Voice Speed */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Sprachgeschwindigkeit: {testConfig.voiceSpeed[0]}x
                    </label>
                    <Slider
                      value={testConfig.voiceSpeed}
                      onValueChange={(value) => handleConfigChange('voiceSpeed', value)}
                      max={2}
                      min={0.5}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  {/* Voice Pitch */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Stimmlage: {testConfig.voicePitch[0]}x
                    </label>
                    <Slider
                      value={testConfig.voicePitch}
                      onValueChange={(value) => handleConfigChange('voicePitch', value)}
                      max={2}
                      min={0.5}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  {/* Custom Greeting */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Begrüßungstext</label>
                    <textarea
                      value={testConfig.greeting}
                      onChange={(e) => handleConfigChange('greeting', e.target.value)}
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
                      🤖 Chatbot testen
                    </Button>
                  ) : (
                    <Button 
                      disabled
                      className="w-full"
                      size="lg"
                    >
                      🔒 Erst Code eingeben
                    </Button>
                  )}

                </CardContent>
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
                <CardContent className="min-h-[500px] relative">
                  <div 
                    className={`
                      p-4 rounded-lg border-2 border-dashed border-muted-foreground/30 min-h-[400px] relative overflow-hidden
                      ${testConfig.theme === 'dark' ? 'bg-gray-900' : testConfig.theme === 'blue' ? 'bg-blue-50' : testConfig.theme === 'green' ? 'bg-green-50' : 'bg-white'}
                    `}
                  >
                    <div className="text-center text-muted-foreground py-20">
                      <p className="mb-4">Ihre Website-Vorschau</p>
                      <p className="text-sm">Der Chatbot erscheint je nach Position unten rechts, links oder zentral.</p>
                      
                      {/* Simulierter Chatbot Button */}
                      <div 
                        className={`
                          fixed rounded-full w-16 h-16 flex items-center justify-center text-white font-bold text-xl shadow-lg cursor-pointer z-10
                          ${testConfig.position === 'bottom-right' ? 'bottom-4 right-4' : 
                            testConfig.position === 'bottom-left' ? 'bottom-4 left-4' : 
                            'bottom-4 left-1/2 transform -translate-x-1/2'}
                          ${testConfig.theme === 'blue' ? 'bg-blue-500 hover:bg-blue-600' : 
                            testConfig.theme === 'green' ? 'bg-green-500 hover:bg-green-600' : 
                            testConfig.theme === 'dark' ? 'bg-gray-700 hover:bg-gray-800' : 
                            'bg-primary hover:bg-primary/90'}
                        `}
                        onClick={() => isAuthorized && setIsChatOpen(true)}
                      >
                        💬
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Test Results */}
              <Card className="glass mt-6">
                <CardHeader>
                  <CardTitle>📊 Konfiguration im Überblick</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Theme:</span>
                      <p className="font-medium">{testConfig.theme}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Position:</span>
                      <p className="font-medium">{testConfig.position}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Sprachgeschwindigkeit:</span>
                      <p className="font-medium">{testConfig.voiceSpeed[0]}x</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Stimmlage:</span>
                      <p className="font-medium">{testConfig.voicePitch[0]}x</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-sm text-muted-foreground">Begrüßung:</span>
                    <p className="font-medium mt-1 p-2 bg-muted rounded text-sm">{testConfig.greeting}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
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